<template>
  <bm-layout>
    <bm-header slot="header">打卡信息</bm-header>
    <div class="container">
      <div>
        <div class="flex justify-between items-center title">
          <p>开始打卡</p>
          <div class="local" @click="getDistance">重新定位</div>
        </div>
        <div class="info-wrapper">
          <div class="icon-wrapper time-icon">{{workTime | datetime}}</div>
          <div class="icon-wrapper position-icon">{{locationInfo['gpsAddress']}}</div>
        </div>
      </div>
      <div class="item-wrapper work-wrapper">
        <p>工作任务</p>
        <div class="flex flex-auto flex-wrap">
          <div :class="['work-box', {'focus': chosenTask[item['fieldCode']] ? true : false}]" v-for="item in taskList" @click="toggleTask(item['fieldCode'])">{{item['fieldDesc']}}</div>
        </div>
      </div>
      <div class="planRemark">
        <p>计划输出成果</p>
        <p class="small-font" v-show="detailData.planResults">{{detailData.planResults}}</p>
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
    <div slot="bottom" class="flex-none">
      <div class="submit-btn" @click="submit">打卡</div>
    </div>
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
        workTime: Date.now(),
        detailData: {},
        taskList: [],
        chosenTask: {},               // 已选择的任务编号hash
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
          } else {
            this.$toast(result.responseMsg)
          }
        })
      },
      checkPic (url) {
        BmCheckPhoto(getCheckPhotoOptions(url, this.$refs.imgGroup))
      },
      toggleTask (task) {
        Vue.set(this.chosenTask, task, !this.chosenTask[task])
      },
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
        let result = await api.todayWork.savePunchInfo({
          data: {
            workTime: Date.now(),
            status: 'ENTER_STORE',
            planId: this.$route.query.planId,
            fileList: this.fileList,
            token: simpleLocalDb.getItem('token'),
            taskList,
            ...this.locationInfo
          },
          config: { '_INDICATOR': true }
        })
        if (result.responseCode === 0) {
          this.$toast('打卡成功')
          this.$router.back()
        } else {
          this.$toast(result.responseMsg)
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
    mounted () {
      this.getDistance()
    }
  }
</script>

<style lang="less" scoped>
  .container {
    font-size: .15rem;
    color: #333;
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
    .work-wrapper {
      padding: .10rem;
      padding-bottom: 0;
      background-color: #fff;
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
    .planRemark {
      padding: .15rem .10rem;
      margin: .10rem 0;
      background-color: #fff;
      p:nth-of-type(2) { margin-top: .15rem; }
      .small-font { font-size: .14rem; }
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
    margin: .10rem .10rem .15rem .10rem;
    height: .40rem;
    letter-spacing: .10rem;
    line-height: .40rem;
    background-color: #ff6c47;
    border-radius: 4px;
    text-align: center;
    font-size: .15rem;
    color: #fff;
  }
</style>
