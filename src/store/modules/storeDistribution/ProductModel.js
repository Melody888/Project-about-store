export default class Product {
  constructor (payload = {}) {
    this.prdId = payload.prdId
    this.prdName = payload.prdName
    this.price = payload.price
    this.displayPrice = payload.price && (payload.price / 100).toFixed(2)
    this.startTime = payload.startTime
    this.endTime = payload.endTime || 253402185600000
    this.marketType = payload.marketType || 'market'
  }
}
