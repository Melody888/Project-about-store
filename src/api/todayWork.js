import { sfa } from '@/utils/baseRequest'

// 获取今日工作列表
export const getPlanList = ({data, params, config}) => {
  return sfa.post('/actuality/getPlanAndActuTotal', data, { params, ...config })
}

// 更新计划有效标记
export const updateFlayById = ({data, params, config}) => {
  return sfa.post('/actuality/updatePlanValidFlagByPlanId', data, { params, ...config })
}

// 根据计划日期更新有效标记
export const updateFlayByDate = ({data, params, config}) => {
  return sfa.post('/plan/updatePlanValidFlagByDate', data, { params, ...config })
}

// 获取打卡信息
export const getPunchInfo = ({data, params, config}) => {
  return sfa.post('/actuality/getPunchOfLeaveByPlanId', data, { params, ...config })
}

// 进店／离店打卡
export const savePunchInfo = ({data, params, config}) => {
  return sfa.post('/actuality/savePunchInfo', data, { params, ...config })
}

// 获取计划明细（工作总结界面和打卡信息页)
export const getPlanDetail = ({data, params, config}) => {
  return sfa.post('/actuality/getPlanDetailByPlanId', data, { params, ...config })
}

// 获取提报销量信息
export const getActuInfo = ({data, params, config}) => {
  return sfa.post('/report/getActuDetailByDateOrPlanId', data, { params, ...config })
}

// 保存提报销量
export const saveActuInfo = ({data, params, config}) => {
  return sfa.post('/actuality/saveActuInfo', data, { params, ...config })
}

// 保存工作总结
export const saveWorkSummary = ({data, params, config}) => {
  return sfa.post('/actuality/saveWorkSummary', data, { params, ...config })
}
