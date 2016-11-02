'use strict'
const path = require('path')
const pathExists = require('path-exists')

const _ = module.exports = {}

_.cwd = function (file) {
  return path.resolve(process.cwd(), file || '')
}

_.dir = function (file) {
  return path.join(__dirname, '../', file || '')
}

// if installed in .yarn-config/global/node_modules
_.yarnGlobally = function () {
  return __dirname.indexOf('.yarn-config/global') !== -1
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
  return _.yarnGlobally() || (_.usingYarn() && _.installedLocally())
}
