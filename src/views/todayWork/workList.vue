<template>
  <bm-layout>
    <bm-header slot="header">今日工作</bm-header>
    <bm-loadmore class="container" ref="list" :topMethod="fetchPlanList">
      <div class="top-wrapper" v-show="todayData['total'] && todayData['total'].length > 0 ? true : false" @click="goToPlanDetail">
        <div class="flex">
          <div class="flex flex-auto flex-column precent-wrapper">
            <div :class="['flex', {'mgtop-14': index > 0 ? true : false}]" v-for="(item, index) in todayData['total']">
              <div class="flex flex-column sale-info">
                <div :class="['flex', 'justify-between', 'items-center', index % 2 === 0 ? 'blue-font' : 'green-font']">
                  <span>{{item['totalName']}}</span>
                  <span>实际 {{item['actuTotal']}}</span>
                </div>
                <div class="flex precent-line-wrapper">
                  <div :class="['precent-line', 'line-animation-enter-active', index % 2 === 0 ? 'blue-bg' : 'green-bg']" :style="{width: item['compRate']}"></div>
                </div>
                <div class="text-right">计划 {{item['planTotal']}}</div>
              </div>
              <div :class="['flex', 'flex-auto', 'justify-end', 'items-center', 'p-number', index % 2 === 0 ? 'blue-font' : 'green-font']"><span>{{item['compRate']}}</span></div>
            </div>
          </div>
          <div class="right-arrow"></div>
        </div>
        <div class="separate"></div>
        <div class="flex justify-end btn-wrapper">
          <div :class="['btn', {'disabled': todayData['disabledRestBtn'] ? true : false}]" @click.stop="updateByDate">{{todayData['validFlag'] === 'VALID_PLAN' ? '今日休息' : '取消休息'}}</div>
        </div>
      </div>
      <div v-if="todayData['validFlag'] === 'TODAY_REST' && todayData['itemList'].length <= 0" class="rest-wrapper">
        <span>今日休息了</span>
      </div>
      <template v-else v-for="item in todayData['itemList']">
        <div v-if="item['workPointCode'] === 'L001' || item['workPointCode'] === null ? 1 : 0" class="store-wrapper" v-show="todayData['itemList'] && todayData['itemList'].length > 0 ? true : false">
          <div>{{item['storeName']}}</div>
          <div class="flex store-info-wrapper">
            <div class="flex flex-auto flex-column precent-wrapper">
              <div :class="['flex', {'mgtop-10': index > 0 ? true : false}]" v-for="(total, index) in item['total']">
                <div class="flex flex-column sale-info">
                  <div :class="['flex', 'justify-between', 'items-center', index % 2 === 0 ? 'blue-font' : 'green-font']">
                    <span>{{total['totalName']}}</span>
                    <span>{{total['actuTotal']}}</span>
                  </div>
                  <div class="flex precent-line-wrapper">
                    <div :class="['precent-line', 'line-animation-enter-active', index % 2 === 0 ? 'blue-bg' : 'green-bg']" :style="{width: total['compRate']}"></div>
                  </div>
                  <div class="text-right">{{total['planTotal']}}</div>
                </div>
                <div :class="['flex', 'flex-auto', 'justify-end', 'items-center', 'p-number', index % 2 === 0 ? 'blue-font' : 'green-font']"><span>{{total['compRate']}}</span></div>
              </div>
            </div>
            <div class="flex flex-column justify-around store-btn-wrapper">
              <template v-if="item['status'] === 'LEAVE_STORE'">
                <div :class="['btn', item.disabledBigBtn]" @click="goToClockOn(item)">进 店</div>
                <div :class="['btn', {'no-use': item['count'] > 0 ? false : true}]" @click="goToSalesReport(item.planId)">提报销量</div>
              </template>
              <template v-else>
                <div class="btn" @click="goToClockOut(item.hasActuInfo, item.planId)">离 店</div>
                <div class="btn" @click="goToSalesReport(item.planId)">提报销量</div>
              </template>
            </div>
          </div>
          <div :class="['status-wrapper', item.smallBtnStyle]" v-if="item['workTime'].length <= 0" @click="updateByPlanId(item)">今日不进店</div>
          <div v-else class="time-wrapper">
            <div class="flex">
              <span>进店：</span>
              <p>{{item['workTime'] | formatTime('enterTime')}}</p>
            </div>
            <div class="flex">
              <span>离店：</span>
              <p>{{item['workTime'] | formatTime('leaveTime')}}</p>
            </div>
          </div>
        </div>
        <div v-else class="flex other-wrapper" @click="goToOfficeDetail(item)">
          <div class="flex-auto left-info">
            <p class="text-line-2">{{item['storeName']}}</p>
            <p class="task">任务: {{item['taskList'] | formatTask}}</p>
            <div v-if="item['count'] <= 0 ? 1 : 0" :class="['status-wrapper', item.smallBtnStyle]" @click="updateByPlanId(item)">今日不出勤</div>
            <div v-else class="time-wrapper deep-font">
              <div class="flex">
                <span>开始打卡：</span>
                <p>{{item['workTime'] | formatTime('enterTime')}}</p>
              </div>
              <div class="flex" v-if="item['workTime'][0]['leaveTime'] === null ? 0 : 1">
                <span>结束打卡：</span>
                <p>{{item['workTime'] | formatTime('leaveTime')}}</p>
              </div>
            </div>
          </div>
          <div
            :class="['other-btn', item.disabledBigBtn]"
            v-if="item['count'] > 0 && item['status'] === 'LEAVE_STORE' ? false : true"
            @click.stop="goToOffice(item)">{{item['status'] | switchStatusStr(item['count'])}}</div>
          <div v-else class="right-arrow gray"></div>
        </div>
      </template>
    </bm-loadmore>
  </bm-layout>
