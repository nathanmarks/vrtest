'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _regenerator = require('babel-runtime/regenerator');

var _regenerator2 = _interopRequireDefault(_regenerator);

var _promise = require('babel-runtime/core-js/promise');

var _promise2 = _interopRequireDefault(_promise);

exports.createTestController = createTestController;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function createTestController(suites) {
  var _marked = [testGenerator].map(_regenerator2.default.mark);

  var controller = {
    currentTest: null,
    currentSuite: null,
    done: false,
    next: next,
    start: start
  };

  var generator = void 0;

  function start() {
    generator = testGenerator.apply(undefined, arguments);
    return controller;
  }

  function next() {
    if (!generator) {
      throw new Error('testController has not been started.');
    }

    var _generator$next = generator.next(),
        done = _generator$next.done,
        value = _generator$next.value;

    return _promise2.default.resolve(value).then(function () {
      if (done) {
        controller.done = true;
      }

      return controller;
    });
  }

  function testGenerator() {
    var i,
        j,
        _controller$currentTe,
        _args = arguments;

    return _regenerator2.default.wrap(function testGenerator$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            i = 0;

          case 1:
            if (!(i < suites.length)) {
              _context.next = 14;
              break;
            }

            controller.currentSuite = suites[i];
            j = 0;

          case 4:
            if (!(j < suites[i].tests.length)) {
              _context.next = 11;
              break;
            }

            controller.currentTest = suites[i].tests[j];
            _context.next = 8;
            return (_controller$currentTe = controller.currentTest).exec.apply(_controller$currentTe, _args);

          case 8:
            j += 1;
            _context.next = 4;
            break;

          case 11:
            i += 1;
            _context.next = 1;
            break;

          case 14:
            return _context.abrupt('return', true);

          case 15:
          case 'end':
            return _context.stop();
        }
      }
    }, _marked[0], this);
  }

  return controller;
}