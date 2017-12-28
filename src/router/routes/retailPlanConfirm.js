export default [
  {
    path: '/retailPlanConfirm',
    component: () => import(/* webpackChunkName: "retailPlanConfirm" */'@/views/retailPlanConfirm/index')
  },
  {
    path: '/retailPlanConfirm/check', // ?code=用户编号&date=查看时间戳&editing=是否进入制定计划界面（建议传当天0时0分时间戳）
    component: () => import(/* webpackChunkName: "retailPlanConfirm" */'@/views/retailPlanConfirm/check')
  },
  {
    path: '/retailPlanConfirm/history',
    component: () => import(/* webpackChunkName: "retailPlanConfirm" */'@/views/retailPlanConfirm/history')
  }
]
