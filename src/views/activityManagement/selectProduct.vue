<style lang="less" scoped>
  .search {
    height: .51rem;
    padding-left: .1rem;
    border-bottom: 1px solid #d7d7d7;
  }
  .disable-item {
    color: #999!important;
  }
  .history-text {
    line-height: 1.1em;
    font-size: 12px;
    color: #666666;
    padding: .1rem;
    padding-bottom: 0;
    .del {
      padding-left: .16rem;
      background: url('~@/assets/common/dustbin.png') no-repeat left center / auto 100%;
    }
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
      <div class="search flex items-center">
        <bm-search
          placeholder="输入商品编码/名称"
          class="flex-auto"
          v-model="keyword"
          @doSubmit="doSubmit"></bm-search>
      </div>
    </div>
    <div>
      <div v-if="!loaded">
        <div class="history-text flex" v-if="history.length">
          <p class="flex-auto">搜索历史</p>
          <p class="del" @click="clearHistory">清除</p>
        </div>
        <div>
          <div class="product-item" v-for="item in history">
            <input :id="'prd' + item.prdId" :disabled="disabled(item)" :value="item.prdId" v-model="selectedVal" type="checkbox" class="bm-check flex-none">
            <label :for="'prd' + item.prdId" class="product-item__info" :class="{'disable-item': disabled(item)}">{{ item.prdName }}</label>
          </div>
        </div>
      </div>
      <div v-if="loaded">
        <div class="product-item" v-for="item in list">
          <input :id="'prd' + item.prdId" :disabled="disabled(item)" :value="item.prdId" v-model="selectedVal" type="checkbox" class="bm-check flex-none">
          <label :for="'prd' + item.prdId" class="product-item__info" :class="{'disable-item': disabled(item)}">{{ item.prdName }}</label>
        </div>
      </div>
    </div>
    <div slot="footer" class="submit-btn" @click="selectVal">确定</div>
  </bm-layout>
</template>

<script>
  import api from '@/api'
  const historyKey = 'ACTIVITY_PRODUCT_HISTORY'
  export default {
    props: {
      options: Object
    },
    data () {
      return {
        selectedVal: [],
        keyword: '',
        list: [],
        history: [],
        pageSize: 10,
        pageIndex: 0,
        loading: false,
        loaded: false,
        selected: false,
        totalList: []
      }
    },
    computed: {
      disabledList () {
        if (!this.options) return []
        return this.options.disabledList || []
      }
    },
    methods: {
      disabled (item) {
        return this.disabledList.indexOf(item.prdId) > -1
      },
      doSubmit (val) {
        this.pageIndex = 0
        this.fetchList()
      },
      callback () {
        const totalList = this.totalList
        return this.selectedVal.reduce((pres, curr) => {
          const prd = totalList.find(item => {
            return item.prdId === curr
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
      fetchList () {
        this.loading = true
        return api.activity.getProductList({
          data: {
            query: this.keyword
          }
        }).then(result => {
          if (result.responseCode === 0) {
            const list = result.productList
            this.list = list
            this.totalList = this.totalList.concat(list)
            this.loading = false
          } else {
            this.loading = false
          }
          this.loaded = true
        })
      },
      updateHistory (items) {
        const history = this.callback().concat(this.history).reduce((pres, curr) => {
          const index = pres.findIndex(item => {
            return item.prdId === curr.prdId
          })
          if (index === -1) {
            pres.push(curr)
          }
          return pres
        }, [])
        simpleLocalDb.setItem(historyKey, history.slice(0, 10))
      },
      clearHistory () {
        this.history = []
        simpleLocalDb.setItem(historyKey, [])
      }
    },
    created () {
      const history = simpleLocalDb.getItem(historyKey)
      if (history) {
        this.history = history
        this.totalList = this.totalList.concat(history)
      }
    }
  }
</script>
