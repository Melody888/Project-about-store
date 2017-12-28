export default class Product {
  constructor (payload = {}) {
    this.customerPrd = payload.customerPrd
    this.isNew = payload.isNew
    this.pack = payload.pack
    this.prdId = payload.prdId
    this.prdName = payload.prdName
    this.price = payload.price / 100
    this.priority = payload.priority
    this.typeCode = payload.typeCode
    this.typeDesc = payload.typeDesc
    this.orderNum = payload.orderNum || 0
    this.orderAmount = payload.orderAmount || 0
    this.orderCase = payload.orderCase || 0
    this.rTotalCase = payload.rTotalCase || 0
    this.rTotalNum = payload.rTotalNum || 0
    this.reciveNum = this.orderNum - this.rTotalNum
  }
  get packChange () {
    if (this.orderNum === '') {
      return 0
    } else {
      if (this.pack) {
        return (parseInt(this.orderNum) / parseInt(this.pack)).toFixed(1)
      } else {
        return parseInt(this.orderNum)
      }
    }
  }
  get recivePackChange () {
    if (this.reciveNum === '') {
      return 0
    } else {
      if (this.pack) {
        return (parseInt(this.reciveNum) / parseInt(this.pack)).toFixed(1)
      } else {
        return parseInt(this.reciveNum)
      }
    }
  }
  get sum () {
    return this.orderNum ? this.orderNum * this.price : 0
  }
}
