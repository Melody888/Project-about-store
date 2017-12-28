import api from '@/api'
import { Toast, Indicator } from 'mint-ui'

const state = {
  storeOrgVo: {},  // 门店编制实体
  saveVo: {} // 保存信息实体
}
const getters = {
  // 获取门店编制实体
  storeOrgVo (state) {
    return state.storeOrgVo
  }
}
const mutations = {
  updateSumPerNum (state, payload) {
    state.storeOrgVo.projectList[payload.index].sumPerNum = payload.sumPerNum
  },
  storeOrgVo (state, playload) {
    state.storeOrgVo = playload
  },
  // 替换StoreOrgVo 中projectList 数组指定位置对象
  refreshStoreOrgVo (state, playload) {
    state.storeOrgVo['projectList'].forEach((item, index) => {
      if (item.fieldCode === playload.fieldCode) {
        state.storeOrgVo['projectList'].splice(index, 1, playload)
      }
    })
  },
  // 替换 StoreOrgVo 中projectList.personList 数组指定位置对象
  refreshPersonListVo (state, playload) {
    state.storeOrgVo['projectList'].forEach((item, FirIndex) => {
      if (item.fieldCode === playload.fieldCode) {
        if (playload.type === 'edit') {
          state.storeOrgVo['projectList'][FirIndex]['personList'].splice(playload.perIndex, 1, playload.personVo)
        } else {
          state.storeOrgVo['projectList'][FirIndex]['personList'].unshift(playload.personVo)
        }
        return
      }
    })
  },
  structured (state) {
    state.saveVo['storeId'] = state.storeOrgVo['storeId']
    const projectList = state.storeOrgVo['projectList'].map(project => {
      return {
        fieldCode: project.fieldCode,
        personList: project.personList.map(person => {
          return {
            endDate: person.endDate === 0 ? 253402185600000 : person.endDate,
            fieldList: person.fieldList.map(field => {
              return {
                fieldCode: field.selectCode,
                fieldContent: field.fieldContent
              }
            }),
            levelContent: person.levelContent,
            levelNum: person.levelNum,
            startDate: person.startDate,
            userId: person.userId
          }
        }),
        sumPerNum: project.sumPerNum
      }
    })
    state.saveVo['projectList'] = projectList
    state.saveVo['token'] = simpleLocalDb.getItem('token')
  }
}

const actions = {
  fetchSaveVO ({state, commit}) {
    console.log(state.saveVo, 'saveVo')
    Indicator.open()
    commit('structured')
    return api.storeAu.saveStoreOrgInfo({
      data: state.saveVo
    }).then(
      result => {
        Indicator.close()
        if (result.responseCode === 0) {
          Toast('保存成功')
          return true
        } else {
          Toast(result.responseMsg)
          return false
        }
      }
    )
  },
  fetchStoreOrgVo ({state, commit}, playload) {
    Indicator.open()
    return api.storeAu.getStoreOrgInfoByStoreId({
      data: {
        storeId: playload,
        token: simpleLocalDb.getItem('token')
      }
    }).then(
      result => {
        Indicator.close()
        if (result.responseCode === 0) {
          commit('storeOrgVo', result.storeOrgVo)
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