</template>

<script>
  import { Indicator } from 'mint-ui'
  import moment from 'moment'
  import api from '@/api'
  export default {
    data () {
      return {
        todayData: {}
      }
    },
    filters: {
      formatTime (value, str) {
        let arr = []
        value.forEach(e => {
          if (e[str] !== null) {
            let time = new Date(e[str])
            arr.push(moment(time).format('HH:mm'))
          }
        })
        return arr.join(', ')
      },
      formatTask (val) {
        let value = val || []
        return value.reduce((s, e) => {
          return s + e.taskDesc + ', '
        }, '').slice(0, -2)
      },
      switchStatusStr (status, count) {
        if (status === 'ENTER_STORE') { return '工作总结' }
        if (count > 0) { return '查看详情' }
        return '打 卡'
      }
    },
    methods: {
      openComponent (url, params) {
        this.$router.push({
          path: url,
          query: params
        })
      },
      // 一系列路由跳转
      goToClockOn ({ planId, disabledBigBtn }) {
        if (disabledBigBtn === 'disabled') { return }
        this.openComponent('/todayWork/storeClockOn', {
          planId
        })
      },
      goToClockOut (hasActuInfo, planId) {
        if (!hasActuInfo) { return this.$toast('请先提报销量') }
        this.openComponent('/todayWork/storeClockOut', {
          planId
        })
      },
      goToOffice ({ planId, status, workPointCode, disabledBigBtn }) {
        if (disabledBigBtn === 'disabled') { return }
        if (status === 'ENTER_STORE') {
          return this.openComponent('/todayWork/workSummary', {
            planId,
            type: workPointCode
          })
        }
        this.openComponent('/todayWork/clockOnDetail', {
          planId,
          type: workPointCode
        })
      },
      goToOfficeDetail ({ planId, status, workPointCode, count }) {
        if (status === 'LEAVE_STORE' && count > 0) {
          this.openComponent('/todayWork/officeDetail', {
            planId,
            type: workPointCode
          })
        }
      },
      goToSalesReport (planId) {
        this.openComponent('/todayWork/salesReport', {
          planId
        })
      },
      goToPlanDetail () {
        this.openComponent('/retailPlan/check', {
          date: Date.now(),
          onlyRead: true
        })
      },
      // 获取今日工作列表数据
      fetchPlanList (config = {}) {
        return api.todayWork.getPlanList({
          data: {
            planDate: Date.now(),
            token: simpleLocalDb.getItem('token')
          },
          config
        }).then(result => {
          this.$refs.list.onTopLoaded()
          if (result.responseCode === 0) {
            let d = result
            let { itemList } = d
            d.hasClockOn = false
            d.disabledRestBtn = false
            if (itemList.some(e => e['count'] > 0)) {
              d.disabledRestBtn = true
            }
            if (d.disabledRestBtn && itemList.some(e => e['count'] > 0 && e.status === 'ENTER_STORE')) {
              d.hasClockOn = true
            }
            itemList.forEach((e, i) => {
              // smallBtnStyle 纪录 今日不进店/今日不出勤 按钮的样式
              // 1）今日休息则全不可点击状态
              // 2）validFlag为'NOT_ENTER_STORE'，则为勾选了状态
              e.smallBtnStyle = ''
              if (d.validFlag === 'TODAY_REST') {
                e.smallBtnStyle = 'disabled'
              } else if (e['validFlag'] === 'NOT_ENTER_STORE') {
                e.smallBtnStyle = 'isChecked'
              }
              // disabledBigBtn 纪录 右侧打卡按钮的是否为可点击状态
              // 1）今日休息则为不可点击状态
              // 2）已勾选了不进店／不出勤则为不可点击状态
              // 3）已有其他店打卡进店/出勤, 而该店状态为离店（即进店/出勤的不是这个门店/办公点）则为不可点击状态
              e.disabledBigBtn = ''
              if (e['validFlag'] === 'NOT_ENTER_STORE' || d['validFlag'] === 'TODAY_REST' || (d['hasClockOn'] && e['status'] !== 'ENTER_STORE')) {
                e.disabledBigBtn = 'disabled'
              }
            })
            this.todayData = d
          } else {
            this.$toast(result.responseMsg)
          }
        }).catch(err => {
          console.log(err)
          return false
        })
      },
      // 今日休息/取消休息 请求
      async updateByDate () {
        let validFlag = this.todayData['validFlag'] === 'VALID_PLAN' ? 'TODAY_REST' : 'VALID_PLAN'
        if (this.todayData['disabledRestBtn']) { return }
        Indicator.open()
        let flayRequest = await api.todayWork.updateFlayByDate({
          data: {
            date: Date.now(),
            pageFlag: 'TODAY_WORK',
            validFlag,
            token: simpleLocalDb.getItem('token')
          }
        }).catch(err => {
          console.log(err)
          return {}
        })
        if (flayRequest.responseCode === 0) {
          await this.fetchPlanList()
        } else {
          flayRequest.responseMsg && this.$toast(flayRequest.responseMsg)
        }
        Indicator.close()
      },
      // 单个计划的状态改变请求
      async updateByPlanId (item) {
        if (this.todayData.validFlag === 'TODAY_REST') { return }
        Indicator.open()
        let flay = item.validFlag === 'NOT_ENTER_STORE' ? 'VALID_PLAN' : 'NOT_ENTER_STORE'
        let flayRequest = await api.todayWork.updateFlayById({
          data: {
            planId: item.planId,
            validFlag: flay,
            token: simpleLocalDb.getItem('token')
          }
        }).catch(err => {
          console.log(err)
          return {}
        })
        if (flayRequest.responseCode === 0) {
          await this.fetchPlanList()
        } else {
          flayRequest.responseMsg && this.$toast(flayRequest.responseMsg)
        }
        Indicator.close()
      }
    },
    created () {
      this.fetchPlanList({ '_INDICATOR': true })
    }
  }
