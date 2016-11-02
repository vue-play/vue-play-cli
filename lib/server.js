'use strict'
const path = require('path')
const chalk = require('chalk')
const express = require('express')
const webpack = require('webpack')

module.exports = function (webpackConfig, options) {
  const app = express()

  const port = options.port

  const compiler = webpack(webpackConfig)

  const devMiddleWare = require('webpack-dev-middleware')(compiler, {
    publicPath: webpackConfig.output.publicPath,
    stats: {
      colors: true,
      modules: false,
      children: false,
      chunks: false,
      chunkModules: false
    }
  })
  app.use(devMiddleWare)
  app.use(require('webpack-hot-middleware')(compiler))

  const mfs = devMiddleWare.fileSystem
  const file = path.join(webpackConfig.output.path, 'index.html')

  devMiddleWare.waitUntilValid(() => {
    console.log(chalk.green('\nCompiled successfully!\n'))
    console.log(`Vue Play is running at http://localhost:${port}\n`)
  })

  app.get('*', (req, res) => {
    devMiddleWare.waitUntilValid(() => {
      const html = mfs.readFileSync(file)
      res.end(html)
    })
  })

  app.listen(port)
}
