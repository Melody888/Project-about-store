// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import 'babel-polyfill' // 引入垫片库，解决某些 API 不转化
import 'simple-local-db' // simpleLocalDb，最好在一开始引入，保证后面的安全使用
import '@/utils/flexible'
import Vue from 'vue'
import configure from './configure'
import appInstance from './appInstance'
import MintUI from 'mint-ui'
import 'mint-ui/lib/style.css'
import 'mint-ui/lib/font/style.css'

/** 获取应用数据 包括client、cuid等，以及sfa的物理返回控制、本身app的启动 **/
global.app = global.app ? global.app : {}
global.app.appInfo = {}

// 防止生产环境下提供 vue 组件提示
Vue.config.productionTip = false
// 执行配置, 尽量放前
configure(Vue)
// 使用 mint-ui
Vue.use(MintUI)
// 启动 app
appInstance.launch(Vue)
