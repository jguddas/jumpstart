module.exports = () => ({
  test: /\.js$/,
  exclude: /node_modules/,
  use: {
    loader: require.resolve('babel-loader'),
    options: {
      presets: [
        [
          require.resolve('babel-preset-env'),
          { modules: false, loose: true }
        ]
      ]
    }
  }
})
