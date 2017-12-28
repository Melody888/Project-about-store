export default [{
  path: '/store360/list', // 主列表页面
  component: () => import(/* webpackChunkName: "store360" */'@/views/store360/list')
}, {
  path: '/store360/map', // 门店地图
  component: () => import(/* webpackChunkName: "store360" */'@/views/common/baiduMap')
}, {
  path: '/store360/pos', // pos门店详情
  component: () => import(/* webpackChunkName: "store360" */'@/views/store360/pos')
}, {
  path: '/store360/storeInfo', // 门店基本信息
  component: () => import(/* webpackChunkName: "store360" */'@/views/store360/storeInfo')
}, {
  path: '/store360/saleDetail', // 销量提报详情
  component: () => import(/* webpackChunkName: "store360" */'@/views/store360/saleDetail')
}, {
  path: '/store360/memberDetail', // 项目成员详情
  component: () => import(/* webpackChunkName: "store360" */'@/views/store360/memberDetail')
}, {
  path: '/store360/chargeDetail', // 负责人详情
  component: () => import(/* webpackChunkName: "store360" */'@/views/store360/chargeDetail')
}, {
  path: '/store360/storeList', // 我的门店
  component: () => import(/* webpackChunkName: "store360" */'@/views/store360/storeList')
}, {
  path: '/store360/storeCheck', // 门店盘库
  component: () => import(/* webpackChunkName: "store360" */'@/views/storeCheck/indexFor360')
}, {
  path: '/store360/storeCheckHistory', // 门店盘库历史
  component: () => import(/* webpackChunkName: "store360" */'@/views/storeCheck/historyFor360')
}, {
  path: '/store360/storeCheckDetail', // 门店盘库详情
  component: () => import(/* webpackChunkName: "store360" */'@/views/storeCheck/detail')
}]
