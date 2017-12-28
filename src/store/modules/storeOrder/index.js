import api from '@/api'
import { Toast } from 'mint-ui'
const state = {
  tab: 'STORE',
  handleOrderList: [],
  historyOrderList: [],
  handleOrderData: null,
  historyOrderData: null,
  timestamp: 0,
  createBy: '',
  pageSize: 10,
  loading: false,
  loaded: false,
  filterStore: '',
  filterDate: 0,
  liteStoreId: '',
  liteTab: '',
  liteHandleOrderList: [],
  liteHistoryOrderList: [],
  liteHandleOrderData: null,
  liteHistoryOrderData: null,
  liteTimestampForHandle: null,
  liteCreateByForHandle: '',
  liteTimestampForHistory: null,
  liteCreateByForHistory: '',
  liteHandleOrderLoaded: false,
  liteHistoryOrderLoaded: false,
  liteLoading: false,
  liteFilterStore: '',
  liteFilterDate: null
}

const getters = {
  tab (state) {
    return state.tab
  },
  loading (state) {
    return state.loading
  },
  loaded (state) {
    return state.loaded
  },
  createBy (state) {
    return state.createBy
  },
  timestamp (state) {
    return state.timestamp
  },
  historyOrderList (state) {
    return state.historyOrderList
  },
  handleOrderList (state) {
    return state.handleOrderList
  },
  historyOrderData (state) {
    return state.historyOrderData
  },
  handleOrderData (state) {
    return state.handleOrderData
  },
  liteStoreId (state) { return state.liteStoreId },
  liteTab (state) { return state.liteTab },
  liteHandleOrderList (state) { return state.liteHandleOrderList },
  liteHistoryOrderList (state) { return state.liteHistoryOrderList },
  liteHandleOrderData (state) { return state.liteHandleOrderData },
  liteHistoryOrderData (state) { return state.liteHistoryOrderData },
  liteTimestampForHandle (state) { return state.liteTimestampForHandle },
  liteCreateByForHandle (state) { return state.liteCreateByForHandle },
  liteTimestampForHistory (state) { return state.liteTimestampForHistory },
  liteCreateByForHistory (state) { return state.liteCreateByForHistory },
  liteHandleOrderLoaded (state) { return state.liteHandleOrderLoaded },
  liteHistoryOrderLoaded (state) { return state.liteHistoryOrderLoaded },
  liteLoading (state) { return state.liteLoading },
  liteFilterStore (state) { return state.liteFilterStore },
  liteFilterDate (state) { return state.liteFilterDate }
}

const mutations = {
  tab (state, payload) {
    state.tab = payload
  },
  loading (state, payload) {
    state.loading = payload
  },
  loaded (state, payload) {
    state.loaded = payload
  },
  createBy (state, payload) {
    state.createBy = payload
  },
  timestamp (state, payload) {
    state.timestamp = payload
  },
  handleOrderList (state, payload) {
    state.handleOrderList = payload
  },
  historyOrderList (state, payload) {
    state.historyOrderList = payload
  },
  handleOrderData (state, payload) {
    state.handleOrderData = payload
  },
  historyOrderData (state, payload) {
    state.historyOrderData = payload
  },
  historyFold (state, payload) {
    state.historyOrderList[payload].isFold = !state.historyOrderList[payload].isFold
  },
  liteHistoryFold (state, payload) {
    state.liteHistoryOrderList[payload].isFold = !state.liteHistoryOrderList[payload].isFold
  },
  handleFold (state, payload) {
    state.handleOrderList[payload].isFold = !state.handleOrderList[payload].isFold
  },
  liteHandleFold (state, payload) {
    state.liteHandleOrderList[payload].isFold = !state.liteHandleOrderList[payload].isFold
  },
  filterDate (state, payload) {
    state.filterDate = payload
  },
  filterStore (state, payload) {
    state.filterStore = payload
  },
  comment (state, payload) {
    //
    if (payload.type === 'STORE') {
      state.handleOrderList[payload.commentIndex].feedbackInfoList.unshift({
        content: payload.content,
        createByName: payload.commentName,
        createTimestamp: new Date().getTime()
      })
    } else {
      state.historyOrderList[payload.commentIndex].feedbackInfoList.unshift({
        content: payload.content,
        createByName: payload.commentName,
        createTimestamp: new Date().getTime()
      })
    }
  }
}

