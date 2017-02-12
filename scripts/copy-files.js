// @flow weak
/* eslint-disable */

import path from 'path';
import fs from 'fs-promise';

function resolveBuildPath(file) {
  return path.resolve(__dirname, '../build/', file);
}

function copyFile(file, destination) {
  const buildPath = resolveBuildPath(destination || file);
  return fs.copy(file, buildPath)
    .then(() => console.log(`Copied ${file} to ${buildPath}`));
}

function createPackageFile() {
  const buildPath = path.resolve(__dirname, '../build/package.json');

  return fs.readFile(path.resolve(__dirname, '../package.json'), 'utf8')
  .then((data) => JSON.parse(data))
  .then((packageData) => {
    const {
      author,
      bin,
      main,
      version,
      description,
      keywords,
      repository,
      license,
      bugs,
      homepage,
      dependencies,
    } = packageData;

    const minimalPackage = {
      name: 'vrtest',
      author,
      bin,
      main,
      version,
      description,
      keywords,
      repository,
      license,
      bugs,
      homepage,
      dependencies,
    };

    return fs.writeFile(buildPath, JSON.stringify(minimalPackage, null, 2));
  })
  .then(() => {
    console.log(`Created package.json in ${buildPath}`);
    return null;
  });
}

const files = [
  ['bin'],
  ['README.md'],
  ['CHANGELOG.md'],
  ['LICENSE'],
  ['yarn.lock'],
  ['src/server/views/tester.ejs', 'server/views/tester.ejs'],
];

Promise.all(
  files.map((file) => copyFile(...file)),
)
.then(() => createPackageFile());
