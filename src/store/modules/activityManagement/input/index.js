import actions from './actions'
import getters from './getters'
import mutations from './mutations'

const state = {
  type: '',
  originActivity: null,
  activityTypes: [],
  storeResources: [],
  activityCode: '',
  storeId: '',
  storeName: '',
  activityTopic: '',
  activityType: '',
  cooperationList: [],
  startDate: null,
  endDate: null,
  resourceList: [],
  costList: [],
  productList: [],
  materielList: [],
  longPro: 0,
  tempPro: 0,
  remark: ''
}

export default {
  namespaced: true,
  state,
  actions,
  getters,
  mutations
}
