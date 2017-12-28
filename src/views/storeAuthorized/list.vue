<style lang="less" scoped>
  .mb10{margin-bottom:0.1rem;}
  .right{
    margin-right: 0.1rem;
    text-decoration: underline;
  }
  .list-item{
    background-color: white;
    border-bottom: 1px solid #d7d7d7;
    margin-bottom:0.1rem;
    padding:0.15rem 0.1rem;
    .edit-btn{
      border-radius: 4px;
      border: 1px solid #999999;
      padding:0.05rem 0.04rem;
    }
  }
</style>


<template>
  <bm-layout>
    <bm-header slot="header">
      <div class="f18">门店编制</div>
      <div class="right f14" slot="right" @click="addStore">
        添加门店
      </div>
    </bm-header>
    <div v-show="success">
      <bm-loadmore :topMethod="loadList" ref="loadList" >
        <ul
          v-infinite-scroll="loadMore"
          infinite-scroll-disabled="loading"
          infinite-scroll-distance="20">
          <li class="list-item" v-for="(item, index) in storeList">
            <div class="f15 color-333 mb10">
              {{item.storeId}} {{item.storeName}}
            </div>
            <div class="flex justify-between">
              <div class="flex justify-between items-center f14 color-999">
                <div class=""><span>总编制/已到位(人)：</span></div>
                <div class=""><span>{{item.sumPerNum}}</span>/<span>{{item.readyPerNum}}</span></div>
              </div>
              <div class="edit-btn color-666 f14" @click="toDetail(item.storeId, index)">
                编辑/查看
              </div>
            </div>
          </li>
        </ul>
      </bm-loadmore>
    </div>
    <bm-empty :reload="reload" v-show="!success"></bm-empty>
  </bm-layout>
</template>

<script>
  import {routerHistory} from '@/advanced/mixins'
  import BmSelectPage from '@/components/plugins/BmSelectPage'
  import selectStore from '@/views/common/selectStore'
  import { mapGetters } from 'vuex'
  export default {
    mixins: [routerHistory],
    data () {
      return {
      }
    },
    computed: {
      ...mapGetters({
        storeList: 'storeAuthorized/storeList/storeList',
        loading: 'storeAuthorized/storeList/loading',
        loaded: 'storeAuthorized/storeList/loaded'
      }),
      success () {
        return !(this.storeList.length === 0 && this.loaded)
      }
    },
    components: {
      selectStore
    },
    methods: {
      toDetail (storeId, index) {
        this.$router.push({path: '/storeAuthorized/editDetail', query: {storeId: storeId, num: index}})
      },
      addStore () { // 添加门店
        BmSelectPage({
          component: selectStore
        }).then(data => {
          this.$router.push({path: '/storeAuthorized/editDetail', query: {storeId: data.storeId, type: 'add'}})
        }, error => {
          console.log(error)
        })
      },
      fetchList () {
        return this.$store.dispatch('storeAuthorized/storeList/getStoreOrgListByUserCode')
      },
      loadMore () {
        this.fetchList()
      },
      reload () {
        this.$store.dispatch('storeAuthorized/storeList/resetStatusData')
      },
      loadList () {
        this.$store.dispatch('storeAuthorized/storeList/resetStatusData')
        this.fetchList().then(() => {
          const ll = this.$refs.loadList
          if (ll) {
            ll.onTopLoaded()
          }
        })
      }
    },
    created () {
      if (!this.isBackPage()) {
        this.$store.dispatch('storeAuthorized/storeList/resetData')
        this.resetPageKey()
      }
    }
  }
</script>
