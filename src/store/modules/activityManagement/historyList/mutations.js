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
  pageIndex (state, payload) {
    state.pageIndex = payload
  },
  storeName (state, payload) {
    state.storeName = payload
  },
  status (state, payload) {
    state.status = payload
  }
}
