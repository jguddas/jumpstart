const cssLoader = (extract, opts = {}) => extract({
  fallback: require.resolve('style-loader'),
  use: {
    loader: require.resolve('css-loader'),
    options: {
      importLoaders: 1,
      localIdentName: opts.modules && '[local]-[hash:base64:5]',
      ...opts,
    },
  }
})
module.exports = (extract, opts = {}) => ({
  test: /.css$/,
  oneOf: [
    {
      resourceQuery: /modules/,
      use: cssLoader(extract, { ...opts, modules: true }),
    }, {
      use: cssLoader(extract, opts),
    },
  ],
})
