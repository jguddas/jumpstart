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
  .command('build', {
    description: 'run webpack-cli',
    alias: 'prod',
  }, run('webpack-cli'))
  .option('mode', { default: 'production', inHelp: false })
  .option('pragma', { filter: 'env', description: 'set jsx pragma' })
  .option('progress', { default: true, filter: 'env', inHelp: false })
  .option('config', { overide: require.resolve('./webpack'), inHelp: false })
  .option('help', { description: 'show webpack-cli help' })

cli
  .command('start', {
    description: 'run webpack-dev-server',
    alias: 'dev'
  }, run('webpack-dev-server'))
  .option('mode', { default: 'development', inHelp: false})
  .option('port', { default: 3000, inHelp: false })
  .option('pragma', { filter: 'env', description: 'set jsx pragma' })
  .option('config', { overide: require.resolve('./webpack'), inHelp: false })
  .option('progress', { default: true, filter: 'env', inHelp: false })
  .option('quiet', { default: true, inHelp: false })
  .option('help', { description: 'show webpack-dev-server help' })

cli
  .command('lint', {
    description: 'run eslint',
    alias: 'eslint'
  }, out => run('eslint')({
    ...out,
    argv: {
      ...out.argv,
      _: out.argv._.length ? out.argv._ : ['src']
    }
  }))
  .option('config', {
    overide: require.resolve('./eslint'),
    alias:'c',
    inHelp: false
  })
  .option('ext', { default: '.js,.jsx,.lsc,.lsx', inHelp: false })
  .option('pragma', { filter: 'env', description: 'set jsx pragma' })
  .option('help', { description: 'show eslint help' })

cli
  .command('compile', {
    description: 'run babel-cli',
    alias: 'babel',
    aliases: {
      D: 'copy-files',
      M: 'module-ids',
      V: 'version',
      d: 'out-dir',
      f: 'filename',
      h: 'help',
      o: 'out-file',
      q: 'quiet',
      s: 'source-maps',
      w: 'watch',
      x: 'extensions',
    }
  }, run('babel'))
  .option('presets', {
    inHelp: false,
    default: require.resolve('./babel'),
    mapper: val => require.resolve('./babel') + ',' + val,
  })
  .option('plugins', {
    inHelp: false,
    default: require.resolve('@oigroup/babel-plugin-lightscript'),
    mapper: x => require.resolve('@oigroup/babel-plugin-lightscript') + ',' + x,
  })
  .option('extensions', { default: '.js,.jsx,.lsc,.lsx', inHelp: false })
  .option('pragma', { filter: 'env', description: 'set jsx pragma' })
  .option('help', { description: 'show babel-cli help' })

if (!cli.parse()) cli.showHelp(require('./package.json'))

