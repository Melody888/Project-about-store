<template>
  <bm-layout>
    <bm-header class="m_header" slot="header">
      <span>零售计划确认</span>
      <router-link to="history" append class="history" slot="right">历史计划</router-link>
    </bm-header>
    <section class="m_main">
      <div class="m_up">
        <p class="overview">
          <span>合<br>计</span>
          <span class="item"><span class="head">人数</span><br>{{ overview[weekIndex] ? overview[weekIndex].people : '' }}</span>
          <span class="item"><span class="head">店数</span><br>{{ overview[weekIndex] ? overview[weekIndex].store : '' }}</span>
          <span class="item"><span class="head">目标(万)</span><br>{{ overview[weekIndex] ? overview[weekIndex].target / 10000 : '' | money }}</span>
          <span class="item"><span class="head">至尊(盒)</span><br>{{ overview[weekIndex] ? overview[weekIndex].zz : '' }}</span>
        </p>
        <div class="calendar" v-show="!toggled">
          <div v-for="(week, wI) of weeksWithDates" v-show="weekIndex === wI">
            <div class="line line-days">
              <button class="left" v-if="weekIndex > 0" @click="weekIndex = weekIndex > 1 ? weekIndex - 1 : 0"></button>
              <div class="days">
                <i class="gap"></i>
                <div class="td" :class="{ 'passed': date < todayMidnight }" v-for="date of week">{{ getDayName(date) }}</div>
                <i class="gap"></i>
              </div>
              <div class="days">
                <i class="gap"></i>
                <div class="td" :class="{ 'passed': date < todayMidnight }" v-for="date of week">
                  <template v-if="+date === +todayMidnight"><span class="today">今</span></template>
                  <template v-else>{{ date.getDate() < 10 ? '0' + date.getDate() : date.getDate() }}</template>
                </div>
                <i class="gap"></i>
              </div>
              <button class="right" v-if="weekIndex < WEEKS - 1" @click="weekIndex++"></button>
            </div>
            <div class="line">
              <div class="title">人数</div>
              <div class="td" :class="{ 'passed': date < todayMidnight }" v-for="(date, dayIndex) of week">{{ getDataviewDayData(wI, dayIndex, 'people') | max(999) }}</div>
              <i class="gap"></i>
            </div>
            <div class="line">
              <div class="title">店数</div>
              <div class="td" :class="{ 'passed': date < todayMidnight }" v-for="(date, dayIndex) of week">{{ getDataviewDayData(wI, dayIndex, 'store') | max(999) }}</div>
              <i class="gap"></i>
            </div>
            <div class="line">
              <div class="title">目标<br>(万)</div>
              <div class="td" :class="{ 'passed': date < todayMidnight }" v-for="(date, dayIndex) of week">{{ getDataviewDayData(wI, dayIndex, 'target') / 10000 | money | max(999) }}</div>
              <i class="gap"></i>
            </div>
            <div class="line">
              <div class="title">至尊<br>(盒)</div>
              <div class="td" :class="{ 'passed': date < todayMidnight }" v-for="(date, dayIndex) of week">{{ getDataviewDayData(wI, dayIndex, 'zz') | max(999) }}</div>
              <i class="gap"></i>
            </div>
          </div>
        </div>
        <button class="toggle" @click="toggled = !toggled"><span class="toggle-text" >{{ toggled ? '展开' : '收起' }}<i class="toggle-arrow" :class="{ 'toggle-actived': toggled }"></i></span></button>
      </div>
      <div class="m_down">
        <nav class="m_tabs">
          <button class="tab" :class="{ 'tab-actived': tab === 'STAFF' }" @click="tab = 'STAFF'"><span class="text">按人员<i class="c_unread" v-if="staffsUnread">{{ staffsUnread }}</i></span></button>
          <button class="tab" :class="{ 'tab-actived': tab === 'STORE' }" @click="tab = 'STORE'">按门店</button>
        </nav>
        <div class="m_staff" v-show="tab === 'STAFF'">
          <div class="staff-member" v-infinite-scroll="getStaffs" infinite-scroll-disabled="staffsScrollDisabled" infinite-scroll-distance="100" v-scrolled="'staffs'">
            <ul>
              <li v-for="staff of staffs">
                <button class="member" :class="{ 'member-actived': checkingStaffCode === staff.code }" @click="checkingStaffCode = staff.code">
                  <p><span class="member-name">{{ staff.name.length > 3 ? staff.name.slice(0, 3) + '…' : staff.name }}<i class="c_unread" v-if="staff.unread">{{ staff.unread }}</i></span></p>
                  <p class="member-plan">{{ staff.plan }}个计划</p>
                </button>
              </li>
            </ul>
          </div>
          <div class="staff-detail" v-infinite-scroll="getStaffPlans" infinite-scroll-disabled="staffPlansScrollDisabled" infinite-scroll-distance="100" v-scrolled="'plans'">
            <ul class="wrap" v-if="staffChecking">
              <li class="item" v-for="plan of staffChecking.list || []">
                <div @click="doGoDetail(plan)">
                  <div class="head">
                    <p>{{ plan.date | datetime('ddd MM/DD') }} <span class="plans">{{ plan.plans }}个计划</span></p>
                    <span class="status">{{ getStatus(plan.status) }}</span>
                  </div>
                  <p class="store" v-if="plan.type === 'VALID_PLAN'"><template v-for="(store, index) of plan.store">{{ index === 0 ? '' : ' / ' }}{{ store }}</template></p>
                  <div class="more">
                    <div class="more-l">
                      <template v-if="plan.type === 'VALID_PLAN'">
                        <p class="total">总金额：¥{{ plan.total }}</p>
                        <p class="total">至尊（盒）：{{ plan.zz }}</p>
                      </template>
                      <span class="type" v-else-if="plan.type === 'TODAY_REST'">今日休息</span>
                      <span class="type" v-else-if="plan.type === 'NO_PLAN'">未制定计划</span>
                      <span class="type" v-else>{{ getType(plan.type) }}</span>
                    </div>
                    <button class="more-r" @click.stop="doGoDetail(plan, true)" v-if="plan.status === 'unconfirmed'">确认计划</button>
                    <button class="more-r" @click.stop="doGoDetail(plan, true)" v-if="plan.type === 'NO_PLAN'">制定计划</button>
                  </div>
                </div>
              </li>
            </ul>
          </div>
        </div>
        <div class="m_store" v-show="tab === 'STORE'" v-infinite-scroll="getStores" infinite-scroll-disabled="storesScrollDisabled" infinite-scroll-distance="100" v-scrolled="'stores'">
          <ul>
            <li v-for="(item, index) of stores || []">
              <button class="tab-box" @click="doToggleStore(item.storeCode)">
                <span class="tab">
                  <span>{{ item.store }}</span>
                  <i class="down" :class="{ 'up': checkingStoreCode.indexOf(item.storeCode) >= 0 }"></i>
                </span>
              </button>
              <div class="wrap" v-show="checkingStoreCode.indexOf(item.storeCode) >= 0">
                <ul>
                  <li v-for="(date, index) of item.list || []">
                    <i class="gap" v-if="index !== 0"></i>
                    <p class="overview">{{ date.date | datetime('ddd MM/DD') }} <span class="people">{{ date.people ? date.people.length : 0 }}人</span></p>
                    <ul>
                      <li class="block" v-for="(people, index) of date.people || []">
                        <router-link :to="{ path: 'check', append: true, query: { code: people.code, date: date.date } }">
                        <i class="gap2" v-if="index !== 0"></i>
                          <p class="line1">
                            <span>{{ people.name }} {{ people.class }}<template v-for="period of people.periods || []"> {{ period.start | datetime('HH:mm') }}-{{ period.end | datetime('HH:mm')}}</template></span>
                            <span class="status">{{ getStatus(people.status) }}</span>
                          </p>
                          <div class="line2">
                            <div class="total">
                              <p>总金额：¥{{ people.total }}</p>
                              <p>至尊(盒)：{{ people.zz }}</p>
                            </div>
                            <button class="btn" v-if="people.status === 'unconfirmed'">确认计划</button>
                          </div>
                        </router-link>
                      </li>
                    </ul>
                  </li>
                </ul>
              </div>
            </li>
          </ul>
        </div>
      </div>
    </section>
  </bm-layout>
