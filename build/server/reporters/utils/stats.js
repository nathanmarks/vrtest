'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = createStatsCollector;

var _chalk = require('chalk');

var _chalk2 = _interopRequireDefault(_chalk);

var _logger = require('./logger');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function createStatsCollector(runner) {
  var stats = {
    start: undefined,
    end: undefined,
    tests: 0,
    passes: 0,
    failures: 0
  };

  runner.on('start', function () {
    stats.start = new Date();
  });

  runner.on('end', function () {
    stats.end = new Date();
  });

  runner.on('pass', function () {
    stats.tests += 1;
    stats.passes += 1;
  });

  runner.on('fail', function () {
    stats.tests += 1;
    stats.failures += 1;
  });

  return {
    get tests() {
      return stats.tests;
    },

    get passes() {
      return stats.passes;
    },

    get failures() {
      return stats.failures;
    },

    get duration() {
      if (!stats.end || !stats.start) {
        return 0;
      }
      return stats.end - stats.start;
    },

    logResults: function logResults() {
      (0, _logger.log)('');
      (0, _logger.log)(_chalk2.default.white('  Finished ' + this.tests + ' tests in ' + this.duration + 'ms.'));
      (0, _logger.log)(_chalk2.default.green('  ' + this.passes + ' passes.'));
      (0, _logger.log)(_chalk2.default.red('  ' + this.failures + ' failures.'));
      (0, _logger.log)('');
    }
  };
}