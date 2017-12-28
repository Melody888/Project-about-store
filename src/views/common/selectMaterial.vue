<style lang="less" scoped>
  .materal-item {
    padding: .1rem;
    border-bottom: 1px solid #d7d7d7;
    display: flex;
    align-items: center;
    &__img-wrapper {
      flex: none;
      width: .6rem;
      height: .6rem;
    }
    &__img {
      width: 100%;
      height: 100%;
    }
    &__info {
      margin-left: .1rem;
      flex: auto;
      display: flex;
      flex-direction: column;
      justify-content: center;
    }
    &__name {
      font-size: 15px;
      color: #333;
      margin-bottom: .08rem;
    }
    &__scale {
      font-size: 12px;
      color: #999;
    }
    &:active {
      background: #F8F8F8;
    }
  }
</style>

<template>
  <bm-layout>
    <bm-header slot="header">选择物料</bm-header>
    <div>
      <div class="materal-item" v-for="item in list" @click="selectVal(item)">
        <div class="materal-item__img-wrapper">
          <img class="materal-item__img" :src="item.picUrl" alt="" v-if="item.picUrl">
          <bm-empty-pic class="materal-item__img" v-else></bm-empty-pic>
        </div>
        <div class="materal-item__info">
          <div class="materal-item__name">{{item.materielName}}</div>
          <div class="materal-item__scale">规格：{{item.standard}}</div>
        </div>
      </div>
    </div>
  </bm-layout>
</template>

<script>
  import api from '@/api'
  export default {
    props: {
      options: Object
    },
    data () {
      return {
        selectedVal: null,
        keyword: '',
        list: [],
        history: [],
        pageSize: 10,
        pageIndex: 0,
        loading: false,
        loaded: false
      }
    },
    methods: {
      callback () {
        return this.selectedVal
      },
      selectVal (item) {
        this.selectedVal = item
        window.history.go(-1)
      },
      fetchList () {
        this.loading = true
        return api.activity.getMaterielList().then(result => {
          if (result.responseCode === 0) {
            const list = result.materielList
            if (this.pageIndex === 0) {
              this.list = list
            } else {
              this.list = this.list.concat(list)
            }
            this.pageIndex++
            if (list.length < this.pageSize) {
              this.loaded = true
            } else {
              this.loading = false
            }
          } else {
            this.loaded = true
          }
        })
      }
    },
    mounted () {
      console.log(213213)
      this.fetchList()
    }
  }
</script>
