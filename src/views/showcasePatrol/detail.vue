<!-- TODO 陈列数据部分的数组没做上限阈值 -->
<template>
  <bm-layout ref="layout">
    <bm-header slot="header" class="f18">{{title}}</bm-header>
    <div slot="top">
      <div class="m_header" v-if="inspectInfo['orderNo']">
        <p class="f15">{{inspectInfo['orderNo']}} {{inspectInfo['storeName']}}</p>
        <p class="f12 mt10">创建：{{inspectInfo['planDate'] | datetime('date')}} {{inspectInfo['createByName']}}</p>
        <div class="flex flex-row mt10 f12">
          <p>陈列数：{{inspectInfo['inspectTotalNum']}}</p>
          <p>总排面(㎡)：{{inspectInfo['inspectArea']}}</p>
        </div>
      </div>
    </div>
    <ul class="list-wrapper" v-scrolled="'showcasePatrolDetail'">
      <li v-for="item in inspectInfo['inspectConfList']" class="list-item mt10">
        <div class="flex flex-row">
          <div class="flex title flex-auto">
            <span class="m_wrap">{{item['inspectTypeDesc']}}</span>
            <div class="flex-s0"><span class="sell" v-if="item['isPointSale']">主售点</span></div>
          </div>
          <p class="status">状态：{{item['inspectStatus'] === 'normal' ? '正常' : '异常'}}</p>
        </div>
        <div class="flex mt15">
          <span class="key">数量/个：<span class="value">{{item['inspectNum']}}</span></span>
          <span class="key">覆盖人流/10分钟：<span class="value">{{item['personFlow']}}</span></span>
        </div>
        <div class="flex mt12">
          <span class="key">排面/㎡：<span class="value">{{item['area']}}</span></span>
          <span class="key">纵深/m：<span class="value">{{item['depth']}}</span></span>
        </div>
        <p class="mt15 m_wrap" v-if="item['inspectExplain']">{{item['inspectExplain']}}</p>
        <div class="img-area">
          <img v-for="(path, index) in item['fileList']" :src="path['filePath']" alt="" @click="showImg(item['fileList'],index)">
        </div>
      </li>
      <li class="mt10 evaluate" v-if="inspectInfo['evaluateList'] && inspectInfo['evaluateList'].length > 0">
        <div class="e_header">评价信息</div>
        <ul class="e_body">
          <li class="flex flex-row item" v-for="item in inspectInfo['evaluateList']">
            <div class="info">
              <div class="flex flex-row">
                <p>{{item['changedTime'] | datetime('YYYY/MM/DD HH:mm:ss')}} {{item['evaluateType'] === 'reply' ? '回复' : '评价'}}</p>
                <span :class="['u_name',{'m_color_black':checkUser(item.changedBy)}]">{{item['changedByName']}}</span>
              </div>
              <p class="comment">{{item['evaluateContent']}}</p>
              <p v-if="item['actionNum']">{{item['actionType'] === 'praise' ? '赞' : '踩'}} ({{item['actionNum']}})</p>
            </div>
            <a class="call-icon" v-if="!checkUser(item.changedBy)" :href="`tel:${item['tel']}`"></a>
          </li>
        </ul>
      </li>
    </ul>
    <div slot="bottom">
      <div class="m_bottom" v-if="showCommentIcon && !isHideComment" @click="showCommentInput">评价</div>
    </div>
    <div class="footer" slot="footer" v-if="showCommentArea">
      <label class="textarea-label">
        <textarea class="textarea" v-model="comment" placeholder="请填写评价内容，200字以内" maxlength="200"></textarea>
      </label>
      <div class="flex flex-row">
        <div class="icon-area flex flex-row flex-auto">
          <div :class="['action','flex','flex-row','flex-auto','downImg',{'isFocus':isDown}]" v-fastclick @click="toggleActionType('tread')">{{downText}}</div>
          <div :class="['action','flex','flex-row','flex-auto','upImg',{'isFocus':isUp}]" v-fastclick @click="toggleActionType('praise')">{{upText}}</span>
          </div>
        </div>
        <div class="submit-btn" @click="submitComment">提交评价</div>
      </div>
    </div>
    <mt-popup slot="left" v-model="isShowBigImg" popup-transition="popup-fade">
      <img class="bigImg" ref="bigImg" :src="bigImgPath" alt="" @click="hideBigImg">
    </mt-popup>
  </bm-layout>
</template>

