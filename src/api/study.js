import { sfa } from '@/utils/baseRequest'

// 01.根据登录用户获取门店编制列表信息
export const getstoreList = ({ data, params } = {}) => {
  return sfa.post('/storeOrg/getStoreOrgListByUserCode', data, { params })
}
