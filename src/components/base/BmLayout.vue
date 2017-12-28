<template>
  <section class="bm-layout">
    <div class="bm-layout__header" ref="header">
      <slot name="header"></slot>
    </div>

    <slot name="top"></slot>
    <div class="bm-layout__main" :class="{'scrollTouch': isScrollTouch}" ref="main" v-saveScroll>
      <div class="bm-layout__content-box">
        <div :style="{height: scrolltopElementHeight + 'px'}"></div>
        <slot></slot>
      </div>
    </div>

    <slot name="left"></slot>
    <slot name="right"></slot>

    <slot name="bottom"></slot>
    <div class="bm-layout__footer">
      <slot name="footer"></slot>
    </div>

  </section>
</template>

<script>
  import Velocity from 'velocity-animate'
  import scrollmonitor from 'scrollmonitor'
  import { addClass, removeClass } from '@/utils/domClass'
  export default {
    name: 'bm-layout',
    data () {
      return {
        mainHeight: 2000,
        scrolltopElementHeight: 0,
        appStatusBarHeight: 0 // 沉浸式的app状态栏高度
      }
    },
    props: {
      isScrollTouch: {
        type: Boolean,
        default: true
      }
    },
    methods: {
      resetScrollTop () {
        this.$refs.main.scrollTop = 0
      },
      scrollElement (element) {
        if (!element || element.nodeType !== 1) return
        Velocity(element, 'scroll', {
          duration: 500,
          container: this.$refs.main
        })
      },
      scrollToElementFixedTop () {
        // 说明
        // fixed-top-element所在的祖先容器中不能用translate的修饰，也就是无法与loadmore组件兼容
        const targetElement = this.$refs.main.querySelector('.fixed-top-element')
        if (!targetElement) return

        const container = this.$refs.main
        const header = this.$refs.header

        const containerMonitor = scrollmonitor.createContainer(container)
        const watcher = containerMonitor.create(targetElement)
        watcher.lock()
        watcher.stateChange(() => {
          if (watcher.isAboveViewport) {
            this.scrolltopElementHeight = targetElement.offsetHeight
            targetElement.style.top = header.clientHeight + this.appStatusBarHeight + 'px'
            addClass(targetElement, 'fixed-top-element-active')
          } else {
            this.scrolltopElementHeight = 0
            removeClass(targetElement, 'fixed-top-element-active')
            targetElement.style.top = '0px'
          }
        })
      }
    },
    mounted () {
      if (global.appInfo && global.appInfo.barHeight && parseInt(global.appInfo.version.replace(/\./g, '')) >= 230) { // TODO
        this.appStatusBarHeight = global.appInfo.barHeight
      }
      this.mainHeight = this.$refs.main.offsetHeight
    }
  }
</script>

<style>
  .fixed-top-element-active {
    position: fixed !important;
    left: 0 !important;
    z-index: 30;
  }
</style>

<style scoped lang="less">
  .scrollTouch {
    -webkit-overflow-scrolling: touch;
  }
  .bm-layout {
    display: flex;
    flex-direction: column;
    position: relative;
    max-width: 640px;
    min-width: 320px;
    margin: 0 auto;
    height: 100%;
    overflow: hidden;
    &__header {
      flex: none;
    }
    &__main {
      position: relative;
      width: 100%;
      flex: auto;
      overflow-y: auto;
      overflow-x: hidden;
    }
    &__content-box {
      min-height: calc(~"100% + 1px");
    }
    &__footer {
      flex: none;
    }
  }
</style>
