<template>
  <bm-layout ref="layout" :isScrollTouch='false'>
    <bm-header slot="header" :backAction="goBack">销量提报</bm-header>
    <div slot="top" style="flex:none;">
      <div class="relative">
        <div class="flex justify-between items-center top-header">
          <span>{{today | datetime('YYYY-MM-DD 周dd')}}</span>
          <span class="color-999">{{todayVaildFlayStr}}</span>
        </div>
        <div class="bg-fff container top-container" v-show="isShowStick">
          <div class="flex justify-between small-line">
            <span>品种数：{{totalInfo['totalKind']}}</span>
            <div v-if="reportStatus" class="report-btn" @click="toggleReportStatus('finish')">提报团购</div>
            <div v-else class="report-btn finish" @click="toggleReportStatus('report')">完成</div>
          </div>
          <div class="separate"></div>
          <div class="flex justify-between line-box border-line">
            <span>总支数：{{totalInfo['totalNum']}}</span>
            <span>总金额：¥ {{totalInfo['totalPrice'] | formatPrice}}</span>
          </div>
        </div>
      </div>
    </div>
    <div class="container" v-show="itemList.planId">
      <div class="item-wrapper mt-10">
        <div class="line-box icon-before store-icon">{{itemList['storeId']}} {{itemList['storeName']}}</div>
        <div class="separate"></div>
        <div class="flex line-box icon-before time-icon">
          <div style="flex-shrink:0;">{{itemList['classDesc']}}：</div>
          <div>{{itemList['workTime'] | formatWorkTime}}</div>
        </div>
      </div>
      <div class="item-wrapper work-wrapper" ref="task">
        <p>工作任务</p>
        <div class="flex flex-auto flex-wrap">
          <div :class="['work-box', {'focus': chosenTask[item['fieldCode']] ? true : false}]" v-for="item in taskList" @click="toggleTask(item['fieldCode'])">{{item['fieldDesc']}}</div>
        </div>
      </div>
      <div class="item-wrapper">
        <div class="line-box color-1fb8ff border-line">
          <p class="quest-icon" @click="showRuleImgs">至尊提报规则</p>
          <div class="display-none" ref="ruleImgs">
            <img :src="item['filePath']" v-for="item in ruleFileImgs">
          </div>
        </div>
        <div class="flex justify-between small-line" ref="stick">
          <span>品种数：{{totalInfo['totalKind']}}</span>
          <div v-if="reportStatus" class="report-btn" @click="toggleReportStatus('finish')">提报团购</div>
          <div v-else class="report-btn finish" @click="toggleReportStatus('report')">完成</div>
        </div>
        <div class="separate"></div>
        <div class="flex justify-between line-box border-line">
          <span>总支数：{{totalInfo['totalNum']}}</span>
          <span>总金额：¥ {{totalInfo['totalPrice'] | formatPrice}}</span>
        </div>
        <template v-for="(item, index) in itemList['prdList']">
          <div :class="index === itemList['prdList'].length - 1 ? 'border-line' : ''" :key="index">
            <div class="line-box">{{item['prdName']}}</div>
            <div v-show="reportStatus" class="flex justify-between items-center price-wrapper">
              <div class="flex items-center">
                <span>零售</span>
                <div class="number-input-wrapper">
                  <bm-number-input
                    max="99999"
                    :hasChange="calculateTotal.bind(null)"
                    v-model="item['prdNum']"></bm-number-input>
                </div>
              </div>
              <span>¥ {{(item['price'] * item['prdNum']) | formatPrice}}</span>
            </div>
            <div class="flex justify-between items-center price-wrapper" v-show="!reportStatus || item.showGroupNum > 0">
              <div class="flex items-center">
                <span>团购</span>
                <div class="number-input-wrapper">
                  <bm-number-input
                    max="99999"
                    :hasChange="calculateTotal.bind(null)"
                    :minus="checkGroupNum.bind(null, index)"
                    :plus="checkGroupNum.bind(null, index)"
                    :blur="checkGroupNum.bind(null, index)"
                    v-model="item['groupBuyVo']['prdNum']"></bm-number-input>
                </div>
              </div>
              <span>¥ {{(item['price'] * item['groupBuyVo']['prdNum']) | formatPrice}}</span>
            </div>
          </div>
          <div v-if="index < itemList['prdList'].length - 1" class="separate"></div>
        </template>
        <div class="flex justify-center line-box border-line">
          <div class="add-product" @click="addProduct">添加产品</div>
        </div>
      </div>
      <div v-show="isShowGroupPhoto" class="img-wrapper line-box item-wrapper" ref="imgGroup">
        <p>团购凭证<span> 最多上传6张</span></p>
        <div class="flex flex-wrap img-group">
          <div v-for="(item, index) in uploadPhotoGroup">
            <img :src="item.filePath" @click="checkPic(item.filePath)">
            <div class="del-btn" @click="delImg(index)"></div>
          </div>
          <bm-img-picker v-show="uploadPhotoGroup.length < 6" sourceFlag="groupbuy" @pick="addImg"></bm-img-picker>
        </div>
      </div>
      <div class="item-wrapper">
        <div class="line-box slim-bottom">备注</div>
        <div class="textarea-box">
          <div>
            <textarea class="textarea" v-model="remark" maxlength="160" placeholder="请输入，最多160字。"></textarea>
          </div>
        </div>
      </div>
      <div :class="['submit-btn', reportStatus ? '' : 'disabled']" @click="submitReport">提 交</div>
    </div>
  </bm-layout>
