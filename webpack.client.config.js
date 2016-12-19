const path = require('path');

const ROOT_PATH = path.resolve(__dirname);

module.exports = {
  devtool: 'inline-source-map',
  context: ROOT_PATH,
  target: 'web',
  entry: './src/client/index.js',
  output: {
    path: path.resolve(ROOT_PATH, 'build'),
    filename: 'vrtest.js',
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
  plugins: [
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: JSON.stringify('development'),
      },
    }),
  ],
};
