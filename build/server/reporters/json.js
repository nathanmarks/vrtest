'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _stringify = require('babel-runtime/core-js/json/stringify');

var _stringify2 = _interopRequireDefault(_stringify);

exports.default = createJSONReporter;

var _stats = require('./utils/stats');

var _stats2 = _interopRequireDefault(_stats);

var _logger = require('./utils/logger');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function createJSONReporter(runner) {
  var stats = (0, _stats2.default)(runner);
  var results = {
    profile: runner.options.profile.name,
    total: 0,
    passes: 0,
    failures: 0,
    tests: []
  };

  runner.on('pass', function (test) {
    results.tests.push({
      name: test.name,
      passed: true
    });
  });

  runner.on('fail', function (test) {
    results.tests.push({
      name: test.name,
      passed: false
    });
  });

  runner.on('end', function () {
    results.total = stats.tests;
    results.passes = stats.passes;
    results.failures = stats.failures;

    var resultString = (0, _stringify2.default)(results);
    (0, _logger.log)(resultString);
  });
}