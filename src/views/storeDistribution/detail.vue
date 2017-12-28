<style lang="less" scoped>
  .ml5 {
    margin-left: 0.05rem;
  }

  .pr {
    position: relative;
  }

  .time-pick {
    color: #666666;
    margin-top: 0.1rem;
  }

  .color-1fb8ff {
    color: #1FB8FF;
  }

  .bottom-line {
    border-bottom: 1px solid #d7d7d7;
  }

  .add {
    margin-right: 0.1rem;
    text-decoration: underline;
  }

  .article {
    background-color: white;
    padding: 0.11rem 0.1rem 0.15rem;
    box-shadow: 0 0 1px 1px #D7D7D7;
    .ar-detail {
      color: #333333;
      margin-top: 0.1rem;
    }
  }

  .list-detail {
    margin-top: 0.1rem;
    background-color: white;
    font-size: 0.15rem;
    .head-line {
      padding: 0.1rem;
    }
    .item {
      margin-left: 0.1rem;
      padding: 0.1rem 0.1rem 0.1rem 0;
      &:last-child {
        border: none;
      }
    }
  }

  .remark {
    font-size: 0.15rem;
    margin-top: 0.1rem;
    margin-bottom: 0.15rem;
    background-color: white;
    padding: 0.15rem 0.1rem;
    .remark-text {
      padding: 0.1rem 0rem 0rem;
    }
  }

  .assess {
    background-color: white;
    .head-line {
      padding: 0.1rem;
      font-size: 0.15rem;
    }
  }

  .icon {
    display: inline-block;
    width: 0.14rem;
    height: 0.14rem;
    background-size: cover;
    &-del {
      height: 0.16rem;
      background: url('../../assets/storeDistribution/del.png') no-repeat center 2px;
      background-size: 100%;
      margin-right: 0.05rem;
    }
    &-left {
      background: url('../../assets/storeDistribution/rightArrow.png') no-repeat center center;
      background-size: contain;
      margin-left: 0.05rem;
    }
    &-ph {
      background: url('../../assets/storeDistribution/callOut.png') no-repeat center center;
      background-size: contain;
      margin-left: 0.05rem;
    }
    &-thumbsDown {
      width: 0.17rem;
      height: 0.16rem;
      background: url('../../assets/storeDistribution/ic_thumbsDown.png') no-repeat center center;
      background-size: contain;
      margin-right: 0.05rem;
    }
    &-thumbsDown_blue {
      width: 0.17rem;
      height: 0.16rem;
      background: url('../../assets/storeOrder/ic_thumbsDown_blue.png') no-repeat center center;
      background-size: contain;
      margin-right: 0.05rem;
    }
    &-thumbsUp {
      width: 0.17rem;
      height: 0.16rem;
      background: url('../../assets/storeOrder/ic_thumbsUp.png') no-repeat center center;
      background-size: contain;
      margin-right: 0.05rem;
    }
    &-thumbsUp_blue {
      width: 0.17rem;
      height: 0.16rem;
      background: url('../../assets/storeDistribution/ic_thumbsUp_blue.png') no-repeat center center;
      background-size: contain;
      margin-right: 0.05rem;
    }
  }

  .assess-item {
    padding: 0.1rem;
  }

  .assess-con {
    position: absolute;
    bottom: .2rem;
    right: .2rem;
    width: .56rem;
    height: .56rem;
    z-index: 5;
    &-btn {
      color: white;
      font-size: 0.14rem;
      text-align: center;
      width: 100%;
      height: 100%;
      border-radius: 50%;
      background-color: #ff6c47;
      display: flex;
      flex-direction: column;
      justify-content: center;
      box-shadow: 0px 4px 3px -5px #888;
    }
  }

  .appraise {
    box-shadow: 0px 3px 19px 3px #5a5a5a;
    background-color: white;
    padding: 0.1rem;
    z-index: 10;
    .text-area {
      border-radius: 4px;
      width: 100%;
      height: 0.6rem;
      border: 1px solid #d7d7d7;
      padding: 0.1rem;
      font-size: 0.14rem;
    }
    .select-item {
      font-size: 0.15rem;
      margin-top: 0.1rem;
      .s-it {
        display: flex;
        align-items: center;
      }
      .submit-btn {
        background-color: #ff6c47;
        color: white;
        width: 1.119rem;
        text-align: center;
        height: 0.4rem;
        border-radius: 4px;
        line-height: 0.4rem;
      }
    }
  }
</style>

