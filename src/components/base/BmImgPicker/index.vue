<template>
  <div class="pickBtn">
    <BmFilePicker @pick="imgDeal" style="opacity: 0"></BmFilePicker>
  </div>
</template>

<style lang="less" scoped>
  .pickBtn {
    width: 0.6rem;
    height: 0.6rem;
    border: 1px dashed #FFE3DC;
    border-radius: 3px;
    background: url('./img/addToUpload@3x.png') no-repeat center/50%;
  }
</style>

<script>
  /**
   * Created by Wesdint on 2017/9/28.
   */
  import api from '@/api'
  import { readerFile } from '@/utils/file'
  import BmFilePicker from '../BmFilePicker.vue'
  import { Indicator } from 'mint-ui'
  export default {
    data () {
      return {}
    },
    name: 'bm-img-picker',
    props: ['sourceFlag', 'applyNo'],
    components: { BmFilePicker },
    methods: {
      imgDeal (event) {
        let vm = this
        readerFile(event.target.files[0], {min: true}).then(result => {
          Indicator.open()
          api.base.commonUploadFile({
            data: {
              applyNo: this.applyNo || '',
              fileStr: result.base64 ? result.base64.split('base64,')[1] : null,
              sourceFlag: this.sourceFlag || '',
              token: simpleLocalDb.getItem('token')
            }
          }).then(imgResult => {
            Indicator.close()
            if (imgResult.responseCode === 0) {
              vm.$emit('pick', imgResult.fileList)
            }
          })
        })
      }
    }
  }
</script>
