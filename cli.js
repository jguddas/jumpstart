#!/usr/bin/env node
const { spawn } = require('child_process')
const minimist = require('minimist')
const oargs = require('oargs')
const combon = require('combon')
const json5 = require('json5')
const fs = require('fs')
const path = require('path')
const portfinder = require('portfinder')

const run = command => ({ mapped, argv }) => spawn(
  require.resolve(`.bin/${command}`),
  Object.keys(mapped.default)
    .map(val => `--${val}=${mapped.default[val]}`).concat(argv._),
  {
    stdio: 'inherit',
    env: {
      ...process.env,
      JUMPSTART: JSON.stringify(mapped.env || '{}'),
    },
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
    mapper: transformString,
  })
  .option('define', {
    filter: 'env',
    inHelp: false,
    mapper: transformString,
  })
  .option('provide', {
    filter: 'env',
    inHelp: false,
    mapper: transformString,
  })
  .option('env-target', {
    description: 'set env target',
    filter: 'env',
    mapper: transformString,
  })
  .option('output-css-filename', {
    description: 'output filename of the extracted css',
    default: 'style.css',
    filter: 'env',
  })
  .option('inline-limit', {
    default: 8000,
    filter: 'env',
    mapper: val => val === 0 ? true : val === false ? null : val,
    description: 'url-loader inline limit, defaults to 8000',
  })
  .option('extract-css', {
    default: true,
    filter: 'env',
    description: 'extract css, defaults to true',
  })
  .option('caching', {
    filter: 'env',
    description: 'add precache module and helper',
  })
  .option('plugins', {
    filter: 'env',
    default: [],
    description: 'babel plugins',
    mapper: val => val === false ? false : transformString(val, null, 'Array'),
  })
  .option('presets', {
    filter: 'env',
    default: [],
    description: 'babel presets',
    mapper: val => val === false ? false : transformString(val, null, 'Array'),
  })
  .option('css-plugins', {
    filter: 'env',
    default: [],
    description: 'postcss plugins',
    mapper: val => val === false ? false : transformString(val, null, 'Array'),
  })
  .option('template', {
    filter: 'env',
    default: path.join(__dirname, 'webpack/template/index.ejs'),
    description: 'set custom html template',
  })
  .option('template-title', {
    filter: 'env',
    description: 'set custom html template title',
  })
  .option('template-parameters', {
    filter: 'env',
    description: 'set custom html template parameters',
    mapper: transformString,
  })
  .option('template-meta', {
    filter: 'env',
    description: 'set html template meta option',
    default: { viewport: 'width=device-width, initial-scale=1' },
    mapper: val => {
      if (!val) return {}
      const obj = transformString(val)
      if (obj.viewport === false) {
        delete obj.viewport
        return obj
      }
      return {
        viewport: 'width=device-width, initial-scale=1',
        ...obj
      }
    }
  })
  .option('manifest-template', {
    filter: 'env',
    description: 'web app manifest template',
    mapper: transformString,
  })
  .option('manifest-filename', {
    filter: 'env',
    description: 'web app manifest filename',
  })
  .option('config', { overide: require.resolve('./webpack'), inHelp: false })
  .option('help', { description: 'show webpack-cli help' })

cli
  .command('start', {
    description: 'run webpack-dev-server',
    alias: 'dev',
  }, ({ command, mapped, argv }) => {
    if (mapped.default.port === null) {
      portfinder.basePort = 3000
      portfinder.getPort((err, port) => {
        run('webpack-dev-server')({
          command,
          mapped: { ...mapped, default: { ...mapped.default, port }},
          argv,
        })
      })
    } else {
      run('webpack-dev-server')({ command, mapped, argv })
    }
  })
  .option('mode', { default: 'development', inHelp: false})
  .option('port', { default: null, inHelp: false })
  .option('pragma', { filter: 'env', description: 'set jsx pragma' })
  .option('config', { overide: require.resolve('./webpack'), inHelp: false })
  .option('progress', { default: true, filter: 'env', inHelp: false })
  .option('quiet', { default: true, inHelp: false })
  .option('devtool', { default: 'cheap-source-map', inHelp: false })
  .option('hot', { default: true, inHelp: false })
  .option('overlay', {
    default: false,
    filter: 'env',
    description: 'show error overlay in the browser',
  })
  .option('inline-limit', {
    default: 8000,
    filter: 'env',
    mapper: val => val === 0 ? true : val === false ? null : val,
    description: 'url-loader inline limit, defaults to 8000',
  })
  .option('extract-css', {
    default: false,
    filter: 'env',
    description: 'extract css, defaults to false',
  })
  .option('caching', {
    filter: 'env',
    description: 'add dummy precache module helper',
  })
  .option('plugins', {
    filter: 'env',
    default: [],
    description: 'babel plugins',
    mapper: val => val === false ? false : transformString(val, null, 'Array'),
  })
  .option('presets', {
    filter: 'env',
    default: [],
    description: 'babel presets',
    mapper: val => val === false ? false : transformString(val, null, 'Array'),
  })
  .option('css-plugins', {
    filter: 'env',
    default: [],
    description: 'postcss plugins',
    mapper: val => val === false ? false : transformString(val, null, 'Array'),
  })
  .option('resolve-alias', {
    filter: 'env',
    inHelp: false,
    mapper: transformString,
  })
  .option('define', {
    filter: 'env',
    inHelp: false,
    mapper: transformString,
  })
  .option('provide', {
    filter: 'env',
    inHelp: false,
    mapper: transformString,
  })
  .option('env-target', {
    description: 'set env target',
    filter: 'env',
    mapper: transformString,
  })
  .option('template', {
    filter: 'env',
    default: path.join(__dirname, 'webpack/template/index.ejs'),
    description: 'set custom html template',
  })
  .option('template-title', {
    filter: 'env',
    description: 'set custom html template title',
  })
  .option('template-parameters', {
    filter: 'env',
    description: 'set custom html template parameters',
    mapper: transformString,
  })
  .option('template-meta', {
    filter: 'env',
    description: 'set html template meta option',
    default: { viewport: 'width=device-width, initial-scale=1' },
    mapper: val => {
      if (!val) return {}
      const obj = transformString(val)
      if (obj.viewport === false) {
        delete obj.viewport
        return obj
      }
      return {
        viewport: 'width=device-width, initial-scale=1',
        ...obj
      }
    }
  })
  .option('manifest-template', {
    filter: 'env',
    description: 'web app manifest template',
    mapper: transformString,
  })
  .option('help', { description: 'show webpack-dev-server help' })

