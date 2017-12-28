<template>
  <bm-layout>
    <bm-header class="m_header" slot="header">选择办公点</bm-header>
    <section class="m_content">
      <div class="m_main">
        <form class="m_search" @submit.prevent="doClickBeforeSearch">
          <button class="loc" type="button" @click="doSelectCity">{{ city || currCity || '定位中' }}</button>
          <div class="label" :class="{ actived }">
            <input class="input" @focus="doFocusInput" v-model="keyword" type="text" placeholder="输入办公点编码/名称">
            <button class="del" type="button" v-show="keyword" @click="keyword = ''"></button>
            <button class="submit" v-show="actived && keyword" type="submit">搜索</button>
            <button class="submit" v-show="actived && !keyword" @click="doSearchCancel" type="button">取消</button>
          </div>
          <button class="speak" v-show="!actived" type="button" @click="doGetVoice"></button>
        </form>
        <div class="m_res">
          <div class="previews" v-show="!actived" v-infinite-scroll="getMainOffice.bind(null, true)" infinite-scroll-disabled="mainScrollDisabled">
            <template v-if="main.length">
              <h3 class="sub">主要办公点</h3>
              <div class="c_button">
                <button class="c_button-item" v-for="item of main" @click="doChoose(item)">{{ item.name }}</button>
              </div>
            </template>
            <template v-if="history.length">
              <h3 class="sub">历史搜索</h3>
              <div class="c_button">
                <button class="c_button-item" v-for="item of history" @click="doChoose(item)">{{ item.name }}</button>
              </div>
            </template>
          </div>
          <div class="res" v-show="actived" v-infinite-scroll="doSearch.bind(null, true)" infinite-scroll-disabled="resScrollDisabled" infinite-scroll-distance="100">
            <ul>
              <li v-for="item of res">
                <button class="item" @click="doChoose(item)">
                  <span class="office">{{ item.code }} {{ item.name }}</span>
                  <span class="addr">地址：{{ item.addr }}</span>
                </button>
              </li>
            </ul>
          </div>
          <div class="nothing" v-if="!res.length && resNoMore">没有符合条件的结果</div>
        </div>
      </div>
    </section>
  </bm-layout>
</template>

