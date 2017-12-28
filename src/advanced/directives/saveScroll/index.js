import Store from '@/advanced/Store'
import Vue from 'vue'

const store = new Store()

const scroll = (event) => {
  const { target: { __url } } = event
  if (__url) {
    store.setItem(__url, event.target.scrollTop)
  }
}

/**
 * 支持一个页面多个滚动条的情况
 */
export default {
  inserted: function (el, binding, vnode) {
    const containerName = binding.arg || ''
    const init = (to) => {
      const currentUrl = el.__url = to.fullPath + containerName
      el.addEventListener('scroll', scroll, false) // 绑定滚动事件
      Vue.nextTick(() => {
        el.scrollTop = store.getItem(currentUrl)
      })
    }
    init(vnode.context.$route)
    vnode.context.$watch('$route', init)
  },
  unbind: function (el, binding, vnode) {
    el.removeEventListener('scroll', scroll, false)
  }
}
