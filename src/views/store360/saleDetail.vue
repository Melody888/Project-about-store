<template>
  <bm-layout ref="layout">
    <div slot="header">
      <bm-header>销量提报详情</bm-header>
      <div class="store360__sale__store">
        <i class="store360__pre" @click="pre" v-show="isShowPre"></i>
        <span @click="$refs.picker.open()">{{monthPick | datetime('YYYY/MM')}}</span>
        <i class="store360__next" @click="next" v-show="isShowNext"></i>
      </div>
    </div>
    <section class="store360__column" v-for="(item, num) in saleWeekList" v-if="saleWeekList.length">
      <div class="title">{{item.startDate | datetime('YYYY/MM/DD')}} - {{item.endDate | datetime('YYYY/MM/DD')}}</div>
      <ul class="store360__table" v-if="item.saleList && item.saleList.length">
        <li class="row label">
          <div class="item"></div>
          <div class="item" v-for="data in item.saleList">{{data.planDate | datetime('dd')}}<br>{{data.planDate | datetime('DD')}}</div>
        </li>
        <li class="row">
          <div class="item"><p class="m_center">销售额<br>(万元)</p></div>
          <p class="item" v-for="data in item.saleList">{{data.actuSumprice ? (data.actuSumprice/1000000).toFixed(2) : (data.planDate>currentDate?'':0)}}</p>
        </li>
        <li class="row">
          <div class="item"><p class="m_center">至尊<br>(套)</p></div>
          <p class="item" v-for="data in item.saleList">{{data.actuNum ? data.actuNum : (data.planDate>currentDate?'':0)}}</p>
        </li>
        <li class="row">
          <div class="item"><p class="m_center">出勤<br>人数</p></div>
          <p :class="['item', {'click-font': item.saleList[index].personNum, 'popupFocus': currentMonth === num && currentPopup === 'sale' + index}]" v-for="(d, index) in item.saleList" @click.stop="togglePopup(true, 'sale' + index, num, d, $event)">{{d.personNum ? d.personNum : (d.planDate>currentDate?'':0)}}</p>
          <div class="popupModal" :ref="'pop'+num" v-show="isShowPop && currentMonth === num">
            <div class="flex justify-between items-center line-wrap header"><p>出勤人员</p><p>至尊(套)</p></div>
            <template v-if="currentPopup && currentMonth === num">
              <ul class="person-list">
                <li class="flex justify-between items-center" v-for="person in currentPersonList"><p class="flex-auto">{{person.userName}}</p><p class="key">{{person.actuNum | formatNumber}}</p></li>
              </ul>
            </template>
          </div>
        </li>
      </ul>
    </section>
    <bm-datetime-picker
      slot="bottom"
      v-model="monthPick"
      ref="picker"
      type="dateym">
    </bm-datetime-picker>
  </bm-layout>
