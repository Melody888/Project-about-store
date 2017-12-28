<style lang="less" scoped>
  .search {
    padding: .1rem 0;
    border-bottom: 1px solid #d7d7d7;
  }
  .history-text {
    font-size: 12px;
    color: #666666;
    padding: .1rem;
    padding-bottom: 0;
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
  <bm-layout style="background: #fff">
    <div slot="header">
      <bm-header>选择门店</bm-header>
      <div class="search flex items-center">
        <bm-search
          placeholder="输入门店编码/名称"
          class="flex-auto"
          v-model="keyword"
          @doSubmit="doSubmit"></bm-search>
      </div>
    </div>
    <div>
      <div v-if="!showSearchResult">
        <div class="history-text">搜索历史</div>
        <div>
          <div class="pk-store" v-for="item in history" @click="selectVal(item)">
            <div class="pk-store__store">{{item.storeId}} {{item.storeName}}</div>
            <div class="pk-store__addr">地址：{{item.address}}</div>
          </div>
        </div>
      </div>
      <div
          v-infinite-scroll="loadMore"
          infinite-scroll-disabled="loading"
          infinite-scroll-distance="20"
          v-if="showSearchResult">
        <div class="pk-store" v-for="item in list" @click="selectVal(item)">
          <div class="pk-store__store">{{item.storeId}} {{item.storeName}}</div>
          <div class="pk-store__addr">地址：{{item.address}}</div>
        </div>
      </div>
    </div>
  </bm-layout>
</template>

<script>
  import api from '@/api'
  import { routerHistory } from '@/advanced/mixins'
  const historyKey = 'PK_STORE_HISTORY'
  export default {
    mixins: [routerHistory],
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
    methods: {
      doSubmit (val) {
        this.pageIndex = 0
        this.loading = false
        this.list = []
        this.$nextTick(() => {
          this.fetchList()
        })
      },
      callback () {
        return this.selectedVal
      },
      selectVal (item) {
        this.selectedVal = item
        this.$store.commit('storeCheck/selectPkStore/store', item)
        this.updateHistory(item)
        this.$router.replace('/storeCheck/inputInfo')
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
        simpleLocalDb.setItem(historyKey, history.slice(0, 10))
      }
    },
    mounted () {
      const history = simpleLocalDb.getItem(historyKey)
      if (history) {
        this.history = history
      }
    },
    created () {
      if (!this.isBackPage()) {
        this.$store.commit('storeCheck/selectPkStore/store', null)
        this.resetPageKey()
      }
    }
  }
</script>
