const state = {
  store: null
}

const getters = {
  // 获取用户信息
  store (state) {
    return state.store
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
