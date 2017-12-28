<template>
  <bm-layout>
    <bm-header slot="header">
      我的门店
      <div class="store360__store__nav" slot="right" @click="change" v-show="list.length">{{isChange ? '完成' : '调整顺序'}}</div>
    </bm-header>
    <ul>
      <li class="store360__store__list flex" v-for="(item, index) in list">
        <div>
          <p class="store360__sequence">{{index + 1}}</p>
        </div>
        <aside class="flex-auto">
          <div class="item flex" :class="{'ell': isChange}">
            <div class="info flex-auto">
              <p class="name">{{item.storeId}} {{item.storeName}}</p>
              <p class="adress">地址：{{item.address}}</p>
            </div>
            <div class="column__sequence flex flex-column justify-between" v-if="isChange">
              <p class="up" :class="{'disable': index === 0}" @click="up(item, index)"></p>
              <p class="down" :class="{'disable': index === list.length-1}" @click="down(item, index)"></p>
            </div>
          </div>
        </aside>
      </li>
    </ul>
    <bm-empty v-show="list.length === 0"></bm-empty>
  </bm-layout>
</template>
<style lang="less" scoped>
  .store360__store__nav {
    padding-right: .1rem;
    font-size: .14rem;
    text-decoration: underline;
  }
  .store360__store__list {
    padding-top: .13rem;
    background: #fff;
    &:last-child {
      border-bottom: solid 1px #d7d7d7;
      .item {
        border: none;
      }
    }
    .item {
      margin-left: .1rem;
      padding-right: .1rem;
      padding-bottom: .15rem;
      border-bottom: solid 1px #e5e5e5;
      &.ell {
        overflow: hidden;
        .info {
          overflow: hidden;
        }
        .name, .adress {
          max-width:100%;
          overflow:hidden;
          text-overflow:ellipsis;
          white-space:nowrap;
        }
      }
    }
    .name {
      margin-bottom: .1rem;
      font-size: .15rem;
      color: #333;
    }
    .adress {
      font-size: .12rem;
      color: #666;
    }
    .column__sequence {
      padding: 0 .16rem;
    }
    .up, .down {
      width: .16rem;
      height: .16rem;
      background: url('~@/assets/store360/ic_moveUp.png') no-repeat center / 100%;
    }
    .down {
      background-image: url('~@/assets/store360/ic_moveDown.png');
    }
    .disable {
      &.up {
        background-image: url('~@/assets/store360/ic_moveUp_disable.png');
      }
      &.down {
        background-image: url('~@/assets/store360/ic_moveDown_disable.png');
      }
    }
  }
  .store360__sequence {
    display: inline-block;
    margin-top: .02rem;
    padding: .02rem .1rem;
    background: #79d4ff;
    color: #fff;
    font-size: .13rem;
    text-align: center;
    border-top-right-radius: 1em;
    border-bottom-right-radius: 1em;
  }
</style>
<script>
  import api from '@/api'
  import { mapGetters } from 'vuex'
  export default {
    data () {
      return {
        isChange: false,
        list: []
      }
    },
    computed: {
      ...mapGetters({
        store: 'store360/store',
        storeList: 'store360/storeList',
        activeStoreIndex: 'store360/activeStoreIndex'
      })
    },
    methods: {
      up (item, index) {
        if (!index) return
        this.list.splice(index, 1)
        this.list.splice(index - 1, 0, item)
      },
      down (item, index) {
        if (index === this.list.length + 1) return
        this.list.splice(index, 1)
        this.list.splice(index + 1, 0, item)
      },
      change () {
        if (this.isChange) {
          this.list.forEach((item, index) => {
            item.priority = index + 1 // 更新优先级
            if (item.storeId === this.store.storeId) {
              this.$store.commit('store360/storeList', this.list)
              this.$store.commit('store360/activeStoreIndex', index) // 更新当前门店所在的新序号
            }
          })
          api.store360.saveStorePriority({
            data: {
              itemList: this.list,
              token: simpleLocalDb.getItem('token')
            }
          }).then(res => {
            if (res.responseCode === 0) {
              this.$toast('调整成功！')
            }
          })
        }
        this.isChange = !this.isChange
      }
    },
    mounted () {
      this.list = this.storeList.concat()
    }
  }
</script>
