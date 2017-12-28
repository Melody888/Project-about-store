<!--
*** 注意：引用该组件时，需要在外层包一个符合当前设计的盒子
    number-input会根据高度自适应大小，也可直接给定尺寸样式

简单demo:
<bm-number-input
  v-model="val"
  max="99999">
</bm-number-input>

复杂demo
<bm-number-input
  v-model="val"
  max="99999"                    // 最大值 默认：999999999
  min="0"                        // 最小值 默认：0
  plusStep='2'                   // 点击加号后数值变化的大小
  minusStep='2'                  // 点击减号后数值变化的大小
  :plus="plusBtnCallback"        // 点击加按钮后的钩子
  :minus="minusBtnCallback"      // 点击减按钮后的钩子
  :blur="blurCallback"           // 失去焦点后的钩子
  :filter="filterFunc"           // 自定义过滤函数
  :hasChange="changeCallback">   // 数值改变后的钩子
</bm-number-input>

-->

<template>
  <div class="flex numberInput">
    <div class="btn" @click="_calculateNum(-1)">
      <img class="number-btn" src="~@/assets/common/minus.png">
    </div>
    <div class="flex-auto text">
      <input ref="input" type="number" v-model="number" @input="_setNum($event.target.value, $event)" @blur="_resetNum($event)" @click="scrollIntoView" @focus="scrollIntoView">
    </div>
    <div class="btn" @click="_calculateNum(1)">
      <img class="number-btn" src="~@/assets/common/plus.png">
    </div>
  </div>
</template>

<script>
  export default {
    name: 'bm-number-input',
    props: {
      'value': null,
      'filter': [Function],
      'max': {
        type: [Number, String],
        default: 999999999,
        validator: function (value) {
          return typeof Number(value) === 'number'
        }
      },
      'min': {
        type: [Number, String],
        default: 0,
        validator: function (value) {
          return typeof Number(value) === 'number'
        }
      },
      'plusStep': {
        type: Number,
        default: 1
      },
      'minusStep': {
        type: Number,
        default: 1
      },
      hasChange: [Function],
      blur: [Function],
      plus: [Function],
      minus: [Function]
    },
    data () {
      return {
        number: this.value
        // correctNum: ''
      }
    },
    methods: {
      _calculateNum (status) {
        let step = status > 0 ? this.plusStep : -this.minusStep
        let val = Number(this.number) + step
        let value = this._setNum(val)
        if (status > 0) {
          this.plus && this.plus(value)
        } else {
          this.minus && this.minus(value)
        }
      },
      _setNum (value, e) {
        // TODO 输入负数 小数
        // let val = parseInt(value.toString())
        // if (Number.isNaN(val)) { val = '' }
        let isPlus = value.toString().at(0) === '-' ? -1 : 1
        let val = value.toString().replace(/[^0-9]+/g, '')
        let valNum = isPlus * Number(val)
        if (valNum > this.max) {
          valNum = Number(this.max)
          val = valNum
        }
        if (valNum < this.min) {
          valNum = Number(this.min)
          val = valNum
        }
        if (this.filter) {
          val = this.filter(valNum, val)
          this.$emit('input', val)
        } else {
          this.$emit('input', valNum)
        }
        let numStr = val !== '' ? valNum : val
        this.number = numStr
        if (e) { e.target.value = numStr }
        // val与valNum唯一可能的不同是val === ''而valNum === 0
        this.hasChange && this.hasChange(valNum, numStr)
        return valNum
      },
      _resetNum (e) {
        this.number = this.number || 0
        e.target.value = this.number
        this.$emit('input', Number(this.number))
        this.blur && this.blur(this.number)
      },
      scrollIntoView (e) {
        // 修复android机上键盘遮挡问题
        if (global.appInfo && global.appInfo.client === 'android') {
          setTimeout(function () {
            e.target.scrollIntoView(false)
          }, 500)
        }
      }
    },
    watch: {
      value (val) {
        this.number = val
      }
      // number (val, oldVal) {
      //   if (!Number.isNaN(Number(val))) {
      //     this.correctNum = val
      //   }
      // }
    }
  }
</script>

<style lang="less" scoped>
  .numberInput {
    border: 1px solid #d7d7d7;
    border-radius: 4px;
    font-size: .14rem;
    height: 100%;
    &>div { height: 100%; }
    .btn { flex-shrink: 0; }
    .number-btn {
      height: 100%;
    }
    .number-del-btn { background-image: url('~@/assets/common/minus.png'); }
    .number-add-btn { background-image: url('~@/assets/common/plus.png'); }
    input {
      border: none;
      width: 100%;
      height: 100%;
      text-align: center;
    }
  }
</style>
