import { sfa as Api } from '@/utils/baseRequest'

class IndexOverview {
  constructor (res = {}) {
    this.people = res['sumPerson'] || 0
    this.store = res['sumStore'] || 0
    this.target = res['sumMoney'] / 100 || 0
    this.zz = res['sumNew'] || 0
  }
}
class IndexWeekDate {
  constructor (res = {}) {
    this.api_date = res['planDate'] || null
    this.people = res['personNum'] || 0
    this.store = res['storeNum'] || 0
    this.target = res['money'] / 100 || 0
    this.zz = res['newNum'] || 0
  }
}
class Staff {
  constructor (res = {}) {
    this.code = res['userCode'] || ''
    this.name = res['userName'] || ''
    this.plan = res['planNum'] || 0
    this.unread = res['unconfirmNum'] || 0
    this.list = []
    this.listLoading = false
    this.listNomore = false
    this.api_pageIndex = 0
  }
}
class StaffPlan {
  constructor (res = {}) {
    this.date = res['planDate'] || null
    this.plans = res['planNum'] || 0
    this.status = res['planStatus'] || ''
    this.type = res['validFlag'] || ''
    this.store = (function () {
      let arr = []
      for (let item of res['locationList'] || []) {
        arr.push(item['locationDesc'])
      }
      return arr
    })()
    this.total = res['sumMoney'] / 100 || 0
    this.zz = res['newNum'] || 0
  }
}
class Store {
  constructor (res = {}) {
    this.store = res['storeName'] || ''
    this.storeCode = res['storeId'] || ''
    this.list = (function () {
      let arr = []
      for (let item of res['dateList'] || []) {
        arr.push(new StoreDate(item))
      }
      return arr
    })()
  }
}
class StoreDate {
  constructor (res = {}) {
    this.date = res['planDate'] || null
    this.people = (function () {
      let arr = []
      for (let item of res['planList']) {
        arr.push({
          name: item['userName'],
          code: item['userCode'],
          class: item['classDesc'],
          periods: (function () {
            let arr = []
            for (let period of item['planTime']) {
              arr.push({
                start: period['enterTime'],
                end: period['leaveTime']
              })
            }
            return arr
          })(),
          status: item['planStatus'],
          total: item['sumMoney'] / 100,
          zz: item['newNum']
        })
      }
      return arr
    })()
  }
}

