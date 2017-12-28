const state = {
  pkDetail: null
}

const getters = {
  // 获取门店详情
  pkDetail (state) {
    return state.pkDetail
  }
}

const mutations = {
  // 更新用户信息
  store (state, payload) {
    state.store = payload
  }
}

const actions = {

}

export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions
}
