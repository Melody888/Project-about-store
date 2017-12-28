<template>
  <bm-layout>
    <header class="m_header" :class="{ 'inputting': keyword }" slot="header">
      <header class="sub-header" v-if="options.sub">
        <div class="sub-left">
          <button class="close" @click="$router.back()"></button>
        </div>
        <h2 class="sub-title">城市选择</h2>
      </header>
      <bm-header v-else>城市选择</bm-header>
      <form class="form" :class="{ actived }" @submit.prevent="doSearch">
        <i class="icon"></i>
        <input class="input" maxlength="100" type="text" placeholder="输入城市名称查询" v-model="keyword" @focus="actived = true">
        <button class="del" type="button" v-show="keyword" @click="keyword = ''"></button>
        <button class="submit" type="submit" v-show="actived && keyword">搜索</button>
        <button class="submit" type="button" v-show="actived && !keyword" @click="actived = false">取消</button>
      </form>
    </header>
    <section class="m_content">
      <div class="m_main" ref="refMain">
        <div class="m_loc" v-if="options.currCity && options.currCityCode">
          <h3 class="c_sub">你所在的地区</h3>
          <div class="c_btns">
            <button class="c_btn" @click="doChoose({ code: options.currCityCode, name: options.currCity })">{{ options.currCity }}</button>
          </div>
        </div>
        <div class="m_history" v-if="history.length">
          <h3 class="c_sub">历史访问</h3>
          <div class="c_btns">
            <button class="c_btn" @click="doChoose(item)" v-for="item of history">{{ item.name }}</button>
          </div>
        </div>
        <ul class="m_list">
          <li class="block" v-for="item of sortedList" :ref="`listRef_${item.firstLetter}`">
            <h3 class="c_sub sub">{{ item.firstLetter }}</h3>
            <ul class="list">
              <li v-for="city of item.list">
                <button class="item" @click="doChoose(city)"><span class="text">{{ city.name }}</span></button>
              </li>
            </ul>
          </li>
        </ul>
      </div>
      <aside class="m_index" @touchstart="doTouch" @touchmove="doTouch" ref="indexRef">
        <button class="index" v-for="item of sortedList" @click="goAssignedIndex(item.firstLetter)">{{ item.firstLetter }}</button>
      </aside>
      <aside class="m_res" v-show="actived">
        <ul v-show="keyword">
          <li v-for="city of res">
            <button class="item" @click="doChoose(city)"><span class="text">{{ city.name }}</span></button>
          </li>
        </ul>
        <p class="empty" v-if="keyword && !timer && !res.length">{{ listLoading ? '加载中' : '抱歉，未能找到相关位置' }}</p>
      </aside>
    </section>
  </bm-layout>
</template>

