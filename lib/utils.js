'use strict'
const path = require('path')

const _ = module.exports = {}

_.cwd = function (file) {
  return path.resolve(process.cwd(), file || '')
}

_.dir = function (file) {
  return path.join(__dirname, '../', file || '')
}

// if installed in .yarn-config/global/node_modules/vbuild
_.yarnGlobally = function () {
  return __dirname.indexOf('.yarn-config/global') !== -1
}

// cwd/yarn.lock exists
_.hasLockFile = function () {
  return pathExists.sync(_.cwd('yarn.lock'))
}

// if installed in cwd/node_modules/vbuild
_.installedLocally = function () {
  return detectInstalled('vbuild', true)
}

_.isYarn = function () {
  return _.yarnGlobally() || (_.hasLockFile() && _.installedLocally())
}
