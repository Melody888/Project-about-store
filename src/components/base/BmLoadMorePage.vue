<!--
demo（vuex）
<bm-loadmore-page
  ref="list"
  :value="control"
  @input="setControl"
  :fetch="fetchMethod"
  :dataLength="listLen"
  :initPageIndex="0"
  :pageSize="10"
  :scrollDistance="20">
  <li v-for="item in dataList">{{item['price']}}...</li>
</bm-loadmore-page>

demo
<bm-loadmore-page
  ref="list"
  v-model="control"
  :fetch="fetchMethod"
  :dataLength="['dayList']"
  :initPageIndex="0"
  :pageSize="10"
  :scrollDistance="20">
  <li v-for="item in dataList">{{item['price']}}...</li>
</bm-loadmore-page>

说明：该组件只是在bm-loadmore上包装了一层，减少编写模版代码；
使用该组件有以下几点需要注意：

1、如果该分页需要保存在vuex中(即保存数据和分页的页数和状态)，则需要在state中
新建一个如下的分页控制数据结构：
{
  pageIndex: 0/1,     // 当前请求的页数
  loading: false,     // 无限滚动加载的开关
  loaded: false       // 是否已加载完所有数据
}
同时设置相对应的getters和mutations，并设置在组件属性的[value]和[input]中，如上
的control和setControl

如果你不需要使用到vuex来保存数据和分页信息，则只需要在使用页面的data中新建上面的
数据结构，并在组件的v-model中设置该值

2、fetchMethod即为列表的请求函数，
值得注意的是，在自己写的请求函数后面 [** 需要返回请求的结果result **]
因为组件需要通过这个结果来设置页数，判断是否全部加载完数据，改变loading的状态。
比如在actions里面：
async fetchData () {
  let result = api.post(.....)
  .....
  result.bmPageIndex = pageIndex
  return result
}
给result添加bmPageIndex来记录pageIndex是为了解决在未知情况下，
同时触发多条相同的请求，导致pageIndex叠加错误；如果你能保证并不会
重复触发相同的请求，那么bmPageIndex可以不用赋值；

3、dataLength参数可以是一个数组或者变量，该参数的目的是计算加载数据的条数，用于
判断是否已经全部加载完数据。
如果请求返回的数据结构比较简单，如下：
{
  responseCode: 0,
  dayList: [{},{},....]
  ....
}
数据都存储在dayList里面，则只需要这样设置dataLength:
:dataLength="['dayList']"
如果是存储在dayList里面的itemList，则
:dataLength="['dayList', 'itemList']"

但有时候返回的数据可能比较复杂，这时候就需要你自己来计算了。
如上的listLen，他是设置在data中，存储每次请求返回的数据量，在请求函数中计算他
async fetchMethod () {
  let result = await this.$store.dispatch(....)
  let len = 0
  result.dayList.forEach(e => {
    len += e.itemList.length
  })
  this.listLen = len
  return result       // 返回请求结果，组件计算状态
}

4、pageSize和scrollDistance，pageSize就是你期望返回的数据量，用于内部比较
是否加载完毕。scrollDistance则是无限加载组件的底部出发加载的距离。

5、有时候希望主动触发列表重新加载，则主动调用组件的公共方法：refresh
this.$refs.list.refresh()

6、initPageIndex初始化第一页的pageIndex，默认是0。该参数为解决当加载几页后，
调用refresh时丢失首页页数信息。

-->

<template>
  <bm-loadmore
    ref="page"
    :topMethod="dofetch.bind(this, 'top')">
    <ul
      v-infinite-scroll="dofetch.bind(this)"
      infinite-scroll-disabled="loading"
      infinite-scroll-distance="scrollDistance">
      <slot></slot>
    </ul>
    <slot name="bottom"></slot>
  </bm-loadmore>
</template>

<script>
  import Vue from 'vue'
  export default {
    name: 'bm-loadmore-page',
    props: {
      'value': null,
      'fetch': [Function],
      'dataLength': null,
      'initPageIndex': {
        type: [Number, String],
        default: 0
      },
      'pageSize': {
        type: [Number, String],
        default: 10
      },
      'scrollDistance': [Number]
    },
    data () {
      return {
        loading: this.value.loading,
        loaded: this.value.loaded
      }
    },
    methods: {
      dofetch (status = '') {
        this.loading = true
        if (status) {
          this.loaded = false
          this.$emit('input', Object.assign({}, this.value, { pageIndex: this.initPageIndex, loaded: false, loading: true }))
        } else {
          this.$emit('input', Object.assign({}, this.value, { loading: true }))
        }
        return (async () => {
          await Vue.nextTick()  // 将代码延长到下一次循环，使得pageIndex得到更新
          let result = await this.fetch()
          let val = Object.assign({}, this.value)
          status && this.$refs.page.onTopLoaded()
          if (typeof result === 'object' && result.responseCode === 0) {
            let pageIndex = result.bmPageIndex === undefined ? this.value.pageIndex : result.bmPageIndex
            val.pageIndex = Number(pageIndex) + 1
            let len = this.dataLength
            if (Object.prototype.toString.call(this.dataLength) === '[object Array]') {
              let list = this.dataLength.reduce((r, e) => {
                return r[e]
              }, result)
              len = list.length
            }
            if (len < Number(this.pageSize)) {
              this.loaded = true
              val.loaded = true
            } else {
              this.loading = false
              val.loading = false
            }
            this.$emit('input', val)
          } else {
            this.loaded = true
            val.loaded = true
            this.$emit('input', val)
          }
          return result
        })()
      },
      refresh () { return this.dofetch('top') }
    }
  }
</script>
