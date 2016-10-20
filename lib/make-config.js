'use strict'
const pathExists = require('path-exists')
const webpack = require('webpack')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const ExtractTextPlugin = require('extract-text-webpack-plugin')
const ProgressPlugin = require('webpack/lib/ProgressPlugin')
const handleUserConfig = require('./handle-user-config')
const _ = require('./utils')

module.exports = function (options) {
  const postcss = [
    require('autoprefixer')({browsers: options.browsers}),
    require('postcss-nested'),
    require('postcss-simple-vars')
  ]

  const alias = {}
  if (options.excludeRuntime === false) {
    alias.vue = 'vue/dist/vue'
  }

  let config = {
    entry: [options.entry],
    output: {
      path: _.cwd(options.dist),
      filename: '[name].js',
      publicPath: '/'
    },
    resolveLoader: {
      modules: [
        'node_modules',
        _.dir('node_modules')
      ]
    },
    resolve: {
      extensions: ['', '.js', '.vue', '.css'],
      modules: [
        'node_modules',
        _.dir('node_modules')
      ],
      alias
    },
    module: {
      loaders: [
        {
          test: /\.js$/,
          loader: 'babel',
          exclude: [/node_modules|dist/]
        },
        {
          test: /\.vue$/,
          loader: 'vue'
        },
        {
          test: /\.(ico|jpg|png|gif|eot|otf|webp|svg|ttf|woff|woff2)(\?.*)?$/,
          loader: 'file',
          query: {
            name: 'static/media/[name].[hash:8].[ext]'
          }
        },
        {
          test: /\.md$/,
          loader: 'html!markdown-it'
        }
      ]
    },
    plugins: [
      new HtmlWebpackPlugin({
        template: _.dir('lib/template.html')
      }),
      new webpack.NoErrorsPlugin()
    ],
    babel: {
      presets: [
        [require.resolve('babel-preset-es2015'), {modules: options.modules}],
        require.resolve('babel-preset-stage-2')
      ],
      plugins: [
        require.resolve('babel-plugin-transform-runtime'),
        require.resolve('babel-plugin-transform-vue-jsx')
      ]
    },
    postcss,
    vue: {
      loaders: {},
      postcss
    },
    'markdown-it': {
      html: true,
      breaks: true,
      linkify: true
    }
  }

  // resolve modules in parent dir if it's in yarn
  const isYarn = (__dirname.indexOf('.yarn-config/global') !== -1) || // global
    pathExists.sync(_.cwd('yarn.lock')) // local
  if (isYarn) {
    config.resolve.modules.push(_.dir('../'))
    config.resolveLoader.modules.push(_.dir('../'))
  }

  const testLocally = __dirname.indexOf('/node_modules/') === -1
  if (!testLocally || options.insertCSS) {
    config.entry.push('vue-play/dist/vue-play.css')
  }

  const cssModules = options.cssModules ?
    '&modules&importLoaders=1&localIdentName=[name]__[local]___[hash:base64:5]' :
    ''

  if (options.production) {
    config.devtool = 'source-map'
    config.output.filename = '[name].[chunkhash:8].js'
    config.plugins.push(
      new webpack.optimize.UglifyJsPlugin({
        sourceMap: true,
        compressor: {
          warnings: false
        },
        output: {
          comments: false
        }
      }),
      new ExtractTextPlugin('[name].[contenthash:8].css'),
      new ProgressPlugin()
    )
    config.module.loaders.push(
      {
        test: /\.css$/,
        loader: ExtractTextPlugin.extract({
          fallbackLoader: 'style-loader',
          loader: `css?sourceMap&-autoprefixer&minimize${cssModules}!postcss`
        })
      }
    )
    config.vue.loaders.css = ExtractTextPlugin.extract({
      fallbackLoader: 'vue-style-loader',
      loader: 'css?sourceMap&-autoprefixer&minimize'
    })
  } else {
    config.devtool = 'eval-source-map'
    config.entry.push(
      (isYarn && !testLocally) ?
      _.dir('../webpack-hot-middleware/client') :
      _.dir('node_modules/webpack-hot-middleware/client')
    )
    config.plugins.push(
      new webpack.HotModuleReplacementPlugin()
    )
    config.module.loaders.push(
      {
        test: /\.css$/,
        loader: `style!css?-autoprefixer${cssModules}!postcss`
      }
    )
  }

  if (options.webpackConfig) {
    config = require(_.cwd(options.webpackConfig))
  }

  if (options.config) {
    config = handleUserConfig(config, options)
  }

  return config
}
