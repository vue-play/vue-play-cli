'use strict'
const webpack = require('webpack')
const makeConfig = require('../lib/make-config')

module.exports = (input, flags) => {
  const options = Object.assign({
    type: 'build'
  }, flags)
  const config = makeConfig(options)
  webpack(config, (err, stats) => {
    if (err) console.log(err)
    console.log(stats.toString({
      colors: true,
      modules: false,
      children: false,
      chunks: false,
      chunkModules: false
    }))
  })
}
