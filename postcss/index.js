const resolve = require('resolve')
const postcss = require('postcss')
const path = require('path')
const sass = require('node-sass')
const less = require('less')

less.renderSync = function (input, options = {}) {
  options.sync = true
  let result
  this.render(input, options, (err, val) => {
    if (err) throw err
    result = val
  })
  return result
}

const argv = JSON.parse(process.env.JUMPSTART || '{}')
module.exports = ({ file, options }) => {
  let parser = options.parser
  if (file && /^\.s[ca]ss$/.test(file.extname)) {
    const filename = path.join(file.dirname, file.basename)
    parser = () => postcss.parse(
      sass.renderSync({ file: filename }).css
    )
  } else if (file && '.less' === file.extname) {
    parser = data => postcss.parse(
      less.renderSync(String(data)).css
    )
  }
  const map = !(argv.minimize && options.map.inline) && options.map
  return {
    ...options,
    map,
    parser,
    plugins: argv['css-plugins'] === false ? [] : [
      require('autoprefixer')(),
      argv.minimize && require('cssnano')(),
    ].concat(argv['css-plugins'].map(val => {
      return require(resolve.sync(val, { basedir: process.cwd() }))()
    })),
  }
}
