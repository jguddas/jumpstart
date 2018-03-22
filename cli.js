#!/usr/bin/env node
const { spawn } = require('child_process')
const dargs = require('dargs')
const oargs = require('oargs')

const run = command => out => spawn(
  require.resolve(`.bin/${command}`),
  dargs({ ...out.mapped.default, _: out.argv._ }),
  {
    stdio: 'inherit',
    env: {
      ...process.env,
      JUMPSTART: JSON.stringify(out.mapped.env),
    }
  }
)

const cli = oargs()

cli
  .command('build', {
    description: 'run webpack-cli',
    filter: ['default']
  }, run('webpack-cli'))
  .option('mode', { default: 'production', inHelp: false })
  .option('pragma', { filter: 'env', description: 'set jsx pragma' })
  .option('progress', { default: true, filter: 'env', inHelp: false })
  .option('config', { overide: require.resolve('./webpack'), inHelp: false })
  .option('help', { description: 'show webpack-cli help' })

cli
  .command('start', {
    description: 'run webpack-dev-server'
  }, run('webpack-dev-server'))
  .option('mode', { default: 'development', inHelp: false})
  .option('port', { default: 3000, inHelp: false })
  .option('pragma', { filter: 'env', description: 'set jsx pragma' })
  .option('config', { overide: require.resolve('./webpack'), inHelp: false })
  .option('progress', { default: true, filter: 'env', inHelp: false })
  .option('quiet', { default: true, inHelp: false })
  .option('help', { description: 'show webpack-dev-server help' })

if (!cli.parse()) cli.showHelp(require('./package.json'))
