<template>
  <bm-layout>
    <bm-header slot="header" :backAction="goBack">工作总结</bm-header>
    <div class="container">
      <div>
        <div class="flex justify-between title">
          <p>开始打卡</p>
        </div>
        <div class="info-wrapper" v-show="detailData['inAddress']">
          <div class="icon-wrapper time-icon-gray">{{detailData['inTime'] | datetime}}</div>
          <div class="icon-wrapper position-icon-gray">{{detailData['inAddress']}}</div>
        </div>
      </div>
      <div>
        <div class="flex justify-between items-center title">
          <p>结束打卡</p>
          <div class="local" @click="getDistance">重新定位</div>
        </div>
        <div class="info-wrapper">
          <div class="icon-wrapper time-icon">{{leaveTime | datetime}}</div>
          <div class="icon-wrapper position-icon">{{locationInfo['gpsAddress']}}</div>
        </div>
      </div>
      <div class="flex justify-between items-center bg-fff" @click="showPopup">
        <p>查看计划输出成果</p>
        <img src="~@/assets/common/rightArrow.png" style="width:.075rem;height:.12rem">
      </div>
      <div class="work-wrapper">
        <p>工作任务</p>
        <div class="flex flex-auto flex-wrap">
          <div :class="['work-box', {'focus': chosenTask[item['fieldCode']] ? true : false}]" v-for="item in taskList" @click="toggleTask(item['fieldCode'])">{{item['fieldDesc']}}</div>
        </div>
      </div>
      <div class="summary-wrapper">
        <div class="header">工作总结</div>
        <div class="textarea-box">
          <div>
            <textarea class="textarea" v-model="remark" maxlength="500" placeholder="请输入，最多500字。"></textarea>
          </div>
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
      <div class="submit-btn" @click="submit">提 交</div>
    </div>
    <mt-popup
      class="popup-wrapper"
      v-model="isShowPopup"
      popup-transition="popup-fade">
      <div>
        <p class="header">计划输出成果</p>
        <p class="plan-detail-wrapper">{{detailData['planResults']}}</p>
      </div>
    </mt-popup>
  </bm-layout>
</template>

