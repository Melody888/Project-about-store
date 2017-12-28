<style lang="less" scoped>
  .bm-search {
    display: flex;
    align-items: center;
    background: #fff;
    &__left {
      flex: auto;
      display: flex;
      align-items: center;
      height: .3rem;
      background: #F2F2F2;
      border-radius: .15rem;
      overflow: hidden;
      padding-left: .05rem;
      padding-right: .1rem;
    }
    &__icon {
      flex: none;
      width: .14rem;
      margin-right: .05rem;
    }
    &__clear {
      flex: none;
      width: .24rem;
    }
    &__speech {
      flex: none;
      width: .24rem;
    }
    &__input {
      width: 0;
      flex: auto;
      flex-shrink: 0;
      outline: none;
      border: none;
      color: #333;
      font-size: .15rem;
      &::-webkit-input-placeholder {
        color: #999;
      }
    }
    &__right {
      flex: none;
      padding: .05rem .1rem;
      font-size: .15rem;
      color: #1FB8FF;
      letter-spacing: 1px;
      cursor: pointer;
    }
  }
</style>

<template>
  <div class="bm-search">
    <div class="bm-search__left">
      <img class="bm-search__icon" src="./img/search.png" alt="">
      <input
        class="bm-search__input"
        type="text"
        :value="value"
        @input="inputValue"
        :placeholder="placeholder"
        :maxlength="maxlength"/>
      <img class="bm-search__speech" src="./img/microphone_gray.png" alt="" v-show="isSpeech && !value" @click="speech">
      <img class="bm-search__clear" src="./img/clear.png" alt="" v-show="value" @click="clear">
    </div>
    <div class="bm-search__right" @click="doSubmit">搜索</div>
  </div>
</template>

<script>
  import { speechRecognition } from '@/utils/native'
  export default {
    name: 'bm-search',
    data () {
      return {
        value: ''
      }
    },
    props: {
      placeholder: {
        type: String,
        default: '请输入'
      },
      defaultValue: String,
      maxlength: {
        type: Number,
        default: 50
      },
      isSpeech: {
        type: Boolean,
        default: false
      }
    },
    methods: {
      doSubmit (event) {
        this.$emit('doSubmit', this.value)
      },
      inputValue (event) {
        this.value = event.target.value
        this.$emit('input', event.target.value)
      },
      speech (event) {
        speechRecognition({
          callback: res => {
            let result = JSON.parse(res)
            if (result.isSuccess && result.content) {
              this.value = result.content
              this.doSubmit()
            }
          }
        })
        this.$emit('speech')
      },
      clear () {
        this.value = ''
      }
    },
    watch: {
      value (val) {
        this.$emit('input', val)
      }
    },
    mounted () {
      if (this.defaultValue) this.value = this.defaultValue
    }
  }
</script>

