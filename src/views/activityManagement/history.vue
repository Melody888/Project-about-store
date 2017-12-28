<template>
  <bm-layout>
    <bm-header slot="header">历史记录</bm-header>
    <div slot="header" class="header bg-fff">
      <bm-search @doSubmit="search" placeholder="输入门店名称查询" v-model="storeName" ></bm-search>
    </div>
    <div class="page-main" v-show="success" v-saveScroll>
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
      <router-link class="footer-tab f10 color-999" to="/activityManagement" replace>
        <img class="footer-icon" src="../../assets/activityManagement/ic_activity_grey.png">
        <div class="footer-corner color-fff" v-if="myNum>0">{{myNum}}</div>
        <div>活动管理</div>
      </router-link>
      <router-link class="footer-tab f10 color-1fb8ff" to="/activityManagement/history" replace>
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
        buttonText: {'not_start': '编辑活动', 'in_use': '执行活动', 'over': '活动结案'},
        storeName: ''
      }
    },
    computed: {
      ...mapGetters({
        activityList: 'activityManagement/historyList/activityList',
        loading: 'activityManagement/historyList/loading',
        loaded: 'activityManagement/historyList/loaded',
        myNum: 'activityManagement/activityList/myNum',
        status: 'activityManagement/historyList/status'
      }),
      success () {
        return !(this.activityList.length === 0 && this.loaded)
      }
    },
    methods: {
      search (val) {
        if (this.success) {
          document.querySelector('.page-main').scrollTop = 0
        }
        this.$store.commit('activityManagement/historyList/storeName', val)
        this.$store.dispatch('activityManagement/historyList/resetStatusData')
        this.fetchList()
      },
      toDetail (activityCode) {
        this.$router.push({
          path: `/activityManagement/detail/${activityCode}`,
          query: {
            type: 'history'
          }
        })
      },
      fetchList () {
        return this.$store.dispatch('activityManagement/historyList/getActivityList')
      },
      loadMore () {
        this.fetchList()
      },
      reload () {
        this.$store.dispatch('activityManagement/historyList/resetStatusData')
      },
      loadList () {
        this.$store.dispatch('activityManagement/historyList/resetStatusData')
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
        this.$store.dispatch('activityManagement/historyList/getFieldConfByFieldType')
        this.$store.dispatch('activityManagement/historyList/resetData')
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
  .page-main{
    position:absolute;
    width:100%;
    height:100%;
    top:0;
    left:0;
    overflow-y: auto;
  }
  .header{
    height:0.5rem;
    padding:0.1rem 0;
    border-bottom:1px solid #d7d7d7;
  }
  .list{
    margin-top:0.1rem;
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
  .list:last-child{
    margin-bottom:0.1rem;
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
    &-corner{
      position: absolute;
      background: #FF6C47;
      left: calc(~"50% + 0.1rem");
      top: -0.05rem;
      height: 0.16rem;
      min-width: 0.16rem;
      line-height: 0.16rem;
      border-radius: 0.08rem;
      padding: 0 0.02rem;
    }
  }
</style>
