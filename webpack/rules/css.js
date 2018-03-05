module.exports = cssLoader => ({
  test: /.css$/,
  oneOf: [
    {
      resourceQuery: /modules/,
      use: cssLoader({ modules: true }),
    }, {
      use: cssLoader(),
    },
  ],
})
