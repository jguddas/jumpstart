const universalRules = require('./rules/universal')
const lightscriptRules = require('./rules/lightscript')
const typescriptRules = require('./rules/typescript')
const javascriptRules = require('./rules/javascript')
const jestRules = require('./rules/jest')

const argv = JSON.parse(process.env.JUMPSTART || '{}')
module.exports = {
  extends: [
    require.resolve('eslint-config-airbnb'),
    require.resolve('eslint-config-airbnb/hooks'),
  ],
  settings: {
    react: {
      pragma: argv.pragma,
      version: 'detect',
    },
    'import/resolver': {
      node: {
        extensions: [
          '.js',
          '.jsx',
          '.lsc',
          '.lsx',
          '.tx',
          '.tsx',
        ],
      },
    },
  },
  env: {
    browser: true,
    node: true,
  },
  rules: universalRules,
  overrides: [
    {
      files: ['?(*.)@(test|spec).@(js|jsx|lsc|lsx|ts|tsx)'],
      plugins: ['jest'],
      env: {
        browser: true,
        node: true,
        jest: true,
      },
      rules: jestRules,
    }, {
      files: ['*.lsc', '*.lsx'],
      parser: '@lightscript/eslint-plugin',
      plugins: ['@lightscript/eslint-plugin'],
      rules: lightscriptRules,
    }, {
      files: ['*.ts', '*.tsx'],
      parser: '@typescript-eslint/parser',
      plugins: ['@typescript-eslint/eslint-plugin'],
      rules: typescriptRules,
    }, {
      files: ['*.js', '*.jsx'],
      rules: javascriptRules,
    },
  ],
}
