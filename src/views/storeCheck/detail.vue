<style lang="less" scoped>
  .pk-detail {
    &__group {
      background: #fff;
      border-bottom: 1px solid #d7d7d7;
      padding: 0 .1rem;
      margin-bottom: .1rem;
    }
    &__info {
      padding: .12rem 0;
      border-bottom: 1px solid #d7d7d7;
    }
    &__info-top {
      display: flex;
      justify-content: space-between;
    }
    &__pk-no {
      color: #333;
      font-size: .15rem;
    }
    &__date {
      color: #999;
      font-size: .15rem;
    }
    &__store-name {
      margin-top: .1rem;
      color: #333;
      font-size: .15rem;
    }
    &__nums-wrapper {
      height: .4rem;
      display: flex;
      align-items: center;
      justify-content: space-between;
    }
    &__nums {
      font-size: .1rem;
      color: #666;
    }
    &__num {
      margin-right: .08rem;
    }
    &__prd {
      padding: .12rem 0;
      border-bottom: 1px solid #d7d7d7;
    }
    &__prd:last-of-type {
      border-bottom: none;
    }
    &__prd-name {
      color: #333;
      font-size: .15rem;
    }
    &__prd-num {
      padding-top: .1rem;
      color: #666;
      font-size: .14rem;
    }
    &__group-photo {
      padding: .1rem;
    }
    &__photo-top {
      display: flex;
      justify-content: space-between;
    }
    &__photo-name {
      color: #333;
      font-size: .15rem;
    }
    &__photo-none {
      color: #999;
      font-size: .15rem;
    }
    &__photo-wrapper {
      font-size: 0;
    }
    &__photo-item {
      display: inline-block;
      width: .8rem;
      height: .8rem;
      margin-top: .12rem;
      margin-right: .12rem;
    }
    &__group-remark {
      padding: .12rem .1rem;
    }
    &__remark-top {
      display: flex;
      justify-content: space-between;
    }
    &__remark-name {
      color: #333;
      font-size: .15rem;
    }
    &__remark-none {
      color: #999;
      font-size: .15rem;
    }
    &__remark-content {
      color: #666;
      font-size: .14rem;
      margin-top: .1rem;
    }
  }
</style>

<template>
  <bm-layout>
    <bm-header slot="header">盘库详情</bm-header>
    <div class="pk-detail" v-if="pkStore">
      <div class="pk-detail__group">
        <div class="pk-detail__info">
          <div class="pk-detail__info-top">
            <div class="pk-detail__pk-no">{{ pkStore.orderNo }}</div>
            <div class="pk-detail__date">{{ pkStore.planDate | datetime('date')}}</div>
          </div>
          <div class="pk-detail__store-name">{{ pkStore.storeName }}</div>
        </div>
        <div class="pk-detail__nums-wrapper">
          <div class="pk-detail__nums">
            <span>品种数：</span><span class="pk-detail__num">{{ pkStore.prdNum }}</span>
            <span>总支数：</span><span class="pk-detail__num">{{ pkStore.sumNum }}</span>
            <span>至尊：</span><span class="pk-detail__num">{{ pkStore.newNum }}</span>
          </div>
        </div>
      </div>
      <div class="pk-detail__group">
        <div class="pk-detail__prd" v-for="item in pkStore.prdList">
          <div class="pk-detail__prd-name">{{ item.prdName }}</div>
          <div class="pk-detail__prd-num">销售库存：{{ item.warehouseNum }}箱</div>
          <div class="pk-detail__prd-num">陈列库存：{{ item.surfaceNum }}支</div>
        </div>
      </div>
      <div class="pk-detail__group pk-detail__group-photo">
        <div class="pk-detail__photo-top">
          <div class="pk-detail__photo-name">照片</div>
          <div class="pk-detail__photo-none" v-if="pkStore.fileList.length === 0">无</div>
        </div>
        <div class="pk-detail__photo-wrapper" v-if="pkStore.fileList.length > 0" ref="picWrapper">
          <img
            v-for="pic in pkStore.fileList"
            class="pk-detail__photo-item"
            @click="checkPic(pic)"
            :src="pic.filePath" alt="">
        </div>
      </div>
      <div class="pk-detail__group pk-detail__group-remark">
        <div class="pk-detail__remark-top">
          <div class="pk-detail__remark-name">备注</div>
          <div class="pk-detail__remark-none" v-if="!pkStore.remark">无</div>
        </div>
        <div class="pk-detail__remark-content" v-if="pkStore.remark">{{pkStore.remark}}</div>
      </div>
    </div>
  </bm-layout>
</template>

<script>
  import api from '@/api'
  import BmCheckPhoto from '@/components/plugins/BmCheckPhoto'
  import { getCheckPhotoOptions } from '@/utils/dom'
  export default {
    data () {
      return {
        pkStore: null
      }
    },
    methods: {
      fetchData () {
        return api.storePk.getStorePkDetailsByParams({
          data: {
            orderNo: this.$route.query.orderNo,
            storeId: this.$route.query.storeId,
            token: simpleLocalDb.getItem('token')
          }
        }).then(result => {
          if (result.responseCode === 0) {
            this.pkStore = result.storePkVo
          }
        })
      },
      checkPic (pic) {
        BmCheckPhoto(getCheckPhotoOptions(pic.filePath, this.$refs.picWrapper))
      }
    },
    mounted () {
      this.fetchData()
    }
  }
</script>
