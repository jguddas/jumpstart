const resolve = require('resolve')
const addOpts = (...x) => (...opts) => x
  .map(val => [require.resolve(val), Object.assign({}, ...opts)])

const argv = JSON.parse(process.env.JUMPSTART || '{}')
module.exports = (context, opts = {}) => {
  return {
      presets: argv['presets'] === false ? [] : addOpts('babel-preset-env')({
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
    plugins: argv['plugins'] === false ? [] : addOpts(
      'babel-plugin-transform-class-properties',
      'babel-plugin-transform-object-rest-spread',
      'babel-plugin-transform-react-jsx',
      'babel-plugin-syntax-dynamic-import',
    )({ useBuiltIns: true, pragma: argv['pragma'] }, opts).concat(
      (argv['plugins'] || []).map(val => {
        if (typeof val === 'object') {
          return [resolve.sync(val[0], { basedir: process.cwd() }), val[1]]
        }
        return resolve.sync(val, { basedir: process.cwd() })
      }),
    ),
  }
}
