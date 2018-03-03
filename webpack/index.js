const path = require('path')
const LogPlugin = require('./plugins/log-plugin')

module.exports = (env, { mode, contentBase }) => {
  const production = (env || mode) === 'production'

  const plugins = [
    new LogPlugin(() => production && process.stderr.clearLine())
  ]
  const rules = []
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
