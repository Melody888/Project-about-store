import notFound from '@/views/notFound'
import storeCheck from './storeCheck'
import storeAuthorized from './storeAuthorized'
import storeOrder from './storeOrder'
import storeDistribution from './storeDistribution'
import home from '@/views/index'
import activityManagement from './activityManagement'
import showcasePatrol from './showcasePatrol'
import store360 from './store360'
import storePlanOrder from './storePlanOrder'
import todayWork from './todayWork'
import RetailPlan from './retailPlan'
import RetailPlanConfirm from './retailPlanConfirm'
import study from './study'

let routes = []

routes = routes
  .concat(storeCheck)
  .concat(storeOrder)
  .concat(storeDistribution)
  .concat(activityManagement)
  .concat(showcasePatrol)
  .concat(storeAuthorized)
  .concat(store360)
  .concat(storePlanOrder)
  .concat(todayWork)
  .concat(RetailPlan)
  .concat(RetailPlanConfirm)
  .concat(study)

// 首页配置必须放到最前面
routes.unshift({
  path: '/', // 首页
  component: home
})

// 404配置必须放到最后面
routes.push({
  path: '/*', // 项目的404配置
  component: notFound
})

export default routes
