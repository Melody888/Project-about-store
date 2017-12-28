<template>
  <bm-layout>
    <bm-header slot="header">
      新增分销巡检单
      <div slot="right" class="f14 add" @click="selectProduct">添加产品</div>
    </bm-header>
    <div class="article-add" slot="header">
      <div class="article-line flex justify-between" @click="selectStore">
        <span>门店</span>
        <div class="address flex items-center"><span :style="{color: store.storeName ? '#333333': '#999999'}">{{store.storeName || '请选择门店'}}</span><i class="icon icon-left"></i></div>
      </div>
      <div class="f15 article-line">分销品种:<span class="ml5">{{productList.length}}</span></div>
    </div>
    <div class="list-detail">
      <div class="cover" v-if="!store.storeId"></div>
      <div class="head-line bottom-line">分销产品明细</div>
      <div class="item bottom-line" v-for="(item, index) in productList" :key="index">
        <div class="f14 flex justify-between">
          <div class="flex-auto">{{item.prdName}}</div>
          <div class="color-999 flex" @click="deleteProduct(index)"><i class="icon icon-del"></i><em>删除</em></div>
        </div>
        <div class="check-list flex justify-between">
          <div class="check-item flex flex-column self-center">
            <div class="ra-con f14 pr">
              <label class="flex">
                <input type="radio" class="ra-check" @change="dateChange(index, item.marketType)"  value="market" v-model='item.marketType'/>
                <span class="pic"></span>
                <span class="ml5">分销价(平时零售价)</span>
              </label>
            </div>
            <div class="ra-con pr f14">
              <label class="flex">
                <input type="radio"  value="activity" @change="dateChange(index, item.marketType)" class="ra-check" v-model='item.marketType'/>
                <span class="pic"></span>
                <span class="ml5">活动价</span>
                </label>
            </div>
          </div>
          <div class="num-con">
            <div class="flex justify-around items-center">
              <em class="color-ff6c47">￥</em><input type="number" class="num-input" placeholder="请输入价格" :style="{color: item.displayPrice ? '#333333': ''}" @keyup="priceChange(index)" v-model="item.displayPrice">
            </div>
          </div>
        </div>
        <div class="time-pick flex items-center f15">
          <span class="">{{item.marketType === 'activity' ? '活动日期' : '分销日期'}}:</span>
          <div class="t-p-con">
            <span class="t-p" @click="openDataPicker(index, 'startDate', item.startTime)">
              <template v-if="item.startTime">{{item.startTime | datetime('YYYY-MM-DD')}}</template>
              <template v-if="!item.startTime">开始时间</template>
            </span>
             --
             <span class="t-p" @click="openDataPicker(index, 'endDate', item.endTime)">
              <template v-if="item.endTime">{{item.endTime | datetime('YYYY-MM-DD')}}</template>
              <template v-if="!item.endTime">结束时间</template>
             </span>
          </div>
        </div>
      </div>
      <div class="remark">
        <div class="headline">备注</div>
        <textarea v-model="remark" class="text-con" name="" id="" cols="100" rows="10" placeholder="请填写补充说明，最多200字"></textarea>
      </div>
    </div>
    <mt-datetime-picker
      ref="dataPicker"
      type="date"
      slot="bottom"
      v-model="defaultDate"
      @confirm="handleConfirm"
      year-format="{value} 年"
      month-format="{value} 月"
      date-format="{value} 日">
    </mt-datetime-picker>
    <div class="footer" @click="save" slot="footer" :class="!store.storeId ? 'footer-disable' : ''">
      保    存
    </div>
  </bm-layout>
</template>

<style lang="less" scoped>
  .ml5{
    margin-left:0.05rem;
  }
  .pr{
    position: relative;
  }
  .t-p-con{
    margin-left:0.05rem;
    .t-p{
      .color-1fb8ff;
      margin: 0px 0.05rem;
    }
  }
  .color-1fb8ff{
    color:#1FB8FF;
  }
  .bottom-line{
    border-bottom:1px solid #d7d7d7;
  }
  .add{
    margin-right: 0.1rem;
    text-decoration:underline;
  }
  .article{
    background-color:white;
    padding:0.11rem 0.1rem 0.15rem;
    box-shadow: 0 0 1px 1px #D7D7D7;
    margin-bottom:0.1rem;
    .ar-detail{
      color:#333333;
      margin-top:0.1rem;
    }
  }
  .article-add{
    background-color: white;
    margin-bottom:0.1rem;
    .article-line{
      padding:0.15rem 0.1rem;
      font-size: 0.15rem;
      border-bottom:1px solid #d7d7d7;
    }
  }
  .list-detail{
    background-color:white;
    font-size:0.15rem;
    position: relative;
    margin-bottom: 0.15rem;
    border-bottom: 1px solid #d7d7d7;
    .cover {
      position: absolute;
      top: 0;
      bottom: 0;
      left: 0;
      right: 0;
      background: #ccc;
      z-index: 1;
      opacity: .4;
    }
    .head-line{
      padding:0.15rem 0.1rem;
    }
    .item{
      padding:0.1rem;
      .check-list{
          padding: 0.15rem 0rem;
        .check-item{
          .ra-con{
            margin-bottom: 0.1rem;
            .ra-check{
              margin-left:0.1rem;
              position:absolute;
              top:0;
              left:0;
              opacity:0;
              width:100%;
              height:100%;
            }
          }
        }
        .num-con{
          width: 1.26rem;
          height: 0.46rem;
          border: 1px solid #D7D7D7;
          border-radius: 4px;
          font-size:0.18rem;
          .num-input{
            width: 0.9rem;
            height: 0.45rem;
            border:none;
            text-align: center;
            color:#999999;
            font-size: 0.15rem;
          }
        }
      }
    }
  }
  .remark{
    font-size: 0.15rem;
    background-color: white;
    padding: 0.15rem 0.1rem;
    .text-con{
      border-radius: 4px;
      font-size:0.14rem;
      padding:0.1rem;
      border: 1px solid #d7d7d7;
      margin-top:0.1rem;
      width: 3rem;
      height: 0.6rem;
      background: #FBFBFB;
    }
  }
  .icon{
    display: inline-block;
    width:0.14rem;
    height: 0.14rem;
    background-size:cover;
    &-del{
      height: 0.16rem;
      background:url('../../assets/storeDistribution/del.png') no-repeat center 2px;
      background-size:100%;
      margin-right: 0.05rem;
    }
    &-left{
      background:url('../../assets/storeDistribution/rightArrow.png') no-repeat center center;
      background-size:contain;
      margin-left: 0.05rem;
    }
  }
  .pic{
    width: 0.2rem;
    height: 0.2rem;
    display: inline-block;
    background: url("../../assets/storeDistribution/circle@2x@2x.png") no-repeat center center;
    background-size: 100%;
  }
  input[type='radio']:checked + span {
    background: url("../../assets/storeDistribution/select@2x@2x.png") no-repeat center center;
    background-size: 100%;
  }
  .footer{
    background: #FF6C47;
    width: 100%;
    height:0.5rem;
    color:white;
    text-align: center;
    line-height:0.5rem;
    font-size: 0.15rem;
    &-disable{
      background: #D7D7D7;
    }
  }
