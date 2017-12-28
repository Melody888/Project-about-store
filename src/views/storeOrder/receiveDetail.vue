<template>
  <bm-layout>
    <bm-header slot="header">收货信息</bm-header>
    <div>
      <div class="receiveDetail__column order flex">
        <p class="flex-auto">{{rCode}}</p>
        <p class="color-999 f12">收货日期：{{receiveDetail.rDate | datetime('YYYY/MM/DD')}}</p>
      </div>
      <div class="mb10">
        <div class="receiveDetail__column title flex"><p class="flex-auto">至尊(盒)：{{receiveDetail.rZzTotalNum}}</p><p class="ml5">总支数：{{receiveDetail.rTotalNum}} ({{Number(receiveDetail.rTotalCase).toFixed(1)}}箱)</p></div>
        <ul class="receiveDetail__prdList">
          <li class="prd" v-for="item in receiveDetail.productListInfo">
            <p>{{item.prdName}}</p>
            <div class="num flex">
              <p class="flex-auto">箱规：{{item.pack}}</p>
              <p>支数：{{item.rNum}} ({{Number(item.rCase).toFixed(1)}}箱)</p>
            </div>
          </li>
        </ul>
      </div>
      <div class="mb10 border-solid-d7d7d7">
        <div class="receiveDetail__column f15">收货凭证</div>
        <div class="pl10 bg-fff">
          <ul class="receiveDetail__pic">
            <li class="item" v-for="item in receiveDetail.receiveEvidence" @click="grass(item)" :style="{'backgroundImage':'url('+item+')'}"></li>
          </ul>
        </div>
      </div>
      <div class="mb10 border-solid-d7d7d7" v-if="receiveDetail.remark">
        <div class="receiveDetail__column f15">备注</div>
        <p class="receiveDetail__remark">{{receiveDetail.remark}}</p>
      </div>
    </div>
    <section class="m_imgage_cover" slot="left" v-if="isShowGrass" @click="grass">
      <img class="m_pic" :src="grassImg" />
    </section>
  </bm-layout>
</template>
<style lang="less" scoped>
  .f12 { font-size: .12rem; }
  .f15 { font-size: .15rem; }
  .mb10 { margin-bottom: .1rem; }
  .pl10 { padding-left: .1rem; }
  .bg-fff { background: #fff; }
  .border-solid-d7d7d7 { border-bottom: solid 1px #d7d7d7; }
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
  .receiveDetail__column {
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
  .receiveDetail__prdList {
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
  .receiveDetail__pic {
    padding: .05rem .1rem .05rem 0;
    overflow: hidden;
    background: #fff;
    border-top: solid 1px #e5e5e5;
    .item {
      float: left;
      width: .6rem;
      height: .6rem;
      margin: .1rem;
      background: no-repeat center / cover;
    }
  }
  .receiveDetail__remark {
    padding: 0 .1rem .15rem;
    background: #fff;
    font-size: .13rem;
    color: #666;
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
<script>
  import api from '@/api'
  import { MessageBox } from 'mint-ui'
  export default {
    data () {
      return {
        receiveDetail: {},
        rCode: '',
        isShowGrass: false, // 是否显示图片放大
        grassImg: '' // 需要放大的图片
      }
    },
    methods: {
      getList (orderCode, rCode) {
        api.storeOrder.getReceiveDetail({
          data: {
            orderCode: orderCode,
            rCode: rCode,
            token: simpleLocalDb.getItem('token')
          }
        }).then(res => {
          if (res.responseCode === 0) {
            this.receiveDetail = res.receiveDetail
          } else {
            MessageBox.alert(res.responseMsg)
          }
        })
      },
      grass (imgSrc) {
        this.isShowGrass = !this.isShowGrass
        if (this.isShowGrass && imgSrc) {
          this.grassImg = imgSrc
        }
      }
    },
    mounted () {
      this.rCode = this.$route.query.rCode
      this.getList(this.$route.query.orderCode, this.$route.query.rCode)
    }
  }
</script>

