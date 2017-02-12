'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _regenerator = require('babel-runtime/regenerator');

var _regenerator2 = _interopRequireDefault(_regenerator);

var _asyncToGenerator2 = require('babel-runtime/helpers/asyncToGenerator');

var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

var runTests = function () {
  var _ref2 = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee2(driver, events, options, runOptions) {
    var profile, storage, record, done, lastSuite, testInfo, testName, suiteName, element, elementSize, elementLocation, windowSize, screenshotData, screenshotPath, expectedPath, diffPath, imagesAreSame, test;
    return _regenerator2.default.wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            profile = options.profile, storage = options.storage;
            record = runOptions.record;
            done = false;
            lastSuite = '';

          case 4:
            if (!(done === false)) {
              _context2.next = 42;
              break;
            }

            _context2.next = 7;
            return nextTest(driver);

          case 7:
            testInfo = _context2.sent;


            done = testInfo.done;

            if (!(done === false)) {
              _context2.next = 40;
              break;
            }

            testName = testInfo.testName, suiteName = testInfo.suiteName;


            if (lastSuite !== suiteName) {
              events.emit('suite', suiteName);
              lastSuite = suiteName;
            }

            events.emit('test', testName);

            _context2.next = 15;
            return driver.findElement(By.css('body > *:first-child'));

          case 15:
            element = _context2.sent;
            _context2.next = 18;
            return element.getSize();

          case 18:
            elementSize = _context2.sent;
            _context2.next = 21;
            return element.getLocation();

          case 21:
            elementLocation = _context2.sent;
            _context2.next = 24;
            return driver.manage().window().getSize();

          case 24:
            windowSize = _context2.sent;
            _context2.next = 27;
            return driver.takeScreenshot();

          case 27:
            screenshotData = _context2.sent;
            screenshotPath = _path2.default.resolve(record ? storage.baseline : storage.output, profile.name, suiteName, testName + '.png');
            expectedPath = _path2.default.resolve(storage.baseline, profile.name, suiteName, testName + '.png');
            diffPath = _path2.default.resolve(storage.output, profile.name, suiteName, testName + '.diff.png');
            _context2.next = 33;
            return (0, _screenshots.saveScreenshot)(screenshotPath, screenshotData);

          case 33:
            _context2.next = 35;
            return (0, _screenshots.cropScreenshot)(screenshotPath, windowSize, elementSize, elementLocation);

          case 35:
            _context2.next = 37;
            return (0, _screenshots.compareScreenshots)(screenshotPath, expectedPath, diffPath);

          case 37:
            imagesAreSame = _context2.sent;
            test = {
              name: testName,
              screenshotPath: screenshotPath,
              expectedPath: expectedPath,
              diffPath: diffPath
            };


            if (imagesAreSame) {
              events.emit('pass', test);
            } else {
              events.emit('fail', test);
            }

          case 40:
            _context2.next = 4;
            break;

          case 42:
            return _context2.abrupt('return', true);

          case 43:
          case 'end':
            return _context2.stop();
        }
      }
    }, _callee2, this);
  }));

  return function runTests(_x2, _x3, _x4, _x5) {
    return _ref2.apply(this, arguments);
  };
}();

exports.default = createRunner;

var _events = require('events');

var _events2 = _interopRequireDefault(_events);

var _seleniumWebdriver = require('selenium-webdriver');

var _seleniumWebdriver2 = _interopRequireDefault(_seleniumWebdriver);

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _screenshots = require('./utils/screenshots');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/* eslint-disable prefer-arrow-callback, flowtype/require-return-type, prefer-rest-params */

var By = _seleniumWebdriver2.default.By,
    Builder = _seleniumWebdriver2.default.Builder;
function createRunner(options) {
  var run = function () {
    var _ref = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee(runOptions) {
      var driver, testUrl;
      return _regenerator2.default.wrap(function _callee$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              _context.next = 2;
              return buildDriver(options);

            case 2:
              driver = _context.sent;
              testUrl = (options.profile.testUrl || options.testUrl) + '/tests';


              events.emit('start');

              _context.next = 7;
              return driver.manage().timeouts().setScriptTimeout(60000).catch(handleError);

            case 7:
              _context.next = 9;
              return driver.manage().window().setSize(1000, 700).catch(handleError);

            case 9:
              _context.next = 11;
              return driver.get(testUrl).catch(handleError);

            case 11:
              _context.next = 13;
              return setupTests(driver).catch(handleError);

            case 13:
              _context.next = 15;
              return runTests(driver, events, options, runOptions).catch(handleError);

            case 15:
              _context.next = 17;
              return driver.quit().catch(handleError);

            case 17:

              events.emit('end');

              return _context.abrupt('return', null);

            case 19:
            case 'end':
              return _context.stop();
          }
        }
      }, _callee, this);
    }));

    return function run(_x) {
      return _ref.apply(this, arguments);
    };
  }();

  var events = new _events2.default();
  var runner = {
    options: options,
    on: on,
    run: run
  };

  function on(event, cb) {
    return events.on(event, cb);
  }

  function handleError(err) {
    events.emit('error', err);
  }

  return runner;
}

function buildDriver(options) {
  var profile = options.profile,
      selenium = options.selenium;


  var driver = new Builder().withCapabilities(profile.desiredCapabilities);

  if (selenium) {
    driver.usingServer(selenium.server);
  }

  return driver.build();
}

function setupTests(driver) {
  return driver.executeAsyncScript(
  /* istanbul ignore next */
  function () {
    var callback = arguments[arguments.length - 1];
    var vrtest = window.__vrtest__;
    return vrtest.runBeforeHooks().then(function () {
      vrtest.createTestController();
      vrtest.testController.start();
      return callback();
    });
  });
}

function nextTest(driver) {
  return driver.executeAsyncScript(
  /* istanbul ignore next */
  function getTestInfo() {
    var callback = arguments[arguments.length - 1];
    var testController = window.__vrtest__.testController;
    return testController.next().then(function () {
      return callback({
        suiteName: testController.currentSuite.name,
        testName: testController.currentTest.name,
        done: testController.done
      });
    });
  });
}