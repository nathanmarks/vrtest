// @flow

import fs from 'fs-promise';
import imageDiff from 'image-diff';
import pngCrop from 'png-crop';

export function compareScreenshots(
  actualImage: string,
  expectedImage: string,
  diffImage: string,
): Promise<boolean> {
  return new Promise((resolve) => {
    imageDiff({
      actualImage,
      expectedImage,
      diffImage,
    }, (err, imagesAreSame) => {
      if (err) {
        throw err;
      } else {
        resolve(imagesAreSame);
      }
    });
  });
}

export function saveScreenshot(
  screenshotPath: string,
  screenshotData: string,
): Promise<string> {
  return fs.outputFile(screenshotPath, screenshotData, 'base64');
}

export function cropScreenshot(
  screenshotPath: string,
  windowSize: size,
  elementSize: size,
  elementLocation: location,
): Promise<string> {
  return new Promise((resolve) => {
    const cropWidth = elementSize.width < windowSize.width;
    const cropHeight = elementSize.height < windowSize.height;

    if (cropWidth || cropHeight) {
      const config = {
        width: cropWidth ? elementSize.width : windowSize.width,
        height: cropHeight ? elementSize.height : windowSize.height,
        top: Math.floor(elementLocation.y),
        left: Math.floor(elementLocation.x),
      };

      pngCrop.crop(screenshotPath, screenshotPath, config, (err) => {
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
