<template>
  <bm-layout class="m_store-order-detail" ref="bmLayout">
    <bm-header class="m_head" slot="header">门店订单详情<button class="cancel" slot="right" @click="cancel" v-if="info.orderStatus === 'waitReceive' && info.ownOrder && !isHideCancel">取消订单</button></bm-header>
    <section :class="['m_main', { 'm_main-canceled': canceled }]">
      <header :class="['m_overview', { 'm_overview-toggled': toggle }]">
        <h2 class="box code flex items-center" @click="switchTitle">
          <p class="flex-auto">{{info.orderCode}} {{info.storeName}}</p>
          <span class="switch" :class="{'open': !toggle}">{{toggle ? '展开' : '收起'}}</span>
        </h2>
        <transition name="toggle">
          <div v-show="!toggle">
            <div class="box with-status">
              <ul>
                <li class="create">订单创建：{{info.createTimestamp | datetime('YYYY/MM/DD')}} {{info.createByName}}</li>
                <li class="reach">预计到货：{{info.expectedReceiveDate | datetime('YYYY/MM/DD')}}</li>
                <li class="money">订单金额：&yen;{{(info.orderTotalAmount/100).toFixed(2)}}</li>
              </ul>
              <span class="status">{{info.orderStatusDesc}}</span>
            </div>
            <ul class="box">
              <li class="line">
                <span class="mount-left">订单支数：{{(info.orderTotalNum > 99999) ? '99999+' : info.orderTotalNum}}（{{(info.orderTotalCase > 99999) ? '99999+' : Number(info.orderTotalCase).toFixed(1)}}箱）</span>
                <span class="mount-right">至尊(盒)：{{(info.orderZzTotalNum > 99999) ? '99999+' : info.orderZzTotalNum}}</span>
              </li>
              <li class="line">
                <span class="mount-left">已收支数：{{(info.rTotalNum > 99999) ? '99999+' : info.rTotalNum}}（{{(info.rTotalCase > 99999) ? '99999+' : Number(info.rTotalCase).toFixed(1)}}箱）</span>
                <span class="mount-right">至尊(盒)：{{(info.rZzTotalNum > 99999) ? '99999+' : info.rZzTotalNum}}</span>
              </li>
              <li class="line">
                <span class="mount-left">待收支数：{{(info.difTotalNum > 99999) ? '99999+' : (info.difTotalNum)}}（{{(info.difTotalCase > 99999) ? '99999+' : (Number(info.difTotalCase).toFixed(1))}}箱）</span>
                <span class="mount-right">至尊(盒)：{{(info.difZzTotalNum > 99999) ? '99999+' : (info.difZzTotalNum)}}</span>
              </li>
            </ul>
          </div>
        </transition>
      </header>
      <!-- 已取消的订单时候显示 -->
      <div class="m_cancel-detail" v-if="canceled">
        <div class="orders" v-if="orderProductList.length > 0">
          <h4 class="orders-title">产品明细</h4>
          <ul>
            <li class="line" v-for="item in orderProductList">
              <div class="small-line">
                <span>{{item.prdName}}</span>
                <span class="size">箱规：{{item.pack}}</span>
              </div>
              <div class="small-line">
                <span class="money">&yen;{{(item.orderAmount/100).toFixed(2)}}</span>
                <span>支数：{{item.orderNum}} ({{item.orderCase.toFixed(1)}}箱)</span>
              </div>
            </li>
          </ul>
        </div>
        <div class="block" v-if="info.remark">
          <h4 class="title">备注</h4>
          <p class="backup">{{info.remark}}</p>
        </div>
        <div class="evaluates" v-if="feedbackInfoList.length > 0">
          <h4 class="title-evaluate">评价信息</h4>
          <ul class="evaluates-list">
            <li class="evaluate-line" v-for="item in feedbackInfoList">
              <div class="evaluate-key">
                <p>{{item.createTimestamp | datetime}} {{item.type === 'reply' ? '回复' : '评价'}}</p>
                <p>{{item.content}}</p>
                <p v-if="item.agreeNum">赞（{{item.agreeNum}}）</p>
                <p v-if="item.disagreeNum">踩（{{item.disagreeNum}}）</p>
              </div>
              <a :href="'tel:' + item.createByPhone" v-if="item.createBy !== info.userCode">
                <p class="evaluate-user phone">{{item.createByName}}</p>
              </a>
              <p class="evaluate-user" v-else>{{item.createByName}}</p>
            </li>
          </ul>
        </div>
      </div>
      <!-- 大部分状态时显示的内容 -->
      <div class="m_detail" v-else>
        <nav class="m_detail-nav">
          <button :class="['nav', { 'active': tab === 'ORDER' }]" @click="tab = 'ORDER'">订单信息</button>
          <button :class="['nav', { 'active': tab === 'RECEIVE' }]" @click="tab = 'RECEIVE'">收货单</button>
        </nav>
        <section class="m_detail-content">
          <!-- 订单信息 -->
          <div class="m_detail-content-order" v-show="!tab || tab === 'ORDER'">
            <ul class="orders">
              <li class="line" v-for="item in orderProductList">
                <div class="small-line">
                  <span>{{item.prdName}}</span>
                  <span class="size">箱规：{{item.pack}}</span>
                </div>
                <div class="small-line">
                  <span class="money">&yen;{{(item.orderAmount/100).toFixed(2)}}</span>
                  <span>支数：{{item.orderNum}} ({{item.orderCase.toFixed(1)}}箱)</span>
                </div>
              </li>
            </ul>
            <div class="block" v-if="info.remark">
              <h4 class="title">备注</h4>
              <p class="backup">{{info.remark}}</p>
            </div>
            <div class="evaluates" v-if="feedbackInfoList.length > 0">
              <h4 class="title-evaluate">评价信息</h4>
              <ul class="evaluates-list">
                <li class="evaluate-line" v-for="item in feedbackInfoList">
                  <div class="evaluate-key flex-auto">
                    <p>{{item.createTimestamp | datetime}} {{item.type === 'reply' ? '回复' : '评价'}}</p>
                    <p>{{item.content}}</p>
                    <p v-if="item.agreeNum">赞（{{item.agreeNum}}）</p>
                    <p v-if="item.disagreeNum">踩（{{item.disagreeNum}}）</p>
                  </div>
                  <a :href="'tel:' + item.createByPhone" v-if="item.createBy !== info.userCode">
                    <p class="evaluate-user phone">{{item.createByName}}</p>
                  </a>
                  <p class="evaluate-user" v-else>{{item.createByName}}</p>
                </li>
              </ul>
            </div>
          </div>
          <!-- 收货单 -->
          <div class="m_detail-content-receive" v-show="tab === 'RECEIVE'">
            <!-- 单个收货单 -->
            <template v-if="orderReceiveList.length === 1">
              <div class="block main">
                <span class="code">{{orderReceiveList[0].rCode}}</span>
                <span class="date">收货日期：{{orderReceiveList[0].rDate | datetime('YYYY/MM/DD')}}</span>
              </div>
              <div class="block">
                <p class="overview">至尊(盒)：{{(orderReceiveList[0].rZzTotalNum > 99999) ? '99999+' : orderReceiveList[0].rZzTotalNum}} 总支数：{{(orderReceiveList[0].rTotalNum > 99999) ? '99999+' : orderReceiveList[0].rTotalNum}} ({{(orderReceiveList[0].rTotalCase > 99999) ? '99999+' : orderReceiveList[0].rTotalCase}}箱)</p>
                <ul class="list">
                  <li class="line" v-for="item in orderReceiveList[0].receiveDetail.productListInfo">
                    <p class="product">{{item.prdName}}</p>
                    <p class="detail"><span class="size">箱规：{{item.pack}}</span><span>支数：{{item.rNum}} ({{item.rCase.toFixed(1)}}箱)</span></p>
                  </li>
                </ul>
              </div>
              <div class="block evidence">
                <p class="evidence-title">收货凭证</p>
                <div class="flex flex-wrap border-solid-e5e5e5">
                  <div class="imgs" v-for="item in orderReceiveList[0].receiveDetail.receiveEvidence" @click="grass(item)"><span class="img" :style="{'backgroundImage':'url('+item+')'}"></span></div>
                </div>
              </div>
              <div class="block backup" v-if="orderReceiveList[0].remark">
                <p class="backup-title">备注</p>
                <p class="backup-content">{{orderReceiveList[0].remark}}</p>
              </div>
            </template>
            <!-- 多个收货单 -->
            <template v-else>
              <ul>
                <li class="multi-line" v-for="item in orderReceiveList" @click="goReceiveDetail(item.rCode)">
                  <p>{{item.rCode}}</p>
                  <p class="multi-date">收货日期：{{item.rDate | datetime('YYYY/MM/DD')}}</p>
                  <p class="multi-count">收货支数：{{item.rTotalNum}} ({{item.rTotalCase}}箱)，至尊(盒)：{{item.rZzTotalNum}}</p>
                </li>
              </ul>
            </template>
          </div>
          <!-- 空收货单 -->
          <div class="m_detail-content-empty" v-show="tab === 'RECEIVE' && orderReceiveList.length === 0">订单还没有收货信息哦~</div>
        </section>
      </div>
    </section>
    <section class="m_imgage_cover" slot="left" v-if="isShowGrass" @click="grass">
      <img class="m_pic" :src="grassImg" />
    </section>
  </bm-layout>
