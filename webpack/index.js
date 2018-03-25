const path = require('path')
const styleRules = require('./rules/style')
const babelRules = require('./rules/babel')
const LogPlugin = require('./plugins/log-plugin')
const ExtractTextPlugin = require('extract-text-webpack-plugin')

module.exports = (env, { mode, contentBase }) => {
  const argv = JSON.parse(process.env.JUMPSTART || '{}')
  const production = (env || mode) === 'production'

  const plugins = [
    new ExtractTextPlugin({
      filename: 'style.css',
      disable: !production,
    }),
  ].concat(!argv.progress ? [] :
    new LogPlugin(() => production && process.stderr.clearLine())
  )
  const rules = [
    ...babelRules({ pragma: argv.pragma }),
    ...styleRules(ExtractTextPlugin.extract, { minimize: production }),
  ]
  const devServer = {
    contentBase: [
      contentBase || './',
      path.join(__dirname, 'template'),
    ]
  }
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
