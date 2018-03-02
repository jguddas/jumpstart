const path = require('path')
module.exports = (env, { mode }) => {
  const production = (env || mode) === 'production'

  const plugins = []
  const rules = []

  return {
    plugins,
    module: { rules },
  }
}
