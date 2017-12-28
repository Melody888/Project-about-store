import { sfa } from '@/utils/baseRequest'

// 获取出勤门店
export const getStoreListByUserId = ({ data, params } = {}) => {
  return sfa.post('/myStore/getStoreListByUserId', data, { params })
}
