const universalRules = require('./rules/universal')
const lightscriptRules = require('./rules/lightscript')
const typescriptRules = require('./rules/typescript')
const javascriptRules = require('./rules/javascript')
const jestRules = require('./rules/jest')

const argv = JSON.parse(process.env.JUMPSTART || '{}')
module.exports = {
  extends: ['airbnb'],
  settings: {
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
  rules: universalRules,
  overrides: [
    {
      files: ['?(*.)@(test|spec).@(js|jsx|lsc|lsx|ts|tsx)'],
      plugins: ['jest'],
      rules: jestRules,
    }, {
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
