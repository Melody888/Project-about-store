<!-- 编辑和详情公用同一个页面 -->
<!-- 路由参数说明
  orderId: 订单号;
  isEdit: 是否为编辑页;
  index: 该订单的索引，用于高效删除指定订单，避免遍历
-->
<template>
  <bm-layout class="layout">
    <bm-header slot="header" :backAction="confirmBack">
      <p>门店计划</p>
      <div slot="right" class="submit-btn" v-show="isEdit" @click="openPopup">确认订单</div>
    </bm-header>
    <div slot="top" class="store-header">
      <div class="flex items-center store-swrapper">
        <div class="flex-auto title text-line-2">{{planDetail['storeName']}}</div>
        <div class="time">
          <p>{{planDetail['planDate'] | datetime('YYYY-MM-DD')}}</p>
          <p>{{planDetail['planDate'] | formatDay}}</p>
        </div>
      </div>
      <div class="flex store-info">
        <div class="flex flex-auto flex-column items-center">
          <p class="title">总金额</p>
          <span class="truncate value">¥{{planDetail['sumPrice'] | formatPrice}}</span>
        </div>
        <div class="flex flex-auto flex-column items-center">
          <p class="title">总支数</p>
          <span class="truncate value">{{planDetail['sumNum']}}支</span>
        </div>
        <div class="flex flex-auto flex-column items-center">
          <p class="title">品种数</p>
          <span class="truncate value">{{planDetail['sumPrdType']}}</span>
        </div>
      </div>
    </div>
    <div class="container">
      <div class="edit-swrapper" v-if="isEdit">
        <div v-for="(item, index) in planDetail['prdList']">
          <div class="title">{{item['prdName']}}</div>
          <div class="flex items-center value">
            <div class="flex-auto">共：¥{{item['sumPrice'] | formatPrice}}</div>
            <div class="flex flex-auto number-swrapper">
              <span>支数</span>
              <div class="flex flex-auto numberInput">
                <div class="number-btn number-del-btn" @click="calculateNum(index, -1)"></div>
                <div class="text flex-auto">
                  <input type="number" v-model="item['prdNum']" @input="setNum(index, $event)" @blur="resetNum(index)">
                </div>
                <div class="number-btn number-add-btn" @click="calculateNum(index, 1)"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="item-wrapper flex items-center" v-else v-for="item in planDetail['prdList']">
        <div class="title text-line-2">{{item['prdName']}}</div>
        <div class="flex-auto value">
          <p class="truncate">支数：{{item['prdNum']}}</p>
          <p class="truncate">¥{{item['sumPrice'] | formatPrice}}</p>
        </div>
      </div>
      <div v-if="isEdit">
        <div class="flex items-center justify-center add-swrapper">
          <div class="add-icon" @click="addProduct">添加产品</div>
        </div>
      </div>
    </div>
    <div slot="left">
      <transition name="popup">
        <div class="submit-popup-swrapper" v-show="showPopup">
          <div class="relative">
            <div class="flex items-center justify-center header">
              <div class="close-btn" @click="closePopup"></div>
              <span>修改原因</span>
            </div>
            <p class="explain">门店计划订单发生调整，必须说明调整原因。</p>
            <div class="flex flex-wrap reason-swrapper">
              <div :class="['flex', 'items-center', 'justify-center', 'item', {'focus': chosenReason(item['fieldCode'])}]" v-for="item in reviseReason" @click="setReviseReason(item['fieldCode'])">{{item['fieldDesc']}}</div>
            </div>
            <div class="textarea-swrapper">
              <div class="title flex justify-between">
                <span>备注</span>
                <span class="number">{{reason.length}}/100</span>
              </div>
              <textarea class="textarea" v-model="reason" placeholder="如有其他需要说明，请填写备注，上限100字。" maxlength="100"></textarea>
            </div>
            <div class="reason-submit-btn" @click="confirmOrder">确认订单</div>
          </div>
        </div>
      </transition>
    </div>
  </bm-layout>
</template>

