<template>
  <bm-layout>
    <bm-header slot="header">评价</bm-header>
    <section>
      <div class="comment__container">
        <div class="comment__column title">{{info.orderCode}} {{info.storeName}}</div>
      </div>
      <div class="comment__list f12 mb10  border-solid-d7d7d7">
          <div class="item">
            <div class="flex mb5">
              <p class="flex-auto color-999">订单创建：{{info.createTime | datetime('YYYY/MM/DD hh:mm')}} {{info.createByName}}</p>
              <p class="color-1fb8ff">{{info.orderStatusDesc}}</p>
            </div>
            <p class="color-999 mb5">预计到货：{{info.expectedReceiveDate | datetime('YYYY/MM/DD')}}</p>
            <p class="color-666 bold">订单金额：&yen;{{info.orderTotalAmount/100}}</p>
          </div>
          <div class="item">
            <div class="flex mb5 color-666">
              <p class="flex-auto">订单支数：{{(info.orderTotalNum > 99999) ? '99999+' : info.orderTotalNum}}（{{(info.orderTotalCase > 99999) ? '99999+' : (Number(info.orderTotalCase)).toFixed(1)}}箱）</p>
              <p>至尊(盒)：{{(info.orderZzTotalNum > 99999) ? '99999+' : info.orderZzTotalNum}}</p>
            </div>
            <div class="flex mb5 color-666">
              <p class="flex-auto">已收支数：{{(info.rTotalNum > 99999) ? '99999+' : info.rTotalNum}}（{{(info.rTotalCase > 99999) ? '99999+' : (Number(info.rTotalCase)).toFixed(1)}}箱）</p>
              <p>至尊(盒)：{{(info.rZzTotalNum > 99999) ? '99999+' : info.rZzTotalNum}}</p>
            </div>
            <div class="flex color-666">
              <p class="flex-auto">待收支数：{{(info.orderTotalNum - info.rTotalNum > 99999) ? '99999+' : (info.orderTotalNum - info.rTotalNum).toFixed(1)}}（{{(info.orderTotalCase - info.rTotalCase > 99999) ? '99999+' : (info.orderTotalCase - info.rTotalCase).toFixed(1)}}箱）</p>
              <p>至尊(盒):{{(info.orderZzTotalNum - info.rZzTotalNum > 99999) ? '99999+' : info.orderZzTotalNum - info.rZzTotalNum}}</p>
            </div>
          </div>
        </div>
      <div class="border-solid-d7d7d7 mb10" v-if="orderProductList.length > 0">
        <div class="comment__column">产品明细</div>
        <ul class="comment__list f14">
            <li class="item" v-for="item in orderProductList">
              <div class="flex mb10">
                <p class="flex-auto">{{item.prdName}}</p>
                <p class="color-999 f12">箱规：{{item.pack}}</p>
              </div>
              <div class="flex">
                <p class="flex-auto color-ff6c47">&yen;{{(item.orderAmount/100).toFixed(2)}}</p>
                <p>支数：{{item.orderNum}} ({{item.orderCase}}箱)</p>
              </div>
            </li>
          </ul>
      </div>
      <div class="comment__column mb10" v-if="info.remark">
        <p class="mb10">备注</p>
        <p class="color-999">{{info.remark}}</p>
      </div>
      <div class="border-solid-d7d7d7 mb10" v-if="feedbackInfoList.length > 0">
        <div class="comment__column">评价信息</div>
        <ul class="comment__list comment f14">
            <li class="item" v-for="item in feedbackInfoList">
              <div class="flex">
                <div class="flex-auto">
                  <p>{{item.createTimestamp | datetime}} {{item.type === 'reply' ? '回复' : '评价'}}</p>
                  <p>{{item.content}}</p>
                  <p v-if="item.agreeNum">赞（{{item.agreeNum}}）</p>
                  <p v-if="item.disagreeNum">踩（{{item.disagreeNum}}）</p>
                </div>
                <a :href="'tel:' + item.createByPhone" class="comment__user phone" v-if="item.createBy !== info.userCode">
                  <p>{{item.createByName}}</p>
                </a>
                <p class="comment__user" v-else>{{item.createByName}}</p>
              </div>
            </li>
          </ul>
      </div>
    </section>
    <div class="comment__form" slot="footer">
      <textarea class="textarea mb10" rows="3" placeholder="请填写评价内容，200字以内。" v-model="content" maxlength="200"></textarea>
      <div class="flex">
        <p class="comment__agree disagree flex-auto" @click="disagree" :class="{'active': disagreeNum}">踩 {{ (disagreeNum ? '(' + disagreeNum + ')' : '') }}</p>
        <p class="comment__agree flex-auto" @click="agree" :class="{'active': agreeNum}">赞 {{ (agreeNum ? '(' + agreeNum + ')' : '') }}</p>
        <button class="comment__submit" @click="comment">提交评价</button>
      </div>
    </div>
  </bm-layout>
