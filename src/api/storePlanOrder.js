import { sfa } from '@/utils/baseRequest'

// 根据参数获取计划订单列表
export const getPlanOrderList = ({data, params}) => {
  return sfa.post('/planOrder/getPlanOrderByParams', data, {'_INDICATOR': true, params})
}

// 根据单号获取计划订单详情
export const getPlanOrderDetail = ({data, params}) => {
  return sfa.post('/planOrder/getPlanOrderDetailsByOrderId', data, {'_INDICATOR': true, params})
}

// 保存确认订单
export const confirmOrder = ({data, params}) => {
  return sfa.post('/planOrder/savePlanOrderInfo', data, {'_INDICATOR': true, '_NO_EMOJI': true, params})
}
