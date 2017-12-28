<template>
 <div class="no-data">
   <div class="no-data-text">啊哦，这里什么也没有......</div>
   <div class="no-data-img">
     <img src="./img/box@2x.png"/>
   </div>
   <div class="no-data-opera">
     <span class="opera" v-if="reload" @click="reload">刷新试试</span>
   </div>
 </div>
</template>

<style lang="less" scoped>
.no-data {
  position:absolute;
  top:50%;
  margin-top:-1.575rem;
  width:100%;
  text-align: center;
  &-text{
    font-size: 0.16rem;
    color: #cfcfcf;
  }
  &-img{
    margin-top: 0.5rem;
    img{
      width: 1.93rem;
      margin: auto
    }
  }
  &-opera{
    margin-top:0.5rem;
    .opera {
      display: inline-block;
      width: 1.6rem;
      height: 0.4rem;
      line-height: 0.4rem;
      text-align: center;
      font-size: 0.15rem;
      color: #1fb8ff;
      border: 1px solid #1fb8ff;
      border-radius: 0.2rem;
    }
  }
}

</style>

<script>
  /**
   * Created by Wesdint on 2017/9/29.
   */
  export default {
    name: 'bm-empty',
    data () {
      return {}
    },
    props: {
      reload: {
        type: Function,
        default: null
      }
    }
  }
</script>