<script>
  // import Vue from 'vue'
  import api from '@/api'
  export default {
    data () {
      return {
        showCommentIcon: 0,
        showCommentArea: 0,
        comment: '',
        commentActionType: '',
        commentActionNum: 0,
        inspectInfo: {},
        isShowBigImg: false,
        bigImgPath: '',
        isHideComment: false
      }
    },
    computed: {
      title () {
        return this.$route.query && this.$route.query.comment ? '评价' : '陈列巡检详情'
      },
      isDown () { return this.commentActionType === 'tread' },
      isUp () { return this.commentActionType === 'praise' },
      downText () {
        let text = '踩'
        if (this.isDown && this.commentActionNum > 0) {
          text += ` (${this.commentActionNum})`
        }
        return text
      },
      upText () {
        let text = '赞'
        if (this.isUp && this.commentActionNum > 0) {
          text += ` (${this.commentActionNum})`
        }
        return text
      }
    },
    methods: {
      // 获取陈列详情页数据
      getInspectInfo () {
        api.showcasePatrol.getInspectInfoByOrderNo({
          data: {
            orderNo: this.$route.params.id,
            token: simpleLocalDb.getItem('token')
          }
        }).then(result => {
          if (result.responseCode === 0) {
            this.inspectInfo = result.inspectVo
            this.initDoit()
          }
        })
      },
      // 初始化设置
      initDoit () {
        let isUser = this.checkUser(this.inspectInfo.createBy)
        let createBy = this.inspectInfo.createBy
        let loginUserId = this.inspectInfo.loginUserId
        if (this.$route.query && this.$route.query.comment) {
          this.showCommentArea = 1
          return
        }
        if (createBy && loginUserId && this.inspectInfo.evaluateOrNot && !isUser) this.showCommentIcon = 1
      },
      // 识别用户身份
      checkUser (id) {
        return id === this.inspectInfo.loginUserId
      },
      // 显示评价输入框
      showCommentInput () {
        this.showCommentIcon = 0
        this.showCommentArea = 1
        // 以下代码解决评论框出现后，列表无法直接向下滚动，只能先向上滚动一点再向下滚动的bug
        // let mainRef = this.$refs.layout.$refs.main
        // let { scrollHeight, scrollTop, offsetHeight } = mainRef
        // if (scrollHeight <= (scrollTop + offsetHeight)) {
        //   // setTimeout(() => mainRef.scrollTo(0, scrollHeight), 200)
        //   Vue.nextTick(() => mainRef.scrollTo(0, scrollHeight))
        // }
      },
      // 切换[赞／踩]状态
      toggleActionType (status) {
        if (this.commentActionType !== status) {
          this.commentActionType = status
          this.commentActionNum = 1
        } else if (this.commentActionNum < 5) {
          this.commentActionNum++
        }
      },
      // 提交评价
      submitComment () {
        if (this.commentActionType === '' && this.comment.toString().trim() === '') {
          return this.$toast('请填写评价')
        }
        this.$messagebox.confirm('是否确认提交？').then(async () => {
          let res = await api.showcasePatrol.saveEvaluateInfo({
            data: {
              orderNo: this.$route.params.id,
              actionNum: this.commentActionNum,
              actionType: this.commentActionType,
              evaluateType: 'evaluate',
              evaluateContent: this.comment,
              token: simpleLocalDb.getItem('token')
            }
          })
          if (res.responseCode === 0) {
            // TODO 刷新陈列巡检列表
            this.$store.dispatch('showcasePatrol/indexGetList', this.$store.state['showcasePatrol']['indexKeyword'] || '')
            this.$router.back()
          } else {
            this.$toast(res.responseMsg)
          }
        })
      },
      showImg (list, index) {
        this.isShowBigImg = true
        this.bigImgPath = list[index]['filePath']
      },
      hideBigImg () {
        this.isShowBigImg = false
      }
    },
    beforeMount () {
      this.getInspectInfo()
      if (this.$route.query.isHideComment) this.isHideComment = this.$route.query.isHideComment
    }
  }
</script>

