import { sfa } from '@/utils/baseRequest'

// 获取业务代表所属门店列表
export const getStoreListByUserCode = ({ data, params } = {}) => {
  return sfa.post('/storePk/getStoreListByUserCode', data, { params, '_INDICATOR': true })
}

// 根据用户获取门店盘库列表信息
export const getStorePkListByUserCode = ({ data, params } = {}) => {
  return sfa.post('/storePk/getStorePkListByUserCode', data, { params })
}

// 根据参数获取盘库详情信息
export const getStorePkDetailsByParams = ({ data, params } = {}) => {
  return sfa.post('/storePk/getStorePkDetailsByParams', data, { params })
}

// 保存门店盘库信息
export const saveStorePkInfo = ({ data, params } = {}) => {
  return sfa.post('/storePk/saveStorePkInfo', data, { params })
}

