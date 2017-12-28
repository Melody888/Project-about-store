import moment from 'moment'
import config from './utils/config'
import components from '@/components'
import advanced from './advanced'

export default (Vue) => {
  // 设置 localStorage 的前缀
  simpleLocalDb.setPrefix(config.APP_PROP_APP_TYPE)

  // token字段转换
  simpleLocalDb.setItem('token', window.localStorage.token || simpleLocalDb.getItem('token'))

  // 物理返回键
  global.app = {
    util: {
      isCloseWebView: () => {
        window.history.go(-1)
      }
    }
  }

  // 设置 moment 的语言
  moment.locale('zh-cn')
  components.bootstrap(Vue)  // 注册全局组件
  advanced.bootstrap(Vue)
  // 解决打开选择页面组件时刷新的问题，仅支持history模式的路由
  // if (location.hash) {
  //   history.go(-1)
  // }
}
