const path = require('path')

function resolve(dir) {
  return path.join(__dirname, dir)
}
// page title
const title = process.env.VUE_APP_TITLE

module.exports = {
  devServer: {
    proxy: {
      '/v2': {
        // 要解决跨域的接口的域名
        target: process.env.VUE_APP_DOMAIN,
        // 如果接口跨域，需要进行这个参数配置
        changeOrigin: true,
        logLevel: 'debug',
      },
      '/api': {
        // 要解决跨域的接口的域名
        target: process.env.VUE_APP_DOMAIN,
        // 如果接口跨域，需要进行这个参数配置
        changeOrigin: true,
        logLevel: 'debug',
      },
    }


  },

  css: {
    loaderOptions: {
      less: {
        javascriptEnabled: true
      }
    }
  },

  configureWebpack: {
    // provide the app's title in webpack's name field, so that
    // it can be accessed in index.html to inject the correct title.
    name: title,
    resolve: {
      alias: {
        '@': resolve('src')
      }
    }
  },

  chainWebpack: config => {
    // set svg-sprite-loader
    config.module
      .rule('svg')
      .exclude.add(resolve('src/icons'))
      .end()
    config.module
      .rule('icons')
      .test(/\.svg$/)
      .include.add(resolve('src/icons'))
      .end()
      .use('svg-sprite-loader')
      .loader('svg-sprite-loader')
      .options({
        symbolId: 'icon-[name]'
      })
      .end()
  }
};