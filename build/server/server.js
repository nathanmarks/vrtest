'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _promise = require('babel-runtime/core-js/promise');

var _promise2 = _interopRequireDefault(_promise);

var _toConsumableArray2 = require('babel-runtime/helpers/toConsumableArray');

var _toConsumableArray3 = _interopRequireDefault(_toConsumableArray2);

exports.boot = boot;

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _express = require('express');

var _express2 = _interopRequireDefault(_express);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// import runTests from './run';

function boot(config) {
  var _config$scripts = config.scripts,
      scripts = _config$scripts === undefined ? [] : _config$scripts,
      _config$stylesheets = config.stylesheets,
      stylesheets = _config$stylesheets === undefined ? [] : _config$stylesheets,
      _config$tests = config.tests,
      tests = _config$tests === undefined ? [] : _config$tests;


  var app = (0, _express2.default)();

  app.set('view engine', 'ejs');
  app.set('views', _path2.default.resolve(__dirname, 'views'));

  // app.get('/run', (req: express$Request, res: express$Response) => {
  //   runTests(`http://localhost:${config.app.port}/tests`);
  //   res.json({ foo: 'bar' });
  // });

  app.get('/tests', function (req, res) {
    res.render('tester', { scripts: [].concat((0, _toConsumableArray3.default)(scripts), (0, _toConsumableArray3.default)(tests)), stylesheets: stylesheets });
  });

  app.get('/resource', function (req, res) {
    var file = req.query.file;
    if (file.startsWith('http')) {
      res.redirect(file);
    } else {
      res.sendFile(file);
    }
  });

  return new _promise2.default(function (resolve) {
    var server = app.listen(config.server.port, config.server.host, function (err) {
      if (err) {
        throw err;
      }

      resolve(server);
    });
  });
}