const argv = JSON.parse(process.env.JUMPSTART || '{}')
module.exports = {
  extends: [
    'eslint:recommended',
    'plugin:react/recommended'
  ],
  parserOptions: {
    ecmaVersion: 2017,
    sourceType: 'module',
    ecmaFeatures: {
      experimentalObjectRestSpread: true,
    },
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
      parser: '@oigroup/lightscript-eslint',
    }
  ],
}
