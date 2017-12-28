import FastClick from 'fastclick'
import iSaveScroll from './saveScroll'

/**
 * 手动 fastclick 元素
 */
export const fastclick = {
  inserted: function (el) {
    FastClick.attach(el)
  }
}

/**
 * 自动获得焦点
 */
export const focus = {
  inserted: function (el) {
    // 聚焦元素
    el.focus()
  }
}

export const saveScroll = iSaveScroll

/**
 * WARNING: test for save-scroll beta
 */
export const scrolled = (function () {
  let timer
  let maxLength = 1
  let scrollTopList = []
  return {
    inserted: function (el, binding) {
      let currLength = window.history.length
      let id = binding.value
      if (currLength === maxLength) {
        let listItem = scrollTopList[currLength - 1]
        if (listItem) el.scrollTop = (id ? +listItem[id] : +listItem) || 0
      } else {
        scrollTopList.splice(currLength - 1)
        if (id) scrollTopList[currLength - 1] = {}
        maxLength = currLength
      }
      timer = setInterval(function () {
        let scrollTop = el.scrollTop
        if (el.style.display === 'none') return
        if (scrollTop || el.clientHeight) {
          if (id) {
            scrollTopList[currLength - 1][id] = scrollTop
          } else {
            scrollTopList[currLength - 1] = scrollTop
          }
        }
      }, 750)
    },
    unbind: function (el, binding) {
      clearTimeout(timer)
    }
  }
})()
