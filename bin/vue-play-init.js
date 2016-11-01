'use strict'
const init = require('../lib/init')

module.exports = (input, flags) => {
  const directory = input[0] || './play'
  return init(directory, flags)
}
