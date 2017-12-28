export default [{
  path: '/storeCheck',
  component: () => import(/* webpackChunkName: "storeCheck" */'@/views/storeCheck')
}, {
  path: '/storeCheck/history',
  component: () => import(/* webpackChunkName: "storeCheck" */'@/views/storeCheck/history')
}, {
  path: '/storeCheck/inputInfo',
  component: () => import(/* webpackChunkName: "storeCheck" */'@/views/storeCheck/inputInfo')
}, {
  path: '/storeCheck/selectPkStore',
  component: () => import(/* webpackChunkName: "storeCheck" */'@/views/storeCheck/selectPkStore')
}, {
  path: '/storeCheck/detail',
  component: () => import(/* webpackChunkName: "storeCheck" */'@/views/storeCheck/detail')
}]
