<template>
  <bm-layout>
    <bm-header slot="header">
      <div>{{title}}</div>
      <div slot="right" class="header-right f14 color-fff" @click="toExecuteHistory">
        执行历史
      </div>
    </bm-header>
    <template v-if="activityInfo">
      <div class="basic bg-fff bb-e5e5e5 mb10">
        <div class="basic-top bb-e5e5e5 f14 color-666">
          {{activityInfo.storeName}}
        </div>
        <div class="basic-bottom">
          <div class="f15 color-333 bold pb15">
            {{activityInfo.activityTopic}}
          </div>
          <div class="flex items-center justify-between">
            <div class="f15 color-333">{{activityInfo.startDate | datetime('YYYY/MM/DD')}} - {{activityInfo.endDate | datetime('YYYY/MM/DD')}}</div>
            <div class="f12 color-999">{{activityType[activityInfo.activityType]}}</div>
          </div>
        </div>
        <div class="report flex justify-between items-center pl10 pr10" v-if="type === 'history'" @click="checkFinalReport">
          <div class="f15 color-333">结案报告</div>
          <div class="f15 color-999 flex items-center">
            <span class="pr10">查看</span>
            <img class="right-arrow" src="../../assets/activityManagement/rightArrow.png">
          </div>
        </div>
      </div>
      <div class="protocol bg-fff bb-e5e5e5 mb10">
        <div class="f15 color-333 pb5 pl10">合作协议</div>
        <div class="protocol-bottom flex flex-wrap">
          <img class="pic-list-inner" v-for="img in activityInfo.cooperationList" @click="checkPic(img, '.protocol-bottom')" :src="img"/>
        </div>
      </div>
      <div class="resource bg-fff bb-e5e5e5 mb10" v-if="activityInfo.activityType ==='resource'">
        <div class="resource-top flex justify-between items-center pl10 pr10" :class="{'bb-e5e5e5':activityInfo.resourceList.length > 0 }">
          <div class="f15 color-333">门店资源</div>
          <div><span class="f12 color-333">总数：</span><span class="f15 color-ff6c47" v-if="activityInfo.resourceList">{{activityInfo.resourceList.length}}</span></div>
        </div>
        <div class="resource-bottom pl10">
          <div class="resource-list bb-e5e5e5" v-for="(resource, index) in activityInfo.resourceList">
            <div class="f16 color-666 head pr10 ">{{resource.resourceName}}</div>
            <div class="pb10 pr10 ">
              <span class="f13 color-666 des-left">数量<span class="f12 color-999">/个：</span><span class="f14 color-333">{{resource.totalNum}}</span></span>
              <span class="f13 color-666">总面积<span class="f12 color-999">/m²：</span><span class="f14 color-333">{{resource.totalArea}}</span></span>
            </div>
            <div class="pr10 ">
              <span class="f13 color-666 des-left">覆盖人流<span class="f12 color-999">/10分钟：</span><span class="f14 color-333">{{resource.peopleStream}}</span></span>
              <span class="f13 color-666">总费用<span class="f12 color-999">/元：</span><span class="f14 color-333">{{resource.totalAmount.toFixed(2)}}</span>
            </span>
            </div>
            <div class="f13 color-333 pt15 pb5 pr10" v-if="resource.remark">
              {{resource.remark}}
            </div>
            <div class="flex flex-wrap resource-list-img" :id="`resource-list-img-${index}`" :class="{pb5:resource.imgList && resource.imgList.length < 1}">
              <img class="pic-list-inner"  v-for="img in resource.imgList" @click="checkPic(img, `#resource-list-img-${index}`)" :src="img"/>
            </div>
          </div>
        </div>
      </div>
      <div class="cost bg-fff bb-e5e5e5 mb10">
        <div class="cost-top flex justify-between items-center pr10 pl10" :class="{'bb-e5e5e5':activityInfo.costList.length > 0 }">
          <div class="f15 color-333">门店其他费用</div>
          <div><span class="f12 color-333">种类：</span><span class="f15 color-ff6c47" v-if="activityInfo.costList">{{activityInfo.costList.length}}</span></div>
        </div>
        <div class="cost-bottom pl10">
          <div class="cost-list bb-e5e5e5 pr10" v-for="cost in activityInfo.costList">
            <div class="f14 color-666 pb10">{{cost.costName}}</div>
            <div>
              <span class="f13 color-666">费用<span class="f12 color-999">/元：</span><span class="f14 color-333">{{cost.cost.toFixed(2)}}</span></span>
            </div>
            <div class="f13 color-333 pt15 pb15">
              {{cost.costRemark}}
            </div>
          </div>
        </div>
      </div>
      <div class="variety bg-fff bb-e5e5e5 mb10">
        <div class="variety-top flex justify-between items-center pl10 pr10" :class="{'bb-e5e5e5':activityInfo.productList.length > 0 }">
          <div class="f15 color-333">参与活动品种与价格</div>
          <div><span class="f12 color-333">种类：</span><span class="f15 color-ff6c47" v-if="activityInfo.productList">{{activityInfo.productList.length}}</span></div>
        </div>
        <div class="variety-bottom pl10">
          <div class="variety-list flex pr10 justify-between pt15 pb15 bb-e5e5e5 items-center"  v-for="product in activityInfo.productList">
            <div class="f14 color-666">{{product.prdName}}</div>
            <div class="f14 color-333 pl10">￥{{product.price.toFixed(2)}}</div>
          </div>
        </div>
      </div>
      <div class="materiel bg-fff bb-e5e5e5 mb10">
        <div class="materiel-top flex justify-between items-center pl10 pr10" :class="{'bb-e5e5e5':activityInfo.materielList.length > 0 }">
          <div class="f15 color-333">所需活动物料</div>
          <div><span class="f12 color-333">种类：</span><span class="f15 color-ff6c47" v-if="activityInfo.materielList">{{activityInfo.materielList.length}}</span></div>
        </div>
        <div class="materiel-bottom pl10">
          <div class="materiel-list bb-e5e5e5 flex bb-e5e5e5"  :id="`materiel-list-img-${index}`" v-for="(materiel, index) in activityInfo.materielList">
            <img :src="materiel.field2" class="pic flex-none pic-list-inner" v-if="materiel.field2" @click="checkPic(materiel.field2, `#materiel-list-img-${index}`)">
            <bm-empty-pic class="pic flex-none pic-list-inner" v-else></bm-empty-pic>
            <div class="flex-auto flex flex-column pl10 pr10">
              <div class="f14 color-666 pb5">{{materiel.materielName}}</div>
              <div class="f12 color-999 pb10">
                <span>规格：</span><span>{{materiel.field1 === 'normal'? materiel.field3 : '定制'}}</span>
              </div>
              <div class="f13 color-666">数量：{{materiel.totalNum}}</div>
              <div class="f13 color-666 pt5" v-if="materiel.field1 === 'custom_made'">说明：{{materiel.standardRemark}}</div>
            </div>
          </div>
        </div>
      </div>
      <div class="person bg-fff bb-e5e5e5 mb10">
        <div class="person-top flex justify-between bb-e5e5e5 items-center pl10 pr10">
          <div class="f15 color-333">所需人员</div>
          <div><span class="f12 color-333">总数：</span><span class="f15 color-ff6c47">{{activityInfo.longPro + activityInfo.tempPro}}</span></div>
        </div>
        <div class="person-bottom flex items-center pl10 pr10">
          <span class="f13 color-666 des-left">长促<span class="f12 color-999">/人：</span><span class="f14 color-333">{{activityInfo.longPro}}</span></span>
          <span class="f13 color-666">临促<span class="f12 color-999">/人：</span><span class="f14 color-333">{{activityInfo.tempPro}}</span></span>
        </div>
      </div>
      <div class="mark bg-fff mb10 bb-e5e5e5" :class="{'mark-none': !activityInfo.remark}">
        <div class="mark-top f15 color-333 flex justify-between">
          <span>活动备注</span>
          <span class="f15 color-999" v-if="!activityInfo.remark">无</span>
        </div>
        <div class="f14 color-333 pt10" v-if="activityInfo.remark" v-html="htmlWrap1(activityInfo.remark)">
        </div>
      </div>
    </template>
  </bm-layout>
