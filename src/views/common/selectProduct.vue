<style lang="less" scoped>
  @size0: 0.12rem;
  @size1: 0.13rem;
  @size2: 0.14rem;
  @size3: 0.15rem;
  /* .search {
    height: .51rem;
    padding-left: .1rem;
    border-bottom: 1px solid #d7d7d7;
  } */
  .m_form {
    height: 0.5rem;
    display: flex;
    align-items: center;
    padding: 0 0.12rem;
    .scan {
      border: none;
      margin: 0;
      height: 100%;
      width: 0.22rem;
      background: url("~@/assets/common/scan_blue@3x.png") center no-repeat;
      background-size: contain;
    }
    .line {
      margin-left: 0.12rem;
      flex-grow: 1;
      border-bottom: 1px solid #1FB8FF;
      padding: 0.02rem;
      display: flex;
      align-items: center;
    }
    .speak {
      border: none;
      margin: 0;
      width: 0.24rem;
      height: 0.24rem;
      background: url("~@/assets/common/microphone@3x.png") center no-repeat;
      background-size: contain;
    }
    .input {
      margin-left: 0.02rem;
      font-size: 0.14rem;
      flex-grow: 1;
      border: none;
    }
    .submit {
      border: none;
      margin: 0;
      color: #1FB8FF;
      font-size: 0.14rem;
      flex-shrink: 0;
      padding: 0 0.04rem;
      height: 0.24rem;
    }
    .del {
      border: none;
      width: 0.24rem;
      height: 0.24rem;
      background: url("~@/assets/common/close_gray@3x.png") center no-repeat;
      background-size: contain;
      margin-left: 0.08rem;
    }
  }
  .m_content {
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
    .del {
      border: none;
      float: right;
      font-size: @size0;
      padding: 0.1rem;
      color: #1FB8FF;
    }
  }
  .disable-item {
    color: #999!important;
  }
  .history-text {
    font-size: 12px;
    color: #666666;
    padding: .1rem;
    padding-bottom: 0;
  }
  .product-item {
    display: flex;
    align-items: center;
    padding: .1rem;
    border-bottom: 1px solid #d7d7d7;
    &__info {
      font-size: .15rem;
      color: #333333;
      padding-left: .08rem;
      flex: auto;
    }
  }
  .submit-btn {
    background: #FF6C47;
    width: 100%;
    height: .48rem;
    line-height: .48rem;
    text-align: center;
    color: #fff;
    font-size: .17rem;
    letter-spacing: 1px;
  }
</style>

<template>
  <bm-layout>
    <div slot="header">
      <bm-header>添加产品</bm-header>
      <!-- <div class="search flex items-center">
        <bm-search
          placeholder="输入商品编码/名称"
          class="flex-auto"
          v-model="keyword"
          @doSubmit="doSubmit"></bm-search>
      </div> -->
      <form class="m_form" @submit.prevent="doSubmit">
        <button class="scan" type="button" @click="doScan"></button>
        <div class="line">
          <button class="speak" type="button" @click="doSpeak"></button>
          <input class="input" maxlength="100" v-model="keyword" type="text" placeholder="输入商品编码/名称">
          <button class="del" type="button" v-show="keyword" @click="keyword = ''"></button>
          <button class="submit" type="submit">搜索</button>
        </div>
      </form>
    </div>
    <div class="m_content">
      <div v-if="!loaded && history.length">
        <div class="history-text">搜索历史</div>
        <div>
          <div class="product-item" v-for="item in history">
            <input :id="'prd' + item.prdId" :disabled="disabled(item)" :value="item.customerPrd" v-model="selectedVal" type="checkbox" class="bm-check flex-none">
            <label :for="'prd' + item.prdId" class="product-item__info" :class="{'disable-item': disabled(item)}">{{ item.prdName }}</label>
          </div>
        </div>
        <button class="del" @click="doDelHistory">清空历史</button>
      </div>
      <div v-if="loaded">
        <div class="product-item" v-for="item in list">
          <input :id="'prd' + item.prdId" :disabled="disabled(item)" :value="item.customerPrd" v-model="selectedVal" type="checkbox" class="bm-check flex-none">
          <label :for="'prd' + item.prdId" class="product-item__info" :class="{'disable-item': disabled(item)}">{{ item.prdName }}</label>
        </div>
      </div>
      <div v-if="loaded && !loading && !list.length" class="nothing">没有符合条件的结果</div>
    </div>
    <div slot="footer" class="submit-btn" @click="selectVal">确定</div>
  </bm-layout>
</template>

