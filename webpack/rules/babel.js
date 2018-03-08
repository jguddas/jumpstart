module.exports = ({ pragma }) => {
  const babelLoader = (presets, plugins, override) => ({
    loader: require.resolve('babel-loader'),
    options: {
      presets: (override && presets) || [[
        require.resolve('babel-preset-env'),
        { modules: false, loose: true }
      ]].concat(presets || []),
      plugins: (override && plugins) || [
        require.resolve('babel-plugin-transform-class-properties'),
        [
          require.resolve('babel-plugin-transform-object-rest-spread'),
          { useBuiltIns: true },
        ], [
          require.resolve('babel-plugin-transform-react-jsx'),
          { useBuiltIns: true, pragma },
        ]
      ].concat(plugins || []),
    }
  })
  return [{
    test: /\.jsx?$/,
    exclude: /node_modules/,
    use: babelLoader()
  }]
}
