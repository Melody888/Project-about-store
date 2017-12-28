export default {
  storeList (state, payload) {
    state.storeList = payload
  },
  loading (state, payload) {
    state.loading = payload
  },
  loaded (state, payload) {
    state.loaded = payload
  },
  pageIndex (state, payload) {
    state.pageIndex = payload
  }
}
