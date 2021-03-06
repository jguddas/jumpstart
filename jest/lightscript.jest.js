const babelCore = require('@babel/core')

module.exports = {
  process(src, path) {
    if (path.endsWith('.lsc') || path.endsWith('.lsx')) {
      return babelCore.transform(src, {
        retainLines: true,
        sourceMaps: 'inline',
        filename: path,
        presets: [
          require('babel-preset-jest'),
          [require('../babel'), { modules: 'commonjs' }],
        ],
        plugins: [
          [
            require.resolve('@lightscript/transform'),
            { disableFlow: true, _decoratorParsing: 'none' },
          ],
        ],
      }).code
    }
    return src
  },
}
