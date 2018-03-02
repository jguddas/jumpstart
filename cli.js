#!/usr/bin/env node
const { spawn } = require('child_process')
spawn(
  require.resolve('.bin/webpack-cli'),
  process.argv.slice(2).concat(['--config', require.resolve('./webpack')]),
  { stdio: 'inherit' }
)
