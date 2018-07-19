const jsLoader = opts => ({
  loader: require.resolve('babel-loader'),
  options: { presets: require.resolve('../../babel'), ...opts },
})
module.exports = () => {
  return [{
    test: /\.jsx?$/,
    oneOf: [
      {
        resourceQuery: /include/,
        use: jsLoader(),
      }, {
        exclude: /node_modules/,
        use: jsLoader(),
      },
    ],
  }, {
    test: /\.ls[cx]?$/,
    use: jsLoader({
      plugins: require.resolve('@oigroup/babel-plugin-lightscript'),
    }),
  }]
}
