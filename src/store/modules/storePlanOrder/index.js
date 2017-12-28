import api from '@/api'
import { Toast } from 'mint-ui'

const state = {
  activeTab: 'storePlan',      // 标记当前活动tab(计划订单/历史计划)
  storeInfo: {                 // 纪录当前查询的门店id
    storeId: '',
    storeName: ''
  },
  storePlan: [],               // 计划订单列表数据
  storePlanControl: {          // 计划订单列表分页控制
    pageIndex: 0,
    pageSize: 10,
    loading: false,
    loaded: false
  },
  storePlanTotal: 0,           // 计划订单列表数据总数
  historyPlan: [],             // 历史订单列表数据
  historyPlanControl: {        // 历史订单列表分页控制
    pageIndex: 0,
    pageSize: 10,
    loading: false,
    loaded: false
  },
  planDetail: {}               // 订单详情页数据
}

const getters = {
  activeTab (state) {
    return state.activeTab
  },
  storeInfo (state) {
    return state.storeInfo
  },
  storePlan (state) {
    return state.storePlan
  },
  // 获取计划订单列表分页的加载状态
  storePlanControlLoading (state) {
    return state.storePlanControl.loading
  },
  storePlanTotal (state) {
    return state.storePlanTotal
  },
  historyPlan (state) {
    return state.historyPlan
  },
  // 获取历史订单列表分页的加载状态
  historyPlanControlLoading (state) {
    return state.historyPlanControl.loading
  },
  planDetail (state) {
    return state.planDetail
  }
}

const mutations = {
  setActiveTab (state, payload) {
    state.activeTab = payload
  },
  setStoreInfo (state, payload) {
    state.storeInfo = payload
  },
  setStorePlanTotal (state, payload) {
    state.storePlanTotal = payload
  },
  setStorePlan (state, payload) {
    state.storePlan = payload
  },
  // 根据索引，删除storePlan中指定的数据
  delStoreOrder (state, payload) {
    let index = payload.index.split('')
    if (state.storePlan.length > 0 && index.length === 2) {
      let plan = state.storePlan[index[0]]
      if (plan.orderList.length < 2) {
        state.storePlan.splice(index[0], 1)
      } else {
        plan.orderList.splice(index[1], 1)
      }
    }
    // 总数自减
    state.storePlanTotal--
  },
  setStorePlanControl (state, payload) {
    state.storePlanControl = Object.assign({}, state.storePlanControl, payload)
  },
  setHistoryPlanControl (state, payload) {
    state.historyPlanControl = Object.assign({}, state.historyPlanControl, payload)
  },
  // 重置分页控制参数
  setControlDefault (state, payload) {
    let control = payload.type === 'storePlan' ? 'storePlanControl' : 'historyPlanControl'
    state[control] = {
      pageIndex: 0,
      pageSize: 10,
      loading: false,
      loaded: false
    }
  },
  setHistoryPlan (state, payload) {
    state.historyPlan = payload
  },
  setPlanDetail (state, payload) {
    state.planDetail = payload
  },
  addOrderPrd (state, payload) {
    state.planDetail.prdList.push(payload)
  },
  // 修改指定商品的数量, 并同步修改总价
  setOrderNum (state, payload) {
    let {index, data} = payload
    let prdList = state.planDetail['prdList']
    let prd = prdList[index]
    let num = Number(data)
    prd['prdNum'] = data
    prd['sumPrice'] = num * prd['price']
    state.planDetail['sumNum'] = prdList.reduce((a, b) => {
      return a + Number(b['prdNum'])
    }, 0)
    state.planDetail['sumPrice'] = prdList.reduce((a, b) => {
      return a + b['sumPrice']
    }, 0)
  }
}

const actions = {
  // 请求计划订单列表数据，根据type(toconfirm/confirm区分未完成和完成)请求相应数据
  async getPlanOrder ({state, commit}, {type = 'toconfirm', storeId = ''} = {}) {
    let planControl = null
    let setPlanStr = ''
    let setPlanControlStr = ''
    let plan = ''
    if (type && type === 'toconfirm') {      // 区分计划订单和历史订单
      plan = [].concat(state.storePlan)
      planControl = state.storePlanControl
      setPlanStr = 'setStorePlan'
      setPlanControlStr = 'setStorePlanControl'
    } else {
      plan = [].concat(state.historyPlan)
      planControl = state.historyPlanControl
      setPlanStr = 'setHistoryPlan'
      setPlanControlStr = 'setHistoryPlanControl'
    }
    const { pageSize, pageIndex } = planControl
    commit(setPlanControlStr, {'loading': true})   // 锁定loadmore组件
    let result = await api.storePlanOrder.getPlanOrderList({
      data: {
        'pageFlag': type,
        pageIndex,
        pageSize,
        storeId,
        'token': simpleLocalDb.getItem('token')
      }
    })
    if (result.responseCode === 0) {
      const dayList = result.dayList
      const dayListLength = dayList.length
      if (pageIndex === 0) {
        commit(setPlanStr, dayList)
      } else {
        // 非第一页的数据，在合并的时候需要判断最后一个数据的时间是否合新数据一样
        // 如果一样就和新数据合并
        let lastPlan = plan[plan.length - 1]
        if (dayList[0]['planDate'] === lastPlan['planDate']) {
          let newOrderList = [].concat(lastPlan['orderList'], dayList[0]['orderList'])
          dayList.shift()      // 弹出第一个数据，并将其合并到plan中
          plan.splice(-1, 1, {
            'planDate': lastPlan['planDate'],
            'orderList': newOrderList
          })
        }
        commit(setPlanStr, plan.concat(dayList))
      }
      // 页数自增
      commit(setPlanControlStr, {'pageIndex': pageIndex + 1})
      // 设置总计划订单角标数量
      if (type === 'toconfirm') {
        commit('setStorePlanTotal', result.total)
      }
      // 判断是否还有数据未加载
      if (dayListLength < pageSize) {
        commit(setPlanControlStr, {'loaded': true})
      } else {
        commit(setPlanControlStr, {'loading': false})
      }
    } else {
      commit(setPlanControlStr, {'loaded': true})
      commit(setPlanStr, [])
      Toast(result.responseMsg)
    }
  },
  // 请求订单详情数据
  async getPlanDetail ({state, commit}, {orderId = ''} = {}) {
    let result = await api.storePlanOrder.getPlanOrderDetail({
      data: {
        orderId,
        token: simpleLocalDb.getItem('token')
      }
    })
    if (result.responseCode === 0) {
      commit('setPlanDetail', result.orderVo)
    } else {
      Toast(result.responseMsg)
    }
  },
  // 确认订单请求
  async confirmOrder ({state}, data) {
    let result = await api.storePlanOrder.confirmOrder({
      data: {
        token: simpleLocalDb.getItem('token'),
        ...data
      }
    })
    return result
  }
}

export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions
}