</style>


<script>
import BmSelectPage from '@/components/plugins/BmSelectPage'
import selectStore from '../common/selectStore'
import selectProduct from '../common/selectProduct'
import { mapGetters } from 'vuex'
import { Toast, MessageBox } from 'mint-ui'
export default {
  data () {
    return {
      store: {},
      remark: '',
      defaultDate: new Date(),
      index: 0, // 时间选择器给哪个商品
      type: 'startDate' // 是给开始时间还是结束时间选择
    }
  },
  computed: {
    ...mapGetters({
      productList: 'storeDistribution/getInitProdList'
    })
  },
  methods: {
    priceChange (index) {
      this.productList[index].price = Math.ceil(this.productList[index].displayPrice * 100)
    },
    dateChange (index, marketType) {
      if (marketType === 'activity') {
        this.productList[index].endTime = null
      } else {
        this.productList[index].endTime = 253402185600000
      }
    },
    selectStore () {
      BmSelectPage({
        component: selectStore
      }).then((data) => {
        this.store = data
        this.$store.dispatch('storeDistribution/fetchInitMarketProd', {storeId: this.store.storeId})
      }, (error) => {
        console.log(error)
      })
    },
    selectProduct () {
      if (!this.store.storeId) {
        Toast({
          message: '请先选择门店!',
          duration: 2000
        })
        return
      }
      BmSelectPage({
        component: selectProduct
      }).then((data) => {
        this.$store.commit('storeDistribution/addProduct', data)
      }, (error) => {
        console.log(error)
      })
    },
    deleteProduct (index) {
      MessageBox.confirm('确定删除商品吗？').then(action => {
        this.$store.commit('storeDistribution/deleteProduct', index)
      })
    },
    openDataPicker (index, type, defaultDate) {
      this.index = index
      this.type = type
      if (defaultDate === 253402185600000) {
        this.defaultDate = new Date()
      } else if (defaultDate) {
        this.defaultDate = new Date(defaultDate)
      } else {
        this.defaultDate = new Date()
      }
      this.$refs.dataPicker.open()
    },
    handleConfirm (date) {
      let product = this.productList[this.index]
      if (this.type === 'startDate') {
        if (product.endTime && product.endTime < new Date(date).getTime()) {
          Toast({
            message: '开始日期不能大于结束日期!',
            duration: 2000
          })
          return
        }
        product.startTime = new Date(date).getTime()
      } else {
        if (product.startTime && product.startTime > new Date(date).getTime()) {
          Toast({
            message: '结束日期不能小于开始日期!',
            duration: 2000
          })
          return
        }
        product.endTime = new Date(date).getTime()
      }
      this.$store.commit('storeDistribution/updateProduct', {index: this.index, product})
    },
    save () {
      // 检查是否选择门店
      if (!this.store.storeId) {
        Toast({
          message: '请选择门店!',
          duration: 2000
        })
        return
      }
      this.hasError = false
      // 检查商品是否选择时间
      for (let i = 0; i < this.productList.length; i++) {
        let item = this.productList[i]
        if (!item.startTime) {
          Toast({
            message: '请选择开始时间!',
            duration: 2000
          })
          this.hasError = true
          return
        }
        if (!item.endTime) {
          Toast({
            message: '请选择结束时间!',
            duration: 2000
          })
          this.hasError = true
          return
        }
        if (!item.displayPrice) {
          Toast({
            message: '请输入价格!',
            duration: 2000
          })
          this.hasError = true
          return
        }
        if (this.hasError) break
      }
      if (!this.hasError) {
        this.$store.dispatch('storeDistribution/saveMarketPolling', {marketProdList: this.productList, remark: this.remark, storeId: this.store.storeId, storeName: this.store.storeName}).then(result => {
          if (result.responseCode === 0) {
            Toast({
              message: '保存成功',
              duration: 2000
            })
            this.$store.dispatch('storeDistribution/fetchMarketPollingList', {})
            this.$router.back()
          } else {
            Toast({
              message: result.responseMsg,
              duration: 2000
            })
          }
        })
      }
    }
  },
  mounted () {
    this.$store.dispatch('storeDistribution/fetchInitMarketProd', {})
  }
}
</script>
