<template>
  <bm-layout ref="layout" :isScrollTouch='false'>
    <bm-header slot="header">历史计划</bm-header>
    <div slot="top" class="flex-none">
      <div class="flex items-center top-wrapper">
        <div class="flex flex-auto items-center search-wrapper">
          <input class="flex-auto" type="text" v-model="searchName" placeholder="输入人员姓名">
          <div v-show="searchName" class="close-btn" @click="clearName"></div>
        </div>
        <div class="search-btn" @click="search">搜索</div>
      </div>
    </div>
    <bm-loadmore-page
      ref="list"
      :value="control"
      @input="setControl"
      :fetch="searchData"
      :dataLength="listLen"
      :initPageIndex="0"
      :pageSize="10"
      :scrollDistance="40">
      <template v-for="day in listData">
        <li class="list-header">{{day['planDate'] | datetime('YYYY/MM/DD 周dd')}}</li>
        <template v-for="(item, index) in day['planList']">
          <li class="flex item-wrapper" @click="test(item)">
            <div class="flex-auto">
              <p class="i-header">{{item['userName']}}
                <span class="num">{{item['planNum']}}个计划</span>
                <span class="status">{{item['planStatusDesc']}}</span>
              </p>
              <p class="local" v-if="item['validFlag'] === 'VALID_PLAN'">{{item['locationList'] | formatLocation}}</p>
              <p class="local" v-else>今日休息</p>
              <p class="detail" v-if="item['sumMoney'] > 0 && item['validFlag'] === 'VALID_PLAN'">总金额：¥{{item['sumMoney'] | formatPrice}}; 至尊(盒)：{{item['newNum']}}</p>
              <p class="detail" v-if="item['sumMoney'] === 0 && item['validFlag'] === 'VALID_PLAN'">工作任务: {{item['taskList'] | formatTask}}</p>
            </div>
            <div class="detail-btn">
              <div>详情</div>
            </div>
          </li>
          <li v-if="index < (day['planList'].length - 1)" class="separate"></li>
        </template>
      </template>
      <li v-if="control.loaded && listData.length > 0" class="end-wrapper">- - - - - 数据已全部加载 - - - - -</li>
      <li v-if="control.loaded && listData.length <= 0 && !isSelect" class="end-wrapper">
        <bm-empty></bm-empty>
      </li>
      <li v-if="control.loaded && listData.length <= 0 && isSelect" class="end-wrapper">无搜索结果</li>
      <li v-if="!control.loaded && control.loading" class="end-wrapper">数据加载中...</li>
    </bm-loadmore-page>
  </bm-layout>
</template>

<script>
  import { Indicator } from 'mint-ui'
  import { mapGetters } from 'vuex'
  // import Vue from 'vue'
  let __isFromCheck = false
  export default {
    data () {
      return {
        listLen: 0,
        searchName: '',
        isSelect: false,      // 是否点击了搜索按钮
        isFromCheck: false
      }
    },
    filters: {
      formatLocation (value) {
        return value.filter(e => e).map(e => {
          return e.locationDesc
        }).join('/')
      },
      formatTask (value) {
        return value.map(e => {
          return e.taskDesc
        }).join(', ')
      },
      formatPrice (value) {
        return Number(value / 100).toFixed(2)
      }
    },
    methods: {
      setControl (params) {
        this.$store.commit('retailPlanConfirm/setHistoryControl', params)
      },
      clearName () { this.searchName = '' },
      async searchData () {
        let result = await this.$store.dispatch('retailPlanConfirm/searchHistoryData')
        if (result && result.dayList) {
          let len = 0
          result.dayList.forEach(e => {
            len += e['planList'].length
          })
          this.listLen = len
        }
        return result
      },
      async search () {
        this.isSelect = true
        this.$store.commit('retailPlanConfirm/setUserName', this.searchName)
        this.$refs.layout.$refs.main.scrollTop = 0
        Indicator.open()
        await this.$refs.list.refresh()
        Indicator.close()
      },
      test (item) {
        this.$router.push({
          path: '../check',
          query: { code: item.userCode, date: item.planDate },
          append: true
        })
      },
      resetData () {
        this.$store.commit('retailPlanConfirm/setUserName', '')
        this.setControl({
          pageIndex: 0,
          loading: false,
          loaded: false
        })
        this.$store.commit('retailPlanConfirm/setHistoryData', [])
      }
    },
    computed: {
      ...mapGetters({
        'listData': 'retailPlanConfirm/historyData',
        'control': 'retailPlanConfirm/historyControl',
        'userName': 'retailPlanConfirm/userName'
      })
    },
    beforeRouteEnter (to, from, next) {
      if (from.path === '/retailPlanConfirm/check') {
        __isFromCheck = true
      }
      next()
    },
    created () {
      if (__isFromCheck) {
        this.searchName = this.userName
      } else {
        this.searchName = ''
        this.resetData()
      }
    },
    beforeDestroy () {
      __isFromCheck = false
    }
  }
</script>

<style lang="less" scoped>
  .top-wrapper {
    height: .50rem;
    background-color: #fff;
    padding: 0 .10rem;
    font-size: .15rem;
    .search-wrapper {
      color: #999;
      height: .30rem;
      background-color: #f2f2f2;
      border-radius: .15rem;
      input { border: none; }
      &:before {
        content: '';
        display: block;
        margin: 0 .05rem;
        width: .15rem;
        height: .15rem;
        background: url('~@/assets/common/search-gray.png') no-repeat center center;
        background-size: contain;
      }
      .close-btn {
        display: inline-block;
        box-sizing: content-box;
        padding: 0 .10rem;
        width: .21rem;
        height: .21rem;
        background: url('~@/assets/common/close_gray@2x.png') no-repeat center center;
        background-size: contain;
      }
    }
    .search-btn {
      color: #1fb8ff;
      margin-left: .10rem;
    }
  }
  .list-header {
    padding: .10rem;
    border-top: 1px solid #e5e5e5;
    font-size: .14rem;
    color: #999;
  }
  .item-wrapper {
    font-size: .13rem;
    color: #666;
    background-color: #fff;
    padding: .10rem;
    .i-header {
      font-weight: bold;
      line-height: .13rem;
      span {
        display: inline-block;
        font-size: .10rem;
        font-weight: normal;
      }
      .num { padding-left: .05rem; }
      .status {
        margin-left: .20rem;
        color: #1fb8ff;
      }
    }
    .local { margin-top: .15rem; }
    .detail {
      margin-top: .08rem;
      font-size: .10rem;
    }
    .detail-btn {
      padding-right: .12rem;
      position: relative;
      line-height: .13rem;
      div:after {
        content: '';
        display: block;
        position: absolute;
        top: 0;
        right: 0;
        width: .08rem;
        height: .13rem;
        background: url('~@/assets/common/rightArrow.png') no-repeat center center;
        background-size: contain;
      }
    }
  }
  .end-wrapper {
    padding: .10rem;
    text-align: center;
    color: #999;
  }
  .separate {
    width: 100%;
    margin-left: .20rem;
    height: 1px;
    transform: scaleY(0.5);
    background-color: #e5e5e5;
  }
</style>