<script>
  import BmCheckPhoto from '@/components/plugins/BmCheckPhoto'
  import { getCheckPhotoOptions } from '@/utils/dom'
  import { getLocation } from '@/utils/native'
  import api from '@/api'
  import Vue from 'vue'
  export default {
    data () {
      return {
        leaveTime: Date.now(),
        isShowPopup: false,           // 显示输出计划弹层的控制
        detailData: {},               // 工作计划数据
        remark: '',
        tmpData: {},                  // 存储临时数据，用于对比
        fileList: [],                 // 图片列表
        taskList: [],                 // 任务列表
        chosenTask: {},               // 已选择的任务编号hash
        locationInfo: {
          gpsAddress: '定位中...',
          gpsHeight: 0,
          gpsLatitude: '',
          gpsLongitude: '',
          gpsType: '',
          isSuccess: true
        }
      }
    },
    methods: {
      // 获取工作数据
      getPlanDetail () {
        return api.todayWork.getPlanDetail({
          data: {
            'planId': this.$route.query.planId,
            'token': simpleLocalDb.getItem('token')
          },
          config: { '_INDICATOR': true }
        }).then(result => {
          if (result.responseCode === 0) {
            this.detailData = result.actuVo
            let taskList = result.actuVo.taskList || []
            taskList.forEach(e => {
              // 将已勾选的状态保持起来
              this.toggleTask(e.taskId)
            })
            // 如果该请求先于总任务列表的请求，则先用该任务列表的数据填充
            if (this.taskList.length <= 0) {
              taskList.forEach(e => {
                this.taskList.push({
                  fieldDesc: e.taskDesc,
                  fieldCode: e.taskId
                })
              })
            }
            this.tmpData.taskList = Object.assign({}, this.chosenTask)
          } else {
            this.$toast(result.responseMsg)
          }
        })
      },
      // 勾选／取消任务
      toggleTask (task) {
        Vue.set(this.chosenTask, task, !this.chosenTask[task])
      },
      showPopup () { this.isShowPopup = true },
      checkPic (url) {
        // console.log('refs', this.$refs.imgGroup)
        BmCheckPhoto(getCheckPhotoOptions(url, this.$refs.imgGroup))
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
      getDistance () {
        this.locationInfo = {
          gpsAddress: '定位中...',
          gpsHeight: 0,
          gpsLatitude: '',
          gpsLongitude: '',
          gpsType: '',
          isSuccess: true
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
      submit () {
        if (!this.locationInfo.isSuccess || this.locationInfo.gpsLatitude === '') {
          return this.$toast('定位失败，请重新定位')
        }
        let taskList = []
        this.taskList.forEach(e => {
          if (this.chosenTask[e.fieldCode]) {
            taskList.push({ taskId: e.fieldCode })
          }
        })
        if (taskList.length <= 0) { return this.$toast('请选择工作任务') }
        if (this.remark.toString().trim() === '') {
          return this.$toast('请填写工作总结')
        }
        this.$messagebox.confirm(' ', {
          title: '温馨提示',
          message: '您确定提交工作总结吗？',
          confirmButtonText: '确定',
          confirmButtonClass: 'color-2691ff',
          cancelButtonText: '我再想想',
          cancelButtonClass: 'color-2691ff'
        }).then(async () => {
          let result = await api.todayWork.saveWorkSummary({
            data: {
              workTime: Date.now(),
              planId: this.$route.query.planId,
              fileList: this.fileList,
              token: simpleLocalDb.getItem('token'),
              summary: this.remark,
              taskList,
              ...this.locationInfo
            },
            config: { '_INDICATOR': true, '_NO_EMOJI': true }
          })
          if (result.responseCode === 0) {
            this.$toast('提交成功')
            this.$router.back()
          } else {
            this.$toast(result.responseMsg)
          }
        })
      },
      // 点击后退按钮的时候，检测是否需要保存数据
      goBack () {
        if (this.isDiff()) {
          this.$messagebox.confirm(' ', {
            title: '温馨提示',
            message: '您尚未提交工作总结，确定离开吗？',
            confirmButtonText: '确定',
            confirmButtonClass: 'color-2691ff',
            cancelButtonText: '我再想想',
            cancelButtonClass: 'color-2691ff'
          }).then(() => {
            this.$router.back()
          })
        } else { this.$router.back() }
      },
      // 是否改变了数据
      isDiff () {
        let taskList = this.tmpData.taskList
        let isDiff = Object.keys(this.chosenTask).some(e => {
          return this.chosenTask[e] && !taskList[e]
        })
        if (isDiff || this.remark || this.fileList.length > 0) { return true }
        return false
      }
    },
    watch: {
      remark (val, oldVal) {
        if (val.toString().length > 500) {
          this.remark = oldVal
        }
      }
    },
    created () {
      this.getPlanDetail()
      // 请求总的任务列表
      api.plan.getFieldConfByFieldType({
        data: {
          fieldType: this.$route.query.type,
          token: simpleLocalDb.getItem('token')
        }
      }).then(result => {
        if (result.responseCode === 0) {
          this.taskList = result.itemList
        } else {
          this.$toast(result.responseMsg)
        }
      })
    },
    mounted () { this.getDistance() }
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
        &.time-icon-gray:before {
          background-image: url('~@/assets/todayWork/time@2x@2x.png')
        }
        &.position-icon:before {
          top: .04rem;
          background-image: url('~@/assets/todayWork/address@2x.png')
        }
        &.position-icon-gray:before {
          top: .04rem;
          background-image: url('~@/assets/todayWork/address@2x@2x.png')
        }
      }
    }
    .work-wrapper {
      padding: .10rem;
      padding-bottom: 0;
      background-color: #fff;
      border-top: 1px solid #d7d7d7;
      border-bottom: 1px solid #d7d7d7;
      &>p { line-height: .30rem; }
    }
    .work-box {
      flex-shrink: 0;
      padding: 0 .13rem;
      margin-right: .10rem;
      margin-bottom: .10rem;
      border: 1px solid #d7d7d7;
      border-radius: 4px;
      height: .30rem;
      line-height: .30rem;
      text-align: center;
      font-size: .14rem;
      color: #666;
      &.focus {
        border-color: #ff6c47;
        color: #ff6c47;
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
    .summary-wrapper {
      background-color: #fff;
      margin-top: .10rem;
      .header { margin-bottom: .10rem; }
      .textarea-box {
        padding-bottom: .15rem;
        &>div {
          border: 1px solid  #d7d7d7;
          border-radius: 4px;
          overflow: hidden;
        }
        .textarea {
          border: none;
          font-size: .14rem;
          border-radius: 4px;
          background-color: #fbfbfb;
          height: .60rem;
          display: block;
          width: 100%;
          padding: .05rem;
        }
      }
    }
    .submit-btn {
      margin: .10rem .10rem .15rem .10rem;
      padding: 0;
      height: .40rem;
      line-height: .40rem;
      background-color: #ff6c47;
      border-radius: 4px;
      text-align: center;
      font-size: .15rem;
      color: #fff;
    }
  }
  .popup-wrapper {
    width: 80%;
    padding: .10rem;
    border-radius: 4px;
    font-size: .14rem;
    color: #666;
    .header {
      margin-bottom: .10rem;
      font-size: .15rem; 
      color: #333;
    }
    .plan-detail-wrapper {
      max-height: 3rem;
      overflow-y: scroll;
    }
  }
</style>
