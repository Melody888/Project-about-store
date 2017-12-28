<template>
	<div class="filePicker">
    <input type="file" @change="fileChange" accept="image/*">
    <slot>
      <div>选择文件</div>
    </slot>
  </div>
</template>

<script>

export default {
  name: 'bm-file-picker',
  methods: {
    fileChange (event) {
      this.$emit('pick', event)
    }
  }
}
</script>
<style lang="less" scoped>
  .filePicker {
    position: relative;
    cursor: pointer;
    width: 100%;
    height: 100%;
    input[type="file"] {
      position: absolute;
      left:0;
      top:0;
      width: 100%;
      height: 100%;
      opacity: 0;
      cursor: pointer;
      z-index: 99;
    }
  }
</style>