cli
  .command('test', {
    description: 'run jest',
    alias: 'jest',
    aliases: {
      h: 'help',
      v: 'version',
      b: 'bail',
      c: 'config',
      e: 'expand',
      w: 'maxWorkers',
      o: 'onlyChanged',
      f: 'onlyFailures',
      i: 'runInBand',
      t: 'testNamePattern',
      u: 'updateSnapshot',
    },
  }, run('jest'))
  .option('config', {
    overide: require.resolve('./jest'),
    inHelp: false,
  })
  .option('pragma', { filter: 'env', description: 'set jsx pragma' })
  .option('plugins', {
    filter: 'env',
    default: [],
    description: 'babel plugins',
    mapper: val => val === false ? false : transformString(val, null, 'Array'),
  })
  .option('presets', {
    filter: 'env',
    default: [],
    description: 'babel presets',
    mapper: val => val === false ? false : transformString(val, null, 'Array'),
  })
  .option('help', { description: 'show jest help' })

cli
  .command('lint', {
    description: 'run eslint',
    alias: 'eslint',
  }, out => run('eslint')({
    ...out,
    argv: {
      ...out.argv,
      _: out.argv.stdin ? ['--stdin'] : out.argv._.length ? out.argv._ : ['src'],
    },
  }))
  .option('config', {
    overide: require.resolve('./eslint'),
    alias: 'c',
    inHelp: false,
  })
  .option('ext', { default: '.js,.jsx,.lsc,.lsx', inHelp: false })
  .option('pragma', { filter: 'env', description: 'set jsx pragma' })
  .option('help', { description: 'show eslint help' })

cli
  .command('compile', {
    description: 'run @babel/cli',
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
    },
  }, out => run('babel')({
    ...out,
    argv: {
      ...out.argv,
      _: [...out.argv._, '--no-babelrc'],
    },
  }))
  .option('presets', {
    inHelp: false,
    defaults: { default: require.resolve('./babel') },
    filter: ['default', 'env'],
    mapper: (val, filter) => {
      if (filter == 'default') return require.resolve('./babel')
      if (val === false) return false
      return transformString(val, null, 'Array')
    },
  })
  .option('plugins', {
    inHelp: false,
    filter: 'env',
    default: [require.resolve('@lightscript/transform')],
    mapper: val => val === false ? false : transformString(val, null, 'Array')
      .concat([require.resolve('@lightscript/transform')]),
  })
  .option('extensions', { default: '.js,.jsx,.lsc,.lsx', inHelp: false })
  .option('pragma', { filter: 'env', description: 'set jsx pragma' })
  .option('env-target', {
    description: 'set env target',
    filter: 'env',
    mapper: transformString,
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
    inHelp: false,
  })
  .option('minimize', { description: 'minimize css', filter: 'env' })
  .option('css-plugins', {
    filter: 'env',
    default: [],
    description: 'postcss plugins',
    mapper: val => val === false ? false : transformString(val, null, 'Array'),
  })
  .option('help', { description: 'show postcss-cli help' })

if (!cli.parse(minimist(process.argv.slice(2), { boolean: true }))) {
  cli.showHelp(require('./package.json'))
}

function transformString(str, filter, type = 'Object') {
  const [_str, _path] = str.includes('?') ? str.split(/\?(.*)/) : []
  const get = val => _path.split('.').reduce((acc, key) => acc[key], val)
  const val = ([
    () => json5.parse(str),
    () => json5.parse(`{${str}}`),
    () => json5.parse(`[${str}]`),
    () => require(path.resolve(str)),
    () => require(str),
    () => json5.parse(fs.readFileSync(path.resolve(str))),
    () => json5.parse(fs.readFileSync(require.resolve(str))),
    () => _path && get(require(path.resolve(_str))),
    () => _path && get(require(_str)),
    () => _path && get(json5.parse(fs.readFileSync(path.resolve(_str)))),
    () => _path && get(json5.parse(fs.readFileSync(require.resolve(_str)))),
    () => combon.parse(str),
    () => str.split(/\s*,\s*/),
  ].reduce((acc, fn, idx) => {
    if (acc) return acc
    try {
      const val = fn()
      if (val.constructor.name === type) return val
    } catch (e) {}
  }, undefined))
  if (val) return val
  console.error(`could not parse "${str}"`)
  process.exit(1)
}
