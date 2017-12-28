<template>
  <bm-layout>
    <bm-header slot="header">详情</bm-header>
    <div class="container" v-if="isSuccess && !isError">
      <div class="item-box icon local-icon">{{detailData['storeName']}}</div>
      <div class="separate"></div>
      <div class="item-box icon time-icon">时间：{{Date.now() | datetime('YYYY-MM-DD')}} {{detailData['workTime'][0]['enterTime'] | datetime('HH:mm')}}-{{detailData['workTime'][0]['leaveTime'] | datetime('HH:mm')}}</div>
      <div class="separate"></div>
      <div class="item-box icon work-icon">工作任务：{{detailData['taskList'] | formatTask}}</div>
      <div class="gap"></div>
      <div class="item-box">
        <p class="header">工作总结</p>
        <p class="val">{{detailData['summary']}}</p>
      </div>
      <div class="gap"></div>      
      <div class="item-box img-wrapper" ref="imgGroup" v-if="detailData['fileList'].length > 0">
        <p>照片</p>
        <div class="flex flex-wrap img-group">
          <div v-for="item in detailData['fileList']">
            <img :src="item.filePath" @click="checkPic(item.filePath)">
          </div>
        </div>
      </div>
    </div>
    <bm-empty v-if="isError" :reload="getData"></bm-empty>
  </bm-layout>
</template>

<script>
  import BmCheckPhoto from '@/components/plugins/BmCheckPhoto'
  import { getCheckPhotoOptions } from '@/utils/dom'
  import api from '@/api'
  export default {
    data () {
      return {
        detailData: {},
        isSuccess: false,
        isError: false
      }
    },
    filters: {
      formatTask (value) {
        return value.map(e => {
          return e.taskDesc
        }).join(', ')
      }
    },
    methods: {
      getData () {
        api.todayWork.getPlanDetail({
          data: {
            planId: this.$route.query.planId,
            token: simpleLocalDb.getItem('token')
          },
          config: { '_INDICATOR': true }
        }).then(result => {
          this.isError = false
          if (result.responseCode === 0) {
            this.isSuccess = true
            this.detailData = result.actuVo
          } else {
            this.$toast(result.responseMsg)
          }
        }).catch(err => {
          this.isError = true
          console.log(err)
        })
      },
      checkPic (url) {
        BmCheckPhoto(getCheckPhotoOptions(url, this.$refs.imgGroup))
      }
    },
    created () {
      this.getData()
    }
  }
</script>

<style lang="less" scoped="">
  .container {
    font-size: .15rem;
    color: #333;
    .item-box {
      background-color: #fff;
      padding: .15rem .10rem;
      .val {
        margin-top: .08rem;
        font-size: .12rem;
        color: #999;
      }
    }
    .icon {
      padding-left: .34rem;
      position: relative;
      line-height: .15rem;
      &:before {
        content: '';
        display: block;
        position: absolute;
        top: .15rem;
        left: .10rem;
        width: .15rem;
        height: .15rem;
        background-repeat: no-repeat;
        background-size: contain;
      }
      &.local-icon:before {
        background-image: url('~@/assets/todayWork/address@2x.png')
      }
      &.time-icon:before {
        background-image: url('~@/assets/todayWork/time@2x.png')
      }
      &.work-icon:before {
        background-image: url('~@/assets/todayWork/job@2x.png')
      }
    }
    .separate {
      height: 1px;
      background-color: #fff;
      overflow: hidden;
      &:after {
        content: '';
        display: block;
        width: 100%;
        height: 100%;
        margin-left: .10rem;
        transform: scaleY(0.5);
        background-color: #d7d7d7;
      }
    }
    .gap { height: .10rem; }
    .img-wrapper {
      background-color: #fff;
      &>p {
        color: #3f3f3f;
        font-size: .13rem;
      }
      .img-group {
        margin-top: .15rem;
        &>div, img {
          width: .60rem;
          height: .60rem;
          margin-right: .20rem;
          position: relative;
        }
      }
    }
  }
</style>
