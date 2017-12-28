<style lang="less" scoped>
  .no-project-perVo{
    color:#d7d7d7;
    height:0.44rem;
    line-height: 0.44rem;
    text-align: center;
  }
  .icon{
    display: inline-block;
    width:0.14rem;
    height: 0.14rem;
    background-size:cover;
    &-add{
      height: 0.16rem;
      background:url('../../assets/storeAuthorized/ic_add.png') no-repeat center center;
      background-size:100%;
      margin-right: 0.05rem;
    }
    &-blue{
      width:0.14rem;
      height: 0.16rem;
      background:url('../../assets/storeAuthorized/ic_user_blue.png') no-repeat center center;
      background-size:100%;
      margin-right: 0.05rem;
    }
    &-pe-grey{
      width:0.14rem;
      height: 0.16rem;
      background:url('../../assets/storeAuthorized/ic_user_grey.png') no-repeat center center;
      background-size:100%;
      margin-right: 0.05rem;
    }
    &-start{
      width:0.12rem;
      height:0.12rem;
      background:url('../../assets/storeAuthorized/ic_star12_yellow.png') no-repeat center center;
      background-size:100%;
      margin-left: 0.05rem;
    }
  }
  .stars{
    display: flex;
    align-items: center;
    justify-content: center;
    margin-top: 0.15rem;
    &>input[type=radio]{
      appearance: none;
      width: .12rem;
      height: .12rem;
      margin-left: 0.05rem;
      border: none;
      background: url('../../assets/storeAuthorized/ic_star12_grey.png') no-repeat center center/contain;
      background-color: #fff;
      &.active{
        background: url('../../assets/storeAuthorized/ic_star12_yellow.png') no-repeat center center/contain;
      }
      &.active-grey{
        background: url('../../assets/storeAuthorized/ic_star12_darkGrey.png') no-repeat center center/contain;
      }
    }
  }
  .mb10{margin-bottom:0.1rem;}
  .b-bot{
    border-bottom:1px solid #d7d7d7;
  }
  .b-ce5e{
    border-bottom:1px solid #e5e5e5;
  }
  .nav-top{
    padding: 0.1rem 0.1rem 0.13rem;
    background-color: white;
    .save{
      border-radius: 4px;
      border:1px solid #1fb8ff;
      color:#1fb8ff;
      height:0.3rem;
      width:0.9rem;
      text-align: center;
      line-height: 0.3rem;
      font-size:0.14rem;
    }
    .b-bot;
    display:flex;
    justify-content: space-between;
    .p-num{
      margin-left:0.05rem;
      border:none;
      border-radius: 4px;
      border:1px solid #d7d7d7;
      color:#1fb8ff;
      text-align: center;
      width:0.75rem;
      height:0.26rem;
      line-height:0.26rem;
      font-size: 0.15rem;
    }
  }
  .f15-c333{
    font-size: 0.15rem;
    color:#333333;
  }
  .f14-c1fb{
    font-size: 0.14rem;
    color: #1fb8ff;
  }
  .f14-c333{
    font-size:0.14rem;
    color: #333333;
  }
  .f13-c0A8{
    font-size: 0.13rem;
    color:#0A85CC;
  }
  .f12-c1FB{
    font-size: 0.12rem;
    color:#1fb8ff;
  }
  .f12-c999{
    font-size: 0.12rem;
    color:#999999;
  }
  .f12-c666{
    font-size: 0.12rem;
    color:#666666;
  }
  .f13-c666{
    font-size:0.13rem;
    color:#666666;
  }
  .f13-c999{
    font-size:0.13rem;
    color:#999999;
  }
  .edit-style{
    text-decoration: underline;
    color:#0A85CC;
    font-size: 0.14rem;
  }
  .item{
    background-color: white;
  }
  .f-between-ali-center{
    display:flex;
    justify-content: space-between;
    align-items: center;
  }
  .line-1{
    .f-between-ali-center;
    .b-ce5e;
    padding: 0.18rem 0.1rem 0.17rem;
  }
  .line-2{
    .f-between-ali-center;
    .b-ce5e;
    padding: 0.175rem 0.1rem 0.175rem;
  }
  .line-3{
    .b-ce5e;
    padding: 0.16rem 0.1rem 0.15rem 0rem;
    margin-left:0.1rem;
    &:last-child{
      border-bottom: none;
    }
    .state{
      padding:0.025rem 0.1rem;
      border-radius: 12px;
      color:#1fb8ff;
      border:1px solid #1fb8ff;
      margin: 0.15rem 0.05rem 0 0;
      &-grey{
        color:#999999;
        border:1px solid #999999;
      }
    }
    .start-con{
      width:0.85rem;
      display:flex;
      margin-top:0.1rem;
    }
     &-name{
        overflow: hidden;
        margin-right:0.1rem;
      }
    .ell{
      overflow:hidden;
      text-overflow:ellipsis;
      white-space:nowrap;
    }
  }
  .line-4{
    margin: 0.05rem 0rem 0rem 0.19rem;
  }
  .hr-line{
    width:1.13rem;
    height:1px;
    margin:0px auto;
    padding:0px;
    overflow:hidden;
    background-color:#d7d7d7;
    margin:0.14rem 0;
  }
  .ell{
    display:inline-block;
    max-width:100%;
    overflow:hidden;
    text-overflow:ellipsis;
    white-space:nowrap;
  }
  .w50{
  }
