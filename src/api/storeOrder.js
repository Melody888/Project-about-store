import { sfa } from '@/utils/baseRequest'

// 门店订单 获取门店待执行/执行中订单列表
export const getWaitHandleOrder = ({ data, params } = {}) => {
  return sfa.post('/storeOrder/getWaitHandleOrder', data, { params })
}

// 门店订单 获取历史订单
export const getHistoryOrder = ({ data, params } = {}) => {
  return sfa.post('/storeOrder/getHistoryOrder', data, { params })
}

// 门店订单 击创建门店订单时，获取至尊品种
export const getZiZunPrductList = ({ params } = {}) => {
  return sfa.post('/storeOrder/getZiZunPrductList', {
    token: simpleLocalDb.getItem('token')
  }, { params })
}

// 门店订单 查看订单详情
export const getStoreOrderDetail = ({ data, params } = {}) => {
  return sfa.post('/storeOrder/getStoreOrderDetail', data, { params })
}

// 门店订单 新增和编辑订单
export const addOrEditStoreOrder = ({ data, params } = {}) => {
  return sfa.post('/storeOrder/addOrEditStoreOrder', data, { params })
}

// 门店订单 查看收货单列表（包括明细）
export const getOrderReceiveList = ({ data, params } = {}) => {
  return sfa.post('/storeOrder/getOrderReceiveList', data, { params })
}

// 门店订单 发货单列表（包括明细）
export const getOrderDeliveryList = ({ data, params } = {}) => {
  return sfa.post('/storeOrder/getOrderDeliveryList', data, { params })
}

// 门店订单 获取发货单详情
export const getDeliveryDetail = ({ data, params } = {}) => {
  return sfa.post('/storeOrder/getDeliveryDetail', data, { params })
}
// 门店订单 获取收货单详情
export const getReceiveDetail = ({ data, params } = {}) => {
  return sfa.post('/storeOrder/getReceiveDetail', data, { params })
}

// 门店订单 确认收货
export const confirmReceiveOrder = ({ data, params } = {}) => {
  return sfa.post('/storeOrder/confirmReceiveOrder', data, { params })
}

// 门店订单 提交反馈信息（评价，回复）
export const addComment = ({ data, params } = {}) => {
  return sfa.post('/storeOrder/addComment', data, { params })
}

// 门店订单 更改订单状态（结案，取消）
export const updateOrderStatus = ({ data, params } = {}) => {
  return sfa.post('/storeOrder/updateOrderStatus', data, { params })
}

// 门店360 获取门店订单待处理详情
export const store360GetWaitHandleStoreOrder = function (config) {
  let data = config.data || {}
  delete config.data
  return sfa.post('/store360/getWaitHandleStoreOrder', data, config)
}

// 门店360 获取门店订单待处理详情
export const store360GetHistoryStoreOrder = function (config) {
  let data = config.data || {}
  delete config.data
  return sfa.post('/store360/getHistoryStoreOrder', data, config)
}