<template>
  <bm-layout>
    <bm-header slot="header">
      分销与价格详情
    </bm-header>
    <div class="article" slot="header">
      <div class="f15">{{marketDetail.marketPollingInfo.marketCode}} {{marketDetail.marketPollingInfo.storeName}}</div>
      <div class="ar-detail f12 flex justify-between">
        <div>创建时间:<span class="ml5">{{marketDetail.marketPollingInfo.createTimestamp | datetime('YYYY-MM-DD')}}</span> <span>{{marketDetail.marketPollingInfo.createByName}}</span></div>
        <div>分销品种:<span class="ml5">{{marketDetail.marketPollingInfo.marketNum}}</span></div>
      </div>
    </div>
    <div class="list-detail" @click="showComment('none')">
      <div class="head-line bottom-line">分销产品明细</div>

      <div class="item bottom-line" v-for="(item, index) in marketDetail.marketProdList" :key="index">
        <div class="f14 flex justify-between">
          <div class="flex-auto">{{item.prdName}}</div>
          <div class="color-999 flex flex-column justify-start color-ff6c47 items-center"><span><em>￥</em><em>{{(item.price/100).toFixed(2)}}</em></span></div>
        </div>
        <div class="time-pick flex justify-between f12">
          <div>
            <span>{{item.startTime | datetime('YYYY-MM-DD')}}</span>至<span>{{item.endTime | datetime('YYYY-MM-DD')}}</span>
          </div>
          <div class="">{{item.marketType === 'activity' ? '活动价': '分销价'}}</div>
        </div>
      </div>
    </div>
    <div class="remark" @click="showComment('none')">
      <div class="headline">备注</div>
      <div class="remark-text f13 color-666">{{marketDetail.marketPollingInfo.remark || '无'}}</div>
    </div>

    <div class="assess" @click="showComment('none')" v-show="marketDetail.marketFeedback.length === 0 ? false : true">
      <div class="head-line bottom-line">评价信息</div>
      <div class="assess-list">
        <div class="assess-item f12 color-666" v-for="(item, index) in marketDetail.marketFeedback" :key="index">
          <div class="flex justify-between">
            <span><em>{{item.createTimestamp | datetime('YYYY/MM/DD HH:mm:ss')}}</em><em class="ml5">{{item.type === 'comment' ? '评价': '回复'}}</em></span>
            <span class="flex items-center">
              <a v-if="item.mobile" :href="'tel:' + item.mobile" class="color-1fb8ff">{{item.createByName}}</a>
              <a v-if="!item.mobile">{{item.createByName}}</a>
              <i class="icon icon-ph" v-if="item.mobile"></i>
            </span>
          </div>
          <div>{{item.content}}</div>
          <div><span v-if="item.agreeType === 'stamp'">踩({{item.agreeNum}})</span><span v-if="item.agreeType === 'agree'">赞({{item.agreeNum}})</span></div>
        </div>
      </div>
    </div>

    <div class="assess-con" slot="right" v-show="!isComment && !isHideComment">
      <div class="assess-con-btn" @click="showComment('assess')" v-if="isCanComment">
        评价
      </div>
    </div>
    <div class="appraise" slot="footer" v-show="isComment">
      <textarea v-model="content" class="text-area" name="" id="" cols="30" rows="10" placeholder="请填写评价内容，200字内容。"></textarea>
      <div class="select-item flex justify-around items-center">
        <div class="s-it" :class="{'color-1fb8ff': unLikeNum > 0}" @click="unlike"><i class="icon icon-thumbsDown" :class="{'icon-thumbsDown_blue': unLikeNum > 0}"></i><span>踩 <i v-if="unLikeNum > 0">({{unLikeNum}})</i></span></div>
        <div class="s-it" :class="{'color-1fb8ff': likeNum > 0}" @click="like"><i class="icon icon-thumbsUp" :class="{'icon-thumbsUp_blue': likeNum > 0}"></i><span>赞 <i v-if="likeNum > 0">({{likeNum}})</i></span></div>
        <div class="submit-btn" @click="submitComment">提交评价</div>
      </div>
    </div>
  </bm-layout>
</template>



<script>
  import { mapGetters } from 'vuex'
  import { Toast } from 'mint-ui'
  export default {
    data () {
      return {
        isComment: false,
        isCanComment: false,
        marketCode: '',
        content: '',
        likeNum: 0,
        unLikeNum: 0,
        isHideComment: false
      }
    },
    computed: {
      ...mapGetters({
        marketDetail: 'storeDistribution/getMarketDetail'
      })
    },
    methods: {
      showComment (str) {
        if (str === 'assess') {
          this.isComment = true
        } else {
          this.isComment = false
        }
      },
      like () {
        if (this.likeNum === 5) return
        this.likeNum ++
        this.unLikeNum = 0
      },
      unlike () {
        if (this.unLikeNum === 5) return
        this.unLikeNum ++
        this.likeNum = 0
      },
      submitComment () {
        let params = {type: 'comment', marketCode: this.marketCode, content: this.content}
        // 要么评论，要么点赞
        if (this.unLikeNum === 0 && this.likeNum === 0 && this.content.length === 0) {
          Toast({
            message: '请点赞或者填写评论内容!',
            duration: 2000
          })
          return
        }
        // 评论内容不能超过200字
        if (this.content.length > 200) {
          Toast({
            message: '评价内容不能超过200字!',
            duration: 2000
          })
          return
        }
        if (this.likeNum === 0 && this.unLikeNum !== 0) {
          params.agreeType = 'stamp'
          params.agreeNum = this.unLikeNum
        } else if (this.unLikeNum === 0 && this.likeNum !== 0) {
          params.agreeType = 'agree'
          params.agreeNum = this.likeNum
        }
        this.$store.dispatch('storeDistribution/saveMarketFeedback', params).then(result => {
          if (result.responseCode === 0) {
            this.isComment = false
            this.likeNum = 0
            this.unLikeNum = 0
            this.content = ''
            Toast({
              message: '评价成功!',
              duration: 2000
            })
            this.$store.dispatch('storeDistribution/fetchMarketPollingDetails', {marketCode: this.marketCode, optType: 'details'})
          }
        })
      }
    },
    mounted () {
      if (this.$route.query.isHideComment) this.isHideComment = this.$route.query.isHideComment
      this.marketCode = this.$route.params.marketCode
      if (this.$route.params.showComment === 'true') this.isComment = true
      console.log(this.$route.params.isCanComment)
      if (this.$route.params.isOwnMarket === '2') this.isCanComment = true
      this.$store.dispatch('storeDistribution/fetchMarketPollingDetails', {marketCode: this.marketCode, optType: 'details'})
    }
  }
</script>