<script>
  import { sfa as Api } from '@/utils/baseRequest'

  const SELECT_CITY_LIST_CACHE_KEY = 'SELECT_CITY_LIST_CACHE'
  const SELECT_CITY_HISTORY_CACHE_KEY = 'SELECT_CITY_HISTORY_CACHE'
  const SELECT_CITY_HISTORY_SIZE = 5

  class City {
    constructor (config = {}) {
      this.code = config.code || ''
      this.name = config.name || ''
    }
  }
  class ListWithAlpha {
    constructor (config = {}) {
      this.firstLetter = config.firstLetter || ''
      this.list = config.list || []
    }
  }

  export default {
    data () {
      return {
        actived: false,
        keyword: '',
        history: [],
        list: [],
        listLoading: false,
        res: [],
        timer: null,
        resCache: null
      }
    },
    watch: {
      keyword (val, oldVal) {
        if (val) {
          if (!oldVal) {
            this.doSearch(true)
          } else {
            clearTimeout(this.timer)
            this.timer = setTimeout(() => {
              this.doSearch(true)
            }, 250)
          }
        } else {
          clearTimeout(this.timer)
          this.res.splice(0)
        }
      }
    },
    computed: {
      sortedList () {
        return this.list.slice().sort(function (a, b) {
          return (a.firstLetter > b.firstLetter) ? 1 : -1
        })
      },
      listWithoutFirstLetter () {
        let res = []
        for (let item of this.list || []) {
          res.push(...item['list'])
        }
        return res
      }
    },
    props: {
      'options': {
        // sub, currCity, currCityCode
        default: {
          'sub': false
        }
      }
    },
    methods: {
      callback () {
        return this.resCache
      },
      async getAllCities () {
        let cache = JSON.parse(simpleLocalDb.getItem(SELECT_CITY_LIST_CACHE_KEY) || '[]')
        if (cache.length) {
          this.list = cache
        } else {
          let { 'itemList': res } = await Api.post('/common/getCityDescByParams', {
            'keyword': ''
          }, {
            '_INDICATOR': true,
            '_NEED_CODE_0': true
          })
          this.list = []
          for (let item of res || []) {
            this.list.push(new ListWithAlpha({
              firstLetter: item['firstLetter'],
              list: (function () {
                let arr = []
                for (let city of item['cityList'] || []) {
                  arr.push(new City({
                    code: city['cityCode'],
                    name: city['cityDesc']
                  }))
                }
                return arr
              })()
            }))
          }
          simpleLocalDb.setItem(SELECT_CITY_LIST_CACHE_KEY, JSON.stringify(this.list.slice()))
        }
        return this.list
      },
      goAssignedIndex (firstLetter) {
        let targetDom = this.$refs[`listRef_${firstLetter}`] ? this.$refs[`listRef_${firstLetter}`][0] : null
        if (targetDom) this.$refs.refMain.scrollTop = targetDom.offsetTop
      },
      doTouch (ev) {
        let touch = ev.targetTouches[0]
        let { top, left, right, bottom } = this.$refs.indexRef.getBoundingClientRect()
        if (touch.clientX > left && touch.clientX < right) {
          if (touch.clientY > top && touch.clientY < bottom) {
            let target = document.elementFromPoint(touch.clientX, touch.clientY)
            target.click()
            ev.preventDefault()
          }
        }
      },
      async doSearch (hideIndicator) {
        clearTimeout(this.timer)
        this.timer = null
        // 搜索本地时可用，这个方法不用调接口
        // this.res = this.listWithoutFirstLetter.filter(v => {
        //   return v.name.indexOf(this.keyword) >= 0
        // })
        let cache = this.keyword
        this.listLoading = true
        let { 'itemList': res } = await Api.post('/common/getCityDescByParams', {
          'keyword': this.keyword
        }, {
          '_INDICATOR': !hideIndicator,
          '_NEED_CODE_0': true
        }).catch(function (err) {
          this.listLoading = false
          throw err
        }.bind(this))
        this.listLoading = false
        if (this.keyword === cache) {
          this.res = []
          for (let firstLetterList of res || []) {
            for (let city of firstLetterList['cityList']) {
              this.res.push(new City({
                code: city['cityCode'],
                name: city['cityDesc']
              }))
            }
          }
        }
      },
      doChoose (item) {
        this.resCache = item
        this.setHistory(item)
        this.$router.back()
      },
      getHistory () {
        this.history = JSON.parse(simpleLocalDb.getItem(SELECT_CITY_HISTORY_CACHE_KEY) || '[]')
      },
      setHistory (item) {
        let existedIndex = this.history.findIndex(function (v) { return v.code === item.code })
        if (existedIndex !== -1) this.history.splice(existedIndex, 1)
        this.history.unshift(item)
        this.history.splice(SELECT_CITY_HISTORY_SIZE)
        simpleLocalDb.setItem(SELECT_CITY_HISTORY_CACHE_KEY, JSON.stringify(this.history.slice()))
      }
    },
    created () {
      this.getHistory()
      this.getAllCities()
    }
  }
</script>

