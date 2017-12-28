<template>
  <bm-layout>
    <header slot="header">
      <bm-header>陈列巡检</bm-header>
      <!-- <form class="m_search" @submit.prevent="doSearch">
        <div class="wrap">
          <input class="input" type="text" v-model="keyword" placeholder="输入名称搜索">
          <button class="reset" v-if="keyword" type="reset" @click="doResetKeyword"></button>
        </div>
        <button class="submit" type="submit">搜索</button>
      </form> -->
    </header>
    <mt-loadmore class="m_list" :top-method="doRefresh" ref="loadmore" v-scrolled="'showcasePatrolIndexLite'">
      <ul>
        <li class="item" v-for="(item, index) of list">
          <router-link class="wrap" :to="`../detail/${item.code}?isHideComment=true`" append>
            <p class="code"><span>{{ item.code }}</span><span class="link">详情</span></p>
            <p class="created">巡检单创建：{{ item.date | datetime('YYYY/MM/DD') }} {{ item.name }}</p>
          </router-link>
          <div class="wrap">
            <h3 class="store"><span class="store-content">{{ item.store }}</span></h3>
            <p class="overview">
              <span class="count">陈列数：{{ item.showCount }}</span>
              <span class="area">总排面(㎡)：{{ item.showArea }}</span>
              <i class="gap"></i>
              <!-- <router-link class="evaluate" :to="{ path: `../detail/${item.code}`, query: { 'comment': true } }" append v-if="item.canEvaluate">评价</router-link> -->
              <!-- <router-link class="edit" :to="{ path: '../edit', query: { 'id': item.code }}" append v-if="item.canEdit">编辑</router-link> -->
            </p>
          </div>
          <div class="wrap reviews" v-if="item.reviews && item.reviews.length">
            <div class="bar">
              <span class="length">评价信息：{{ item.reviews.length }}条</span>
              <!-- <button class="reply" v-if="item.canReview" @click="doOpenReply(index)">回复</button> -->
              <span class="gap"></span>
              <button class="toggle" @click="item.reviewsToggled = !item.reviewsToggled" v-if="item.reviews.length > 1">
                <span>{{ item.reviewsToggled ? '收起' : '展开' }}</span>
                <i :class="['arrow', { 'opened': item.reviewsToggled }]"></i>
              </button>
            </div>
            <ul>
              <li v-for="(review, index) of item.reviews" v-show="index === 0 || item.reviewsToggled" class="review">{{ review.date | datetime('YYYY/MM/DD') }} {{ review.name }}：{{ review.content }}{{ (!review.content && review.like) ? `赞(${review.like})`  : '' }}{{ (!review.content && review.unlike) ? `踩(${review.unlike})`  : '' }}</li>
            </ul>
          </div>
        </li>
      </ul>
    </mt-loadmore>
    <bm-empty v-if="!list.length" />
    <!-- <comp-popup slot="bottom" ref="popup" @close="doCloseReply">
      <form class="m_reply" @submit.prevent="doReply">
        <textarea class="textarea" ref="reply" placeholder="填写回复内容" v-model="replyContent"></textarea>
        <button class="submit">提交回复</button>
      </form>
    </comp-popup> -->
  </bm-layout>
</template>
<script>
  // import CompPopup from './popup'
  export default {
    data () {
      return {
        replyIndex: 0,
        replyContent: '',
        keyword: ''
      }
    },
    computed: {
      list () {
        return this.$store.state['showcasePatrol']['indexLiteList'] || []
      }
    },
    methods: {
      doInit () {
        // this.keyword = this.$store.state['showcasePatrol']['indexKeyword'] || ''
        if (!this.list.length) this.$store.dispatch('showcasePatrol/indexLiteGetList', this.$route.query['storeId'])
      },
      // doOpenReply (index) {
      //   this.replyIndex = index
      //   this.$refs.popup.open()
      //   this.$nextTick(() => {
      //     this.$refs.reply.focus()
      //   })
      // },
      // doCloseReply () {
      //   this.replyIndex = 0
      //   this.replyContent = ''
      // },
      // async doReply () {
      //   let res = await this.$store.dispatch('showcasePatrol/indexReply', {
      //     'index': this.replyIndex,
      //     'content': this.replyContent
      //   })
      //   this.$refs.popup.close()
      //   return res
      // },
      // doGoAdd () {
      //   this.$router.push({
      //     path: 'edit',
      //     append: true
      //   })
      // },
      doResetKeyword () {
        this.keyword = ''
      },
      async doSearch () {
        return await this.$store.dispatch('showcasePatrol/indexGetList', this.keyword)
      },
      async doRefresh () {
        let res = await this.doSearch().catch(err => {
          this.$refs.loadmore.onTopLoaded()
          throw err
        })
        this.$refs.loadmore.onTopLoaded()
        return res
      }
    },
    created () {
      this.doInit()
    }
    // components: { CompPopup }
  }
