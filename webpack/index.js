const path = require('path')
const cssRules = require('./rules/css')
const cssLoader = require('./loaders/css')
const LogPlugin = require('./plugins/log-plugin')
const ExtractTextPlugin = require('extract-text-webpack-plugin')

module.exports = (env, { mode, contentBase }) => {
  const { command, argv } = JSON.parse(process.env.JUMPSTART)
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
    cssRules((opts = {}) => cssLoader(ExtractTextPlugin.extract)({ minimize: production, ...opts }))
  ]
  const devServer = {
    contentBase: [
      contentBase || './',
      path.join(__dirname, 'template'),
    ]
  }

  return {
    devServer,
    plugins,
    module: { rules },
  }
}
