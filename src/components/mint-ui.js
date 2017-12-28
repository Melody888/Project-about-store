import {
  Loadmore,
  DatetimePicker,
  InfiniteScroll,
  Popup,
  Picker
} from 'mint-ui'

export default {
  use (Vue) {
    Vue.use(InfiniteScroll)
    Vue.component(Loadmore.name, Loadmore)
    Vue.component(Popup.name, Popup)
    Vue.component(DatetimePicker.name, DatetimePicker)
    Vue.component(Picker.name, Picker)
  }
}
