export default {
  activityList (state, payload) {
    state.activityList = payload
  },
  loading (state, payload) {
    state.loading = payload
  },
  loaded (state, payload) {
    state.loaded = payload
  },
  myNum (state, payload) {
    state.myNum = payload
  },
  pageIndex (state, payload) {
    state.pageIndex = payload
  },
  status (state, payload) {
    state.status = payload
  }
}
