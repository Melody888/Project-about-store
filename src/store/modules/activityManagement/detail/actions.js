import api from '@/api'
import { Toast, Indicator } from 'mint-ui'

export default {
  getActivityInfo ({commit}, activityCode) {
    Indicator.open()
    return api.activity.getActivityInfo({
      data: {
        activityCode: activityCode,
        token: simpleLocalDb.getItem('token'),
        type: 'show'
      }
    }).then(res => {
      Indicator.close()
      if (res.responseCode === 0) {
        commit('activityInfo', res.activityInfo)
      } else {
        Toast(res.responseMsg)
      }
    })
  },
  getFieldConfByFieldType ({commit}) {
    Indicator.open()
    return api.activity.getFieldConfByFieldType({
      data: {
        fieldType: 'ACTIVITY_TYPE'
      }
    }).then(res => {
      Indicator.close()
      if (res.responseCode === 0) {
        var activityType = {}
        res.itemList.forEach((item) => {
          activityType[item.fieldCode] = item.fieldDesc
        })
        commit('activityType', activityType)
      }
    })
  },
  resetData ({ commit }) {
    commit('activityInfo', null)
    commit('activityType', {})
  }
}
