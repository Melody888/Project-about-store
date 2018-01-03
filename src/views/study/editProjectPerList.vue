<template>
  <bm-layout>
      <bm-header slot="header">
          <div class="header">{{fieldDesc}}</div>        
      </bm-header>
      <div slot="header" class="nav-top">
     <span class="ber">编制/</span><span class="per">人</span><input type="number" class="p-num" v-model="localsum"><div class="saveBtn" @click="saveSumPerNum">确认编制数</div>   
      </div>
      <div class="flex justify-around item-line">
          <div class="hr-line"></div><span class="f12">人员名单</span><div class="hr-line"></div>
      </div>
      <div class="no-project-perVo" v-if="nowPerList.length < 1">暂无有效人员</div>
      <ul>
       <li class="item-scroll add-detail nowList" v-for="(Item, Index) in nowPerList">
             <i class="icon icon-people"></i>
            <span class="Num">{{Item.userId}}-{{Item.userName}}</span>
            <span class="edit">
            编辑
           </span> 
            <div class="nowDate"><span>{{ Item.startDate | datetime('YYYY/MM/DD')}}</span>-<span>{{ Item.endDate | datetime('YYYY/MM/DD')}}</span></div>
             <div class="descript"> 
              <div class="state" v-for="state in Item.fieldList" v-if="state.fieldDesc">{{state.fieldDesc}}</div>
              <div class="stars" v-show="Item.levelNum == 0 ? false : true">
              <input type="radio"  :value="1" :class="{'active': Item.levelNum > 0}" >
              <input type="radio"  :value="2" :class="{'active': Item.levelNum > 1}">
              <input type="radio"  :value="3" :class="{'active': Item.levelNum > 2}">
              <input type="radio"  :value="4" :class="{'active': Item.levelNum > 3}">
              <input type="radio"  :value="5" :class="{'active': Item.levelNum > 4}">
            </div>
           </div>
          </li>
          </ul>
          <div>
          <div class="flex justify-around item-line" v-if="historyPerList.length > 0">
          <div class="hr-line"></div><span class="f12" >历史人员</span><div class="hr-line"></div>
          </div>

        <ul>
           <li class="item-scroll add-detail" v-for="(innerItem, innerIndex) in historyPerList">
             <i class="icon icon-people icon-people-grey"></i>
            <div class="Num">{{innerItem.userId}}-{{innerItem.userName}}</div>
            <div class="date"><span>{{ innerItem.startDate | datetime('YYYY/MM/DD')}}</span>-<span>{{ innerItem.endDate | datetime('YYYY/MM/DD')}}</span></div>
             <div class="descript"> 
              <div class="state state-grey" v-for="state in innerItem.fieldList" v-if="state.fieldDesc">{{state.fieldDesc}}</div>
              <div class="stars" v-show="innerItem.levelNum == 0 ? false : true">
              <input type="radio"  :value="1" :class="{'active-grey': innerItem.levelNum > 0}" >
              <input type="radio"  :value="2" :class="{'active-grey': innerItem.levelNum > 1}">
              <input type="radio"  :value="3" :class="{'active-grey': innerItem.levelNum > 2}">
              <input type="radio"  :value="4" :class="{'active-grey': innerItem.levelNum > 3}">
              <input type="radio"  :value="5" :class="{'active-grey': innerItem.levelNum > 4}">
            </div>
           </div>               
              </li>
          </ul>
      </div>  
  </bm-layout>
</template>
<script>
import {mapGetters} from 'vuex'
import { Toast } from 'mint-ui'

