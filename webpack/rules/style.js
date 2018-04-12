const path = require('path')
const cssLoader = (extract, opts = {}, after = []) => extract({
  fallback: require.resolve('style-loader'),
  use: [{
    loader: require.resolve('css-loader'),
    options: {
      importLoaders: 1,
      localIdentName: opts.modules && '[local]-[hash:base64:5]',
      ...opts,
    },
  }, {
    loader: require.resolve('postcss-loader'),
    options: {
      config: {
        path: path.dirname(require.resolve('../../postcss'))
      }
    },
  }].concat(after)
})
const sassLoader = (extract, opts = {}, after = []) =>
  cssLoader(extract, opts, [require.resolve('sass-loader')].concat(after))
const lessLoader = (extract, opts = {}, after = []) =>
  cssLoader(extract, opts, [require.resolve('less-loader')].concat(after))
module.exports = (extract, opts = {}) => [{
    test: /\.css$/,
    oneOf: [
      {
        resourceQuery: /modules/,
        use: cssLoader(extract, { ...opts, modules: true }),
      }, {
        use: cssLoader(extract, opts),
      },
    ],
  }, {
    test: /\.s[ac]ss$/,
    oneOf: [
      {
        resourceQuery: /modules/,
        use: sassLoader(extract, { ...opts, modules: true }),
      }, {
        use: sassLoader(extract, opts),
      },
    ],
  }, {
    test: /\.less$/,
    oneOf: [
      {
        resourceQuery: /modules/,
        use: lessLoader(extract, { ...opts, modules: true }),
      }, {
        use: lessLoader(extract, opts),
      },
    ],
  }]
