<style lang="less" scoped>
  .record-form {
    padding: .1rem .1rem .15rem .1rem;
    background: #fff;
    border-bottom: 1px solid #d7d7d7;
    &__text {
      width: 100%;
      font-size: 0;
      textarea {
        width: 100%;
        border: 1px solid #D7D7D7;
        border-radius: .04rem;
        padding: .07rem .1rem;
        height: .6rem;
        font-size: .14rem;
        resize: none;
        background: #FBFBFB;
      }
    }
    &__photo {
      width: .4rem !important;
      height: .4rem !important;
      float: left;
      margin-right: .18rem;
      margin-top: .11rem;
    }
  }
  .btn-submit {
    margin: 0 auto;
    width: 100%;
    margin-top: .15rem;
    background: #FF6C47;
    border-radius: 4px;
    font-size: 15px;
    color: #FFFFFF;
    letter-spacing: 0;
    line-height: .4rem;
    height: .4rem;
    text-align: center;
  }
  .record-list {
    margin-top: .16rem;
    background: #fff;
    border-bottom: 1px solid #d7d7d7;
  }
  .record-item {
    padding: .15rem .1rem;
    padding-left: 0;
    margin-left: .1rem;
    border-bottom: 1px solid #d7d7d7;
    &:last-of-type {
      border-bottom: none;
    }
    &__top {
      font-size: .12rem;
      color: #999999;
    }
    &__content {
      margin-top: .1rem;
      font-size: .14rem;
      color: #333333
    }
    &__pics {
      overflow: hidden;
    }
    &__pic {
      width: .4rem !important;
      height: .4rem !important;
      float: left;
      margin-right: .1rem;
      margin-top: .1rem;
    }
  }
</style>

<template>
  <bm-layout>
    <bm-header slot="header">执行记录</bm-header>
    <bm-loadmore :topMethod="loadList" ref="loadList" >
      <div
        v-infinite-scroll="loadMore"
        infinite-scroll-disabled="loading"
        infinite-scroll-distance="20">
        <div class="record-form">
          <div class="record-form__text">
            <textarea placeholder="请填写执行记录，200字以内。" v-model="content"></textarea>
          </div>
          <div class="overflow-hidden">
            <bm-uploaded-img
              v-for="(item, index) in implementImg"
              :key="index"
              @del="delPhoto"
              @click.native="checkPhoto(item)"
              class="record-form__photo"
              show-remove
              :src="item"></bm-uploaded-img>
            <bm-img-picker class="record-form__photo" v-if="implementImg.length < 5" source-flag="activity" @pick="addPhoto"></bm-img-picker>
          </div>
          <div class="btn-submit" @click="addRecord">提交执行记录</div>
        </div>

        <div class="record-list" v-show="recordList.length">

          <div class="record-item" v-for="item in recordList">
            <div class="record-item__top">{{item.changedTime | datetime('YYYY-MM-DD HH:mm')}} {{item.changedByName}}</div>
            <div class="record-item__content" v-if="item.activityImplement">{{item.activityImplement}}</div>
            <div class="record-item__pics" ref="recordPics">
              <bm-uploaded-img
                v-for="(pic, index) in item.implementImg"
                :key="index"
                @click.native="checkPhoto(pic, $refs.recordPics[index])"
                class="record-item__pic"
                :src="pic"></bm-uploaded-img>
            </div>
          </div>

        </div>
      </div>
    </bm-loadmore>

  </bm-layout>
</template>

<script>
  import api from '@/api'
  import { Toast } from 'mint-ui'
  import BmCheckPhoto from '@/components/plugins/BmCheckPhoto'
  import { getCheckPhotoOptions } from '@/utils/dom'
  export default {
    data () {
      return {
        activityCode: '',
        content: '',
        implementImg: [],
        recordList: [],
        loading: false,
        loaded: false,
        pageIndex: 1,
        pageSize: 10,
        total: 0,
        submiting: false
      }
    },
    methods: {
      addRecord () {
        if (this.submiting) return
        if (!this.content && this.implementImg.length === 0) {
          return Toast('必须填写文字或上传一张照片才能提交')
        }
        this.submiting = true
        return api.activity.addImplementRecord({
          data: {
            activityCode: this.activityCode,
            activityImplement: this.content,
            implementImg: this.implementImg,
            token: simpleLocalDb.getItem('token')
          }
        }).then(result => {
          this.submiting = false
          if (result.responseCode === 0) {
            // this.reload()
            this.$router.go(-1)
            Toast('执行记录添加成功')
          } else {
            Toast(result.responseMsg)
          }
        })
      },
      addPhoto (fileList) {
        if (fileList && fileList.length > 0) {
          this.implementImg.push(fileList[0].filePath)
        }
      },
      checkPhoto (img, container) {
        BmCheckPhoto(getCheckPhotoOptions(img, container, '.uploaded-Img__img'))
      },
      delPhoto (img) {
        const photos = this.implementImg
        const index = photos.findIndex(item => img === item)
        if (index > -1) {
          photos.splice(index, 1)
        }
      },
      fetchList () {
        const pageIndex = this.pageIndex
        this.loading = true
        return api.activity.getImplementRecordList({
          data: {
            activityCode: this.activityCode,
            pageIndex: this.pageIndex,
            pageSize: this.pageSize,
            token: simpleLocalDb.getItem('token')
          }
        }).then(result => {
          if (result.responseCode === 0) {
            const pl = result.recordList
            if (pageIndex === 0) {
              this.recordList = pl
            } else {
              this.recordList = this.recordList.concat(pl)
            }
            this.total = result.total
            this.pageIndex++
            if (this.recordList.length >= this.total) {  // 认为已经全部加载
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
      },
      reload () {
        this.resetStatusData()
      },
      loadList () {
        this.resetStatusData()
        this.fetchList().then(() => {
          const ll = this.$refs.loadList
          if (ll) {
            ll.onTopLoaded()
          }
        })
      },
      resetStatusData () {
        this.loading = false
        this.loaded = false
        this.total = 0
        this.pageIndex = 0
      },
      resetData () {
        this.recordList = []
        this.resetStatusData()
      }
    },
    created () {
      this.activityCode = this.$route.query.activityCode
    }
  }
</script>
