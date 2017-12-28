import axios from 'axios'
import md5 from 'md5'
import AppConst from './config'
import { Toast, Indicator } from 'mint-ui'

const createBaseRequest = ({ baseURL }) => {
  const req = axios.create({
    baseURL,
    timeout: 10000,
    headers: {
      'Content-Type': 'application/json'
    }
  })
  // Add a request interceptor
  req.interceptors.request.use(function (config = {}) {
    config.params = Object.assign(config.params || {}, getBaseParam())
    if (config['_NO_EMOJI'] === undefined) config['_NO_EMOJI'] = true
    if (config['_INDICATOR']) {
      Indicator.open()
    }
    if (config['_NO_EMOJI']) {
      if (/[\uD800-\uDFFF]/.test(JSON.stringify(config.data))) {
        config['_NO_EMOJI_ERROR'] = true
        return Promise.reject({ config })
      }
    }
    return config
  }, function (error) {
    return Promise.reject(error)
  })

  // Add a response interceptor
  req.interceptors.response.use(function (res) {
    if (res.config['_INDICATOR']) {
      Indicator.close()
    }
    if (res.data['responseCode'] === 2301 || res.data['responseCode'] === 2302 || res.data['responseCode'] === 2303) {
      Toast('用户登录失效，请重新登录')
      setTimeout(() => {
        window.location = '//' + AppConst.APP_DOMAIN + '/sfa'
      }, 2000)
      return Promise.reject(res)
    }
    if (res.config['_NEED_CODE_0']) {
      if (res.data['responseCode'] !== 0) {
        Toast(res.data['responseMsg'])
        return Promise.reject(res.data)
      }
    }
    return res.data
  }, function (err) {
    if (err.config['_INDICATOR']) Indicator.close()
    if (err.config['_NO_EMOJI_ERROR']) {
      Toast('请勿输入特殊符号及表情')
    } else {
      Toast('网络异常')
    }
    return Promise.reject(err)
  })
  return req
}

const getBaseParam = (rowStr = '') => {
  let client = AppConst.APP_PROP_CLIENT
  let cuid = AppConst.APP_PROP_CUID
  let format = AppConst.APP_PROP_FORMAT
  let time = Date.now()
  let version = AppConst.APP_PROP_VERSION
  let secret = AppConst.APP_PROP_SECRET
  let sign = md5(secret + client + cuid + format + time + version + rowStr + secret)
  return { client, cuid, format, time, version, sign }
}

export const sfa = createBaseRequest({
  baseURL: AppConst.APP_BACKEND
})
