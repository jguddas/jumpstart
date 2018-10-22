const lscConfigs = require('@lightscript/eslint-plugin/lib/configs')
module.exports = {
  ...lscConfigs.recommended.rules,
  'space-infix-ops': 'off',
}
