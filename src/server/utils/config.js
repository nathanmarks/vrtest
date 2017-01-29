// @flow
/* eslint-disable global-require, import/no-dynamic-require */

// import fs from 'fs';
import path from 'path';
import defaultsDeep from 'lodash/defaultsDeep';
import * as reporters from '../reporters';

export const defaultConfig = {
  tests: [],
  server: {
    port: 3090,
  },
  storage: {
    baseline: 'vrtest/baseline',
    output: 'vrtest/output',
  },
  reporters: [],
};

export function readConfig(overrides?: Object = {}): vrtest$Config {
  let config = overrides;

  if (typeof config === 'string') {
    // $FlowFixMe
    config = require(path.resolve(process.cwd(), config));
  }

  if (config.tests && !Array.isArray(config.tests)) {
    config.tests = [config.tests];
  }

  if (config.reporters && !Array.isArray(config.reporters)) {
    config.reporters = [config.reporters];
  } else if (!config.reporters || !config.reporters.length) {
    config.reporters = [reporters.spec];
  }

  return defaultsDeep({}, config, defaultConfig);
}
