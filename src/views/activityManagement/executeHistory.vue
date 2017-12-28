<template>
  <bm-layout>
    <bm-header slot="header">执行历史</bm-header>
    <div class="bg-fff" v-if="success">
      <ul class="pl10 bb-e5e5e5"
        v-infinite-scroll="loadMore"
        infinite-scroll-disabled="loading"
        infinite-scroll-distance="20">
        <li class="item bb-e5e5e5" v-for="(list, index) in recordList">
          <div class="color-999 f12" :class="{pb5:!list.activityImplement}">
            <span>{{list.changedTime | datetime('YYYY/MM/DD HH:mm')}}</span>
            <span>{{list.changedByName}}</span>
          </div>
          <div class="f14 color-333 item-content" v-if="list.activityImplement" :class="{pb10:list.implementImg && list.implementImg.length< 1}">{{list.activityImplement}}</div>
          <div class="item-pic flex flex-wrap" :id="`item-pic-${index}`" v-if="list.implementImg && list.implementImg.length>0">
            <img :src="img" v-for="img in list.implementImg" @click="checkPic(img, `#item-pic-${index}`)" class="item-pic-list">
          </div>
        </li>
      </ul>
    </div>
    <bm-empty :reload="reload" v-if="!success"></bm-empty>
  </bm-layout>
</template>

<style lang="less" scoped>
.pl10{
  padding-left:0.1rem;
}
.pb10{
  padding-bottom: 0.1rem;
}
.pb5{
  padding-bottom:0.05rem;
}
.item{
  padding-top:0.15rem;
  padding-bottom:0.1rem;
  &-content{
    padding-top:0.1rem;
    padding-right:0.1rem;
    padding-bottom:0.05rem;
  }
  &-pic{
     margin:0 -0.05rem;
     padding-right:0.1rem;
     &-list{
       width:0.4rem;
       margin:0.05rem;
       height:0.4rem;
    }
  }
}
.item:last-child{
  border-bottom:none;
}
</style>

<script>
  import BmCheckPhoto from '@/components/plugins/BmCheckPhoto'
  import { getCheckPhotoOptions } from '@/utils/dom'
  import api from '@/api'
  import { Toast, Indicator } from 'mint-ui'

  export default {
    data () {
      return {
        activityCode: '',
        recordList: [],
        pageIndex: 1,
        loading: false,
        loaded: false
      }
    },
    computed: {
      success () {
        return !(this.recordList.length === 0 && this.loaded)
      }
    },
    methods: {
      loadMore () {
        this.fetchList()
      },
      fetchList () {
        const pageSize = 20
        const recordList = this.recordList
        const pageIndex = this.pageIndex
        Indicator.open()
        this.loading = true
        return api.activity.getImplementRecordList({
          data: {
            pageIndex,
            pageSize,
            activityCode: this.activityCode,
            token: simpleLocalDb.getItem('token')
          }
        }).then(result => {
          Indicator.close()
          if (result.responseCode === 0) {
            const pl = result.recordList
            if (pageIndex === 1) {
              this.recordList = pl
            } else {
              this.recordList = recordList.concat(pl)
            }
            this.pageIndex = this.pageIndex + 1
            if (pl.length < pageSize) {
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
      checkPic (pic, selector) { // 图片放大
        BmCheckPhoto(getCheckPhotoOptions(pic, window.document.querySelector(selector), '.item-pic-list'))
      },
      reload () {
        this.fetchList()
      }
    },
    created () {
      this.activityCode = this.$route.params['activityCode']
    }
  }
</script>
