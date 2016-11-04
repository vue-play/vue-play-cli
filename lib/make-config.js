'use strict'
const webpack = require('webpack')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const ExtractTextPlugin = require('extract-text-webpack-plugin')
const webpackMerge = require('webpack-merge')
const _ = require('./utils')

module.exports = function (options) {
  const playEntry = options.entry

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

  const common = {
    entry: {
      app: [_.dir('lib/entries/app.js')],
      preview: [_.dir('lib/entries/preview.js')]
    },
    output: {
      path: _.cwd('dist-play')
    },
    resolve: {
      alias: {
        'play-entry': _.cwd(playEntry)
      },
      root: [
        _.dir('node_modules'),
        _.cwd('node_modules'),
        _.cwd('node_modules/vue-play/node_modules')
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
          test: /\.vue$/,
          loader: 'vue'
        },
        {
          test: /\.(ico|jpg|png|gif|eot|otf|webp|svg|ttf|woff|woff2)(\?.*)?$/,
          loader: 'file',
          query: {
            name: 'static/[name].[hash:8].[ext]'
          }
        },
        {
          test: /\.json$/,
          loaders: ['json']
        },
        {
          test: /\.md$/,
          loaders: ['html', 'markdown-it']
        }
      ]
    },
    'markdown-it': {
      html: true,
      breaks: true,
      linkify: true
    },
    vue: {
      postcss
    },
    postcss,
    babel,
    plugins: [
      new HtmlWebpackPlugin({
        filename: 'index.html',
        chunks: ['app'],
        template: _.dir('lib/template.html')
      }),
      new HtmlWebpackPlugin({
        filename: 'preview.html',
        chunks: ['preview'],
        template: _.dir('lib/template.html')
      }),
      new webpack.optimize.OccurenceOrderPlugin()
    ]
  }

  if (options.standalone) {
    common.resolve.alias.vue$ = 'vue/dist/vue'
  }

  if (_.isYarn()) {
    common.resolve.root.push(_.dir('../'))
    common.resolveLoader.root.push(_.dir('../'))
  }

  let config

  if (options.type === 'build') {
    const cssModules = options.cssModules ?
      `modules&importLoaders=1&localIdentName=[name]__[local]___[hash:base64:5]` :
      ''

    config = webpackMerge.smart(common, {
      devtool: 'source-map',
      output: {
        filename: 'js/[name].[chunkhash:8].js',
        publicPath: './'
      },
      module: {
        loaders: [
          {
            test: /\.css$/,
            loader: ExtractTextPlugin.extract('style-loader', `css-loader?sourceMap${cssModules}!postcss-loader`)
          }
        ]
      },
      plugins: [
        new webpack.NoErrorsPlugin(),
        new webpack.DefinePlugin({
          __DEV__: false,
          'process.env': {
            NODE_ENV: JSON.stringify('production')
          }
        }),
        new webpack.optimize.UglifyJsPlugin({
          compressor: {
            warnings: false
          },
          comments: false
        }),
        new ExtractTextPlugin('css/[name].[contenthash:8].css')
      ],
      vue: {
        loaders: {
          css: ExtractTextPlugin.extract('css')
        }
      }
    })
  }

  if (options.type === 'start') {
    const devClient = require.resolve('webpack-hot-middleware/client') + '?reload=true'
    config = webpackMerge.smart(common, {
      devtool: 'eval-source-map',
      entry: {
        preview: [devClient]
      },
      output: {
        filename: 'js/[name].js',
        publicPath: '/'
      },
      module: {
        loaders: [
          {
            test: /\.css$/,
            loader: 'style!css!postcss'
          }
        ]
      },
      plugins: [
        new webpack.HotModuleReplacementPlugin(),
        new webpack.DefinePlugin({
          __DEV__: true,
          'process.env': {
            NODE_ENV: JSON.stringify('development')
          }
        })
      ]
    })
  }

  if (options.webpackConfig) {
    const userConfig = require(_.cwd(options.webpackConfig))
    config = webpackMerge.smart(config, userConfig)
  }

  return config
}