</template>
<style lang="less" scoped>
  .color-1fb8ff { color: #1fb8ff; }
  .mb5 { margin-bottom: .05rem; }
  .mb10 { margin-bottom: .1rem; }
  .f12 { font-size: .12rem; }
  .f14 { font-size: .14rem; }
  .border-solid-d7d7d7 { border-bottom: solid 1px #d7d7d7; }
  .flex-auto {
    margin-right: .1rem;
  }
  .comment__container {
    padding-left: .1rem;
    background: #fff;
  }
  .comment__list {
    padding-left: .1rem;
    background: #fff;
    .item {
      padding-top: .1rem;
      padding-bottom: .1rem;
      padding-right: .1rem;
      border-bottom: solid 1px #e5e5e5;
      &:last-child {
        border-bottom: none;
      }
    }
    &.comment {
      padding-bottom: .1rem;
      color: #666;
      font-size: .12rem;
      .item {
        border-bottom: none;
        padding-bottom: 0;
      }
    }
  }
  .comment__column {
    padding: .15rem .1rem;
    border-bottom: solid 1px #e5e5e5;
    background: #fff;
    font-size: .15rem;
    &.title {
      padding-left: 0;
    }
  }
  .comment__user {
    padding-right: .23rem;
    color: #666;
    font-size: .12rem;
    &.phone {
      color: #1fb8ff;
      background: url('~@/assets/storeOrder/callOut@2x.png') no-repeat top right / .18rem .18rem;
    }
  }
  .comment__form {
    padding: .1rem;
    background: #fff;
    box-shadow: 0 -2px 8px rgba(0, 0, 0, .2);
    .textarea {
      width: 100%;
      padding: .1rem;
      background: #fbfbfb;
      border: solid 1px #d7d7d7;
      border-radius: 2px;
      resize: none;
      font-size: .14rem;
    }
  }
  .comment__agree {
      padding-left: .26rem;
      color: #666;
      font-size: .15rem;
      background: url('~@/assets/storeOrder/ic_thumbsUp.png') no-repeat left center / .16rem auto;
      line-height: .4rem;
      &.disagree {
        background-image: url('~@/assets/storeOrder/ic_thumbsDown_grey.png');
      }
      &.active {
        background-image: url('~@/assets/storeOrder/ic_thumbsUp_blue.png');
        color: #1fb8ff;
        &.disagree {
          background-image: url('~@/assets/storeOrder/ic_thumbsDown_blue.png');
        }
      }
    }
    .comment__submit {
      width: 1.2rem;
      height: .4rem;
      background: #ff6c47;
      color: #fff;
      border-radius: 4px;
      border: none;
      font-size: .15rem;
    }
</style>
<script>
  import api from '@/api'
  import { MessageBox } from 'mint-ui'
  export default {
    data () {
      return {
        info: {},
        content: '',
        agreeNum: 0,
        disagreeNum: 0,
        orderProductList: [],
        feedbackInfoList: []
      }
    },
    methods: {
      getOrder (orderCode) {
        api.storeOrder.getStoreOrderDetail({
          data: {
            orderCode: orderCode,
            token: simpleLocalDb.getItem('token')
          }
        }).then(res => {
          if (res.responseCode === 0) {
            this.info = res.orderInfo
            this.orderProductList = res.orderInfo.orderProductList
            this.feedbackInfoList = res.orderInfo.feedbackInfoList
          } else {
            MessageBox.alert(res.responseMsg)
          }
        })
      },
      agree () {
        this.disagreeNum = 0
        if (this.agreeNum < 5) {
          this.agreeNum++
        }
      },
      disagree () {
        this.agreeNum = 0
        if (this.disagreeNum < 5) {
          this.disagreeNum++
        }
      },
      comment () {
        if (!this.agreeNum && !this.disagreeNum && !this.content) {
          return MessageBox.alert('请输入评价内容或者点评。')
        }
        api.storeOrder.addComment({
          data: {
            agreeNum: this.agreeNum,
            content: this.content,
            disagreeNum: this.disagreeNum,
            orderCode: this.$route.query.orderCode,
            token: simpleLocalDb.getItem('token'),
            type: 'appraise'
          }
        }).then(res => {
          if (res.responseCode === 0) {
            this.$router.back()
            this.$store.dispatch('storeOrder/resetData')
          } else {
            MessageBox.alert(res.responseMsg)
          }
        })
      }
    },
    mounted () {
      this.getOrder(this.$route.query.orderCode)
    }
  }
</script>
