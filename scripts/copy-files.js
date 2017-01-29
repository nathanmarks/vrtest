// @flow weak
/* eslint-disable no-console */

import path from 'path';
import fs from 'fs-promise';

function resolveBuildPath(file) {
  return path.resolve(__dirname, '../build/', path.basename(file));
}

function copyFile(file) {
  const buildPath = resolveBuildPath(file);
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
      name: 'material-ui',
      author,
      version,
      description,
      main: './index.js',
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
  'README.md',
  'CHANGELOG.md',
  'LICENSE',
  'yarn.lock',
];

Promise.all(
  files.map((file) => copyFile(file)),
)
.then(() => createPackageFile());