</style>


<template>
  <bm-layout>
    <bm-header slot="header">
      <div class="f18 ell w50">{{fitProjectPerVo.fieldDesc}}</div>
    </bm-header>
    <div class="nav-top items-center">
      <div class="f-between-ali-center">
        <span><em class="f15-c333">编制/</em><em class="f13-c999">人</em></span>
        <input type="number" class="p-num" v-model="fitProjectPerVo.sumPerNum" @input="changeNumber">
      </div>
      <div class="save" @click="saveAuthorized">确认编制数</div>
    </div>
    <div class="flex justify-around items-center">
      <div class="hr-line"></div><span class="f12-c999">人员名单</span><div class="hr-line"></div>
    </div>
    <div class="f14 no-project-perVo" v-if="fitProjectPerVo.personList && fitProjectPerVo.personList.length < 1">暂无有效人员</div>
    <div class="item" >
      <div class="line-3" v-for="(per, perIndex) in fitProjectPerVo.personList">
        <div class="f-between-ali-center">
          <div class="f-between-ali-center line-3-name">
            <div class="icon icon-blue flex-none"></div>
            <span class="f14-c333 ell">{{per.userId +'-'+ per.userName}}</span>
          </div>
          <div class="edit-style flex-none" @click="toEditPerson('edit', per, perIndex)">编辑</div>
        </div>
        <div class="line-4 f12-c999"><span>{{per.startDate | datetime('YYYY/MM/DD')}}</span>-<span>{{(per.endDate === 0 ?  253402185600000 : per.endDate) | datetime('YYYY/MM/DD')}}</span></div>
        <div class="state-con flex justify-between">
          <div class="flex flex-wrap flex-auto">
            <div class="state" v-for="fild in per.fieldList" v-if="fild.selectDesc">{{fild.selectDesc}}</div>
          </div>
          <div class="stars" v-show="per.levelNum == 0 ? false : true">
            <input type="radio"  :value="1"  :class="{'active': per.levelNum > 0}">
            <input type="radio"  :value="2"  :class="{'active': per.levelNum > 1}">
            <input type="radio"  :value="3"  :class="{'active': per.levelNum > 2}">
            <input type="radio"  :value="4"  :class="{'active': per.levelNum > 3}">
            <input type="radio"  :value="5"  :class="{'active': per.levelNum > 4}">
          </div>
        </div>
      </div>
    </div>
    <div v-if="projectPerVo.historyPerList && projectPerVo.historyPerList.length > 0">
      <div class="flex justify-around items-center">
        <div class="hr-line"></div><span class="f12-c999">历史人员</span><div class="hr-line"></div>
      </div>
      <div class="item bb-d7d7d7">
        <div class="line-3" v-for="history in projectPerVo.historyPerList">
          <div class="f-between-ali-center">
            <div class="f-between-ali-center line-3-name">
              <div class="icon icon-pe-grey flex-none"></div>
              <span class="f14-c333 ell">{{history.userId+'-'+history.userName}}</span>
            </div>
            <div class="f12-c999 flex-none"><span>{{history.startDate | datetime('YYYY/MM/DD')}}</span>-<span>{{(history.endDate === 0 ?  253402185600000 : history.endDate) | datetime('YYYY/MM/DD')}}</span></div>
          </div>
          <div class="state-con flex justify-between">
            <div class="flex flex-wrap flex-auto">
              <div class="state state-grey" v-for="fild in history.fieldList" v-if="fild.fieldDesc">{{fild.fieldDesc}}</div>
            </div>
            <div class="stars" v-if="history.levelNum > 0">
                <input type="radio"  :value="1"  :class="{'active-grey': history.levelNum > 0}">
                <input type="radio"  :value="2"  :class="{'active-grey': history.levelNum > 1}">
                <input type="radio"  :value="3"  :class="{'active-grey': history.levelNum > 2}">
                <input type="radio"  :value="4"  :class="{'active-grey': history.levelNum > 3}">
                <input type="radio"  :value="5"  :class="{'active-grey': history.levelNum > 4}">
            </div>
          </div>
        </div>
      </div>
    </div>
  </bm-layout>
