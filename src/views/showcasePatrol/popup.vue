<template>
  <transition>
    <aside class="m_popup" v-show="show">
      <div class="shadow" @click="close" v-if="show">
        <div @click.stop>
          <slot></slot>
        </div>
      </div>
    </aside>
  </transition>
</template>
<script>
  export default {
    data () {
      return {
        show: false
      }
    },
    watch: {
      // 安卓物理返回时关闭遮罩
      $route (route) {
        if (!route.query['popping']) this.show = false
      }
    },
    methods: {
      open () {
        this.$router.push({
          query: Object.assign({}, this.$router.query, {
            'popping': true
          })
        })
        this.show = true
      },
      close () {
        this.show = false
        if (this.$route.query['popping']) this.$router.back()
        this.$emit('close')
      }
    }
  }
</script>
<style lang="less" scoped>
  .m_popup {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    z-index: 100;
    overflow: hidden;
    &.v-enter {
      opacity: 0;
    }
    &.v-enter-active {
      transition: opacity 0.2s;
    }
    .shadow {
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      z-index: 1;
      background-color: fade(#000, 40);
    }
  }
</style>