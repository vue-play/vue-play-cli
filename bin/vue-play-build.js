'use strict'
const trash = require('trash')
const makeConfig = require('../lib/make-config')
const build = require('../lib/build')

module.exports = (input, flags) => {
  const options = Object.assign({
    entry: input[0] || './play/index.js',
    type: 'build'
  }, flags)

  const config = makeConfig(options)

  // clean dist before build
  if (options.clean) {
    return trash([options.dist]).then(() => {
      build(config, options)
    })
  }

  // run build without clean dist
  return build(config, options)
}
