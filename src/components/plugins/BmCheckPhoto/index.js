import Vue from 'vue'
import self from './BmCheckPhoto'

const BmCheckPhoto = Vue.extend(self)

let instance

export default (options = {}) => {
  if (!instance) {
    instance = new BmCheckPhoto({
      el: document.createElement('div')
    })
  }

  // instance.options = options
  document.body.appendChild(instance.$el)

  Vue.nextTick(() => {
    instance.openPhoto(options)
  })
}
