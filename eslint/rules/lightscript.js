const lscConfigs = require('@lightscript/eslint-plugin/lib/configs')
module.exports = {
  ...lscConfigs.recommended.rules,
  'space-infix-ops': 'off',
  'arrow-parens': ['error', 'as-needed'],
  'arrow-spacing': 'off',
  'comma-dangle': 'off',
  'constructor-super': 'off',
  'no-this-before-super': 'off',
  'brace-style': 'off',
  'function-paren-newline': 'off',
  'space-before-blocks': 'off',
  'react/jsx-indent': 'off',
}
