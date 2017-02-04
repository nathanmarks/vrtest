// @flow
/* eslint-disable global-require, import/no-dynamic-require */

// import fs from 'fs';
import path from 'path';
import defaultsDeep from 'lodash/defaultsDeep';
import * as reporters from '../reporters';

export const defaultConfig = {
  tests: [],
  testUrl: null,
  server: {
    host: '0.0.0.0',
    port: 3090,
  },
  storage: {
    baseline: 'vrtest/baseline',
    output: 'vrtest/output',
  },
  selenium: {},
  profiles: [],
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

  if (!config.testUrl) {
    config.testUrl = `http://${config.server.host}:${config.server.port}`;
  }

  return defaultsDeep({}, config, defaultConfig);
}
