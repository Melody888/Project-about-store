<template>
  <bm-layout ref="layout">
    <bm-header slot="header">
      <span>{{title}}</span>
      <div slot="right" class="search-icon" @click="searchOrder"></div>
    </bm-header>
    <div slot="top">
      <div class="flex search-swrapper" v-if="storeInfo.storeId">
        <p class="flex-auto truncate">当前搜索: {{storeInfo.storeName}}</p>
        <div class="reset-btn" @click="resetStore"></div>
      </div>
    </div>
    <bm-loadmore v-saveScroll :topMethod="initLoadList.bind(this, 'storePlan')" ref="storePlanList"  :class="['list-swrapper', {'active': active == 'storePlan' ? true : false}]">
      <ul
        v-infinite-scroll="loadMore.bind(this, 'storePlan')"
        infinite-scroll-disabled="storePlanLoading"
        infinite-scroll-distance="20"
      >
        <li class="dayItem-swrapper" v-for="(item, index1) in storePlan">
          <div class="time">{{item['planDate'] | formatDateStr}}</div>
          <div class="storeItem-swrapper" v-for="(store, index2) in item['orderList']" @click="openComponent({id: store['orderId']})">
            <div class="title-swrapper flex items-center">
              <div class="title flex-auto truncate">{{store['storeName']}}</div>
              <div class="detail-btn">详情</div>
            </div>
            <div class="flex">
              <div class="store-info flex-auto">
                <p>总金额：¥{{store['sumPrice'] | formatPrice}}</p>
                <p>总支数：{{store['sumNum']}}支</p>
                <p>品种数：{{store['sumPrdType']}}种</p>
              </div>
              <div class="confirm-btn self-center flex items-center" @click.stop="openComponent({id: store['orderId'], index: index1 + '' + index2, isEdit: true})">确认订单</div>
            </div>
          </div>
        </li>
        <li v-if="storeplanLength">
          <bm-empty></bm-empty>
        </li>
      </ul>
    </bm-loadmore>
    <bm-loadmore v-saveScroll :topMethod="initLoadList.bind(this, 'historyPlan')" ref="historyPlanList"  :class="['list-swrapper', {'active': active == 'historyPlan' ? true : false}]">
      <ul
        v-infinite-scroll="loadMore.bind(this, 'historyPlan')"
        infinite-scroll-disabled="historyPlanControlLoading"
        infinite-scroll-distance="20"
      >
        <li class="dayItem-swrapper" v-for="(item, index1) in historyPlan">
          <div class="time">{{item['planDate'] | formatDateStr}}</div>
          <div class="storeItem-swrapper" v-for="(store, index2) in item['orderList']" @click="openComponent({id: store['orderId']})">
            <div class="title-swrapper flex items-center">
              <div class="title flex-auto truncate">{{store['storeName']}}</div>
              <div class="detail-btn">详情</div>
            </div>
            <div class="flex">
              <div class="store-info flex-auto">
                <p>总金额：¥{{store['sumPrice'] | formatPrice}}</p>
                <p>总支数：{{store['sumNum']}}支</p>
                <p>品种数：{{store['sumPrdType']}}种</p>
              </div>
            </div>
          </div>
        </li>
        <li v-if="historyplanLength">
          <bm-empty></bm-empty>
        </li>
      </ul>
    </bm-loadmore>
    <div slot="bottom">
      <div class="flex bottom">
        <div class="flex flex-column flex-auto items-center justify-center" @click="changeTab('storePlan')">
          <div :class="['icon', 'plan-icon', {'focus': active === 'storePlan' ? true : false}]">
            <span class="u_badge" v-if="storePlanTotal">{{storePlanTotal | formatTotal}}</span>
          </div>
          <div :class="['tab', {'focus': active === 'storePlan' ? true : false}]">计划订单</div>
        </div>
        <div class="flex flex-column flex-auto items-center justify-center" @click="changeTab('historyPlan')">
          <div :class="['icon', 'history-icon', {'focus': active === 'historyPlan' ? true : false}]"></div>
          <div :class="['tab', {'focus': active === 'historyPlan' ? true : false}]">历史订单</div>
        </div>
      </div>
    </div>
  </bm-layout>
