const universalRules = require('./rules/universal')
const lightscriptRules = require('./rules/lightscript')
const typescriptRules = require('./rules/typescript')
const javascriptRules = require('./rules/javascript')

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
    react: {
      pragma: argv['pragma'],
      version: 'latest',
    },
  },
  env: {
    node: true,
    browser: true,
  },
  rules: universalRules,
  overrides: [
    {
      files: ['*.lsc', '*.lsx'],
      parser: '@lightscript/eslint-plugin',
      plugins: ['@lightscript/eslint-plugin'],
      rules: lightscriptRules,
    }, {
      files: ['*.ts', '*.tsx'],
      parser: 'typescript-eslint-parser',
      plugins: ['typescript'],
      rules: typescriptRules
    }, {
      files: ['*.js', '*.jsx'],
      rules: javascriptRules
    }
  ]
}
