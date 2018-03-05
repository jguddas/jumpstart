#!/usr/bin/env node
const { spawn } = require('child_process')
const dargs = require('dargs')
const minimist = require('minimist')

const bin = command => require.resolve(`.bin/${command}`)
const run = (command, args, options) =>
  spawn(bin(command), dargs(args), options)

const argv = minimist(process.argv.slice(3))

const processOpts = { stdio: 'inherit' }
const webpackCliOpts = {
  mode: 'production',
  ...argv,
  config: require.resolve('./webpack'),
  progress: false,
}
const webpackServerOpts = {
  quiet: true,
  mode: 'development',
  ...argv,
  config: require.resolve('./webpack'),
  progress: false,
}

if (process.argv[2] === 'webpack-cli') {
  run('webpack-cli', webpackCliOpts, processOpts)
} else if (process.argv[2] === 'webpack-dev-server') {
  run('webpack-dev-server', webpackServerOpts, processOpts)
} else {
  console.log('Invalid command!')
  console.log('$ jumpstart webpack-cli|webpack-dev-server [options]')
}
