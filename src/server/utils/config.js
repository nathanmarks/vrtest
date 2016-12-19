// @flow
// import fs from 'fs';
import path from 'path';
import defaultsDeep from 'lodash/defaultsDeep';

export const defaultConfig = {
  tests: path.resolve(process.cwd(), 'test/fixtures/todo/tests'),
  server: {
    port: 3090,
  },
  selenium: {

  },
};

export function readConfig(overrides?: Object) {
  return defaultsDeep({}, overrides, defaultConfig);
}
