import { sfa as Api } from '@/utils/baseRequest'
import * as Models from '@/models/showcasePatrol'
export default {
  namespaced: true,
  state: {
    'indexList': [],
    'indexKeyword': '',
    'indexKeywordForDisplay': '',
    'indexLiteList': []
  },
  getters: {},
  mutations: {},
  actions: {
    'indexGetList': async function ({ state }, keyword) {
      keyword = keyword || state['indexKeyword']
      let { 'inpsectList': res } = await Api.post('/inspect/getInspectListByUserCode', {
        keyword: keyword,
        token: simpleLocalDb.getItem('token')
      }, {
        '_NEED_CODE_0': true,
        '_INDICATOR': true
      })
      state['indexKeyword'] = keyword
      let list = []
      for (let item of res) {
        list.push(new Models['IndexListItem'](item))
      }
      state['indexList'] = list
      return res
    },
    'indexReply': async function ({ state }, { index, content = '' } = {}) {
      if (index || index === 0) {
        let item = state['indexList'][index]
        if (item) {
          await Api.post('/inspect/saveEvaluateInfo', {
            'actionNum': 0,
            'actionType': '',
            'evaluateContent': content,
            'evaluateType': 'reply',
            'orderNo': item.code,
            'token': simpleLocalDb.getItem('token')
          }, {
            '_NEED_CODE_0': true,
            '_INDICATOR': true
          })
          let { 'inspectVo': detail } = await Api.post('/inspect/getInspectInfoByOrderNo', {
            'orderNo': item.code,
            'token': simpleLocalDb.getItem('token')
          }, {
            '_NEED_CODE_0': true,
            '_INDICATOR': true
          })
          let reviews = []
          for (let review of detail['evaluateList'] || []) {
            reviews.push(new Models['IndexListReviewItem'](review))
          }
          reviews.sort(function (a, b) {
            return b.date - a.date
          })
          item['reviews'] = reviews
          return reviews
        }
      }
    },
    'indexLiteGetList': async function ({ state }, id) {
      if (id) {
        let { 'inspectList': res } = await Api.post('/store360/getInspecrtList', {
          'storeId': id,
          'token': simpleLocalDb.getItem('token')
        }, {
          '_NEED_CODE_0': true,
          '_INDICATOR': true
        })
        let list = []
        for (let item of res || []) {
          list.push(new Models['IndexListItem'](item))
        }
        state['indexLiteList'] = list
        return res
      }
    }
  }
}
