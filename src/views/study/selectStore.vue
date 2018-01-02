<template>
  <bm-layout>
      <bm-header>
          <p>选择门店</p>
      <div class="right" slot="right"></div>
      </bm-header>
      <section>
        <bm-search
          class="search"
          placeholder="输入门店编码/名称"
          v-model="keyword"
          @doSubmit="doSubmit">
        </bm-search>
      </section>
      

  </bm-layout>
</template>
<script>
export default {}
</script>
<style lang="less" scoped>
.search {
    height: 50px;
    font-size: 15px;
    border-bottom: 0.5 solid #D7D7D7;
}

</style>

