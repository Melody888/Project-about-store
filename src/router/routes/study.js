export default [
  {
    path: '/study',
    component: () => import('@/views/study/index')
  },
  {
    path: '/study/editDetail',
    component: () => import('@/views/study/editDetail')
  },
  {
    path: '/study/addshop',
    component: () => import('@/views/study/addshop')
  }
]
