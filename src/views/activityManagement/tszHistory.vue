<template>
  <bm-layout ref="bmLayout">
    <bm-header slot="header">历史记录</bm-header>
    <div v-show="success">
      <bm-loadmore :topMethod="loadList" ref="loadList" >
      <ul
        v-infinite-scroll="loadMore"
        infinite-scroll-disabled="loading"
        infinite-scroll-distance="20">
        <li class="list bg-fff pl10 bb-d7d7d7" v-for="list in activityList">
          <div class="list-top flex items-center justify-between bb-d7d7d7" @click="toDetail(list.activityCode)">
            <div>
              <div class="f14 color-666">{{list.activityCode}}</div>
              <div class="f12 color-999">{{list.createTime | datetime('YYYY/MM/DD')}}
                <span>{{list.createByName.length > 5 ? list.createByName.substr(0,4)+'...' : list.createByName}}</span> 创建
              </div>
            </div>
            <div class="f15 color-999 flex items-center">
              <span>{{status[list.activityState]}}</span><span class="pl10 pr5">详情</span>
              <img src="../../assets/activityManagement/rightArrow.png" class="right-arrow"/>
            </div>
          </div>
          <div class="list-bottom">
            <div class="flex justify-between">
              <div class="content-left">
                <div class="f15 color-333 storeName">{{list.storeName}}</div>
                <div class="f15 color-333 date">活动日期：{{list.startDate | datetime('MM/DD')}} - {{list.endDate | datetime('MM/DD')}}</div>
              </div>
            </div>
            <div class="flex items-center">
              <div class="f12 color-999">门店资源总数：{{list.totalResource}}，参与活动品种数：{{list.totalMateriel}}</div>
            </div>
          </div>
        </li>
      </ul>
    </bm-loadmore>
    </div>
    <bm-empty :reload="reload" v-show="!success"></bm-empty>
    <div slot="footer" class="footer bg-fff flex">
      <router-link class="footer-tab f10 color-999" :to="{path:`/activityManagement/tszIndex?storeId=${storeId}`}" replace>
        <img class="footer-icon" src="../../assets/activityManagement/ic_activity_grey.png">
        <div>活动管理</div>
      </router-link>
      <router-link class="footer-tab f10 color-1fb8ff" :to="{path:`/activityManagement/tszHistory?storeId=${storeId}`}" replace>
        <img class="footer-icon" src="../../assets/activityManagement/history-blue@2x.png">
        <div>历史记录</div>
      </router-link>
    </div>
  </bm-layout>
</template>

<script>
  import {routerHistory} from '@/advanced/mixins'
  import { mapGetters } from 'vuex'
  export default {
    mixins: [routerHistory],
    data () {
      return {
        storeId: ''
      }
    },
    computed: {
      ...mapGetters({
        activityList: 'activityManagement/tszHistoryList/activityList',
        loading: 'activityManagement/tszHistoryList/loading',
        loaded: 'activityManagement/tszHistoryList/loaded',
        status: 'activityManagement/tszHistoryList/status'
      }),
      success () {
        return !(this.activityList.length === 0 && this.loaded)
      }
    },
    methods: {
      toDetail (activityCode) {
        this.$router.push({
          path: `/activityManagement/detail/${activityCode}`,
          query: {
            type: 'history'
          }
        })
      },
      fetchList () {
        return this.$store.dispatch('activityManagement/tszHistoryList/getActivityList', this.storeId)
      },
      loadMore () {
        this.fetchList()
      },
      reload () {
        this.$store.dispatch('activityManagement/tszHistoryList/resetStatusData')
      },
      loadList () {
        this.$store.dispatch('activityManagement/tszHistoryList/resetStatusData')
        this.fetchList().then(() => {
          const ll = this.$refs.loadList
          if (ll) {
            ll.onTopLoaded()
          }
        })
      }
    },
    created () {
      this.storeId = this.$route.query.storeId
      if (!this.isBackPage()) {
        this.$store.dispatch('activityManagement/tszHistoryList/getFieldConfByFieldType')
        this.$store.dispatch('activityManagement/tszHistoryList/resetData')
        this.resetPageKey()
      }
    }
  }
</script>

<style lang="less" scoped>
  .pl10{
    padding-left:0.1rem;
  }
  .pr5{
    padding-right:0.05rem;
  }
  .header{
    height:0.5rem;
    padding:0.1rem 0;
    border-bottom:1px solid #d7d7d7;
  }
  .list{
    margin-bottom:0.1rem;
    &-top{
      padding:0.12rem 0.1rem 0.12rem 0;
      .right-arrow{
        width:0.08rem;
        height:0.12rem;
      }
    }
    &-bottom{
      padding:0 0.1rem 0.15rem 0;
      .cancel-activity{
        text-decoration:underline;
        text-decoration-color: #0a85cc;
      }
      .content-left{
        overflow:hidden;
        margin-top:0.12rem;
        .storeName{
          display: -webkit-box;
          -webkit-box-orient: vertical;
          -webkit-line-clamp: 2;
          overflow: hidden;
        }
        .date{
          padding-top:0.1rem;
          padding-bottom:0.15rem;
        }
      }
    }
  }
  .footer{
    padding-top:0.08rem;
    padding-bottom:0.06rem;
    border-top:0.5px solid #d7d7d7;
    &-tab{
      width:50%;
      display: block;
      text-align: center;
      position:relative;
    }
    &-icon{
      width:0.19rem;
      display:inline;
    }
  }
</style>
