<template>
  <bm-layout>
    <header class="m_header" slot="header">
      <bm-header class="m_head">
        <span v-if="isAdding">新增陈列巡检</span>
        <span v-else>编辑陈列巡检</span>
        <button class="save" slot="right" @click="doSubmit">保存</button>
      </bm-header>
      <div class="m_store-add" v-if="isAdding" @click="doSelectStore">
        <span class="key">门店</span>
        <input class="value" v-if="!store" type="text" readonly placeholder="请选择门店" v-model="store">
        <span class="value" v-else>{{ store }}</span>
        <i class="add"></i>
      </div>
      <div class="m_store" v-else>
        <h2 class="title">{{ id }} {{ store }}</h2>
        <p class="date">创建时间：{{ date | datetime('YYYY-MM-DD HH:mm:ss') }}</p>
      </div>
      <div class="m_overview">
        <span class="count">陈列数：{{ count || 0 }}</span>
        <span class="area">总排面(㎡)：{{ area || 0 }}</span>
        <i class="gap"></i>
        <label class="label">
          <span class="add">添加</span>
          <select class="select" v-model="tempType">
            <option value="default" disabled selected>请选择下列陈列资源</option>
            <option v-for="type of types" :value="type.value">{{ type.name }}</option>
          </select>
        </label>
      </div>
    </header>
    <section class="m_wrap">
      <ul class="m_list">
        <li class="item" v-for="(item, index) of list">
          <div class="head">
            <span class="type">{{ item.type }}</span>
            <i class="gap"></i>
            <label class="c_input-label">
              <input class="c_input-ctrl main-ctrl" type="radio" :value="true" v-model="item.main" @change="doChangeMain($event, item)">
              <span class="c_input-text main">主售点</span>
            </label>
            <button class="del" @click="doDelItem(index)">删除</button>
          </div>
          <div>
            <div class="data-line">
              <label class="data">
                <span class="data-key">数量<small class="data-unit">/个</small></span>
                <input class="data-input" type="text" placeholder="请输入" v-model="item.count" @change="item.count = +item.count || 0">
              </label>
              <i class="small-gap"></i>
              <label class="data">
                <span class="data-key">覆盖人流<br><small class="data-unit">/10分钟</small></span>
                <input class="data-input" type="text" placeholder="请输入" v-model="item.flow" @change="item.flow = +item.flow || 0">
              </label>
            </div>
            <div class="data-line">
              <label class="data">
                <span class="data-key">排面<small class="data-unit">/㎡</small></span>
                <input class="data-input" type="text" placeholder="请输入" v-model="item.area" @change="item.area = +item.area || 0">
              </label>
              <i class="small-gap"></i>
              <label class="data">
                <span class="data-key">纵深<small class="data-unit">/m</small></span>
                <input class="data-input" type="text" placeholder="请输入" v-model="item.deep" @change="item.deep = +item.deep || 0">
              </label>
            </div>
          </div>
          <div class="status-line">
            <span class="status-title">状态</span>
            <label class="c_input-label status-label">
              <input class="c_input-ctrl status-ctrl" type="radio" :value="true" v-model="item.normal">
              <span class="c_input-text status">正常</span>
            </label>
            <label class="c_input-label">
              <input class="c_input-ctrl status-ctrl" type="radio" :value="false" v-model="item.normal">
              <span class="c_input-text status">异常</span>
            </label>
          </div>
          <div class="textarea-wrap">
            <textarea class="textarea" maxlength="100" v-model="item.desc" placeholder="填写说明，字数100字以内。"></textarea>
          </div>
          <div>
            <h4 class="pics-title">照片 <small class="pics-small">最多上传5张</small></h4>
            <div class="pics">
              <i class="pic" @click="doPreview(pic.src)" v-for="(pic, index) of item.pics" :style="{ 'backgroundImage': `url(${pic.src})` }">
                <button class="pic-del" @click.stop="item.pics.splice(index, 1)"></button>
              </i>
              <label class="pic add" v-if="item.pics.length < 5">
                <input class="add-input" accept="image/*" type="file" @change="doUpload($event, item)">
              </label>
            </div>
          </div>
        </li>
      </ul>
    </section>
    <comp-popup slot="top" ref="popup">
      <i class="m_preview" :style="{ 'backgroundImage': `url(${tempPicSrc})` }" @click="doClosePreview"></i>
    </comp-popup>
  </bm-layout>
