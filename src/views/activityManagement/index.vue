<template>
  <bm-layout ref="layout">
    <bm-header slot="header">
      活动管理
      <!--<div class="link items-center" slot="right"><i class="book"></i><span>操作手册</span></div>-->
    </bm-header>
    <div v-show="success">
      <bm-loadmore :topMethod="loadList" ref="loadList">
        <ul
          v-infinite-scroll="loadMore"
          infinite-scroll-disabled="loading"
          infinite-scroll-distance="20">
          <li class="list bg-fff pl10 bb-d7d7d7" v-for="list in activityList">
            <div class="list-top flex items-center justify-between bb-d7d7d7" @click="toDetail(list.activityCode)">
              <div>
                <div class="f14 color-666">{{list.activityCode}}</div>
                <div class="f12 color-999">
                  {{list.createTime | datetime('YYYY/MM/DD')}}
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
                <div class="button f14 color-fff bg-ff6c47 flex-none" v-if="list.editable" @click="editActivity(list)">{{buttonText[list.activityState]}}</div>
              </div>
              <div class="flex justify-between items-center">
                <div class="f12 color-999">门店资源总数：{{list.totalResource}}，参与活动品种数：{{list.totalMateriel}}</div>
                <a class="f14 color-0a85cc cancel-activity flex-none" v-if="list.editable && (list.activityState === 'no_start' || list.activityState === 'in_use')" @click="cancelActivity(list.activityCode)">取消活动</a>
              </div>
            </div>
          </li>
        </ul>
      </bm-loadmore>
    </div>
    <bm-empty :reload="reload" v-show="!success"></bm-empty>
    <div class="add-activity f15 color-fff flex flex-column justify-center" @click="addActivity">
      <p>新增</p>
      <p>活动</p>
    </div>
    <div slot="footer" class="footer bg-fff flex">
      <router-link class="footer-tab f10 color-1fb8ff"  to="/activityManagement" replace>
        <img class="footer-icon" src="../../assets/activityManagement/ic_activity_blue.png">
        <div class="footer-corner color-fff" v-if="myNum>0">{{myNum}}</div>
        <div>活动管理</div>
      </router-link>
      <router-link class="footer-tab f10 color-999" to="/activityManagement/history" replace>
        <img class="footer-icon" src="../../assets/activityManagement/history-grey@2x.png">
        <div>历史记录</div>
      </router-link>
    </div>
  </bm-layout>
</template>

<script>
  import {routerHistory} from '@/advanced/mixins'
  import { mapGetters } from 'vuex'
  import api from '@/api'
  import { Toast } from 'mint-ui'
  export default {
    mixins: [routerHistory],
    data () {
      return {
        buttonText: {'no_start': '编辑活动', 'in_use': '执行活动', 'over': '活动结案'}
      }
    },
    computed: {
      ...mapGetters({
        activityList: 'activityManagement/activityList/activityList',
        loading: 'activityManagement/activityList/loading',
        loaded: 'activityManagement/activityList/loaded',
        myNum: 'activityManagement/activityList/myNum',
        status: 'activityManagement/activityList/status'
      }),
      success () {
        return !(this.activityList.length === 0 && this.loaded)
      }
    },
    methods: {
      cancelActivity (activityCode) { // 取消活动
        this.$messagebox.confirm('确定取消此活动么？', {
          title: activityCode,
          confirmButtonText: '确 定',
          cancelButtonText: '取 消',
          cancelButtonClass: 'cancel-confirm-btn'
        }).then(() => {
          api.activity.cancelActivity({
            data: {
              activityCode,
              isClose: false,
              token: simpleLocalDb.getItem('token')
            }
          }).then(res => {
            if (res.responseCode === 0) {
              this.$refs.layout.resetScrollTop()
              this.loadList()
            } else {
              Toast(res.responseMsg)
            }
          })
        }, () => {})
      },
      toDetail (activityCode) {
        this.$router.push(`/activityManagement/detail/${activityCode}`)
      },
      addActivity () { // 新增活动
        this.$router.push({
          path: '/activityManagement/input',
          query: {
            type: 'new'
          }
        })
      },
      editActivity (item) {
        let type = ''
        switch (item.activityState) {
          case 'no_start':
            type = 'update'
            break
          case 'in_use':
            type = 'execute'
            break
          case 'over':
            type = 'close'
            break
        }
        this.$router.push({
          path: '/activityManagement/input',
          query: {
            type,
            activityCode: item.activityCode
          }
        })
      },
      fetchList () {
        return this.$store.dispatch('activityManagement/activityList/getActivityList')
      },
      loadMore () {
        this.fetchList()
      },
      reload () {
        this.$store.dispatch('activityManagement/activityList/resetStatusData')
      },
      loadList () {
        this.$store.dispatch('activityManagement/activityList/resetStatusData')
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
        this.$store.dispatch('activityManagement/activityList/resetData')
        this.$store.dispatch('activityManagement/activityList/getFieldConfByFieldType')
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
  .link {
    display: flex;
    padding: 0 0.1rem;
    white-space: nowrap;
    .book {
      display: block;
      width: 0.14rem;
      height: 0.14rem;
      margin-right: 0.05rem;
      background:url('../../assets/activityManagement/ic_book.png') no-repeat center center / contain;
    }
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
        flex:auto;
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
      .button{
        width:0.7rem;
        height:0.3rem;
        line-height: 0.3rem;
        text-align: center;
        border-radius: 0.04rem;
        margin-top:0.15rem;
        margin-left:0.1rem;
        letter-spacing:0.01rem;
      }
    }
  }
  .add-activity{
    width:0.56rem;
    height:0.56rem;
    position:fixed;
    left:0.2rem;
    bottom:0.7rem;
    z-index:10;
    border-radius: 50%;
    background: #FFC924;
    box-shadow: 0 0 0.06rem 0 rgba(148,148,148,0.12), 0 0.06rem 0.06rem 0 rgba(141,141,141,0.24);
    p{
      text-align: center;
    }
    p:nth-of-type(2) {
      margin-top:-0.02rem;
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
