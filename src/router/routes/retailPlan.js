export default [
  {
    path: '/retailPlan',
    component: () => import(/* webpackChunkName: "retailPlan" */'@/views/retailPlan/index')
  },
  {
    // 制定计划、计划详情、编辑计划
    // check?date=查看日期（默认当天凌晨0点）&onlyAdd=是否进入只增加，不看详情的页面&onlyRead=是否进入只查看，不做任何编辑的页面
    path: '/retailPlan/check',
    component: () => import(/* webpackChunkName: "retailPlan" */'@/views/retailPlan/check')
  }
]
