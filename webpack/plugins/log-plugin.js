const chalk = require('chalk')
const ProgressPlugin = require('webpack/lib/ProgressPlugin')

function logger(title, msg = '', color = 'green') {
  process.stderr.clearLine()
  process.stderr.cursorTo(0)
  process.stderr.write(`${chalk.reset.inverse.bold[color](` ${title} `)} ${msg}`)
  process.stderr.cursorTo(0)
}

module.exports = class LogPlugin {
  constructor(cb) { this.cb = cb }
  apply(compiler) {
    new ProgressPlugin((percentage, msg) => {
      logger('WAIT', `${Math.floor(percentage * 100)}% ${msg}...`, 'blue')
    }).apply(compiler)

    compiler.hooks.invalid.tap('log-plugin', () => {
      logger('WAIT', 'Compiling...', 'blue')
    })

    compiler.hooks.done.tap('log-plugin', (stats) => {
      if (stats.hasErrors()) {
        stats.compilation.errors.forEach((err) => {
          if (err && err.name && err.message) logger(err.name, err.message, 'red')
          else logger('ERROR', err || 'something went wrong', 'red')
        })
      } else if (stats.hasWarnings()) {
        stats.compilation.warnings.forEach((wrn) => {
          if (wrn && wrn.name && wrn.message) logger(wrn.name, wrn.message, 'yellow')
          else if (wrn) logger('WARNING', wrn, 'yellow')
        })
      } else {
        logger('SUCCESS', `Build finished in ${stats.endTime - stats.startTime} ms!`)
        if (this.cb) this.cb(stats)
      }
    })
  }
}
