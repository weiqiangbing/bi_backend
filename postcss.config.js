const config = require('./src/lib/config')
module.exports = {
    plugins: {
      autoprefixer: {},
      'postcss-px2rem-exclude': {
        remUnit: config.pxRemUnit,
        exclude: /node_modules|folder_name/i
      },
    }
  };