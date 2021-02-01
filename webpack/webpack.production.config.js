const HtmlWebpackPlugin = require('html-webpack-plugin');
const webpack = require('webpack');
const path = require('path');

module.exports = {
  mode: 'production',
  entry: {
    main: './src/index.tsx'
  },
  output: {
    filename: 'bundle.js',
    path: path.join(__dirname, '../dist/'),
    publicPath: './'
  },
  watch: false,
  resolve: {
    extensions: ['.ts', '.tsx', '.js', '.json'],
    fallback: {
      'buffer': require.resolve('buffer/'),
      'stream': require.resolve('stream-browserify')
    }
  },
  performance: {
    hints: false
  },
  module: {
    rules: [
      { test: /.tsx?$/, use: ['awesome-typescript-loader'] },
      { test: /\.(s*)css$/, use:['style-loader', 'css-loader', 'sass-loader'] },
    ]
  },
  plugins: [
    // Documentation available here: https://github.com/jantimon/html-webpack-plugin#options
    new HtmlWebpackPlugin({
      template: './src/index.html',
      filename: 'index.html',
      showErrors: false,
      path: path.join(__dirname, '../dist/'),
      hash: true
    })
  ]
}
