'use strict'
const webpack = require('webpack')
const server = require('../lib/server')
const makeConfig = require('../lib/make-config')

module.exports = (input, flags) => {
  const options = Object.assign({
    type: 'start',
    port: 5000
  }, flags)
  const config = makeConfig(options)
  server(config, options)
}
