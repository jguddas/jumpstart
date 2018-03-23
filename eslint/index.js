module.exports = {
  extends: ['eslint:recommended'],
  parserOptions: {
    ecmaVersion: 2017,
    sourceType: 'module',
    ecmaFeatures: {
      experimentalObjectRestSpread: true,
    },
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
