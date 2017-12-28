<template>
  <bm-layout class="report">
    <bm-header slot="header">
      结案报告
      <div slot="right" class="header-right" @click="cancelActivity">
        取消活动
      </div>
    </bm-header>
    <div>
      <div class="report-top flex justify-between items-center f15 color-333 bb-e5e5e5">
        <label class="items-center flex">
          <input type="radio" v-model="activityResult" value="excellet"><span>优</span>
        </label>
        <label class="items-center flex">
          <input type="radio" v-model="activityResult" value="good"><span>良</span>
        </label>
        <label class="items-center flex">
          <input type="radio" v-model="activityResult" value="poor"><span>差</span>
        </label>
      </div>
      <div class="report-content">
        <textarea class="f15 color-333" maxlength="500" placeholder="请填写结案总结，500字以内。" v-model="activitySummary"></textarea>
      </div>
      <div class="report-pic" ref="reportPic">
        <bm-uploaded-img
          v-for="(item, index) in closeImg"
          :key="index"
          @del="delImg"
          @click.native="checkImg(item)"
          show-remove
          class="activity__uploaded-img"
          :src="item"></bm-uploaded-img>
        <bm-img-picker v-if="closeImg.length < 5" source-flag="activity" class="activity__uploaded-img" @pick="addImg" v-model="activitySummary"></bm-img-picker>
      </div>
    </div>
    <div slot="footer" @click="submitReport" class="footer color-fff f15 bg-ff6c47">
      提交
    </div>
  </bm-layout>
</template>

<style lang="less" scoped>
  .header-right{
    text-decoration:underline;
    padding-right:0.1rem;
    text-decoration-color: #fff;
  }
  .report{
    background: #fff;
    &-top{
      height:0.5rem;
      padding:0 0.33rem;
      label{
        input[type='radio']{
          border:none;
          appearance: none;
          display: inline-block;
          width:0.2rem;
          height:0.2rem;
          margin-right:0.05rem;
          background:url('../../assets/activityManagement/circle@2x.png') no-repeat center center / contain;
        }
        input[type='radio']:checked{
          background:url('../../assets/activityManagement/select@2x.png') no-repeat center center / contain;
        }
      }
    }
    &-content{
      textarea{
        border:0;
        outline:none;
        padding:0.1rem;
        height: 1.8rem;
        resize: none;
        width:100%;
        overflow-y:auto;
      }
      ::-webkit-input-placeholder{
        color:#999;
      }
    }
    &-pic{
      overflow:hidden;
      padding-left:0.1rem;
      .activity__uploaded-img{
        float:left;
        margin-right:0.2rem;
        margin-top:0.15rem;
        width:0.6rem;
        height:0.6rem;
      }
    }
  }
  .footer{
    height:0.5rem;
    line-height: 0.5rem;
    text-align: center;
  }
</style>

<script>
  import { getCheckPhotoOptions } from '@/utils/dom'
  import BmCheckPhoto from '@/components/plugins/BmCheckPhoto'
  import api from '@/api'
  import { Toast, MessageBox } from 'mint-ui'
  export default {
    data () {
      return {
        activityResult: '',
        activitySummary: '',
        closeImg: []
      }
    },
    methods: {
      delImg (img) {
        const index = this.closeImg.findIndex(item => img === item)
        if (index > -1) {
          this.closeImg.splice(index, 1)
        }
      },
      checkImg (img) {
        BmCheckPhoto(getCheckPhotoOptions(img, this.$refs.reportPic, '.uploaded-Img__img'))
      },
      addImg (fileList) {
        if (fileList && fileList.length > 0) {
          this.closeImg.push(fileList[0].filePath)
        }
      },
      cancelActivity () {
        api.activity.cancelActivity({
          data: {
            activityCode: this.$route.query.activityCode,
            isClose: true,
            token: simpleLocalDb.getItem('token')
          }
        }).then(result => {
          if (result.responseCode === 0) {
            Toast('活动取消成功')
            this.$router.go(-2)
          } else {
            Toast(result.responseMsg)
          }
        })
      },
      submitReport () {
        MessageBox.confirm('提交后活动将无法修改<br>是否提交？', '', {
          confirmButtonText: '是',
          cancelButtonText: '否'
        }).then(() => {
          if (!this.activityResult) {
            return Toast('请选择结案结果')
          }
          if (!this.activitySummary) {
            return Toast('请填写结案总结')
          }
          api.activity.closeActivity({
            data: {
              activityCode: this.$route.query.activityCode,
              activityResult: this.activityResult,
              activitySummary: this.activitySummary,
              closeImg: this.closeImg,
              token: simpleLocalDb.getItem('token')
            }
          }).then(result => {
            if (result.responseCode === 0) {
              Toast('保存成功')
              this.$router.go(-2)
            } else {
              Toast(result.responseMsg)
            }
          })
        }, () => {})
      }
    }
  }
</script>
