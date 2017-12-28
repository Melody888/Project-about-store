<template>
  <bm-layout>
    <bm-header slot="header"><div style="font-size:.16rem;">产品分销与价格巡检</div></bm-header>
    <!-- <div class="search bottom-line" slot="header">
      <bm-search
      placeholder="输入门店名称／巡检单号"
      @doSubmit="search"
      v-model="keyword"
      ></bm-search>
    </div> -->
    <bm-loadmore :top-method="loadList" ref="loadList">
    <div
      v-infinite-scroll="loadMore"
      infinite-scroll-disabled="loading"
      infinite-scroll-distance="20"
      infinite-scroll-immediate-check="false">
      <div class="list-item"
        v-for="(item, index) in marketList"
        :key="index">
        <div class="list-line">
          <div class="head-line">
            <div class="f15 color-999 flex justify-between" @click="toPage(`detail/${item.marketCode}/false/${item.isOwnMarket}?isHideComment=true`)">
              <div>{{item.marketCode}}</div>
              <div class="flex items-center f15 color-999"><span>详情</span><i class="icon icon-left"></i></div>
            </div>
            <div class="creat-time">
              <span>巡检单创建：</span>
              <span>{{item.createTimestamp | datetime('YYYY/MM/DD')}}</span>
              <span>{{item.createByName}}</span>
            </div>
          </div>
          <div class="body-line">
            <div class="store-name">
              {{item.storeName}}
            </div>
            <div class="flex justify-between f13" >
              <div class="color-666 bold"><span>分销品种数:</span><span class="ml5">{{item.marketNum}}</span></div>
              <!-- <div @click="toPage(`edit/${item.marketCode}`)" v-if="item.isOwnMarket === 0 || item.isOwnMarket === 3"><i class="icon icon-write"></i><span class="color-25BAFF">编辑</span></div>
              <div @click="toPage(`detail/${item.marketCode}/true/${item.isOwnMarket}`)" v-if="item.isOwnMarket === 2"><i class="icon icon-write"></i><span class="color-25BAFF">评价</span></div> -->
            </div>
          </div>
        </div>
        <div class="show-comment" v-if="item.marketFeedbackList.length > 0">
          <div class="comment-list-header flex justify-between">
            <div class="flex">
              <div>
                <em>评价信息:</em><em class="ml5">{{item.marketFeedbackNum}}</em>条
              </div>
              <div class="flex items-center ml20" v-if="item.isOwnMarket === 1 || item.isOwnMarket === 3">
                <i class="icon icon-comment"></i><span @click="toggleComment(item)">回复</span>
              </div>
            </div>
            <span class="flex items-center"><em @click="showTalk(index)">{{item.isTalk? '收起': '展开'}}</em><i class="icon icon-down" :class="{'icon-up': item.isTalk}"></i></span>
          </div>
          <div class="comment-list" :class="{'hide': !item.isTalk && item.marketFeedbackList.length > 0}">
            <div class="comment-list-content" v-for="(feedback, index) in item.marketFeedbackList" :key="index">
              <div class="comment-line flex items-center">
                <span class="mr5">{{feedback.createTimestamp | datetime('YYYY/MM/DD')}}</span><span class="mr10">{{feedback.createByName}}:</span>
                <span class="comment flex-auto truncate" v-if="feedback.content">{{feedback.content}}</span>
                <span class="comment flex-auto truncate" v-if="!feedback.content">{{feedback.agreeType === 'agree' ? '赞' : '踩'}} ({{feedback.agreeNum}})</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="has-more" v-if="loading">没有更多数据了</div>
    </div>
    </bm-loadmore>
    <bm-empty v-if="marketList.length === 0"></bm-empty>
    <div slot="bottom" class="sumbit-comment" v-show="isShowComment" @click="toggleComment">
      <div class="sumbit-con" @click.stop="stopPrev">
        <textarea v-model="content" class="text-area" name="" id="" cols="30" rows="10" placeholder="填写回复内容"></textarea>
        <p class="sumbit-btn" @click="submitComment">提交回复</p>
      </div>
    </div>
  </bm-layout>
</template>

