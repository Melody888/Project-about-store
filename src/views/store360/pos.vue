<template>
  <bm-layout>
    <bm-header slot="header" class="pos-header"><div class="truncate">{{posVo['storeName']}}</div></bm-header>
    <div slot="top">
      <div class="time-header-swrapper">
        <div class="time-btn" @click="setDay(-1)">前一天</div>
        <div class="pos-day"><span @click="openDatePicker">{{nowTime | datetime('MM月DD日')}}</span></div>
        <div :class="['time-btn',{'pos-hidden':!showTomorrow}]" @click="setDay(1)">后一天</div>
      </div>
    </div>
    <div class="pos-container" v-if="posVo['orderNo']">
      <div class="pos-total"><span>总销量：{{posVo['sumNum']}}支，¥{{posVo['sumPrice'] | toFix}}</span></div>
      <ul class="pos-prd-list">
        <li v-for="item in posVo['posPrdList']">
          <span class="p-name">{{item.prdName}}</span>
          <div class="p-price-box">
            <span class="p-price">单价(元) : ¥{{item.price | toFix}}</span>
            <span class="p-number">支数: {{item.prdNum}}</span>
          </div>
        </li>
      </ul>
    </div>
    <bm-empty :reload="getPosDetail" v-else></bm-empty>
    <div class="pos-proof" v-if="posVo['fileList'] && posVo['fileList'].length >0">
      <div class="proof-header"><span>凭证</span></div>
      <ul class="proof-img-list" ref="imgList">
        <li v-for="(item, index) in posVo['fileList']">
          <img :src="item.filePath" @click="checkPhoto($refs.imgList, item.filePath)">
        </li>
      </ul>
    </div>
    <div slot="bottom">
      <bm-datetime-picker
          v-model="timePicker"
          @confirm="setDay"
          ref="pickerDate"
          :endDate="today"
          type="date">
      </bm-datetime-picker>
    </div>
  </bm-layout>
</template>

<script>
  import BmCheckPhoto from '@/components/plugins/BmCheckPhoto'
  import { getCheckPhotoOptions } from '@/utils/dom'
  import api from '@/api'
  export default {
    data () {
      let time = new Date()
      let today = new Date(time.getFullYear(), time.getMonth(), time.getDate())
      return {
        nowTime: today,
        timePicker: today,
        posVo: {},
        requestSuccess: false,
        today
      }
    },
    computed: {
      showTomorrow () {
        return this.today.getTime() > this.nowTime.getTime()
      }
    },
    methods: {
      getPosDetail () {
        let id = this.$route.query && this.$route.query.storeId
        if (!id) {
          return this.$toast('缺失门店id')
        }
        api.store360.getPosDetail({
          data: {
            'storeId': id,
            'planDate': this.nowTime.getTime(),
            'token': simpleLocalDb.getItem('token')
          }
        }).then(result => {
          if (result.responseCode === 0) {
            this.posVo = result.posVo
            this.requestSuccess = true
          } else {
            this.$toast(result.responseMsg)
          }
        })
      },
      openDatePicker () {
        this.timePicker = this.nowTime
        this.$refs.pickerDate.open()
      },
      checkPhoto (container, img) {  // 查看图片
        BmCheckPhoto(getCheckPhotoOptions(img, container))
      },
      setDay (params) {
        let timeNumber = 0
        if (typeof params === 'number') {
          timeNumber = this.nowTime.getTime() + params * 24 * 60 * 60 * 1000
          this.nowTime = new Date(timeNumber)
        } else {
          this.nowTime = params
        }
      }
    },
    watch: {
      nowTime: function (time) {
        this.getPosDetail()
      }
    },
    filters: {
      toFix: function (value) {
        let num = value || 0
        num = Number.parseInt(num) / 100
        return num.toFixed(2)
      }
    },
    created () {
      this.getPosDetail()
    }
  }
</script>

<style lang="less" scoped>
  .pos-header /deep/ .bm-header__left { width: 15%; }
  .pos-header /deep/ .bm-header__main {
    width: 70%;
    font-weight: 500;
  }
  .pos-header /deep/ .bm-header__right { width: 15%; }
  .pos-hidden { visibility: hidden; }
  .time-header-swrapper {
    padding: .075rem 0;
    display: flex;
    flex-direction: row;
    align-items: center;
    color: #25baff;
    font-size: .14rem;
    border-bottom: 1px solid #e5e5e5;
    margin-bottom: .10rem;
    background-color: #fff;
    .time-btn {
      padding: .075rem .10rem;
    }
    .pos-day {
      flex: 1;
      flex-shrink: 0;
      text-align: center;
      &>span {
        display: inline-block;
        padding-right: .165rem;
        position: relative;
        &::after {
          content: ' ';
          display: block;
          background: url('~@/assets/store360/whiteArrow_down@2x.png') no-repeat;
          background-size: contain;
          right: 0;
          top: .07rem;
          position: absolute;
          width: .12rem;
          height: .06rem;
        }
      }
    }
  }
  .pos-container {
    background-color: #fff;
    .pos-total {
      padding: .15rem .10rem;
      vertical-align: middle;
      font-size: .15rem;
      font-weight: bold;
      color: #333;
      border-bottom: 1px solid #e5e5e5;
    }
    .pos-prd-list {
      padding-left: .10rem;
      border-bottom: 1px solid #e5e5e5;
      margin-bottom: .10rem;
      li {
        padding: .15rem 0;
        border-bottom: 1px solid #e5e5e5;
        &:last-of-type {
          border-bottom: 0;
        }
      }
      .p-name {
        font-size: .13rem;
        color: #666;
        display: block;
        margin-bottom: .15rem;
      }
      .p-price-box {
        display: flex;
        flex-direction: row;
        font-size: .15rem;
        color: #333;
        .p-price { flex: 3; }
        .p-number { flex: 2; }
      }
    }
  }
  .pos-proof {
    background-color: #fff;
    margin-bottom: .10rem;
    .proof-header {
      padding: .15rem .10rem .15rem 0;
      margin: 0 0 .15rem .15rem;
      vertical-align: middle;
      font-size: .15rem;
      color: #333;
      border-bottom: 1px solid #e5e5e5;
      &>span {
        display: inline-block;
      }
    }
    .proof-img-list {
      display: flex;
      flex-direction: row;
      flex-wrap: wrap;
      padding-top: .15rem 0;
      img {
        width: .60rem;
        height: .60rem;
        margin: 0 .10rem .15rem .10rem;
      }
    }
  }
</style>
