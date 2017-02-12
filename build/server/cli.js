'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _objectWithoutProperties2 = require('babel-runtime/helpers/objectWithoutProperties');

var _objectWithoutProperties3 = _interopRequireDefault(_objectWithoutProperties2);

exports.default = start;

var _commander = require('commander');

var _commander2 = _interopRequireDefault(_commander);

var _server = require('./server');

var _config = require('./utils/config');

var _run = require('./run');

var _run2 = _interopRequireDefault(_run);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function start() {
  var args = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : process.argv;
  var program = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : new _commander2.default.Command();

  program.version('0.1.0').description('See help for specific commands using [command] --help');

  program.command('run').description('Run the visual regression tests').option('-c, --config <file>', 'Specify a .js config file').option('-r, --record', 'Record new baseline images')
  // .option('-i, --interactive', 'Enable interactive mode')
  // .option('-g, --grep', 'grep the tests')
  // .option('-p', '--profiles', 'specify the config profiles to run')
  .action(function (_ref) {
    var config = _ref.config,
        other = (0, _objectWithoutProperties3.default)(_ref, ['config']);

    (0, _run2.default)((0, _config.readConfig)(config), other);
  });

  program.command('server').description('Run the visual regression test server').option('-c, --config', 'Specify a .js config file').action(function () {
    var config = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

    return (0, _server.boot)((0, _config.readConfig)(config));
  });

  if (!args.slice(2).length) {
    program.outputHelp();
  } else {
    program.parse(args);
  }
}