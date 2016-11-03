#!/usr/bin/env node
'use strict'
const cac = require('cac')
const update = require('update-notifier')
const chalk = require('chalk')

const cli = cac()
update({pkg: cli.pkg}).notify()

cli
  .option('config, c', 'Specfic custom user config')
  .option('webpack-config, wc', 'Specific custom webpack config')
  .option('dist, d', 'Dist folder name')
  .option('clean', 'Remove dist directory before bundling in production mode', true)
  .option('css-modules', 'Load css with css-modules', false)
  .option('standalone ', 'Use Vue standalone build', false)

cli.usage(`${chalk.yellow('vue-play')} [entry] <options>`)

cli.command('start', 'Run development server')
cli.command('build', 'Build app')

cli.parse()

