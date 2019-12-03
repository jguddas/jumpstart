const path = require('path')
const sassLoader = require.resolve('sass-loader')
const lessLoader = require.resolve('less-loader')

const argv = JSON.parse(process.env.JUMPSTART || '{}')
const postLoader = [].concat(argv['css-plugins'] === false ? [] : {
  loader: require.resolve('postcss-loader'),
  options: {
    config: {
      path: path.dirname(require.resolve('../../postcss/basic')),
    },
  },
})

const cssLoader = (extract, opts, after) => extract({
  fallback: require.resolve('style-loader'),
  use: [{
    loader: require.resolve('css-loader'),
    options: {
      importLoaders: 1,
      ...(opts.modules ? {
        modules: { localIdentName: '[local]-[hash:base64:5]' },
      } : {}),
      ...opts,
    },
  }].concat(after),
})

const oneOf = (extract, opts, after = []) => [
  { // include & modules = postcss & modules
    resourceQuery: { and: [
      /(^\?|&)modules($|&)/,
      /(^\?|&)include($|&)/,
    ] },
    use: cssLoader(extract, { ...opts, modules: true }, postLoader.concat(after)),
  }, { // exclude & modules = css & modules
    resourceQuery: { and: [
      /(^\?|&)modules($|&)/,
      /(^\?|&)exclude($|&)/,
    ] },
    use: cssLoader(extract, { ...opts, modules: true }, after),
  }, { // exclude = css
    resourceQuery: /(^\?|&)exclude($|&)/,
    use: cssLoader(extract, opts, after),
  }, { // not node_modules & modules = postcss & modules
    exclude: /node_modules/,
    resourceQuery: /(^\?|&)modules($|&)/,
    use: cssLoader(extract, { ...opts, modules: true }, postLoader.concat(after)),
  }, { // node_modules & modules = css & modules
    resourceQuery: /(^\?|&)modules($|&)/,
    use: cssLoader(extract, { ...opts, modules: true }, after),
  }, { // not node_modules = postcss
    exclude: /node_modules/,
    use: cssLoader(extract, opts, postLoader.concat(after)),
  }, { // node_modules = css
    use: cssLoader(extract, opts, after),
  },
]

module.exports = (extract, opts = {}) => [{
  test: /\.css$/,
  oneOf: oneOf(extract, opts),
}, {
  test: /\.s[ac]ss$/,
  oneOf: oneOf(extract, opts, sassLoader),
}, {
  test: /\.less$/,
  oneOf: oneOf(extract, opts, lessLoader),
}]
