<template>
  <bm-layout>
    <bm-header>
      <p>门店编制</p>
      <div class="right" slot="right">添加门店</div>
    </bm-header>
    <ul v-infinite-scroll="loadMore" infinite-scroll-disabled="disabled" infinite-scroll-distance="20">
      <li v-for="(item, index) in storeList" v-bind:key="index">
        <div class="items-top">
          {{item.storeId}} {{item.storeName}}
        </div>
        <div class="items-center">
          <div class=""><span>总编制/已到位(人)：</span>
          <span>{{item.sumPerNum}}</span>/<span>{{item.readyPerNum}}</span>
          </div>
          <div class="edit-btn" @click="toDetail" >编辑/查看</div>
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
      storeList: 'study/storeList',
      loading: 'storeAuthorized/storeList/loading',
      loaded: 'storeAuthorized/storeList/loaded'
    }),
    disabled () {
      return this.loading || this.loaded
    }
    // success () {
    //   return !(this.storeList.length === 0 && this.loaded)
    // }
  },
  methods: {
    toDetail (storeId, index) {
      this.$router.push({ path: '/study/editDetail' })
    },
    loadMore () {
      this.$store.dispatch('study/getstoreList')
    },
    // 调用store的action
    getList () {
      return this.$store.dispatch('study/getstoreList')
    }
  }
}
</script>
<style lang="less" scoped>
  .right {
    margin-right: 10px;
    font-size: 14px;
    text-decoration: underline;
}
li{
  border-bottom: 1px solid #D7D7D7;
  box-shadow: 0 0 0 0 #D7D7D7;
  background: #ffffff;
  margin-bottom:10px;
  height: 84px;
  font-family: PingFangSC-Regular;
  padding: 10px;
  position:relative;
  .items-center{
    font-size: 14px;
    color: #999999;
    margin-top:10px;

  }
  .items-top{
    font-size: 15px;
    color:#333;
    margin-top:5px;
  }
  .edit-btn {
    border-radius: 4px;
    height: 30px;
    width: 70px;
    border: 0.5px solid #999999;
    font-size: 14px;
    color: #666;
    padding:5px 3px 5px 4px;
    position:absolute;
    bottom: 12px;
    right: 10px;

  }
}


</style>

