'use strict'
const path = require('path')
const pathExists = require('path-exists')
const yarnGlobally = require('installed-by-yarn-globally')

const _ = module.exports = {}

_.cwd = function (file) {
  return path.resolve(process.cwd(), file || '')
}

_.dir = function (file) {
  return path.join(__dirname, '../', file || '')
}

// using yarn in current project
_.usingYarn = function () {
  return pathExists.sync(_.cwd('node_modules/.yarn-integrity'))
}

// if installed in cwd/node_modules
_.installedLocally = function () {
  return pathExists.sync(_.cwd('node_modules/vue-play-cli'))
}

_.isYarn = function () {
  return yarnGlobally(__dirname) || (_.usingYarn() && _.installedLocally())
}
