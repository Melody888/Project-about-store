<template>
  <div class="app-container">
    <div class="app-container__bar" :style="{height: appStatusBarHeight +'px'}"></div>
    <div class="app-container__main" id="app-container__main" :style="{top: appStatusBarHeight +'px'}">
      <router-view></router-view>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'app',
    data () {
      return {
        appStatusBarHeight: 0 // 沉浸式的app状态栏高度
      }
    },
    created () {
      if (global.appInfo && global.appInfo.barHeight && parseInt(global.appInfo.version.replace(/\./g, '')) >= 230) { // TODO
        this.appStatusBarHeight = global.appInfo.barHeight
      }
    }
  }
</script>

<style lang="less" scoped>
  .app-container {
    position: relative;
    &__bar {
      background: #1FB8FF;
    }
    &__main {
      position: absolute;
      bottom: 0;
      left: 0;
      right: 0;
    }
  }
</style>

<style lang="less" src="@/style/mint-ui-reset.css"></style>
<style lang="less" src="@/style/reset.less"></style>
<style lang="less" src="@/style/form.less"></style>
<style lang="css" src="@/style/base.css"></style>
<style lang="css" src="@/style/fontsize.css"></style>
<style lang="css" src="@/style/color.css"></style>
