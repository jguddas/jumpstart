const argv = JSON.parse(process.env.JUMPSTART || '{}')
module.exports = () => [{
  test: /\.(png|jpe?g|svg|woff2?|ttf|eot)$/,
  loader: argv['inline-limit'] === true
    ? require.resolve('file-loader') : require.resolve('url-loader'),
  options: {
    limit: argv['inline-limit'] === null ? undefined : argv['inline-limt'],
  },
}]