const actions = {
  fetchHandleOrderList ({ state, commit }) {
    const handleOrderList = state.handleOrderList
    const timestamp = state.timestamp
    const pageSize = state.pageSize
    const createBy = state.createBy
    commit('loading', true)
    return api.storeOrder.getWaitHandleOrder({
      data: {
        createBy,
        timestamp,
        pageSize,
        token: simpleLocalDb.getItem('token')
      }
    }).then(result => {
      if (result.responseCode === 0) {
        commit('handleOrderData', result)
        const ol = result.orderList.map((item) => {
          item.isFold = true
          return item
        })
        if (timestamp === 0) {
          commit('handleOrderList', ol)
        } else {
          commit('handleOrderList', handleOrderList.concat(ol))
        }
        if (ol.length) {
          commit('timestamp', ol[ol.length - 1].createTimestamp)
          commit('createBy', ol[ol.length - 1].createBy)
        }
        if (ol.length < pageSize) {  // 认为已经全部加载
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
  fetchHistoryOrderList ({state, commit}) {
    const historyOrderList = state.historyOrderList
    const timestamp = state.timestamp
    const pageSize = state.pageSize
    const createBy = state.createBy
    const createTimeMonth = state.filterDate && state.filterDate.getTime()
    const storeKey = state.filterStore
    commit('loading', true)
    return api.storeOrder.getHistoryOrder({
      data: {
        createBy,
        createTimeMonth,
        storeKey,
        timestamp,
        pageSize,
        token: simpleLocalDb.getItem('token')
      }
    }).then(result => {
      if (result.responseCode === 0) {
        commit('historyOrderData', result)
        const ol = result.orderList.map((item) => {
          item.isFold = true
          return item
        })
        if (timestamp === 0) {
          commit('historyOrderList', ol)
        } else {
          commit('historyOrderList', historyOrderList.concat(ol))
        }
        if (ol.length) {
          commit('timestamp', ol[ol.length - 1].createTimestamp)
          commit('createBy', ol[ol.length - 1].createBy)
        }
        if (ol.length < pageSize) {  // 认为已经全部加载
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
  resetSearch ({ commit }) {
    commit('filterStore', '')
    commit('filterDate', 0)
  },
  resetStatusData ({ commit }) {
    commit('timestamp', 0)
    commit('createBy', '')
    commit('loaded', false)
    commit('loading', false)
  },
  resetData ({ commit, dispatch }) {
    commit('handleOrderList', [])
    commit('historyOrderList', [])
    dispatch('resetStatusData')
  },
  async liteFetchHandleOrderList ({ state }, refreshing = false) {
    state.liteLoading = true
    let res = await api.storeOrder.store360GetWaitHandleStoreOrder({
      data: {
        'createBy': !refreshing ? state.liteCreateByForHandle : '',
        'pageSize': state.pageSize,
        'storeId': state.liteStoreId,
        'timestamp': !refreshing ? state.liteTimestampForHandle : null,
        'token': simpleLocalDb.getItem('token')
      },
      _NEED_CODE_0: true,
      _INDICATOR: true
    }).catch(function (err) {
      setTimeout(function () {
        state.liteLoading = false
      }, 3000)
      throw err
    })
    state.liteLoading = false
    state.liteHandleOrderData = res
    let list = res['orderList']
    if (refreshing || !state.liteTimestampForHandle) state.liteHandleOrderList = []
    for (let item of list) {
      item['isFold'] = true
      state.liteHandleOrderList.push(item)
    }
    if (list.length) {
      state.liteTimestampForHandle = list[list.length - 1]['createTimestamp']
      state.liteCreateByForHandle = list[list.length - 1]['createBy']
    }
    state.liteHandleOrderLoaded = list.length < state.pageSize
    return res
  },
  async liteFetchHistoryOrderList ({ state }, refreshing = false) {
    state.liteLoading = true
    let res = await api.storeOrder.store360GetHistoryStoreOrder({
      data: {
        'createBy': !refreshing ? state.liteCreateByForHistory : '',
        'createTimeMonth': state.liteFilterDate ? +state.liteFilterDate : null,
        'pageSize': state.pageSize,
        'storeId': state.liteStoreId,
        'timestamp': !refreshing ? state.liteTimestampForHistory : null,
        'token': simpleLocalDb.getItem('token')
      },
      _NEED_CODE_0: true,
      _INDICATOR: true
    }).catch(function (err) {
      setTimeout(function () {
        state.liteLoading = false
      }, 3000)
      throw err
    })
    state.liteLoading = false
    state.liteHistoryOrderData = res
    let list = res['orderList']
    if (refreshing || !state.liteTimestampForHistory) state.liteHistoryOrderList = []
    for (let item of list) {
      item['isFold'] = true
      state.liteHistoryOrderList.push(item)
    }
    if (list.length) {
      state.liteTimestampForHistory = list[list.length - 1]['createTimestamp']
      state.liteCreateByForHistory = list[list.length - 1]['createBy']
    }
    state.liteHistoryOrderLoaded = list.length < state.pageSize
    return res
  },
  liteResetCache ({ state, dispatch }) {
    state.liteStoreId = ''
    dispatch('liteResetSearch')
    dispatch('liteResetData')
  },
  liteResetSearch ({ state }) {
    state['liteFilterStore'] = ''
    state['liteFilterDate'] = null
  },
  liteResetStatusData ({ state }) {
    state.liteliteLoading = false
    state.liteTimestampForHandle = null
    state.liteCreateByForHandle = ''
    state.liteHandleOrderLoaded = false
    state.liteTimestampForHistory = null
    state.liteCreateByForHistory = ''
    state.liteHistoryOrderLoaded = false
  },
  liteResetData ({ state, dispatch }) {
    state.liteHandleOrderList = []
    state.liteHistoryOrderList = []
    dispatch('liteResetStatusData')
  }
}

export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions
}
