var path = require('path');
var webpack = require('webpack');

module.exports = {
  devtool: 'cheap-module-eval-source-map',
  entry: [
    'eventsource-polyfill', // necessary for hot reloading with IE
    'webpack-hot-middleware/client',
    './src/index'
  ],
  output: {
    path: path.join(__dirname, 'dist'),
    filename: 'bundle.js',
  },
  plugins: [
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NoErrorsPlugin()
  ],
  module: {
    loaders: [
      {
        test: /\.jsx?$/,
        loaders: ['babel'],
        include: [
          path.join(__dirname, 'src'),
          path.join(__dirname, 'node_modules/barebones-channel'),
        ]
      },
      {
        test: /\.css$/,
        loaders: ['style-loader', 'css-loader'],
        include: [
          path.join(__dirname, 'src'),
          path.join(__dirname, 'dist'),
          path.join(__dirname, 'node_modules/react-spinkit/css'),
        ],
      },
    ],
    postLoaders: [
      {
        test: /\.jsx?$/,
        include: path.join(__dirname, 'src'),
        loader: 'npm-install-loader',
        query: {
          cli: {
            save: true,
            saveExact: true,
          }
        }
      },
    ]
  }
};
