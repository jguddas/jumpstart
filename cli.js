#!/usr/bin/env node
const { spawn } = require('child_process')
const oargs = require('oargs')

const run = command => ({ mapped, argv }) => spawn(
  require.resolve(`.bin/${command}`),
  Object.keys(mapped.default)
    .map(val => `--${val}=${mapped.default[val]}`).concat(argv._),
  {
    stdio: 'inherit',
    env: {
      ...process.env,
      JUMPSTART: JSON.stringify(mapped.env || '{}'),
    }
  }
)

const cli = oargs()

cli
  .command('build', { description: 'run webpack-cli' }, run('webpack-cli'))
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

cli
  .command('lint', { description: 'run eslint' }, out => run('eslint')({
    ...out,
    argv: {
      ...out.argv,
      _: out.argv._.length ? out.argv._ : ['src']
    }
  }))
  .option('config', { overide: require.resolve('./eslint'), inHelp: false })
  .option('ext', { default: '.js,.jsx,.lsc,.lsx', inHelp: false })
  .option('pragma', { filter: 'env', description: 'set jsx pragma' })
  .option('help', { description: 'show eslint help' })

cli
  .command('compile', { description: 'run babel-cli' }, run('babel'))
  .option('presets', {
    inHelp: false,
    default: require.resolve('./babel'),
    mapper: val => require.resolve('./babel') + ',' + val,
  })
  .option('plugins', {
    inHelp: false,
    default: require.resolve('@oigroup/babel-plugin-lightscript'),
    mapper: val => require.resolve('@oigroup/babel-plugin-lightscript') + ',' + val,
  })
  .option('extensions', { default: '.js,.jsx,.lsc,.lsx', alias: 'x', inHelp: false })
  .option('pragma', { filter: 'env', description: 'set jsx pragma' })
  .option('help', { description: 'show babel-cli help' })

if (!cli.parse()) cli.showHelp(require('./package.json'))
