'use strict'
const pathExists = require('path-exists')
const webpack = require('webpack')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const ExtractTextPlugin = require('extract-text-webpack-plugin')
const handleUserConfig = require('./handle-user-config')
const _ = require('./utils')

module.exports = function (options) {
  const postcss = [
    require('autoprefixer'),
    require('postcss-nested'),
    require('postcss-simple-vars')
  ]

  const babel = {
    // enforce default babel config
    babelrc: false,
    presets: [
      require.resolve('babel-preset-es2015'),
      require.resolve('babel-preset-stage-2')
    ],
    plugins: [
      require.resolve('babel-plugin-transform-runtime'),
      require.resolve('babel-plugin-transform-vue-jsx')
    ]
  }

  const config = {
    entry: {
      app: [_.dir('lib/entries/app.js')],
      preview: _.dir('lib/entries/preview.js')
    },
    output: {
      path: _.cwd('dist-play'),
      publicPath: '/'
    },
    resolve: {
      alias: {
        scenarios: _.cwd('play/index.js'),
        vue: 'vue/dist/vue'
      },
      root: [
        _.cwd('node_modules')
      ]
    },
    resolveLoader: {
      root: [
        _.dir('node_modules')
      ]
    },
    module: {
      loaders: [
        {
          test: /\.js$/,
          loader: 'babel',
          exclude: [/node_modules/, new RegExp('../vue-play/dist/')]
        },
        {
          test: /\.css$/,
          loader: 'style!css!postcss'
        },
        {
          test: /\.vue$/,
          loader: 'vue'
        }
      ]
    },
    vue: {
      postcss
    },
    postcss,
    babel,
    plugins: [
      new webpack.optimize.OccurenceOrderPlugin(),
      new HtmlWebpackPlugin({
        filename: 'index.html',
        chunks: ['app'],
        template: _.dir('lib/template.html')
      }),
      new HtmlWebpackPlugin({
        filename: 'preview.html',
        chunks: ['preview'],
        template: _.dir('lib/template.html')
      })
    ]
  }

  if (options.type === 'build') {
    config.devtool = 'source-map'
    config.output.filename = '[name].[chunkhash:8].js'
    config.plugins.push(
      new webpack.DefinePlugin({
        '__DEV__': false,
        'process.env': {
          'NODE_ENV': JSON.stringify('production')
        }
      }),
      new webpack.optimize.UglifyJsPlugin({
        compressor: {
          warnings: false
        },
        comments: false
      })
    )
  }

  if (options.type === 'start') {
    config.devtool = 'eval-source-map'
    config.output.filename = '[name].js'
    config.entry.app.push(require.resolve('webpack-hot-middleware/client'))
    config.plugins.push(
      new webpack.HotModuleReplacementPlugin(),
      new webpack.DefinePlugin({
        '__DEV__': true,
        'process.env': {
          'NODE_ENV': JSON.stringify('development')
        }
      })
    )
  }

  return config
}
