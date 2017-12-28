export class IndexListItem {
  constructor (item) {
    this.code = item['orderNo']
    this.date = item['createTime']
    this.name = item['createByName']
    this.store = item['storeName']
    this.showCount = item['inspectTotalNum']
    this.showArea = item['inspectArea']
    this.canEvaluate = !item['ownOrder'] && item['evaluateOrNot']
    this.canEdit = item['editOrNot']
    this.reviews = (function () {
      let res = []
      for (let review of item['evaluateList'] || []) {
        res.push(new IndexListReviewItem(review))
      }
      return res
    })()
    this.reviewsToggled = false
    this.canReview = item['ownOrder'] && item['evaluateOrNot'] && item['evaluateList'].length > 0
  }
}

export class IndexListReviewItem {
  constructor (item) {
    this.date = item['changedTime']
    this.name = item['changedByName']
    this.content = item['evaluateContent']
    this.like = item['actionType'] === 'praise' ? item['actionNum'] : 0
    this.unlike = item['actionType'] === 'tread' ? item['actionNum'] : 0
  }
}