</template>

<script>
  import BmCheckPhoto from '@/components/plugins/BmCheckPhoto'
  import { getCheckPhotoOptions } from '@/utils/dom'
  import BmSelectPage from '@/components/plugins/BmSelectPage'
  import selectProduct from '@/views/common/selectProduct'
  import moment from 'moment'
  import api from '@/api'
  import Vue from 'vue'

  export default {
    data () {
      return {
        today: Date.now(),
        todayVaildFlayStr: '上班',
        reportStatus: 1,
        remark: '',
        stickTop: 0,
        isShowStick: false,           // 是否显示顶部吸附块
        isShowGroupPhoto: false,      // 是否显示团购凭证模块
        ruleFileImgs: [],             // 至尊图片列表
        taskList: [],                 // 工作任务列表
        chosenTask: {},               // 已选择的任务编号hash
        totalInfo: {                  // 总数量、总种数、总金额
          totalPrice: 0,
          totalNum: 0,
          totalKind: 0
        },
        tmpData: {},                  // 临时存储初始化数据
        uploadPhotoGroup: [],         // 团购凭证图片
        itemList: {},                 // 列表主数据
        needSalesReason: false        // 销量为0时需要提交原因
      }
    },
    filters: {
      formatPrice (value) { return (Number(value) / 100).toFixed(2) },
      formatWorkTime (workTime = []) {
        let tmp = workTime && workTime.map(e => {
          let start = moment(e.enterTime).format('HH:mm') + '-'
          let end = e.leaveTime ? moment(e.leaveTime).format('HH:mm') + ', ' : ''
          return start + end
        })
        return tmp.join('')
      }
    },
    methods: {
      toggleReportStatus (status) {
        this.reportStatus = status === 'finish' ? 0 : 1
      },
      toggleTask (task) {
        Vue.set(this.chosenTask, task, !this.chosenTask[task])
      },
      checkPic (url) {
        BmCheckPhoto(getCheckPhotoOptions(url, this.$refs.imgGroup))
      },
      // 新增产品
      addProduct () {
        BmSelectPage({
          component: selectProduct,
          options: {
            disabledList: this.itemList.prdList.map(e => {
              return e.customerPrd
            })
          }
        }).then(data => {
          if (data && data.length > 0) {
            let newPrdList = []
            data.forEach(e => {
              newPrdList.push({
                customerPrd: e.customerPrd,
                groupBuyVo: { price: 0, prdNum: 0 },
                isNew: e.isNew,
                prdName: e.prdName,
                prdNum: 0,
                price: e.price
              })
            })
            Vue.set(this.itemList, 'prdList', this.itemList.prdList.concat(newPrdList))
            this.calculateTotal()
          }
        }, error => {
          console.log('is error', error)
        })
      },
      // 显示/隐藏顶部stick
      toggleStick (e) {
        if (e.target.scrollTop < this.stickTop && this.isShowStick) {
          this.isShowStick = false
        } else if (e.target.scrollTop >= this.stickTop && !this.isShowStick) {
          this.isShowStick = true
        }
      },
      // 显示至尊规则图片
      showRuleImgs () {
        BmCheckPhoto(getCheckPhotoOptions('', this.$refs.ruleImgs))
      },
      initPrice (prdList) {
        prdList.forEach(e => {
          e.price = Math.abs(e.price)
          e.prdNum = e.retailVo ? Math.abs(e.retailVo.prdNum) : Math.abs(e.prdNum)
          if (!e.groupBuyVo) {
            e.groupBuyVo = { prdNum: 0 }
          }
          e.groupBuyVo.prdNum = Math.abs(e.groupBuyVo.prdNum)
          e.showGroupNum = (e.groupBuyVo.prdNum > 0) ? 1 : 0
        })
      },
      checkGroupNum (index) {
        let item = Object.assign({}, this.itemList['prdList'][index])
        if (item['groupBuyVo']['prdNum'] <= 0) {
          item.showGroupNum = 0
        } else {
          item.showGroupNum = 1
        }
        let prdList = [].concat(this.itemList['prdList'])
        prdList.splice(index, 1, item)
        // 检测是否显示团购凭证模块
        this.isShowGroupPhoto = prdList.some(e => e.showGroupNum > 0)
        Vue.set(this.itemList['prdList'], index, item)
      },
      calculateTotal () {
        let prdList = this.itemList.prdList
        let totalPrice = 0
        let totalNum = 0
        let totalKind = 0
        prdList.forEach(e => {
          let number = e.prdNum + e.groupBuyVo.prdNum
          totalKind++
          totalNum += number
          totalPrice += number * e.price
        })
        this.totalInfo = { totalPrice, totalNum, totalKind }
      },
      addImg (file) {
        this.uploadPhotoGroup = this.uploadPhotoGroup.concat(file)
      },
      delImg (index) {
        this.uploadPhotoGroup.splice(index, 1)
      },
      // 请求前的检测数据正确性
      checkSubmitData () {
        // 检测是否选择了工作任务
        let taskList = []
        let choseSales = false
        this.taskList.forEach(e => {
          if (this.chosenTask[e.fieldCode]) {
            taskList.push({ taskId: e.fieldCode })
            if (e.fieldCode === 'T001') { choseSales = true }
          }
        })
        if (taskList.length <= 0) {
          this.$toast('请选择工作任务')
          return false
        }
        let remark = this.remark.toString().trim()
        if (choseSales && this.totalInfo.totalNum <= 0 && !remark) {
          this.needSalesReason = true
          this.$toast('请备注销量为0的原因')
          return false
        } else {
          this.needSalesReason = false
        }
        if (this.isShowGroupPhoto && this.uploadPhotoGroup.length <= 0) {
          this.$toast('请上传团购凭证')
          return false
        }
        return true
      },
      // 提报销量
      submitReport () {
        if (!this.reportStatus) { return }
        if (!this.checkSubmitData()) { return }
        let taskList = []
        let prdList = []
        this.taskList.forEach(e => {
          if (this.chosenTask[e.fieldCode]) {
            taskList.push({ taskId: e.fieldCode })
          }
        })
        this.itemList.prdList.forEach(e => {
          let tmp = {
            customerPrd: e.customerPrd,
            isGroupBuy: 0,
            isNew: e.isNew,
            prdNum: e.prdNum
          }
          prdList.push(tmp)
          if (e.groupBuyVo.prdNum > 0) {
            prdList.push(Object.assign({}, tmp, {
              isGroupBuy: 1,
              prdNum: e.groupBuyVo.prdNum
            }))
          }
        })
        this.$messagebox.confirm(' ', {
          title: '即将提交销量：',
          message: `${this.itemList.classDesc}，实际：${this.totalInfo.totalNum}支，¥${Number(this.totalInfo.totalPrice / 100).toFixed(2)}`,
          confirmButtonText: '确定',
          confirmButtonClass: 'color-2691ff',
          cancelButtonText: '我再想想',
          cancelButtonClass: 'color-2691ff'
        }).then(async () => {
          let result = await api.todayWork.saveActuInfo({
            data: {
              'actuDate': Date.now(),
              'classId': this.itemList.classId,
              'fileList': this.isShowGroupPhoto ? this.uploadPhotoGroup : [],
              'noSalesReason': this.needSalesReason ? this.remark : '',
              'planId': this.itemList.planId,
              'remark': this.needSalesReason ? '' : this.remark,
              'storeId': this.itemList.storeId,
              taskList,
              prdList,
              token: simpleLocalDb.getItem('token')
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
      // 点击后退的时候，提示是否需要提报销量
      goBack () {
        if (this.isDiff()) {
          this.$messagebox.confirm(' ', {
            title: '温馨提示',
            message: '您尚未提报销量，确定离开吗？',
            confirmButtonText: '确定',
            confirmButtonClass: 'color-2691ff',
            cancelButtonText: '我再想想',
            cancelButtonClass: 'color-2691ff'
          }).then(() => {
            this.$router.back()
          })
        } else { this.$router.back() }
      },
      // 是否修改了数据
      isDiff () {
        let { remark, fileList, taskList, prdList } = this.tmpData
        if (remark !== this.remark) { return true }
        if (fileList.length !== this.uploadPhotoGroup.length || prdList.length !== this.itemList.prdList.length) { return true }
        let isDiff = Object.keys(this.chosenTask).some(e => {
          return this.chosenTask[e] && !taskList[e]
        })
        if (isDiff) { return true }
        let prdList2 = this.itemList.prdList
        isDiff = prdList.some((e, i) => {
          return e.prdNum !== prdList2[i].prdNum || e.groupBuyVo.prdNum !== prdList2[i].groupBuyVo.prdNum
        })
        if (isDiff) { return true }
        isDiff = fileList.some((e, i) => {
          return e.guid !== this.uploadPhotoGroup[i].guid
        })
        if (isDiff) { return true }
        return false
      }
    },
    watch: {
      remark (val, oldVal) {
        if (val.toString().length > 160) {
          this.remark = oldVal
        }
      }
    },
    created () {
      // 请求提报销量信息
      api.todayWork.getActuInfo({
        data: {
          date: Date.now(),
          pageFlag: 'todaywork',
          planId: this.$route.query.planId || '',
          token: simpleLocalDb.getItem('token')
        },
        config: {
          '_INDICATOR': true
        }
      }).then(result => {
        if (result.responseCode === 0) {
          this.todayVaildFlayStr = result.validFlag === 'VALID_PLAN' ? '上班' : '休息'
          this.itemList = result.itemList[0]
          this.remark = result.itemList[0].remark || ''
          let taskList = result.itemList[0].taskList
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
          this.uploadPhotoGroup = this.itemList.fileList
          this.initPrice(this.itemList.prdList)
          this.isShowGroupPhoto = result.itemList[0].prdList.some(e => e.showGroupNum > 0)
          this.calculateTotal()
          // 存储副本，用于修改后比对
          this.tmpData.remark = result.itemList[0].remark || ''
          this.tmpData.fileList = this.itemList.fileList.map(e => {
            return Object.assign({}, e)
          })
          this.tmpData.taskList = Object.assign({}, this.chosenTask)
          this.tmpData.prdList = this.itemList.prdList.map(e => {
            let obj = Object.assign({}, e)
            obj.groupBuyVo = Object.assign({}, e.groupBuyVo)
            return obj
          })
          // dom更新之后设置stick的边界
          Vue.nextTick(() => {
            let stick = this.$refs.stick
            this.stickTop = stick.offsetTop
          })
        } else {
          this.$toast(result.responseMsg)
        }
      })
      // 请求至尊规则图片
      api.base.getSpecialAttach({
        data: {
          fileType: 'SALE',
          token: simpleLocalDb.getItem('token')
        }
      }).then(result => {
        if (result.responseCode === 0) {
          this.ruleFileImgs = result.fileList
        } else {
          this.$toast(result.responseMsg)
        }
      })
      // 请求总的任务列表
      api.plan.getFieldConfByFieldType({
        data: {
          fieldType: 'task',
          token: simpleLocalDb.getItem('token')
        }
      }).then(result => {
        if (result.responseCode === 0) {
          this.taskList = result.itemList
        } else {
          this.$toast(result.responseMsg)
        }
        // dom更新之后设置stick的边界
        Vue.nextTick(() => {
          let stick = this.$refs.stick
          this.stickTop = stick.offsetTop
        })
      })
    },
    mounted () {
      // 监听滚动条，触发顶部块的显示/隐藏
      let main = this.$refs.layout.$refs.main
      main.addEventListener('scroll', this.toggleStick)
    },
    beforeDestroyed () {
      // 移除监听
      let main = this.$refs.layout.$refs.main
      main.removeEventListener('scroll', this.toggleStick)
    }
  }
</script>

<style lang="less" scoped>
  .border-line {
    border-bottom: 1px solid #d7d7d7;
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
  .top-header {
    padding: .15rem .10rem;
    background-color: #fff;
    border-bottom: 1px solid #d7d7d7;
    font-size: .15rem;
    color: #333;
    height: .45rem;
    position: relative;
    z-index: 1
  }
  .container {
    font-size: .15rem;
    color: #333;
    padding-top: .10rem;
    &.top-container {
      padding-top: 0;
      position: absolute;
      border-top: 1px solid #d7d7d7;
      top: .44rem;
      left: 0;
      right: 0;
      z-index: 1;
    }
    .item-wrapper {
      margin-bottom: .10rem;
      background-color: #fff;
    }
    .line-box {
      padding: .15rem .10rem;
      &.slim-bottom { padding-bottom: .10rem; }
    }
    .small-line {
      padding: .08rem .10rem;
      &>span { line-height: .30rem; }
    }
    .icon-before {
      position: relative;
      padding-left: .34rem;
      line-height: .15rem;
      &:before {
        content: '';
        display: block;
        width: .15rem;
        height: .15rem;
        position: absolute;
        top: .15rem;
        left: .10rem;
        background-repeat: no-repeat;
        background-size: contain;
        background-position: center center;
      }
      &.store-icon:before {
        background-image: url('~@/assets/todayWork/store-gray@2x@2x.png')
      }
      &.time-icon:before {
        background-image: url('~@/assets/todayWork/time@2x.png')
      }
    }
    .work-wrapper {
      padding: .10rem;
      padding-bottom: 0;
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
    .quest-icon {
      position: relative;
      display: inline-block;
      line-height: 1em;
      &:after {
        content: '?';
        display: block;
        position: absolute;
        top: 0;
        right: -0.16rem;
        width: .15rem;
        height: .15rem;
        border: 1px solid #1fb8ff;
        border-radius: .14rem;
        font-size: .10rem;
        text-align: center;
      }
    }
    .report-btn {
      height: .30rem;
      width: .76rem;
      text-align: center;
      border: 1px solid #666;
      border-radius: 4px;
      line-height: .30rem;
      color: #666;
      &.finish {
        border-color: #ff6c47;
        color: #ff6c47;
      }
    }
    .number-input-wrapper {
      height: .24rem;
      width: 1rem;
      margin-left: .06rem;
    }
    .price-wrapper {
      margin-bottom: .15rem;
      padding: 0 .10rem;
      span {
        height: .24rem;
        line-height: .24rem;
      }
    }
    .add-product {
      color: #1fb8ff;
      border-bottom: 1px solid #1fb8ff;
    }
    .img-wrapper {
      background-color: #fff;
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
          margin-bottom: .15rem;
          position: relative;
        }
        &>div:nth-of-type(4n+0) { margin-right: 0; }
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
      .add-btn {
        border-radius: 3px;
        border: 2px dotted #ffe3dc;
        background: url('~@/assets/common/addToUpload@2x.png') no-repeat center center;
        background-size: .27rem .27rem;
      }
    }
    .textarea-box {
      margin: 0 .10rem;
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
    height: .40rem;
    line-height: .40rem;
    background-color: #ff6c47;
    text-align: center;
    font-size: .15rem;
    color: #fff;
    border-radius: 4px;
    margin: .10rem .25rem;
    margin-bottom: .15rem;
    &.disabled { background-color: #d7d7d7; }
  }
</style>
