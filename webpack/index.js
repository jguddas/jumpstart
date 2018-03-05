const path = require('path')
const cssRules = require('./rules/css')
const cssLoader = require('./loaders/css')
const LogPlugin = require('./plugins/log-plugin')

module.exports = (env, { mode, contentBase }) => {
  const production = (env || mode) === 'production'

  const plugins = [
    new LogPlugin(() => production && process.stderr.clearLine())
  ]
  const rules = [
    cssRules((opts = {}) => cssLoader({ minimize: production, ...opts }))
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
