'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _vrtest = require('./vrtest');

var vrtest = (0, _vrtest.createVrTest)();

exports.default = vrtest;


if (window) {
  window.__vrtest__ = vrtest; // yolo
}