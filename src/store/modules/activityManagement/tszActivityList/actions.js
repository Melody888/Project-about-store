import api from '@/api'
import { Toast, Indicator } from 'mint-ui'

export default {
  getActivityList ({commit, state}, storeId) {
    const pageSize = 20
    const activityList = state.activityList
    const pageIndex = state.pageIndex
    Indicator.open()
    commit('loading', true)
    return api.store360.getActivityList({
      data: {
        pageIndex,
        pageSize,
        storeId,
        token: simpleLocalDb.getItem('token'),
        type: 'activity'
      }
    }).then(result => {
      Indicator.close()
      if (result.responseCode === 0) {
        const pl = result.activityList
        if (pageIndex === 1) {
          commit('activityList', pl)
        } else {
          commit('activityList', activityList.concat(pl))
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
  getFieldConfByFieldType ({commit}) {
    Indicator.open()
    return api.activity.getFieldConfByFieldType({
      data: {
        fieldType: 'ACTIVITY_STATE'
      }
    }).then(res => {
      Indicator.close()
      if (res.responseCode === 0) {
        var status = {}
        res.itemList.forEach((item) => {
          status[item.fieldCode] = item.fieldDesc
        })
        commit('status', status)
      }
    })
  },
  resetStatusData ({ commit }) {
    commit('pageIndex', 1)
    commit('loaded', false)
    commit('loading', false)
  },
  resetData ({ commit, dispatch }) {
    commit('activityList', [])
    dispatch('resetStatusData')
  }
}
