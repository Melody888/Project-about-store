<style lang="less" scoped>
  .mr-10 {
    margin-right: .1rem !important;
  }
  .p-0 {
    padding: 0 !important;
  }
  .pb-0 {
    padding-bottom: 0 !important;
  }
  .h-45 {
    height: .45rem !important;
  }
  .activity {
    &__main {
      padding-bottom: 1rem;
    }
    &__group {
      margin-bottom: .11rem;
      border-bottom: 1px solid #e5e5e5;
      background: #fff;
    }
    &__store {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      padding: .12rem .1rem;
      background: #fff;
    }
    &__store-name {
      color: #333;
      font-size: .15rem;
      flex: auto;
      text-align: right;
    }
    &__input-item {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 0 .1rem;
      height: .45rem;
    }
    &__input-name {
      font-size: .15rem;
      color: #333333;
      letter-spacing: 0;
      margin-right: .05rem;
      flex: none;
      white-space:nowrap;
    }
    &__input-val {
      flex: auto;
      text-align: right;
      color: #333;
      font-size: .15rem;
    }
    &__input {
      border: none;
      outline: none;
      width: 100%;
    }
    &__type-item {
      margin-right: .2rem;
      &:last-of-type {
        margin-right: 0;
      }
    }
    &__date {
      font-size: .15rem;
      color: #0A85CC;
      text-decoration: underline;
    }
    &__protocol {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding-right: .1rem;
      margin-left: .1rem;
      height: .45rem;
      border-bottom: 1px solid #e5e5e5;
    }
    &__protocol-placeholder {
      margin-left: .1rem;
      font-size: .12rem;
      color: #999999;
    }
    &__uploaded-img {
      float: left;
      margin-right: .2rem;
      margin-top: .15rem;
      width: .6rem;
      height: .6rem;
    }
    &__protocol-imgs {
      overflow: hidden;
      padding-left: .1rem;
      padding-bottom: .15rem;
    }
    &__list-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      height: .5rem;
      font-size: .15rem;
      padding: .1rem;
      color: #333;
      line-height: .15rem;
      border-bottom: 1px solid #E5E5E5;
    }
    &__list-sum {
      font-size: .12rem;
      color: #333;
      margin-left: .1rem;
    }
    &__list-num {
      font-size: .15rem;
      color: #FF6C47;
    }
    &__remark {
      padding: .15rem .1rem;
      &-title {
        padding-bottom: .1rem;
        font-size: .15rem;
        line-height: .15rem;
        color: #333333;
        letter-spacing: 0;
      }
      textarea {
        width: 100%;
        border: 1px solid #D7D7D7;
        border-radius: .04rem;
        padding: .07rem .07rem;
        height: .6rem;
        font-size: .14rem;
        resize: none;
        background: #FBFBFB;
      }
    }
  }

  .item {
    border-bottom: 1px solid #E5E5E5;
    margin-left: .1rem;
    padding-right: .1rem;
    padding-bottom: .1rem;
    &:last-of-type {
      border-bottom: none;
    }
    &__header {
      font-size: .14rem;
      color: #666;
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: .1rem 0;
    }
    &__num-row {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: .08rem 0;
      color: #666666;
    }
    &__num-cell {
      font-size: .13rem;
      color: #666;
      flex: none;
      width: 46%;
      display: flex;
      justify-content: space-between;
      align-items: center;
      &.aleft {
        justify-content: flex-start;
      }
      input {
        border: 1px solid #D7D7D7;
        flex: none;
        text-align: center;
        color: #1FB8FF;
        font-size: .15rem;
        width: .75rem;
        height: .26rem;
        border-radius: .04rem;
        &::-webkit-input-placeholder {
          color: #D7D7D7;
        }
      }
    }
    &__num-unit {
      font-size: .12rem;
      color: #999;
      line-height: .13rem;
    }
    &__text {
      padding-top: .1rem;
      font-size: 0;
      textarea {
        width: 100%;
        border: 1px solid #D7D7D7;
        border-radius: .04rem;
        padding: .07rem .07rem;
        height: .6rem;
        font-size: .14rem;
        resize: none;
        background: #FBFBFB;
      }
    }
    &__pic-title {
      padding-top: .1rem;
      font-size: .13rem;
      color: #666;
    }
    &__pic-subtitle {
      font-size: .12rem;
      color: #999;
    }
    &__pics {
      padding-bottom: .05rem;
      overflow: hidden;
    }
  }

  .material {
    padding: .1rem;
    padding-left: 0;
    &__photo {
      width: .72rem;
      height: .72rem;
      background: #D8D8D8;
      margin-right: .1rem;
    }
    &__name {
      font-size: 14px;
      color: #666666;
    }
    &__scale {
      font-size: 12px;
      color: #999999;
    }
  }

  .required {
    font-size: 15px;
    color: #ff6036;
    letter-spacing: 0;
  }
  .del-text {
    font-size: .14rem !important;
    color: #666 !important;
  }
  .icon {
    &__right-arrow {
      margin-top: .05rem;
      margin-left: .1rem;
      width: .075rem;
    }
    &__add {
      width: .16rem;
      height: .16rem;
    }
    &__remove {
      width: .16rem;
      height: .16rem;
    }
  }

  .btn-activity-submit {
    margin: 0 auto;
    width: 94%;
    margin-bottom: .15rem;
    background: #FF6C47;
    border-radius: 4px;
    font-size: 15px;
    color: #FFFFFF;
    letter-spacing: 0;
    line-height: .4rem;
    height: .4rem;
    text-align: center;
  }
  .btn-record-add {
    position: absolute;
    left: .11rem;
    bottom: .18rem;
    background: #FFC924;
    box-shadow: 0 0 6px 0 rgba(148,148,148,0.12), 0 6px 6px 0 rgba(141,141,141,0.24);
    border-radius: 22px;
    font-size: 15px;
    color: #FFFFFF;
    padding: .11rem .15rem;
  }
  .btn-save {
    margin-right: .1rem;
    text-decoration: underline;
    font-size: 14px;
    color: #FFFFFF;
    line-height: 15px;
  }
  .bb0 {
    border-bottom: none !important;
  }
