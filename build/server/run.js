'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _promise = require('babel-runtime/core-js/promise');

var _promise2 = _interopRequireDefault(_promise);

exports.default = run;

var _server = require('./server');

var _runner = require('./runner');

var _runner2 = _interopRequireDefault(_runner);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function run(config) {
  var runOptions = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
  var profiles = config.profiles,
      selenium = config.selenium,
      storage = config.storage,
      testUrl = config.testUrl;


  function runProfile(profile) {
    var runner = (0, _runner2.default)({ profile: profile, selenium: selenium, storage: storage, testUrl: testUrl });

    config.reporters.forEach(function (reporter) {
      reporter(runner);
    });

    return runner.run(runOptions);
  }

  function runProfiles() {
    return _promise2.default.all(profiles.map(runProfile));
  }

  var server = void 0;

  return (0, _server.boot)(config).then(function (httpServer) {
    server = httpServer;
    return null;
  }).then(runProfiles).then(function () {
    return server.close();
  });
}