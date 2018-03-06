const babelLoader = (presets = [], plugins = []) => ({
  loader: require.resolve('babel-loader'),
  options: { presets, plugins }
})
module.exports = () => ({
  test: /\.js$/,
  exclude: /node_modules/,
  use: babelLoader([[
    require.resolve('babel-preset-env'),
    { modules: false, loose: true }
  ]])
})
