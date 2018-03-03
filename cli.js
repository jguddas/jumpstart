#!/usr/bin/env node
const { spawn } = require('child_process')
if (process.argv[2] === 'webpack-cli') {
  spawn(
    require.resolve('.bin/webpack-cli'),
    process.argv.slice(3).concat(['--config', require.resolve('./webpack')]),
    { stdio: 'inherit' }
  )
} else if (process.argv[2] === 'webpack-dev-server') {
  spawn(
    require.resolve('.bin/webpack-dev-server'),
    process.argv.slice(3).concat(['--config', require.resolve('./webpack')]),
    { stdio: 'inherit' }
  )
}
