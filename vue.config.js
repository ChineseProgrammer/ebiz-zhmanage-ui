
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
// const htmlWebpackPlugin = require('html-webpack-plugin');

const CompressionPlugin = require('compression-webpack-plugin')

const productionGzipExtensions = ["js", "css", 'scss']; // 需要gzip压缩的文件后缀
console.log(process.env.VUE_APP_API);
module.exports = {
  lintOnSave: false,
  css: {
    loaderOptions: { // 向 CSS 相关的 loader 传递选项
      less: {
        javascriptEnabled: true
      }
    }
  },
  // 下面是本配置文件的参考文章
  // 参考地址 https://blog.csdn.net/qq_35167373/article/details/80671346
  // https://segmentfault.com/a/1190000016006971
  // https://github.com/vuejs/vue-cli/tree/3b9ecf38fb5a8b0ef8e4ee18bba6761f9c457663/docs/zh

  // build之后输出的文件夹 为 dist/环境名 如: dist/uat/***
  //outputDir: 'dist/' + process.env.NODE_ENV,
  publicPath: process.env.NODE_ENV === 'production' ? '/' : '/',
  // 下方的配置是webpack的配置 从上面的文章能够找到其他的 webpack配置项
  // 下方目前启用了压缩机制 使用了插件 uglifyjs-webpack-plugin
  // 参考地址 https://github.com/webpack-contrib/uglifyjs-webpack-plugin
  configureWebpack: config => {
    if (process.env.NODE_ENV === 'production') { //判断是生产环境
      let compress = {
        drop_debugger: false,
        // pure_funcs: ["console.log"], //移除console
      }
      if(process.env.VUE_APP_CONSOLE_ENV !== 'uat'){
        compress.drop_console = true;
        compress.pure_funcs = ["console.log"]
      }
      return {
        plugins: [
          // 构建时开启gzip，降低服务器压缩对CPU资源的占用，服务器也要相应开启gzip
          new CompressionPlugin({
            algorithm: 'gzip',//开启gzip
            test: new RegExp("\\.(" + productionGzipExtensions.join("|") + ")$"), // 匹配文件名
            threshold: 10240, // 对超过10k的数据压缩
            deleteOriginalAssets: false // 不删除源文件
          }),
          new UglifyJsPlugin({
            uglifyOptions: {
              output: {
                comments: false, // 去掉注释
              },
              compress: compress,
            },
          }),
        ]
      }
    }
  },
  // configureWebpack: {
  //   optimization: {
  //     minimizer: [
  // new UglifyJsPlugin({
  //   uglifyOptions: {
  //     compress: {
  //       warnings: false,
  //       drop_console: true,
  //       drop_debugger: false,
  //       pure_funcs: ['console.log']
  //     }
  //   }
  // }),

  // new htmlWebpackPlugin({
  //   template: "./public/index.html",
  //   filename:"index.html",
  //   minify: {
  //     minimize: true,
  //     removeConments: true,
  //     collapseWhitespace: true,
  //     minifyCSS: true,
  //     minifyJS: true,

  // }
  // })
  //     ]
  //   }
  // },
  // transpileDependencies: [
  //   'iview/src/locale',
  // ],
  productionSourceMap: false,
  devServer: {
    hot: true, //热加载
    host: '0.0.0.0', //ip地址
    port: 8085, //端口
    https: false, //false关闭https，true为开启
    open: false, //自动打开浏览器
    headers: {
      "Access-Control-Allow-Origin": "*"
    },
    // open: true,
    // host: '0.0.0.0',
    // port: 8080,
    // https: false,
    // //以上的ip和端口是我们本机的;下面为需要跨域的
    proxy: {//配置跨域
      '/api': {
        target: process.env.VUE_APP_API,
        // target: 'http://localhost:4396/',//这里后台的地址模拟的;应该填写你们真实的后台接口
        // target: 'http://192.168.137.217:4396/',//这里后台的地址模拟的;应该填写你们真实的后台接口
        ws: true,
        changOrigin: true,//允许跨域
        pathRewrite: {
          '^/api': '/mock'
        }
      },


    },
    overlay: {
      warnings: false,
      errors: false
    }
  }

}
