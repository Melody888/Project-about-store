<template>
  <bm-layout>
    <bm-header slot="header">发货信息</bm-header>
    <div>
      <div class="deliverDetail__column order flex">
        <p class="flex-auto">{{this.$route.query.fCode}}</p>
        <p class="color-999 f12">发货日期：{{deliveryDetail.fDate | datetime('YYYY/MM/DD')}}</p>
      </div>
      <div>
        <div class="deliverDetail__column title flex"><p class="flex-auto">至尊(盒)：{{deliveryDetail.fZzTotalNum}}</p><p class="ml5">总支数：{{deliveryDetail.fTotalNum}} ({{(Number(deliveryDetail.fTotalCase)).toFixed(1)}}箱)</p></div>
        <ul class="deliverDetail__prdList">
          <li class="prd" v-for="item in deliveryDetail.productListInfo">
            <p>{{item.prdName}}</p>
            <div class="num flex">
              <p class="flex-auto">箱规：{{item.pack}}</p>
              <p>支数：{{item.fNum}} ({{(Number(item.fCase)).toFixed(1)}}箱)</p>
            </div>
          </li>
        </ul>
      </div>
    </div>
  </bm-layout>
</template>
<style lang="less" scoped>
  .f12 { font-size: .12rem; }
  .deliverList__item {
    padding: .15rem .1rem;
    background: #fff;
    font-size: .12rem;
    color: #333;
    border-bottom: solid 1px #d7d7d7;
    .order {
      font-size: .14rem;
    }
    .time {
      margin: .09rem 0;
      background: url('../../assets/common/rightArrow.png') no-repeat center right / auto 100%;
    }
  }
  .deliverDetail__column {
    padding: .15rem .1rem;
    background: #fff;
    &.order {
      margin-bottom: .1rem;
      border-bottom: solid 1px #d7d7d7;
      color: #333;
      font-size: .15rem;
    }
    &.title {
      border-bottom: solid 1px #e5e5e5;
      color: #999;
      font-size: .12rem;
    }
  }
  .deliverDetail__prdList {
    padding-left: .1rem;
    background: #fff;
    border-bottom: solid 1px #d7d7d7;
    font-size: .14rem;
    color: #333;
    .prd {
      padding: .1rem .1rem .1rem 0;
      border-bottom: solid 1px #e5e5e5;
      &:last-child {
        border-bottom: none;
      }
    }
    .num {
      margin-top: .1rem;
    }
  }
</style>
<script>
  import api from '@/api'
  import { MessageBox } from 'mint-ui'
  export default {
    data () {
      return {
        deliveryDetail: {}
      }
    },
    methods: {
      getList (orderCode, fCode) {
        api.storeOrder.getDeliveryDetail({
          data: {
            orderCode: orderCode,
            fCode: fCode,
            token: simpleLocalDb.getItem('token')
          }
        }).then(res => {
          if (res.responseCode === 0) {
            this.deliveryDetail = res.deliveryDetail
          } else {
            MessageBox.alert(res.responseMsg)
          }
        })
      }
    },
    mounted () {
      this.getList(this.$route.query.orderCode, this.$route.query.fCode)
    }
  }
</script>

