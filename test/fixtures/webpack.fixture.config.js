const webpack = require('webpack');
const path = require('path');

const ROOT_PATH = path.resolve(__dirname, '../../');

module.exports = {
  devtool: 'inline-source-map',
  performance: false,
  // context: pathre,
  target: 'web',
  entry: path.resolve(__dirname, 'simple/index.js'),
  output: {
    path: path.resolve(__dirname, 'tmp'),
    filename: 'fixture.js',
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loader: 'babel-loader',
        options: {
          presets: [
            ['es2015', { modules: false }],
            'stage-1',
            'react',
          ],
        },
      },
    ],
  },
  resolve: {
    alias: {
      'vrtest': path.resolve(ROOT_PATH, 'src'),
    },
  },
  plugins: [
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: JSON.stringify('development'),
      },
    }),
  ],
  devServer: {
    contentBase: path.resolve(__dirname),
  },
};