</template>
<script>
  import {routerHistory} from '@/advanced/mixins'
  import {mapGetters} from 'vuex'
  import BmCheckPhoto from '@/components/plugins/BmCheckPhoto'
  import { getCheckPhotoOptions } from '@/utils/dom'
  import { htmlWrap } from '@/advanced/filters'

  export default {
    mixins: [routerHistory],
    data () {
      return {
        title: '活动详情',
        type: '',
        activityCode: ''
      }
    },
    computed: {
      ...mapGetters({
        activityInfo: 'activityManagement/detail/activityInfo',
        activityType: 'activityManagement/detail/activityType'
      })
    },
    methods: {
      htmlWrap1 (text) {
        return htmlWrap(text)
      },
      toExecuteHistory () { // 查看执行历史
        this.$router.push(`/activityManagement/executeHistory/${this.activityCode}`)
      },
      checkPic (pic, selector) { // 图片放大
        BmCheckPhoto(getCheckPhotoOptions(pic, window.document.querySelector(selector), '.pic-list-inner'))
      },
      checkFinalReport () { // 查看结案报告
        this.$router.push(`/activityManagement/finalReport`)
      }
    },
    created () {
      this.type = this.$route.query['type']
      if (this.type === 'history') {
        this.title = '结案详情'
      }
      this.activityCode = this.$route.params['activityCode']
      if (!this.isBackPage()) {
        this.$store.dispatch('activityManagement/detail/resetData')
        this.$store.dispatch('activityManagement/detail/getFieldConfByFieldType')
        this.$store.dispatch('activityManagement/detail/getActivityInfo', this.activityCode)
        this.resetPageKey()
      }
    }
  }