<script>
  import {
    Toast
  } from 'mint-ui'
  import { mapGetters } from 'vuex'
  import { routerHistory } from '@/advanced/mixins'
  export default {
    data () {
      return {
        isShowComment: false,
        keyword: '',
        content: '',
        marketCode: '',
        loading: false,
        storId: '111' // 路由路径中获取storId
      }
    },
    mixins: [routerHistory],
    computed: {
      ...mapGetters({
        marketList: 'storeDistribution/getMarketList',
        timestamp: 'storeDistribution/getTimestamp',
        createBy: 'storeDistribution/getCreateBy'
      })
    },
    methods: {
      toggleComment (item) {
        if (item) this.marketCode = item.marketCode
        this.isShowComment = !this.isShowComment
      },
      stopPrev () {
        // 空方法，实现阻断click事件
      },
      submitComment () {
        this.$store.dispatch('storeDistribution/saveMarketFeedback', {type: 'revert', content: this.content, marketCode: this.marketCode}).then(result => {
          if (result.responseCode === 0) {
            Toast({
              message: '回复成功!',
              duration: 2000
            })
            this.toggleComment()
            this.content = ''
          } else {
            Toast({
              message: result.responseMsg,
              duration: 2000
            })
          }
        })
      },
      showTalk (index) {
        this.marketList[index].isTalk = !this.marketList[index].isTalk
      },
      toPage (str) {
        this.$router.push({path: '' + str})
      },
      search () {
        this.loading = false
        this.$store.dispatch('storeDistribution/fetchMarketPollingList360', {
          keyword: this.keyword,
          storeId: this.$route.query.storeId
        })
      },
      loadMore () {
        this.loading = true
        this.$store.dispatch('storeDistribution/fetchMarketPollingList360', {
          keyword: this.keyword,
          timestamp: this.timestamp,
          createBy: this.createBy,
          storId: this.storId
        }).then(result => {
          console.log(result)
          if (result.marketPollingList.length === 0) {
            this.loading = true
          } else {
            this.loading = false
          }
        })
      },
      loadList () {
        this.keyword = ''
        this.$store.dispatch('storeDistribution/fetchMarketPollingList360', {
          keyword: this.keyword,
          storeId: this.$route.query.storeId
        }).then(result => {
          this.$refs.loadList.onTopLoaded()
        })
      }
    },
    mounted () {
      if (!this.isBackPage()) {
        // this.storeId = this.$route.query.storeId 获取路由路径storeId ，再传进请求方法中 360接口中需要storeId 参数
        // this.$store.dispatch('storeDistribution/fetchMarketPollingList360', {storeId: this.storeId})
        this.$store.dispatch('storeDistribution/fetchMarketPollingList360', {
          keyword: this.keyword,
          storeId: this.$route.query.storeId
        })
        this.resetPageKey()
      }
    }
  }
</script>
<style lang="less" scoped>
  .ml5{margin-left:0.05rem;}
  .mr5{margin-right: 0.05rem;}
  .mr10{margin-right: 0.1rem;}
  .ml10{margin-left: 0.1rem;}
  .ml15{margin-left: 0.15rem;}
  .ml20{margin-left: 0.2rem;}
  .color-25BAFF{
    color: #25BAFF;
  }


  .icon{
      display: inline-block;
      width:0.14rem;
      height: 0.14rem;
      background-size:cover;
      &-left{
        background:url('../../assets/storeDistribution/rightArrow.png') no-repeat center center;
        background-size:60%;
        margin-left: 0.05rem;
      }
      &-write{
        background:url('../../assets/storeDistribution/ic_write.png') no-repeat center center;
        background-size:contain;
        margin-right: 0.05rem;
      }
      &-comment{
        background:url('../../assets/storeDistribution/comment.png') no-repeat center center;
        background-size:contain;
        margin-right: 0.05rem;
      }
      &-down{
        background:url('../../assets/storeDistribution/down.png') no-repeat center center;
        background-size:80%;
        margin-left: 0.05rem;
      }
      &-up{
        background:url('../../assets/storeDistribution/up.png') no-repeat center center;
        background-size:80%;
        margin-left: 0.05rem;
      }
    }
  .bottom-line{
      border-bottom:1px solid #d7d7d7;
  }
  .list-line {
    }
    .add{
      position: absolute;
      bottom:.63rem;
      left:.2rem;
      width:.56rem;
      height:.56rem;
      z-index:5;
      &-btn{
        color:white;
        font-size:0.14rem;
        text-align:center;
        width:100%;
        height:100%;
        border-radius: 50%;
        background-color: #FFC924;
        display: flex;
        flex-direction:column;
        justify-content: center;
        box-shadow:0px 4px 3px -5px #888;
      }
    }
  .search{
    background-color:white;
    height:0.5rem;
    padding:0.1rem 0.05rem 0.1rem 0.1rem;
  }
  .list-item{
    background-color: white;
    border-bottom:1px solid #d7d7d7;
    margin-bottom:0.1rem;
    .list-line{
      .head-line{
        border-bottom:1px solid #eaeaea;
        margin-left:0.1rem;
        padding: 0.15rem 0.1rem .1rem 0;
        .creat-time{
          font-size: 0.13rem;
          color:#666666;
          margin-top:0.05rem;
        }
      }
      .body-line{
        border-bottom:1px solid #eaeaea;
        margin-left:0.1rem;
        padding: 0.15rem 0.1rem .1rem 0;
        font-size: 0.15rem;
        .store-name{
          margin-bottom:0.1rem;
        }
      }
    }
    .show-comment{
      padding:0.1rem;
      font-size: 0.13rem;
      color:#999999;
      .hide {
        height: 0.3rem;
        overflow: hidden;
      }
      .comment-list-content{
        .comment-line{
          margin-top:0.1rem;
          .comment{
          }
        }
      }
    }
  }
  .sumbit-comment{
    position: absolute;
    top:0px;
    left: 0px;
    width:100%;
    height:100%;
    background-color: rgba(0,0,0,0.40);
    z-index:10;
    .sumbit-con{
      position: absolute;
      bottom: 0;
      left: 0;
      width: 100%;
      background-color:white;
      padding:0.1rem;
      .text-area{
        border-radius: 4px;
        width: 100%;
        height:0.6rem;
        border: 1px solid #d7d7d7;
        padding:0.1rem;
        font-size:0.14rem;
      }
      .sumbit-btn{
        margin-top:0.1rem;
        border-radius: 4px;
        background-color:#FF6C47;
        color:white;
        font-size:0.15rem;
        text-align: center;
        padding: 0.12rem 0rem 0.12rem;
      }
    }
  }
  .has-more {
    background: #fff;
    height: 50px;
    text-align: center;
    line-height: 50px;
    font-size: 14px;
  }
</style>

