import Vue from 'vue'
import self from './BmSelectPage'
import router from '@/router'

const SelfVue = Vue.extend(self)

// let instance = null

// const BmSelectPage = ({component, options}) => {
//   if (!instance) {
//     const mountedEl = document.createElement('div')
//     document.getElementById('app-container__main').appendChild(mountedEl)
//     instance = new SelfVue({
//       router
//     }).$mount(mountedEl)
//   }
let pageHistory = []

const BmSelectPage = function ({ component, options }) {
  return new Promise(function (resolve, reject) {
    // 初始化view
    let inst = new SelfVue({
      router,
      el: document.createElement('div')
    })
    // 往历史纪录数组中插入弹窗记录
    pageHistory.push(inst)
    let len = pageHistory.length
    // view的一系列赋值与事件监听
    inst.$on('back', function () {
      let res = inst.returnValue()
      if (res) {
        resolve(res)
      } else {
        reject('no data')
      }
      inst.visible = false
      pageHistory.pop()
    })
    inst.$on('afterLeave', function () {
      // 清除内存
      inst.$el.parentNode.removeChild(inst.$el)
      inst.$destroy()
      inst = null
    })
    inst.pointer = len
    inst.visible = true
    inst.options = options || {}
    // 记住这个要放在最后，不然不能保证component的created事件发生在所有属性准备好的情况下
    inst.currentView = component
    // 插入DOM，不能在body插是因为该死的顶部状态栏
    // document.body.appendChild(inst.$el)
    document.querySelector('#app-container__main').appendChild(inst.$el)
    // 插入历史
    router.push({
      query: Object.assign({}, router.currentRoute.query, {
        'select': component.name || 'data',
        'selPageLen': len
      })
    })
  })
}

/**
 * 显示下一个选择页面
 */
// const showNextPage = ({ resolve, reject, component, instance, options }) => {
//   instance.visible = true
//   instance.options = options || {}
//   instance.currentView = component

//   window.location.hash = 'select=' + (component.name || 'data')

//   const hashchangeHandler = (event) => {
//     // todo resolve or reject data
//     const returnValue = instance.returnValue()
//     if (returnValue) {
//       resolve(returnValue)
//     } else {
//       reject('no data')
//     }
//     instance.visible = false
//     window.removeEventListener('hashchange', hashchangeHandler)
//   }

//   setTimeout(() => {
//     window.addEventListener('hashchange', hashchangeHandler, false)
//   }, 500)
// }

export default BmSelectPage
export { BmSelectPage }
