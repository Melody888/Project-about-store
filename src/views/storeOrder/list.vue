<template>
  <bm-layout class="m_store-order-list" ref="bmLayout">
    <header class="m_head" slot="header">
      <bm-header>
        <template v-if="tab === 'STORE'">
          <p>门店订单</p>
          <button class="link" slot="right" @click="openBook" v-if="book"><i class="book"></i><span>操作手册</span></button>
        </template>
        <template v-if="tab === 'HISTORY'">
          <p>历史订单</p>
          <button class="link" @click="filtering = !filtering" slot="right"><i class="filter"></i><span>筛选</span></button>
        </template>
      </bm-header>
      <div class="c_box store" v-show="tab === 'STORE'" v-if="handleOrderData">
        <p>总额 <span class="store-count">￥{{(handleOrderData.allTotalAmount/100).toFixed(2)}}</span></p>
        <p>订单数 <span class="store-count">{{handleOrderData.orderCount}}</span></p>
        <p>至尊(盒) <span class="store-count">{{handleOrderData.allZzTotalNum}}</span></p>
      </div>
      <div class="history" v-show="tab === 'HISTORY' && !filtering" v-if="historyOrderData">
        <button class="select" @click="$refs.pickerDate.open()">
          <span class="select-text">{{datePicker.getFullYear()}}</span>
          <span class="select-text"><span class="month">{{datePicker.getMonth() + 1}}</span>月 <i class="tri"></i></span>
        </button>
        <ul class="detail">
          <li class="total">订单总金额 <span class="count">￥{{(historyOrderData.allTotalAmount/100).toFixed(2)}}</span></li>
          <li class="line">
            <span class="half">订单总支数 <span class="count">{{historyOrderData.allTotalNum}}</span></span>
            <span class="half">订单至尊(盒) <span class="count">{{historyOrderData.allZzTotalNum}}</span></span>
          </li>
          <li class="line">
            <span class="half">收货总支数 <span class="count">{{historyOrderData.allRTotalNum}}</span></span>
            <span class="half">收货至尊(盒) <span class="count">{{historyOrderData.allRZzTotalNum}}</span></span>
          </li>
        </ul>
      </div>
    </header>
    <div class="mask" v-if="commentDisplay" @click="commentDisplay = false"></div>
    <section class="m_content">
      <div class="m_main">
        <bm-loadmore :top-method="loadList" ref="loadList_1"  v-if="tab === 'STORE'">
          <ul
              v-infinite-scroll="loadMore"
              infinite-scroll-disabled="loading"
              infinite-scroll-distance="20">
            <li class="c_box item" v-for="(item, index) in handleOrderList">
              <router-link class="line head" :to="{path: '/storeOrder/detail', query: {orderCode: item.orderCode}}">
                <span class="head-code">{{item.orderCode}}</span>
                <span class="head-status">{{item.orderStatusDesc}}</span>
                <span class="head-more">详情</span>
                <i class="right head-right"></i>
              </router-link>
              <div class="line overview">
                <div class="overview-left flex-auto">
                  <p class="overview-store"><span class="ellipsis-content">{{item.storeName}}</span></p>
                  <p class="overview-detail overview-create">订单创建：{{item.createTimestamp | datetime('date')}} {{item.createByName}}</p>
                  <p class="overview-detail">预计到货：{{item.expectedReceiveDate | datetime('date')}}</p>
                  <div class="overview-detail overview-count flex">
                    <p class="flex-auto">订单金额：￥{{(item.orderTotalAmount/100).toFixed(2)}}</p>
                    <button class="eval-reply" v-if="item.canComment && !item.ownOrder" @click="goComment(item.orderCode)">评价</button>
                  </div>
                </div>
                <div class="overview-btns">
                  <button class="overview-btn overview-receive" v-if="item.ownOrder && (item.orderStatus === 'partReceive' || item.orderStatus === 'waitReceive')" @click="goReceive(item.orderCode)">收 货</button>
                  <button class="overview-btn overview-finish" v-if="item.ownOrder && item.orderStatus === 'partReceive'"  @click="operaOrder(item.orderCode, 'closed')">结 案</button>
                  <button class="overview-btn overview-edit" @click="goEdit(item.orderCode)" v-if="item.edit">编 辑</button>
                </div>
              </div>
              <ul class="line count">
                <li class="count-line count-all"><span class="count-left">订单支数：{{item.orderTotalNum>99999?'99999+':item.orderTotalNum}} ({{item.orderTotalCase>9999?'9999+':(Number(item.orderTotalCase)).toFixed(1)}}箱)</span><span>至尊(盒)：{{item.orderZzTotalNum}}</span></li>
                <li class="count-line" v-if="item.orderStatus !== 'waitReceive'"><span class="count-left">已收支数：{{item.rTotalNum>99999?'99999+':item.rTotalNum}} ({{item.rTotalCase>9999?'9999+':(Number(item.rTotalCase)).toFixed(1)}}箱)</span><span>至尊(盒)：{{item.rZzTotalNum}}</span></li>
                <li class="count-line" v-if="item.orderStatus !== 'waitReceive'"><span class="count-left">待收支数：{{item.difTotalNum>99999?'99999+':item.difTotalNum}} ({{item.difTotalCase>9999?'9999+':(Number(item.difTotalCase)).toFixed(1)}}箱)</span><span>至尊(盒)：{{item.difZzTotalNum}}</span></li>
              </ul>
              <router-link class="line sent" :to="{path: '/storeOrder/deliverList', query: {orderCode: item.orderCode}}" v-if="item.orderDeliveryList.length > 0">
                <p class="sent-line" v-for="innerItem in item.orderDeliveryList"><span class="sent-left">{{innerItem.fDate | datetime('M/DD')}}发货 总支数:{{innerItem.fTotalNum}}({{(Number(innerItem.fTotalCase)).toFixed(1)}}箱)</span><span class="sent-right">至尊(盒):{{innerItem.fZzTotalNum}}</span></p>
                <i class="right sent-arrow"></i>
              </router-link>
              <div class="line eval" v-if="item.feedbackInfoList.length > 0">
                <div class="eval-head">
                  <div class="eval-left"><span>评价信息：{{item.feedbackInfoList.length}}条</span><button class="eval-reply" v-if="item.ownOrder && item.canComment" @click="openComment(item, index)">回复</button></div>
                  <div><button class="eval-toggle" :class="{'open': !item.isFold}" @click="operaFold(index, 'STORE')">{{item.isFold ? '展开' : '收起'}}</button></div>
                </div>
                <ul class="eval-evals" v-if="item.isFold">
                  <li class="eval-eval" v-for="(evalItem, index) in item.feedbackInfoList" v-if="index < 1">{{evalItem.createTimestamp | datetime('date')}} {{evalItem.createByName}}：{{evalItem.content}}<template v-if="evalItem.content === '' && evalItem.agreeNum > 0">赞（{{evalItem.agreeNum}}）</template><template v-if="evalItem.content === '' && evalItem.disagreeNum > 0">踩（{{evalItem.disagreeNum}}）</template></li>
                </ul>
                <ul class="eval-evals" v-else>
                  <li class="eval-eval" v-for="(evalItem, index) in item.feedbackInfoList">{{evalItem.createTimestamp | datetime('date')}} {{evalItem.createByName}}：{{evalItem.content}}<template v-if="evalItem.content === '' && evalItem.agreeNum > 0">赞（{{evalItem.agreeNum}}）</template><template v-if="evalItem.content === '' && evalItem.disagreeNum > 0">踩（{{evalItem.disagreeNum}}）</template></li>
                </ul>
              </div>
            </li>
          </ul>
        </bm-loadmore>
        <bm-loadmore :top-method="loadList" ref="loadList_2" v-if="tab === 'HISTORY'">
          <ul
              v-infinite-scroll="loadMore"
              infinite-scroll-disabled="loading"
              infinite-scroll-distance="20">
            <li class="c_box item" v-for="(item, index) in historyOrderList">
              <router-link class="line head" :to="{path: '/storeOrder/detail', query: {orderCode: item.orderCode}}">
                <span class="head-code">{{item.orderCode}}</span>
                <span class="head-status">{{item.orderStatusDesc}}</span>
                <span class="head-more">详情</span>
                <i class="right head-right"></i>
              </router-link>
              <div class="line overview">
                <div class="overview-left flex-auto">
                  <p class="overview-store"><span class="ellipsis-content">{{item.storeName}}</span></p>
                  <p class="overview-detail overview-create">订单创建：{{item.createTimestamp | datetime('date')}} {{item.createByName}}</p>
                  <p class="overview-detail" v-if="item.orderStatus === 'canceled'">预计到货：{{item.expectedReceiveDate | datetime('date')}}</p>
                  <p class="overview-detail" v-else>收货日期：{{item.lastRDate | datetime('date')}}</p>
                  <div class="overview-detail overview-count flex">
                    <p class="flex-auto">订单金额：￥{{(item.orderTotalAmount/100).toFixed(2)}}</p>
                    <button class="eval-reply" v-if="item.canComment && !item.ownOrder" @click="goComment(item.orderCode)">评价</button>
                  </div>
                </div>
                <!--<div class="overview-btns">-->
                  <!--<button class="overview-btn overview-receive">收 货</button>-->
                  <!--<button class="overview-btn overview-finish" @click="operaOrder(item.orderCode, 'closed')">结 案</button>-->
                <!--</div>-->
              </div>
              <ul class="line count">
                <li class="count-line count-all"><span class="count-left">订单支数：{{item.orderTotalNum>99999?'99999+':item.orderTotalNum}} ({{(Number(item.orderTotalCase)).toFixed(1)}}箱)</span><span>至尊(盒)：{{item.orderZzTotalNum}}</span></li>
                <li class="count-line" v-if="item.orderStatus !== 'canceled'"><span class="count-left">已收支数：{{item.rTotalNum>99999?'99999+':item.rTotalNum}} ({{item.rTotalCase>9999?'9999+':(Number(item.rTotalCase)).toFixed(1)}}箱)</span><span>至尊(盒)：{{item.rZzTotalNum}}</span></li>
              </ul>
              <!--<router-link class="line sent" to="/" v-if="item.orderDeliveryList.length > 0">-->
                <!--<p class="sent-line" v-for="innerItem in item.orderDeliveryList"><span class="sent-left">{{innerItem.fDate | datetime('date')}}发货 总支数：{{innerItem.fTotalNum}} ({{innerItem.fTotalCase}}箱）</span><span class="sent-right">至尊(盒)：{{innerItem.fZzTotalNum}}</span></p>-->
                <!--<i class="right sent-arrow"></i>-->
              <!--</router-link>-->
              <div class="line eval"  v-if="item.feedbackInfoList.length > 0">
                <div class="eval-head">
                  <div class="eval-left"><span>评价信息：{{item.feedbackInfoList.length}}条</span><button class="eval-reply" v-if="item.ownOrder && item.canComment" @click="openComment(item, index)">回复</button></div>
                  <div><button class="eval-toggle" :class="{'open': !item.isFold}" @click="operaFold(index, 'HISTORY')">{{item.isFold ? '展开' : '收起'}}</button></div>
                </div>
                <ul class="eval-evals" v-if="item.isFold">
                  <li class="eval-eval" v-for="(evalItem, index) in item.feedbackInfoList" v-if="index < 1">{{evalItem.createTimestamp | datetime('date')}} {{evalItem.createByName}}：{{evalItem.content}}<template v-if="evalItem.content === '' && evalItem.agreeNum > 0">赞（{{evalItem.agreeNum}}）</template><template v-if="evalItem.content === '' && evalItem.disagreeNum > 0">踩（{{evalItem.disagreeNum}}）</template></li>
                </ul>
                <ul class="eval-evals" v-else>
                  <li class="eval-eval" v-for="(evalItem, index) in item.feedbackInfoList">{{evalItem.createTimestamp | datetime('date')}} {{evalItem.createByName}}：{{evalItem.content}}<template v-if="evalItem.content === '' && evalItem.agreeNum > 0">赞（{{evalItem.agreeNum}}）</template><template v-if="evalItem.content === '' && evalItem.disagreeNum > 0">踩（{{evalItem.disagreeNum}}）</template></li>
                </ul>
              </div>
            </li>
          </ul>
        </bm-loadmore>
        <bm-empty v-if="(tab === 'STORE' && handleOrderList.length === 0) || (tab === 'HISTORY' && historyOrderList.length === 0)"></bm-empty>
      </div>
      <button class="m_add" v-if="tab === 'STORE'" @click="goEdit('')">新增<br>订单</button>
      <nav class="m_tabs">
        <button :class="['tab', { 'active' : tab === 'STORE' }]" @click="changeList('STORE')">
          <i class="store" style="position: relative;">
          <span class="corner_count" v-if="handleOrderData && handleOrderData.cornerNum > 0">
            {{handleOrderData.cornerNum > 99 ? '99+' : handleOrderData.cornerNum }}
          </span></i>
          <div>门店订单</div>
        </button>
        <button :class="['tab', { 'active' : tab === 'HISTORY' }]" @click="changeList('HISTORY')">
          <i class="history"></i>
          <div>历史记录</div>
        </button>
      </nav>
      <aside v-show="filtering" class="m_filter" @click="filtering = false">
        <form class="form" @click.stop @submit.stop.prevent>
          <div class="label">
            <span class="key">门店</span><input class="input" type="text" v-model="storeKey" placeholder="请输入门店名称或编号"></span>
          </div>
          <div class="label">
            <span class="key">时间</span><input class="input" type="text" :value="popupDatePicker | datetime('dateym')" @click="$refs.popupPickerDate.open()" readonly></span>
          </div>
          <div class="btns">
            <button class="reset" @click="resetSearch">重&emsp;置</button>
            <button class="submit" @click="search">确&emsp;定</button>
          </div>
        </form>
      </aside>
    </section>
    <div slot="bottom">
      <div class="comment__form" v-if="commentDisplay">
        <textarea class="textarea mb10" v-focus rows="3" placeholder="填写回复信息" maxlength="100" v-model="content"></textarea>
        <div>
          <button class="comment__submit" @click="comment">提交回复</button>
        </div>
      </div>
    </div>
    <div slot="bottom">
      <bm-datetime-picker
          v-model="datePicker"
          ref="pickerDate"
          type="dateym"
          @confirm="filterJustDate">
      </bm-datetime-picker>
      <bm-datetime-picker
          v-model="popupDatePicker"
          ref="popupPickerDate"
          type="dateym">
      </bm-datetime-picker>
    </div>
  </bm-layout>
</template>
<script>
  import { mapGetters } from 'vuex'
  import api from '@/api'
  import { routerHistory } from '@/advanced/mixins'
  import { openDocument, webview } from '@/utils/native'
  export default {
    mixins: [routerHistory],
    data () {
      return {
        tab: 'STORE', // STORE | HISTORY
        filtering: false, // 打开筛选面板
        content: '',
        commentDisplay: false,
        commentCode: '',
        commentName: '',
        commentIndex: 0,
        datePicker: new Date(),
        popupDatePicker: new Date(),
        storeKey: '',
        book: ''
      }
    },
    computed: {
      ...mapGetters({
        handleOrderList: 'storeOrder/handleOrderList',
        historyOrderList: 'storeOrder/historyOrderList',
        handleOrderData: 'storeOrder/handleOrderData',
        historyOrderData: 'storeOrder/historyOrderData',
        loading: 'storeOrder/loading',
        loaded: 'storeOrder/loaded'
      })
    },
    methods: {
      fetchList () {
        if (this.tab === 'STORE') {
          return this.$store.dispatch('storeOrder/fetchHandleOrderList')
        } else {
          return this.$store.dispatch('storeOrder/fetchHistoryOrderList')
        }
      },
      loadMore () {
        this.fetchList()
      },
      loadList () {
        this.$store.dispatch('storeOrder/resetStatusData')
        this.fetchList().then(() => {
          const l1 = this.tab === 'STORE' ? this.$refs.loadList_1 : this.$refs.loadList_2
          if (l1) {
            l1.onTopLoaded()
          }
        })
      },
      operaOrder (code, type) {
        let operationType = type
        let operationMsg = type === 'closed' ? '结案' : '取消'
        this.$messagebox.confirm('确定' + operationMsg + '此订单吗？').then(() => {
          api.storeOrder.updateOrderStatus({
            data: {
              operationType: operationType,
              orderCode: code,
              token: simpleLocalDb.getItem('token')
            }
          }).then(result => {
            if (result.responseCode === 0) {
              this.$toast('结案成功')
              this.$store.dispatch('storeOrder/resetData')
              this.fetchList()
            } else {
              this.$toast(result.responseMsg)
            }
          })
        })
      },
      operaFold (index, type) {
        if (type === 'STORE') {
          this.$store.commit('storeOrder/handleFold', index)
        } else {
          this.$store.commit('storeOrder/historyFold', index)
        }
        this.$forceUpdate()
      },
      changeList (type) {
        this.tab = type
        this.$store.commit('storeOrder/tab', type)
        this.$store.dispatch('storeOrder/resetData')
        this.fetchList()
      },
      comment () {
        api.storeOrder.addComment({
          data: {
            content: this.content,
            orderCode: this.commentCode,
            type: 'reply',
            token: simpleLocalDb.getItem('token')
          }
        }).then((result) => {
          if (result.responseCode === 0) {
            this.$toast('回复成功')
            this.commentDisplay = false
            this.$store.commit('storeOrder/comment', {
              content: this.content,
              commentName: this.commentName,
              commentIndex: this.commentIndex,
              type: this.tab
            })
          } else {
            this.$toast(result.responseMsg)
          }
        })
      },
      openComment (item, index) {
        this.content = ''
        this.commentCode = item.orderCode
        this.commentName = item.createByName
        this.commentIndex = index
        this.commentDisplay = !this.commentDisplay
      },
      goReceive (orderCode) {
        this.$router.push({path: '/storeOrder/receive', query: {orderCode: orderCode}})
      },
      goComment (orderCode) {
        this.$router.push({path: '/storeOrder/comment', query: {orderCode: orderCode}})
      },
      goEdit (orderCode) {
        if (orderCode) {
          this.$router.push({path: '/storeOrder/edit', query: {orderCode: orderCode}})
        } else {
          this.$router.push('/storeOrder/edit')
        }
      },
      filterJustDate () {
        this.$store.commit('storeOrder/filterDate', this.datePicker)
        this.$store.dispatch('storeOrder/resetData')
        this.fetchList()
      },
      search () {
        this.datePicker = this.popupDatePicker
        this.$store.commit('storeOrder/filterDate', this.datePicker)
        this.$store.commit('storeOrder/filterStore', this.storeKey)
        this.$store.dispatch('storeOrder/resetData')
        this.fetchList()
        this.filtering = false
      },
      resetSearch () {
        this.popupDatePicker = new Date()
        this.datePicker = new Date()
        this.storeKey = ''
        this.filtering = false
        this.$store.dispatch('storeOrder/resetData')
        this.$store.dispatch('storeOrder/resetSearch')
        this.fetchList()
      },
      getBook () {
        api.base.getSpecialAttach({
          data: {
            fileType: 'pdf1',
            token: simpleLocalDb.getItem('token')
          }
        }).then(res => {
          if (res.responseCode === 0) {
            this.book = res.fileList[0].filePath
          } else {
            this.$toast(res.responseMsg)
          }
        })
      },
      openBook () {
        if (global.appInfo.client === 'ios') {
          webview({
            url: this.book,
            title: '操作手册',
            isNav: true
          })
        } else {
          openDocument({
            url: this.book
          })
        }
      }
    },
    directives: {
      focus: {
        // directive definition
        inserted: function (el) {
          el.focus()
        }
      }
    },
    mounted () {
      this.getBook()
      this.tab = this.$store.getters['storeOrder/tab']
      if (!this.isBackPage()) {
        this.$store.dispatch('storeOrder/resetData')
        this.resetPageKey()
      }
    }
  }
</script>
<style lang="less" scoped>
  @offset0: unit(5px / 100, rem);
  @offset1: unit(10px / 100, rem);
  @offset2: unit(15px / 100, rem);
  @offset3: unit(20px / 100, rem);
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
  input {
    border: none;
  }
  .icon(@src: "") {
    display: inline-block;
    vertical-align: middle;
    background: url(@src) center no-repeat;
    background-size: contain;
  }
  .ellipsis(@line: 1, @lineHeight: 1) {
    overflow: hidden;
    height: unit(@line * @lineHeight, em);
    &:before {
      content: "";
      float: left;
      width: 1px;
      height: 100%;
    }
    & > .ellipsis-content {
      float: right;
      width: 100%;
      margin-left: -1px;
    }
    &:after {
      box-sizing: content-box;
      content: "…";
      float: right;
      position: relative;
      left: 100%;
      top: -1em * @lineHeight;
      width: 1em;
      padding-right: 1px;
      margin-left: -1em;
      background-color: #fff;
    }
  }
  .m_store-order-list {
    color: @color_text1;
    font-size: @size1;
    line-height: 1.3;
  }
  .c_box {
    display: block;
    width: 100%;
    background-color: #fff;
    border-bottom: 1px solid @color_b2;
    margin-top: @offset1;
    margin-bottom: @offset1;
  }
  .m_head {
    .link {
      display: flex;
      padding: 0 @offset1;
      white-space: nowrap;
    }
    .book {
      .icon("~@/assets/storeOrder/ic_book.png");
    }
    .filter {
      .icon("~@/assets/common/filter.png");
    }
    .book, .filter {
      display: block;
      width: 14px;
      height: 14px;
      margin-right: 0.5em;
    }
    .store {
      display: flex;
      justify-content: space-around;
      color: @color_sub2;
      font-size: @size2;
      padding: @offset1 0;
      margin: 0;
    }
    .store-count{
      color: @color2;
    }
    .history {
      display: flex;
      align-items: stretch;
      position: relative;
      box-shadow: 0 2px 4px @color_b2;
      z-index: 1;
    }
    .select {
      display: block;
      background-color: #f8f8f8;
      color: @color_text1;
      padding-left: @offset1;
      padding-right: @offset1;
      text-align: left;
    }
    .select-text {
      display: block;
      margin-top: @offset0;
      font-size: @size2;
      &:first-child {
        margin-top: 0;
      }
    }
    .month {
      font-weight: bold;
      font-size: @size3;
    }
    .tri {
      .icon("~@/assets/storeOrder/triangle.png");
      width: 6px;
      height: 4px;
    }
    .detail {
      background-color: #fff;
      flex-grow: 1;
      padding: @offset1 @offset0;
      color: @color_sub2;
    }
    .total {
      color: @color_sub1;
    }
    .count {
      color: @color2;
    }
    .line {
      font-size: @size2;
      margin-top: @offset0;
      display: flex;
    }
    .half {
      display: block;
      width: 50%;
    }
  }
  .m_content {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    overflow: hidden;
    .m_main {
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 50px;
      overflow: hidden;
      overflow-y: auto;
      .item {
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
      .right {
        .icon("~@/assets/common/rightArrow.png");
        width: 12px;
        height: 12px;
      }
      .head {
        padding-top: @offset2;
        padding-bottom: @offset2;
        color: @color_sub2;
        font-size: @size3;
        display: flex;
        align-items: center;
      }
      .head-code {
        flex-grow: 1;
      }
      .head-more {
        display: inline-block;
        margin-left: @offset1;
      }
      .head-right {
        margin-left: 0.5em;
      }
      .overview {
        display: flex;
        align-items: center;
        justify-content: space-between;
      }
      .overview-left {
        overflow: hidden;
      }
      .overview-store {
        .ellipsis(2, 1.3);
        height: auto;
        font-size: @size3;
      }
      .overview-detail {
        color: @color_sub1;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        margin-top: @offset1;
      }
      .overview-create {
        margin-top: @offset2;
      }
      .overview-count {
        font-weight: bold;
      }
      .overview-btns {
        flex-shrink: 0;
      }
      .overview-btn {
        display: block;
        border-radius: 4px;
        height: 30px;
        padding: 0 @offset2;
        margin-left: @offset1;
      }
      .overview-receive {
        color: #fff;
        background: @color2;
      }
      .overview-finish {
        margin-top: 40px;
        color: @color2;
        border: 1px solid @color2;
      }
      .overview-edit {
        margin-top: 40px;
        color: #999;
        border: 1px solid @color_sub2;
      }
      .count {
        color: @color_sub1;
      }
      .count-line {
        display: flex;
        padding-bottom: .05rem;
        &:last-child {
          padding-bottom: 0;
        }
      }
      .count-left {
        width: 62%;
      }
      .count-all {
        font-weight: bold;
      }
      .sent {
        color: @color_sub2;
        font-size: @size2;
        position: relative;
      }
      .sent-line {
        display: flex;
      }
      .sent-left {
        width: 62%;
      }
      .sent-right {
        padding-right: 20px;
      }
      .sent-arrow {
        position: absolute;
        right: 10px;
        top: 50%;
        margin-top: -6px;
      }
      .eval {
        color: @color_sub2;
      }
      .eval-head {
        display: flex;
        justify-content: space-between;
      }
      .eval-left {
        display: flex;
      }
      .eval-reply {
        .icon("~@/assets/storeOrder/ic_commentL.png");
        margin-left: @offset3;
        background-position: left;
        background-size: 13px;
        padding-left: 20px;
        text-align: left;
      }
  .eval-toggle {
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
      .eval-evals {
        margin-top: @offset1;
      }
      .eval-eval {
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
    }
    .m_tabs {
      display: flex;
      height: 50px;
      width: 100%;
      background-color: #fff;
      border-top: 1px solid @color_b2;
      position: absolute;
      left: 0;
      bottom: 0;
      width: 100%;
      .tab {
        width: 50%;
        height: 100%;
        font-size: 10px;
        color: @color_sub2;
      }
      .store {
        .icon("~@/assets/storeOrder/orderList_grey.png");
      }
      .history {
        .icon("~@/assets/storeOrder/history-grey@2x.png");
      }
      .store, .history {
        width: 20px;
        height: 20px;
        display: block;
        margin: 0 auto 5px;
      }
      .active {
        color: @color1;
      }
      .active .store {
        background-image: url("~@/assets/storeOrder/orderList_blue.png");
      }
      .active .history {
        background-image: url("~@/assets/storeOrder/history-blue@2x.png");
      }
    }
    .m_filter {
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background-color: fade(#000, 40);
      font-size: @size3;
      .form {
        background-color: #fff;
        overflow: hidden;
        padding: 0 @offset1;
      }
      .label {
        display: flex;
        margin: @offset1 0;
        align-items: center;
      }
      .key {
        color: @color_sub1;
      }
      .input {
        border: 1px solid @color_b1;
        border-radius: 4px;
        text-align: center;
        flex-grow: 1;
        padding: @offset1 0;
        margin-left: @offset1;
      }
      .btns {
        display: flex;
        margin: @offset1 0;
      }
      .reset, .submit {
        display: block;
        flex-grow: 1;
        padding: @offset1 0;
        text-align: center;
        border-radius: 4px;
      }
      .reset {
        margin-right: @offset1 / 2;
        color: @color1;
        border: 1px solid @color1;
      }
      .submit {
        margin-left: @offset1 / 2;
        color: #fff;
        background-color: @color1;
      }
    }
  }
  .m_add {
    position: fixed;
    left: 20px;
    bottom: 70px;
    width: 56px;
    height: 56px;
    border-radius: 50%;
    background: #FFC924;
    box-shadow: 0 0 6px 0 rgba(148,148,148,0.12), 0 6px 6px 0 rgba(141,141,141,0.24);
    font-size: 15px;
    color: #fff;
  }
  .comment__form {
    position: absolute;
    left:0;
    bottom: 0;
    right: 0;
    padding: .1rem;
    background: #fff;
    box-shadow: 0 -2px 8px rgba(0, 0, 0, .2);
    z-index: 2;
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
  .comment__submit {
    width: 100%;
    height: .4rem;
    margin-top: .1rem;
    background: #ff6c47;
    color: #fff;
    border-radius: 4px;
    border: none;
    font-size: .15rem;
  }
  .mask {
    position: absolute;
    left: 0;
    right: 0;
    bottom: 0;
    top: 0;
    background: #fff;
    opacity: 0;
    z-index: 1;
  }
  .corner_count {
    position: absolute;
    right: -1.5em;
    top: -.25em;
    padding: 1px .04rem 0;
    background: #FF6C47;
    color: #fff;
    border-radius: 8px;
    font-size: .1rem;
  }
</style>
