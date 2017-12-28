export default [{
  path: '/todayWork/workList',
  component: () => import(/* webpackChunkName: "todayWork" */'@/views/todayWork/workList')
}, {
  path: '/todayWork/storeClockOn',
  component: () => import(/* webpackChunkName: "todayWork" */'@/views/todayWork/storeClockOn')
}, {
  path: '/todayWork/storeClockOut',
  component: () => import(/* webpackChunkName: "todayWork" */'@/views/todayWork/storeClockOut')
}, {
  path: '/todayWork/clockOnDetail',
  component: () => import(/* webpackChunkName: "todayWork" */'@/views/todayWork/clockOnDetail')
}, {
  path: '/todayWork/salesReport',
  component: () => import(/* webpackChunkName: "todayWork" */'@/views/todayWork/salesReport')
}, {
  path: '/todayWork/officeDetail',
  component: () => import(/* webpackChunkName: "todayWork" */'@/views/todayWork/officeDetail')
}, {
  path: '/todayWork/workSummary',
  component: () => import(/* webpackChunkName: "todayWork" */'@/views/todayWork/workSummary')
}]
