module.exports = extract => (opts = {}, fallback) => extract({
  fallback: fallback || require.resolve('style-loader'),
  use: {
    loader: require.resolve('css-loader'),
    options: {
      importLoaders: 1,
      localIdentName: opts.modules && '[local]-[hash:base64:5]',
      ...opts,
    },
  }
})