</template>
<script>
  // import { sfa as Api } from '@/utils/baseRequest'

  const WEEKS = 2
  const DAY_NAME = ['日', '一', '二', '三', '四', '五', '六']
  const STATUS_DICT = {
    'unconfirmed': '待确认',
    'confirmed': '已确认',
    'reconfirmed': '已重新确认'
  }
  const TYPE_DICT = {
    'NOT_ENTER_STORE': '今日不进店',
    'TODAY_REST': '今日休息',
    'VALID_PLAN': '有效计划',
    'INVALID_PLAN': '无效计划',
    'NO_PLAN': '无计划'
  }

  export default {
    data () {
      return {}
    },
    computed: {
      WEEKS () {
        return WEEKS || 0
      },
      // DATAVIEW START
      weekIndex: {
        get () {
          return this.$store.state['retailPlanConfirm']['indexWeekIndex'] || 0
        },
        set (v) {
          this.$store.state['retailPlanConfirm']['indexWeekIndex'] = +v || 0
        }
      },
      overview: {
        get () {
          return this.$store.state['retailPlanConfirm']['indexOverview'] || []
        }
      },
      weekData: {
        get () {
          return this.$store.state['retailPlanConfirm']['indexWeekData'] || []
        }
      },
      toggled: {
        get () {
          return this.$store.state['retailPlanConfirm']['indexToggled'] || false
        },
        set (v) {
          this.$store.state['retailPlanConfirm']['indexToggled'] = !!v
        }
      },
      tab: {
        get () {
          return this.$store.state['retailPlanConfirm']['indexTab'] || 'STAFF'
        },
        set (v) {
          this.$store.state['retailPlanConfirm']['indexTab'] = ('' + v) || 'STAFF'
        }
      },
      staffs: {
        get () {
          return this.$store.state['retailPlanConfirm']['indexStaffs'] || []
        }
      },
      staffsUnread: {
        get () {
          return this.$store.state['retailPlanConfirm']['indexStaffsUnread'] || 0
        }
      },
      stores: {
        get () {
          return this.$store.state['retailPlanConfirm']['indexStores'] || []
        }
      },
      checkingStaffCode: {
        get () {
          return this.$store.state['retailPlanConfirm']['indexCheckingStaffCode'] || ''
        },
        set (v) {
          this.$store.state['retailPlanConfirm']['indexCheckingStaffCode'] = '' + v
        }
      },
      checkingStoreCode: {
        get () {
          return this.$store.state['retailPlanConfirm']['indexCheckingStoreCodes'] || []
        }
      },
      // DATAVIEW END
      weeksWithDates () {
        let res = []
        let d = new Date()
        d.setHours(0, 0, 0, 0)
        let day = d.getDay()
        let baseD = new Date(+d - (day - 1) * 3600000 * 24)
        for (let i = 0; i < WEEKS; i++) {
          let sub = []
          for (let j = 0; j < 7; j++) {
            sub.push(new Date(baseD))
            baseD.setHours(24)
          }
          res.push(sub)
        }
        return res
      },
      todayMidnight () {
        return new Date().setHours(0, 0, 0, 0)
      },
      staffsScrollDisabled () {
        return !this.staffs.length || this.$store.state['retailPlanConfirm']['indexStaffsLoading'] || this.$store.state['retailPlanConfirm']['indexStaffsNomore']
      },
      staffChecking () {
        let code = this.checkingStaffCode
        if (this.checkingStaffCode) {
          let staff = this.staffs.find(function (v) {
            return v.code === code
          })
          return staff
        }
        return null
      },
      staffPlansScrollDisabled () {
        return !this.staffChecking || !this.staffChecking.list.length || this.staffChecking.listLoading || this.staffChecking.listNomore
      },
      storesScrollDisabled () {
        return !this.stores.length || this.$store.state['retailPlanConfirm']['indexStoresLoading'] || this.$store.state['retailPlanConfirm']['indexStoresNomore']
      }
    },
    watch: {
      staffChecking (v) {
        if (v && v.list && !v.list.length) this.getStaffPlans()
      }
    },
    filters: {
      money (v) {
        let res = (Math.round(v * 100) / 100)
        return res ? res.toFixed(2) : 0
      },
      max (v, arg) {
        return (+v > arg) ? arg + '+' : v
      }
    },
    methods: {
      async doInit () {
        if (!this.overview.length || !this.weekData.length) this.$store.dispatch('retailPlanConfirm/indexGetWeeksData')
        if (!this.staffs.length) this.$store.dispatch('retailPlanConfirm/indexGetStaffs', true)
        if (!this.stores.length) {
          this.$store.dispatch('retailPlanConfirm/indexGetStores', true).then(function () {
            this.$store.commit('retailPlanConfirm/indexResetCheckingStoreCode')
            for (let item of this.stores) {
              this.$store.commit('retailPlanConfirm/indexToggleCheckingStoreCode', item.storeCode)
            }
          }.bind(this))
        }
      },
      getDayName (date = {}) {
        return date.getDay ? DAY_NAME[date.getDay()] : ''
      },
      getDataviewDayData (weekIndex, dayIndex, target = '') {
        if (weekIndex >= 0 && dayIndex >= 0 && target) {
          let week = this.weekData[+weekIndex]
          if (week) {
            let day = week[+dayIndex]
            if (day) {
              let res = day[target]
              if (res || res === 0) return res
            }
          }
        }
        return ''
      },
      getStatus (status) {
        return STATUS_DICT['' + status] || ''
      },
      getType (type) {
        return TYPE_DICT['' + type] || ''
      },
      async getStaffs () {
        return await this.$store.dispatch('retailPlanConfirm/indexGetStaffs')
      },
      async getStaffPlans () {
        return await this.$store.dispatch('retailPlanConfirm/indexGetStaffPlans', this.staffChecking)
      },
      async getStores () {
        return await this.$store.dispatch('retailPlanConfirm/indexGetStores')
      },
      doToggleStore (code = '') {
        if (code) {
          this.$store.commit('retailPlanConfirm/indexToggleCheckingStoreCode', code)
        }
      },
      doGoDetail (plan, editing = false) {
        if (plan && typeof plan.date === 'number') {
          if (plan.type === 'NO_PLAN' && !editing) return // 如果是没详情的计划，不允许查看，只允许编辑
          let query = { code: this.staffChecking.code, date: plan.date }
          if (editing) query.editing = true
          this.$router.push({
            path: 'check',
            query,
            append: true
          })
        }
      }
    },
    created () {
      this.doInit()
    }
  }
