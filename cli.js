#!/usr/bin/env node
const { spawn } = require('child_process')
const oargs = require('oargs')
const path = require('path')

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
  .option('resolve-alias', {
    filter: 'env',
    inHelp: false,
    mapper: processResolveAlias
  })
  .option('env-target', {
    description: 'set env target',
    filter: 'env',
    mapper: processEnvTarget
  })
  .option('output-css-filename', {
    description: 'output filename of the extracted css',
    filter: 'env'
  })
  .option('extract-css', {
    default: true,
    filter: 'env',
    description: 'extract css, defaults to true'
  })
  .option('template', {
    filter: 'env',
    default: path.join(__dirname, 'webpack/template/index.ejs'),
    description: 'set custom html template'
  })
  .option('template-title', {
    filter: 'env',
    description: 'set custom html template title'
  })
  .option('template-parameters', {
    filter: 'env',
    description: 'set custom html template parameters',
    mapper: JSON.parse,
  })
  .option('template-meta', {
    filter: 'env',
    description: 'set html template meta option',
    default: { viewport: 'width=device-width, initial-scale=1' },
    mapper: val => !val ? {} : Object.assign({
      viewport: 'width=device-width, initial-scale=1'
    }, JSON.parse(val) || {})
  })
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
  .option('extract-css', {
    default: false,
    filter: 'env',
    description: 'extract css, defaults to false'
  })
  .option('resolve-alias', {
    filter: 'env',
    inHelp: false,
    mapper: processResolveAlias
  })
  .option('env-target', {
    description: 'set env target',
    filter: 'env',
    mapper: processEnvTarget
  })
  .option('template', {
    filter: 'env',
    default: path.join(__dirname, 'webpack/template/index.ejs'),
    description: 'set custom html template'
  })
  .option('template-title', {
    filter: 'env',
    description: 'set custom html template title'
  })
  .option('template-parameters', {
    filter: 'env',
    description: 'set custom html template parameters',
    mapper: JSON.parse,
  })
  .option('template-meta', {
    filter: 'env',
    description: 'set html template meta option',
    default: { viewport: 'width=device-width, initial-scale=1' },
    mapper: val => !val ? {} : Object.assign({
      viewport: 'width=device-width, initial-scale=1'
    }, JSON.parse(val) || {})
  })
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
  .option('env-target', {
    description: 'set env target',
    filter: 'env',
    mapper: processEnvTarget
  })
  .option('modules', {
    description: 'env preset modules option',
    default: 'commonjs',
    filter: 'env',
  })
  .option('help', { description: 'show babel-cli help' })


cli
  .command('css', {
    description: 'run postcss-cli',
    alias: 'postcss',
  }, run('postcss'))
  .option('config', {
    overide: require.resolve('./postcss'),
    inHelp: false
  })
  .option('minimize', { description: 'minimize css', filter: 'env' })
  .option('help', { description: 'show postcss-cli help' })

if (!cli.parse()) cli.showHelp(require('./package.json'))

function processEnvTarget(val) {
  const [env, version = true] = val.split(':')
  return { [env]: version }
}

function processResolveAlias(val) {
  return val.split(',').reduce((acc, val) =>
    Object.assign(acc, { [val.split('=')[0]]: val.split('=')[1] })
  , {})
}

