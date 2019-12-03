const resolve = require('resolve')

const resolvePlugins = plugins => plugins.filter(Boolean).map(val => {
  if (typeof val === 'object') {
    return [resolve.sync(val[0], { basedir: process.cwd() }), val[1]]
  }
  return resolve.sync(val, { basedir: process.cwd() })
})

const argv = JSON.parse(process.env.JUMPSTART || '{}')
module.exports = (context, opts = {}) => ({
  // if argv.presets.0 is false do not load default presets
  presets: ((argv.presets || [])[0] === false ? [] : [[
    require.resolve('@babel/preset-env'),
    {
      loose: true,
      ...opts,
      modules: argv.modules || opts.modules || false,
      targets: argv['env-target'] || opts.targets || {},
    },
  ]]).concat(resolvePlugins(argv.presets || [])),
  // if argv.plugins.0 is false do not load default plugins
  plugins: ((argv.plugins || [])[0] === false ? [] : [
    [
      require.resolve('@babel/plugin-proposal-decorators'),
      {
        legacy: argv['decorator-legacy'],
        ...(argv['decorator-legacy'] ? {} : {
          decoratorsBeforeExport: !argv['decorator-legacy'],
        }),
      },
    ], [
      require.resolve('@babel/plugin-proposal-class-properties'),
    ], [
      require.resolve('@babel/plugin-transform-react-jsx'),
      { pragma: argv.pragma },
    ], [
      require.resolve('@babel/plugin-syntax-dynamic-import'),
    ], [
      require.resolve('@babel/plugin-proposal-optional-chaining'),
    ], [
      require.resolve('@babel/plugin-proposal-throw-expressions'),
    ], [
      require.resolve('@babel/plugin-proposal-pipeline-operator'),
      { proposal: 'minimal' },
    ], [
      require.resolve('babel-plugin-macros'),
    ],
  ]).concat(resolvePlugins(argv.plugins || [])),
})
