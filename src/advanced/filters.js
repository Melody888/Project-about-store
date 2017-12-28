import moment from 'moment'
/**
 * 普通日期格式化函数
 * data: yyyy-MM-dd
 * time: hh:mm:ss
 * yyyy-MM-dd hh:mm:ss 默认
 * 或者传入需要的格式
 */
export const datetime = (time, pattern) => {
  if (!time) return ''
  let value = moment(time)
  let tempPattern = 'YYYY-MM-DD HH:mm:ss'

  if (!pattern) {
    return value.format(tempPattern)
  }

  switch (pattern) {
    case 'date':
      tempPattern = 'YYYY-MM-DD'
      break
    case 'time':
      tempPattern = 'HH:mm:ss'
      break
    case 'dateym':
      tempPattern = 'YYYY-MM'
      break
    default:
      tempPattern = pattern
      break
  }
  return value.format(tempPattern)
}

/**
 * 当天0点的时间戳
 */
export const zeroTs = (date) => {
  return (new Date(moment(date).format('YYYY/MM/DD'))).getTime()
}

/**
 * text为空时显示默认文本
 */
export const placeholder = (text, defaultText = '') => {
  return text || defaultText
}

/**
 * 元 部分
 */
export const yuan = (totalCent) => {
  if (!totalCent) return '0'
  return (totalCent / 100).toFixed(2).toString().split('.')[0]
}

/**
 * 分 部分
 */
export const cent = (totalCent) => {
  if (!totalCent) return '00'
  return (totalCent / 100).toFixed(2).toString().split('.')[1]
}

/**
 * 金钱 元 完整
 */
export const fullMoney = (totalCent) => {
  if (!totalCent) return '0.00'
  return (totalCent / 100).toFixed(2).toString()
}

export const htmlWrap = (text) => {
  return text.replace(/\r\n/g, '<br>').replace(/\r/g, '<br>').replace(/\n/g, '<br>')
}