export default {
  data () {
    return {
      local: 0
    }
  },
  computed: {
    ...mapGetters({
      projectPerVo: 'study/getprojectPerVo'
    }),
    fieldDesc () {
      return this.projectPerVo ? this.projectPerVo.fieldDesc : ''
    },
    sumPerNum () {
      return this.projectPerVo ? this.projectPerVo.sumPerNum : 0
    },
    nowPerList () {
      return this.projectPerVo ? this.projectPerVo.nowPerList : []
    },
    historyPerList () {
      return this.projectPerVo ? this.projectPerVo.historyPerList : []
    }
  },
  methods: {
    getpersonList () {
      return this.$store.dispatch('study/getPersonList')
    },
    saveSumPerNum () {
      this.$store.commit('study/updateProjecListSumPerNum', {
        code: this.projectPerVo.fieldCode,
        value: this.localsum
      })
      Toast('编制数据维护成功')
    }
  },
  created () {
    this.getpersonList()
    this.localsum = this.$route.query.value
  }
}
</script>
<style lang="less" scoped>
.header {
    display: inline-block;
    max-width: 100%;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
}
.nav-top {
    // height:63px;
    padding: 0.15rem 0.1rem;
    border-bottom: 1px solid #d7d7d7;
    box-shadow: 0 0 0 0 #d7d7d7;
    background: #ffffff;
    .ber {
    font-size: .15rem;
    color: #333333;
}
    .per {
    font-size: 13px;
    color: #999999 ;
}
    .p-num {
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
    .saveBtn {
        display: inline-block;
        float: right;
        height:0.3rem;
        width:0.9rem;
        text-align: center;
        line-height: 0.3rem;
        border:0.5px solid #1FB8FF;
        border-radius: 4px;
        color:#1FB8FF;
        font-size:0.14rem;
    }
}
.item-line {
    margin-left:10px;
  
}
.f12 {
    font-family: PingFangSC-Regular;
    font-size: 0.12rem;
    color: #999999;
    margin:8px 15px 8px 15px;
}
.hr-line{
    width:1.13rem;
    height:1px;
    padding:0px;
    overflow:hidden;
    background-color:#d7d7d7;
    margin:0.14rem 0;
    display: inline-block;
  }
.edit {  
    font-size: 0.14rem;
    color: #0A85CC;
    text-decoration: underline;
    display: block;
    float: right;
  }
.date {
    display: block;
    float: right;
    color:#999;
    font-size:0.12rem;
    }
.nowDate {
    color:#999;
    font-size:0.12rem;
    margin-left:0.18rem; 
}
.item-scroll {
  height:100px;
  border-bottom: 1px solid #d7d7d7;
  box-shadow: 0 0 0 0 #d7d7d7;
  background-color: #ffffff;
  font-family:PingFangSC-Semibold;
  padding:18px 10px;
  font-size: 0.13rem;
  color:#333;
  position: relative;
  .Num {
    width:160px;
    margin-left:0.18rem;
    display: inline-block;
    overflow:hidden;
    text-overflow:ellipsis;
    white-space:nowrap; 
  }  
 }
 .nowList {
   height: 120px;
 }
  .state {
  padding:0.025rem 0.1rem;
  border-radius: 12px;
  color:#1FB8FF;
  border:1px solid #1FB8FF ;
  margin:0.15rem 0.05rem 0rem 0rem;
  display: inline-block;
  margin-top:0.15rem;
  font-size:0.12px;
}
.state-grey {
  color:#999;
  border:1px solid #999 ;
}
.stars{
      display: inline-block;
      float: right;
      margin-top:17px;
    &>input[type=radio]{
      appearance:none;
      width: .12rem;
      height: .12rem;
      margin-left: 0.05rem;
      border: none;
      background: url('../../assets/storeAuthorized/ic_star12_grey.png') no-repeat center center / contain;
      &.active{
        background: url('../../assets/storeAuthorized/ic_star12_yellow.png') no-repeat center center / contain;
      }
      &.active-grey{
        background: url('../../assets/storeAuthorized/ic_star12_darkGrey.png') no-repeat center center / contain;
      }      
    }
  }
  .icon {
    display: inline-block;
    width:0.14rem;
    height:0.14rem;
    background-size: cover;
    &-people {
      height: 0.16rem;
      background:url(../../assets/storeAuthorized/ic_user_blue.png) no-repeat center center;
      background-size:100%;
      position: absolute;
      left:10px;
      top: 18px;    
    }
    &-people-grey{
      background:url(../../assets/storeAuthorized/ic_user_grey.png) no-repeat center center;
      background-size:100%;     
    } 
  }
  .no-project-perVo{
    color:#d7d7d7;
    height:0.44rem;
    line-height: 0.44rem;
    text-align: center;
    font-size: 0.14rem;
    color: #D7D7D7;
  }
</style>


