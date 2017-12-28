module.exports = {
  '/bmcrm-control': {
    target: 'http://tmallapi.bluemoon.com.cn',
    changeOrigin: true,
    pathRewrite: {
      '^/bmcrm-control': '/bmcrm-control'
    }
  }
}