</style>

<template>
  <bm-layout class="activity" ref="layout">
    <div slot="header">
      <bm-header>
        <div>{{title}}</div>
        <div class="btn-save" slot="right" v-if="type !== 'new'" @click="submitData">保存修改</div>
      </bm-header>
      <div class="activity__store" @click="pickStore">
        <div class="activity__input-name">
          门店名称<span class="required" v-if="canPickStore">*</span>
        </div>
        <div class="activity__store-name">
          <span class="color-333" v-if="storeName">{{storeName}}</span>
          <span class="color-999" v-if="!storeName">请选择</span>
        </div>
        <div v-if="canPickStore"><img class="icon__right-arrow" src="~@/assets/icon/rightArrow.png" alt=""></div>
      </div>
    </div>
    <div class="activity__main">

      <!-- 基本信息 -->
      <div class="activity__group">
        <div class="activity__input-item">
          <div class="activity__input-name">
            活动主题<span class="required">*</span>
          </div>
          <div class="activity__input-val">
            <input type="text"
              v-model="activityTopic"
              maxlength="30"
              class="activity__input right-align"
              placeholder="请填写活动主题，上限30字">
          </div>
        </div>
        <div class="activity__input-item">
          <div class="activity__input-name">
            活动日期<span class="required">*</span>
          </div>
          <div class="activity__input-val">
            <span class="activity__date" @click="openStartDatePicker">{{ startDate | datetime('YYYY/MM/DD') | placeholder('开始日期') }}</span>
            <span> - </span>
            <span class="activity__date" @click="openEndDatePicker">{{ endDate | datetime('YYYY/MM/DD') | placeholder('结束日期') }}</span>
          </div>
        </div>
        <div class="activity__input-item">
          <div class="activity__input-name">
            活动类型<span class="required">*</span>
          </div>
          <div class="activity__input-val flex justify-end">
            <div class="flex items-center activity__type-item" v-for="item in activityTypes">
              <input type="radio" name="activityType" :id="item.fieldType + item.fieldCode" class="bm-radio" :value="item.fieldCode" v-model="activityType">
              <label :for="item.fieldType + item.fieldCode">{{item.fieldDesc}}</label>
            </div>
          </div>
        </div>
      </div>

      <!-- 合作协议 -->
      <div class="activity__group">
        <div class="activity__protocol">
          <div class="activity__input-name">
            合作协议<span class="required">*</span> <span class="activity__protocol-placeholder">最多上传5张</span>
          </div>
        </div>
        <div class="activity__protocol-imgs" ref="activityProtocol">
          <bm-uploaded-img
            v-for="(item, index) in cooperationList"
            :key="index"
            @del="delCooperation"
            @click.native="checkPhoto($refs.activityProtocol, item)"
            show-remove
            class="activity__uploaded-img"
            :src="item"></bm-uploaded-img>
          <bm-img-picker v-if="cooperationList.length < 5" source-flag="activity" class="activity__uploaded-img" @pick="addCooperation"></bm-img-picker>
        </div>
      </div>

      <!-- 门店资源信息 -->
      <div class="activity__group" :class="{bb0: iResourceList.length === 0}" v-if="activityType === 'resource'">
        <div class="activity__list-header">
          <div>门店资源 <span class="activity__list-sum">总数：</span><span class="activity__list-num">{{iResourceList.length}}</span></div>
          <div class="flex items-center flex-none">
            <img class="icon__add" src="~@/assets/icon/ic_add.png" alt="">
            <div class="f14 color-1fb8ff" @click="pickResource">&nbsp;添加</div>
          </div>
        </div>
        <div v-for="(item, index) in iResourceList" class="item">
          <div class="item__header">
            <div class="f16 mr-10">{{item.resourceName}}</div>
            <div class="flex items-center flex-none" @click="delItem(item)">
              <img class="icon__remove" src="~@/assets/icon/ic_remove.png" alt="">
              <div class="del-text">&nbsp;删除</div>
            </div>
          </div>
          <div class="item__num-row">
            <div class="item__num-cell">
              <div class="flex-none">数量<span class="item__num-unit">/个</span></div>
              <div><input type="text" placeholder="请输入" :value="item.totalNum" @input="inputNum(item, 'totalNum', $event)"></div>
            </div>
            <div class="item__num-cell">
              <div class="flex-none">总面积<span class="item__num-unit">/㎡</span></div>
              <div><input type="text" placeholder="请输入" :value="item.totalArea" @input="inputNum(item, 'totalArea', $event)"></div>
            </div>
          </div>
          <div class="item__num-row">
            <div class="item__num-cell">
              <div class="flex-none">覆盖人流<div class="item__num-unit">/10分钟</div></div>
              <div><input type="text" placeholder="请输入" :value="item.peopleStream" @input="inputInt(item, 'peopleStream', $event)"></div>
            </div>
            <div class="item__num-cell">
              <div class="flex-none">总费用<span class="item__num-unit">/元</span></div>
              <div><input type="text" placeholder="请输入" :value="item.totalAmount" @input="inputMoney(item, 'totalAmount', $event)"></div>
            </div>
          </div>
          <div class="item__text">
            <textarea maxlength="50" placeholder="请输入位置说明、包装要求、其他，上限50字" v-model="item.remark"></textarea>
          </div>
          <div class="item__pic-title">
            照片 <span class="item__pic-subtitle">&nbsp;最多上传5张</span>
          </div>
          <div class="item__pics" ref="resourcePhotos">
            <bm-uploaded-img
              v-for="(photo, i) in item.imgList"
              :key="i"
              @del="function(src){delStoreRerourcePhoto(item, src)}"
              @click.native="function(){checkPhoto($refs.resourcePhotos[index], photo)}"
              show-remove
              class="activity__uploaded-img"
              :src="photo"></bm-uploaded-img>
            <bm-img-picker v-if="item.imgList.length < 5" source-flag="activity" class="activity__uploaded-img" @pick="addStoreRerourcePhoto(item, $event)"></bm-img-picker>
          </div>
        </div>
      </div>

      <!-- 门店其他费用 -->
      <div class="activity__group" :class="{bb0: iCostList.length === 0}">
        <div class="activity__list-header">
          <div>门店其他费用 <span class="activity__list-sum">种类：</span><span class="activity__list-num">{{iCostList.length}}</span></div>
          <div class="flex items-center flex-none" @click="pickOtherCostList">
            <img class="icon__add" src="~@/assets/icon/ic_add.png" alt="">
            <div class="f14 color-1fb8ff">&nbsp;添加</div>
          </div>
        </div>
        <div v-for="item in iCostList" class="item">
          <div class="item__header">
            <div class="mr-10">{{item.costName}}</div>
            <div class="flex items-center flex-none" @click="delItem(item)">
              <img class="icon__remove" src="~@/assets/icon/ic_remove.png" alt="">
              <div class="del-text">&nbsp;删除</div>
            </div>
          </div>
          <div class="item__num-row" style="padding: 0 !important;">
            <div class="item__num-cell aleft">
              <div class="flex-none mr-10">费用<span class="item__num-unit">/元</span></div>
              <div><input type="text" placeholder="请输入" :value="item.cost" @input="inputMoney(item, 'cost', $event)"></div>
            </div>
          </div>
          <div class="item__text">
            <textarea placeholder="请输入费用说明，上限100字" maxlength="100" v-model="item.costRemark"></textarea>
          </div>
        </div>
      </div>

      <!-- 参与活动品种与价格 -->
      <div class="activity__group" :class="{bb0: iProductList.length === 0}">
        <div class="activity__list-header">
          <div>参与活动品种与价格 <span class="activity__list-sum">种类：</span><span class="activity__list-num">{{iProductList.length}}</span></div>
          <div class="flex items-center flex-none" @click="pickProduct">
            <img class="icon__add" src="~@/assets/icon/ic_add.png" alt="">
            <div class="f14 color-1fb8ff">&nbsp;添加</div>
          </div>
        </div>
        <div v-for="item in iProductList" class="item">
          <div class="item__header">
            <div class="mr-10">{{item.prdName}}</div>
            <div class="flex items-center flex-none" @click="delItem(item)">
              <img class="icon__remove" src="~@/assets/icon/ic_remove.png" alt="">
              <div class="del-text">&nbsp;删除</div>
            </div>
          </div>
          <div class="item__num-row p-0">
            <div class="item__num-cell aleft">
              <div class="flex-none mr-10">价格<span class="item__num-unit">/元</span></div>
              <div><input type="text" placeholder="请输入" :value="item.price" @input="inputMoney(item, 'price', $event)"></div>
            </div>
          </div>
        </div>
      </div>

      <!-- 所需活动物料 -->
      <div class="activity__group" :class="{bb0: iMaterielList.length === 0}">
        <div class="activity__list-header">
          <div>所需活动物料 <span class="activity__list-sum">种类：</span><span class="activity__list-num">{{iMaterielList.length}}</span></div>
          <div class="flex items-center flex-none" @click="pickMaterial">
            <img class="icon__add" src="~@/assets/icon/ic_add.png" alt="">
            <div class="f14 color-1fb8ff">&nbsp;添加</div>
          </div>
        </div>
        <div v-for="(item, index) in iMaterielList" class="item material">
          <div class="flex" ref="materielPhoto">
            <bm-uploaded-img
              class="material__photo flex-none"
              :src="item.field2"
              @click.native="checkPhoto($refs.materielPhoto[index], item.field2)"
              v-if="item.field2" ></bm-uploaded-img>
            <bm-empty-pic class="material__photo flex-none" v-else></bm-empty-pic>
            <div class="flex-auto">
              <div class="material__name">{{item.materielName}}</div>
              <div class="material__scale">规格：{{item.field1 === 'custom_made' ? '定制' : item.field3}}</div>
              <div class="flex justify-between" style="margin-top: .08rem">
                <div class="item__num-cell flex-auto aleft">
                  <div class="flex-none mr-10">数量</div>
                  <div><input type="text" placeholder="请输入" :value="item.totalNum" @input="inputInt(item, 'totalNum', $event)"></div>
                </div>
                <div class="flex items-center flex-none" @click="delItem(item)">
                  <img class="icon__remove" src="~@/assets/icon/ic_remove.png" alt="">
                  <div class="del-text">&nbsp;删除</div>
                </div>
              </div>
            </div>
          </div>
          <div class="item__text" v-if="item.field1 === 'custom_made'">
            <textarea style="height: .48rem;" maxlength="50" placeholder="请输入定制说明，上限50字" v-model="item.standardRemark"></textarea>
          </div>
        </div>
      </div>

      <!-- 所需人员 -->
      <div class="activity__group">
        <div class="activity__list-header h-45">
          <div>所需人员 <span class="activity__list-sum">总数：</span><span class="activity__list-num">{{totalPro}}</span></div>
        </div>
        <div class="item pb-0">
          <div class="item__num-row">
            <div class="item__num-cell">
              <div class="flex-none">长促<span class="item__num-unit">/人</span></div>
              <div><input type="text" placeholder="请输入" :value="longPro" @input="inputInt(null, 'longPro', $event)"></div>
            </div>
            <div class="item__num-cell">
              <div class="flex-none">临促<span class="item__num-unit">/人</span></div>
              <div><input type="text" placeholder="请输入" :value="tempPro" @input="inputInt(null, 'tempPro', $event)"></div>
            </div>
          </div>
        </div>
      </div>

      <!-- 活动备注 -->
      <div class="activity__group activity__remark">
        <div class="activity__remark-title">活动备注</div>
        <div class="f0">
          <textarea maxlength="200" placeholder="请填写补充说明，最多200字。" v-model="remark"></textarea>
        </div>
      </div>

      <!-- 提交 -->
      <div class="btn-activity-submit" v-if="type === 'new'" @click="submitData">提 交</div>
    </div>

    <div slot="left" class="btn-record-add" v-if="type === 'execute'" @click="goInputRecord">新增执行记录</div>

    <div slot="right" class="btn-record-add" v-if="type === 'close'" @click="goInputReport">填写结案报告</div>

    <div slot="bottom">
      <!-- 开始日期 -->
      <mt-datetime-picker
        ref="startDate"
        :start-date="limitStartDateBegin"
        :end-date="limitStartDateEnd"
        type="date"
        v-model="defaultStartDate"
        @confirm="confirmStartDate">
      </mt-datetime-picker>
      <!-- 结束日期 -->
      <mt-datetime-picker
        ref="endDate"
        :start-date="limitEndDateBegin"
        :end-date="limitEndDateEnd"
        type="date"
        v-model="defaultEndDate"
        @confirm="confirmEndDate">
      </mt-datetime-picker>
      <bm-picker :slots="storeResources" value-key="resourceName" ref="storeResource" @confirm="confirmStoreResource"></bm-picker>
      <bm-picker :slots="otherCostList" value-key="costName" ref="otherCostList" @confirm="confirmOtherCostList"></bm-picker>
    </div>
  </bm-layout>
