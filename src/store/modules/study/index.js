// import {Toast, Indicator} from 'mint-ui'
import api from '@/api'

export default {
  namespaced: true,
  state: {
    storeList: [],
    loading: false,
    loaded: false,
    pageIndex: 0,
    storeId: '',
    storeName: '',
    projectList: null,
    fieldCode: '',
    userId: '',
    projectPerVo: null,
    personVo: null
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
    getprojectList (state) {
      return state.projectList
    },
    getprojectPerVo (state) {
      return state.projectPerVo
    },
    getPersonInfoByParams (state) {
      return state.personVo
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
          }
        })
      }
    },
    // 编辑编制
    getprojectList ({commit, state}) {
      if (state.projectList == null) {
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
            commit('projectList', result.storeOrgVo.projectList)
          }
        })
      }
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
    },
    // 添加成员
    getPersonInfo ({commit, state}) {
      const fieldCode = state.fieldCode
      const storeId = state.storeId
      const userId = state.userId
      return api.study.getPersonInfoByParams({
        data: {
          fieldCode: fieldCode,
          storeId: storeId,
          userId: userId,
          token: simpleLocalDb.getItem('token')
        }
      }).then(res => {
        if (res.responseCode === 0) {
          commit('personVo', res.personVo)
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
    projectList (state, payload) {
      state.projectList = payload
    },
    // 修改项目编制数回到人员列表详情页看到对应项也修改
    updateProjecListSumPerNum (state, payload) {
      let items = state.projectList
      for (var i = 0; i < items.length; i++) {
        if (items[i].fieldCode === payload.code) {
          items[i].sumPerNum = payload.value
        }
      }
    },
    fieldCode (state, payload) {
      state.fieldCode = payload
    },
    projectPerVo (state, payload) {
      state.projectPerVo = payload
    },
    personVo (state, payload) {
      state.personVo = payload
    },
    // 添加人员信息后同步更新到编制列表
    refreshPersonListVo (state, playload) {
      if (state.projectList && state.projectList.length > 0) {
        state.projectList.forEach((item, FirIndex) => {
          if (item.fieldCode === playload.fieldCode) {
            if (playload.type === 'edit') {
              state.projectList[FirIndex]['personList'].splice(playload.perIndex, 1, playload.personVo)
            } else {
              state.projectList[FirIndex]['personList'].unshift(playload.personVo)
            }
            return
          }
        })
      }
    }
  }
}
