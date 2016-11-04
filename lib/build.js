'use strict'
const chalk = require('chalk')
const path = require('path')
const webpack = require('webpack')
const tildify = require('tildify')
const ora = require('ora')

module.exports = function (config, options) {
  console.log()
  const spin = ora({
    text: 'Bundling your play app...',
    spinner: 'bouncingBar'
  }).start()
  webpack(config, (err, stats) => {
    if (err) {
      spin.text = 'Error\n'
      spin.fail()
      return console.error(err)
    }
    if (stats.hasErrors()) {
      spin.text = 'Error\n'
      spin.fail()
    } else {
      const friendlyPath = tildify(path.resolve(options.dist))
      spin.text = `Successfully bundled into ${chalk.underline(friendlyPath)}\n`
      spin.succeed()
    }
    console.log(stats.toString({
      colors: true,
      modules: false,
      children: false,
      chunks: false,
      chunkModules: false
    }))
  })
}
