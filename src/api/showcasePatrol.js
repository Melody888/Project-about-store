import { sfa } from '@/utils/baseRequest'

// 01.根据登录用户获取陈列巡检列表信息
export const getInspectListByUserCode = ({ data } = {}) => {
  return sfa.post('/inspect/getInspectListByUserCode', data, { '_INDICATOR': true })
}

// 02.根据单号获取详情
export const getInspectInfoByOrderNo = ({ data } = {}) => {
  return sfa.post('/inspect/getInspectInfoByOrderNo', data, { '_INDICATOR': true })
}

// 03.保存评价信息
export const saveEvaluateInfo = ({ data } = {}) => {
  return sfa.post('/inspect/saveEvaluateInfo', data, { '_NO_EMOJI': true, '_INDICATOR': true })
}

// 04.保存陈列巡检信息
export const saveInspectInfo = ({ data } = {}) => {
  return sfa.post('/inspect/saveInspectInfo', data, { '_NO_EMOJI': true, '_INDICATOR': true })
}

// 05.获取陈列资源配置列表
export const getInspectResourceList = ({ data } = {}) => {
  return sfa.post('/inspect/getInspectResourceList', data, { '_INDICATOR': true })
}

// 06.保存图片【原有】
export const commonUploadFile = ({ data } = {}) => {
  return sfa.post('/base/commonUploadFile', data, { '_INDICATOR': true })
}
