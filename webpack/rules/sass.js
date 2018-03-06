const sassLoader = (extract, opts = {}) => extract({
  fallback: require.resolve('style-loader'),
  use: [{
    loader: require.resolve('css-loader'),
    options: {
      importLoaders: 1,
      localIdentName: opts.modules && '[local]-[hash:base64:5]',
      ...opts,
    }
  }, require.resolve('sass-loader')],
})
module.exports = (extract, opts = {}) => ({
  test: /.s[ac]ss$/,
  oneOf: [
    {
      resourceQuery: /modules/,
      use: sassLoader(extract, { ...opts, modules: true }),
    }, {
      use: sassLoader(extract, opts),
    },
  ],
})
