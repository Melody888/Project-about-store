<template>
  <bm-layout>
    <div slot="header">
      <bm-header>填写盘点信息</bm-header>
    </div>
      <div class="main" v-if="detailInfo">
        <div class="list-item">
          <div class="up-part">
            <div class="upp-1 flex justify-between">
              <div class="color-333">{{detailInfo.orderNo}}</div>
              <div>
                <span class="color-999" style="margin-right: 0.1rem">{{ currDate | datetime('date') }}</span>
              </div>
            </div>
            <div class="upp-2 color-333">
              {{detailInfo.storeName}}
            </div>
          </div>
          <div class="down-part flex justify-between items-center">
            <div class="num truncate">
              <span class="mr-8">品种数：{{prdNum}}</span>
              <span class="mr-8">总支数：{{sumNum}}</span>
              <span>至尊：{{newNum}}</span>
            </div>
            <div class="opera" @click="selectProduct">添加产品</div>
          </div>
        </div>
        <div class="flex tab-name items-center">
          <div class="color-666 f12" style="width: 1.6rem">产品名称</div>
          <div class="color-666 f12 center flex-auto">销售库存</div>
          <div class="color-666 f12 center flex-auto">陈列库存</div>
        </div>
        <div class="product-info">
          <div class="flex p-content items-center" v-for="item in detailInfo.prdList">
            <div class="p-name">{{ item.prdName }}</div>
            <div class="p-base center flex-auto relative">
              <p class="show-area" style="color:#1fb8ff" v-if="item.warehouseNum === 0 || item.warehouseNum === ''">填写箱数</p>
              <p class="show-area truncate" v-else>{{item.warehouseNum}}箱</p>
              <input class="input-area" type="tel" placeholder="填写箱数" :value="item.warehouseNum" @input="item.warehouseNum = $event.target.value.replace(/[^0-9]+/g, '');sumPrd()">
            </div>
            <div class="p-base center flex-auto relative">
              <p class="show-area" style="color:#1fb8ff" v-if="item.surfaceNum === 0 || item.surfaceNum === ''">填写支数</p>
              <p class="show-area truncate" v-else>{{item.surfaceNum}}支</p>
              <input class="input-area" type="tel" placeholder="填写支数" :value="item.surfaceNum" @input="item.surfaceNum = $event.target.value.replace(/[^0-9]+/g, '');sumPrd()">
            </div>
          </div>
        </div>
        <div class="photo-info">
          <div class="photo-title color-333">
            <span class="f15">照片</span>
            <span class="f12">（最多上传3张）</span>
          </div>
          <div class="photo-content flex" ref="photo_wrap">
            <div v-for="(item, index) in detailInfo.fileList" class="col-block img-preview">
              <img :src="item.filePath" class="img-preview"  @click="checkPic(item)" alt="">
              <img class="img-del" src="../../assets/common/close.png" @click="imgDel(index)" alt="">
            </div>
            <BmImgPicker v-if="detailInfo.fileList.length < 3" class="col-block" :applyNo="detailInfo.orderNo" sourceFlag="storePk" @pick="imgDeal"></BmImgPicker>
          </div>
        </div>
        <div class="remark-area">
          <div class="remark-title flex justify-between">
            <span class="color-333 f15">备注</span>
            <span class="f12" style="color: #FF6C47">{{remark.length}}/200</span>
          </div>
          <textarea class="remark-content" placeholder="请输入备注" v-model="remark" maxlength="200"></textarea>
        </div>
      </div>
    <div slot="footer">
      <div class="sub-btn" :class="{disable: !submitAble}" @click="submit" >提交</div>
    </div>
  </bm-layout>
</template>

