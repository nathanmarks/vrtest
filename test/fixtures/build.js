import path from 'path';
import webpack from 'webpack';

export default function buildFixture(fixture) {
  return new Promise((resolve) => {
    webpack({
      entry: path.resolve(__dirname, fixture),
      output: {
        path: path.resolve(__dirname, '../../tmp'),
        filename: 'tests.js',
      },
      module: {
        loaders: [
          {
            test: /\.js$/,
            exclude: /node_modules/,
            loader: 'babel-loader',
          },
        ],
      },
      resolve: {
        alias: {
          vrtest: path.resolve(__dirname, '../../src'),
        },
      }
    }, (err, stats) => {
      if (err) {
        throw new Error(err);
      }
      if (stats.hasErrors()) {
        throw new Error(stats.compilation.errors[0])
      }
      resolve(stats);
    });
  });
}
