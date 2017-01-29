import webpack from 'webpack';
import webpackConfig from './webpack.fixture.config';

export default function build(fixture) {
  const compiler = webpack(webpackConfig);

  return new Promise((resolve, reject) => {
    compiler.run((err, stats) => {
      if (err) {
        reject(err);
      }
      resolve(stats);
    })
  })
}
