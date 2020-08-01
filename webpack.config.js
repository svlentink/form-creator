const path = require('path')

module.exports = [{
  mode: "production",
  entry: [
    './main.js'
  ],
  output: {
    filename: 'bundled.js',
    path: __dirname
  },
  node: {
    fs: 'empty'
  },
  optimization: {
    minimize: true
  }
}]