</template>
<script>
  import api from '@/api'
  import { MessageBox } from 'mint-ui'
  export default {
    data () {
      return {
        tab: 'ORDER',
        canceled: false, // 是否为已取消订单
        toggle: false, // 是否收起的标识
        orderProductList: [],
        feedbackInfoList: [],
        info: {},
        orderReceiveList: [],
        isShowGrass: false, // 是否显示图片放大
        grassImg: '', // 需要放大的图片
        isHideCancel: false // 是否外链进入默认不显示取消操作
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
      getOrderReceiveList (orderCode) {
        api.storeOrder.getOrderReceiveList({
          data: {
            orderCode: orderCode,
            token: simpleLocalDb.getItem('token')
          }
        }).then(res => {
          if (res.responseCode === 0) {
            this.orderReceiveList = res.orderReceiveList
          } else {
            MessageBox.alert(res.responseMsg)
          }
        })
      },
      switchTitle () {
        this.toggle = !this.toggle
      },
      cancel () {
        MessageBox.confirm('是否取消订单？').then(action => {
          api.storeOrder.updateOrderStatus({
            data: {
              operationType: 'canceled',
              orderCode: this.$route.query.orderCode,
              token: simpleLocalDb.getItem('token')
            }
          }).then(res => {
            if (res.responseCode === 0) {
              MessageBox.alert('操作成功！').then(action => {
                this.$router.back()
                this.$store.dispatch('storeOrder/resetData')
              })
            } else {
              MessageBox.alert(res.responseMsg)
            }
          })
        }, () => {})
      },
      goReceiveDetail (rCode) {
        this.$router.push({path: '/storeOrder/receiveDetail', query: {orderCode: this.info.orderCode, rCode: rCode}})
      },
      grass (imgSrc) {
        this.isShowGrass = !this.isShowGrass
        if (this.isShowGrass && imgSrc) {
          this.grassImg = imgSrc
        }
      }
    },
    beforeRouteEnter (to, from, next) {
      if (from.path === '/storeOrder/receiveDetail') {
        next(vm => {
          vm.tab = 'RECEIVE'
        })
      } else {
        next()
      }
    },
    mounted () {
      if (this.$route.query.isHideCancel) this.isHideCancel = this.$route.query.isHideCancel
      this.getOrder(this.$route.query.orderCode)
      this.getOrderReceiveList(this.$route.query.orderCode)
    }
  }
</script>
<style lang="less" scoped>
  @offset1: unit(10px / 100, rem);
  @offset2: unit(15px / 100, rem);
  @color1: #1FB8FF;
  @color2: #FF6C47;
  @color_b1: #E5E5E5;
  @color_b2: #D7D7D7;
  @color_text1: #333;
  @color_sub1: #666;
  @color_sub2: #999;
  @size1: unit(13px / 100, rem);
  @size2: unit(12px / 100, rem);
  @size3: unit(15px / 100, rem);
  button {
    border: none;
    color: inherit;
  }
  .border-solid-e5e5e5 { border-top: solid 1px #e5e5e5; }
  .m_store-order-detail {
    color: @color_text1;
    font-size: @size1;
    line-height: 1.3;
  }
  .m_head {
    .cancel {
      font-size: @size1;
      color: #fff;
      text-decoration: underline;
      padding: 0 @offset1;
    }
  }
  .m_main {
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    overflow: hidden;
    display: flex;
    flex-direction: column;
    &-canceled {
      position: static;
      width: auto;
      height: auto;
      display: block;
      overflow: auto;
    }
    .m_overview {
      border-bottom: 1px solid @color_b2;
      background-color: #fff;
      padding-left: @offset1;
      margin-bottom: @offset1;
      transition: margin 0.2s;
      overflow: hidden;
      &-toggled {
        margin-bottom: 0;
      }
      .toggle-enter-active, .toggle-leave-active {
        transition: max-height 0.2s
      }
      .toggle-enter-active, .toggle-leave {
        max-height: 15em;
      }
      .toggle-enter, .toggle-leave-to {
        max-height: 0
      }
      .box {
        border-top: 1px solid @color_b1;
        padding: @offset1;
        padding-left: 0;
      }
      .code {
        font-weight: normal;
        font-size: @size3;
        color: @color_text1;
        border-top: none;
        .switch {
          height: 1.2em;
          padding-left: .1rem;
          color: #999;
          font-size: .12rem;
          &:after {
            content: '';
            display: inline-block;
            width: .1rem;
            height: 100%;
            margin-left: .05rem;
            background: url('~@/assets/storeOrder/downArrow.png') no-repeat right center / .1rem auto;
            vertical-align: middle;
          }
          &.open:after {
            transform:rotate(180deg);
          }
        }
      }
      .with-status {
        display: flex;
        justify-content: space-between;
      }
      .create, .reach, .money {
        font-size: @size2;
        color: @color_sub2;
      }
      .money {
        font-weight: bold;
        color: @color_sub1;
      }
      .status {
        font-size: @size2;
        color: @color1;
      }
      .line {
        display: flex;
        justify-content: space-between;
        font-size: @size2;
        color: @color_sub1;
      }
      .mount-right {
        min-width: 9em;
        text-align: left;
        flex-shrink: 0;
      }
    }
    .m_cancel-detail {
      .block {
        display: block;
        border-bottom: 1px solid @color_b2;
        background-color: #fff;
        padding: @offset1;
        margin: @offset1 0;
      }
      .orders {
        border-bottom: 1px solid @color_b2;
        background-color: #fff;
        margin-bottom: @offset1;
      }
      .orders-title {
        font-weight: normal;
        font-size: @size3;
        padding: @offset2 @offset1;
        border-bottom: 1px solid @color_b2;
      }
      .line {
        margin-left: @offset1;
        padding: @offset1;
        padding-left: 0;
        border-top: 1px solid @color_b1;
        &:first-child {
          border-top: none;
        }
      }
      .small-line {
        display: flex;
        justify-content: space-between;
        margin-top: @offset1;
        &:first-child {
          margin-top: 0;
        }
      }
      .size {
        font-size: @size2;
        color: @color_sub2;
        flex-shrink: 0;
        margin-left: @offset1;
      }
      .money {
        color: @color2;
      }
      .title {
        font-size: @size3;
        margin: @offset1 / 2 0;
        font-weight: normal;
      }
      .backup {
        color: @color_sub1;
        margin-top: @offset1;
      }
      .evaluates {
        border-bottom: 1px solid @color_b2;
        background-color: #fff;
      }
      .title-evaluate {
        font-size: @size3;
        font-weight: normal;
        padding: (@offset1 + @offset1 / 2) @offset1;
        border-bottom: 1px solid @color_b2;
      }
      .evaluate-line {
        display: flex;
        justify-content: space-between;
        align-items: flex-start;
        font-size: @size2;
        color: @color_sub1;
        margin: @offset1;
      }
      .evaluate-user {
        width: 6em;
        padding-right: .23rem;
        padding-left: .1rem;
        color: #666;
        font-size: .12rem;
        &.phone {
          color: #1fb8ff;
          background: url('~@/assets/storeOrder/callOut@2x.png') no-repeat top right / .18rem .18rem;
        }
      }
      .evaluate-btn {
        flex-shrink: 0;
        margin-left: @offset1 * 2;
        min-width: 5em;
        text-align: center;
      }
      .phone {
        display: inline-block;
        width: unit(18px / 100, rem);
        height: unit(18px / 100, rem);
        background: center no-repeat blue;
        background-size: contain;
        vertical-align: middle;
        margin-left: unit(5px / 100, rem);
      }
      .has-phone {
        color: @color1;
      }
    }
    .m_detail {
      flex-grow: 1;
      position: relative;
      .m_detail-nav {
        position: absolute;
        top: 0;
        left: 0;
        height: unit(35px / 100, rem);
        width: 100%;
        border-bottom: 1px solid @color_b2;
        background-color: #fff;
        display: flex;
        .nav {
          flex-grow: 1;
          display: block;
          width: 50%;
          font-size: @size1;
          color: @color_sub2;
          position: relative;
        }
        .active {
          color: @color1;
        }
        .active:after {
          content: "";
          position: absolute;
          width: unit(20px / 100, rem);
          height: 3px;
          left: 0;
          right: 0;
          bottom: 0;
          margin-left: auto;
          margin-right: auto;
          background-color: @color1;
        }
      }
      .m_detail-content {
        position: absolute;
        top: unit(35px / 100, rem);
        left: 0;
        width: 100%;
        bottom: 0;
        overflow: hidden;
        overflow-y: auto;
        .m_detail-content-order {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          overflow: hidden;
          overflow-y: auto;
          .block {
            display: block;
            border-bottom: 1px solid @color_b2;
            background-color: #fff;
            padding: @offset1;
            margin: @offset1 0;
          }
          .orders {
            border-bottom: 1px solid @color_b2;
            padding-left: @offset1;
            background-color: #fff;
            margin-bottom: @offset1;
          }
          .line {
            padding: @offset1;
            padding-left: 0;
            border-top: 1px solid @color_b1;
            &:first-child {
              border-top: none;
            }
          }
          .small-line {
            display: flex;
            justify-content: space-between;
            margin-top: @offset1;
            &:first-child {
              margin-top: 0;
            }
          }
          .size {
            font-size: @size2;
            color: @color_sub2;
            flex-shrink: 0;
            margin-left: @offset1;
          }
          .money {
            color: @color2;
          }
          .title {
            font-size: @size3;
            margin: @offset1 / 2 0;
            font-weight: normal;
          }
          .backup {
            color: @color_sub1;
            margin-top: @offset1;
          }
          .evaluates {
            border-bottom: 1px solid @color_b2;
            background-color: #fff;
          }
          .title-evaluate {
            font-size: @size3;
            font-weight: normal;
            padding: (@offset1 + @offset1 / 2) @offset1;
            border-bottom: 1px solid @color_b2;
          }
          .evaluate-line {
            display: flex;
            justify-content: space-between;
            align-items: flex-start;
            font-size: @size2;
            color: @color_sub1;
            margin: @offset1;
          }
          .evaluate-user {
            width: 6em;
            padding-right: .23rem;
            padding-left: .1rem;
            color: #666;
            font-size: .12rem;
          &.phone {
             color: #1fb8ff;
             background: url('~@/assets/storeOrder/callOut@2x.png') no-repeat top right / .18rem .18rem;
           }
          }
          .evaluate-btn {
            flex-shrink: 0;
            margin-left: @offset1 * 2;
            min-width: 5em;
            text-align: center;
          }
          .phone {
            display: inline-block;
            height: unit(18px / 100, rem);
            line-height: unit(18px / 100, rem);
            background: center no-repeat blue;
            background-size: contain;
            vertical-align: middle;
            margin-left: unit(5px / 100, rem);
          }
          .has-phone {
            color: @color1;
          }
        }
        .m_detail-content-receive {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          overflow: hidden;
          overflow-y: auto;
          .block {
            display: block;
            background-color: #fff;
            border-bottom: 1px solid @color_b2;
            margin-top: @offset1;
            &:first-child {
              margin-top: 0;
            }
          }
          .main {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: @offset1 @offset1;
          }
          .code {
            font-size: @size3;
          }
          .date {
            font-size: @size2;
            color: @color_sub2;
          }
          .overview {
            color: @color_sub1;
            font-size: @size2;
            padding: @offset2 @offset1;
          }
          .list {
            display: block;
            border-top: 1px solid @color_b1;
            padding-left: @offset1;
          }
          .line {
            display: block;
            border-top: 1px solid @color_b1;
            padding: @offset1;
            padding-left: 0;
            &:first-child {
              border-top: none;
            }
          }
          .detail {
            display: flex;
            justify-content: space-between;
            margin-top: @offset1;
            align-items: center;
          }
          .size {
            color: @color_sub2;
            font-size: @size2;
          }
          .evidence {
            padding-left: @offset1;
          }
          .evidence-title {
            padding: @offset1;
            padding-left: 0;
          }
          .imgs {
            display: flex;
          }
          .img {
            display: block;
            width: unit(60px / 100, rem);
            height: unit(60px / 100, rem);
            background: center no-repeat @color_b2;
            background-size: cover;
            margin: @offset2 @offset1;
          }
          .backup {
            padding: @offset1;
          }
          .backup-title {
            font-size: @size3;
          }
          .backup-content {
            margin-top: @offset1;
            color: @color_sub1;
          }
          .multi-line {
            display: blockk;
            border-bottom: 1px solid @color_b2;
            padding: @offset2 @offset1;
            background-color: #fff;
            padding-right: unit(30px / 100, rem);
            position: relative;
            &:after {
              content: "";
              position: absolute;
              width: unit(12px / 100, rem);
              height: unit(12px / 100, rem);
              background: url('~@/assets/common/rightArrow.png') no-repeat center / auto 100%;
              right: @offset1;
              top: 50%;
              margin-top: -unit(6px / 100, rem);
            }
          }
          .multi-date, .multi-count {
            margin-top: @offset1;
          }
          .multi-date {
            font-size: @size2;
          }
          .multi-count {
            color: @color_sub2;
            font-size: @size2;
          }
        }
      }
      .m_detail-content-empty {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        overflow: hidden;
        background-color: #fff;
        text-align: center;
        padding-top: unit(100px / 100, rem);
        font-size: @size3;
        color: @color_sub2;
      }
    }
  }
  .m_imgage_cover {
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    background: rgba(0, 0, 0, .4);
    .m_pic {
      max-width: 100%;
      max-height: 100%;
      position: absolute;
      top: 0;
      left: 0;
      bottom: 0;
      right: 0;
      margin: auto;
    }
  }
</style>
