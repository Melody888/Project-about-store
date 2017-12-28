import api from '@/api'
import MarketModel from './MarketModel'
import ProductModel from './ProductModel'
export default {
  namespaced: true,
  state: {
    marketList: [],
    initProdList: [],
    marketDetail: {
      marketFeedback: {},
      marketPollingInfo: {},
      marketProdList: []
    },
    timestamp: 0,
    createBy: ''
  },
  actions: {
    fetchMarketPollingList360 ({commit}, {createBy, pageSize = 10, timestamp = 0, keyword, storeId}) {
      return api.storeDistribution.getMarketPollingList360({
        data: {
          token: simpleLocalDb.getItem('token'),
          storeId,
          createBy,
          pageSize,
          timestamp,
          keyword
        }
      }).then(result => {
        if (result.responseCode === 0) {
          // 是加载更多数据还是新数据
          if (timestamp === 0) {
            commit('setMarketList', result.marketPollingList)
          } else {
            commit('pushMarketList', result.marketPollingList)
          }
          commit('setTimestamp', result.timestamp)
          commit('setCreateBy', result.createBy)
        }
        return result
      })
    },
    fetchMarketPollingList ({commit}, {createBy, pageSize = 10, timestamp = 0, keyword}) {
      return api.storeDistribution.getMarketPollingList({
        data: {
          token: simpleLocalDb.getItem('token'),
          createBy,
          pageSize,
          timestamp,
          keyword
        }
      }).then(result => {
        if (result.responseCode === 0) {
          // 是加载更多数据还是新数据
          if (timestamp === 0) {
            commit('setMarketList', result.marketPollingList)
          } else {
            commit('pushMarketList', result.marketPollingList)
          }
          commit('setTimestamp', result.timestamp)
          commit('setCreateBy', result.createBy)
        }
        return result
      })
    },
    fetchInitMarketProd ({commit}, {storeId}) {
      return api.storeDistribution.initMarketProd({
        data: {
          storeId,
          token: simpleLocalDb.getItem('token')
        }
      }).then(result => {
        if (result.responseCode === 0) {
          let productList = result.marketProdList.map(item => {
            delete item.price
            delete item.startTime
            delete item.endTime
            return item
          })
          commit('setInitProdList', productList)
        }
      })
    },
    saveMarketPolling ({commit}, {marketCode, marketProdList, remark, storeId, storeName}) {
      return api.storeDistribution.saveMarketPolling({
        data: {
          marketCode,
          marketProdList,
          remark,
          storeId,
          storeName,
          token: simpleLocalDb.getItem('token')
        }
      })
    },
    fetchMarketPollingDetails ({commit}, {marketCode, optType}) {
      return api.storeDistribution.marketPollingDetails({
        data: {
          marketCode,
          optType,
          token: simpleLocalDb.getItem('token')
        }
      }).then(result => {
        if (result.responseCode === 0) {
          commit('setMarketDetail', result)
          if (optType === 'edit') {
            commit('setInitProdList', result.marketProdList)
          }
        }
      })
    },
    saveMarketFeedback ({commit}, {agreeNum, agreeType, content, marketCode, type}) {
      return api.storeDistribution.saveMarketFeedback({
        data: {
          agreeNum,
          agreeType,
          content,
          marketCode,
          type,
          token: simpleLocalDb.getItem('token')
        }
      })
    }
  },
  getters: {
    getMarketList (state) {
      return state.marketList
    },
    getInitProdList (state) {
      return state.initProdList
    },
    getMarketDetail (state) {
      return state.marketDetail
    },
    getTimestamp (state) {
      return state.timestamp
    },
    getCreateBy (state) {
      return state.createBy
    }
  },
  mutations: {
    setMarketList (state, data) {
      state.marketList = data.map(item => {
        return new MarketModel(item)
      })
    },
    pushMarketList (state, data) {
      let newList = data.map(item => {
        return new MarketModel(item)
      })
      let oldList = state.marketList
      let margeList = oldList.concat(newList)
      state.marketList = margeList
    },
    setTimestamp (state, data) {
      state.timestamp = data
    },
    setCreateBy (state, data) {
      state.createBy = data
    },
    setInitProdList (state, data) {
      state.initProdList = data.map(item => {
        return new ProductModel(item)
      })
    },
    addProduct (state, data) {
      data.forEach(item => {
        var isExist = false
        state.initProdList.forEach(prod => {
          if (prod.prdId === item.prdId) {
            isExist = true
          }
        })
        if (!isExist) {
          delete item.price
          state.initProdList.unshift(new ProductModel(item))
        }
      })
    },
    deleteProduct (state, index) {
      state.initProdList.splice(index, 1)
    },
    updateProduct (state, {index, product}) {
      state.initProdList[index] = product
    },
    setMarketDetail (state, data) {
      state.marketDetail.marketFeedback = data.marketFeedback
      state.marketDetail.marketPollingInfo = data.marketPollingInfo
      state.marketDetail.marketProdList = data.marketProdList
    }
  }
}
