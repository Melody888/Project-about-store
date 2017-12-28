<template>
  <mt-loadmore
      class="bm-loadmore"
      :autoFill="false"
      :top-pull-text="topPullText"
      :top-loading-text="topLoadingText"
      :top-drop-text="topDropText"
      :top-distance="topDistance"
      :top-method="topMethod"
      :bottom-method="bottomMethod"
      :bottom-all-loaded="bottomAllLoaded"
      :max-distance="maxDistance"
      :distance-index="distanceIndex"
      :bottom-pull-text="bottomPullText"
      :bottom-loading-text="bottomLoadingText"
      :bottom-drop-text="bottomDropText"
      :bottom-distance="bottomDistance"
      ref="loadmore">
    <div :style="{minHeight: minHeight + 'px'}">
      <slot></slot>
    </div>
  </mt-loadmore>
</template>
<script>
  export default {
    name: 'bm-loadmore',
    props: {
      maxDistance: {
        type: Number,
        default: 0
      },
      autoFill: {
        type: Boolean,
        default: true
      },
      distanceIndex: {
        type: Number,
        default: 2
      },
      topPullText: {
        type: String,
        default: '下拉可以刷新'
      },
      topDropText: {
        type: String,
        default: '释放立即更新'
      },
      topLoadingText: {
        type: String,
        default: '正在刷新...'
      },
      topDistance: {
        type: Number,
        default: 70
      },
      topMethod: {
        type: Function
      },
      bottomPullText: {
        type: String,
        default: '继续上拉加载'
      },
      bottomDropText: {
        type: String,
        default: '释放立即加载'
      },
      bottomLoadingText: {
        type: String,
        default: '正在加载...'
      },
      bottomDistance: {
        type: Number,
        default: 70
      },
      bottomMethod: {
        type: Function
      },
      bottomAllLoaded: {
        type: Boolean,
        default: false
      }
    },
    methods: {
      onTopLoaded () {
        setTimeout(() => {  // 放慢刷新速度，能看清动画过程
          if (this.$refs.loadmore) {
            this.$refs.loadmore.onTopLoaded()
          }
        }, this.delay)
      },
      onBottomLoaded () {
        setTimeout(() => {  // 放慢刷新速度，能看清动画过程
          if (this.$refs.loadmore) {
            this.$refs.loadmore.onBottomLoaded()
          }
        }, this.delay)
      },
      getScrollEventTarget (element) {
        var currentNode = element
        // bugfix, see http://w3help.org/zh-cn/causes/SD9013 and http://stackoverflow.com/questions/17016740/onscroll-function-is-not-working-for-chrome
        while (currentNode && currentNode.tagName !== 'HTML' && currentNode.tagName !== 'BODY' && currentNode.nodeType === 1) {
          var overflowY = getComputedStyle(currentNode).overflowY
          if (overflowY === 'scroll' || overflowY === 'auto') {
            return currentNode
          }
          currentNode = currentNode.parentNode
        }
        return window
      },
      calculate () {
        const scrollTarget = this.getScrollEventTarget(this.$refs.loadmore.$el)
        if (scrollTarget === window) {
          this.minHeight = scrollTarget.clientHeight
        } else {
          this.minHeight = scrollTarget.clientHeight
        }
      }
    },
    data () {
      return {
        minHeight: 1000,
        delay: 500
      }
    },
    mounted () {
      this.calculate()
    }
  }
</script>
