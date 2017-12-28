
<style lang="less" scoped>
  .b-bot {
    border-bottom: 1px solid #e5e5e5;
  }

  .search {
    padding: 0.1rem 0rem .1rem .1rem;
  }

  .no-data{
    position:absolute;
    top:50%;
    margin-top:-0.1rem;
    color: #999999;
    font-size: 0.16rem;
    width:100%;
    text-align: center;
  }

  .footer {
    background: #FF6C47;
    width: 100%;
    height: 0.5rem;
    color: white;
    text-align: center;
    line-height: 0.5rem;
    font-size: 0.15rem;
    &-disable {
      background: #D7D7D7;
    }
  }

  .list{
    margin: .1rem 0;
    background-color:#fff;
    .item{
      border-bottom: 1px solid #e5e5e5;
      margin-left: .1rem;
      height:0.45rem;
      &:last-child{
        border-bottom:1px solid #d7d7d7;
        margin-left:0;
        padding-left:.1rem;
       }
      .icon {
        background: url('../../assets/storeAuthorized/radio_normal@2x.png') no-repeat center center;
        background-size: 100% 100%;
        margin-right: 0.05rem;
        &:checked {
           background-image: url('../../assets/storeAuthorized/radio_selected@2x.png');
        }
        &:disabled {
          background-image: url('../../assets/storeAuthorized/radio_disable@2x.png');
        }
      }
    }
    .disable-item {
      color: #999!important;
    }
  }
</style>

<template>
  <bm-layout style="background: #f2f2f2;">
    <div slot="header">
      <bm-header :backAction="goBack">添加人员</bm-header>
      <div class="b-bot">
        <bm-search
          class="search"
          placeholder="输入人员编码或姓名搜索"
          v-model="keyword"
          @doSubmit="doSubmit">
        </bm-search>
      </div>
    </div>
    <div class="list" v-if="success"
      v-infinite-scroll="loadMore"
      infinite-scroll-disabled="loading"
      infinite-scroll-distance="40"
      infinite-scroll-immediate-check="false">
      <label class="item flex items-center f15 color-333" :class="{'disable-item': disabled(item)}"  v-for="item in list">
        <input type="radio" class="bm-radio icon" :disabled="disabled(item)" :value="item" v-model="selectedVal" /><span>{{item.userId}}-{{item.userName}}</span>
      </label>
    </div>
    <div v-if="!success && !isSearch" class="no-data">没有符合条件的结果</div>
    <div class="footer f15" slot="footer" :class="{'footer-disable': !selectedVal}" @click="selectVal">
      下一步
    </div>
  </bm-layout>
</template>

<script>
  import api from '@/api'
  import { Toast, Indicator } from 'mint-ui'
  export default {
    props: {
      options: Object
    },
    data () {
      return {
        selectedVal: null,
        list: [],
        keyword: '',
        pageSize: 10,
        pageIndex: 0,
        loading: false,
        loaded: false,
        isSearch: false
      }
    },
    computed: {
      disabledList () {
        if (!this.options) return []
        return this.options.disabledList || []
      },
      success () {
        return !(this.list.length === 0 && this.loaded)
      }
    },
    methods: {
      goBack () {
        this.selectedVal = null
        this.$router.go(-1)
      },
      disabled (item) {
        return this.disabledList.indexOf(item.userId) > -1
      },
      doSubmit (val) {
        this.pageIndex = 0
        this.loading = false
        this.list = []
        this.$nextTick(() => {
          this.fetchList()
        })
      },
      callback () {
        return this.selectedVal
      },
      selectVal () {
        window.history.go(-1)
      },
      fetchList () {
        if (this.loading || this.isSearch) return
        this.loading = true
        this.isSearch = true
        Indicator.open()
        return api.storeAu.getPersonListByParams({
          data: {
            token: simpleLocalDb.getItem('token'),
            pageSize: this.pageSize,
            pageIndex: this.pageIndex,
            keyword: this.keyword
          }
        }).then(result => {
          Indicator.close()
          this.isSearch = false
          if (result.responseCode === 0) {
            const list = result.personList
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
            Toast(result.responseMsg)
          }
        })
      },
      loadMore () {
        this.fetchList()
      }
    }
  }
</script>
