'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.createVrTest = undefined;

var _promise = require('babel-runtime/core-js/promise');

var _promise2 = _interopRequireDefault(_promise);

var _suite = require('./suite');

var _testController = require('./testController');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function createVrTest() {
  var beforeFns = [];

  var vrtest = {
    suites: [],
    before: before,
    runBeforeHooks: runBeforeHooks,
    createSuite: createSuite,
    createTestController: createTestController,
    testController: null
  };

  function before(callback) {
    beforeFns.push(callback);
  }

  function runBeforeHooks() {
    if (beforeFns.length) {
      return _promise2.default.resolve(beforeFns.pop()()).then(runBeforeHooks);
    }
    return _promise2.default.resolve();
  }

  function createSuite(name, options) {
    var newSuite = (0, _suite.createSuite)(name, options);
    vrtest.suites.push(newSuite);
    return newSuite;
  }

  function createTestController() {
    vrtest.testController = (0, _testController.createTestController)(vrtest.suites);
    return vrtest.testController;
  }

  return vrtest;
}

exports.createVrTest = createVrTest;