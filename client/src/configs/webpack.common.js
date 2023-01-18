const path = require('path');
const CopyPlugin = require('copy-webpack-plugin');

module.exports = {
  entry: {
    main: path.join(__dirname, '../src/js/main.js'),
    vendor: path.join(__dirname, '../src/js/vendor.js'),
  },
  stats: 'errors-warnings',
  output: {
    assetModuleFilename: 'assets/[hash][ext][query]',
    path: path.join(__dirname, '../../public'),
  },
  module: {
    rules: [
      {
        test: /\.(png|jpg|svg|gif|jpeg)/,
        type: 'asset/resource',
      },
    ],
  },
  plugins: [
    new CopyPlugin({
      patterns: [{ from: './src/assets', to: 'assets' }],
    }),
  ],
};
