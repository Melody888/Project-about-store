import api from '@/api'
const state = {
  storeList: [],
  store: null, // 当前门店对象
  isResult: false, // 是否结果门店
  activeStoreIndex: 0 // 当前显示的门店所在列表中的序号
}

const getters = {
  storeList (state) {
    return state.storeList
  },
  store (state) {
    return state.store
  },
  isResult (state) {
    return state.isResult
  },
  activeStoreIndex (state) {
    return state.activeStoreIndex
  }
}

const mutations = {
  storeList (state, payload) {
    state.storeList = payload
  },
  activeStoreIndex (state, payload) {
    state.activeStoreIndex = payload // 更改当前显示的门店序号
    state.store = state.storeList[payload] // 更改当前显示的门店
  },
  store (state, payload) {
    state.store = payload
  },
  isResult (state, payload) {
    state.isResult = payload
  }
}

const actions = {
  fetchStoreList ({ state, commit }) {
    return api.myStore.getStoreListByUserId({
      data: {
        keyWork: '',
        pageFlag: 'mystore',
        planDate: new Date().getTime(),
        token: simpleLocalDb.getItem('token')
      }
    }).then(res => {
      if (res.responseCode === 0) {
        commit('storeList', res.itemList) // 初始化门店列表
        commit('activeStoreIndex', 0) // 初始化当前门店对象
      } else {
        this.$toast(res.responseMsg)
      }
    })
  }
}

export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions
}
