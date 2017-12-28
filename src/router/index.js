import Vue from 'vue'
import VueRouter from 'vue-router'
import routes from './routes'

Vue.use(VueRouter)

const router = new VueRouter({
  mode: 'history',
  base: '/FE/sfaVue',
  routes
})

router.beforeEach((to, from, next) => {
  // to and from are Route Object,next() must be called to resolve the hook
  next()
})

router.afterEach(route => {
  // hese hooks do not get a next function and cannot affect the navigation
})

export default router
