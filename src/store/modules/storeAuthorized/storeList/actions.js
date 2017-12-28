import { Toast, Indicator } from 'mint-ui'
import api from '@/api'

export default {
  getStoreOrgListByUserCode ({commit, state}) {
    const pageSize = 15
    const storeList = state.storeList
    const pageIndex = state.pageIndex
    Indicator.open()
    commit('loading', true)
    return api.storeAu.getStoreOrgListByUserCode({
      data: {
        pageIndex,
        pageSize,
        token: simpleLocalDb.getItem('token')
      }
    }).then(result => {
      Indicator.close()
      if (result.responseCode === 0) {
        const pl = result.storeList
        if (pageIndex === 0) {
          commit('storeList', pl)
        } else {
          commit('storeList', storeList.concat(pl))
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
    commit('storeList', [])
    dispatch('resetStatusData')
  }
}
