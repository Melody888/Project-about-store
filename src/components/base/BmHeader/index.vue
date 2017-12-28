<style lang="less" scoped>
  .bm-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    background: #1FB8FF;
    height: .4rem;
    color: #fff;
    box-sizing: content-box;
    &__left {
      width: 25%;
      order: 1;
      flex: none;
      height: 100%;
      display: flex;
      align-items: center;
    }
    &__back {
      margin-left: .1rem;
      width: .08rem;
    }
    &__main {
      width: 50%;
      order: 2;
      flex: none;
      text-align: center;
      font-size: .18rem;
    }
    &__right {
      width: 25%;
      order: 3;
      flex: none;
      height: 100%;
      display: flex;
      align-items: center;
      text-align: right;
      justify-content: flex-end;
    }
  }
</style>

<template>
  <section>
    <div class="bm-header">
      <div class="bm-header__left" @click="goBack">
        <slot name="left">
          <img class="bm-header__back" src="./img/back.png">
        </slot>
      </div>
      <div class="bm-header__main"><slot></slot></div>
      <div class="bm-header__right">
        <slot name="right"></slot>
      </div>
    </div>
  </section>
</template>

<script>
  export default {
    props: {
      backAction: Function
    },
    name: 'bm-header',
    methods: {
      goBack () {
        if (this.backAction) {
          this.backAction()
        } else {
          history.go(-1)
        }
      }
    }
  }
</script>
