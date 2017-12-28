<style lang="less" scoped>
  .search {
    height: .5rem;
    padding-left: .1rem;
    border-bottom: 1px solid #d7d7d7;
  }
  .no-data{
    position:absolute;
    top:50%;
    margin-top:-0.1rem;
    color: #999999;
    font-size: 0.16rem;
    width:100%;
    text-align: center;
  }
  .history-text {
    line-height: 1.1em;
    font-size: 12px;
    background: #f2f2f2;
    color: #999;
    padding: .1rem;
    .del {
      padding-left: .16rem;
      background: url('~@/assets/common/dustbin.png') no-repeat left center / auto 100%;
    }
  }
  .pk-store {
    padding: .1rem;
    border-bottom: 1px solid #d7d7d7;
    &__store {
      font-size: 15px;
      color: #333333;
    }
    &__addr {
      margin-top: .1rem;
      font-size: 12px;
      color: #666666;
    }
    &:active {
      background: #F8F8F8;
    }
  }
</style>

<template>
  <bm-layout>
    <div slot="header">
      <bm-header>选择门店</bm-header>
      <div class="search flex items-center">
        <bm-search
          placeholder="输入门店编码/名称"
          class="flex-auto"
          v-model="keyword"
          :isSpeech='true'
          @doSubmit="doSubmit"></bm-search>
      </div>
    </div>
    <div>
      <div v-if="!showSearchResult">
        <div class="history-text flex">
          <p class="flex-auto">搜索历史</p>
          <p class="del" @click="clearHistory">清除</p>
        </div>
        <div>
          <div class="pk-store" v-for="item in history" @click="selectVal(item)">
            <div class="pk-store__store">{{item.storeId}} {{item.storeName}}</div>
            <div class="pk-store__addr">地址：{{item.address}}</div>
          </div>
        </div>
      </div>
      <div
        v-if="showSearchResult"
        v-infinite-scroll="loadMore"
        infinite-scroll-disabled="scrollDisabled"
        infinite-scroll-distance="20">
        <div>
          <div class="pk-store" v-for="item in list" @click="selectVal(item)">
            <div class="pk-store__store">{{item.storeId}} {{item.storeName}}</div>
            <div class="pk-store__addr">地址：{{item.address}}</div>
          </div>
        </div>
      </div>
      <div v-if="!success" class="no-data">没有符合条件的结果</div>
    </div>
  </bm-layout>
</template>

<script>
  import api from '@/api'
  const historyKey = 'PK_STORE_HISTORY'
  export default {
    props: {
      options: Object
    },
    data () {
      return {
        selectedVal: null,
        keyword: '',
        list: [],
        history: [],
        pageSize: 10,
        pageIndex: 0,
        loading: false,
        loaded: false,
        showSearchResult: false
      }
    },
    computed: {
      success () {
        return !(this.list.length === 0 && this.loaded)
      },
      scrollDisabled () {
        return this.loading || this.loaded
      }
    },
    methods: {
      doSubmit (val) {
        this.pageIndex = 0
        // this.loading = false
        // this.list = []
        this.$nextTick(() => {
          this.fetchList()
        })
      },
      callback () {
        return this.selectedVal
      },
      selectVal (item) {
        this.selectedVal = item
        this.updateHistory(item)
        window.history.go(-1)
      },
      fetchList () {
        if (this.loading) return
        this.loading = true
        return api.storePk.getStoreListByUserCode({
          data: {
            token: simpleLocalDb.getItem('token'),
            pageSize: this.pageSize,
            pageIndex: this.pageIndex,
            keyword: this.keyword
          }
        }).then(result => {
          this.showSearchResult = true
          if (result.responseCode === 0) {
            const list = result.storeList
            if (this.pageIndex === 0) {
              this.list = list
            } else {
              this.list = this.list.concat(list)
            }
            this.pageIndex++
            if (list.length < this.pageSize) {
              this.loaded = true
              this.loading = false
            } else {
              this.loading = false
            }
          } else {
            this.loaded = true
          }
        })
      },
      loadMore () {
        this.fetchList()
      },
      updateHistory (item) {
        this.history.unshift(item)
        const history = this.history.reduce((pres, curr) => {
          const index = pres.findIndex(item => {
            return item.storeId === curr.storeId
          })
          if (index === -1) {
            pres.push(curr)
          }
          return pres
        }, [])
        simpleLocalDb.setItem(historyKey, history.slice(0, 5))
      },
      clearHistory () {
        this.history = []
        simpleLocalDb.setItem(historyKey, [])
      }
    },
    mounted () {
      const history = simpleLocalDb.getItem(historyKey)
      if (history) {
        this.history = history
      }
    }
  }
</script>