</script>
<style lang="less" scoped>
  .pl10{
    padding-left: 0.1rem
  }
  .pt10{
    padding-top: 0.1rem;
  }
  .pr10{
    padding-right: 0.1rem;
  }
  .pb10{
    padding-bottom:0.1rem;
  }
  .pb15{
    padding-bottom:0.15rem;
  }
  .bold{
    font-weight: bold;
  }
  .mb10{
    margin-bottom: 0.1rem;
  }
  .pb5{
    padding-bottom:0.05rem;
  }
  .pt5{
    padding-top:0.05rem;
  }
  .pt15{
    padding-top:0.15rem;
  }
  .basic{
    &-top{
      padding:0.1rem 0.1rem 0.1rem 0;
      margin-left:0.1rem;
    }
    &-bottom{
      padding:0.1rem;
    }
    .report{
      border-top:1px solid #e5e5e5;
      height:0.45rem;
      .right-arrow{
        width:0.08rem;
        height:0.12rem;
      }
    }
  }
  .protocol{
    padding-top:0.15rem;
    &-bottom{
      width:100%;
      .pic-list{
         &-inner{
            width:0.6rem;
            height: 0.6rem;
            margin:0.1rem;
          }
      }
    }
  }
  .resource{
    &-top{
      height:0.5rem;
    }
    &-bottom{
    .head{
      height:0.44rem;
      line-height: 0.44rem;
    }
    .des-left{
      display: inline-block;
      width:1.6rem;
      overflow-x: hidden;
    }
    .pic-list{
      &-inner{
         width:0.6rem;
         height: 0.6rem;
         margin:0.1rem;
       }
      }
      .resource-list{
        &-img{
          margin-left:-0.1rem;
        }
      }
      .resource-list:last-child{
        border-bottom:0;
      }
    }
  }
  .cost{
    &-top{
      height:0.5rem;
    }
    &-bottom{
      .cost-list{
        padding-top:0.1rem;
      }
      .cost-list:last-child{
        border-bottom:0;
      }
    }
  }
  .variety{
    &-top{
      height:0.5rem;
    }
    &-bottom{
      .variety-list:last-child{
        border-bottom: 0;
      }
    }
  }
  .materiel{
    &-top{
       height:0.5rem;
     }
    &-bottom{
      .materiel-list{
        padding:0.1rem 0;
        .pic{
          width:0.72rem;
          height:0.72rem;
        }
      }
      .materiel-list:last-child{
        border-bottom:0;
      }
    }
  }
  .person {
    &-top{
     height:0.5rem;
    }
    &-bottom{
      height:0.5rem;
      .des-left{
        width:1.6rem;
        display: inline-block;
      }
    }
  }
  .mark{
    padding:0.15rem 0.1rem;
  }
  .mark-none{
    height:0.5rem;
    line-height: 0.5rem;
    padding:0 0.1rem
  }
  .header-right{
    padding-right:0.1rem;
    text-decoration: underline;
    text-decoration-color:#fff;
  }
</style>

