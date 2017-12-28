<template>
  <bm-layout>
    <div slot="header" class="bg-fff">
      <bm-header>项目成员详情</bm-header>
      <div class="store360__member__header flex">
        <p class="flex-auto">项目总监：{{proPerVo && proPerVo.inspectorGeneralName ? proPerVo.inspectorGeneralName : '无'}}</p>
        <p>项目总经理：{{proPerVo && proPerVo.generalManagerName ? proPerVo.generalManagerName : '无'}}</p>
      </div>
      <div class="seperate"><div></div></div>
      <div class="store360__member__header flex">
        <p>项目经理</p>
        <p class="flex-auto center title">{{proPerVo && proPerVo.managerName ? proPerVo.managerName : '无'}}</p>
        <p :class="['store360__member__phone', {'hidePhone': !proPerVo || !proPerVo.managerTel}]" @click="phone(proPerVo.managerTel)"></p>
      </div>
      <div class="store360__member__bar flex" v-if="proPerVo && proPerVo.proPerList && proPerVo.proPerList.length">
        <p class="flex-auto">项目成员</p>
        <p v-if="proPerVo && proPerVo.proPerNum">共{{proPerVo.proPerNum}}人</p>
      </div>
    </div>
    <ul class="store360__member__list">
      <li class="item flex" v-for="item in proPerVo.proPerList">
        <p class="name flex-auto">{{item.userName}}<span class="job">{{item.userId}}  {{item.post}}</span></p>
        <p class="store360__member__phone" v-if="item.tel" @click="phone(item.tel)"></p>
      </li>
    </ul>
  </bm-layout>
</template>
<style lang="less" scoped>
  .store360__member__header {
    padding: 0 .1rem;
    background: #fff;
    line-height: .44rem;
    font-size: .14rem;
    color: #666;
    .title {
      font-size: .16rem;
      color: #333;
    }
  }
  .store360__member__bar {
    border-top: 1px solid #d7d7d7;
    background-color: #f1f1f1;
    padding: 0 .1rem;
    line-height: .33rem;
    font-size: .12rem;
    color: #999;
  }
  .store360__member__list {
    padding-left: .1rem;
    background: #fff;
    border-bottom: solid 1px #d7d7d7;
    font-size: .12rem;
    color: #999;
    .item {
      padding: .15rem .1rem .15rem 0;
      border-bottom: solid 1px #e5e5e5;
      &:last-child {
        border: none;
      }
    }
    .name {
      font-size: .14rem;
      color: #333333;
    }
    .job { font-size: .12rem; color: #999; margin-left: .05rem; }
  }
  .store360__member__phone {
    padding-right: .23rem;
    background: url('~@/assets/store360/callOut@2x.png') no-repeat right center / .18rem .18rem;
    color: #1fb8ff;
    font-size: .12rem;
    line-height: .18rem;
    visibility: visible;
    &.hidePhone {
      visibility: hidden;
    }
  }
  .seperate {
    height: 1px;
    width: 100%;
    transform: scaleY(0.5);
    div {
      height: 100%;
      margin: 0 .10rem;
      background-color: #d7d7d7;
    }
  }
</style>
<script>
  import api from '@/api'
  import { mapGetters } from 'vuex'
  export default {
    data () {
      return {
        proPerVo: {}
      }
    },
    computed: {
      ...mapGetters({
        store: 'store360/store'
      })
    },
    methods: {
      getStoreProPerList () {
        api.store360.getStoreProPerList({
          data: {
            storeId: this.store.storeId,
            token: simpleLocalDb.getItem('token')
          }
        }).then(res => {
          if (res.responseCode === 0) {
            this.proPerVo = res.proPerVo
          } else {
            this.$toast(res.responseMsg)
          }
        })
      },
      phone (phone) {
        window.location.href = 'tel:' + phone
      }
    },
    mounted () {
      this.getStoreProPerList()
    }
  }
</script>