<script>
  import BmSelectPage from '@/components/plugins/BmSelectPage'
  import SelectCity from '@/views/common/selectCity'
  import {
    getLocation as NativeGetLoc,
    speechRecognition as NativeGetVoice
  } from '@/utils/native'
  import { sfa as Api } from '@/utils/baseRequest'

  class Item {
    constructor (config = {}) {
      this.code = config.code || ''
      this.name = config.name || ''
      this.addr = config.addr || ''
    }
  }

  const SELECT_OFFICE_HISTORY_CACHE_KEY = 'SELECT_OFFICE_CACHE'
  const SELECT_OFFICE_HISTORY_CACHE_LENGTH = 3

  export default {
    data () {
      return {
        actived: false,
        advicesHidden: false,
        locRefreshing: false,
        lat: '',
        lng: '',
        keyword: '',
        city: '',
        cityCode: '',
        currCity: '',
        currCityCode: '',
        addr: '',
        history: [],
        advicesTimer: null,
        advices: [],
        res: [],
        resLoading: false,
        resNoMore: false,
        main: [],
        mainLoading: false,
        mainNoMore: false,
        finResCache: null
      }
    },
    computed: {
      mainScrollDisabled () {
        return !(!this.actived && this.main.length && !this.mainLoading && !this.mainNoMore)
      },
      resScrollDisabled () {
        return !(this.actived && this.res.length && !this.resLoading && !this.resNoMore)
      }
    },
    methods: {
      callback () {
        return this.finResCache
      },
      getGPSAndDoSomething () {
        this.locRefreshing = true
        NativeGetLoc(async (config) => {
          config = JSON.parse(config || '{}')
          this.locRefreshing = false
          if (config['isSuccess']) {
            this.lat = config['gpsLatitude']
            this.lng = config['gpsLongitude']
            this.addr = config['gpsAddress']
            await this.getCityByLoc()
            return config
          } else {
            this.$toast('获取定位失败')
          }
        })
      },
      async getCityByLoc () {
        let { 'currentCity': city = {} } = await Api.post('/common/getnNearbyStoreListByParams', {
          'token': simpleLocalDb.getItem('token'),
          'gpsLatitude': this.lat,
          'gpsLongitude': this.lng
        }, {
          '_INDICATOR': true,
          '_NEED_CODE_0': true
        })
        this.currCity = city['cityDesc'] || ''
        this.currCityCode = city['cityCode'] || ''
        return city
      },
      getHistory () {
        let cache = simpleLocalDb.getItem(SELECT_OFFICE_HISTORY_CACHE_KEY)
        cache = cache ? JSON.parse(cache) : []
        for (let item of cache) {
          let historyItem = new Item(item)
          if (historyItem.code) this.history.push(historyItem)
        }
        return this.history
      },
      setNewHistory (item) {
        let sameIndex = this.history.findIndex(function (historyItem, index) {
          return historyItem.code === item.code
        })
        if (sameIndex !== -1) {
          // 有重复项
          this.history.splice(sameIndex, 1)
        }
        this.history.unshift(item)
        this.history.splice(SELECT_OFFICE_HISTORY_CACHE_LENGTH)
        simpleLocalDb.setItem(SELECT_OFFICE_HISTORY_CACHE_KEY, JSON.stringify(this.history))
      },
      getMainOffice: (function () {
        const PAGE_SIZE = 10
        let pageIndex = 0
        return async function (loadingMore) {
          if (!this.mainLoading) {
            if (typeof loadingMore !== 'boolean') loadingMore = false
            if (this.mainNoMore && loadingMore) return
            this.mainLoading = true
            let { 'storeList': res } = await Api.post('/plan/getWorkPointList', {
              'cityCode': '',
              'isPoint': 'yes',
              'keyword': '',
              'pageIndex': loadingMore ? pageIndex : 0,
              'pageSize': PAGE_SIZE,
              'token': simpleLocalDb.getItem('token')
            }, {
              '_INDICATOR': true,
              '_NEED_CODE_0': true
            }).catch(err => {
              this.mainLoading = false
              throw err
            })
            if (!loadingMore) {
              this.main = []
              this.mainNoMore = false
              pageIndex = 0
            }
            for (let item of res) {
              this.main.push(new Item({
                code: item['storeId'],
                name: item['storeName'],
                addr: item['address']
              }))
            }
            if (res && res.length >= PAGE_SIZE) {
              ++pageIndex
            } else {
              this.mainNoMore = true
            }
            this.mainLoading = false
            return this.main.slice()
          }
        }
      })(),
      async doSelectCity () {
        this.advicesHidden = true
        let options = { 'sub': true }
        if (this.currCity && this.currCityCode) {
          options.currCity = this.currCity
          options.currCityCode = this.currCityCode
        }
        let res = await BmSelectPage({ component: SelectCity, options })
        this.cityCode = res['code']
        this.city = res['name']
      },
      doGetVoice () {
        NativeGetVoice({
          'callback': async config => {
            let content = JSON.parse(config)['content']
            this.actived = true
            this.keyword = content
            this.doClickBeforeSearch()
          }
        })
      },
      doFocusInput () {
        this.actived = true
        this.advicesHidden = false
        if (this.keyword) {
          this.advices.splice(0)
        }
      },
      async doClickBeforeSearch () {
        this.advicesHidden = true
        this.res = []
        this.resNoMore = false
        return await this.doSearch()
      },
      doSearch: (function () {
        const PAGE_SIZE = 10
        let pageIndex = 0
        let keywordCache = ''
        let cityCodeCache = ''
        return async function (loadingMore) {
          if (!this.resLoading) {
            if (typeof loadingMore !== 'boolean') loadingMore = false
            if (this.resNoMore && loadingMore) return
            this.resLoading = true
            let cityCode = this.cityCode || this.currCityCode
            let { 'storeList': res } = await Api.post('/plan/getWorkPointList', {
              'cityCode': loadingMore ? cityCodeCache : cityCode,
              'isPoint': 'no',
              'keyword': loadingMore ? keywordCache : this.keyword,
              'pageIndex': loadingMore ? pageIndex : 0,
              'pageSize': PAGE_SIZE,
              'token': simpleLocalDb.getItem('token')
            }, {
              '_INDICATOR': true,
              '_NEED_CODE_0': true
            }).catch(err => {
              this.resLoading = false
              throw err
            })
            if (!loadingMore) {
              this.res = []
              this.resNoMore = false
              pageIndex = 0
              cityCodeCache = cityCode
              keywordCache = this.keyword
            }
            for (let item of res) {
              this.res.push(new Item({
                code: item['storeId'],
                name: item['storeName'],
                addr: item['address']
              }))
            }
            if (res && res.length >= PAGE_SIZE) {
              ++pageIndex
            } else {
              this.resNoMore = true
            }
            this.resLoading = false
            return this.res.slice()
          }
        }
      })(),
      doSearchCancel () {
        this.actived = false
        this.res = []
        this.resLoading = false
        this.resNoMore = false
      },
      doChoose (item) {
        this.setNewHistory(item)
        this.finResCache = {
          'name': item.name,
          'code': item.code,
          'addr': item.addr
        }
        this.$router.back()
      }
    },
    created () {
      this.getGPSAndDoSomething()
      this.getMainOffice()
      this.getHistory()
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

  @offset0: 0.05rem;
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

  .c_button {
    display: flex;
    flex-wrap: wrap;

    &-item {
      font-size: @size2;
      color: @color_t2;
      display: block;
      border: 1px solid @color_b1;
      border-radius: 4px;
      width: 30%;
      padding: @offset0 @offset1;
      margin: @offset3 / 2 1.65%;
    }
  }

  .m_header {
    .near {
      color: #fff;
      font-size: @size2;
      padding-bottom: 2px;
      margin-right: @offset1;
      border-bottom: 2px solid #fff;
      background: url("~@/assets/common/address_white@3x.png") left no-repeat;
      background-size: contain;
      padding: 2px 0 2px 0.25rem;
      white-space: nowrap;
    }
  }
  .m_content {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    overflow: hidden;
    .m_main {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      overflow: hidden;
      display: flex;
      flex-direction: column;
      .m_search {
        flex-shrink: 0;
        display: flex;
        height: 0.5rem;
        align-items: center;
        padding: 0 @offset1;
        font-size: @size2;
        color: @color_t1;
        .loc {
          height: 0.24rem;
          min-width: 4em;
          background: url("~@/assets/common/arrow_down@3x.png") right no-repeat;
          background-size: contain;
          padding-right: 0.24rem;
          overflow: hidden;
          white-space: nowrap;
          text-overflow: ellipsis;
        }
        .label {
          flex-grow: 1;
          height: 0.3rem;
          margin-left: @offset1;
          border-bottom: 1px solid @color_t3;
          display: flex;
          align-items: center;
          padding: 0 0.04rem;
          overflow: hidden;
        }
        .actived {
          border-bottom-color: @color1;
        }
        .input {
          background: url("~@/assets/common/search_gray@3x.png") left no-repeat;
          background-size: 0.25rem;
          padding-left: 0.25rem;
          height: 100%;
          flex-grow: 1;
          min-width: 0;
        }
        .actived .input {
          background-image: url("~@/assets/common/search_blue@3x.png");
        }
        .del {
          width: 0.24rem;
          height: 0.24rem;
          background: url("~@/assets/common/close_gray@3x.png") center no-repeat;
          background-size: contain;
          margin-left: 0.08rem;
        }
        .submit {
          height: 100%;
          color: @color1;
          margin-left: 0.08rem;
          flex-shrink: 0;
        }
        .speak {
          width: 0.24rem;
          height: 0.24rem;
          background: url("~@/assets/common/microphone@3x.png") center no-repeat;
          background-size: contain;
          margin-left: @offset1;
        }
      }
      .m_res {
        flex-grow: 1;
        overflow: hidden;
        overflow-y: auto;
        position: relative;
        .previews {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          overflow: hidden;
          overflow-y: auto;
        }
        .block {
          border-top: 1px solid @color_b1;
          &:first-of-type {
            border-top: none;
          }
          &:after {
            content: "";
            display: block;
            clear: both;
          }
        }
        .sub {
          margin: @offset1 @offset1 0 @offset1;
          color: @color_t3;
          font-size: @size0;
          font-weight: normal;
        }
        .res {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          overflow: hidden;
          overflow-y: auto;
        }
        .item {
          display: block;
          width: 100%;
          text-align: left;
          padding: @offset1;
          color: @color_t1;
          &:active {
            background-color: #F8F8F8;
          }
        }
        .office {
          display: block;
          font-size: @size3;
        }
        .addr {
          display: block;
          font-size: @size0;
          color: @color_t3;
          margin-top: @offset1;
        }
        .del {
          padding: @offset1;
          float: right;
          color: @color1;
          font-size: @size0;
        }
        .advices {
          position: absolute;
          top: 0;
          left: 0.15rem;
          right: 0.15rem;
          max-height: 100%;
          overflow: hidden;
          overflow-y: auto;
          border: 1px solid @color_b1;
          border-radius: 4px;
          background-color: #fff;
        }
        .advice {
          text-align: left;
          display: block;
          width: 100%;
          white-space: nowrap;
          text-overflow: ellipsis;
          height: 0.5rem;
          padding: 0 @offset1;
          overflow: hidden;
        }
        .nothing {
          position: absolute;
          left: 0;
          width: 100%;
          top: 50%;
          transform: translateY(-50%);
          background: url("~@/assets/common/noResult@3x.png") bottom no-repeat;
          background-size: 1.45rem;
          padding-bottom: 1.75rem;
          text-align: center;
          font-size: @size3;
          color: #C2C2C2;
        }
      }
    }
  }
</style>