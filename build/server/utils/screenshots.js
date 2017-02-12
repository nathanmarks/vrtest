'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _promise = require('babel-runtime/core-js/promise');

var _promise2 = _interopRequireDefault(_promise);

exports.compareScreenshots = compareScreenshots;
exports.saveScreenshot = saveScreenshot;
exports.cropScreenshot = cropScreenshot;

var _fsPromise = require('fs-promise');

var _fsPromise2 = _interopRequireDefault(_fsPromise);

var _imageDiff = require('image-diff');

var _imageDiff2 = _interopRequireDefault(_imageDiff);

var _pngCrop = require('png-crop');

var _pngCrop2 = _interopRequireDefault(_pngCrop);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function compareScreenshots(actualImage, expectedImage, diffImage) {
  return new _promise2.default(function (resolve) {
    (0, _imageDiff2.default)({
      actualImage: actualImage,
      expectedImage: expectedImage,
      diffImage: diffImage
    }, function (err, imagesAreSame) {
      if (err) {
        throw err;
      } else {
        resolve(imagesAreSame);
      }
    });
  });
}

function saveScreenshot(screenshotPath, screenshotData) {
  return _fsPromise2.default.outputFile(screenshotPath, screenshotData, 'base64');
}

function cropScreenshot(screenshotPath, windowSize, elementSize, elementLocation) {
  return new _promise2.default(function (resolve) {
    var cropWidth = elementSize.width < windowSize.width;
    var cropHeight = elementSize.height < windowSize.height;

    if (cropWidth || cropHeight) {
      var config = {
        width: cropWidth ? elementSize.width : windowSize.width,
        height: cropHeight ? elementSize.height : windowSize.height,
        top: Math.floor(elementLocation.y),
        left: Math.floor(elementLocation.x)
      };

      _pngCrop2.default.crop(screenshotPath, screenshotPath, config, function (err) {
        if (err) {
          throw err;
        }
        resolve(screenshotPath);
      });
    } else {
      resolve(screenshotPath);
    }
  });
}