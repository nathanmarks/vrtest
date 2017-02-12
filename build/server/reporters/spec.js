'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = createSpecReporter;

var _chalk = require('chalk');

var _chalk2 = _interopRequireDefault(_chalk);

var _logSymbols = require('log-symbols');

var _logSymbols2 = _interopRequireDefault(_logSymbols);

var _stats = require('./utils/stats');

var _stats2 = _interopRequireDefault(_stats);

var _logger = require('./utils/logger');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function createSpecReporter(runner) {
  var stats = (0, _stats2.default)(runner);

  runner.on('start', function () {
    (0, _logger.log)('');
    (0, _logger.log)('  ' + _chalk2.default.white('Starting tests'));
  });

  runner.on('suite', function (suiteName) {
    (0, _logger.log)('');
    (0, _logger.log)('  ' + _chalk2.default.yellow(suiteName));
  });

  runner.on('pass', function (test) {
    (0, _logger.log)('    ' + _chalk2.default.green(_logSymbols2.default.success) + '  ' + test.name);
  });

  runner.on('fail', function (test) {
    (0, _logger.log)('    ' + _chalk2.default.red(_logSymbols2.default.error) + '  ' + test.name);
  });

  runner.on('end', function () {
    stats.logResults();
  });
}