</template>

<script>
import {routerHistory} from '@/advanced/mixins'
import { mapGetters } from 'vuex'
import { Toast } from 'mint-ui'

export default {
  mixins: [routerHistory],
  data () {
    return {
      playload: {},
      fitProjectPerVo: {},
      ProjectIndex: 0
    }
  },
  computed: {
    ...mapGetters({
      projectPerVo: 'storeAuthorized/editPost/projectPerVo',
      storeOrgVo: 'storeAuthorized/editDetail/storeOrgVo'
    })
  },
  methods: {
    saveAuthorized () {
      Toast('编制数维护成功')
    },
    changeNumber () {
      let sumPerNum = this.fitProjectPerVo.sumPerNum
      if (sumPerNum.length > 3) {
        this.fitProjectPerVo.sumPerNum = sumPerNum.substr(0, 3)
      }
      this.$store.commit('storeAuthorized/editDetail/updateSumPerNum', {index: this.ProjectIndex, sumPerNum: +this.fitProjectPerVo.sumPerNum})
    },
    fetchStoreOrgVo () {
      const storeId = this.$route.query.storeId
      this.$store.dispatch('storeAuthorized/editDetail/fetchStoreOrgVo', storeId).then(() => {
        this.playload = this.$route.query
        const data = JSON.stringify(this.storeOrgVo)
        if (data !== '{}') {
          this.existStoreOrgVo()
        }
      })
    },
    existStoreOrgVo () {
      this.storeOrgVo['projectList'].forEach((item, index) => {
        if (item.fieldCode === this.playload.fieldCode) {
          this.fitProjectPerVo = item
          this.ProjectIndex = index
        }
      })
    },
    toEditPerson (type, per, perIndex) {
      this.$router.push({path: '/storeAuthorized/editPersonnel', query: {type: type, fieldCode: this.playload.fieldCode, storeId: this.playload.storeId, userId: per.userId, perIndex: perIndex}})
    }
  },
  mounted () {
    this.playload = this.$route.query
    if (!this.isBackPage()) {
      this.$store.dispatch('storeAuthorized/editPost/fetchprojectPerVo', this.playload)
      this.resetPageKey()
    }
    const data = JSON.stringify(this.storeOrgVo)
    if (data !== '{}') {
      this.existStoreOrgVo()
    } else {
      this.fetchStoreOrgVo()
    }
  }
}
</script>
