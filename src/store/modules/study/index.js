// import {Toast, Indicator} from 'mint-ui'
import api from '@/api'

export default {
  namespaced: true,
  state: {
    storeList: [],
    loading: false,
    loaded: false,
    pageIndex: 0
  },
  getters: {
    storeList (state) {
      return state.storeList
    },
    loading (state) {
      return state.loading
    },
    loaded (state) {
      return state.loaded
    },
    pageIndex (state) {
      return state.pageIndex
    }
  },
  actions: {
    // 调用api
    getstoreList ({commit, state}) {
      const pageSize = 15
      const storeList = state.storeList
      const pageIndex = state.pageIndex
      // Indicator.open()
      commit('loading', true)
      if (!state.loading || !state.loaded) {
        return api.study.getstoreList({
          data: {
            pageIndex,
            pageSize: pageSize,
            token: simpleLocalDb.getItem('token')
          }
        }).then(result => {
        // Indicator.close()
        // if (result.responseCode === 0) {
          if (typeof result.responseCode === 'number') {
            const pl = result.storeList
            if (pageIndex === 0) {
              commit('storeList', pl)
            } else {
              commit('storeList', storeList.concat(pl))
            }
            commit('pageIndex', pageIndex + 1)
            if (pl.length < pageSize) {
              commit('loaded', true)// 认为已经全部加载
            } else {
              commit('loading', false)
            }
          } else {
            commit('loaded', true)
          // Toast(result.responseMsg)
          }
        })
      }
    }
  },
  mutations: {
    storeList (state, payload) {
      state.storeList = payload
    },
    loading (state, payload) {
      state.loading = payload
    },
    loaded (state, payload) {
      state.loaded = payload
    },
    pageIndex (state, payload) {
      state.pageIndex = payload
    }
  }
}