</script>

<style lang="less" scoped>
  .text-line-2 {
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 2;
    overflow: hidden;
  }
  @keyframes line-animation-in {
    0% { transform: rotateY(90deg); }
    100% { transform: rotateY(0deg); }
  }
  .line-animation-enter-active {
    animation: line-animation-in 3s;
  }
  .container {
    font-size: .15rem;
    color: #333;
    padding-bottom: .15rem;
    .top-wrapper {
      background-color: #d7f8ff;
      padding: .10rem;
    }
    .right-arrow {
      align-self: center;
      width: .075rem;
      height: .12rem;
      margin-left: .125rem;
      background: url('~@/assets/todayWork/right-arrow@2x.png') no-repeat center center;
      background-size: contain;
      &.gray {
        background-image: url('~@/assets/common/rightArrow.png')
      }
    }
    .precent-wrapper {
      font-size: .12rem;
      color: #999;
      .blue-font { color: #1fb7fe; }
      .green-font { color: #22ce8a; }
      .p-number { font-size: .15rem; }
      .mgtop-14 { margin-top: .14rem; }
      .mgtop-10 { margin-top: .10rem; }
      .sale-info { flex: 4; }
      .precent-line-wrapper {
        margin: .02rem 0;
        height: .04rem;
        background-color: #d7d7d7;
        .precent-line {
          height: 100%;
          width: 0%;
          transform-origin: left center;
        }
        .blue-bg { background-color: #1fb7fe; }
        .green-bg { background-color: #22ce8a; }
      }
      .text-right { text-align: right; }
      .percent-num { flex: 1; }
    }
    .separate {
      margin: .10rem 0;
      height: 1px;
      transform: scaleY(0.5);
      background-color: #90dcfe;
    }
    .btn-wrapper {
      .btn {
        padding: .07rem .12rem;
        margin-left: .10rem;
        font-size: .12rem;
        color: #1fb7fe;
        border: 1px solid #90dcfe;
        border-radius: 4px;
        &.disabled {
          color: #fff;
          background-color: #d7d7d7;
          border-color: #d7d7d7;
        }
      }
    }
    .store-wrapper {
      margin-top: .10rem;
      padding: .10rem;
      background-color: #fff;
    }
    .store-info-wrapper { margin-top: .02rem; }
    .store-btn-wrapper {
      flex-shrink: 0;
      margin-left: .15rem;
      .btn {
        width: .70rem;
        border-radius: 4px;
        background-color: #ff6c48;
        color: #fff;
        line-height: .30rem;
        text-align: center;
        &:first-of-type { margin-bottom: .14rem; }
        &.no-use { visibility: hidden; }
        &.disabled { background-color: #d7d7d7; }
      }
    }
    .status-wrapper {
      line-height: .20rem;
      position: relative;
      display: inline-block;
      padding-left: .24rem;
      font-size: .12rem;
      color: #999;
      margin-top: .15rem;
      &:before {
        content: '';
        display: block;
        width: .20rem;
        height: .20rem;
        position: absolute;
        top: 0;
        left: 0;
        background: url('~@/assets/todayWork/unSelect@2x.png') no-repeat center center;
        background-size: contain;
      }
      &.isChecked:before { background-image: url('~@/assets/todayWork/select@2x.png'); }
      &.disabled:before { background-image: url('~@/assets/todayWork/select-disabled@2x.png'); }
    }
    .time-wrapper {
      font-size: .12rem;
      color: #999;
      line-height: .12rem;
      margin-top: .10rem;
      &.deep-font { color: #666; }
      &>div { margin-top: .05rem; }
      span { flex-shrink: 0; }
    }
    .other-wrapper {
      background-color: #fff;
      margin-top: .10rem;
      padding: .10rem;
      .task {
        margin-top: .15rem;
        font-size: .12rem;
        color: #666;
      }
      .other-btn {
        margin-top: .27rem;
        margin-left: .20rem;
        width: .70rem;
        height: .30rem;
        line-height: .30rem;
        background-color: #ff6c48;
        border-radius: 4px;
        text-align: center;
        color: #fff;
        &.disabled { background-color: #d7d7d7; }
        &.no-use { display: none; }
      }
    }
    .rest-wrapper {
      span {
        display: block;
        text-align: center;
        margin-top: .30rem;
        color: #999;
        &:before {
          content: '';
          display: block;
          margin: 0 auto .15rem auto;
          width: 1.64rem;
          height: 1.68rem;
          background: url('~@/assets/retailPlan/icon_rest.png') no-repeat center center;
          background-size: contain;
        }
      }
    }
  }
</style>
