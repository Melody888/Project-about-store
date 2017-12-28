<template>
  <bm-layout>
    <bm-header slot="header">收货</bm-header>

    <!-- 门店信息 -->
    <div class="receive__store" slot="header">
      <p class="mb10">{{store.storeId}} {{store.storeName}}</p>
      <div class="flex f12">
        <p class="flex-auto mr15" v-if="createTimestamp">订单创建时间：{{ createTimestamp | datetime('YYYY/MM/DD hh:mm') }}</p>
        <p class="color-1fb8ff">{{orderStatusDesc}}</p>
      </div>
    </div>

    <!-- 收货日期 -->
    <div class="receive__info">
      <div class="receive__column select">
        <p class="mr15">收货日期</p>
        <p class="flex-auto right-align" v-if="isSelectDate" :class="{'color-999':!isSelectDate}" @click="selectDate">{{ datePicker | datetime('YYYY/MM/DD') }}</p>
        <p class="flex-auto right-align" v-if="!isSelectDate" :class="{'color-999':!isSelectDate}" @click="selectDate">请选择</p>
      </div>
    </div>

    <!-- 产品列表 -->
    <div class="bg-fff mb10 border-bottom-d7d7d7" v-if="prdList.length > 0">
      <p class="receive__column pl10">产品明细</p>
      <ul class="pl10 border-bottom-d7d7d7">
        <li class="receive__pro" v-for="(item, index) in prdList">
          <p class="name">{{item.customerPrd}} {{item.prdName}}</p>
          <div class="flex items-center justify-between">
            <div class="amount">
              <p>订单：{{item.orderNum}} ({{(Number(item.orderCase)).toFixed(1)}}箱)</p>
              <p>已收：{{item.rTotalNum}} ({{(Number(item.rTotalCase)).toFixed(1)}}箱)</p>
            </div>
            <div>
              <span>支数</span>
              <div class="compute">
                <p class="plus" @click="plus(index)"></p>
                <input type="num" class="input" :value="item.reciveNum" @input="inputInt(item, 'reciveNum', $event)"/>
                <p class="reduce" @click="reduce(index)"></p>
              </div>
            </div>
          </div>
          <div class="num flex justify-between">
            <p>箱规：{{item.pack}}</p>
            <p>换算：{{(Number(item.recivePackChange)).toFixed(1)}}箱</p>
          </div>
        </li>
      </ul>
    </div>

    <!-- 收货凭证 -->
    <div class="receive__file ml10">
      <p class="receive__column"><span>收货凭证</span> <span class="tip">必填，最多5张</span></p>
      <ul class="list">
        <li class="file" v-for="(item, index) in fileList">
          <p class="pic" :style="{backgroundImage: 'url(' + item.filePath + ')'}" @click="grass(item.filePath)"></p>
          <i class="del" @click="delPic(index)"></i>
        </li>
        <li class="file">
          <bm-img-picker v-if="fileList.length < 5" class="col-block" sourceFlag="store_order" @pick="imgDeal"></bm-img-picker>
        </li>
      </ul>
    </div>

    <!-- 备注 -->
    <div class="receive__remark">
      <p>备注</p>
      <textarea class="textarea" rows="3" placeholder="请填写补充说明，最多200字。" v-model="remark" maxlength="200"></textarea>
    </div>
    <!-- 底部bar -->
    <div class="receive__bar" slot="footer">
      <div class="info">
        <div class="flex">
          <p>订单总数</p>
          <p class="flex-auto right-align">{{orderTotalNum}} ({{(Number(orderTotalCase)).toFixed(1)}}箱)</p>
        </div>
        <div class="flex">
          <p>本次收货</p>
          <p class="flex-auto right-align color-ff6c47">{{total}} ({{(Number(totalPack)).toFixed(1)}}箱)</p>
        </div>
        <div class="flex f12 color-999">
          <p>已收：{{rTotalNum}} ({{(Number(rTotalCase)).toFixed(1)}}箱)</p>
          <p class="flex-auto right-align">差：{{orderTotalNum - rTotalNum - total}} ({{(((Number(orderTotalCase)).toFixed(1) * 100 - (Number(rTotalCase)).toFixed(1)*100 - (Number(totalPack)).toFixed(1)*100)/100).toFixed(1)}}箱)</p>
        </div>
      </div>
      <p class="submit" @click="save">确认提交</p>
    </div>
    <section class="receive_imgage_cover" slot="left" v-if="isShowGrass" @click="grass">
      <img class="receive_pic" :src="grassImg" />
    </section>
    <div slot="bottom">
      <mt-datetime-picker
        v-model="datePicker"
        ref="pickerDate"
        type="date"
        year-format="{value} 年"
        month-format="{value} 月"
        date-format="{value} 日">
      </mt-datetime-picker>
    </div>
  </bm-layout>
