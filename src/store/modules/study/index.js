import {Toast, Indicator} from 'mint-ui'
import api from '@/api'

export default {
  namespaced: true,
  state: {
    storeList: [],
    loading: false,
    loaded: false,
    pageIndex: 0,
    storeOrgVo: {}, // 门店编制实体
    saveVo: {}, // 保存信息实体
    // storeId: '',
    // storeName: '',
    // projectList: null,
    // fieldCode: '',
    // userId: '',
    projectPerVo: {},
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
    storeOrgVo (state) {
      return state.storeOrgVo
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
      Indicator.open()
      commit('loading', true)
      if (!state.loading || !state.loaded) {
        return api.study.getstoreList({
          data: {
            pageIndex,
            pageSize: pageSize,
            token: simpleLocalDb.getItem('token')
          }
        }).then(result => {
          Indicator.close()
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
    // 编辑编制,通过判断编辑编制界面中的storeOrgVo是否有数据来渲染请求数据
    geteditDetail ({state, commit}, playload) {
      const data = JSON.stringify(state.storeOrgVo)
      if (data === '{}') {
        return api.study.getOrgInfoByStoreId({
          data: {
            storeId: playload,
            token: simpleLocalDb.getItem('token')
          }
        }).then(result => {
          if (result.responseCode === 0) {
            commit('storeOrgVo', result.storeOrgVo)
          }
        })
      }
    },
    // 项目成员
    getprojectPerVo ({state, commit}, playload) {
      return api.study.getProjectPerList({
        data: {
          fieldCode: playload.fieldCode,
          storeId: playload.storeId,
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
    },
    saveData ({state, commit}) {
      Indicator.open()
      commit('structured')
      return api.study.saveStoreOrgInfo({
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
    // 修改项目编制数回到人员列表详情页看到对应项也修改
    updateProjecListSumPerNum (state, payload) {
      let item = state.storeOrgVo.projectList
      for (var i = 0; i < item.length; i++) {
        if (item[i].fieldCode === payload.fieldCode) {
          item[i].sumPerNum = payload.sumPerNum
        }
      }
      // state.storeOrgVo.projectList[payload.index].sumPerNum = payload.sumPerNum
    },
    storeOrgVo (state, payload) {
      state.storeOrgVo = payload
    },
    projectPerVo (state, payload) {
      state.projectPerVo = payload
    },
    personVo (state, payload) {
      state.personVo = payload
    },
    // 添加人员信息后同步更新到编制列表
    refreshPersonListVo (state, playload) {
      if (state.storeOrgVo.projectList && state.storeOrgVo.projectList.length > 0) {
        state.storeOrgVo.projectList.forEach((item, FirIndex) => {
          if (item.fieldCode === playload.fieldCode) {
            if (playload.type === 'edit') {
              state.storeOrgVo.projectList[FirIndex].personList.splice(playload.index, 1, playload.personVo)
            } else {
              state.storeOrgVo.projectList[FirIndex].personList.unshift(playload.personVo)
            }
            return
          }
        })
      }
    },
    // 保存修改 数据
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
}
