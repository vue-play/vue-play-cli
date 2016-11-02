'use strict'
const webpack = require('webpack')
const server = require('webpack-hot-server')
const makeConfig = require('../lib/make-config')

module.exports = (input, flags) => {
  const options = Object.assign({
    type: 'start',
    port: 5000
  }, flags)
  const config = makeConfig(options)
  const app = server({
    config,
    webpack,
    hot: true,
    customIndex: true,
    stats: {
      colors: true,
      modules: false,
      children: false,
      chunks: false,
      chunkModules: false
    }
  })
  app.listen(options.port)
  console.log(`> http://localhost:${options.port}`)
}
