<template>
  <bm-layout>
    <div slot="header">
      <bm-header>今日盘库
      </bm-header>
    </div>
    <bm-empty v-show="!success"></bm-empty>
    <div class="main" v-show="success">
      <bm-loadmore :top-method="loadList" ref="loadList">
        <ul class="list-wrap"
            v-infinite-scroll="loadMore"
            infinite-scroll-disabled="loading"
            infinite-scroll-distance="20">
          <li class="list-item" v-for="item in storePkList">
            <div class="up-part">
              <div class="upp-1 flex justify-between">
                <div class="color-333">{{item.orderNo}}</div>
                <div>
                  <span class="color-999" style="margin-right: 0.1rem">{{item.planDate | datetime('date')}}</span><span class="color-999" @click="$router.push({path: '/store360/storeCheckDetail', query: {orderNo: item.orderNo, storeId: item.storeId}})">详情</span>
                  <img class="arrow" src="../../assets/storeCheck/Disclosure Indicator@2x.png"/>
                </div>
              </div>
              <div class="upp-2 color-333">
                {{item.storeName}}
              </div>
            </div>
            <div class="down-part flex justify-between nowrap">
              <div class="num truncate">
                <span class="mr-8">品种数：{{item.prdNum}}</span>
                <span class="mr-8">总支数：{{item.sumNum}}</span>
                <span>至尊：{{item.newNum}}</span>
              </div>
            </div>
          </li>
        </ul>
      </bm-loadmore>
    </div>
    <div slot="footer">
      <div class="flex-left flex justify-center">
        <div class="flex-auto center" :class="[activity === 'today' ? 'active' : '']" @click.stop.prevent="go('today')">
          <p class="dib confirm"></p>
          <p class="text">今日盘库</p>
        </div>
        <div class="flex-auto center" :class="[activity === 'history' ? 'active' : '']" @click.stop.prevent="go('history')">
          <p class="dib history"></p>
          <p class="text">历史盘库</p>
        </div>
      </div>
    </div>
  </bm-layout>
</template>
<style lang="less" scoped>
  .mr-8 {
    margin-right: 0.08rem;
  }
  .arrow {
    display: inline-block;
    width: 0.08rem;
    vertical-align: middle;
    font-size: 0;
  }
  .list-wrap {
  .list-item {
    padding: 0 0.1rem;
    background: #fff;
    border-bottom: 1px solid #d7d7d7;
    margin-bottom: 0.1rem;
  &:last-of-type {
     margin-bottom: 0;
   }
  .up-part {
    font-size: 0.15rem;
    border-bottom: 1px solid #e5e5e5;
  .upp-1 {
    padding-top: 0.12rem;
    padding-bottom: 0.1rem;
  }
  .upp-2 {
    margin-bottom: 0.12rem
  }
  }
  .down-part {
    height: 0.4rem;
    line-height: 0.4rem;
  .num {
    font-size: 0.1rem;
    color: #666
  }
  .opera {
    font-size: 0.15rem;
    padding-left: 0.20rem;
    background: url('../../assets/storeCheck/edit@2x.png') no-repeat left/0.20rem;
  }
  }
  }
  }

  .flex-left{
    height: 0.5rem;
    box-sizing: border-box;
    padding-top: 0.08rem;
    background: #fff;
    border-top: 1px solid #d7d7d7;
  }
  .text{
    padding: 0;
    margin: 0;
    box-sizing: border-box;
    font-size: 12px;
    color: #999;
  }
  .confirm{
    width: 100%;
    height: 0.2rem;
    margin-bottom: 5px;
    background: url(../../assets/storeCheck/count_gray@2x.png) no-repeat center/0.2rem;
  }
  .history{
    width: 100%;
    height: 0.2rem;
    margin-bottom: 5px;
    background: url(../../assets/storeCheck/history-gray.png) no-repeat center/0.2rem;
  }
  .active .confirm{
    background: url(../../assets/storeCheck/count_blue@2x.png) no-repeat center/0.2rem;
  }
  .active .history{
    background: url(../../assets/storeCheck/history-blue.png) no-repeat center/0.2rem;
  }
  .active p{
    color: #1fb8ff;
  }
</style>

<script>
  /**
   * Created by Wesdint on 2017/10/31.
   */
  import { mapGetters } from 'vuex'
  import { routerHistory } from '@/advanced/mixins'
  export default {
    mixins: [routerHistory],
    data () {
      return {
        activity: 'today'
      }
    },
    computed: {
      ...mapGetters({
        storePkList: 'storeCheck/forStore360/list/storePkList',
        loading: 'storeCheck/forStore360/list/loading',
        loaded: 'storeCheck/forStore360/list/loaded'
      }),
      success () {
        return !(this.storePkList.length === 0 && this.loaded)
      }
    },
    methods: {
      go (type) {
        if (type === 'today') {
          this.search()
        } else {
          this.$router.replace({path: '/store360/storeCheckHistory', query: {storeId: this.$route.query.storeId}})
        }
      },
      search () {
        this.reload()
        this.fetchList()
      },
      fetchList () {
        return this.$store.dispatch('storeCheck/forStore360/list/fetchStorePkList', this.$route.query.storeId)
      },
      loadMore () {
        this.fetchList()
      },
      reload () {
        this.$store.dispatch('storeCheck/forStore360/list/resetStatusData')
      },
      loadList () {
        this.$store.dispatch('storeCheck/forStore360/list/resetStatusData')
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
        this.$store.dispatch('storeCheck/forStore360/list/resetData')
        this.resetPageKey()
      }
    }
  }
</script>