</template>

<script>
  import BmSelectPage from '@/components/plugins/BmSelectPage'
  import selectStore from '@/views/common/selectStore'
  import selectProduct from './selectProduct'
  import selectMaterial from '@/views/common/selectMaterial'
  import BmCheckPhoto from '@/components/plugins/BmCheckPhoto'
  import { getCheckPhotoOptions } from '@/utils/dom'
  import api from '@/api'
  import { MessageBox, Toast, Indicator } from 'mint-ui'
  import { zeroTs } from '@/advanced/filters'
  const oneYearTs = 365 * 24 * 60 * 60 * 1000
  const oneMonthTs = 30 * 24 * 60 * 60 * 1000
  export default {
    data () {
      return {
        originDefaultStartDate: new Date(),
        originDefaultEndDate: new Date(),
        defaultStartDate: new Date(),
        defaultEndDate: new Date(),
        type: '',
        originActivity: null,
        activityTypes: [],
        storeResources: [],
        otherCostList: [],
        activityCode: '',
        storeId: '',
        storeName: '',
        activityTopic: '',
        activityType: '',
        cooperationList: [],
        startDate: null,
        endDate: null,
        resourceList: [],
        costList: [],
        productList: [],
        materielList: [],
        longPro: 0,
        tempPro: 0,
        remark: '',
        submiting: false,
        submited: false
      }
    },
    computed: {
      title () {  // 标题
        const type = this.type
        let title = '新增活动'
        switch (type) {
          case 'update':
            title = '编辑活动'
            break
          case 'execute':
            title = '执行活动'
            break
          case 'close':
            title = '活动结案'
            break
          default:
            title = '新增活动'
        }
        return title
      },
      limitStartDateBegin () {  // 活动开始日期的起始选择限制
        if (this.type === 'new') {
          return new Date(this.originDefaultStartDate.getTime() - oneYearTs)
        } else {
          return new Date(this.originDefaultStartDate.getTime() - oneMonthTs)
        }
      },
      limitStartDateEnd () {  // 活动开始日期的末尾选择限制
        if (this.type === 'new') {
          return new Date(this.originDefaultStartDate.getTime() + oneYearTs)
        } else {
          return new Date(this.originDefaultStartDate.getTime() + oneMonthTs)
        }
      },
      limitEndDateBegin () {  // 活动结束日期的起始选择限制
        if (this.type === 'new') {
          return this.originDefaultEndDate
        } else {
          return new Date(this.originDefaultEndDate.getTime() - oneMonthTs)
        }
      },
      limitEndDateEnd () {  // 活动结束日期的末尾选择限制
        if (this.type === 'new') {
          return new Date(Date.now() + oneYearTs)
        } else {
          return new Date(this.originDefaultEndDate.getTime() + oneMonthTs)
        }
      },
      canPickStore () {  // 是否可以选择门店
        return ['new', 'update'].indexOf(this.type) > -1
      },
      iResourceList () {  // 过滤后的门店资源列表
        return this.resourceList.filter(item => {
          return item.validFlag === 0
        })
      },
      iCostList () {  // 过滤后的其他费用列表
        return this.costList.filter(item => {
          return item.validFlag === 0
        })
      },
      iProductList () {  // 过滤后的产品列表
        return this.productList.filter(item => {
          return item.validFlag === 0
        })
      },
      iMaterielList () {  // 过滤后的物料信息列表
        return this.materielList.filter(item => {
          return item.validFlag === 0
        })
      },
      totalPro () {
        let total = 0
        const longPro = Number(this.longPro)
        const tempPro = Number(this.tempPro)
        if (!isNaN(longPro) && this.longPro > 0) {
          total += parseInt(longPro)
        }
        if (!isNaN(tempPro) && this.tempPro > 0) {
          total += parseInt(tempPro)
        }
        return total
      }
    },
    methods: {
      inputMoney (mod, key, event) {  // 输入 金钱相关的字段：保留2位小数
        const value = event.target.value
        const valNum = Number(value)
        if (value.trim() === '' || isNaN(valNum) || valNum < 0) {
          mod[key] = 0
          event.target.value = mod[key]
        } else {
          mod[key] = Math.floor(valNum * 100) / 100
          if (mod[key] !== valNum) {
            event.target.value = mod[key]
          }
        }
      },
      inputNum (mod, key, event) {  // 输入 资源的面积、数量：保留1位小数
        const value = event.target.value
        const valNum = Number(value)
        if (value.trim() === '' || isNaN(valNum) || valNum < 0) {
          mod[key] = 0
          event.target.value = mod[key]
        } else {
          mod[key] = Math.floor(valNum * 10) / 10
          if (mod[key] !== valNum) {
            event.target.value = mod[key]
          }
        }
      },
      inputInt (mod, key, event) {  // 输入 人数、物料数量：0或正整数
        if (!mod) mod = this
        const value = event.target.value
        const valNum = Number(value)
        if (isNaN(valNum) || valNum < 0) {
          mod[key] = 0
          event.target.value = mod[key]
        } else {
          mod[key] = parseInt(valNum)
          if (mod[key] !== valNum) {
            event.target.value = mod[key]
          }
        }
      },
      syncStoreData () {  // 同步数据到store里
        this.$store.commit('activityManagement/input/type', this.type)
        this.$store.commit('activityManagement/input/originActivity', this.originActivity)
        this.$store.commit('activityManagement/input/activityTypes', this.activityTypes)
        this.$store.commit('activityManagement/input/storeResources', this.storeResources)
        this.$store.commit('activityManagement/input/activityCode', this.activityCode)
        this.$store.commit('activityManagement/input/storeId', this.storeId)
        this.$store.commit('activityManagement/input/storeName', this.storeName)
        this.$store.commit('activityManagement/input/activityTopic', this.activityTopic)
        this.$store.commit('activityManagement/input/activityType', this.activityType)
        this.$store.commit('activityManagement/input/cooperationList', this.cooperationList)
        this.$store.commit('activityManagement/input/startDate', this.startDate)
        this.$store.commit('activityManagement/input/endDate', this.endDate)
        this.$store.commit('activityManagement/input/resourceList', this.resourceList)
        this.$store.commit('activityManagement/input/costList', this.costList)
        this.$store.commit('activityManagement/input/productList', this.productList)
        this.$store.commit('activityManagement/input/materielList', this.materielList)
        this.$store.commit('activityManagement/input/longPro', this.longPro)
        this.$store.commit('activityManagement/input/tempPro', this.tempPro)
        this.$store.commit('activityManagement/input/remark', this.remark)
      },
      syncLocalData () {  // 同步store的数据在data里
        this.type = this.$store.getters['activityManagement/input/type']
        this.originActivity = this.$store.getters['activityManagement/input/originActivity']
        this.activityTypes = this.$store.getters['activityManagement/input/activityTypes']
        this.storeResources = this.$store.getters['activityManagement/input/storeResources']
        this.activityCode = this.$store.getters['activityManagement/input/activityCode']
        this.storeId = this.$store.getters['activityManagement/input/storeId']
        this.storeName = this.$store.getters['activityManagement/input/storeName']
        this.activityTopic = this.$store.getters['activityManagement/input/activityTopic']
        this.activityType = this.$store.getters['activityManagement/input/activityType']
        this.cooperationList = this.$store.getters['activityManagement/input/cooperationList']
        this.startDate = this.$store.getters['activityManagement/input/startDate']
        this.endDate = this.$store.getters['activityManagement/input/endDate']
        this.resourceList = this.$store.getters['activityManagement/input/resourceList']
        this.costList = this.$store.getters['activityManagement/input/costList']
        this.productList = this.$store.getters['activityManagement/input/productList']
        this.materielList = this.$store.getters['activityManagement/input/materielList']
        this.longPro = this.$store.getters['activityManagement/input/longPro']
        this.tempPro = this.$store.getters['activityManagement/input/tempPro']
        this.remark = this.$store.getters['activityManagement/input/remark']
      },
      pickStore () {  // 选择门店
        if (!this.canPickStore) return
        BmSelectPage({
          component: selectStore
        }).then(data => {
          this.storeId = data.storeId
          this.storeName = data.storeName
        }, error => {
          console.log(error)
        })
      },
      pickResource () {  // 选择门店资源
        this.$refs.storeResource.open()
      },
      pickOtherCostList () {  // 选择门店其他费用
        this.$refs.otherCostList.open()
      },
      pickProduct () {  // 选择产品
        BmSelectPage({
          component: selectProduct,
          options: {
            disabledList: this.iProductList.map(item => item.prdId)
          }
        }).then(data => {
          if (data && data.length > 0) {
            data.forEach(item => {
              this.productList.unshift({
                prdId: item.prdId,
                prdName: item.prdName,
                price: 0,
                validFlag: 0
              })
            })
          }
        }, error => {
          console.log(error)
        })
      },
      pickMaterial () {  // 选择物料
        BmSelectPage({
          component: selectMaterial
        }).then(data => {
          if (data) {
            const index = this.iMaterielList.findIndex(item => item.materielCode === data.materielCode)
            if (index === -1) {
              this.materielList.unshift({
                field1: data.standardType,
                field2: data.picUrl,
                field3: data.standard,
                materielName: data.materielName,
                materielCode: data.materielCode,
                standardRemark: '',
                totalNum: 0,
                validFlag: 0
              })
            }
          }
        }, error => {
          console.log(error)
        })
      },
      openStartDatePicker () {  // 选择开始日期
        this.$refs.startDate.open()
      },
      openEndDatePicker () {  // 选择结束日期
        this.$refs.endDate.open()
      },
      confirmStartDate (val) {  // 确定开始日期
        this.startDate = val.getTime()
      },
      confirmEndDate (val) {  // 确定结束日期
        this.endDate = val.getTime()
      },
      confirmStoreResource (val) {  // 确定门店资源选择
        if (!val) return
        this.resourceList.unshift({
          imgList: [],
          peopleStream: 0,
          remark: '',
          resourceCode: val.resourceCode,
          resourceName: val.resourceName,
          totalAmount: 0,
          totalArea: 0,
          totalNum: 0,
          validFlag: 0
        })
      },
      confirmOtherCostList (val) {  // 确定其他费用选择
        if (!val) return
        const index = this.iCostList.findIndex(item => item.costCode === val.costCode)
        if (index === -1) {
          this.costList.unshift({
            cost: 0,
            costCode: val.costCode,
            costName: val.costName,
            costRemark: '',
            validFlag: 0
          })
        }
      },
      fetchActivity () {  // 获取活动数据
        Indicator.open()
        return api.activity.getActivityInfo({
          data: {
            activityCode: this.activityCode,
            token: simpleLocalDb.getItem('token'),
            type: 'edit'
          }
        }).then(result => {
          Indicator.close()
          if (result.responseCode === 0) {
            const activity = result.activityInfo
            this.originActivity = JSON.parse(JSON.stringify(activity))
            this.storeId = activity.storeId
            this.storeName = activity.storeName
            this.activityTopic = activity.activityTopic
            this.activityType = activity.activityType
            this.cooperationList = activity.cooperationList
            this.startDate = activity.startDate
            this.endDate = activity.endDate
            this.defaultStartDate = new Date(activity.startDate)
            this.defaultEndDate = new Date(activity.endDate)
            this.originDefaultStartDate = new Date(activity.startDate)
            this.originDefaultEndDate = new Date(activity.endDate)
            this.resourceList = activity.resourceList
            this.costList = activity.costList
            this.productList = activity.productList
            this.materielList = activity.materielList
            this.longPro = activity.longPro
            this.tempPro = activity.tempPro
            this.remark = activity.remark
          }
        })
      },
      fetchActivityTypes () {  // 获取活动类型选择列表数据
        return api.plan.getFieldConfByFieldType({
          data: {
            fieldType: 'ACTIVITY_TYPE'
          }
        }).then(result => {
          if (result.responseCode === 0) {
            this.activityTypes = result.itemList
            if (this.type === 'new' && this.activityTypes.length) {
              this.activityType = this.activityTypes[0].fieldCode
            }
          }
        })
      },
      fetchStoreResources () {  // 获取门店资源选择列表数据
        return api.activity.getResourceList().then(result => {
          if (result.responseCode === 0) {
            this.storeResources = result.resourceList
            // 添加默认值
            if (this.type !== 'new') return
            this.storeResources.forEach(val => {
              if (val.sort !== null) {
                this.resourceList.push({
                  imgList: [],
                  peopleStream: 0,
                  remark: '',
                  resourceCode: val.resourceCode,
                  resourceName: val.resourceName,
                  totalAmount: 0,
                  totalArea: 0,
                  totalNum: 0,
                  validFlag: 0
                })
              }
            })
          }
        })
      },
      fetchOtherCostList () {  // 获取其他费用选择列表数据
        return api.activity.getCostList().then(result => {
          if (result.responseCode === 0) {
            this.otherCostList = result.costList
            // 添加默认值
            if (this.type !== 'new') return
            this.otherCostList.forEach(val => {
              if (val.sort !== null) {
                this.costList.push({
                  cost: 0,
                  costCode: val.costCode,
                  costName: val.costName,
                  costRemark: '',
                  validFlag: 0
                })
              }
            })
          }
        })
      },
      fetchDefaultProduct () {  // 获取默认的产品列表数据
        return api.activity.getProductList({
          data: {
            query: ''
          }
        }).then(result => {
          if (result.responseCode === 0) {
            // 添加默认值
            result.productList.forEach(val => {
              if (val.sort !== null) {
                this.productList.push({
                  prdId: val.prdId,
                  prdName: val.prdName,
                  price: 0,
                  validFlag: 0
                })
              }
            })
          }
        })
      },
      fetchDefaultMateriel () {  // 获取默认的物料列表数据
        return api.activity.getMaterielList().then(result => {
          if (result.responseCode === 0) {
            // 添加默认值
            result.materielList.forEach(val => {
              if (val.sort !== null) {
                this.materielList.push({
                  field1: val.standardType,
                  field2: val.picUrl,
                  field3: val.standard,
                  materielName: val.materielName,
                  materielCode: val.materielCode,
                  standardRemark: '',
                  totalNum: 0,
                  validFlag: 0
                })
              }
            })
          }
        })
      },
      delItem (item) {  // 删除条目
        MessageBox.confirm('是否删除', '', {
          confirmButtonText: '是',
          cancelButtonText: '否'
        }).then(() => {
          item.validFlag = 1
        }, () => {})
      },
      delCooperation (img) {  // 删除合作协议图片
        const cooperationList = this.cooperationList
        const index = cooperationList.findIndex(item => img === item)
        if (index > -1) {
          this.cooperationList.splice(index, 1)
        }
      },
      delStoreRerourcePhoto (item, img) {
        const imgList = item.imgList
        const index = imgList.findIndex(item => img === item)
        if (index > -1) {
          imgList.splice(index, 1)
        }
      },
      checkPhoto (container, img) {  // 查看图片
        console.log(container)
        BmCheckPhoto(getCheckPhotoOptions(img, container, '.uploaded-Img__img'))
      },
      addCooperation (fileList) {  // 增加合作协议图片
        if (fileList && fileList.length > 0) {
          this.cooperationList.push(fileList[0].filePath)
        }
      },
      addStoreRerourcePhoto (resource, fileList) {  // 增加门店资源的图片
        if (fileList && fileList.length > 0) {
          resource.imgList.push(fileList[0].filePath)
        }
      },
      validate () {  // 提交数据前的校验
        if (!this.storeId) {
          Toast('请选择门店')
          return false
        }
        if (!this.activityTopic) {
          Toast('请填写活动主题')
          return false
        }
        if (!this.startDate) {
          Toast('请选择活动开始日期')
          return false
        }
        if (!this.endDate) {
          Toast('请选择活动结束日期')
          return false
        }
        if (zeroTs(this.startDate) > zeroTs(this.endDate)) {
          Toast('活动开始日期不能大于结束日期')
          return false
        }
        if (!this.activityType) {
          Toast('请选择活动类型')
          return false
        }
        if (!this.cooperationList.length) {
          Toast('请上传合作协议图片')
          return false
        }
        if (!this.cooperationList.length) {
          Toast('请上传合作协议图片')
          return false
        }
        // for (let item of this.iResourceList) {

        // }
        for (let item of this.iCostList) {
          if (item.cost > 0 && !item.costRemark) {
            Toast('请填写费用说明')
            return false
          }
        }
        // for (let item of this.iProductList) {
        //   if (!item.price) {
        //     Toast('请填写产品活动价格')
        //     return false
        //   }
        // }
        for (let item of this.iMaterielList) {
          if (item.field1 === 'custom_made' && !item.standardRemark && item.totalNum > 0) {
            Toast('请填写定制说明')
            return false
          }
        }
        // if (!this.totalPro) {
        //   Toast('请填写所需人员')
        //   return false
        // }
        return true
      },
      submitData (action) {  // 保存数据
        if (this.submiting) return
        if (!this.validate()) return
        this.submiting = true
        Indicator.open()
        let resourceList = []
        if (this.activityType === 'resource') {
          resourceList = this.resourceList.filter(item => {
            return item.validFlag === 1 || item.peopleStream || item.totalAmount || item.totalArea || item.totalNum || item.remark || item.imgList.length
          })
        }
        api.activity.saveActivity({
          data: {
            activityCode: this.activityCode,
            activityTopic: this.activityTopic,
            activityType: this.activityType,
            cooperationList: this.cooperationList,
            costList: this.costList.filter(item => {
              return item.validFlag === 1 || item.cost || item.costRemark
            }),
            endDate: this.endDate,
            longPro: Number(this.longPro),
            materielList: this.materielList.filter(item => {
              return item.validFlag === 1 || item.totalNum || item.standardRemark
            }),
            productList: this.productList,
            remark: this.remark,
            resourceList,
            startDate: this.startDate,
            storeId: this.storeId,
            storeName: this.storeName,
            tempPro: Number(this.tempPro),
            token: simpleLocalDb.getItem('token'),
            totalMateriel: this.productList.filter(item => {
              return item.validFlag === 0
            }).length,
            totalResource: resourceList.filter(item => {
              return item.validFlag === 0
            }).length,
            type: this.type
          }
        }).then(result => {
          this.submiting = false
          Indicator.close()
          if (result.responseCode === 0) {
            this.$store.dispatch('activityManagement/activityList/resetData')
            this.submited = true
            if (action === 'record') {
              this.$router.push({
                path: '/activityManagement/inputRecord',
                query: {
                  activityCode: this.activityCode
                }
              })
            } else if (action === 'report') {
              this.$router.push({
                path: '/activityManagement/inputReport',
                query: {
                  activityCode: this.activityCode
                }
              })
            } else {
              Toast('保存成功')
              this.$router.go(-1)
            }
          } else {
            Toast(result.responseMsg)
          }
        })
      },
      goInputReport () {  // 跳转填写结案报告
        if (this.isEdited()) {
          MessageBox.confirm('活动修改还未保存，是否保存？', '', {
            confirmButtonText: '确定',
            cancelButtonText: '取消'
          }).then(() => {
            this.submitData('report')
          }, () => {
            console.log('取消')
          })
        } else {
          this.submitData('report')
        }
      },
      goInputRecord () {  // 跳转填写执行记录
        if (this.isEdited()) {
          MessageBox.confirm('活动修改还未保存，是否保存？', '', {
            confirmButtonText: '确定',
            cancelButtonText: '取消'
          }).then(() => {
            this.submitData('record')
          }, () => {
            console.log('取消')
          })
        } else {
          this.submitData('record')
        }
      },
      compareObj (obj1, obj2) {
        return JSON.stringify(obj1) === JSON.stringify(obj2)
      },
      isEdited () {  // 是否编辑过
        if (this.submited) return false
        if (this.type === 'new') return true
        if (!this.originActivity) return false
        const originActivity = this.originActivity
        // 对比每项数据是否修改
        if (originActivity.activityTopic !== this.activityTopic) return true
        if (originActivity.activityType !== this.activityType) return true
        if (originActivity.endDate !== this.endDate) return true
        if (originActivity.longPro !== this.longPro) return true
        if (originActivity.remark !== this.remark) return true
        if (originActivity.startDate !== this.startDate) return true
        if (originActivity.storeId !== this.storeId) return true
        if (originActivity.tempPro !== this.tempPro) return true
        if (!this.compareObj(originActivity.cooperationList, this.cooperationList)) return true
        if (!this.compareObj(originActivity.costList, this.costList)) return true
        if (!this.compareObj(originActivity.materielList, this.materielList)) return true
        if (!this.compareObj(originActivity.productList, this.productList)) return true
        if (!this.compareObj(originActivity.resourceList, this.resourceList)) return true
        return false
      }
    },
    beforeRouteLeave (to, from, next) {
      if (!this.isEdited()) return next()

      if (['inputRecord', 'inputReport'].indexOf(to.name) > -1) {
        next()
        console.log('next')
      } else {
        let text = ''
        if (this.type === 'new') {
          text = '活动填写未完成，是否退出？'
        } else {
          text = '活动修改还未保存，是否退出？'
        }
        MessageBox.confirm(text, '', {
          confirmButtonText: '确定',
          cancelButtonText: '取消'
        }).then(() => {
          next()
        }, () => {
          next(false)
        })
      }
    },
    created () {
      this.type = this.$route.query.type
      if (this.type !== 'new') {
        this.activityCode = this.$route.query.activityCode
        this.fetchActivity()
      }
    },
    mounted () {
      this.fetchActivityTypes()
      this.fetchStoreResources()
      this.fetchOtherCostList()
      if (this.type === 'new') {
        this.fetchDefaultProduct()
        this.fetchDefaultMateriel()
      }
      this.$nextTick(() => {
        this.$refs.layout.resetScrollTop()
      })
    }
  }
</script>
