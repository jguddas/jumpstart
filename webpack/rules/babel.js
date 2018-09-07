const preset = require.resolve('../../babel')

const babelLoader = opts => ({
  loader: require.resolve('babel-loader'),
  options: opts,
})

const oneOf = opts => opts ? [
  { // include = preset
    resourceQuery: /(^\?|&)include($|&)/,
    use: babelLoader({ ...opts, presets: [preset].concat(opts.presets || []) }),
  }, { // exclude = no preset
    resourceQuery: /(^\?|&)exclude($|&)/,
    use: babelLoader(opts),
  }, { // not node_modules = preset
    exclude: /node_modules/,
    use: babelLoader({ ...opts, presets: [preset].concat(opts.presets || []) }),
  }, { // node_modules = no preset
    use: babelLoader(opts),
  },
] : [
  { // include = preset
    resourceQuery: /(^\?|&)include($|&)/,
    use: babelLoader({ presets: [preset] }),
  }, { // not node_modules & not exclude = preset
    exclude: /node_modules/,
    resourceQuery: { not: [/(^\?|&)exclude($|&)/] },
    use: babelLoader({ presets: [preset] }),
  },
]

module.exports = () => [{
  test: /\.jsx?$/,
  oneOf: oneOf(),
}, {
  test: /\.ls[cx]?$/,
  oneOf: oneOf({
    plugins: require.resolve('@oigroup/babel-plugin-lightscript'),
  }),
}]