</template>
<style lang="less" scoped>
  @tableLabelHeight: .42rem;
  .store360__sale__store {
    position: relative;
    width: 100%;
    background: #fff;
    border-bottom: solid 1px #d7d7d7;
    font-size: .15rem;
    color: #333;
    text-align: center;
    line-height: .44rem;
    .store360__pre, .store360__next {
      position: absolute;
      top: 0;
      bottom: 0;
      width: 0;
      height: 0;
      margin: auto .1rem;
      display: block;
      border-top: .05rem solid transparent;
      border-bottom: .05rem solid transparent;
    }
    .store360__pre {
      left: .1rem;
      border-right: .05rem solid rgba(0, 0, 0, .54);
    }
    .store360__next {
      right: .1rem;
      border-left: .05rem solid rgba(0, 0, 0, .54);
    }
  }
  .store360__column {
    margin: .1rem 0;
    background: #fff;
    border-bottom: solid 1px #d7d7d7;
    .title {
      margin: 0 .1rem;
      border-bottom: solid 1px #e5e5e5;
      line-height: .44rem;
      text-align: center;
      color: #1fb8ff;
      font-size: .14rem;
    }
  }
  .store360__table {
    background: #fff;
    padding: .1rem 0 .1rem 0;
    .row {
      align-items: center;
      height: .30rem;
      margin: 0 .1rem;
      text-align: center;
      color: #333;
      &.label {
        height: @tableLabelHeight;
        color: #999;
        font-size: .14rem;
        .item { line-height: 1.5em; min-height: 1px; }
      }
      &:nth-child(even) {
        background: #F8F8F8;
      }
      .item {
        width: .36rem;
        height: .30rem;
        line-height: .30rem;
        font-size: .12rem;
        float: left;
        text-align: center;
        &:first-child {
          width: .44rem;
          height: .30rem;
          line-height: 1;
          box-sizing: border-box;
          color: #999;
          font-size: .1rem;
          text-align: center;
          .m_center { margin-top: .05rem; }
        }
      }
    }
  }
  .click-font {
    color: #1fb8ff;
    text-decoration: underline;
    &.gray-font { color: #999; }
  }
  .popupFocus {
    &:after {
      content: '';
      display: block;
      margin: -0.15rem auto 0;
      width: 0;
      height: 0;
      border: .10rem solid transparent;
      border-bottom: .10rem solid #1fb8ff;
      position: relative;
      z-index: 2;
    }
  }
  .popupModal {
    position: absolute;
    margin-top: .32rem;
    width: 1.7rem;
    border-radius: 4px;
    box-shadow: 0 0 15px #999;
    background-color: #fff;
    overflow: hidden;
    .person-list { max-height: 1.8rem; overflow: hidden; overflow-y: auto; }
    li, .line-wrap { height: .30rem; padding: 0 .10rem; text-align: left; }
    .header { background-color: #1fb8ff; color: #fff; }
    .key { flex-shrink: 0; }
  }
</style>
<script>
  import api from '@/api'
  import { mapGetters } from 'vuex'
  import { zeroTs } from '@/advanced/filters'
  export default {
    data () {
      return {
        storeId: '',
        saleWeekList: [],
        currentDate: zeroTs(),
        monthPick: new Date(),
        isShowPre: true,
        isShowNext: false,
        currentPopup: '',     // 当前触发的popup
        isShowPop: false,
        currentMonth: 0,
        currentPersonList: []
      }
    },
    computed: {
      ...mapGetters({
        store: 'store360/store'
      })
    },
    filters: {
      formatNumber (value) {
        let val = Number(value) || 0
        return val > 9999 ? '9999+' : val
      }
    },
    methods: {
      getSaleListByParams () {
        api.store360.getSaleListByParams({
          data: {
            storeId: this.store.storeId,
            token: simpleLocalDb.getItem('token'),
            planDate: this.monthPick.getTime()
          }
        }).then(res => {
          if (res.responseCode === 0) {
            this.saleWeekList = res.saleWeekList
          } else {
            this.$toast(res.responseMsg)
          }
        })
      },
      pre () {
        if (this.monthPick.getMonth() > 0) {
          this.monthPick = new Date(this.monthPick.setMonth(this.monthPick.getMonth() - 1))
        } else {
          this.monthPick = new Date(this.monthPick.setFullYear(this.monthPick.getFullYear() - 1, 11, 1))
        }
      },
      next () {
        if (this.monthPick.getMonth() < 11) {
          this.monthPick = new Date(this.monthPick.setMonth(this.monthPick.getMonth() + 1))
        } else {
          this.monthPick = new Date(this.monthPick.setFullYear(this.monthPick.getFullYear() + 1, 0, 1))
        }
      },
      togglePopup: (function () {  // 显示/隐藏弹层
        let _popupWidth = 0
        let _windowWidth = 0
        return function (status, strId, month, item, event) {
          if (item && !item.personNum) {
            return this.closePopup()
          }
          this.currentMonth = month
          this.currentPopup = strId
          this.isShowPop = status
          if (status && event) {
            // 数组降序
            let personList = [].concat(this.saleWeekList[month].saleList[strId.slice(4)].personList)
            personList.sort((a, b) => {
              return a.actuNum < b.actuNum
            })
            this.currentPersonList = personList
            let left = Number(event.target.offsetLeft)
            let pop = this.$refs['pop' + month][0]
            if (!_windowWidth) {
              _windowWidth = this.$refs.layout.$el.offsetWidth
              _windowWidth -= _windowWidth / 3.2 * 0.2
            }
            if (!_popupWidth) {
              _popupWidth = _windowWidth / 3.2 * 1.7
            }
            if (left + _popupWidth > _windowWidth - 10) {
              left = _windowWidth - _popupWidth - 10
            } else {
              left -= 10
            }
            pop.style.left = left + 'px'
          }
        }
      })(),
      closePopup () {
        this.togglePopup(false, '')
      }
    },
    watch: {
      monthPick (val) {
        // 更新数据
        if (val) {
          this.getSaleListByParams()
        }
        // 判断是否显示下一月
        if (new Date(val).getFullYear() === new Date().getFullYear() && new Date(val).getMonth() === new Date().getMonth()) {
          this.isShowNext = false
        } else {
          this.isShowNext = true
        }
        // 判断是否显示上一月
        if (this.currentDate - this.monthPick.getTime() > 86400000 * 31 * 3) {
          this.isShowPre = false
        } else {
          this.isShowPre = true
        }
      }
    },
    mounted () {
      let layout = this.$refs.layout.$el
      layout.addEventListener('click', this.closePopup)
    },
    beforeDestroy () {
      let layout = this.$refs.layout.$el
      layout.removeEventListener('click', this.closePopup)
    }
  }
</script>
