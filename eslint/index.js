const lscConfigs = require('@lightscript/eslint-plugin/lib/configs')

const argv = JSON.parse(process.env.JUMPSTART || '{}')
module.exports = {
  extends: [
    'eslint:recommended',
    'plugin:react/recommended',
  ],
  parserOptions: {
    ecmaVersion: 2018,
    sourceType: 'module'
  },
  settings: {
    react: { pragma: argv.pragma },
  },
  env: {
    node: true,
    browser: true,
  },
  overrides: [
    {
      files: ['*.lsc', '*.lsx'],
      parser: '@lightscript/eslint-plugin',
      plugins: ['@lightscript/eslint-plugin'],
      rules: lscConfigs.recommended.rules,
    }
  ],
}
