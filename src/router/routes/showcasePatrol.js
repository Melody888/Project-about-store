export default [
  {
    path: '/showcasePatrol',
    component: () => import(/* webpackChunkName: "showcasePatrol" */'@/views/showcasePatrol/index')
  },
  {
    path: '/showcasePatrol/edit', // query:id
    component: () => import(/* webpackChunkName: "showcasePatrol" */'@/views/showcasePatrol/edit')
  },
  {
    path: '/showcasePatrol/detail/:id',
    component: () => import(/* webpackChunkName: "showcasePatrol" */'@/views/showcasePatrol/detail')
  },
  {
    path: '/showcasePatrol/lite',
    component: () => import(/* webpackChunkName: "showcasePatrol" */'@/views/showcasePatrol/indexLite')
  }
]
