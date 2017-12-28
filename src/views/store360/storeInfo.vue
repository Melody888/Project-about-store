<template>
  <bm-layout>
    <bm-header slot="header">门店基本信息</bm-header>
    <div class="store360__store__info">
      <p class="title" v-if="storeBaseInfoVo">{{storeBaseInfoVo.storeName}}</p>
      <p class="address" v-if="storeBaseInfoVo">{{storeBaseInfoVo.address}}</p>
      <div v-if="storeBaseInfoVo && storeBaseInfoVo.gpsLongitude && storeBaseInfoVo.gpsLatitude">
        <p class="location" v-if="distance" @click="openMap">距离您{{(distance/1000).toFixed(2)}}km</p>
      </div>
    </div>
    <section class="store360__store__container">
      <p class="store360__store__title">门店面积</p>
      <div class="store360__store__column line">
        <div class="item">
          <p class="label">门店营业面积(㎡)</p>
          <p>{{storeBaseInfoVo && storeBaseInfoVo.busiArea ? storeBaseInfoVo.busiArea : '无'}}</p>
        </div>
        <div class="item">
          <p class="label">洗化区面积(㎡)</p>
          <p>{{storeBaseInfoVo && storeBaseInfoVo.washArea ? storeBaseInfoVo.washArea : '无'}}</p>
        </div>
      </div>
      <p class="store360__store__title">门店容量</p>
      <div class="store360__store__column">
        <div class="item">
          <p class="label">成交单数/月</p>
          <p>{{storeBaseInfoVo && storeBaseInfoVo.billNum ? storeBaseInfoVo.billNum : 0}}</p>
        </div>
        <div class="item">
          <p class="label">客单价(元)</p>
          <p>{{storeBaseInfoVo && storeBaseInfoVo.averagePrice ? storeBaseInfoVo.averagePrice/100 : '无'}}</p>
        </div>
        <div class="item">
          <p class="label">总营业额(万元)</p>
          <p>{{storeBaseInfoVo && storeBaseInfoVo.sumPrice ? (storeBaseInfoVo.sumPrice/1000000).toFixed(2) : '无'}}</p>
        </div>
      </div>
      <p class="store360__store__title">客流量</p>
      <div class="store360__store__column line">
        <div class="item">
          <p class="label">平时/10分钟</p>
          <p>{{storeBaseInfoVo && storeBaseInfoVo.personNumPs ? storeBaseInfoVo.personNumPs : 0}}</p>
        </div>
        <div class="item">
          <p class="label">节假日/10分钟</p>
          <p>{{storeBaseInfoVo && storeBaseInfoVo.personNumJjr ? storeBaseInfoVo.personNumJjr : 0}}</p>
        </div>
      </div>
    </section>
    <section class="store360__store__container" v-if="storeBaseInfoVo">
      <p class="store360__store__title">营业时间</p>
      <div class="store360__store__scchedule">
        <p class="center color-999" v-if="storeBaseInfoVo.businessTimeList.length === 0">无</p>
        <div class="flex" v-for="item in storeBaseInfoVo.businessTimeList">
          <p class="label">{{item.dayTypeDesc}}</p>
          <div class="value">
            <p v-for="data in item.workTimeList">{{data.startTime | formatTime}} - {{data.endTime | formatTime}}</p>
          </div>
        </div>
      </div>
      <p class="store360__store__title">班次信息</p>
      <div class="store360__store__scchedule">
        <p class="center color-999" v-if="storeBaseInfoVo.classInfoList.length === 0">无</p>
        <div class="flex" v-for="item in storeBaseInfoVo.classInfoList">
          <p class="label">{{item.classDesc}}</p>
          <div class="value"><p v-for="data in item.workTimeList">{{data.startTime | formatTime}} - {{data.endTime | formatTime}}</p></div>
        </div>
      </div>
    </section>
    <section class="store360__store__contact items-center" v-if="storeBaseInfoVo">
      <p class="flex-auto">门店联系人</p>
      <p :class='{"color-999": !storeBaseInfoVo.contactor}'>{{storeBaseInfoVo.contactor || '无'}}</p>
      <img class="store360__store__phone" src="~@/assets/store360/callOut@3x.png" v-if="storeBaseInfoVo.contactNumber" @click="phone(storeBaseInfoVo.contactNumber)">
    </section>
  </bm-layout>
