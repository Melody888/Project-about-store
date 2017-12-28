import Store from '@/advanced/Store'

const pageKeyStore = new Store()

/**
 * 获得当前路由的key值，只对使用了vue-router库有效
 */
export const getPageKey = () => {
  return window.history.state ? window.history.state.key : window.location.href
}

export const getLastPageKey = () => {
  return pageKeyStore.getItem(window.location.href)
}

export const routerHistory = {
  methods: {
    isBackPage () {
      return getPageKey() === getLastPageKey()
    },
    resetPageKey () {
      pageKeyStore.setItem(window.location.href, getPageKey())
    }
  }
}
