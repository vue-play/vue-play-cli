'use strict'
const webpack = require('webpack')
const Server = require('webpack-dev-server')
const makeConfig = require('../lib/make-config')

module.exports = (input, flags) => {
  const options = Object.assign({
    type: 'start',
    port: 5000
  }, flags)
  const config = makeConfig(options)
  const app = new Server(webpack(config), {
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
