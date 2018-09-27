const resolve = require('resolve')

const argv = JSON.parse(process.env.JUMPSTART || '{}')
module.exports = {
  plugins: argv['css-plugins'] === false ? [] : [
    require('autoprefixer')(),
  ].concat(argv['css-plugins'].map(val =>
    require(resolve.sync(val, { basedir: process.cwd() }))()
  )),
}