</template>
<style lang="less" scoped>
  .store360__store__info {
    margin-bottom: .1rem;
    padding: 0 .1rem;
    background: #fff;
    border-bottom: solid 1px #d7d7d7;
    .title {
      font-size: .15rem;
      color: #333;
      line-height: .44rem;
      border-bottom: solid 1px #e5e5e5;
    }
    .address {
      padding: .15rem 0 .1rem;
      font-size: .12rem;
      color: #999;
    }
    .location {
      padding-left: .17rem;
      margin-bottom: .15rem;
      background: url('~@/assets/store360/ic_place.png') no-repeat left center / .12rem .12rem;
      color: #1fb8ff;
      font-size: .12rem;
    }
  }
  .store360__store__title {
    height: .35rem;
    background: #fff;
    font-size: .14rem;
    color: #666;
    line-height: .4rem;
    text-align: center;
    font-weight: 600;
    &::before, &::after {
      content: ' ';
      display: inline-block;
      width: .2rem;
      height: 2px;
      margin: 0 .1rem;
      background: #79d4ff;
      vertical-align: middle;
      border-radius: 1px;
    }
  }
  .store360__store__container {
    margin-bottom: .1rem;
    border-bottom: solid 1px #d7d7d7;
  }
  .store360__store__column {
    display: flex;
    padding: .05rem 0 .15rem;
    background: #fff;
    text-align: center;
    &.line {
      .item {
        border-right: solid 1px #e5e5e5;
        &:last-child {
          border: none;
        }
      }
    }
    .item {
      flex: 1;
      color: #333;
      font-size: .16rem;
    }
    .label {
      margin-bottom: .05rem;
      color: #999;
      font-size: .12rem;
    }
  }
  .store360__store__scchedule {
    padding-bottom: .1rem;
    background: #fff;
    font-size: .16rem;
    color: #333;
    line-height: .26rem;
    .label {
      flex: 1;
      padding-left: .2rem;
      font-size: .12rem;
      color: #999;
      text-align: right;
    }
    .value {
      flex: 2;
      padding-left: .2rem;
    }
  }
  .store360__store__contact {
    display: flex;
    margin-bottom: .1rem;
    padding: 0 .1rem;
    background: #fff;
    border-bottom: solid 1px #d7d7d7;
    font-size: .15rem;
    line-height: .44rem;
    color: #333;
  }
  .store360__store__phone {
    padding-left: .1rem;
    box-sizing: content-box;
    // background: url('') no-repeat right center / .18rem .18rem;
    width: .18rem;
    height: .18rem;
    color: #1fb8ff;
    font-size: .12rem;
    line-height: .44rem;
  }
</style>
<script>
  import api from '@/api'
  import moment from 'moment'
  import { mapGetters } from 'vuex'
  import { getLocation, mapNavigation } from '@/utils/native'
  export default {
    data () {
      return {
        storeBaseInfoVo: null,
        distance: 0
      }
    },
    computed: {
      ...mapGetters({
        storeList: 'store360/storeList',
        store: 'store360/store',
        activeStoreIndex: 'store360/activeStoreIndex'
      })
    },
    filters: {
      formatTime (value) {
        if (!value) { return '无' }
        let val = moment(value)
        return val.format('hh:mm')
      }
    },
    methods: {
      filterUseLess (business) {
        let len = business.length
        let newBusiness = []
        while (len > 0) {
          let tmp = business[len - 1].workTimeList.filter((e) => {
            return e.endTime || e.startTime
          })
          tmp.length > 0 && newBusiness.push(Object.assign({}, business[len - 1], {workTimeList: tmp}))
          len--
        }
        return newBusiness
      },
      getStoreInfoByStoreId () {
        api.store360.getStoreInfoByStoreId({
          data: {
            storeId: this.store.storeId,
            token: simpleLocalDb.getItem('token')
          }
        }).then(res => {
          if (res.responseCode === 0) {
            // 过滤无效的时间段
            let newBusiness = this.filterUseLess(res.storeBaseInfoVo.businessTimeList)
            res.storeBaseInfoVo.businessTimeList = newBusiness
            let newClassInfo = this.filterUseLess(res.storeBaseInfoVo.classInfoList)
            res.storeBaseInfoVo.classInfoList = newClassInfo
            this.storeBaseInfoVo = res.storeBaseInfoVo
            if (res.storeBaseInfoVo.gpsLatitude && res.storeBaseInfoVo.gpsLongitude) {
              this.getDistance(res.storeBaseInfoVo.gpsLongitude, res.storeBaseInfoVo.gpsLatitude)
            }
          } else {
            this.$toast(res.responseMsg)
          }
        })
      },
      getDistance (gpsLongitude, gpsLatitude) {
        // if (window.BMap) {
        getLocation((res) => {
          let data = JSON.parse(res)
          if (data.isSuccess) {
            let map = new BMap.Map('allmap')
            let currentPoint = new BMap.Point(data.gpsLongitude, data.gpsLatitude)
            let targetPoint = new BMap.Point(gpsLongitude, gpsLatitude)
            this.distance = (map.getDistance(currentPoint, targetPoint)).toFixed(2)
          } else {
            this.$toast('无法获取当前位置。')
          }
        })
        // }
      },
      phone (phone) {
        window.location.href = 'tel:' + phone
      },
      openMap () {
        let { gpsLatitude, gpsLongitude, address, storeName } = this.storeBaseInfoVo
        if (global.appInfo && parseInt(global.appInfo.version.replace(/\./g, '')) >= 231) {
          mapNavigation({
            location: {
              gpsLatitude,
              gpsLongitude,
              address,
              placeName: storeName
            },
            callback: (res) => {
              if (!res.isSuccess) {
                this.$toast(res.responesMsg)
              }
            }
          })
        } else {
          this.$router.push({
            path: '/store360/map',
            query: {
              gpsLongitude,
              gpsLatitude
            }
          })
        }
      }
    },
    mounted () {
      this.getStoreInfoByStoreId()
    }
  }
</script>

