module.exports = () => {
  return [{
    test: /\.(png|jpe?g|svg|woff2?|ttf|eot)$/,
    loader: require.resolve('url-loader'),
    options: { limit: 8000 }
  }]
}
