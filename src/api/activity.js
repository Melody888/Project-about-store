import { sfa } from '@/utils/baseRequest'

// 获取我的活动管理/历史记录列表
export const getActivityList = ({ data, params } = {}) => {
  return sfa.post('/activity/getActivityList', data, { params })
}

// 取消活动
export const cancelActivity = ({ data, params } = {}) => {
  return sfa.post('/activity/cancelActivity', data, { params })
}

// 获取字段配置表信息
export const getFieldConfByFieldType = ({ data, params } = {}) => {
  return sfa.post('/plan/getFieldConfByFieldType', data, { params })
}

// 获取执行记录列表
export const getImplementRecordList = ({ data, params } = {}) => {
  return sfa.post('/activity/getImplementRecordList', data, { params })
}

// 新增/编辑活动
export const saveActivity = ({ data, params } = {}) => {
  return sfa.post('/activity/saveActivity', data, { params })
}

// 获取活动/结案详情
export const getActivityInfo = ({ data, params } = {}) => {
  return sfa.post('/activity/getActivityInfo', data, { params })
}

// 填写活动结案报告
export const closeActivity = ({ data, params } = {}) => {
  return sfa.post('/activity/closeActivity', data, { params })
}

// 增加执行记录
export const addImplementRecord = ({ data, params } = {}) => {
  return sfa.post('/activity/addImplementRecord', data, { params })
}

// 获取门店产品资源信息
export const getProductList = ({ data, params } = {}) => {
  return sfa.post('/activity/getProductList', data, { params })
}

// 获取门店其他费用信息列表
export const getCostList = ({ data, params } = {}) => {
  return sfa.get('/activity/getCostList', data, { params })
}

// 获取门店物料信息列表
export const getMaterielList = ({ data, params } = {}) => {
  return sfa.get('/activity/getMaterielList', data, { params })
}

// 获取门店资源信息列表
export const getResourceList = ({ data, params } = {}) => {
  return sfa.get('/activity/getResourceList', data, { params })
}

