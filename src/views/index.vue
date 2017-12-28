<template>
  <bm-layout ref="layout">
    <bm-header slot="header">测试标题</bm-header>
    <div><button @click="testSelectPage">选择门店</button></div>
    <div><button @click="testSelectAddr">选择地址</button></div>
    <div><button @click="testselectProduct">选择商品</button></div>
    <div class="fixed-top-element">123213</div>
    <div>
      <input type="radio" class="bm-radio" name="sex" value="man">
      <input type="radio" class="bm-radio" name="sex" value="female">
    </div>
    <div id="imgroot">
      <div v-for="item in imgs">
        <img class="imgitem" :src="item" alt="" @click="testCheckPic(item)" style="max-width: 100%;">
      </div>
    </div>
  </bm-layout>
</template>

<script>
  import BmSelectPage from '@/components/plugins/BmSelectPage'
  import BmCheckPhoto from '@/components/plugins/BmCheckPhoto'
  import selectStore from './common/selectStore'
  import selectAddress from './common/selectAddress'
  import selectProduct from './common/selectProduct'
  import { getCheckPhotoOptions } from '@/utils/dom'
  export default {
    data () {
      return {
        imgs: [
          'https://russellmars.github.io/image/picture/avatar.jpg',
          'https://russellmars.github.io/image/2015/02/hexo-search/hexo-search-config.jpg',
          'https://russellmars.github.io/image/2015/02/hexo-optimizing/hexo-optimizing-music.jpg'
        ]
      }
    },
    methods: {
      testSelectPage () {
        BmSelectPage({
          component: selectStore,
          options: {
            test: 123
          }
        }).then((data) => {
          console.log(data)
        }, (error) => {
          console.log(error)
        })
      },
      testSelectAddr () {
        BmSelectPage({
          component: selectAddress,
          options: {
            test: 123
          }
        }).then((data) => {
          console.log(data)
        }, (error) => {
          console.log(error)
        })
      },
      testselectProduct () {
        BmSelectPage({
          component: selectProduct,
          options: {
            test: 123
          }
        }).then((data) => {
          console.log(data)
        }, (error) => {
          console.log(error)
        })
      },
      testCheckPic (item) {
        BmCheckPhoto(getCheckPhotoOptions(item, window.document.querySelector('#imgroot'), '.imgitem'))
      }
    },
    created () {
      console.log('created')
    },
    mounted () {
      this.$refs.layout.scrollToElementFixedTop()
    }
  }
</script>
