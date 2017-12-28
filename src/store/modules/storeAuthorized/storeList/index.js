import actions from './actions'
import mutations from './mutations'
import getters from './getters'

const state = {
  storeList: [],
  loading: false,
  loaded: false,
  pageIndex: 0
}

export default {
  namespaced: true,
  state,
  actions,
  mutations,
  getters
}
