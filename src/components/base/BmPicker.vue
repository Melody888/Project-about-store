<template>
  <mt-popup v-model="visible" position="bottom" class="mint-datetime">
    <mt-picker
      :slots="dateSlots"
      @change="onChange"
      :visible-item-count="visibleItemCount"
      class="mint-datetime-picker"
      ref="picker"
      :value-key="valueKey"
      show-toolbar>
      <span class="mint-datetime-action mint-datetime-cancel" @click="visible = false;$emit('cancel')">{{ cancelText }}</span>
      <span class="mint-datetime-action mint-datetime-confirm" @click="confirm">{{ confirmText }}</span>
    </mt-picker>
  </mt-popup>
</template>

<script>
  export default {
    name: 'bm-picker',

    props: {
      cancelText: {
        type: String,
        default: '取消'
      },
      confirmText: {
        type: String,
        default: '确定'
      },
      visibleItemCount: {
        type: Number,
        default: 5
      },
      slots: {
        type: Array,
        default: []
      },
      valueKey: {
        type: String,
        default: ''
      }
    },

    data () {
      return {
        visible: false,
        value: null
      }
    },

    methods: {
      open () {
        this.visible = true
      },

      close () {
        this.visible = false
      },

      onChange (picker, values) {
        this.value = values[0]
      },

      getValues () {
        if (!this.slots || this.slots.length === 0) {
          return null
        }
        const value = this.$refs.picker.values[0]
        if (!value) {
          const defaultValue = this.slots[(this.visibleItemCount - 1) / 2]
          return defaultValue ? Object.assign({}, defaultValue) : null
        }
        return Object.assign({}, value)
      },

      confirm () {
        this.visible = false
        this.$emit('confirm', this.getValues())
      }
    },

    computed: {
      dateSlots () {
        return [{
          flex: 1,
          values: (this.slots || []),
          className: 'slot1',
          defaultIndex: 1
        }]
      }
    }
  }
</script>