<script>
  import api from '@/api'
  import BmSelectPage from '@/components/plugins/BmSelectPage'
  import selectProduct from '@/views/common/selectProduct'
  export default {
    data () {
      return {
        showPopup: false,        // 控制修改弹层
        reason: '',              // 备注原因
        chosenReasonGroup: [],   // 选择原因id
        reviseReason: [],        // 调整原因
        prdListCopy: []          // 商品详情副本，用于比对是否修改了数据
      }
    },
    computed: {
      isEdit () {
        return this.$route.query.isEdit ? 1 : 0
      },
      planDetail () {
        return this.$store.state.storePlanOrder.planDetail
      }
    },
    filters: {
      // 格式化日期
      formatDay (value) {
        let day = (new Date(value)).getDay()
        switch (day) {
          case 0:
            return '周一'
          case 1:
            return '周二'
          case 2:
            return '周三'
          case 3:
            return '周四'
          case 4:
            return '周五'
          case 5:
            return '周六'
          case 6:
            return '周日'
        }
      },
      // 格式化价格
      formatPrice (value) {
        let val = value || 0
        return (Number(val) / 100).toFixed(2)
      }
    },
    methods: {
      // 打开弹层
      openPopup () {
        if (this.isDiffPrd()) {
          // 设置hash，触发android实体返回按钮
          window.location.hash = 'popup'
          // this.showPopup = true
        } else {
          this.submitOrder()
        }
      },
      closePopup () {
        window.history.go(-1)
        // this.showPopup = false
        this.reason = ''
        this.chosenReasonGroup = []
      },
      confirmBack () {
        if (this.isEdit && this.isDiffPrd()) {
          this.$messagebox.confirm(' ', {
            title: '温馨提示',
            message: '你尚未确认订单，是否离开？',
            confirmButtonText: '确认离开',
            confirmButtonClass: 'color-2691ff',
            cancelButtonText: '我再想想',
            cancelButtonClass: 'color-2691ff'
          }).then(() => {
            window.history.go(-1)
          })
        } else {
          window.history.go(-1)
        }
      },
      // 比对商品，检查是否有修改
      isDiffPrd () {
        let list = this.planDetail.prdList
        if (list.length !== this.prdListCopy.length) { return true }
        for (let i = 0, len = this.prdListCopy.length; i < len; ++i) {
          if (this.prdListCopy[i].prdNum !== list[i].prdNum || this.prdListCopy[i].prdId !== list[i].prdId) {
            return true
          }
        }
        return false
      },
      // 表单信息校验
      confirmOrder () {
        if (this.isDiffPrd() && this.chosenReasonGroup.length <= 0 && this.reason.trim() === '') {
          return this.$toast('请选择或者填写调整原因')
        }
        this.submitOrder()
      },
      // 提交订单
      submitOrder () {
        this.$messagebox.confirm(' ', {
          title: '确认后将不能修改订单',
          message: '是否确认？',
          confirmButtonText: '确认订单',
          confirmButtonClass: 'color-2691ff',
          cancelButtonText: '我再想想',
          cancelButtonClass: 'color-2691ff'
        }).then(() => {
          this.$store.dispatch('storePlanOrder/confirmOrder', {
            orderId: this.$route.query.orderId,
            reason: this.chosenReasonGroup.join(','),
            remark: this.reason,
            prdList: this.planDetail.prdList.map((e, i) => {
              return { 'prdId': e.prdId, 'prdNum': e.prdNum }
            })
          }).then(result => {
            if (result.responseCode === 0) {
              let index = this.$route.query.index
              this.$store.commit('storePlanOrder/delStoreOrder', {index})
              this.$toast('确认订单成功')
              // this.showPopup = false
              this.$router.go(-2)
            } else {
              this.$toast(result.responseMsg)
            }
          })
        })
      },
      // 是否选择了该原因
      chosenReason (id) {
        return this.chosenReasonGroup.indexOf(id) >= 0
      },
      // 直接修改数量
      setNum (index, event) {
        let data = event.target.value
        data = data.replace(/[^0-9]+/g, '')
        let val = data === '' ? '' : Number(data) > 9999 ? 9999 : Number(data)
        event.target.value = val
        this.$store.commit('storePlanOrder/setOrderNum', {index, data: val})
      },
      // 按钮增减数量
      calculateNum (index, value) {
        let oldValue = this.planDetail.prdList[index].prdNum || 0
        oldValue = Number.parseInt(oldValue)
        let data = oldValue + value
        if (data < 0 || data > 9999) { return }
        this.$store.commit('storePlanOrder/setOrderNum', {index, data})
      },
      // 复位数量
      resetNum (index) {
        if (this.planDetail.prdList[index].prdNum === '') {
          this.$store.commit('storePlanOrder/setOrderNum', {index, data: 0})
        }
      },
      // 选择修改原因
      setReviseReason (code) {
        let index = this.chosenReasonGroup.indexOf(code)
        if (index >= 0) {
          this.chosenReasonGroup.splice(index, 1)
        } else {
          this.chosenReasonGroup.push(code)
        }
      },
      // 新增产品
      addProduct () {
        BmSelectPage({
          component: selectProduct,
          options: {
            disabledList: this.planDetail.prdList.map(e => {
              return e.customerPrd
            })
          }
        }).then(data => {
          if (data && data.length > 0) {
            data.forEach(item => {
              this.$store.commit('storePlanOrder/addOrderPrd', {
                prdId: item.prdId,
                customerPrd: item.customerPrd,
                prdName: item.prdName,
                price: item.price,
                prdNum: 0,
                sumPrice: 0
              })
            })
            this.planDetail.sumPrdType += data.length
          }
        }, error => {
          console.log('is error', error)
        })
      },
      hashchangeHandler () {
        if (window.location.hash.replace(/#/g, '') === 'popup') {
          this.showPopup = true
        } else {
          this.showPopup = false
        }
      }
    },
    watch: {
      reason: function (val, oldValue) {
        if (val.length > 100) {
          this.reason = oldValue
        }
      }
    },
    created () {
      this.$store.dispatch('storePlanOrder/getPlanDetail', {
        orderId: this.$route.query.orderId
      }).then(() => {
        // 拷贝产品列表的原始副本
        this.prdListCopy = this.planDetail.prdList.map((e, i) => {
          return { 'prdId': e.prdId, 'prdNum': e.prdNum }
        })
      })
      this.isEdit && api.plan.getFieldConfByFieldType({
        data: {
          fieldType: 'POREA'
        }
      }).then(result => {
        if (result.responseCode === 0) {
          this.reviseReason = result.itemList
        } else {
          this.$toast(result.responseMsg)
        }
      })
      setTimeout(() => {
        window.addEventListener('hashchange', this.hashchangeHandler, false)
      }, 500)
    },
    destroyed () {
      // 推出后清除store信息
      this.$store.commit('storePlanOrder/setPlanDetail', {})
      window.removeEventListener('hashchange', this.hashchangeHandler)
    }
  }
</script>

<style lang="less" scoped>
  @borderColor: #d7d7d7;
  .layout { background-color: #fff; }
  .text-line-2 {
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    text-overflow: ellipsis;
    overflow: hidden;
    word-break: break-all;
  }
  .submit-btn {
    color: #fff;
    font-size: .14rem;
    border-bottom: 2px solid #fff;
    margin-right: .12rem;
  }
  .store-header {
    background-color: #fff;
    border-bottom: 1px solid @borderColor;
  }
  .store-info {
    .title {
      margin-top: .04rem;
      margin-bottom: .08rem;
      font-size: .12rem;
      color: #999;
    }
    .value {
      font-size: .14rem;
      color: #333;
      margin-bottom: .12rem;
    }
  }
  .store-swrapper {
    height: .64rem;
    padding: 0 .12rem;
    .title {
      font-size: .14rem;
      color: #333;
    }
    .time {
      flex-shrink: 0;
      margin-left: .12rem;
      color: #999;
      font-size: .12rem;
      text-align: right;
    }
  }
  .container {
    background-color: #fff;
    padding: 0 .12rem;
  }
  .item-wrapper {
    height: .60rem;
    border-bottom: 1px solid @borderColor;
    .title {
      color: #333;
      font-size: .14rem;
      max-width: 2.28rem;
    }
    .value {
      margin-left: .12rem;
      color: #666;
      font-size: .12rem;
      text-align: right;
      p:first-of-type {
        margin-bottom: .06rem;
      }
    }
  }
  .edit-swrapper {
    font-size: .14rem;
    &>div {
      border-bottom: 1px solid @borderColor;
    }
    .title {
      color: #333;
      padding: .10rem 0;
    }
    .value {
      padding: .04rem 0 .12rem 0;
      color: #666;
    }
    .number-swrapper {
      text-align: center;
      line-height: .30rem;
      &>span { flex-shrink: 0; }
    }
    .numberInput {
      border: 1px solid #d7d7d7;
      border-radius: 4px;
      margin-left: .08rem;
      .number-btn {
        width: .30rem;
        height: .30rem;
        background-size: contain;
        background-repeat: no-repeat;
      }
      .number-del-btn { background-image: url('~@/assets/common/minus.png'); }
      .number-add-btn { background-image: url('~@/assets/common/plus.png'); }
      input {
        border: none;
        width: 100%;
        height: 100%;
        text-align: center;
      }
    }
  }
  .add-swrapper {
    padding-top: .15rem;
    padding-bottom: .15rem;
    background-color: #fff;
  }
  .add-icon {
    font-size: .14rem;
    color: #666;
    padding-left: .28rem;
    position: relative;
    line-height: .24rem;
    &:before {
      content: ' ';
      width: .24rem;
      height: .24rem;
      background: url('~@/assets/storePlanOrder/add_products@2x.png') no-repeat;
      background-size: contain;
      position: absolute;
      top: 0;
      left: 0;
    }
  }
  .submit-popup-swrapper {
    position: absolute;
    z-index: 1;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    overflow: hidden;
    background-color: #fff;
    &>div { height: 100%; }
    .header {
      padding: .12rem 0;
      position: relative;
      font-size: .18rem;
      color: #1fb8ff;
      .close-btn {
        position: absolute;
        top: .12rem;
        left: .12rem;
        width: .24rem;
        height: .24rem;
        background: url('~@/assets/storePlanOrder/close_blue@2x.png') no-repeat;
        background-size: contain;
      }
      &>span { min-height: .24rem; }
    }
    .explain {
      font-size: .12rem;
      color: #999;
      margin-bottom: .12rem;
      margin-left: .12rem;
    }
    .reason-swrapper {
      padding-right: .10rem;
      .item {
        flex-shrink: 0;
        border: 1px solid #d7d7d7;
        border-radius: 4px;
        font-size: .14rem;
        color: #666;
        margin: 0 0 .10rem .10rem;
        padding: .12rem .08rem;
        &.focus {
          background-color: #ff6c47;
          color: #fff;
          border-color: #ff6c47;
        }
      }
    }
    .textarea-swrapper {
      padding: .10rem;
      padding-top: 0;
      font-size: .11rem;
      color: #666;
      border-bottom: 1px solid #d7d7d7;
      .number { color: #ff6c47; }
      .textarea {
        display: block;
        width: 100%;
        border: none;
        height: .80rem;
        margin-top: .10rem;
        font-size: .14rem;
        color: #333;
      }
    }
    .reason-submit-btn {
      position: absolute;
      left: 0;
      right: 0;
      bottom: 0;
      line-height: .50rem;
      background-color: #ff6c47;
      font-size: .18rem;
      color: #fff;
      text-align: center; 
    }
  }
  .popup-enter-active, .popup-leave-active {
    transition: all .3s
  }
  .popup-enter, .popup-leave-to {
    top: 100%;
    bottom: -100%;
  }
</style>