</template>
<script>
  class ListItem {
    constructor (config) {
      this.type = config.type || ''
      this.typeCode = config.typeCode || ''
      this.main = config.main || false
      this.count = (config.count || typeof config.count === 'number') ? config.count : ''
      this.flow = (config.flow || typeof config.flow === 'number') ? config.flow : ''
      this.area = (config.area || typeof config.area === 'number') ? config.area : ''
      this.deep = (config.deep || typeof config.deep === 'number') ? config.deep : ''
      this.normal = typeof config.normal === 'boolean' ? config.normal : ''
      this.desc = config.desc || ''
      this.pics = (function () {
        let res = []
        for (let pic of config.pics || []) {
          res.push({
            src: pic.src || '',
            guid_api: pic.guid_api || ''
          })
        }
        return res
      })()
    }
  }
  class TypeItem {
    constructor (item) {
      this.value = item.value || ''
      this.name = item.name || ''
      this.isDefault = item.isDefault || false
    }
  }
  import BmSelectPage from '@/components/plugins/BmSelectPage'
  import selectStore from '@/views/common/selectStore'
  import CompPopup from './popup'
  import ImageLoader from 'blueimp-load-image'
  import { sfa as Api } from '@/utils/baseRequest'
  export default {
    data () {
      return {
        isAdding: false,
        isFinished: false,
        id: '',
        store: '',
        storeId: '',
        date: '',
        list: [],
        types: [],
        tempType: '',
        tempPicSrc: '',
        tempExitFlag: false
      }
    },
    computed: {
      count () {
        let total = 0
        for (let item of this.list) {
          total += (+item.count || 0)
        }
        return Math.round(total * 100) / 100
      },
      area () {
        let total = 0
        for (let item of this.list) {
          total += (+item.area || 0)
        }
        return Math.round(total * 100) / 100
      }
    },
    watch: {
      tempType (v) {
        if (v && v !== 'default') {
          let typeCode = v
          let type
          for (let item of this.types) {
            if (item.value === v) {
              type = item.name
              break
            }
          }
          this.list.unshift(new ListItem({ type, typeCode, normal: true }))
          setTimeout(() => {
            this.tempType = 'default'
          }, 1)
        }
      }
    },
    methods: {
      async doInit () {
        this.id = this.$route.query['id'] || ''
        this.isAdding = !this.id
        let types = await Api.post('/inspect/getInspectResourceList', {
          'fildType': ''
        }, {
          '_NEED_CODE_0': true,
          '_INDICATOR': true
        }).then(function (res) {
          let types = []
          for (let type of res['inspectResourceList']) {
            types.push(new TypeItem({
              'value': type['resource_code'],
              'name': type['resource_name'],
              'isDefault': +type['isDefaultSort'] === 1
            }))
          }
          return types
        })
        this.types = types
        if (this.isAdding) {
          for (let type of types) {
            if (type.isDefault) {
              this.list.push(new ListItem({
                'type': type['name'],
                'typeCode': type['value'],
                'normal': true
              }))
            }
          }
        } else {
          let { 'inspectVo': res } = await Api.post('/inspect/getInspectInfoByOrderNo', {
            'orderNo': this.id,
            'token': simpleLocalDb.getItem('token')
          }, {
            '_NEED_CODE_0': true,
            '_INDICATOR': true
          })
          this.store = res['storeName']
          this.storeId = res['storeId']
          this.date = res['planDate']
          for (let item of res['inspectConfList'] || []) {
            this.list.push(new ListItem({
              type: item['inspectTypeDesc'],
              typeCode: item['inspectTypeCode'],
              main: !!item['isPointSale'],
              count: item['inspectNum'] || 0,
              flow: item['personFlow'] || 0,
              area: item['area'] || 0,
              deep: item['depth'] || 0,
              normal: item['inspectStatus'] === 'normal',
              desc: item['inspectExplain'],
              pics: (function () {
                let pics = []
                for (let pic of item['fileList'] || []) {
                  pics.push({
                    src: pic['filePath'],
                    guid_api: pic['filePath']
                  })
                }
                return pics
              })()
            }))
          }
        }
        return this.list
      },
      doCheckBeforeSubmit () {
        if (!this.storeId) {
          this.$toast('请选择门店')
          return false
        }
        if (!this.list.length) {
          this.$toast('请添加陈列资源')
          return false
        }
        {
          let res = this.list.some(function (v) {
            return v.main
          })
          if (!res) {
            this.$toast('请选择主售点')
            return false
          }
        }
        for (let item of this.list) {
          if (!item.pics.length) {
            this.$toast('请上传照片')
            return false
          }
        }
        return true
      },
      async doSubmit () {
        if (!this.doCheckBeforeSubmit()) return
        let list = []
        for (let item of this.list) {
          list.push({
            'area': +item.area || 0,
            'depth': +item.deep || 0,
            'fileList': (function () {
              let res = []
              for (let pic of item.pics) {
                res.push({
                  'filePath': pic.src,
                  'guid': pic.guid_api
                })
              }
              return res
            })(),
            'inspectExplain': item.desc,
            'inspectNum': +item.count || 0,
            'inspectStatus': item.normal === false ? 'abnormal' : 'normal',
            'inspectTypeCode': item.typeCode,
            'isPointSale': item.main ? 1 : 0,
            'personFlow': +item.flow || 0
          })
        }
        let res = await Api.post('/inspect/saveInspectInfo', {
          'inspectConfList': list,
          'orderNo': this.id,
          'storeId': this.storeId,
          'token': simpleLocalDb.getItem('token')
        }, {
          '_NEED_CODE_0': true,
          '_INDICATOR': true
        })
        this.isFinished = true
        this.$store.dispatch('showcasePatrol/indexGetList', this.$store.state['showcasePatrol']['indexKeyword'])
        this.$router.back()
        return res
      },
      async doDelItem (index) {
        await this.$messagebox.confirm('确定删除此陈列资源么？')
        return this.list.splice(index, 1)
      },
      async doChangeMain (ev, chosenItem) {
        if (chosenItem.main) {
          let chose = this.list.some(function (v) {
            return v.main && v !== chosenItem
          })
          if (chose) {
            // 不是第一次选了
            let oldChosenItem
            for (let item of this.list) {
              if (item.main && item !== chosenItem) {
                item.main = false
                oldChosenItem = item
              }
            }
            await this.$messagebox.confirm('确定更换主售点么？').catch(function (err) {
              oldChosenItem.main = true
              chosenItem.main = false
              throw err
            })
          }
          return chosenItem
        }
      },
      async doUpload (ev, listItem) {
        let file = ev.target.files[0]
        let base64 = await new Promise(function (resolve, reject) {
          ImageLoader(file, function (canvas) {
            resolve(canvas.toDataURL().replace(/.*?base64,/, ''))
          }, {
            orientation: true,
            canvas: true,
            maxWidth: 1000,
            maxHeight: 1000
          })
        })
        let { 'fileList': res } = await Api.post('/base/commonUploadFile', {
          'applyNo': '',
          'fileStr': base64,
          'sourceFlag': 'inspect',
          'token': simpleLocalDb.getItem('token')
        }, {
          '_INDICATOR': true,
          '_NEED_CODE_0': true
        })
        if (res.length) {
          listItem.pics.push({
            src: res[0]['filePath'],
            guid_api: res[0]['guid']
          })
          return res
        } else {
          return Promise.reject(res)
        }
      },
      doPreview (src) {
        this.tempPicSrc = src
        this.$refs.popup.open()
      },
      doClosePreview () {
        this.$refs.popup.close()
      },
      async doSelectStore () {
        let res = await BmSelectPage({ component: selectStore })
        this.store = res['storeName']
        this.storeId = res['storeId']
        return res
      },
      doCheckChanged () {
        if (this.isFinished) return false
        if (this.isAdding) {
          if (this.storeId) return true
          for (let item of this.list) {
            if (item.main) return true
            if (item.count > 0) return true
            if (item.flow > 0) return true
            if (item.area > 0) return true
            if (item.deep > 0) return true
            if (!item.normal) return true
            if (item.desc) return true
            if (item.pics && item.pics.length) return true
          }
          return false
        }
        return true
      }
    },
    created () {
      this.doInit()
    },
    components: { CompPopup },
    async beforeRouteLeave (to, from, next) {
      let flag = this.tempExitFlag ? false : this.doCheckChanged()
      if (flag) {
        next(false)
        await this.$messagebox.confirm('你还没有保存，确认退出么？')
        this.tempExitFlag = true
        this.$router.back()
      } else {
        next()
      }
    }
  }