<style lang="less" scoped>
  .mt10 { margin-top: .10rem; }
  .mt15 { margin-top: .15rem; }
  .mt12 { margin-top: .12rem; }
  .m_color_black { color: #000 !important; }
  .m_header {
    background: #fff;
    padding: .12rem .1rem .15rem .1rem;
    box-shadow: 0 0.5px 0 0 #d7d7d7;
    margin-bottom: .01rem;
  }
  .m_wrap {
    word-wrap: break-word;
    word-break: break-word;
  }
  .flex {
    display: flex;
    &-row {
      flex-direction: row;
      justify-content: space-between;
    }
    &-s0 { flex-shrink: 0; }
    .key {
      flex: 1;
      font-size: .13rem;
      color: #666;
    }
    .value {
      font-size: .14rem;
      color: #333;
    }
  }
  .list-wrapper {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    overflow: hidden;
    overflow-y: auto;
    padding-bottom: .10rem;
  }
  .list-item {
    background: #fff;
    padding: .14rem .10rem .105rem .10rem;
    box-shadow: 0 0.5px 0 0 #e5e5e5;
    .title {
      font-size: .18rem;
      line-height: .14rem;
      font-family: PingFangSC-Semibold;
      color: #333;
      &>span {
        line-height: .18rem;
        font-weight: bold;
      }
    }
    .sell {
      display: block;
      border: 1px solid #ff6b46;
      height: .15rem;
      border-radius: .075rem;
      padding: 0 .04rem;
      text-align: center;
      font-size: .10rem;
      color: #ff6b46;
      margin: .011rem .05rem 0;
    }
    .status {
      font-size: .16rem;
      color: #666;
      line-height: .18rem;
    }
    .img-area {
      margin-top: .05rem;
      img {
        display: inline-block;
        width: .6rem;
        height: .6rem;
        margin: .10rem .10rem 0;
        &:nth-of-type(4n+1) {
          margin-left: 0;
        }
        &:nth-of-type(3n+4) {
          margin-right: 0;
        }
      }
    }
    &>p {
      font-size: .13rem;
      color: #333;
    }
  }
  .evaluate {
    background: #fff;
    .e_header {
      font-size: .15rem;
      color: #333;
      padding: .15rem .10rem;
    }
    .e_body {
      border-top: 1px solid #f5f5f5;
      border-bottom: 1px solid #f5f5f5;
    }
    .item {
      margin: .10rem;
      font-size: .12rem;
      color: #666;
      .info {
        flex: 1;
        margin-top: .02rem;
        .u_name {
          font-size: .12rem;
          color: #1fb8ff;
        }
        .comment {
          margin-right: 0.57rem;
        }
      }
      .call-icon {
        display: block;
        width: .18rem;
        height: .18rem;
        background: url('~@/assets/showcasePatrol/callOut@2x Copy@2x.png') no-repeat;
        background-size: contain;
        margin-left: .05rem;
      }
    }
  }
  .m_bottom {
    width: .56rem;
    height: .56rem;
    line-height: .56rem;
    font-size: .15rem;
    color: #fff;
    border-radius: .28rem;
    box-shadow: 0 0 6px 0 rgba(148, 148, 148, 0.12), 0 6px 6px 0 rgba(141, 141, 141, 0.24);
    background: #ff6c47;
    position: absolute;
    right: .20rem;
    bottom: .20rem;
    text-align: center;
    font-weight: bold;
  }
  .footer {
    background: #fff;
    box-shadow: 0 0.5px 0 0 #d7d7d7;
    &>div { padding: .10rem }
    .action {
      align-items: center;
      img {
        width: .17rem;
        height: .16rem;
      }
    }
    .downImg, .upImg {
      /* height: 1em; */
      padding-left: .27rem;
      background-size: 0.17rem;
      background-position: left;
      background-repeat: no-repeat;
      font-size: .15rem;
      color: #666;
    }
    .downImg {
      background-image: url('../../assets/showcasePatrol/ic_thumbsDown.png');
      &.isFocus {
        background-image: url('../../assets/showcasePatrol/ic_thumbsDown_blue.png');
        color: #1fb8ff;
      }
    }
    .upImg {
      background-image: url('../../assets/showcasePatrol/ic_thumbsUp.png');
      &.isFocus {
        background-image: url('../../assets/showcasePatrol/ic_thumbsUp_blue.png');
        color: #1fb8ff;
      }
    }
    .submit-btn {
      width: 1.20rem;
      height: .40rem;
      border-radius: 4px;
      background: #ff6c47;
      font-size: .15rem;
      line-height: .40rem;
      text-align: center;
      color: #fff;
    }
  }
  .icon-area { align-items: center; }
  .textarea-label {
    display: block;
    padding: .10rem .10rem 0 .10rem;
  }
  .textarea {
    display: block;
    width: 100%;
    height: .60rem;
    font-size: .14rem;
    color: #999;
    padding: .10rem 0 0 .10rem;
    border: 1px solid #d7d7d7;
  }
  .bigImg { width: 3.2rem; }
</style>
