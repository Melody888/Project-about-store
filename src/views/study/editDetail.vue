<template>
  <bm-layout>
    <bm-header slot="header">
      <p>编辑编制</p>
      <div class="right" slot="right">保存修改</div>
    </bm-header>
            <div  slot="header" class="items-text">
        <div class="items-top">
          {{storeId}} {{storeName}}
        </div>  
          <div class="items-center">
            <span>总编制/已到位(人)：</span> 
            <span>{{totalSumPerNum}}</span>/<span>{{totalReadyPerNum}}</span>
          </div>   
          </div>
    <ul>
      <li v-for="(item, index) in projectList">
          <div class="person-detail">
          <span class="person-name">{{item.fieldDesc}}</span>
           <span class="edit-btn" @click="toProjectPerList(item.fieldCode,storeId,'edit',item.sumPerNum)">
            编辑/查看
           </span> 
           </div>    

            <div class="add-detail">
          <div class=""><span>总编制/已到位(人)：</span> 
            <span>{{item.sumPerNum}}</span>/<span>{{item.readyPerNum}}</span>
            <i class="icon icon-add"></i>
            <span class="add-btn">
            添加人员
           </span> 
          </div>  
           </div>
           <div class="item-scroll add-detail" v-for="(innerItem, innerIndex) in item.personList">
             <i class="icon icon-people"></i>
            <span class="Num">{{innerItem.userId}}-{{innerItem.userName}}</span>
            <div class="date"><span>{{ innerItem.startDate | datetime('YYYY/MM/DD')}}</span>-<span>{{ innerItem.endDate | datetime('YYYY/MM/DD')}}</span></div>
             <div class="descript"> 
              <div class="state" v-for="state in innerItem.fieldList" v-if="state.selectDesc">{{state.selectDesc}}</div>
              <div class="stars" v-show="innerItem.levelNum == 0 ? false : true">
              <input type="radio"  :value="1" :class="{'active': innerItem.levelNum > 0}" >
              <input type="radio"  :value="2" :class="{'active': innerItem.levelNum > 1}">
              <input type="radio"  :value="3" :class="{'active': innerItem.levelNum > 2}">
              <input type="radio"  :value="4" :class="{'active': innerItem.levelNum > 3}">
              <input type="radio"  :value="5" :class="{'active': innerItem.levelNum > 4}">
            </div>
           </div>
          </div>              
      </li>
    </ul>
  </bm-layout>
</template>
<script>
import {mapGetters} from 'vuex'
export default {
  data () {
    return {}
  },
  computed: {
    ...mapGetters({
      storeId: 'study/getstoreId',
      storeName: 'study/getstoreName',
      totalSumPerNum: 'study/getsumPerNum',
      totalReadyPerNum: 'study/getreadyPerNum',
      projectList: 'study/getprojectList'
    })
    // totalSumPerNum () {
    //   let res = 0
    //   this.projectList.forEach(function (v) {
    //     res += v.sumPerNum
    //   })
    //   return res
    // }
  },
  methods: {
    geteditDetail () {
      // this.$store.commit('study/projectList', null)
      return this.$store.dispatch('study/getprojectList')
    },
    toProjectPerList (fieldCode, storeId, type, value) {
      this.$store.commit('study/fieldCode', fieldCode)
      this.$store.commit('study/storeId', storeId)
      this.$router.push({path: '/study/editProjectPerList', query: {fieldCode: fieldCode, storeId: storeId, type: type, value: value}})
    }
  },
  created () {
    this.geteditDetail()
  }
}
</script>
<style lang="less" scoped>
.right {
  margin-right: 10px;
  font-size: 0.14rem;
  text-decoration: underline;
}

.items-text {
  padding: 0.15rem 0.1rem;
  border-bottom: 1px solid #d7d7d7;
  box-shadow: 0 0 0 0 #d7d7d7;
  background: #ffffff;
  margin-bottom: 10px;
  height: 90px; 
  box-sizing:border-box;
  position: relative;
  .items-center {
  font-size: 0.13rem;
  font-weight:500;
  color: #1FB8FF;
  margin-top: 10px;
  }
  .items-top {
    font-size: 0.15rem;
    color: #333;
    
  } 
}
.person-detail {
  height:66px;
  border-bottom: 1px solid #d7d7d7;
  box-shadow: 0 0 0 0 #d7d7d7;
  background-color: #ffffff;
  font-family:PingFangSC-Semibold;
  padding:18px 10px;
  .person-name {
      font-size:0.15rem;
      color:#333333;
      font-weight: 700;
  }
   .edit-btn {  
    font-size: 0.13rem;
    color: #0A85CC;
    text-decoration: underline;
    display: block;
    float: right;
  }
}

.add-detail {
  height:63px;
  border-bottom: 1px solid #d7d7d7;
  box-shadow: 0 0 0 0 #d7d7d7;
  background-color: #ffffff;
  font-family:PingFangSC-Semibold;
  padding:18px 10px;
  font-size: 0.13rem;
  font-weight:500;
  color: #666;
  position:relative;
  }
 
   .add-btn {  
    font-size: 0.14rem;
    color: #1FB8FF;
    display: inline-block;
    float: right;
    
  }
    .icon {
    display: inline-block;
    width:0.14rem;
    height:0.14rem;
    background-size: cover;
    &-add {
    height: 0.16rem;
    background:url('../../assets/storeAuthorized/ic_add.png')no-repeat center center;
    background-size: 100%;
    position:absolute;
    right: 81px;
    bottom:22px;
    }
    &-people {
      height: 0.16rem;
      background:url(../../assets/storeAuthorized/ic_user_blue.png) no-repeat center center;
      background-size:100%;
      position: absolute;
      left:10px;
      top: 18px;
    
    }
   
  }
    .date {
      display: inline-block;
      float: right;
      color:#999;
      margin-left:0.18rem;
    }

 .item-scroll {
   height:98px;
   border-bottom: 1px solid #d7d7d7;
  box-shadow: 0 0 0 0 #d7d7d7;
  background-color: #ffffff;
  font-family:PingFangSC-Semibold;
  padding:18px 10px;
  font-size: 0.13rem;
  color:#333;
  .Num {
    margin-left:0.18rem;
    display: inline-block;
    overflow:hidden;
    text-overflow:ellipsis;
    white-space:nowrap;  
  }  
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
    }
  }

 

</style>

