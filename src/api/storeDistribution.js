import { sfa } from '@/utils/baseRequest'

// 获取产品分销与价格巡逻列表
export const getMarketPollingList = ({ data } = {}) => {
  return sfa.post('/storeMarket/getMarketPollingList', data, { '_INDICATOR': true })
}

// 新增初始化产品信息
export const initMarketProd = ({ data } = {}) => {
  return sfa.post('/storeMarket/initMarketProd', data, { '_INDICATOR': true })
}

// 保存分销与价格巡检单
export const saveMarketPolling = ({ data } = {}) => {
  return sfa.post('/storeMarket/saveMarketPolling', data, { '_NO_EMOJI': true, '_INDICATOR': true })
}

// 分销与价格详情
export const marketPollingDetails = ({ data } = {}) => {
  return sfa.post('/storeMarket/marketPollingDetails', data, { '_INDICATOR': true })
}

// 提交评论/回复信息
export const saveMarketFeedback = ({ data } = {}) => {
  return sfa.post('/storeMarket/saveMarketFeedback', data, { '_NO_EMOJI': true, '_INDICATOR': true })
}

// 提交评论/回复信息
export const getMarketPollingList360 = ({ data } = {}) => {
  return sfa.post('/store360/getMarketPollingList', data, { '_INDICATOR': true })
}
