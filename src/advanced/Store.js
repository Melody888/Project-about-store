export default class Store {
  constructor () {
    this.data = {}
  }
  setItem (key, value) {
    this.data[key] = value
  }
  getItem (key) {
    if (key) {
      return this.data[key]
    } else {
      return this.data
    }
  }
  clear () {
    this.data = {}
  }
}
