import { setAppInfo } from './utils/native'
import router from '@/router'
import store from './store'
import App from './App'

let isLaunchedInApp = false

// 创建vue的根实例，并挂着到指定的元素中
const createVueInstance = (Vue) => {
  /* eslint-disable no-new */
  new Vue(Vue.util.extend({
    router,
    store
  }, App)).$mount('#app')
}

export default {
  launch: (Vue) => {
    // app 启动
    setAppInfo({
      callback: (data) => {
        global.appInfo = JSON.parse(data) // 将获取到的appInfo放在全局变量里面以供使用
        isLaunchedInApp = true
        createVueInstance(Vue)
      }
    })

    // 假设0.5s以后app没有启动，则使用web正常启动（try catch 无法捕获）
    setTimeout(() => {
      if (!isLaunchedInApp) {
        createVueInstance(Vue)
      }
    }, 500)
  }
}
