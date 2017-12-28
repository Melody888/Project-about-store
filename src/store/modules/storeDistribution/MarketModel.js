export default class Market {
  constructor (payload = {}) {
    this.createByName = payload.createByName
    this.createTimestamp = payload.createTimestamp
    this.isOwnMarket = payload.isOwnMarket
    this.marketCode = payload.marketCode
    this.marketFeedbackList = payload.marketFeedbackList
    this.marketFeedbackNum = payload.marketFeedbackNum
    this.marketNum = payload.marketNum
    this.storeId = payload.storeId
    this.storeName = payload.storeName
    this.isTalk = false
  }
}
