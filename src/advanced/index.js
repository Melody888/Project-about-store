import * as filters from './filters'
import * as directives from './directives'
export default {
  bootstrap (Vue) {
    Object.keys(directives).forEach(key => {
      Vue.directive(key, directives[key])
    })

    Object.keys(filters).forEach(key => {
      Vue.filter(key, filters[key])
    })
  }
}
