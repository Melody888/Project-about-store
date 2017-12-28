import { sfa } from '@/utils/baseRequest'

// 上传图片
export const commonUploadFile = ({ data, params } = {}) => {
  return sfa.post('/base/commonUploadFile', data, { params })
}

// 获取特定图片
export const getSpecialAttach = ({ data, params } = {}) => {
  return sfa.post('/base/getSpecialAttach', data, { params })
}

// 获取字典包装方法，返回一个promise对象
export const getDictObj = (function () {
  const QUEUE = [] // [{ dictName, promise }]
  const REMOVE_WAITER = function (dictName) {
    let index = QUEUE.findIndex(function (v) {
      return v.dictName === dictName
    })
    if (index > -1) QUEUE.splice(index, 1)
  }
  return async function (dictName, sorted = false) {
    dictName += ''
    if (dictName) {
      const SESSION_NAME = `SFA_DICT_OBJ_${dictName}`
      let res
      let response
      // session中已有
      if (window.sessionStorage[SESSION_NAME]) {
        try {
          response = JSON.parse(window.sessionStorage[SESSION_NAME])
        } catch (err) {}
      }
      // 视乎有无session进行接口调用
      if (!response) {
        let promise
        let waiter = QUEUE.find(function (v) { return v.dictName === dictName })
        if (waiter) {
          // 队列中已有
          promise = waiter.promise
        } else {
          // 队列中不存在，需要请求接口
          promise = sfa.post('/plan/getFieldConfByFieldType', {
            'fieldType': dictName
          }, {
            '_NEED_CODE_0': true,
            '_INDICATOR': true
          }).catch(function (err) {
            REMOVE_WAITER(dictName)
            throw err
          })
          QUEUE.push({ dictName, promise })
        }
        response = (await promise)['itemList']
        try {
          window.sessionStorage[SESSION_NAME] = JSON.stringify(response)
        } catch (err) {}
      }
      // 返回对象格式化，若sorted为true返回数组，否则返回对象
      if (sorted) {
        res = []
        response.sort(function (a, b) {
          return +a['priority'] - +b['priority']
        })
        for (let item of response || []) {
          res.push({
            code: item['fieldCode'],
            name: item['fieldDesc'],
            typeCode: item['fieldType'],
            typeName: item['typeDesc']
          })
        }
        return res
      } else {
        res = {}
        for (let item of response || []) {
          res[item['fieldCode']] = item['fieldDesc']
        }
        return res
      }
    } else {
      throw new Error()
    }
  }
})()
