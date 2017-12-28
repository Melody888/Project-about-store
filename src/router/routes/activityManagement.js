export default [{
  path: '/activityManagement',
  component: () => import(/* webpackChunkName: "activityManagement" */'@/views/activityManagement')
}, {
  path: '/activityManagement/history',
  component: () => import(/* webpackChunkName: "activityManagement" */'@/views/activityManagement/history')
}, {
  path: '/activityManagement/input',
  component: () => import(/* webpackChunkName: "activityManagement" */'@/views/activityManagement/input')
}, {
  path: '/activityManagement/inputRecord',
  name: 'inputRecord',
  component: () => import(/* webpackChunkName: "activityManagement" */'@/views/activityManagement/inputRecord')
}, {
  path: '/activityManagement/inputReport',
  name: 'inputReport',
  component: () => import(/* webpackChunkName: "activityManagement" */'@/views/activityManagement/inputReport')
}, {
  path: '/activityManagement/detail/:activityCode',
  component: () => import(/* webpackChunkName: "activityManagement" */'@/views/activityManagement/detail')
}, {
  path: '/activityManagement/executeHistory/:activityCode',
  component: () => import(/* webpackChunkName: "activityManagement" */'@/views/activityManagement/executeHistory')
}, {
  path: '/activityManagement/finalReport',
  component: () => import(/* webpackChunkName: "activityManagement" */'@/views/activityManagement/finalReport')
}, {
  path: '/activityManagement/tszIndex',
  component: () => import(/* webpackChunkName: "activityManagement" */'@/views/activityManagement/tszIndex')
}, {
  path: '/activityManagement/tszHistory',
  component: () => import(/* webpackChunkName: "activityManagement" */'@/views/activityManagement/tszHistory')
}]
