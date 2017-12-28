<template>
  <bm-layout>
    <bm-header slot="header">进店打卡</bm-header>
    <div class="container">
      <div>
        <div class="flex justify-between items-center title">
          <p>进店信息</p>
          <div class="local" @click="getDistance">重新定位</div>
        </div>
        <div class="info-wrapper">
          <div class="icon-wrapper time-icon">{{workTime | datetime}}</div>
          <div class="icon-wrapper position-icon">{{locationInfo['gpsAddress']}}</div>
        </div>
      </div>
      <div>
        <p class="title">班次选择</p>
        <div class="flex flex-wrap group-wrapper">
          <div :class="['item', {'focus': item['fieldCode'] === classId ? true : false}]" v-for="item in itemList" @click="selectClass(item['fieldCode'])">{{item['fieldDesc']}}</div>
        </div>
      </div>
      <div class="img-wrapper" ref="imgGroup">
        <p>照片<span> 最多上传3张</span></p>
        <div class="flex flex-wrap img-group">
          <div v-for="(item, index) in fileList">
            <img :src="item.filePath" @click="checkPic(item.filePath)">
            <div class="del-btn" @click="delImg(index)"></div>
          </div>
          <bm-img-picker v-show="fileList.length < 3" sourceFlag="groupbuy" @pick="addImg"></bm-img-picker>
        </div>
      </div>
    </div>
    <div slot="bottom">
      <div class="submit-btn" @click="submit">进 店</div>
    </div>
  </bm-layout>
</template>

<script>
  import BmCheckPhoto from '@/components/plugins/BmCheckPhoto'
  import { getCheckPhotoOptions } from '@/utils/dom'
  import { getLocation } from '@/utils/native'
  import { Indicator } from 'mint-ui'
  import api from '@/api'
  export default {
    data () {
      return {
        classId: '',
        workTime: Date.now(),
        itemList: [],
        fileList: [],
        locationInfo: {
          gpsAddress: '定位中...',
          gpsHeight: 0,
          gpsLatitude: '',
          gpsLongitude: '',
          gpsType: '',
          isSuccess: false
        }
      }
    },
    methods: {
      checkPic (url) {
        // console.log('refs', this.$refs.imgGroup)
        BmCheckPhoto(getCheckPhotoOptions(url, this.$refs.imgGroup))
      },
      selectClass (id) { this.classId = id },
      getDistance () {
        this.locationInfo = {
          gpsAddress: '定位中...',
          gpsHeight: 0,
          gpsLatitude: '',
          gpsLongitude: '',
          gpsType: '',
          isSuccess: false
        }
        getLocation((res) => {
          let data = JSON.parse(res)
          if (data.isSuccess) {
            this.locationInfo = data
          } else {
            this.locationInfo.isSuccess = false
            this.locationInfo.gpsAddress = '定位失败'
            this.$toast('无法获取当前位置。')
          }
        })
      },
      getClassGroup () {
        Indicator.open()
        api.plan.getFieldConfByFieldType({
          data: {
            'fieldType': 'class',
            'token': simpleLocalDb.getItem('token')
          }
        }).then(result => {
          Indicator.close()
          if (result.responseCode === 0) {
            this.itemList = result.itemList
          } else {
            this.$toast(result.responseMsg)
          }
        })
      },
      addImg (file) {
        this.fileList = this.fileList.concat(file)
      },
      delImg (index) {
        this.$messagebox.confirm(' ', {
          title: '温馨提示',
          message: `您确定要删除第 ${index + 1} 张照片吗？`,
          confirmButtonText: '删除',
          confirmButtonClass: 'color-2691ff',
          cancelButtonText: '我再想想',
          cancelButtonClass: 'color-2691ff'
        }).then(() => {
          this.fileList.splice(index, 1)
        })
      },
      async submit () {
        if (this.classId === '') {
          return this.$toast('请选择班次')
        }
        let locationInfo = this.locationInfo.isSuccess ? this.locationInfo : {}
        let result = await api.todayWork.savePunchInfo({
          data: {
            classId: this.classId,
            workTime: Date.now(),
            status: 'ENTER_STORE',
            planId: this.$route.query.planId,
            fileList: this.fileList,
            token: simpleLocalDb.getItem('token'),
            ...locationInfo
          },
          config: { '_INDICATOR': true }
        })
        if (result.responseCode === 0) {
          this.$toast('进店成功')
          this.$router.back()
        } else {
          this.$toast(result.responseMsg)
        }
      }
    },
    mounted () {
      // 原生获取定位信息
      this.getDistance()
      this.getClassGroup()
    }
  }
</script>

<style lang="less" scoped>
  .container {
    font-size: .15rem;
    &>div { padding: .10rem; }
    .title {
      font-size: .12rem;
      color: #999;
      margin-bottom: .06rem;
      .local {
        color: #4ab6eb;
        padding-left: .18rem;
        padding-top: .01rem;
        line-height: .15rem;
        position: relative;
        &:before {
          content: '';
          display: block;
          position: absolute;
          top: 0;
          left: 0;
          width: .15rem;
          height: .15rem;
          background: url('~@/assets/todayWork/refresh@2x.png') no-repeat center center;
          background-size: contain;
        }
      }
    }
    .info-wrapper {
      border: 1px solid #1fb8ff;
      border-radius: 4px;
      padding: .15rem .09rem 0 .09rem;
      color: #333;
      background-color: #fff;
      .icon-wrapper {
        margin-bottom: .15rem;
        padding-left: .23rem;
        position: relative;
        &:before {
          content: '';
          display: block;
          position: absolute;
          top: .01rem;
          left: 0;
          width: .14rem;
          height: .14rem;
          background-repeat: no-repeat;
          background-size: contain;
        }
        &.time-icon:before {
          background-image: url('~@/assets/todayWork/time@2x.png')
        }
        &.position-icon:before {
          top: .04rem;
          background-image: url('~@/assets/todayWork/address@2x.png')
        }
      }
    }
    .group-wrapper {
      .item {
        width: 31.60% - .07rem;
        height: .45rem;
        background-color: #fff;
        border-radius: 2px;
        line-height: .45rem;
        text-align: center;
        margin-right: .07rem;
        margin-bottom: .07rem;
        color: #1fb8ff;
        &:nth-of-type(3n+0) { margin-right: 0; }
        &.focus {
          background-color: #1fb8ff;
          color: #fff;
        }
      }
    }
    .img-wrapper {
      background-color: #fff;
      margin-top: .10rem;
      &>p {
        color: #3f3f3f;
        font-size: .13rem;
        span {
          font-size: .12rem;
          color: #666;
        }
      }
      .img-group {
        margin-top: .15rem;
        &>div, img {
          width: .60rem;
          height: .60rem;
          margin-right: .20rem;
          position: relative;
        }
        .del-btn {
          width: .15rem;
          height: .15rem;
          background: url('~@/assets/common/close.png') no-repeat center center;
          background-size: contain;
          position: absolute;
          top: -.075rem;
          right: -.075rem;
        }
      }
    }
  }
  .submit-btn {
    margin: 0 .10rem .15rem .10rem;
    height: .40rem;
    line-height: .40rem;
    background-color: #ff6c47;
    border-radius: 4px;
    text-align: center;
    font-size: .15rem;
    color: #fff;
  }
</style>
