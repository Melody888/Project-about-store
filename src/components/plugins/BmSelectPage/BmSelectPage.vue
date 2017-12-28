<template>
  <transition name="bm-select-page-slide-right" @after-leave="doAfterLeave">
    <div v-show="visible" class="bm-select-page" ref="page">
      <component :is="currentView" :options="options" ref="subComponent">
        <!-- 组件在 vm.currentview 变化时改变！ -->
      </component>
    </div>
  </transition>
</template>
<style lang="less" scoped>
  .bm-select-page-slide-right{
    &-enter, &-leave-to /* .fade-leave-active in <2.1.8 */ {
      transform: translate3d(0, 100%, 0);
    }
  }
  .bm-select-page {
    position: absolute;
    left: 0;
    right: 0;
    bottom: 0;
    top: 0;
    z-index: 100;
    background: #fff;
    transition: .3s ease;
  }
</style>

<script>
  const noop = () => {}
  export default {
    watch: {
      $route (currRoute) {
        if (currRoute.query['selPageLen'] < this.pointer || !currRoute.query['selPageLen']) this.$emit('back')
      },
      visible (value) {
        if (!value) {
          setTimeout(() => {
            this.currentView = null
            this.options = {}
          }, 400)
        }
      }
    },
    data () {
      return {
        pointer: 0, // 负责记录当前弹窗为同时打开的第几个弹窗
        visible: false,
        currentView: null,
        callback: noop,
        options: {}
      }
    },
    methods: {
      returnValue () {
        const subComponent = this.$refs.subComponent
        if (subComponent && subComponent.callback && (subComponent.selected === undefined || subComponent.selected === true)) {
          return subComponent.callback()
        } else {
          return null
        }
      },
      doAfterLeave () {
        this.$emit('afterLeave')
      }
    }
  }
</script>
