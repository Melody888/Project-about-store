<template>
  <bm-layout>
    <bm-header>
      <p>编辑编制</p>
      <div class="right" slot="right">保存修改</div>
    </bm-header>
    <ul>
      <li v-for="(item, index) in list" v-bind:key="index">
        <div class="items-text">
        <div class="items-top">
          {{item.Id}} {{item.Name}}
        </div>  
          <div class="items-center">
            <div class=""><span>总编制/已到位(人)：</span> 
            <span>{{item.sumNum}}</span>/<span>{{item.readyNum}}</span>
          </div>   
          </div>
          </div>

          <div class="person-detail">
          <span class="person-name">{{item.person}}</span>
           <span class="edit-btn">
            编辑/查看
           </span> 
           </div>    

            <div class="add-detail">
          <div class=""><span>总编制/已到位(人)：</span> 
            <span>{{item.sumNum}}</span>/<span>{{item.readyNum}}</span>
            <i class="icon icon-add"></i>
            <span class="add-btn">
            添加人员
           </span> 
          </div>  
           </div>
           <div class="item-scroll add-detail">
             <i class="icon icon-people"></i>
            <span class="Num">{{item.personNum}}</span>-<span>{{item.personName}}</span>
            <div class="date"><span>{{ item.startDate | datetime('YYYY/MM/DD')}}</span>-<span>{{ item.endDate | datetime('YYYY/MM/DD')}}</span></div>
             <div class="descript"> 
              <div class="state" v-for="fild in desList"  v-bind:key="fild">{{fild}}
              </div>
              <!-- <div class="stars" v-show="per.levelNum == 0 ? false : true">
              <input type="radio"  :value="1" :class="{'active': per.levelNum > 0}" >
              <input type="radio"  :value="2" :class="{'active': per.levelNum > 1}">
              <input type="radio"  :value="3" :class="{'active': per.levelNum > 2}">
              <input type="radio"  :value="4" :class="{'active': per.levelNum > 3}">
              <input type="radio"  :value="5" :class="{'active': per.levelNum > 4}">
            </div> -->
           </div>
          </div> 
         
           
             
      </li>
    </ul>
  </bm-layout>
</template>
<script>
export default {
  data () {
    return {
      list: [
        { Id: 2510702,
          Name: '苏州好又多',
          sumNum: 10,
          readyNum: 3,
          person: '项目经理',
          personNum: 88888888,
          personName: '陈塔星',
          startDate: '2017/11/17',
          endDate: '2018/11/17'
        }
      ],
      desList: ['本地化', '未培训']
    }
  },
  computed: {},
  methods: {}
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
    display: flex;
    align-items: center;
    justify-content: center;
    margin-top: 0.15rem;
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

