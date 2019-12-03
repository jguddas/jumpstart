const path = require('path')
const ExtractTextPlugin = require('extract-text-webpack-plugin')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const PWAManifestPlugin = require('webpack-pwa-manifest')
const SWPrecacheWebpackPlugin = require('sw-precache-webpack-plugin')
const { DefinePlugin, ProvidePlugin } = require('webpack')
const LogPlugin = require('./plugins/log-plugin')
const babelRules = require('./rules/babel')
const styleRules = require('./rules/style')
const fileRules = require('./rules/file')

module.exports = (env, { mode, contentBase, outputPublicPath }) => {
  const argv = JSON.parse(process.env.JUMPSTART || '{}')
  const production = (env || mode) === 'production'

  const plugins = ([
    new DefinePlugin({
      PUBLIC_URL: JSON.stringify(outputPublicPath || ''),
      ...(argv.define || {}),
    }),
    new ExtractTextPlugin({
      filename: argv['output-css-filename'],
      disable: !argv['extract-css'],
    }),
  ]).concat(!argv.provide ? [] : [
    new ProvidePlugin(argv.provide),
  ]).concat(!argv.caching ? [] : [
    new SWPrecacheWebpackPlugin({
      minify: true,
      logger() {},
    }),
    new ProvidePlugin({
      PRECACHE: production ? require.resolve(
        './template/serviceWorker.js',
      ) : require.resolve(
        './template/dummyServiceWorker.js',
      ),
    }),
  ]).concat(!argv.template ? [] : [
    new HtmlWebpackPlugin({
      title: argv.title,
      meta: argv['template-meta'],
      template: argv.template,
      templateParameters: {
        title: argv['template-title'],
        ...argv['template-parameters'],
      },
    }),
  ]).concat(!argv['manifest-template'] ? [] : [
    new PWAManifestPlugin({
      name: undefined,
      short_name: undefined,
      orientation: undefined,
      display: undefined,
      start_url: undefined,
      ...argv['manifest-template'] || {},
      filename: argv['manifest-filename'] || 'manifest.json',
      inject: true,
      fingerprints: true,
      ios: true,
      includeDirectory: true,
      'theme-color': undefined,
    }),
  ])
    .concat(!contentBase ? [] : [
      new CopyWebpackPlugin([contentBase]),
    ])
    .concat(!argv.progress ? []
      : new LogPlugin(() => production && process.stderr.clearLine()))
  const rules = [
    ...fileRules(),
    ...babelRules(),
    ...styleRules(ExtractTextPlugin.extract),
  ]
  const extensions = ['.js', '.jsx', '.lsc', '.lsx', '.ts', '.tsx']
  const alias = {
    webpack: path.dirname(require.resolve('webpack/package.json')),
    ...argv['resolve-alias'],
  }
  const { overlay } = argv
  const after = (app, server) => server.log.info = console.log

  return {
    plugins,
    module: { rules },
    resolve: { extensions, alias },
    devServer: { overlay, after },
  }
}
