"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends2 = require("babel-runtime/helpers/extends");

var _extends3 = _interopRequireDefault(_extends2);

var _promise = require("babel-runtime/core-js/promise");

var _promise2 = _interopRequireDefault(_promise);

exports.createSuite = createSuite;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var DEFAULT_OPTIONS = {};

function createSuite(name, options) {
  var suite = {
    name: name,
    options: applyDefaultOptions(options),
    tests: [],
    createTest: createTest
  };

  function createTest(testName, callback) {
    var test = testFactory(testName, callback);
    suite.tests.push(test);
    return test;
  }

  return suite;
}

function testFactory(name, callback) {
  function exec() {
    return _promise2.default.resolve(callback.apply(undefined, arguments));
  }

  return { name: name, exec: exec };
}

function applyDefaultOptions() {
  var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

  return (0, _extends3.default)({}, DEFAULT_OPTIONS, options);
}