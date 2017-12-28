<template>
  <bm-layout>
    <bm-header slot="header">工作计划</bm-header>
    <mt-loadmore class="m_list" :top-method="doRefresh" ref="loadmore" v-scrolled>
      <ul>
        <li class="li" v-for="item of list">
          <div class="link" @click="goDetail(item)">
            <div class="link-l">
              <p class="date">{{ item.date | datetime('MM/DD') }}<i class="unread" v-if="item.unread">{{ item.unread }}</i></p>
              <p class="day" :class="{ 'day-with-status': item.status && item.status !== 'unconfirmed' }">{{ item.date | datetime('ddd') }} </p>
              <p class="status" v-if="item.status && item.status !== 'unconfirmed'">{{ STATUS_DICT[item.status] }}</p>
            </div>
            <i class="gap"></i>
            <div class="link-r" :class="{ 'noplan': item.type === 'NO_PLAN' }">
              <template v-if="item.type === 'VALID_PLAN'">
                <p class="plans">{{ item.plans }}个计划：</p>
                <p class="store"><template v-for="(store, index) of item.stores">{{ index !== 0 ? ' / ' : '' }}{{ store }}</template></p>
                <p class="overview">总金额：¥{{ item.price }}，总支数：{{ item.amount }}</p>
              </template>
              <template v-else>
                <p class="rest" v-if="item.type === 'TODAY_REST'">今日休息</p>
                <p class="empty" v-if="item.type === 'NO_PLAN'">无计划信息，请联系上级制定</p>
              </template>
            </div>
          </div>
        </li>
      </ul>
    </mt-loadmore>
  </bm-layout>
</template>
<script>
  import { sfa as Api } from '@/utils/baseRequest'

  const VIEW_DAYS_SIZE = 7

  class Day {
    constructor (res = {}) {
      this.api_date = res['planDate'] || null
      this.type = res['validFlag'] || ''
      this.date = (function () {
        if (res['planDate'] || res['planDate'] === 0) {
          let date = new Date(res['planDate'])
          date.setHours(0)
          date.setMinutes(0)
          date.setSeconds(0)
          date.setMilliseconds(0)
          return +date
        }
      })() || null
      this.unread = res['notReadNum'] || 0
      this.status = res['planStatus'] || ''
      this.plans = res['planNum'] || 0
      this.stores = (function () {
        let arr = []
        for (let item of res['storeList'] || []) {
          arr.push(item['storeName'])
        }
        return arr
      })() || []
      this.price = (res['price'] / 100) || 0
      this.amount = res['prdNum'] || 0
    }
  }

  export default {
    data () {
      return {
        info: [],
        TYPE_DICT: {
          'NOT_ENTER_STORE': '今日不进店',
          'TODAY_REST': '今日休息',
          'VALID_PLAN': '有效计划',
          'INVALID_PLAN': '无效计划',
          'NO_PLAN': '无计划'
        },
        STATUS_DICT: {
          'unconfirmed': '未确认',
          'confirmed': '已确认',
          'reconfirmed': '已重新确认'
        }
      }
    },
    computed: {
      lengthCache () {
        return this.$store.state['retailPlan']['indexLength'] || 0
      },
      list () {
        let res = []
        // let todayMidnightTimestamp = (function () {
        //   let d = new Date()
        //   d.setHours(0)
        //   d.setMinutes(0)
        //   d.setSeconds(0)
        //   d.setMilliseconds(0)
        //   return +d
        // })()
        let todayMidnightTimestamp = this.today
        // 不小于最小长度7天，不少于接口返回长度
        while (res.length < VIEW_DAYS_SIZE || res.length < this.info.length || res.length < this.lengthCache) {
          let targetDate = todayMidnightTimestamp + (res.length * 3600000 * 24)
          let target = this.info.find(function (v) {
            return v['date'] === targetDate
          })
          res.push(target || { date: targetDate })
        }
        return res
      },
      today () {
        return new Date().setHours(0, 0, 0, 0)
      }
    },
    methods: {
      async doRefresh () {
        let res = await this.getList()
        this.$refs.loadmore.onTopLoaded()
        return res
      },
      async getList () {
        let { 'itemList': res = [] } = await Api.post('/plan/getPlanList', {
          'token': simpleLocalDb.getItem('token')
        }, {
          '_NEED_CODE_0': true,
          '_INDICATOR': true
        })
        this.$store.state['retailPlan']['indexLength'] = res.length
        this.info = []
        for (let item of res || []) {
          this.info.push(new Day(item))
        }
      },
      goDetail (item) {
        if (item.type === 'NO_PLAN') return
        this.$router.push({
          path: 'check',
          query: { date: item.api_date },
          append: true
        })
      }
    },
    created () {
      this.getList()
    }
  }
</script>
<style lang="less" scoped>
  @color1: #1FB8FF;
  @color2: #FFC924;
  @color3: #FF6C47;
  @color_b1: #D7D7D7;
  @color_b2: #E5E5E5;
  @color_t1: #333;
  @color_t2: #666;
  @color_t3: #999;

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

  input, button {
    border: none;
    background-color: transparent;
    color: inherit;
  }
  a {
    color: inherit;
    text-decoration: inherit;
  }

  .m_list {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    overflow: hidden;
    overflow-y: auto;
    .li {
      display: block;
    }
    .li:nth-child(odd) {
      background-color: #fff;
    }
    .link {
      display: flex;
      align-items: center;
      padding: @offset3 0;
    }
    .link-l {
      width: 17.5%;
      min-width: 0.56rem;
      flex-shrink: 0;
      display: flex;
      flex-direction: column;
      align-items: center;
      color: @color1;
    }
    .date {
      position: relative;
    }
    .unread {
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
    .day {
      font-size: @size4;
    }
    .day-with-status {
      font-size: @size2;
    }
    .status {
      background-color: @color1;
      color: #fff;
      font-size: @size01 * 0.8;
      padding: 1px 3px;
      border-radius: 0.5em e("/") 50%;
    }
    .gap {
      width: 2px;
      height: 54px;
      background-color: @color_b1;
      flex-shrink: 0;
    }
    .link-r {
      flex-grow: 1;
      margin: 0 @offset1;
      background: url("~@/assets/retailPlan/right.png") right no-repeat;
      background-size: 0.075rem;
      padding-right: 0.1rem;
    }
    .noplan {
      background-image: none;
    }
    .plans {
      font-size: @size0;
      color: @color_t2;
    }
    .store {
      font-size: @size3;
      color: @color_t1;
      margin: @offset0 0;
    }
    .overview {
      font-size: @size0;
      color: @color_t3;
    }
    .rest {
      font-size: @size3;
      color: @color_t2;
    }
    .empty {
      font-size: @size3;
      color: @color_t3;
    }
  }
</style>