</template>

<script>
  import BmSelectPage from '@/components/plugins/BmSelectPage'
  import selectStore from '@/views/common/selectStore'
  import moment from 'moment'
  import { mapGetters, mapMutations } from 'vuex'
  export default {
    data () {
      return {}
    },
    computed: {
      storeplanLength () {
        return this.storePlan.length <= 0
      },
      historyplanLength () {
        return this.historyPlan.length <= 0
      },
      title () {
        return this.active === 'storePlan' ? '计划订单' : '历史订单'
      },
      ...mapGetters({
        active: 'storePlanOrder/activeTab',
        storeInfo: 'storePlanOrder/storeInfo',
        storePlan: 'storePlanOrder/storePlan',
        historyPlan: 'storePlanOrder/historyPlan',
        storePlanTotal: 'storePlanOrder/storePlanTotal',
        storePlanLoading: 'storePlanOrder/storePlanControlLoading',
        historyPlanControlLoading: 'storePlanOrder/historyPlanControlLoading'
      })
    },
    filters: {
      formatDateStr (value) {
        if (!value) return ''
        let str = moment(new Date(value)).format('YYYY-MM-DD 周e')
        let day = Number.parseInt(str.slice(-1))
        let dayStr = ''
        switch (day) {
          case 0:
            dayStr = '一'
            break
          case 1:
            dayStr = '二'
            break
          case 2:
            dayStr = '三'
            break
          case 3:
            dayStr = '四'
            break
          case 4:
            dayStr = '五'
            break
          case 5:
            dayStr = '六'
            break
          case 6:
            dayStr = '日'
            break
        }
        return str.slice(0, -1) + dayStr
      },
      formatPrice (value) { return (Number(value) / 100).toFixed(2) },
      formatTotal (value) {
        let val = value || 0
        if (Number(val) > 99) {
          return '99+'
        }
        return Number(val)
      }
    },
    methods: {
      changeTab (tab) {
        this.setActive(tab)
        if (tab === 'historyPlan') {
          this.initLoadList(tab)
        }
      },
      openComponent ({id, isEdit, index}) {
        this.$router.push({
          path: '/storePlanOrder/detail',
          query: {
            isEdit,
            orderId: id,
            index
          }
        })
      },
      initLoadList (plan) {
        this.setControlDefault({
          type: plan,
          storeId: this.storeInfo.storeId
        })
        this.loadMore(plan)
      },
      loadMore (plan) {
        let type = plan === 'storePlan' ? 'toconfirm' : 'confirm'
        let list = plan === 'storePlan' ? 'storePlanList' : 'historyPlanList'
        this.$store.dispatch('storePlanOrder/getPlanOrder', {
          type,
          storeId: this.storeInfo.storeId
        }).then(() => {
          this.$refs[list].onTopLoaded()
        })
      },
      searchOrder () {
        BmSelectPage({
          component: selectStore
        }).then(data => {
          this.setStoreInfo({
            storeId: data.storeId,
            storeName: data.storeName
          })
          this.initLoadList('storePlan')
          this.initLoadList('historyPlan')
        }, error => {
          console.log(error)
        })
      },
      resetStore () {
        this.setStoreInfo({
          storeId: '',
          storeName: ''
        })
        this.initLoadList('storePlan')
        this.initLoadList('historyPlan')
      },
      ...mapMutations({
        setStoreInfo: 'storePlanOrder/setStoreInfo',
        setControlDefault: 'storePlanOrder/setControlDefault',
        setActive: 'storePlanOrder/setActiveTab'
      })
    },
    created () {
      if (this.storePlan.length <= 0) this.initLoadList('storePlan')
      if (this.historyPlan.length <= 0) this.initLoadList('historyPlan')
    }
  }
