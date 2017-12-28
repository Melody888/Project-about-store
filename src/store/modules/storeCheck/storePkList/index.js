import api from '@/api'
import { Toast } from 'mint-ui'
const state = {
  storePkList: [],
  pageIndex: 0,
  pageSize: 10,
  loading: false,
  loaded: false
}

const getters = {
  storePkList (state) {
    return state.storePkList
  },
  loading (state) {
    return state.loading
  },
  loaded (state) {
    return state.loaded
  },
  pageIndex (state) {
    return state.pageIndex
  },
  keyword (state) {
    return state.keyword
  }
}

const mutations = {
  storePkList (state, payload) {
    state.storePkList = payload
  },
  loading (state, payload) {
    state.loading = payload
  },
  loaded (state, payload) {
    state.loaded = payload
  },
  pageIndex (state, payload) {
    state.pageIndex = payload
  },
  keyword (state, payload) {
    state.keyword = payload
  }
}

const actions = {
  fetchStorePkList ({ state, commit }) {
    const storePkList = state.storePkList
    const pageIndex = state.pageIndex
    const pageSize = state.pageSize
    commit('loading', true)
    return api.storePk.getStorePkListByUserCode({
      data: {
        keyword: '',
        pageFlag: 'todayPk',
        pageIndex,
        pageSize,
        token: simpleLocalDb.getItem('token')
      }
    }).then(result => {
      if (result.responseCode === 0) {
        const pl = result.storeList
        if (pageIndex === 0) {
          commit('storePkList', pl)
        } else {
          commit('storePkList', storePkList.concat(pl))
        }
        commit('pageIndex', pageIndex + 1)
        if (pl.length < pageSize) {  // 认为已经全部加载
          commit('loaded', true)
        } else {
          commit('loading', false)
        }
      } else {
        commit('loaded', true)
        Toast(result.responseMsg)
      }
    })
  },
  resetStatusData ({ commit }) {
    commit('pageIndex', 0)
    commit('loaded', false)
    commit('loading', false)
  },
  resetData ({ commit, dispatch }) {
    commit('storePkList', [])
    dispatch('resetStatusData')
  }
}

export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions
}
