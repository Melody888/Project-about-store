<template>
  <div>
    选择门店
    <div @click="selectAddr">
      选择这个地址
    </div>
  </div>
</template>

<script>
  export default {
    props: {
      options: Object
    },
    data () {
      return {
        selectedVal: null
      }
    },
    methods: {
      callback () {
        return this.selectedVal
      },
      selectAddr () {
        this.selectedVal = 'addr:' + Math.random()
        window.history.go(-1)
      }
    },
    mounted () {
      setTimeout(() => {
        console.log(this.options)
      }, 1000)
    }
  }
</script>
