const path = require('path')
const fileRules = require('./rules/file')
const styleRules = require('./rules/style')
const babelRules = require('./rules/babel')
const LogPlugin = require('./plugins/log-plugin')
const ExtractTextPlugin = require('extract-text-webpack-plugin')
const CopyWebpackPlugin = require('copy-webpack-plugin')

module.exports = (env, { mode, contentBase:base }) => {
  const argv = JSON.parse(process.env.JUMPSTART || '{}')
  const production = (env || mode) === 'production'

  const contentBase = [
    path.join(__dirname, 'template')
  ].concat(base || []).reverse()
  const plugins = [
    new ExtractTextPlugin({
      filename: argv['output-css-filename'] || 'style.css',
      disable: !argv['extract-css'],
    }),
  ].concat(base === 'false' ? [] : [
    new CopyWebpackPlugin(contentBase)
  ]).concat(!argv.progress ? [] :
    new LogPlugin(() => production && process.stderr.clearLine())
  )
  const rules = [
    ...fileRules(),
    ...babelRules({ pragma: argv.pragma }),
    ...styleRules(ExtractTextPlugin.extract, { minimize: production }),
  ]
  const devServer = { contentBase }
  const extensions = ['.js', '.jsx', '.lsc', '.lsx']
  const devtool = !production && 'cheap-source-map'
  const alias = argv['resolve-alias']

  return {
    devtool,
    devServer,
    plugins,
    module: { rules },
    resolve: { extensions, alias },
  }
}
