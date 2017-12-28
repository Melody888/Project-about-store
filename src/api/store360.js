import { sfa } from '@/utils/baseRequest'

// 门店360 根据门店Id获取门店POS机数据
export const getPosDetail = ({ data, params } = {}) => {
  return sfa.post('/store360/getPosDetailsByParams', data, { '_INDICATOR': true, params })
}

// 门店360 根据门店Id获取门店360首页列表的客容量、门店订单、销量数据
export const getStore360List1 = ({ data } = {}) => {
  return sfa.post('/store360/getStore360List1', data, { '_INDICATOR': true })
}

// 门店360 根据门店Id获取门店360首页列表的陈列巡检、分销巡检和库存盘点的数据
export const getStore360List2 = ({ data } = {}) => {
  return sfa.post('/store360/getStore360List2', data, { '_INDICATOR': true })
}

// 门店360 根据门店Id获取门店360首页列表的活动执行、pos管理和门店编制的数据
export const getStore360List3 = ({ data } = {}) => {
  return sfa.post('/store360/getStore360List3', data, { '_INDICATOR': true })
}

// 门店360 根据门店Id获取门店360首页列表的客服、经销商和负责人信息
export const getStore360List4 = ({ data } = {}) => {
  return sfa.post('/store360/getStore360List4', data, { '_INDICATOR': true })
}

// 门店360 根据门店Id获取门店基本信息
export const getStoreInfoByStoreId = ({ data, params } = {}) => {
  return sfa.post('/store360/getStoreInfoByStoreId', data, { params })
}

// 门店360 根据参数获取销售提报列表
export const getSaleListByParams = ({ data, params } = {}) => {
  return sfa.post('/store360/getSaleListByParams', data, { params })
}

// 门店360 获取门店负责人详情
export const getStoreResponsibleInfo = ({ data, params } = {}) => {
  return sfa.post('/store360/getStoreResponsibleInfo', data, { params })
}

// 门店360 获取门店项目成员详情
export const getStoreProPerList = ({ data, params } = {}) => {
  return sfa.post('/store360/getStoreProPerList', data, { '_INDICATOR': true, params })
}

// 门店360 获取活动执行详情
export const getActivityList = ({ data, params } = {}) => {
  return sfa.post('/store360/getActivityList', data, { params })
}

// 门店360 我的门店排序调整
export const saveStorePriority = ({ data, params } = {}) => {
  return sfa.post('/store360/saveStorePriority', data, { params })
}

// 门店360 获取盘库列表
export const getStorePkList = ({ data, params } = {}) => {
  return sfa.post('/store360/getStorePkList', data, { params })
}
