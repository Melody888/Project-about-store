/**
 * 是否是微信浏览器
 */
export const isWeixin = () => {
  let ua = window.navigator.userAgent.toLowerCase()
  let result = ua.match(/MicroMessenger/i)
  return result && result.length > 0 && result[0] === 'micromessenger'
}

/**
 * 数字过滤，只输出纯数字或数值
 */
export const digitalCheck = (val, type) => {
  if (!type || type === 'digital') {
    return Number((val + '').replace(/[^0-9(/.)?]+/g, ''))
  } else if (type === 'number') {
    return Number((val + '').replace(/[^0-9]+/g, ''))
  }
}