</script>
<style lang="less" scoped>
  @color1: #1FB8FF;
  @color2: #FFC924;
  @color3: #FF6C47;
  @color_b1: #D7D7D7;
  @color_b2: #E5E5E5;
  @color_t1: #333;
  @color_t2: #666;
  @color_t3: #999;

  @offset1: 0.1rem;
  @offset2: 0.15rem;

  @size1: 0.13rem;
  @size2: 0.14rem;
  @size3: 0.15rem;

  input, button {
    border: none;
    background-color: transparent;
    color: inherit;
  }
  a {
    color: inherit;
    text-decoration: inherit;
  }

  .m_search {
    display: flex;
    align-items: center;
    background-color: #fff;
    border-bottom: 1px solid @color_b1;
    padding: @offset1;
    font-size: @size3;
    color: @color_t1;
    .wrap {
      display: flex;
      border-radius: 15px;
      background-color: #f2f2f2;
      flex-grow: 1;
      align-items: center;
    }
    .input {
      height: 0.3rem;
      background: url("~@/assets/showcasePatrol/search-gray@2x@2x.png") 0.08rem center no-repeat;
      background-size: 0.14rem;
      padding-left: 0.24rem;
      flex-grow: 1;
    }
    .reset {
      width: 0.12rem;
      height: 0.12rem;
      margin: 0 0.05rem;
      background: url("~@/assets/showcasePatrol/delete.png") center no-repeat;
      background-size: contain;
    }
    .input:invalid + .reset {
      display: none;
    }
    .submit {
      margin-left: 0.1rem;
      color: @color1;
    }
  }
  .m_list {
    font-size: @size3;
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    overflow: hidden;
    overflow-y: auto;
    .item {
      display: block;
      margin: @offset1 0;
      background-color: #fff;
      border-bottom: 1px solid @color_b1;
    }
    .wrap {
      display: block;
      padding: @offset2 0;
      padding-right: @offset1;
      margin-left: @offset1;
      border-top: 1px solid @color_b2;
      &:first-child {
        border-top: none;
      }
    }
    .code {
      display: flex;
      justify-content: space-between;
      color: @color_t3;
    }
    .link {
      background: url("~@/assets/showcasePatrol/rightArrow.png") right no-repeat;
      padding-right: 0.13rem;
      background-size: 0.075rem;
    }
    .created {
      color: @color_t2;
      font-size: @size1;
      margin-top: @offset1;
    }
    .store {
      font-size: @size3;
      font-weight: inherit;
      color: @color_t1;
      line-height: 1.25;
      max-height: @size3 * 2 * 1.25;
      overflow: hidden;
      &:before {
        content: "";
        float: left;
        width: 1px;
        height: 100%;
      }
      &-content {
        float: right;
        width: 100%;
        margin-left: -1px;
      }
      &:after {
        background-color: #fff;
        content: "…";
        box-sizing: content-box;
        float: right;
        width: 1em;
        margin-left: -1em;
        padding-right: 1px;
        position: relative;
        top: -1.25em;
        left: 100%;
      }
    }
    .overview {
      display: flex;
      margin-top: @offset1;
      color: @color_t2;
      font-size: @size1;
      align-items: center;
      align-items: baseline;
    }
    .count {
      width: 28%;
    }
    .evaluate {
      flex-shrink: 0;
      margin-left: @offset1;
      padding-left: 0.2rem;
      color: @color_t3;
      font-size: @size3;
      background: url("~@/assets/showcasePatrol/reply.png") left no-repeat;
      background-size: 0.14rem;
    }
    .edit {
      flex-shrink: 0;
      margin-left: @offset1;
      padding-left: 0.2rem;
      color: @color1;
      font-size: @size3;
      background: url("~@/assets/showcasePatrol/icon_write copy@2x.png") left no-repeat;
      background-size: 0.14rem;
    }
    .reviews {
      padding-top: @offset1;
      padding-bottom: @offset1;
      color: @color_t3;
      font-size: @size1;
    }
    .bar {
      display: flex;
      align-items: center;
    }
    .length {
      width: 35%;
    }
    .reply {
      background: url("~@/assets/showcasePatrol/reply.png") left no-repeat;
      background-size: 0.12rem;
      text-align: left;
      padding-left: 0.18rem;
    }
    .gap {
      flex-grow: 1;
    }
    .toggle {
      display: flex;
      align-items: center;
    }
    .arrow {
      width: 0.1rem;
      height: 0.1rem;
      margin-left: 0.05rem;
      background: url("~@/assets/showcasePatrol/toggle.png") right no-repeat;
      background-size: 0.1rem;
    }
    .opened {
      transform: rotate(180deg);
    }
    .review {
      margin-top: @offset1;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
  }
  .m_add {
    position: fixed;
    bottom: 0.62rem;
    left: 0.2rem;
    width: 0.56rem;
    height: 0.56rem;
    border-radius: 50%;
    color: #fff;
    background-color: @color2;
    font-size: @size2;
    font-weight: bold;
    box-shadow: 0 0 6px rgb(148,148,148,0.12), 0 6px 6px rgba(141,141,141,0.24);
  }
  .m_reply {
    position: absolute;
    bottom: 0;
    left: 0;
    width: 100%;
    box-shadow: 0 0 @color_b1;
    background-color: #fff;
    padding: @offset1;
    .textarea {
      font-size: @size2;
      display: block;
      width: 100%;
      height: 0.6rem;
      background-color: #FBFBFB;
      border: 1px solid @color_b1;
      border-radius: 4px;
    }
    .submit {
      font-size: @size3;
      display: block;
      margin-top: @offset1;
      background-color: @color3;
      border-radius: 4px;
      color: #fff;
      height: 0.4rem;
      width: 100%;
    }
  }
</style>
