<template>
  <bm-layout>
    <bm-header slot="header">结案报告</bm-header>
    <div class="page-main bg-fff" v-if="activityInfo.activityResult">
      <div class="report">
        <div class="pl10">
          <div class="report-top flex justify-between bb-e5e5e5">
            <div>
              <span class="f15 color-666">结案总结：</span><span class="f15 color-ff6c47">{{ACTIVITY_RESULT[activityInfo.activityResult]}}</span>
            </div>
            <div class="f12 color-999">
              <span>{{activityInfo.changedTime | datetime('YYYY-MM-DD HH:mm')}}</span>
              <span class="pl10">{{activityInfo.changedByName}}</span>
            </div>
          </div>
        </div>
        <div class="report-bottom">
          <div class="f15 color-333 report-content">
            {{activityInfo.activitySummary}}
          </div>
          <div class="pic flex flex-wrap">
            <img class="pic-list" v-for="item in activityInfo.closeImg" @click="checkPic(item)" :src="item">
          </div>
        </div>
      </div>
    </div>
    <bm-empty :reload="reload" v-if="!activityInfo.activityResult"></bm-empty>
  </bm-layout>

</template>

<style lang="less" scoped>
.pl10{
  padding-left:0.1rem;
}
.page-main{
  position:absolute;
  width:100%;
  height:100%;
  overflow-y: auto;
}
.report{
  &-top{
    padding-right:0.1rem;
    height:0.5rem;
    line-height: 0.5rem;
  }
  &-bottom{
    .report-content{
      padding:0.1rem 0.1rem 0.175rem 0.1rem;
    }
    .pic{
      &-list{
        width:0.6rem;
        height:0.6rem;
        margin:0.1rem;
      }
    }
  }
}
</style>

<script>
  import BmCheckPhoto from '@/components/plugins/BmCheckPhoto'
  import { getCheckPhotoOptions } from '@/utils/dom'
  export default {
    data () {
      return {
        ACTIVITY_RESULT: {
          'excellet': '优',
          'good': '良',
          'poor': '差'
        }
      }
    },
    computed: {
      activityInfo () {
        return this.$store.getters['activityManagement/detail/activityInfo']
      }
    },
    methods: {
      checkPic (pic) { // 图片放大
        BmCheckPhoto(getCheckPhotoOptions(pic, window.document.querySelector('.pic'), '.pic-list'))
      },
      reload () {}
    }
  }
</script>
