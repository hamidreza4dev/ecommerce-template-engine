const path = require('path');
const { merge } = require('webpack-merge');
const common = require('./webpack.common');

module.exports = merge(common, {
  mode: 'development',
  output: {
    filename: '[name].bundle.js',
  },
  module: {
    rules: [
      {
        test: /\.s?css$/i,
        exclude: /(node_modules|bower_components)/,
        use: [
          'style-loader',
          'css-loader',
          'postcss-loader',
          {
            loader: 'sass-loader',
            options: {
              sassOptions: {
                recursive: true,
                watch: true,
              },
            },
          },
        ],
      },
    ],
  },

  devServer: {
    static: path.resolve(__dirname, './public'),
    hot: true,
    liveReload: true,
    watchFiles: './src/**/*.{scss,js}',
  },
});
