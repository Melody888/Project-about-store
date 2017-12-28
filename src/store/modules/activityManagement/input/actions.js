import api from '@/api'
import router from '@/router'
import { Toast } from 'mint-ui'

export default {
  fetchActivity ({ state, commit }) {
    return api.activity.getActivityInfo({
      data: {
        activityCode: state.activityCode,
        token: simpleLocalDb.getItem('token')
      }
    }).then(result => {
      if (result.responseCode === 0) {
        const activity = result.activityInfo
        commit('originActivity', JSON.parse(JSON.stringify(activity)))
        commit('storeId', activity.storeId)
        commit('storeName', activity.storeName)
        commit('activityTopic', activity.activityTopic)
        commit('activityType', activity.activityType)
        commit('cooperationList', activity.cooperationList)
        commit('startDate', activity.startDate)
        commit('endDate', activity.endDate)
        commit('resourceList', activity.resourceList)
        commit('costList', activity.costList)
        commit('productList', activity.productList)
        commit('materielList', activity.materielList)
        commit('longPro', activity.longPro)
        commit('tempPro', activity.tempPro)
        commit('remark', activity.remark)
      }
    })
  },
  fetchActivityTypes ({ state, commit }) {
    return api.plan.getFieldConfByFieldType({
      data: {
        fieldType: 'ACTIVITY_TYPE'
      }
    }).then(result => {
      if (result.responseCode === 0) {
        commit('activityTypes', result.itemList)
      }
    })
  },
  fetchStoreResources ({ state, commit }) {
    return api.activity.getResourceList().then(result => {
      if (result.responseCode === 0) {
        commit('storeResources', result.resourceList)
      }
    })
  },
  saveActivity ({ state, commit }) {
    return api.activity.saveActivity({
      data: {
        activityCode: state.activityCode,
        activityTopic: state.activityTopic,
        activityType: state.activityType,
        cooperationList: state.cooperationList,
        costList: state.costList,
        endDate: state.endDate,
        isClose: state.isClose,
        longPro: state.longPro,
        materielList: state.materielList,
        productList: state.productList,
        remark: state.remark,
        resourceList: state.resourceList,
        startDate: state.startDate,
        storeId: state.storeId,
        storeName: state.storeName,
        tempPro: state.tempPro,
        totalMateriel: state.totalMateriel,
        totalResource: state.totalResource,
        type: state.type,
        token: simpleLocalDb.getItem('token')
      }
    }).then(result => {
      if (result.responseCode === 0) {
        router.go(-1)
        Toast('保存成功')
      } else {
        Toast(result.responseMsg)
      }
    })
  },
  resetData ({ state, commit }) {

  }
}
