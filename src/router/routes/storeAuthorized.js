export default [{
  path: '/storeAuthorized',
  component: () => import(/* webpackChunkName: "storeAuthorized" */'@/views/storeAuthorized/list')
}, {
  path: '/storeAuthorized/editDetail',
  component: () => import(/* webpackChunkName: "storeAuthorized" */'@/views/storeAuthorized/editDetail')
}, {
  path: '/storeAuthorized/editPersonnel',
  component: () => import(/* webpackChunkName: "storeAuthorized" */'@/views/storeAuthorized/editPersonnel')
}, {
  path: '/storeAuthorized/editPost',
  component: () => import(/* webpackChunkName: "storeAuthorized" */'@/views/storeAuthorized/editPost')
}, {
  path: '/storeAuthorized/s360AuDetail',
  component: () => import(/* webpackChunkName: "storeAuthorized" */'@/views/storeAuthorized/s360AuDetail')
}, {
  path: '/storeAuthorized/s360AuPost',
  component: () => import(/* webpackChunkName: "storeAuthorized" */'@/views/storeAuthorized/s360AuPost')
}]

