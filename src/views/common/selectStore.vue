<template>
  <bm-layout>
    <header class="m_header" slot="header">
      <bm-header>
        <p>选择门店</p>
        <button class="near" slot="right" @click="nearbyToggled = !nearbyToggled"><span class="text">附近门店</span></button>
      </bm-header>
    </header>
    <section class="m_content">
      <div class="m_main">
        <form class="m_search" @submit.prevent="doClickBeforeSearch">
          <button class="loc" type="button" @click="doSelectCity">{{ city || currCity || '定位中' }}</button>
          <div class="label" :class="{ actived }">
            <i class="icon"></i>
            <input class="input" @focus="doFocusInput" v-model="keyword" type="text" placeholder="输入门店编码/名称" maxlength="100">
            <button class="del" type="button" v-show="keyword" @click="keyword = ''"></button>
            <button class="submit" v-show="actived && keyword" type="submit">搜索</button>
            <button class="submit" v-show="actived && !keyword" @click="doSearchCancel" type="button">取消</button>
          </div>
          <button class="speak" v-show="!actived" type="button" @click="doGetVoice"></button>
        </form>
        <div class="m_res">
          <div class="previews" v-show="!actived" v-infinite-scroll="getMineList" infinite-scroll-disabled="mineScrollDisabled">
            <div class="block" v-if="history.length">
              <h3 class="sub">搜索历史</h3>
              <ul>
                <li v-for="item of history">
                  <button class="item" @click="doChoose(item)">
                    <span class="store">{{ item.code }} {{ item.name }}</span>
                    <span class="addr">地址：{{ item.addr }}</span>
                  </button>
                </li>
              </ul>
              <button class="del" @click="setEmptyHistory">清空历史</button>
            </div>
            <div class="block" v-if="mine.length">
              <h3 class="sub">我的门店</h3>
              <ul>
                <li v-for="item of mine">
                  <button class="item" @click="doChoose(item)">
                    <span class="store">{{ item.code }} {{ item.name }}</span>
                    <span class="addr">地址：{{ item.addr }}</span>
                  </button>
                </li>
              </ul>
            </div>
          </div>
          <div class="res" v-show="actived" v-infinite-scroll="doScrollRes" infinite-scroll-disabled="resScrollDisabled" infinite-scroll-distance="100">
            <ul>
              <li v-for="item of res">
                <button class="item" @click="doChoose(item)">
                  <span class="store">{{ item.code }} {{ item.name }}</span>
                  <span class="addr">地址：{{ item.addr }}</span>
                </button>
              </li>
            </ul>
          </div>
          <div class="nothing" v-if="!res.length && resNoMore">没有符合条件的结果</div>
          <aside class="advices" v-show="actived && keyword.length && advices.length && !advicesHidden">
            <ul>
              <li v-for="advice of advices">
                <button class="advice" @click="doSelectAdvice(advice)">{{ advice }}</button>
              </li>
            </ul>
          </aside>
        </div>
      </div>
      <transition>
        <aside class="m_near" v-show="nearbyToggled">
          <div class="shadow" @click="nearbyToggled = false"></div>
          <div class="list">
            <div class="near">
              <i class="near-icon"></i>
              <p class="near-addr"><i></i>{{ addr || '定位中' }}</p>
              <button class="refresh" @click="getNativeLoc" :disabled="locRefreshing"></button>
            </div>
            <!-- <p class="nomore" v-if="nearbyNoMore && !nearby.length">附近暂无门店</p> -->
            <p class="nomore" v-if="!nearbyLoading && !nearby.length">附近暂无门店</p>
            <!-- <div class="items" v-else v-infinite-scroll="getNearList.bind(null, true)" infinite-scroll-disabled="nearbyScrollDisabled"> -->
            <div class="items">
              <ul>
                <li v-for="item of nearby">
                  <button class="item" @click="doChoose(item)">
                    <span class="head">
                      <span class="store">{{ item.code }} {{ item.name }}</span>
                      <span class="dist">{{ item.dist }}km</span>
                    </span>
                    <span class="addr">地址：{{ item.addr }}</span>
                  </button>
                </li>
              </ul>
            </div>
          </div>
        </aside>
      </transition>
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
      this.dist = config.dist || null
    }
  }

  const SELECT_STORE_HISTORY_CACHE_KEY = 'SELECT_STORE_CACHE'
  const SELECT_STORE_HISTORY_CACHE_LENGTH = 5
  const SELECT_STORE_GET_ADVICES_TIME_OFFSET = 250

  export default {
    data () {
      return {
        nearbyToggled: false,
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
        mine: [],
        mineLoading: false,
        mineNoMore: false,
        mineDate: null,
        minePageIndex: null,
        nearby: [],
        nearbyLoading: false,
        nearbyNoMore: false,
        advicesTimer: null,
        advices: [],
        res: [],
        resLoading: false,
        resNoMore: false,
        resPageIndex: null,
        resKeywordCache: '',
        resCityCodeCache: '',
        finResCache: null
      }
    },
    watch: {
      keyword (v) {
        // 删除关键字到空的情况
        if (v && !this.advicesHidden) {
          clearTimeout(this.advicesTimer)
          this.advicesTimer = setTimeout(() => {
            this.getAdvices()
          }, SELECT_STORE_GET_ADVICES_TIME_OFFSET)
        }
      }
    },
    computed: {
      resScrollDisabled () {
        return !(this.actived && this.res.length && !this.resLoading && !this.resNoMore)
      },
      mineScrollDisabled () {
        return !(!this.actived && this.mine.length && !this.mineLoading && !this.mineNoMore)
      },
      nearbyScrollDisabled () {
        return !(this.nearbyToggled && this.nearby.length && !this.nearbyLoading && !this.nearbyNoMore)
      }
    },
    methods: {
      callback () {
        return this.finResCache
      },
      async getAdvices () {
        let keywordCache = this.keyword
        let { 'storeNameList': advices = [] } = await Api.post('/common/getDirectStoreByCityCode', {
          'cityCode': this.cityCode || this.currCityCode || '',
          'token': simpleLocalDb.getItem('token'),
          'keyword': keywordCache
        })
        if (this.keyword === keywordCache) {
          this.advices = []
          this.advices.push(...advices)
          return this.advices
        }
      },
      getNativeLoc () {
        this.locRefreshing = true
        NativeGetLoc(async (config) => {
          config = JSON.parse(config || '{}')
          this.locRefreshing = false
          if (config['isSuccess']) {
            this.lat = config['gpsLatitude']
            this.lng = config['gpsLongitude']
            this.addr = config['gpsAddress']
            return await this.getNearList()
          } else {
            this.$toast('获取定位失败')
          }
        })
      },
      getHistory () {
        let cache = simpleLocalDb.getItem(SELECT_STORE_HISTORY_CACHE_KEY)
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
        this.history.splice(SELECT_STORE_HISTORY_CACHE_LENGTH)
        simpleLocalDb.setItem(SELECT_STORE_HISTORY_CACHE_KEY, JSON.stringify(this.history))
      },
      setEmptyHistory (item) {
        this.history.splice(0)
        simpleLocalDb.setItem(SELECT_STORE_HISTORY_CACHE_KEY, JSON.stringify(this.history))
      },
      getMineList: (function () {
        const PAGE_SIZE = 10
        return async function (refreshing = false) {
          if (!this.mineLoading) {
            if (this.mineNoMore && !refreshing) return
            let now = Date.now()
            this.mineLoading = true
            let { 'itemList': res } = await Api.post('/myStore/getAllStoreListByUserId', {
              'keyWork': '',
              'pageFlag': 'mystore',
              'planDate': refreshing ? now : this.mineDate || now,
              'token': simpleLocalDb.getItem('token'),
              'pageSize': PAGE_SIZE,
              'pageIndex': refreshing ? 0 : +this.minePageIndex
            }, {
              '_INDICATOR': true,
              '_NEED_CODE_0': true
            }).catch(err => {
              this.mineLoading = false
              throw err
            })
            if (refreshing) {
              this.minePageIndex = 0
              this.mineDate = now
            }
            for (let item of res) {
              this.mine.push(new Item({
                code: item['storeId'],
                name: item['storeName'],
                addr: item['address']
              }))
            }
            if (res && res.length >= PAGE_SIZE) {
              ++this.minePageIndex
            } else {
              this.mineNoMore = true
            }
            this.mineLoading = false
            return this.mine
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
          'callback': async function (config) {
            config = JSON.parse(config)
            let content = config['content']
            if (content) {
              this.actived = true
              this.keyword = content
              this.doClickBeforeSearch()
            }
          }.bind(this)
        })
      },
      doFocusInput () {
        this.actived = true
        this.advicesHidden = false
        if (this.keyword) {
          this.advices.splice(0)
          this.getAdvices()
        }
      },
      doSelectAdvice (advice) {
        this.advicesHidden = true
        this.keyword = advice
        this.doSearch()
      },
      async doClickBeforeSearch () {
        this.advicesHidden = true
        this.res = []
        this.resNoMore = false
        return await this.doSearch()
      },
      async doScrollRes () {
        return await this.doSearch(true)
      },
      doSearch: (function () {
        const PAGE_SIZE = 10
        return async function (loadingMore) {
          if (!this.resLoading) {
            if (typeof loadingMore !== 'boolean') loadingMore = false
            if (this.resNoMore && loadingMore) return
            this.resLoading = true
            let cityCode = this.cityCode || this.currCityCode
            let { 'storeList': res } = await Api.post('/common/getStoreListByParams', {
              'cityCode': loadingMore ? this.resCityCodeCache : cityCode,
              'token': simpleLocalDb.getItem('token'),
              'pageSize': PAGE_SIZE,
              'pageIndex': loadingMore ? +this.resPageIndex : 0,
              'keyword': loadingMore ? this.resKeywordCache : this.keyword
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
              this.resPageIndex = 0
              this.resCityCodeCache = cityCode
              this.resKeywordCache = this.keyword
            }
            for (let item of res) {
              this.res.push(new Item({
                code: item['storeId'],
                name: item['storeName'],
                addr: item['address']
              }))
            }
            if (res && res.length >= PAGE_SIZE) {
              ++this.resPageIndex
            } else {
              this.resNoMore = true
            }
            this.resLoading = false
            return this.res
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
          'address': item.addr,
          'storeId': item.code,
          'storeName': item.name
        }
        this.$router.back()
      },
      getNearList: (function () {
        // const PAGE_SIZE = 10
        // let pageIndex = 0
        return async function (loadingMore) {
          if (!this.nearbyLoading) {
            if (typeof loadingMore !== 'boolean') loadingMore = false
            if (this.nearbyNoMore && loadingMore) return
            this.nearbyLoading = true
            let { 'storeList': res, 'currentCity': city = {} } = await Api.post('/common/getnNearbyStoreListByParams', {
              'token': simpleLocalDb.getItem('token'),
              'gpsLatitude': this.lat,
              'gpsLongitude': this.lng
            }, {
              '_INDICATOR': true,
              '_NEED_CODE_0': true
            }).catch(err => {
              this.nearbyLoading = false
              throw err
            })
            if (!loadingMore) {
              // pageIndex = 0
              this.nearbyNoMore = false
              this.nearby = []
            }
            for (let item of res) {
              this.nearby.push(new Item({
                code: item['storeId'],
                name: item['storeName'],
                addr: item['address'],
                dist: item['distance']
              }))
            }
            this.currCity = city['cityDesc'] || ''
            this.currCityCode = city['cityCode'] || ''
            // 不用分页
            // if (res && res.length >= PAGE_SIZE) {
            //   ++pageIndex
            // } else {
            //   this.nearbyNoMore = true
            // }
            this.nearbyLoading = false
            return this.nearby
          }
        }
      })()
    },
    created () {
      this.getNativeLoc()
      this.getHistory()
      this.getMineList(true)
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
    .near {
      padding-right: @offset1;
      color: #fff;
      font-size: @size2;
      /* 因为BMLAYOUT的某些原因，下面这一句是防止5s长度溢出 */
      flex-shrink: 0;
    }
    .text {
      display: inline-block;
      padding-bottom: 2px;
      border-bottom: 2px solid #fff;
      background: url("~@/assets/common/address_white@3x.png") left no-repeat;
      background-size: contain;
      padding-left: 0.25rem;
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
  }
  .m_main {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    overflow: hidden;
    display: flex;
    flex-direction: column;
  }
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
    .icon {
      width: 0.18rem;
      height: 0.18rem;
      flex-shrink: 0;
      background: url("~@/assets/common/search_gray@3x.png") left no-repeat;
      background-size: contain;
    }
    .actived .icon {
      background-image: url("~@/assets/common/search_blue@3x.png");
    }
    .input {
      height: 100%;
      flex-grow: 1;
      min-width: 0;
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
      margin: @offset1 @offset1 (@offset1 / 2) @offset1;
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
    .store {
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
  .m_near {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    overflow: visible;
    &.v-enter-active, &.v-leave-active {
      transition: all 0.2s;
    }
    &.v-enter, &.v-leave-active {
      opacity: 0;
      transform: translateX(100%);
    }
    .shadow {
      position: absolute;
      top: 0;
      left: -100%;
      right: 0;
      bottom: 0;
      /* display: block; */
      /* width: 200%; */
      /* height: 100%; */
      /* margin-left: -100%; */
      background-color: fade(#000, 40);
    }
    .list {
      position: absolute;
      top: 0;
      right: 0;
      width: 2.6rem;
      max-width: 100%;
      height: 100%;
      background-color: #fff;
      display: flex;
      flex-direction: column;
    }
    .list.v-enter-active, .list.v-leave-active {
      transition: transform 0.2s;
    }
    .list.v-enter, .list.v-leave-active {
      transform: translateX(100%);
    }
    .near {
      flex-shrink: 0;
      display: flex;
      align-items: center;
      height: 0.5rem;
      background-color: #F8F8F8;
      color: @color_t1;
      font-size: @size2;
      padding: @offset1;
    }
    .near-icon {
      flex-shrink: 0;
      width: 0.24rem;
      height: 0.24rem;
      background: url("~@/assets/common/address_gray@3x.png") center no-repeat;
      background-size: contain;
    }
    .near-addr {
      flex-grow: 1;
      white-space: nowrap;
      text-overflow: ellipsis;
      overflow: hidden;
    }
    .refresh {
      margin-left: @offset1;
      width: 0.17rem;
      height: 100%;
      flex-shrink: 0;
      background: url("~@/assets/common/refresh_gray@3x.png") center no-repeat;
      background-size: contain;
    }
    .nomore {
      font-size: @size2;
      color: @color_t3;
      text-align: center;
      margin-top: 0.64rem;
    }
    .items {
      flex-grow: 1;
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
    .head {
      display: flex;
      align-items: baseline;
    }
    .store {
      display: block;
      flex-grow: 1;
      font-size: @size3;
    }
    .dist {
      flex-shrink: 0;
      font-size: @size2;
      color: @color3;
    }
    .addr {
      display: block;
      font-size: @size0;
      color: @color_t3;
      margin-top: @offset1;
    }
  }
</style>