</script>
<style lang="less" scoped>
  @color1: #1FB8FF;
  @color2: #FFC924;
  @color3: #FF6C47;
  @color4: #66CFFF;
  @color_b1: #D7D7D7;
  @color_b2: #E5E5E5;
  @color_t1: #333;
  @color_t2: #666;
  @color_t3: #999;
  @color_bg1: #F8F8F8;

  @offset0: 0.05rem;
  @offset1: 0.1rem;
  @offset2: 0.15rem;
  @offset3: 0.2rem;

  @size01: 0.10rem;
  @size0: 0.12rem;
  @size1: 0.13rem;
  @size2: 0.14rem;
  @size3: 0.15rem;
  @size4: 0.17rem;

  .fc() {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  .bgp(@url) {
    background: url(@url) center no-repeat;
    background-size: contain;
  }
  .pam() {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
  }
  .pam2() {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
  }
  .pal() {
    position: absolute;
    top: 0;
    left: 0;
  }
  .par() {
    position: absolute;
    right: 0;
    top: 0;
  }

  input, button {
    border: none;
    background-color: transparent;
    color: inherit;
  }
  a {
    color: inherit;
    text-decoration: inherit;
  }

  .c_unread {
    position: absolute;
    top: 0;
    right: 0;
    box-sizing: border-box;
    transform: translate(50%, -50%);
    background-color: @color3;
    color: #fff;
    font-size: @size0;
    min-width: 1em;
    padding: 1px;
    min-height: 1em;
    line-height: 1em;
    overflow: hidden;
    text-align: center;
    border-radius: 0.5em e("/") 50%;
  }

  .m_header {
    .history {
      padding: 0 @offset1;
      font-size: @size2;
      text-decoration: underline;
    }
  }
  .m_main {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    overflow: hidden;
    display: flex;
    flex-direction: column;
  }
  .m_up {
    flex-shrink: 0;
    text-align: center;
    background-color: #fff;
    border-bottom: 1px solid @color_b1;
    .overview {
      display: flex;
      justify-content: space-around;
      align-items: center;
      padding: @offset0 0;
      color: @color_t1;
      font-size: @size3;
      background-color: @color_bg1;
      border: @offset0 solid #fff;
    }
    .item {
      text-align: center;
    }
    .head {
      font-size: @size0;
      color: @color_t3;
    }
    .calendar {
      border-top: 1px solid @color_b1;
      font-size: @size1;
      color: @color_t1;
    }
    .line {
      display: flex;
      align-items: center;
      min-height: 0.3rem;
      padding: 2px 0;
      &:nth-child(even) {
        background-color: @color_bg1;
      }
    }
    .line-days {
      display: block;
      position: relative;
    }
    .left, .right {
      .bgp("~@/assets/retailPlanConfirm/link.png");
      background-size: 0.075rem;
      height: 100%;
      width: 8.8%;
    }
    .left {
      transform: rotate(180deg);
      .pal();
    }
    .right {
      .par();
    }
    .days {
      display: flex;
      align-items: baseline;
      margin: @offset0 0;
    }
    .today {
      display: inline-block;
      color: #fff;
      background-color: @color1;
      border-radius: 50%;
      width: 0.16rem;
      height: 0.16rem;
      line-height: 0.16rem;
    }
    .passed {
      color: @color_t3;
    }
    .title {
      width: 9.4%;
      font-size: @size01;
      color: @color_t3;
    }
    .td {
      width: 11.6%;
      word-break: break-all;
    }
    .gap {
      width: 9.4%;
    }
    .toggle {
      border-top: 1px solid @color_b1;
      height: 0.37rem;
      width: 100%;
      font-size: @size3;
      color: @color1;
    }
    .toggle-text {
      display: inline-block;
      padding-right: 0.15rem;
      position: relative;
    }
    .toggle-arrow {
      position: absolute;
      width: 0.12rem;
      height: 0.075rem;
      background: url("~@/assets/retailPlanConfirm/arrow.png") right no-repeat;
      background-size: contain;
      right: 0;
      top: 50%;
      margin-top: -0.0325rem;
    }
    .toggle-actived {
      transform: rotate(180deg);
    }
  }
  .m_down {
    flex-grow: 1;
    overflow: hidden;
    background-color: #fff;
    margin-top: @offset1;
    display: flex;
    flex-direction: column;
  }
  .m_tabs {
    flex-shrink: 0;
    border: 1px solid @color1;
    margin: @offset1;
    border-radius: 0.175rem;
    display: flex;
    .tab {
      margin: -1px;
      width: 60%;
      height: 0.35rem;
      color: @color1;
      margin-left: -10%;
      position: relative;
      z-index: 1;
      &:first-child {
        margin-left: 0;
      }
    }
    .tab-actived {
      color: #fff;
      background-color: @color1;
      border-radius: 0.175rem;
      z-index: 2;
    }
    .text {
      position: relative;
    }
  }
  .m_staff {
    flex-grow: 1;
    overflow: hidden;
    border-top: 1px solid @color_b1;
    display: flex;
    align-items: stretch;
    .staff-member {
      border-right: 1px solid @color_b2;
      width: 0.75rem;
      flex-shrink: 0;
      overflow: hidden;
      overflow-y: auto;
      color: @color_t2;
    }
    .member {
      display: block;
      width: 100%;
      padding: @offset3 0;
      position: relative;
      &:after {
        content: "";
        position: absolute;
        bottom: 0;
        left: @offset0;
        right: @offset0;
        height: 1px;
        background-color: @color_b2;
      }
    }
    .member-actived {
      color: #fff;
      background-color: @color1;
      &:after {
        content: '';
        display: none;
      }
    }
    .member-name {
      font-size: @size4;
      position: relative;
    }
    .member-plan {
      font-size: @size0;
    }
    .staff-detail {
      flex-grow: 1;
      overflow: hidden;
      overflow-y: auto;
    }
    .item {
      display: block;
      color: @color_t2;
      padding: @offset1;
      &:nth-child(even) {
        background-color: @color_bg1;
      }
    }
    .head {
      display: flex;
      justify-content: space-between;
      align-items: center;
      color: @color1;
      font-size: @size1;
      font-weight: bold;
    }
    .plans {
      font-size: @size01;
      font-weight: normal;
    }
    .status {
      padding-right: 0.12rem;
      background: url("~@/assets/retailPlanConfirm/link.png") right no-repeat;
      background-size: 0.075rem;
    }
    .store {
      margin-top: @offset2;
      font-size: @size1;
      color: @color_t1;
    }
    .more {
      display: flex;
      justify-content: space-between;
      margin-top: @offset1 * 0.8;
    }
    .total {
      font-size: @size01;
    }
    .type {
      font-size: @size1;
    }
    .more-r {
      border: 1px solid @color3;
      color: @color3;
      height: 0.24rem;
      border-radius: 0.12rem;
      padding: 0 @offset1;
    }
  }
  .m_store {
    flex-grow: 1;
    overflow: hidden;
    overflow-y: auto;
    .tab-box {
      display: block;
      width: 100%;
    }
    .tab {
      display: flex;
      justify-content: space-between;
      align-items: center;
      width: 100%;
      text-align: left;
      min-height: 0.45rem;
      background: @color4;
      padding-left: @offset3;
      padding-right: @offset1;
      color: #fff;
      font-size: @size4;
    }
    .down {
      display: inline-block;
      width: 0.14rem;
      height: 0.08rem;
      background: url("~@/assets/retailPlanConfirm/down.png") center no-repeat;
      background-size: contain;
    }
    .up {
      background-image: url("~@/assets/retailPlanConfirm/up.png");
    }
    .wrap {
      display: block;
      padding: @offset1 0;
    }
    .gap, .gap2 {
      display: block;
      margin: @offset1 0 @offset1  @offset1;
      height: 1px;
      background-color: @color_b1;
    }
    .gap {
      margin-left: @offset1 * 2;
    }
    .date {
      display: block;
      padding: 0 @offset1;
      font-size: @size1;
    }
    .overview {
      color: @color4;
      font-size: @size1;
      font-weight: bold;
      margin-bottom: @offset2;
      margin-left: @offset1;
      margin-right: @offset1;
    }
    .people {
      font-size: @size01;
      font-weight: normal;
    }
    .block {
      display: block;
      width: 100%;
      padding-left: @offset1;
      padding-right: @offset1;
    }
    .line1 {
      display: flex;
      justify-content: space-between;
      font-size: @size1;
      color: @color_t2;
    }
    .status {
      color: @color1;
      font-weight: bold;
      padding-right: 0.12rem;
      background: url("~@/assets/retailPlanConfirm/link.png") right no-repeat;
      background-size: 0.075rem;
    }
    .line2 {
      .fc();
      align-items: flex-end;
      margin-top: @offset1;
    }
    .total {
      font-size: @size01;
      color: @color_t2;
    }
    .btn {
      height: 0.24rem;
      border: 1px solid @color3;
      border-radius: 0.24rem;
      color: @color3;
      font-size: @size0;
      text-align: center;
      padding: 0 @offset1;
    }
  }
</style>