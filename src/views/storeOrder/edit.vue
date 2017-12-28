<template>
  <bm-layout>
    <bm-header slot="header">
      填写订单信息
      <div class="order-edit__add" slot="right" @click="selectProduct">添加产品</div>
    </bm-header>

    <!-- 门店信息 -->
    <div class="order-edit__info">
      <div class="order-edit__column" :class="{'select': !this.$route.query.orderCode}">
        <p class="mr15">门店</p>
        <p class="flex-auto right-align" :class="{'color-999':!store.storeId}" @click="selectStore">{{store.storeId ? store.storeId + store.storeName : '请选择'}}</p>
      </div>
    </div>

    <!-- 收货日期 -->
    <div class="order-edit__info">
      <div class="order-edit__column select">
        <p class="mr15">预计收货日期</p>
        <p class="flex-auto right-align" v-if="isSelectDate" :class="{'color-999':!isSelectDate}" @click="selectDate">{{ datePicker | datetime('YYYY/MM/DD') }}</p>
        <p class="flex-auto right-align" v-if="!isSelectDate" :class="{'color-999':!isSelectDate}" @click="selectDate">请选择</p>
      </div>
    </div>

    <!-- 产品列表 -->
    <div class="bg-fff mb10 border-bottom-d7d7d7" v-if="prdList.length > 0">
      <p class="order-edit__column pl10">产品明细</p>
      <ul class="pl10 border-bottom-d7d7d7">
        <li class="order-edit__pro" v-for="(item, index) in prdList">
          <p class="name">{{item.prdName}}</p>
          <div class="flex items-center justify-between">
            <p class="color-ff6c47">&yen;{{(item.price*item.orderNum).toFixed(2)}}</p>
            <div>
              <span>支数</span>
              <div class="compute">
                <p class="plus" @click="plus(index)"></p>
                <input type="text" class="input" :value="item.orderNum" @input="inputInt(item, 'orderNum', $event)"/>
                <p class="reduce" @click="reduce(index)"></p>
              </div>
            </div>
          </div>
          <div class="num flex justify-between">
            <p>箱规：{{item.pack}}</p>
            <p>换算：{{item.packChange}}箱</p>
          </div>
        </li>
      </ul>
    </div>

    <!-- 备注 -->
    <div class="order-edit__remark mb10">
      <p>备注</p>
      <textarea class="textarea" rows="3" placeholder="请填写补充说明，最多200字。" maxlength="200" v-model="remark"></textarea>
    </div>
    <!-- 底部bar -->
    <div class="order-edit__bar flex items-center" slot="footer">
      <div class="p10 flex-auto bg-fff">
        <p class="mb6">总金额：<span class="color-ff6c47">&yen;{{sum.toFixed(2)}}</span></p>
        <p class="mb6">总支数：<span class="color-ff6c47">{{total}} ({{totalPack.toFixed(1)}}箱)</span></p>
        <p>至尊(盒)：<span class="color-ff6c47">{{newNum}}</span></p>
      </div>
      <p class="submit" @click='save'>提交</p>
    </div>
    <div slot='bottom'>
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
  .p10 { padding: .1rem; }
  .pl10 { padding-left: .1rem; }
  .color-ff6c47 { color: #ff6c47; }
  .border-bottom-d7d7d7 { border-bottom: #d7d7d7; }
  .order-edit__store {
    padding: .12rem .1rem .15rem;
    background: #fff;
    border-bottom: solid 1px #d7d7d7;
  }
  .order-edit__add {
    margin-right: .1rem;
    font-size: .15rem;
    color: #fff;
    text-decoration: underline;
  }
  .order-edit__info {
    padding-left: .1rem;
    margin-bottom: .1rem;
    background-color: #fff;
    border-bottom: solid 1px #d7d7d7;
  }
  .order-edit__column {
    display: flex;
    padding-top: .15rem;
    padding-right: .1rem;
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
      width: .18rem;
      background: url('../../assets/common/rightArrow.png') no-repeat center / .075rem auto;
    }
  }
  .order-edit__pro {
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
  .order-edit__remark {
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
  .order-edit__bar {
    background: #ff6c47;
    color: #666;
    font-size: .12rem;
    box-shadow: 0 -2px 8px rgba(0, 0, 0, .2);
    .submit {
      padding: 0 .32rem;
      background: #ff6c47;
      color: #fff;
      font-size: .15rem;
    }
  }
</style>
<script>
  import BmSelectPage from '@/components/plugins/BmSelectPage'
  import selectProduct from '../common/selectProduct'
  import selectStore from '../common/selectStore'
  import Product from '@/models/storeOrder/Product'
  import { digitalCheck } from '@/utils'
  import api from '@/api'
  import { MessageBox } from 'mint-ui'
  export default {
    data () {
      return {
        store: {},
        prdList: [],
        isSelectDate: false,
        datePicker: new Date(),
        remark: '',
        isNullPrd: true // 是否产品列表为空，默认为空
      }
    },
    computed: {
      sum () {
        let sum = 0
        this.prdList.forEach(item => {
          sum = sum + item.sum
        })
        return sum
      },
      total () {
        let total = 0
        this.prdList.forEach(item => {
          total = total + parseInt(item.orderNum || 0)
        })
        return parseInt(total)
      },
      newNum () {
        let newNum = 0
        this.prdList.forEach(item => {
          if (item.isNew) {
            newNum = newNum + parseInt(item.orderNum)
          }
        })
        return parseInt(newNum)
      },
      totalPack () {
        let total = 0
        this.prdList.forEach(item => {
          total = total + parseFloat(item.packChange || 0)
        })
        return total
      }
    },
    methods: {
      inputInt (item, key, event) {
        const val = digitalCheck(event.target.value, 'number')
        item[key] = val
        event.target.value = val
      },
      selectDate () {
        this.isSelectDate = true
        this.$refs.pickerDate.open()
      },
      selectProduct () {
        BmSelectPage({
          component: selectProduct,
          options: {
            disabledList: this.prdList.map(item => item.customerPrd)
          }
        }).then((data) => {
          data.forEach(item => {
            this.prdList.unshift(new Product(item))
          })
          console.log(this.prdList)
        }, (error) => {
          console.log(error)
        })
      },
      selectStore () {
        if (this.$route.query.orderCode) return // 编辑状态不可更改门店信息
        BmSelectPage({
          component: selectStore,
          options: {
          }
        }).then((data) => {
          this.store = data
        }, (error) => {
          console.log(error)
        })
      },
      plus (index) {
        if (this.prdList[index].orderNum < 99999) {
          this.prdList[index].orderNum++
        }
      },
      reduce  (index) {
        if (this.prdList[index].orderNum > 0) {
          this.prdList[index].orderNum--
        }
      },
      getDefault () {
        api.storeOrder.getZiZunPrductList().then(res => {
          if (res.responseCode === 0) {
            res.itemList.forEach(item => {
              this.prdList.push(new Product(item))
            })
          }
        })
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
            this.datePicker = new Date(res.orderInfo.expectedReceiveDate)
            this.remark = res.orderInfo.remark
            res.orderInfo.orderProductList.forEach(item => {
              this.prdList.push(new Product(item))
            })
          }
        })
      },
      save () {
        if (!this.store.storeId) {
          return MessageBox.alert('请选择门店')
        }
        if (!this.isSelectDate) {
          return MessageBox.alert('请选择预计收货时间')
        }
        let orderProductList = []
        this.isNullPrd = true
        this.prdList.forEach(item => {
          if (item.orderNum) {
            orderProductList.push({
              orderNum: item.orderNum,
              prdId: item.prdId
            })
            this.isNullPrd = false
          }
        })
        if (this.isNullPrd) {
          return MessageBox.alert('请选择产品')
        }
        api.storeOrder.addOrEditStoreOrder({
          data: {
            expectedReceiveDate: this.datePicker.getTime(),
            orderCode: this.$route.query.orderCode || '',
            remark: this.remark,
            storeId: this.store.storeId,
            storeName: this.store.storeName,
            token: simpleLocalDb.getItem('token'),
            orderProductList: orderProductList
          }
        }).then(res => {
          if (res.responseCode === 0) {
            this.$router.back()
            this.$store.dispatch('storeOrder/resetData')
          } else {
            MessageBox.alert(res.responseMsg)
          }
        })
      }
    },
    mounted () {
      if (this.$route.query.orderCode) {
        this.getOrder(this.$route.query.orderCode)
      } else {
        this.getDefault()
      }
    }
  }
</script>