<style lang="less" rel="stylesheet/less" scoped>
  .mr-8 {
    margin-right: 0.08rem;
  }
  .sub-btn {
    height: 0.48rem;
    line-height: 0.48rem;
    text-align: center;
    color:#fff;
    font-size: 0.17rem;
    background: #FF6C47;
  }
  .disable {
    background: #d7d7d7!important;
  }
  .list-item {
    padding: 0 0.1rem;
    background: #fff;
    border-bottom: 1px solid #d7d7d7;
    margin-bottom: 0.1rem;
    .up-part {
      font-size: 0.15rem;
      border-bottom: 1px solid #e5e5e5;
      .upp-1 {
        padding-top: 0.12rem;
        padding-bottom: 0.1rem;
      }
      .upp-2 {
        margin-bottom: 0.12rem;
      }
    }
    .down-part {
      height: 0.4rem;
      line-height: 0.4rem;
        .num {
          font-size: 0.1rem;
          color: #666
        }
        .opera {
          width: 0.8rem;
          height: 0.3rem;
          line-height: 0.3rem;
          text-align: center;
          font-size: 0.14rem;
          color: #fff;
          border-radius: 4px;
          background: #ff6c47;
      }
    }
  }
  .tab-name {
    height: 0.3rem;
    background: #f8f8f8;
    padding: 0 0.1rem;
  }
  .product-info {
    background: #fff;
    padding: 0 0.1rem;
    border-bottom: 1px solid #d7d7d7;
    .p-content {
      border-bottom: 1px solid #e5e5e5;
      min-height: 0.7rem;
      &:last-of-type {
         border-bottom: 0;
       }
      .p-name {
        width: 1.6rem;
        padding-right: 0.1rem;
        color: #333;
        font-size: 0.15rem;
      }
      .p-base, .p-store {
      margin: 0 0.08rem;
        input.input-area {
          position: absolute;
          top: 0;
          left: 0;
          height: 0.4rem;
          width: 100%;
          text-align: center;
          border: 1px solid #d7d7d7;
          border-radius: 4px;
          color: #333;
          font-size: 0.1rem;
          background: #fff;
          opacity: 0;
          &::-webkit-input-placeholder {
            color:#1fb8ff;
          }
        }
      input.input-area:focus {
        opacity: 1;
      }
      .show-area {
        height: 0.4rem;
        line-height: 0.4rem;
        width: 100%;
        text-align: center;
        border: 1px solid #d7d7d7;
        border-radius: 4px;
        color: #333;
        font-size: 0.1rem;
      }
      }
   .p-store {
     padding-right: 0;
   }
    }
  }
  .photo-info {
    margin-top: 0.1rem;
    padding: 0.1rem 0.1rem 0.12rem 0.1rem;
    background: #fff;
    .col-block {
      margin-top: 0.12rem;
      margin-right: 0.12rem;
    }
    .img-preview {
      position: relative;
      width: 0.6rem;
      height: 0.6rem;
      border-radius: 3px;
    }
    .img-del {
      position: absolute;
      top: 0;
      right: 0;
      width: .15rem;
      height: .15rem;
      margin-top: -.075rem;
      margin-right: -.075rem;
    }
  }
  .remark-area {
    margin-top: 0.1rem;
    margin-bottom: 0.12rem;
    padding: 0.1rem 0.1rem 0.12rem 0.1rem;
    background: #fff;
    .remark-content {
      margin-top: 0.12rem;
      height: 0.8rem;
      width: 100%;
      border: 0;
      color: #666;
      font-size: 0.14rem;
      resize: none;
    }
  }
</style>

