import api from '@/api'
import { Toast, Indicator } from 'mint-ui'

const state = {
  projectPerVo: {}
}

const getters = {
  projectPerVo (state) {
    return state.projectPerVo
  }
}

const mutations = {
  projectPerVo (state, playload) {
    state.projectPerVo = playload
  }
}

const actions = {
  fetchprojectPerVo ({state, commit}, playload) {
    Indicator.open()
    return api.storeAu.getProjectPerList({
      data: {
        fieldCode: playload.fieldCode,
        storeId: playload.storeId,
        token: simpleLocalDb.getItem('token')
      }
    }).then(
      result => {
        Indicator.close()
        if (result.responseCode === 0) {
          const pVo = result.projectPerVo
          commit('projectPerVo', pVo)
        } else {
          Toast(result.responseMsg)
        }
      }
    )
  }
}

export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions
}
