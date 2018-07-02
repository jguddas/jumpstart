const addOpts = (...x) => (...opts) => x
  .map(val => [require.resolve(val), Object.assign({}, ...opts)])

const argv = JSON.parse(process.env.JUMPSTART || '{}')
module.exports = (context, opts = {}) => {
  return {
    presets: addOpts('babel-preset-env')({
      modules: false,
      loose: true,
    }, opts, {
      modules: argv['modules'],
      targets: argv['env-target'] || opts.targets || {},
    }),
    plugins: addOpts(
      'babel-plugin-transform-class-properties',
      'babel-plugin-transform-object-rest-spread',
      'babel-plugin-transform-react-jsx',
      'babel-plugin-syntax-dynamic-import',
    )({ useBuiltIns: true, pragma: argv['pragma'] }, opts),
  }
}
