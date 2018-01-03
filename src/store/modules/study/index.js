// import {Toast, Indicator} from 'mint-ui'
import api from '@/api'

export default {
  namespaced: true,
  state: {
    storeList: [],
    // storeList [] = [klajslkfja]
    loading: false,
    loaded: false,
    pageIndex: 0,
    // detail: {}
    storeId: '',
    storeName: '',
    totalSumPerNum: '',
    totalReadyPerNum: '',
    projectList: null,
    fieldCode: '',
    projectPerVo: null
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
    },
    getstoreId (state) {
      return state.storeId
    },
    getstoreName (state) {
      return state.storeName
    },
    getsumPerNum (state) {
      return state.totalSumPerNum
    },
    getreadyPerNum (state) {
      return state.totalReadyPerNum
    },
    getprojectList (state) {
      return state.projectList
    },
    getprojectPerVo (state) {
      return state.projectPerVo
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
    },
    // 编辑编制
    getprojectList ({commit, state}) {
      const storeId = state.storeId
      return api.study.getOrgInfoByStoreId({
        data: {
          storeId: storeId,
          token: simpleLocalDb.getItem('token')
        }
      }).then(result => {
        if (result.responseCode === 0) {
          commit('storeId', result.storeOrgVo.storeId)
          commit('storeName', result.storeOrgVo.storeName)
          commit('totalSumPerNum', result.storeOrgVo.sumPerNum)
          commit('totalReadyPerNum', result.storeOrgVo.readyPerNum)
          commit('projectList', result.storeOrgVo.projectList)
        }
      })
    },
    // 项目成员
    getPersonList ({commit, state}) {
      const fieldCode = state.fieldCode
      const storeId = state.storeId
      return api.study.getProjectPerList({
        data: {
          fieldCode: fieldCode,
          storeId: storeId,
          token: simpleLocalDb.getItem('token')
        }
      }).then(res => {
        if (res.responseCode === 0) {
          commit('projectPerVo', res.projectPerVo)
        } else {
          console.log(false)
        }
      })
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
    },
    storeId (state, payload) {
      state.storeId = payload
    },
    storeName (state, payload) {
      state.storeName = payload
    },
    totalSumPerNum (state, payload) {
      state.totalSumPerNum = payload
    },
    totalReadyPerNum (state, payload) {
      state.totalReadyPerNum = payload
    },
    projectList (state, payload) {
      state.projectList = payload
    },
    fieldCode (state, payload) {
      state.fieldCode = payload
    },
    projectPerVo (state, payload) {
      state.projectPerVo = payload
    },
    // 查看项目人员详细列表修改编制人数
    updateSumPerNum (state, payload) {
      state.storeOrgVo.projectList[payload.index].sumPerNum = payload.sumPerNum
    }

  }
}
