import actions from './actions'
import getters from './getters'
import mutations from './mutations'

const state = {
  activityList: [],
  loading: false,
  loaded: false,
  myNum: 0,
  pageIndex: 1,
  status: {}
}

export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions
}