<style lang="less" scoped>
  @color1: #1FB8FF;
  @color2: #FFC924;
  @color3: #FF6C47;
  @color_b1: #D7D7D7;
  @color_b2: #E5E5E5;
  @color_t1: #333;
  @color_t2: #666;
  @color_t3: #999;

  @offset1: 0.1rem;
  @offset2: 0.15rem;
  @offset3: 0.2rem;

  @size0: 0.12rem;
  @size1: 0.13rem;
  @size2: 0.14rem;
  @size3: 0.15rem;

  input, button, textarea {
    border: none;
    background-color: transparent;
    color: inherit;
    font-size: inherit;
  }
  a {
    color: inherit;
    text-decoration: inherit;
  }

  .m_header {
    border-bottom: 1px solid @color_b1;
    &.actived {
      border-bottom-color: @color1;
    }
    &.inputting {
      border-bottom: none;
    }
    .sub-header {
      display: flex;
      width: 100%;
      height: 0.4rem;
      background-color: #fff;
      color: @color1;
      justify-content: center;
      align-items: center;
      position: relative;
    }
    .sub-left {
      position: absolute;
      left: 0;
      top: 50%;
      transform: translateY(-50%);
    }
    .close {
      height: 0.24rem;
      width: 0.24rem;
      background: url("~@/assets/common/close_blue@3x.png") center no-repeat;
      background-size: contain;
      margin-left: @offset1;
    }
    .sub-title {
      font-size: 0.18rem;
      font-weight: normal;
    }
    .form {
      margin: @offset1;
      border-bottom: 1px solid @color_t3;
      display: flex;
      align-items: center;
      height: 0.3rem;
      font-size: @size2;
      padding: 0 0.02rem;
    }
    .icon {
      background: url("~@/assets/common/search_gray@3x.png") center no-repeat;
      background-size: contain;
      width: 0.18rem;
      height: 0.18rem;
      margin: 0 @offset1 / 2;
    }
    .input {
      flex-grow: 1;
      height: 100%;
    }
    .del {
      height: 100%;
      width: 0.24rem;
      background: url("~@/assets/common/close_gray@3x.png") center no-repeat;
      background-size: contain;
    }
    .submit {
      height: 100%;
      color: @color1;
      margin-left: @offset1;
    }
    .actived {
      border-bottom-color: @color1;
    }
    .actived .icon {
      background-image: url("~@/assets/common/search_blue@3x.png");
    }
  }
  .m_content {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    overflow: hidden;
    .c_btns {
      display: flex;
      flex-wrap: wrap;
    }
    .c_btn {
      border: 1px solid @color_b1;
      border-radius: 2px;
      padding: @offset1 0;
      font-size: @size2;
      color: @color_t1;
      min-width: 0.6rem;
      margin-top: 0.08rem;
      margin-right: 0.12rem;
      &:active {
        color: #fff;
        border-color: @color3;
        background-color: @color3;
      }
    }
    .c_sub {
      display: block;
      font-weight: normal;
      font-size: @size0;
      color: @color_t3;
    }
    .m_main {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      overflow: hidden;
      overflow-y: auto;
      z-index: 1;
      -webkit-overflow-scrolling: initial;
      .m_loc {
        display: block;
        margin: @offset1;
      }
      .m_history {
        display: block;
        margin: @offset1;
      }
      .m_list {
        color: @color_t1;
        font-size: @size2;
        .block {
          display: block;
          margin: @offset1 0;
        }
        .sub {
          margin-left: @offset1;
          margin-bottom: 0.08rem;
        }
        .list {
          display: block;
          margin-top: 0.08rem;
        }
        .item {
          display: block;
          text-align: left;
          width: 100%;
          padding: 0 @offset1;
          &:active {
            background-color: #F8F8F8;
          }
        }
        .text {
          display: block;
          border-bottom: 1px solid @color_b2;
          padding: @offset1 0.04rem;
        }
      }
    }
    .m_index {
      position: absolute;
      right: 0;
      top: 50%;
      transform: translateY(-50%);
      display: flex;
      flex-direction: column;
      padding: 10px 0;
      z-index: 2;
      .index {
        width: 0.36rem;
        padding: 3px 0;
        font-size: @size0;
        color: @color_t3;
      }
    }
    .m_res {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      overflow: hidden;
      overflow-y: auto;
      background-color: #fff;
      color: @color_t1;
      font-size: @size2;
      z-index: 3;
      .item {
        display: block;
        text-align: left;
        width: 100%;
        padding: 0 @offset1;
        &:active {
          background-color: #F8F8F8;
        }
      }
      .text {
        display: block;
        border-bottom: 1px solid @color_b2;
        padding: @offset1 0.04rem;
      }
      .empty {
        font-size: @size2;
        color: @color_t3;
        text-align: center;
        margin-top: 0.64rem;
      }
    }
  }
</style>