</script>

<style lang="less" scoped>
  @blue: #1fb8ff;
  .search-icon {
    width: .24rem;
    height: .24rem;
    margin-right: .15rem;
    background: url('~@/assets/storePlanOrder/search_white@2x.png') no-repeat;
    background-size: contain;
  }
  .search-swrapper {
    padding: .12rem;
    background-color: #fff;
    font-size: .14rem;
    line-height: .24rem;
    &>p { color: #333; }
    .reset-btn {
      flex-shrink: 0;
      margin-left: .08rem;
      width: .24rem;
      height: .24rem;
      color: #1fb8ff;
      position: relative;
      &:before {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        width: .23rem;
        height: .23rem;
        background: url('~@/assets/storePlanOrder/close_blue@2x.png') no-repeat;
        background-size: contain;
      }
    }
  }
  .list-swrapper {
    height: 100%;
    width: 100%;
    position: absolute;
    left: 100%;
    overflow-x: hidden;
    overflow-y: scroll;
    transition: left .5s;
    background-color: #f1f1f1;
    &.active { left: 0; }
  }
  .dayItem-swrapper {
    .time {
      margin: .10rem 0 .04rem .18rem;
      color: @blue;
      font-size: .14rem;
      line-height: .14rem;
      position: relative;
      &:after {
        content: ' ';
        display: block;
        width: .06rem;
        height: .14rem;
        position: absolute;
        top: 0;
        left: -.10rem;
        background-color: @blue;
      }
    }
  }
  .storeItem-swrapper {
    background-color: #fff;
    border-bottom: 1px solid #d7d7d7;
    .title-swrapper {
      height: .50rem;
      padding: 0 .12rem;
      .title {
        font-size: .15rem;
        font-weight: bold;
        color: #333;
      }
      .detail-btn {
        padding-left: .12rem;
        padding-right: .24rem;
        color: #999;
        font-size: .12rem;
        position: relative;
        line-height: .24rem;
        &:after {
          content: '';
          width: .24rem;
          height: .24rem;
          display: block;
          position: absolute;
          top: 0;
          right: 0;
          background: url('~@/assets/storePlanOrder/arrow_right@2x.png') no-repeat;
          background-size: contain;
        }
      }
    }
    .store-info {
      padding: .04rem 0.20rem .04rem .12rem;
      &>p {
        margin-bottom: .08rem;
        font-size: .14rem;
        color: #666;
      }
    }
    .confirm-btn {
      padding: .10rem .17rem;
      margin-right: .12rem;
      font-size: .14rem;
      color: #fff;
      background-color: #fe6b47;
      border-radius: 4px;
    }
  }
  .bottom {
    padding: .06rem 0 .04rem 0;
    background-color: #fff;
    border-top: 1px solid #d7d7d7;
    .icon {
      width: .20rem;
      height: .20rem;
      background-repeat: no-repeat;
      background-size: contain;
      margin-bottom: .04rem;
    }
    .plan-icon {
      background-image: url('~@/assets/storePlanOrder/navicon_gray@2x.png');
      position: relative;
      .u_badge {
        position: absolute;
        top: -.04rem;
        left: .13rem;
        height: .14rem;
        display: inline-block;
        border-radius: .28rem;
        font-size: .12rem;
        text-align: center;
        padding: 0 .04rem;
        overflow: hidden;
        background-color: #ff6c47;
        color: #fff;
      }
      &.focus {
        background-image: url('~@/assets/storePlanOrder/navicon_blue@2x.png');
      }
    }
    .history-icon {
      background-image: url('~@/assets/storePlanOrder/history_gray@2x.png');
      &.focus {
        background-image: url('~@/assets/storePlanOrder/history_blue@2x.png');
      }
    }
    .tab {
      font-size: .11rem;
      color: #999;
      &.focus {
        color: @blue;
      }
    }
  }
</style>