export default {
  namespaced: true,
  state: {
    indexWeekIndex: null,
    indexOverview: [],
    indexWeekData: [],
    indexToggled: false,
    indexTab: '',
    indexStaffsUnread: null,
    indexStaffs: [],
    indexStaffsLoading: false,
    indexStaffsNomore: false,
    indexCheckingStaffCode: '',
    indexStoresUnread: null,
    indexStores: [],
    indexStoresLoading: false,
    indexStoresNomore: false,
    indexCheckingStoreCodes: [],
    userName: '',            // 历史计划搜索条件
    historyControl: {        // 历史计划分页控制
      pageIndex: 0,
      loading: false,
      loaded: false
    },
    historyData: []          // 历史计划数据
  },
  getters: {
    historyData (state) { return state.historyData },
    historyControl (state) { return state.historyControl },
    userName (state) { return state.userName }
  },
  mutations: {
    indexResetState (state) {
      // state.indexWeekIndex = null
      state.indexOverview = []
      state.indexWeekData = []
      // state.indexToggled = false
      // state.indexTab = ''
      state.indexStaffsUnread = null
      state.indexStaffs = []
      state.indexStaffsLoading = false
      state.indexStaffsNomore = false
      // state.indexCheckingStaffCode = ''
      state.indexStoresUnread = null
      state.indexStores = []
      state.indexStoresLoading = false
      state.indexStoresNomore = false
      // state.indexCheckingStoreCodes = []
    },
    indexResetCheckingStoreCode (state) {
      state.indexCheckingStoreCodes = []
    },
    indexToggleCheckingStoreCode (state, code) {
      if (code) {
        let tar = state.indexCheckingStoreCodes
        let index = tar.indexOf(code)
        if (index >= 0) {
          tar.splice(index, 1)
        } else {
          tar.push(code)
        }
      }
    },
    setHistoryControl (state, payload) { state.historyControl = payload },
    setHistoryData (state, payload) { state.historyData = payload },
    setUserName (state, payload) { state.userName = payload }
  },
  actions: {
    async indexGetWeeksData ({ state }) {
      let [thisWeek, nextWeek] = await Promise.all([
        Api.post('/planConfirm/getSummaryPlanByParams', {
          'token': simpleLocalDb.getItem('token'),
          'weekFlag': 'this'
        }, {
          '_NEED_CODE_0': true,
          '_INDICATOR': true
        }),
        Api.post('/planConfirm/getSummaryPlanByParams', {
          'token': simpleLocalDb.getItem('token'),
          'weekFlag': 'next'
        }, {
          '_NEED_CODE_0': true,
          '_INDICATOR': true
        })
      ])
      state.indexOverview = []
      state.indexOverview.push(new IndexOverview(thisWeek['totalSummary'] || {}))
      state.indexOverview.push(new IndexOverview(nextWeek['totalSummary'] || {}))
      state.indexWeekData = []
      {
        let res = []
        for (let date of thisWeek['summaryList'] || []) {
          res.push(new IndexWeekDate(date))
        }
        state.indexWeekData.push(res)
      }
      {
        let res = []
        for (let date of nextWeek['summaryList'] || []) {
          res.push(new IndexWeekDate(date))
        }
        state.indexWeekData.push(res)
      }
    },
    indexGetStaffs: (function () {
      let pageIndex = 0
      const PAGE_SIZE = 10
      return async function ({ state }, refreshing = false) {
        if (state.indexStaffsLoading || !refreshing && state.indexStaffsNomore) return
        state.indexStaffsLoading = true
        let { 'personList': res = [], 'sumUnconfirm': unread } = await Api.post('/planConfirm/getProPerPlanByParam', {
          'pageIndex': refreshing ? 0 : pageIndex,
          'pageSize': PAGE_SIZE,
          'token': simpleLocalDb.getItem('token')
        }, {
          '_INDICATOR': true,
          '_NEED_CODE_0': true
        })
        if (refreshing) {
          pageIndex = 0
          state.indexStaffs = []
        }
        state.indexStaffsUnread = unread || 0
        for (let item of res) {
          state.indexStaffs.push(new Staff(item))
        }
        if (res.length && !state.indexCheckingStaffCode) state.indexCheckingStaffCode = state.indexStaffs[0].code
        state.indexStaffsNomore = res.length < PAGE_SIZE
        pageIndex++
        state.indexStaffsLoading = false
        return res
      }
    })(),
    indexGetStaffPlans: (function () {
      const MAX = 2
      return async function ({ state }, staff) {
        if (!staff || !staff.code || staff.listLoading || staff.listNomore) return
        staff.listLoading = true
        let { 'planList': res = [] } = await Api.post('/planConfirm/getPlanListByUserCode', {
          'pageIndex': staff.api_pageIndex,
          'token': simpleLocalDb.getItem('token'),
          'userCode': staff.code
        }, {
          '_INDICATOR': true,
          '_NEED_CODE_0': true
        }).catch(function (err) {
          staff.listLoading = false
          throw err
        })
        for (let item of res) {
          staff.list.push(new StaffPlan(item))
        }
        staff.api_pageIndex++
        if (staff.api_pageIndex >= MAX) {
          staff.listNomore = true
        }
        staff.listLoading = false
        return res
      }
    })(),
    indexGetStores: (function () {
      let pageIndex = 0
      const PAGE_SIZE = 10
      return async function ({ state }, refreshing = false) {
        if (state.indexStoresLoading || !refreshing && state.indexStoresNomore) return
        state.indexStoresLoading = true
        let { 'itemList': res = [] } = await Api.post('/planConfirm/getPlanListByStore', {
          'pageIndex': refreshing ? 0 : pageIndex,
          'pageSize': PAGE_SIZE,
          'token': simpleLocalDb.getItem('token')
        }, {
          '_INDICATOR': true,
          '_NEED_CODE_0': true
        })
        if (refreshing) {
          pageIndex = 0
          state.indexStores = []
        }
        for (let item of res) {
          state.indexStores.push(new Store(item))
        }
        state.indexStoresNomore = res.length < PAGE_SIZE
        pageIndex++
        state.indexStoresLoading = false
        return res
      }
    })(),
    async searchHistoryData ({ state, commit }) {
      let pageIndex = state.historyControl.pageIndex
      let result = await Api.post('/planConfirm/getHistoryPlanByParams', {
        token: simpleLocalDb.getItem('token'),
        userName: state.userName,
        pageIndex: pageIndex,
        pageSize: 10
      }, {
        '_NEED_CODE_0': true
      }).catch(err => {
        console.log(err)
        return 'error'
      })
      if (result === 'error') { return result }
      console.log('pageIndex', state.historyControl.pageIndex)
      if (pageIndex === 0) {
        commit('setHistoryData', result.dayList)
      } else {
        commit('setHistoryData', state.historyData.concat(result.dayList))
      }
      result.bmPageIndex = pageIndex
      return result
    }
  }
}
