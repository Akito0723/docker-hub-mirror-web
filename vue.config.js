const path = require('path')

function resolve(dir) {
  return path.join(__dirname, dir)
}

module.exports = {
  devServer: {
    proxy: {
      '/v2': {
        // 要解决跨域的接口的域名
        target: 'https://docker.aki.cloudns.ch',
        // target: 'https://registry-1.docker.io',
        // 如果接口跨域，需要进行这个参数配置
        changeOrigin: true,
        logLevel: 'debug',
      },
      '/api': {
        // 要解决跨域的接口的域名
        target: 'https://docker.aki.cloudns.ch',
        // target: 'https://registry-1.docker.io',
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