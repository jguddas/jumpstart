const path = require('path')
const styleRules = require('./rules/style')
const babelRules = require('./rules/babel')
const LogPlugin = require('./plugins/log-plugin')
const ExtractTextPlugin = require('extract-text-webpack-plugin')
const CopyWebpackPlugin = require('copy-webpack-plugin')

module.exports = (env, { mode, outputPublicPath }) => {
  const argv = JSON.parse(process.env.JUMPSTART || '{}')
  const production = (env || mode) === 'production'

  const contentBase = [
    path.join(__dirname, 'template')
  ].concat(outputPublicPath || []).reverse()
  const plugins = [
    new ExtractTextPlugin({
      filename: 'style.css',
      disable: !production,
    }),
    new CopyWebpackPlugin(contentBase)
  ].concat(!argv.progress ? [] :
    new LogPlugin(() => production && process.stderr.clearLine())
  )
  const rules = [
    ...babelRules({ pragma: argv.pragma }),
    ...styleRules(ExtractTextPlugin.extract, { minimize: production }),
  ]
  const devServer = { contentBase }
  const extensions = ['.js', '.jsx', '.lsc', '.lsx']
  const devtool = !production && 'cheap-source-map'

  return {
    devtool,
    devServer,
    plugins,
    module: { rules },
    resolve: { extensions },
  }
}
