export default [{
  path: '/storeDistribution',  // 列表
  component: () => import(/* webpackChunkName: "storeDistribution" */'@/views/storeDistribution/list')
}, {
  path: '/storeDistribution/detail/:marketCode',  // 详情页
  component: () => import(/* webpackChunkName: "storeDistribution" */'@/views/storeDistribution/detail')
}, {
  path: '/storeDistribution/detail/:marketCode/:showComment/:isOwnMarket',  // 详情页
  component: () => import(/* webpackChunkName: "storeDistribution" */'@/views/storeDistribution/detail')
}, {
  path: '/storeDistribution/add',  // 新增页
  component: () => import(/* webpackChunkName: "storeDistribution" */'@/views/storeDistribution/add')
}, {
  path: '/storeDistribution/edit/:marketCode',  // 编辑页
  component: () => import(/* webpackChunkName: "storeDistribution" */'@/views/storeDistribution/edit')
}, {
  path: '/storeDistribution/list',  // 列表
  component: () => import(/* webpackChunkName: "storeDistribution" */'@/views/storeDistribution/s360DistributionList')
}]
