<style lang="less" scoped>
  .uploaded-Img {
    position: relative;
    background: #D8D8D8;
    &__remove {
      position: absolute;
      top: -.08rem;
      right: -.08rem;
      width: .15rem;
      height: .15rem;
      background: url(./img/remove.png) no-repeat center / cover;
    }
    &__main {
      width: 100%;
      height: 100%;
      background: no-repeat center / cover;
    }
    &__img {
      width: 0;
      height: 0;
      display: none;
    }
  }
</style>

<template>
  <div class="uploaded-Img">
    <div class="uploaded-Img__remove" @click.stop.prevent="del" v-if="showRemove"></div>
    <div class="uploaded-Img__main" :style="{backgroundImage: `url(${src})`}"></div>
    <img class="uploaded-Img__img" :src="src" alt="">
  </div>
</template>

<script>
  export default {
    name: 'bm-uploaded-img',
    props: {
      src: String,
      showRemove: {
        default: false,
        type: Boolean
      }
    },
    methods: {
      del (event) {
        this.$emit('del', this.src)
      }
    }
  }
</script>
