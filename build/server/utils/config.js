'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.defaultConfig = undefined;

var _assign = require('babel-runtime/core-js/object/assign');

var _assign2 = _interopRequireDefault(_assign);

var _keys = require('babel-runtime/core-js/object/keys');

var _keys2 = _interopRequireDefault(_keys);

var _objectWithoutProperties2 = require('babel-runtime/helpers/objectWithoutProperties');

var _objectWithoutProperties3 = _interopRequireDefault(_objectWithoutProperties2);

exports.readConfig = readConfig;

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _defaultsDeep = require('lodash/defaultsDeep');

var _defaultsDeep2 = _interopRequireDefault(_defaultsDeep);

var _reporters = require('../reporters');

var reporters = _interopRequireWildcard(_reporters);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var defaultConfig = exports.defaultConfig = {
  tests: [],
  testUrl: null,
  server: {
    host: '0.0.0.0',
    port: 3090
  },
  storage: {
    baseline: 'vrtest/baseline',
    output: 'vrtest/output'
  },
  selenium: {},
  profiles: [],
  reporters: []
};
/* eslint-disable global-require, import/no-dynamic-require */

// import fs from 'fs';
function readConfig() {
  var overrides = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

  var config = overrides;

  if (typeof config === 'string') {
    // $FlowFixMe
    config = require(_path2.default.resolve(process.cwd(), config));
  }

  if (config.tests && !Array.isArray(config.tests)) {
    config.tests = [config.tests];
  }

  if (config.reporters && !Array.isArray(config.reporters)) {
    config.reporters = [config.reporters];
  } else if (!config.reporters || !config.reporters.length) {
    config.reporters = [reporters.spec];
  }

  var mergedConfig = (0, _defaultsDeep2.default)({}, config, defaultConfig);

  if (!mergedConfig.testUrl) {
    mergedConfig.testUrl = 'http://' + mergedConfig.server.host + ':' + mergedConfig.server.port;
  }

  if (!Array.isArray(mergedConfig.profiles) && mergedConfig.profiles.toString() === '[object Object]') {
    (function () {
      var _mergedConfig$profile = mergedConfig.profiles,
          _mergedConfig$profile2 = _mergedConfig$profile.default,
          defaultProfile = _mergedConfig$profile2 === undefined ? {} : _mergedConfig$profile2,
          otherProfiles = (0, _objectWithoutProperties3.default)(_mergedConfig$profile, ['default']);

      mergedConfig.profiles = (0, _keys2.default)(otherProfiles).reduce(function (result, name) {
        result.push((0, _defaultsDeep2.default)((0, _assign2.default)(mergedConfig.profiles[name], { name: name }), defaultProfile));
        return result;
      }, []);
    })();
  }

  return mergedConfig;
}