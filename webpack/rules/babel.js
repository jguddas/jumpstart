const babelLoader = (presets = [], plugins = []) => ({
  loader: require.resolve('babel-loader'),
  options: { presets, plugins }
})
module.exports = ({ pragma }) => ({
  test: /\.js$/,
  exclude: /node_modules/,
  use: babelLoader([[
    require.resolve('babel-preset-env'),
    { modules: false, loose: true }
  ]], [
    require.resolve('babel-plugin-transform-class-properties'),
    [
      require.resolve('babel-plugin-transform-object-rest-spread'),
      { useBuiltIns: true },
    ], [
      require.resolve('babel-plugin-transform-react-jsx'),
      { useBuiltIns: true, pragma },
    ]
  ])
})