<script>
  /**
   * Created by Wesdint on 2017/9/26.
   */
  import api from '@/api'
  import BmSelectPage from '@/components/plugins/BmSelectPage'
  import BmImgPicker from '@/components/base/BmImgPicker/index'
  import selectProduct from '../common/selectProduct'
  import BmCheckPhoto from '@/components/plugins/BmCheckPhoto'
  import { getCheckPhotoOptions } from '@/utils/dom'
  export default {
    components: { BmImgPicker },
    data () {
      return {
        detailInfo: null,
        currDate: 0,
        sumNum: 0,
        newNum: 0,
        prdNum: 0,
        remark: '',
        submitAble: false,
        isNum: false
      }
    },
    methods: {
        // 计算产品数量相关
      sumPrd () {
        console.log(111)
        if (this.detailInfo.prdList.length === 0) return
        this.sumNum = 0
        this.newNum = 0
        this.isNum = false
        this.detailInfo.prdList.forEach((item) => {
          let temNum = (+item.warehouseNum) * (+item.pack) + +item.surfaceNum
          this.sumNum += temNum
          if (item.isNew) {
            this.newNum = this.newNum + (+item.warehouseNum) * (+item.pack) + +item.surfaceNum
          }
          console.log(item.surfaceNum !== '')
          console.log(item.warehouseNum !== '')
          // 校验
          if ((item.warehouseNum !== '') || (item.surfaceNum !== '')) {
            this.isNum = true
            console.log(this.isNum)
          }
        })
        this.submitAble = this.isNum
        this.prdNum = this.detailInfo.prdList.length
      },
      imgDeal (imgList) {
        this.detailInfo.fileList = this.detailInfo.fileList.concat(imgList)
      },
      imgDel (index) {
        this.detailInfo.fileList.splice(index, 1)
      },
      checkPic (pic) {
        BmCheckPhoto(getCheckPhotoOptions(pic.filePath, this.$refs.photo_wrap))
      },
      selectProduct () {
        let vm = this
        BmSelectPage({
          component: selectProduct,
          options: {
            disabledList: vm.detailInfo.prdList.map(item => item.customerPrd)
          }
        }).then((data) => {
          data.forEach((item) => {
            item.surfaceNum = ''
            item.warehouseNum = ''
            delete item.prdId
            delete item.price
            delete item.priority
            delete item.typeCode
            delete item.typeDesc
          })
          let temArr = []
          let flag = 0
          data.forEach((item) => {
            for (let i = 0; i < vm.detailInfo.prdList.length; i++) {
              if (item.customerPrd === vm.detailInfo.prdList[i].customerPrd) {
                flag = 1
                break
              }
            }
            if (!flag) {
              temArr.push(item)
              flag = 0
            }
          })
          vm.detailInfo.prdList = temArr.concat(vm.detailInfo.prdList)
          vm.$forceUpdate()
        }, (error) => {
          console.log(error)
        })
      },
      submit () {
        if (!this.submitAble) return
        let submitPrdList = []
        this.detailInfo.prdList.forEach((item) => {
          if (item.surfaceNum !== '' || item.warehouseNum !== '') {
            if (item.surfaceNum === '') item.surfaceNum = 0
            if (item.warehouseNum === '') item.warehouseNum = 0
            submitPrdList.push(item)
          }
        })
        api.storePk.saveStorePkInfo({
          data: {
            fileList: this.detailInfo.fileList,
            orderNo: this.detailInfo.orderNo,
            prdList: submitPrdList,
            storeId: this.detailInfo.storeId,
            remark: this.remark,
            token: simpleLocalDb.getItem('token')
          }
        }).then(result => {
          if (result.responseCode === 0) {
            this.$toast('保存成功')
            this.$router.replace('/storeCheck')
          } else {
            this.$toast(result.responseMsg)
          }
        })
      }
    },
    mounted () {
      let orderNo = ''
      let storeId = ''
      if (this.$route.query.orderNo) {
        orderNo = this.$route.query.orderNo
        storeId = this.$route.query.storeId
      } else {
        const store = this.$store.getters['storeCheck/selectPkStore/store']
        if (!store) {
          this.$router.go(-1)
          return
        } else {
          storeId = store.storeId
        }
      }
      api.storePk.getStorePkDetailsByParams({
        data: {
          orderNo: orderNo,
          storeId: storeId,
          token: simpleLocalDb.getItem('token')
        }
      }).then(result => {
        if (result.responseCode === 0) {
          let temList = []
          result.storePkVo.prdList.forEach((item) => {
            if (item.warehouseNum === 0) {
              item.warehouseNum = ''
            }
            if (item.surfaceNum === 0) {
              item.surfaceNum = ''
            }
            temList.push(item)
          })
          this.detailInfo = result.storePkVo
          this.detailInfo.prdList = temList
          this.currDate = result.storePkVo.planDate
          this.remark = result.storePkVo.remark
          this.sumPrd()
        } else {
          this.$toast(result.responseMsg)
          this.$router.go(-1)
        }
      })
    }
  }
</script>
