<style lang="less" scoped>
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
  .mb10{margin-bottom:0.1rem;}
  .mb15{
    margin-bottom: 0.15rem;
  }
  .mt15{
    margin-top:0.15rem;
  }
  .b-bot{
    border-bottom:1px solid #d7d7d7;
  }
  .b-ce5e{
    border-bottom:1px solid #e5e5e5;
  }
  .right{
    margin-right: 0.1rem;
    text-decoration: underline;
  }
  .nav-top{
    padding: 0.15rem 0.1rem;
    background-color: white;
    .b-bot;
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
  .item{
    background-color: white;
    margin-top:0.1rem;
    .b-bot;
    .edit-style{
      text-decoration: underline;
    }
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
    margin-left: 0.1rem;
    &:last-child{
      border-bottom: none;
    }
    .state-con{
    }
    .state{
      padding:0.025rem 0.1rem;
      border-radius: 12px;
      color:#1fb8ff;
      border:1px solid #1fb8ff;
      margin: 0.15rem 0.05rem 0rem 0;
    }
    .start-con{
      width:0.85rem;
      display:flex;
      margin-top:0.1rem;
    }
    &-name{
      overflow:hidden;
      margin-right:0.1rem;
     }
  }
  .noborder{
    border: none;
  }
  .ell{
    overflow:hidden;
    text-overflow:ellipsis;
    white-space:nowrap;
  }
  .w{
    width: 2.3rem;
  }
</style>


<template>
  <bm-layout>
    <bm-header
    slot="header">
      <div class="f18">编辑编制</div>
      <div class="right f14" slot="right" @click="saveEdit">
        保存修改
      </div>
    </bm-header>
    <div slot="header" class="nav-top" v-if="storeOrgVo.storeName">
      <div class="f15-c333 mb10">{{storeOrgVo.storeId + '   ' + storeOrgVo.storeName}}</div>
      <div class="f12-c1FB">
        <span>总编制/已到位&nbsp;(人):&nbsp;</span>
        <span>{{totalSumPerNum}}/{{totalReadyPerNum}}</span>
      </div>
    </div>
    <div>
      <div class="item" v-for="pro in storeOrgVo.projectList">
        <div class="line-1" :key="pro.fieldCode">
          <div class="f15-c333 bold w">{{pro.fieldDesc}}</div>
          <div class="f13-c0A8 edit-style" @click="toEditPost('edit', pro.fieldCode, storeOrgVo.storeId)"><span>编辑</span>/<span>查看</span></div>
        </div>
        <div class="line-2" :class="pro.personList.length == 0 ? 'noborder' : ''">
          <div class="f12-c666" >
            <span>总编制/已到位&nbsp;(人):&nbsp;</span><span>{{pro.sumPerNum + '/' + pro.personList.length}}</span>
          </div>
          <div class="f14-c1fb f-between-ali-center"><i class="icon icon-add"></i><span @click="toAdd(pro.fieldCode, storeOrgVo.storeId)">添加人员</span></div>
        </div>
        <div class="line-3" v-for="per in pro.personList">
          <div class="f-between-ali-center">
            <div class="f-between-ali-center line-3-name"><div class="icon icon-blue flex-none"></div><span class="f14-c333 ell">{{per.userId + '-' + per.userName}}</span></div>
            <div class="f12-c999 flex-none"><span>{{per.startDate | datetime('YYYY/MM/DD')}}</span>-<span>{{(per.endDate === 0 ?  253402185600000 : per.endDate) | datetime('YYYY/MM/DD')}}</span></div>
          </div>
          <div class="state-con flex justify-between" >
            <div class="flex flex-wrap flex-auto">
              <div class="state" v-for="fild in per.fieldList" v-if="fild.selectDesc">{{fild.selectDesc}}</div>
            </div>
            <div class="stars" v-show="per.levelNum == 0 ? false : true">
              <input type="radio"  :value="1" :class="{'active': per.levelNum > 0}" >
              <input type="radio"  :value="2" :class="{'active': per.levelNum > 1}">
              <input type="radio"  :value="3" :class="{'active': per.levelNum > 2}">
              <input type="radio"  :value="4" :class="{'active': per.levelNum > 3}">
              <input type="radio"  :value="5" :class="{'active': per.levelNum > 4}">
            </div>
          </div>
        </div>
      </div>
    </div>
  </bm-layout>
</template>

<script>
import { mapGetters } from 'vuex'
import {routerHistory} from '@/advanced/mixins'
import BmSelectPage from '@/components/plugins/BmSelectPage'
import selectPerson from '@/views/common/selectPerson'

export default {
  mixins: [routerHistory],
  data () {
    return {
      storeId: '',
      routeLeave: true
    }
  },
  computed: {
    ...mapGetters({
      storeOrgVo: 'storeAuthorized/editDetail/storeOrgVo',
      storeList: 'storeAuthorized/storeList/storeList'
    }),
    totalReadyPerNum () { // 总到位人数
      if (this.storeOrgVo.projectList && this.storeOrgVo.projectList.length > 0) {
        let num = 0
        this.storeOrgVo.projectList.forEach((item) => {
          num += item.personList.length
        })
        return num
      } else {
        return 0
      }
    },
    totalSumPerNum () { // 总编制人数
      if (this.storeOrgVo.projectList && this.storeOrgVo.projectList.length > 0) {
        let num = 0
        this.storeOrgVo.projectList.forEach((item) => {
          num += +item.sumPerNum
        })
        return num
      } else {
        return 0
      }
    }
  },
  components: {
    selectPerson
  },
  beforeRouteLeave (to, from, next) {
    if (to.path === '/storeAuthorized' && this.routeLeave) {
      this.$messagebox.confirm('确定离开当前编辑页面？', {
        confirmButtonText: '确 定',
        cancelButtonText: '取 消',
        cancelButtonClass: 'cancel-confirm-btn'
      }).then(() => {
        next()
      }, () => {
        this.$router.go(1)
      })
    } else {
      next()
    }
  },
  methods: {
    saveEdit () { // 保存数据
      this.$store.dispatch('storeAuthorized/editDetail/fetchSaveVO').then((flag) => {
        if (!flag) return
        this.routeLeave = false
        if (this.$route.query.type === 'add') { // 添加门店
          this.$store.dispatch('storeAuthorized/storeList/resetData')
        } else { // 编辑门店
          const num = this.$route.query.num
          this.storeList[num].readyPerNum = this.totalReadyPerNum
          this.storeList[num].sumPerNum = this.totalSumPerNum
        }
        this.$router.go(-1)
      })
    },
    toEditPost (type, fieldCode, storeId) {
      this.$router.push({path: '/storeAuthorized/editPost', query: {fieldCode: fieldCode, storeId: storeId, type: type}})
    },
    toAdd (filedCode, storeId) {
      BmSelectPage({
        component: selectPerson
      }).then(data => {
        if (!data) return
        this.$router.push(`/storeAuthorized/editPersonnel?type=add&userId=${data.userId}&fieldCode=${filedCode}&storeId=${storeId}`)
      }, error => {
        console.log(error)
      })
    }
  },
  mounted () {
    if (!this.isBackPage()) {
      const sId = this.$route.query.storeId
      this.$store.dispatch('storeAuthorized/editDetail/fetchStoreOrgVo', sId)
      this.resetPageKey()
    }
  }
}
</script>
