import { sfa } from '@/utils/baseRequest'

export const getUserInfo = ({ data, params } = {}) => {
  return sfa.post('/user/getUserInfo', data, { params })
}
