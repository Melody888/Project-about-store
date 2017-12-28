import mintUI from './mint-ui'
import BmLoadmore from './base/BmLoadMore'
import BmLayout from './base/BmLayout'
import BmHeader from './base/BmHeader'
import BmEmpty from './base/BmEmpty'
import BmSearch from './base/BmSearch'
import BmFilePicker from './base/BmFilePicker'
import BmUploadedImg from './base/BmUploadedImg'
import BmImgPicker from './base/BmImgPicker'
import BmDatetimePicker from './plugins/BmDatetimePicker'
import BmNumberInput from './plugins/BmNumberInput'
import BmPicker from './base/BmPicker'
import BmEmptyPic from './base/BmEmptyPic'
import BmRegion from './base/BmRegion'
import BmLoadMorePage from './base/BmLoadMorePage'

export default {
  bootstrap (Vue) {
    mintUI.use(Vue)
    Vue.component(BmLoadmore.name, BmLoadmore)
    Vue.component(BmLayout.name, BmLayout)
    Vue.component(BmHeader.name, BmHeader)
    Vue.component(BmEmpty.name, BmEmpty)
    Vue.component(BmSearch.name, BmSearch)
    Vue.component(BmFilePicker.name, BmFilePicker)
    Vue.component(BmUploadedImg.name, BmUploadedImg)
    Vue.component(BmImgPicker.name, BmImgPicker)
    Vue.component(BmDatetimePicker.name, BmDatetimePicker)
    Vue.component(BmPicker.name, BmPicker)
    Vue.component(BmEmptyPic.name, BmEmptyPic)
    Vue.component(BmNumberInput.name, BmNumberInput)
    Vue.component('BmRegion', BmRegion)
    Vue.component(BmLoadMorePage.name, BmLoadMorePage)
  }
}
