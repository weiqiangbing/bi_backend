// const path = require('path')
const config = require('./src/lib/config')
// const themName = require('./src/lib/them')
// console.log(them);

module.exports = {
  publicPath: process.env.NODE_ENV === 'production' ? './' : './' ,
    // publicPath: process.env.NODE_ENV === 'production' ? '/public/' : './',
    /* 输出文件目录：在npm run build时，生成文件的目录名称 */
    outputDir: config.buildPageName,
    /* 放置生成的静态资源 (js、css、img、fonts) 的 (相对于 outputDir 的) 目录 */
    assetsDir: config.buildStaticName,
    /* 是否在构建生产包时生成 sourceMap 文件，false将提高构建速度 */
    productionSourceMap: false,
    /* 默认情况下，生成的静态资源在它们的文件名中包含了 hash 以便更好的控制缓存，你可以通过将这个选项设为 false 来关闭文件名哈希。(false的时候就是让原来的文件名不改变) */
    // filenameHashing: false,
    /* 代码保存时进行eslint检测 */
    lintOnSave: false,
    /* webpack-dev-server 相关配置 */
    devServer: {
        disableHostCheck: true,
        // https: true,
        // open: true,
        /* 设置为0.0.0.0则所有的地址均能访问 */
        host: '0.0.0.0',
        port: 8084,
        // https: false,
        hotOnly: false,
        /* 使用代理 */
        proxy: {
            '/api': {
                /* 目标代理服务器地址 */
                // target: 'https://hrxsrest.moqing.com/',
                target: 'https://hw-cqscrest.damowang.com/',
                /* 允许跨域 */
                changeOrigin: true,
                ws: true,
                pathRewrite: {
                "^/api" : ''
                }
            },
        },
    },
    pluginOptions: {
        'style-resources-loader': {
            preProcessor: 'less',
            patterns: [
                './src/assets/css/global.less',
                // './src/assets/css/thems/light.less'
            ],
        },
    },
  
}
