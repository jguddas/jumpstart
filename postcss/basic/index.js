const resolve = require('resolve')

const argv = JSON.parse(process.env.JUMPSTART || '{}')
module.exports = {
  plugins: ((argv['css-plugins'] || [])[0] === false ? [] : [
    require('autoprefixer')(),
  ]).concat(argv['css-plugins'].filter(Boolean).map(val =>
    require(resolve.sync(val, { basedir: process.cwd() }))()
  )),
}
