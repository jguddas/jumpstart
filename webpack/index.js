const path = require('path')
const fileRules = require('./rules/file')
const styleRules = require('./rules/style')
const babelRules = require('./rules/babel')
const LogPlugin = require('./plugins/log-plugin')
const ExtractTextPlugin = require('extract-text-webpack-plugin')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const SWPrecacheWebpackPlugin = require('sw-precache-webpack-plugin')
const { DefinePlugin, ProvidePlugin } = require('webpack')

module.exports = (env, { mode, contentBase }) => {
  const argv = JSON.parse(process.env.JUMPSTART || '{}')
  const production = (env || mode) === 'production'

  const plugins = [
    new ExtractTextPlugin({
      filename: argv['output-css-filename'] || 'style.css',
      disable: !argv['extract-css'],
    }),
  ].concat(!argv['caching'] ? [] : [
    new SWPrecacheWebpackPlugin({ minify: true }),
    new ProvidePlugin({
      PRECACHE: production ? require.resolve(
        './template/serviceWorker.js'
      ) : require.resolve(
        './template/dummyServiceWorker.js'
      )
    }),
  ]).concat(!argv['template'] ? [] : [
    new HtmlWebpackPlugin({
      title: argv['title'],
      meta: argv['template-meta'],
      template: argv['template'],
      templateParameters: {
        title: argv['template-title'],
        ...argv['template-parameters'],
      }
    }),
  ]).concat(!contentBase ? [] : [
    new CopyWebpackPlugin([contentBase])
  ]).concat(!argv.progress ? [] :
    new LogPlugin(() => production && process.stderr.clearLine())
  )
  const rules = [
    ...fileRules(),
    ...babelRules({ pragma: argv.pragma }),
    ...styleRules(ExtractTextPlugin.extract, { minimize: production }),
  ]
  const extensions = ['.js', '.jsx', '.lsc', '.lsx']
  const devtool = !production && 'cheap-source-map'
  const alias = argv['resolve-alias']

  return {
    devtool,
    plugins,
    module: { rules },
    resolve: { extensions, alias },
  }
}
