const resolve = require('resolve')

const resolvePlugins = plugins => plugins.map(val => {
  if (typeof val === 'object') {
    return [resolve.sync(val[0], { basedir: process.cwd() }), val[1]]
  }
  return resolve.sync(val, { basedir: process.cwd() })
})

const argv = JSON.parse(process.env.JUMPSTART || '{}')
module.exports = (context, opts = {}) => {
  return {
    presets: (argv['presets'] === false ? [] : [[
      require.resolve('@babel/preset-env'),
      {
        loose: true,
        ...opts,
        modules: argv['modules'] || opts.modules || false,
        targets: argv['env-target'] || opts.targets || {},
      }
    ]]).concat(
      (argv['presets'] || []).map(val => {
        if (typeof val === 'object') {
          return [resolve.sync(val[0], { basedir: process.cwd() }), val[1]]
        }
        return resolve.sync(val, { basedir: process.cwd() })
      }),
    ),
    // if argv.plugins.0 is false do not load default plugins
    plugins: ((argv['plugins'] || [])[0] === false ? resolvePlugins(
      argv['plugins'].slice(1)
    ) : [
      [
        require.resolve('@babel/plugin-proposal-decorators'),
        {
          legacy: argv['decorator-legacy'],
          ...(argv['decorator-legacy'] ? {} : {
            decoratorsBeforeExport: !argv['decorator-legacy'],
          })
        },
      ], [
        require.resolve('@babel/plugin-proposal-class-properties'),
      ], [
        require.resolve('@babel/plugin-transform-react-jsx'),
        { pragma: argv['pragma'] }
      ], [
        require.resolve('@babel/plugin-syntax-dynamic-import'),
      ], [
        require.resolve('@babel/plugin-proposal-throw-expressions'),
      ]
    ]).concat(
      resolvePlugins(argv['plugins'] || [])
    ),
  }
}