</template>
<style lang="less" scoped>
  .mr15 { margin-right: .15rem; }
  .mb10 { margin-bottom: .1rem; }
  .mb6 { margin-bottom: .06rem; }
  .pl10 { padding-left: .1rem; }
  .f12 { font-size: .12rem; }
  .color-ff6c47 { color: #ff6c47; }
  .color-1fb8ff { color: #1fb8ff; }
  .color-999 { color: #999; }
  .border-bottom-d7d7d7 { border-bottom: #d7d7d7; }
  .receive__store {
    padding: .15rem .1rem;
    background: #fff;
    border-bottom: solid 1px #d7d7d7;
    font-size: .15rem;
  }
  .receive__add {
    margin-right: .1rem;
    font-size: .15rem;
    color: #fff;
    text-decoration: underline;
  }
  .receive__info {
    padding-left: .1rem;
    margin-bottom: .1rem;
    margin-top: .1rem;
    background-color: #fff;
    border-bottom: solid 1px #d7d7d7;
  }
  .receive__column {
    display: flex;
    padding-top: .15rem;
    padding-bottom: .15rem;
    border-bottom: solid 1px #e5e5e5;
    color: #333;
    font-size: .15rem;
    &:last-child {
      border-bottom: none;
    }
    &.select::after {
      content: '';
      display: block;
      width: .28rem;
      background: url('../../assets/common/rightArrow.png') no-repeat center / .075rem auto;
    }
  }
  .receive__pro {
    padding-right: .1rem;
    padding-top: .1rem;
    padding-bottom: .1rem;
    border-bottom: solid 1px #e5e5e5;
    color: #333;
    font-size: .14rem;
    &:last-child {
      border-bottom: none;
    }
    .name {
      padding-bottom: .1rem;
    }
    .amount {
      color: #666;
      font-size: .12rem;
    }
    .compute {
      position: relative;
      display: inline-block;
      margin-left: .1rem;
      line-height: .3rem;
      border: solid 1px #d7d7d7;
      border-radius: 4px;
    }
    .input {
      display: block;
      width: 1.1rem;
      height: .3rem;
      padding: 0 .3rem;
      border: none;
      text-align: center;
    }
    .plus, .reduce {
      position: absolute;
      top: 0;
      width: .3rem;
      height: .3rem;
    }
    .plus {
      right: 0;
      background: #f2f2f2 url('../../assets/storeOrder/plus.png') no-repeat center / 100%;
    }
    .reduce {
      left: 0;
      background: #f2f2f2 url('../../assets/storeOrder/minus.png') no-repeat center / 100%;
    }
    .num {
      padding-top: .1rem;
      color: #999;
      font-size: .12rem;
    }
  }
  .receive__file {
    margin-bottom: .1rem;
    padding-left: .1rem;
    background: #fff;
    .tip {
      display: inline-block;
      margin-left: .1rem;
      color: #999;
      font-size: .12rem;
      vertical-align: bottom;
    }
    .list {
      padding: .1rem 0;
      overflow: hidden;
    }
    .file {
      position: relative;
      padding: .05rem .1rem;
      float: left;
      .pic {
        width: .6rem;
        height: .6rem;
        background: no-repeat center center / contain;
      }
      .del {
        position: absolute;
        top: 0;
        right: 0;
        width: .15rem;
        height: .15rem;
        background: url('~@/assets/storeOrder/remove.png') no-repeat center / 100%;
      }
    }
  }
  .receive__remark {
    margin-bottom: .1rem;
    padding: .15rem .1rem;
    background: #fff;
    color: #333;
    font-size: .15rem;
    border-bottom: solid 1px #D7D7D7;
    .textarea {
      width: 100%;
      margin-top: .1rem;
      padding: .1rem;
      background: #FBFBFB;
      border: solid 1px #D7D7D7;
      border-radius: 4px;
      color: #333;
      font-size: .14rem;
      resize: none;
    }
  }
  .receive__bar {
    .info {
      background: #fff;
      padding: .1rem;
      color: #666;
      font-size: .14rem;
    }
    .submit {
      background: #ff6c47;
      color: #fff;
      font-size: .15rem;
      line-height: 3em;
      text-align: center;
    }
  }
  .receive_imgage_cover {
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    background: rgba(0, 0, 0, .4);
    .receive_pic {
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
  import Product from '@/models/storeOrder/Product'
  import { MessageBox, Toast } from 'mint-ui'
  import { digitalCheck } from '@/utils'
  export default {
    data () {
      return {
        datePicker: new Date(),
        store: {},
        prdList: [],
        isSelectDate: false,
        createTimestamp: '',
        orderStatusDesc: '',
        orderTotalNum: 0, // 订单总数
        orderTotalCase: 0, // 订单箱数
        rTotalNum: 0, // 已收支数
        rTotalCase: 0, // 已收箱数
        remark: '',
        fileList: [],
        isShowGrass: false, // 是否显示图片放大
        grassImg: '' // 需要放大的图片
      }
    },
    computed: {
      total () {
        let total = 0
        this.prdList.forEach(item => {
          total = total + parseInt(item.reciveNum || 0)
        })
        return parseInt(total)
      },
      totalPack () {
        let total = 0
        this.prdList.forEach(item => {
          total = total + parseFloat(item.recivePackChange)
        })
        return total.toFixed(1)
      }
    },
    methods: {
      selectDate () {
        this.isSelectDate = true
        this.$refs.pickerDate.open()
      },
      getOrder (orderCode) {
        api.storeOrder.getStoreOrderDetail({
          data: {
            orderCode: orderCode,
            token: simpleLocalDb.getItem('token')
          }
        }).then(res => {
          if (res.responseCode === 0) {
            this.store = {
              storeId: res.orderInfo.storeId,
              storeName: res.orderInfo.storeName
            }
            this.isSelectDate = true
            this.createTimestamp = res.orderInfo.createTimestamp
            this.orderStatusDesc = res.orderInfo.orderStatusDesc
            this.orderTotalNum = res.orderInfo.orderTotalNum
            this.orderTotalCase = res.orderInfo.orderTotalCase
            this.rTotalNum = res.orderInfo.rTotalNum
            this.rTotalCase = res.orderInfo.rTotalCase
            // this.datePicker = new Date(res.orderInfo.expectedReceiveDate)
            res.orderInfo.orderProductList.forEach(item => {
              this.prdList.push(new Product(item))
            })
          }
        })
      },
      inputInt (item, key, event) {
        const val = digitalCheck(event.target.value, 'number')
        item[key] = val
        event.target.value = val
      },
      imgDeal (imgList) {
        this.fileList = this.fileList.concat(imgList)
      },
      plus (index) {
        if (this.prdList[index].reciveNum < this.prdList[index].orderNum - this.prdList[index].rTotalNum) {
          this.prdList[index].reciveNum++
        }
      },
      reduce  (index) {
        if (this.prdList[index].reciveNum > 0) {
          this.prdList[index].reciveNum--
        }
      },
      delPic (index) {
        this.fileList.splice(index, 1)
      },
      save () {
        let receiveDetail = []
        this.prdList.forEach(item => {
          if (item.reciveNum) {
            receiveDetail.push({
              prdId: item.prdId,
              rNum: item.reciveNum
            })
          }
        })
        if (receiveDetail.length === 0) {
          return MessageBox.alert('收货总数量不能为0')
        }
        let receiveFileList = []
        this.fileList.forEach(item => {
          receiveFileList.push({
            filePath: item.filePath,
            guid: item.guid
          })
        })
        if (receiveFileList.length === 0) {
          return MessageBox.alert('请上传收货单据照片。')
        }
        api.storeOrder.confirmReceiveOrder({
          data: {
            orderCode: this.$route.query.orderCode,
            rDate: this.datePicker.getTime(),
            receiveDetail: receiveDetail,
            receiveFileList: receiveFileList,
            remark: this.remark,
            token: simpleLocalDb.getItem('token')
          }
        }).then(res => {
          if (res.responseCode === 0) {
            Toast(res.responseMsg)
            this.$store.dispatch('storeOrder/resetData')
            this.$router.back()
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
      this.getOrder(this.$route.query.orderCode)
    }
  }
</script>

