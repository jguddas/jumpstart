const resolve = require('resolve')

const addOpts = (...x) => (...opts) => x
  .map(val => [require.resolve(val), Object.assign({}, ...opts)])

const resolvePlugins = plugins => plugins.map(val => {
  if (typeof val === 'object') {
    return [resolve.sync(val[0], { basedir: process.cwd() }), val[1]]
  }
  return resolve.sync(val, { basedir: process.cwd() })
})

const argv = JSON.parse(process.env.JUMPSTART || '{}')
module.exports = (context, opts = {}) => {
  return {
      presets: argv['presets'] === false ? [] : addOpts('@babel/preset-env')({
      modules: false,
      loose: true,
    }, opts, {
      modules: argv['modules'] || opts.modules || false,
      targets: argv['env-target'] || opts.targets || {},
    }).concat(
      (argv['presets'] || []).map(val => {
        if (typeof val === 'object') {
          return [resolve.sync(val[0], { basedir: process.cwd() }), val[1]]
        }
        return resolve.sync(val, { basedir: process.cwd() })
      }),
    ),
    // if argv.plugins.0 is false do not load default plugins
    plugins: (argv['plugins'] || [])[0] === false ? resolvePlugins(
      argv['plugins'].slice(1)
    ) : addOpts(
      '@babel/plugin-proposal-decorators',
      '@babel/plugin-proposal-class-properties',
      '@babel/plugin-transform-react-jsx',
      '@babel/plugin-syntax-dynamic-import',
    )({
      useBuiltIns: true,
      pragma: argv['pragma'],
      legacy: argv['decorator-legacy'],
    },
      argv['decorator-legacy'] ? {} : {
        decoratorsBeforeExport: true,
      }
    , opts).concat(
      resolvePlugins(argv['plugins'] || [])
    ),
  }
}
