const path = require('path')
const LogPlugin = require('./plugins/log-plugin')

module.exports = (env, { mode }) => {
  const production = (env || mode) === 'production'

  const plugins = [
    new LogPlugin(() => production && process.stderr.clearLine())
  ]
  const rules = []

  return {
    plugins,
    module: { rules },
  }
}
