#!/usr/bin/env node
const { spawn } = require('child_process')
const dargs = require('dargs')
const minimist = require('minimist')

const assign = (a, b) => Object.assign(a, b)
const concat = x => [].concat(x || []).reduce(assign, {})
const bin = command => require.resolve(`.bin/${command}`)
const run = (command, args, options, dargOpts) =>
  spawn(bin(command), dargs(concat(args), concat(dargOpts)), concat(options))

const processOpts = { stdio: 'inherit' }
const webpackOpts = { config: require.resolve('./webpack') }
const webpackCliOpts = { mode: 'production' }
const webpackServerOpts = { mode: 'development', quiet: true }

const argv = minimist(process.argv.slice(3))

if (process.argv[2] === 'webpack-cli') {
  run('webpack-cli', [webpackOpts, webpackCliOpts, argv], processOpts)
} else if (process.argv[2] === 'webpack-dev-server') {
  run('webpack-dev-server', [webpackOpts, webpackServerOpts, argv], processOpts)
} else {
  console.log('Invalid command!')
  console.log('$ jumpstart webpack-cli|webpack-dev-server [options]')
}
