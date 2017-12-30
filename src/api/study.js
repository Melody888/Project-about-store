import { sfa } from '@/utils/baseRequest'

// 01.根据登录用户获取门店编制列表信息
export const getstoreList = ({ data, params } = {}) => {
  return sfa.post('/storeOrg/getStoreOrgListByUserCode', data, { params })
}

// 02.根据门店编码查看编制信息
export const getOrgInfoByStoreId = ({ data, params } = {}) => {
  return sfa.post('/storeOrg/getStoreOrgInfoByStoreId', data, { params })
}
// 03.根据参数获取项目成员列表信息
export const getprojectList = ({ data, params } = {}) => {
  return sfa.post('/storeOrg/getProjectPerList', data, { params })
}
// 04.根据参数人员配置信息
export const getPersonInfoByParams = ({ data, params } = {}) => {
  return sfa.post('/storeOrg/getPersonInfoByParams', data, { params })
}
// 05.保存门店编制信息
export const saveStoreOrgInfo = ({ data, params } = {}) => {
  return sfa.post(' /storeOrg/saveStoreOrgInfo', data, { params })
}
// 06.查询人员信息列表
export const getPersonListByParams = ({ data, params } = {}) => {
  return sfa.post(' /storeOrg/getPersonListByParams', data, { params })
}