</script>
<style lang="less" scoped>
  @color1: #1FB8FF;
  @color2: #FFC924;
  @color3: #FF6C47;
  @color_b1: #D7D7D7;
  @color_b2: #E5E5E5;
  @color_t1: #333;
  @color_t2: #666;
  @color_t3: #999;

  @offset1: 0.1rem;
  @offset2: 0.15rem;
  @offset3: 0.2rem;

  @size0: 0.12rem;
  @size1: 0.13rem;
  @size2: 0.14rem;
  @size3: 0.15rem;

  input, button, textarea {
    border: none;
    background-color: transparent;
    color: inherit;
    font-size: inherit;
  }
  a {
    color: inherit;
    text-decoration: inherit;
  }

  .c_input {
    &-label {
      flex-shrink: 0;
      position: relative;
    }
    &-ctrl {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      opacity: 0;
    }
    &-text {
      display: block;
      background: left no-repeat;
      background-size: contain;
    }
  }

  .m_header {
    .m_head {
      .save {
        font-size: @size2;
        text-decoration: underline;
        padding-left: @offset1;
        padding-right: @offset1;
      }
    }
    .m_store-add {
      background-color: #fff;
      padding: @offset1;
      border-bottom: 1px solid @color_b1;
      display: flex;
      align-items: baseline;
      font-size: @size3;
      color: @color_t1;
      .key {
        flex-shrink: 0;
      }
      .value {
        flex-grow: 1;
        margin-left: @offset1;
        text-align: right;
      }
      .add {
        flex-shrink: 0;
        margin-left: @offset1;
        width: 0.07rem;
        height: 1em;
        background: url("~@/assets/showcasePatrol/rightArrow.png") bottom no-repeat;
        background-size: contain;
      }
    }
    .m_store {
      display: block;
      border-bottom: 1px solid @color_b1;
      background-color: #fff;
      padding: @offset1;
      color: @color_t1;
      .title {
        font-size: @size3;
        font-weight: normal;
      }
      .date {
        margin-top: @offset1;
        font-size: @size0;
      }
    }
    .m_overview {
      display: flex;
      align-items: center;
      font-size: @size1;
      color: @color_t1;
      margin: @offset1;
      font-weight: bold;
      .count, .area {
        word-wrap: break-word;
        overflow: hidden;
      }
      .area {
        margin-left: @offset3;
      }
      .gap {
        flex-grow: 1;
      }
      .label {
        display: block;
        position: relative;
        flex-shrink: 0;
        /* overflow: hidden; */
      }
      .add {
        display: block;
        height: 0.22rem;
        font-weight: normal;
        line-height: 0.22rem;
        color: @color1;
        background: url("~@/assets/showcasePatrol/add2@2x@2x.png") left no-repeat;
        background-size: contain;
        padding-left: 0.27rem;
        position: relative;
      }
      .select {
        position: absolute;
        left: 0;
        top: 0;
        width: 100%;
        height: 100%;
        opacity: 0;
      }
    }
  }
  .m_wrap {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    overflow: hidden;
    overflow-y: auto;
    .m_list {
      .item {
        display: block;
        margin: @offset1 0;
        border-bottom: 1px solid @color_b1;
        background-color: #fff;
        &:first-child {
          margin-top: 0;
        }
      }
      .head {
        font-size: @size2;
        color: @color_t1;
        display: flex;
        align-items: center;
        margin-left: @offset1;
        border-bottom: 1px solid @color_b2;
        padding: @offset2 @offset1;
        padding-left: 0;
      }
      .type {
        font-weight: bold;
        color: @color_t1;
        font-size: 0.18rem;
        margin-right: @offset1;
      }
      .gap {
        flex-grow: 1;
      }
      .main {
        display: block;
        background-image: url("~@/assets/showcasePatrol/circle@2x@2x.png");
        padding-left: 0.25rem;
        line-height: 0.2rem;
        height: 0.2rem;
      }
      .main-ctrl:checked + .main {
        background-image: url("~@/assets/showcasePatrol/select@2x@2x.png");
      }
      .del {
        flex-shrink: 0;
        height: 0.16rem;
        background: url("~@/assets/showcasePatrol/minus@2x.png") left no-repeat;
        background-size: contain;
        padding-left: 0.21rem;
        margin-left: 0.4rem;
      }
      .data-line {
        display: flex;
        margin: @offset2 @offset1;
      }
      .data {
        flex-grow: 1;
        flex-shrink: 1;
        display: flex;
        align-items: center;
        overflow: hidden;
      }
      .data-key {
        width: 0.6rem;
        color: @color_t2;
        font-size: @size1;
        flex-shrink: 0;
      }
      .data-unit {
        font-size: @size0;
        color: #3F3F3F;
      }
      .data-input {
        min-width: 0;
        flex-shrink: 1;
        flex-grow: 1;
        background-color: #fff;
        border: 1px solid @color_b1;
        border-radius: 4px;
        height: 0.26rem;
        text-align: center;
        color: @color1;
        font-size: @size3;
      }
      .small-gap {
        width: 0.33rem;
        flex-shrink: 1;
      }
      .status-line {
        display: flex;
        align-items: center;
        font-size: @size2;
        color: @color_t1;
        margin: @offset2 @offset1;
      }
      .status-label {
        margin-right: @offset3;
      }
      .status-title {
        margin-right: @offset1;
      }
      .status {
        background-image: url("~@/assets/showcasePatrol/circle@2x@2x.png");
        height: 0.2rem;
        line-height: 0.2rem;
        padding-left: 0.25rem;
      }
      .status-ctrl:checked + .status {
        background-image: url("~@/assets/showcasePatrol/select@2x@2x.png");
      }
      .textarea-wrap {
        margin: @offset2 @offset1;
      }
      .textarea {
        font-size: @size2;
        display: block;
        background: #FBFBFB;
        border: 1px solid @color_b1;
        border-radius: 4px;
        width: 100%;
        height: 0.6rem;
        padding: 0.07rem 0.1rem;
        color: @color_t1;
      }
      .pics-title {
        margin: @offset2 @offset1;
        margin-bottom: 0;
        font-size: @size1;
        color: @color_t1;
        font-weight: normal;
      }
      .pics-small {
        font-size: @size0;
        color: @color_t3;
      }
      .pics {
        margin: @offset1;
        margin-top: 0;
        display: flex;
        flex-wrap: wrap;
      }
      .pic {
        position: relative;
        margin: @offset2 @offset3 0 0;
        width: 0.6rem;
        height: 0.6rem;
        background: center no-repeat #fff;
        background-size: cover;
      }
      .pic-del {
        position: absolute;
        width: 0.15rem;
        height: 0.15rem;
        top: -0.0725rem;
        right: -0.0725rem;
        background: url("~@/assets/showcasePatrol/addToUpload@2x.png") center no-repeat transparent;
        background-size: contain;
        transform: rotate(45deg);
      }
      .add {
        border: 1px dashed #FFE3DC;
        border-radius: 3px;
        background: url("~@/assets/showcasePatrol/addToUpload@2x.png") center no-repeat transparent;
        background-size: 50%;
        position: relative;
      }
      .add-input {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        opacity: 0;
      }
    }
  }
  .m_preview {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: center no-repeat;
    background-size: contain;
  }
</style>