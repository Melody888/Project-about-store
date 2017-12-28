export default [{
  path: '/storePlanOrder',
  component: () => import(/* webpackChunkName: storePlanOrder */'@/views/storePlanOrder/list')
}, {
  path: '/storePlanOrder/detail',
  component: () => import(/* webpackChunkName: storePlanOrder */'@/views/storePlanOrder/detail')
}]
