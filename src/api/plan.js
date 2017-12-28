import { sfa } from '@/utils/baseRequest'

export const getPrdInfoByIdOrName = ({ data, params } = {}) => {
  return sfa.post('/plan/getPrdInfoByIdOrName', data, { params })
}

/**
 * 获取字段配置表信息
 */
export const getFieldConfByFieldType = ({ data, params } = {}) => {
  return sfa.post('/plan/getFieldConfByFieldType', data, { params })
}
