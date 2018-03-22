#!/usr/bin/env node
const { spawn } = require('child_process')
const dargs = require('dargs')
const minimist = require('minimist')

const bin = command => require.resolve(`.bin/${command}`)
const run = (command, args, options) =>
  spawn(bin(command), dargs(args), options)

const argv = minimist(process.argv.slice(3))

const webpackCliOpts = {
  stdio: 'inherit',
  env: {
    ...process.env,
    JUMPSTART: JSON.stringify({
      progress: true,
      ...argv,
    }),
  }
}
const webpackServerOpts = {
  stdio: 'inherit',
  env: {
    ...process.env,
    JUMPSTART: JSON.stringify({
      progress: true,
      ...argv,
    }),
  }
}
const webpackCliArgs = {
  mode: 'production',
  ...argv,
  config: require.resolve('./webpack'),
  pragma: undefined,
  progress: false,
}
const webpackServerArgs = {
  quiet: argv.progress !== false,
  mode: 'development',
  port: 3000,
  ...argv,
  config: require.resolve('./webpack'),
  pragma: undefined,
  progress: false,
}

if (process.argv[2] === 'webpack-cli') {
  run('webpack-cli', webpackCliArgs, webpackCliOpts)
} else if (process.argv[2] === 'webpack-dev-server') {
  run('webpack-dev-server', webpackServerArgs, webpackServerOpts)
} else {
  if(process.argv[2]) console.log('Invalid command!')
  console.log('$ jumpstart webpack-cli|webpack-dev-server [options]')
}
