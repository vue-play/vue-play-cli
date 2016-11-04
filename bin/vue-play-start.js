'use strict'
const server = require('../lib/server')
const makeConfig = require('../lib/make-config')

module.exports = (input, flags) => {
  const options = Object.assign({
    entry: input[0] || './play/index.js',
    type: 'start',
    port: 5000
  }, flags)
  const config = makeConfig(options)
  server(config, options)
}