<script>
  import { sfa as Api } from '@/utils/baseRequest'
  import {
    scan as NativeScan,
    speechRecognition as NativeGetVoice
  } from '@/utils/native'
  const historyKey = 'PRODUCT_HISTORY'
  const HISTORY_LEN = 5
  const ERROR_REFER = {
    'ERR_NORESULT': 27003
  }

  export default {
    props: {
      options: Object
    },
    data () {
      return {
        selectedVal: [],
        timer: null,
        keyword: '',
        list: [],
        history: [],
        loading: false,
        loaded: false,
        selected: false,
        totalList: [] // 搜索不同关键字时有选中的情况下，需要有一个表记录所有搜索结果
      }
    },
    watch: {
      keyword (val) {
        // clearTimeout(this.timer)
        if (val) {
        //   this.timer = setTimeout(() => {
        //     this.fetchList()
        //   }, 250)
        } else {
          this.list.splice(0)
          this.loaded = false
        }
      }
    },
    computed: {
      disabledList () {
        if (!this.options) return []
        return this.options.disabledList || []
      }
    },
    methods: {
      doSpeak () {
        NativeGetVoice({
          'callback': async config => {
            this.keyword = JSON.parse(config)['content']
            return await this.doSubmit()
          }
        })
      },
      doScan () {
        NativeScan({
          'callback': async function (config) {
            this.keyword = JSON.parse(config)['data']
            return await this.doSubmit(true, false).catch(function (err) {
              if (err === ERROR_REFER.ERR_NORESULT) {
                this.$toast('该产品不是我司产品哦！')
              }
              throw err
            }.bind(this))
          }.bind(this)
        })
      },
      disabled (item) {
        return this.disabledList.indexOf(item.customerPrd) > -1
      },
      async doSubmit (indicator = true, errToast = true) {
        clearTimeout(this.timer)
        return await this.fetchList(!!indicator, !!errToast)
      },
      callback () {
        const totalList = this.totalList
        return this.selectedVal.reduce((pres, curr) => {
          const prd = totalList.find(item => {
            return item.customerPrd === curr
          })
          if (prd) {
            pres.push(prd)
          }
          return pres
        }, [])
      },
      selectVal () {
        this.updateHistory(this.selectedVal)
        this.selected = true
        window.history.go(-1)
      },
      // 旧接口
      // fetchList (indicator = false) {
      //   this.loading = true
      //   const options = this.options || {}
      //   return Api.post('/plan/getPrdInfoByIdOrName', {
      //     'pageFlag': options.pageFlag,
      //     'planDate': options.planDate,
      //     'storeId': options.storeId,
      //     'prdIdOrName': this.keyword
      //   }, {
      //     '_INDICATOR': indicator,
      //     '_NEED_CODE_0': true
      //   }).then(result => {
      //     if (result.responseCode === 0) {
      //       const list = result.itemList
      //       this.list = list
      //       this.totalList = this.totalList.concat(list)
      //       this.loading = false
      //     } else {
      //       this.loading = false
      //     }
      //     this.loaded = true
      //   })
      // },
      async fetchList (indicator = true, errToast = true) {
        this.loading = true
        let { 'itemList': res } = await Api.post('/common/getPrdListByParams', {
          'keyword': this.keyword,
          'token': simpleLocalDb.getItem('token')
        }, {
          '_NEED_CODE_0': !!errToast,
          '_INDICATOR': !!indicator
        }).then(function (res) {
          if (!errToast && res['responseCode'] !== 0) {
            if (res['responseCode'] === ERROR_REFER.ERR_NORESULT) throw res['responseCode']
          }
          return res
        }).catch(function (err) {
          this.loading = false
          throw err
        }.bind(this))
        this.loading = false
        this.loaded = true
        this.list = res
        this.totalList = this.totalList.concat(res)
      },
      updateHistory (items) {
        const history = this.callback().concat(this.history).reduce((pres, curr) => {
          const index = pres.findIndex(item => {
            return item.customerPrd === curr.customerPrd
          })
          if (index === -1) {
            pres.push(curr)
          }
          return pres
        }, [])
        simpleLocalDb.setItem(historyKey, history.slice(0, HISTORY_LEN))
      },
      doDelHistory () {
        this.history = []
        simpleLocalDb.setItem(historyKey, [])
      }
    },
    mounted () {
      const history = simpleLocalDb.getItem(historyKey)
      if (history && history.length) {
        this.history = history.slice(0, HISTORY_LEN)
        this.totalList = this.totalList.concat(history)
      }
    }
  }
</script>
