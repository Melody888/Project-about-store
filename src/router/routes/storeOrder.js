export default [{
  path: '/storeOrder', // 列表（待执行、历史订单）
  component: () => import(/* webpackChunkName: "storeOrder" */'@/views/storeOrder/list')
}, {
  path: '/storeOrder/lite', // 列表页(以门店为唯独的列表，store360中可用)
  component: () => import(/* webpackChunkName: "storeOrder" */'@/views/storeOrder/listLite')
}, {
  path: '/storeOrder/detail', // 订单详情页面
  component: () => import(/* webpackChunkName: "storeOrder" */'@/views/storeOrder/detail')
}, {
  path: '/storeOrder/edit', // 新增、编辑
  component: () => import(/* webpackChunkName: "storeOrder" */'@/views/storeOrder/edit')
}, {
  path: '/storeOrder/receive', // 订单收货编辑
  component: () => import(/* webpackChunkName: "storeOrder" */'@/views/storeOrder/receive')
}, {
  path: '/storeOrder/receiveDetail', // 订单收货详情
  component: () => import(/* webpackChunkName: "storeOrder" */'@/views/storeOrder/receiveDetail')
}, {
  path: '/storeOrder/deliverList', // 发货列表
  component: () => import(/* webpackChunkName: "storeOrder" */'@/views/storeOrder/deliverList')
}, {
  path: '/storeOrder/deliverDetail', // 发货详情
  component: () => import(/* webpackChunkName: "storeOrder" */'@/views/storeOrder/deliverDetail')
}, {
  path: '/storeOrder/comment', // 评论
  component: () => import(/* webpackChunkName: "storeOrder" */'@/views/storeOrder/comment')
}]
