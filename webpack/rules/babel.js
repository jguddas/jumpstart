module.exports = () => {
  return [{
    test: /\.jsx?$/,
    exclude: /node_modules/,
    use: {
      loader: require.resolve('babel-loader'),
      options: { presets: require.resolve('../../babel') },
    },
  }, {
    test: /\.ls[cx]?$/,
    exclude: /node_modules/,
    use: {
      loader: require.resolve('babel-loader'),
      options: {
        presets: require.resolve('../../babel'),
        plugins: require.resolve('@oigroup/babel-plugin-lightscript'),
      },
    },
  }]
}
