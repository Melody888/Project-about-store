<template>
  <bm-layout>
    <bm-header slot="header">负责人详情</bm-header>
    <div class="store360__member__list">
      <p class="title">项目线</p>
      <div class="member">
        <p>项目总经理：{{responsibleVo && responsibleVo.generalManagerName ? responsibleVo.generalManagerName : '无'}}</p>
        <p>项目总监：{{responsibleVo && responsibleVo.inspectorGeneralName ? responsibleVo.inspectorGeneralName : '无'}}</p>
        <p>项目经理：{{responsibleVo && responsibleVo.managerName ? responsibleVo.managerName : '无'}}</p>
      </div>
    </div>
    <div class="store360__member__list">
      <p class="title">业务线</p>
      <div class="member">
        <p>业务经理：{{businessPerVo && businessPerVo.ywJlName ? businessPerVo.ywJlName : '无'}}</p>
        <p>业务主任：{{businessPerVo && businessPerVo.ywZrName ? businessPerVo.ywZrName : '无'}}</p>
        <p>业务代表：{{businessPerVo && businessPerVo.ywDbName ? businessPerVo.ywDbName : '无'}}</p>
      </div>
    </div>
  </bm-layout>
</template>
<style lang="less" scoped>
  .store360__member__list {
    margin-bottom: .1rem;
    padding-left: .1rem;
    background: #fff;
    border-bottom: solid 1px #d7d7d7;
    .member {
      padding: .1rem .1rem .1rem 0;
      line-height: .25rem;
      font-size: .15rem;
      color: #333;
    }
    .title {
      border-bottom: solid 1px #e5e5e5;
      font-size: .14rem;
      color: #999;
      line-height: .44rem;
      font-weight: 600;
    }
    .person {
      &::after {
        content: '，';
      }
      &:last-child::after {
        content: ' ';
      }
    }
  }
</style>
<script>
  import api from '@/api'
  import { mapGetters } from 'vuex'
  export default {
    data () {
      return {
        storeId: '',
        businessPerVo: {}, // 业务线人员实体
        responsibleVo: {} // 负责人实体
      }
    },
    computed: {
      ...mapGetters({
        store: 'store360/store'
      })
    },
    methods: {
      getStoreResponsibleInfo () {
        api.store360.getStoreResponsibleInfo({
          data: {
            storeId: this.store.storeId,
            token: simpleLocalDb.getItem('token')
          }
        }).then(res => {
          if (res.responseCode === 0) {
            this.businessPerVo = res.businessPerVo
            this.responsibleVo = res.responsibleVo
          } else {
            this.$toast(res.responseMsg)
          }
        })
      }
    },
    mounted () {
      this.getStoreResponsibleInfo()
    }
  }
</script>

