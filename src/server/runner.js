// @flow
/* eslint-disable prefer-arrow-callback, flowtype/require-return-type, prefer-rest-params */

import EventEmitter from 'events';
import webdriver from 'selenium-webdriver';
import path from 'path';
import {
  saveScreenshot,
  cropScreenshot,
  compareScreenshots,
} from './utils/screenshots';

const { By, Builder } = webdriver;

export default function createRunner(options: vrtest$RunnerOptions): vrtest$Runner {
  const { profile } = options;
  const events: events$EventEmitter = new EventEmitter();
  const runner = {
    on,
    run,
  };

  function on(event: string, cb: Function): events$EventEmitter {
    return events.on(event, cb);
  }

  function run(): Promise<null> {
    const driver = buildDriver(profile);

    events.emit('start');

    return configureWindow(driver)
      .then(() => loadTestPage(driver))
      .then(() => setupTests(driver))
      .then(() => runTests(driver, options, events))
      .then(() => driver.quit())
      .catch((err) => {
        console.error(err);
        events.emit('error', err);
      })
      .then(() => {
        events.emit('end');
        return null;
      });
  }

  return runner;
}

function buildDriver(profile: vrtest$Profile) {
  const driver = new Builder()
    .forBrowser(profile.browser)
    .build();

  return driver;
}

function configureWindow(driver: WebDriverClass, width: number = 1000, height: number = 800) {
  return driver.manage().window().setSize(width, height);
}

function loadTestPage(driver: WebDriverClass) {
  return driver.get('http://localhost:3090/tests');
}

function setupTests(driver: WebDriverClass) {
  return driver
    .executeScript(function () {
      window.__vrtest__.createTestController();
      window.__vrtest__.testController.start();
    });
}

async function runTests(
  driver: WebDriverClass,
  options: vrtest$RunnerOptions,
  events: events$EventEmitter,
) {
  const { profile, storage } = options;
  let done = false;
  let currentTestName = '';

  function initNextTest() {
    const callback = arguments[arguments.length - 1];
    const testController = window.__vrtest__.testController;
    return testController.next().then(() => callback(testController));
  }

  function getTestInfo(testController: vrtest$TestController) {
    done = testController.done;
    if (testController.currentTest) {
      currentTestName = testController.currentTest.name;
    }
  }

  while (done === false) {
    await driver
      .executeAsyncScript(initNextTest)
      .then(getTestInfo);

    if (done === false) {
      const element = await driver.findElement(By.css('body > *:first-child'));
      const elementSize = await element.getSize();
      const elementLocation = await element.getLocation();
      const windowSize = await driver.manage().window().getSize();
      const screenshotData = await driver.takeScreenshot();

      const screenshotPath = path.resolve(storage.output, profile.name, `${currentTestName}.png`);
      const expectedPath = path.resolve(storage.baseline, profile.name, `${currentTestName}.png`);
      const diffPath = path.resolve(storage.output, profile.name, `${currentTestName}.diff.png`);

      // const test1 = await fs.access(screenshotPath)
      //   .then(() => true)
      //   .catch(() => false);

      await saveScreenshot(screenshotPath, screenshotData);
      await cropScreenshot(
        screenshotPath,
        windowSize,
        elementSize,
        elementLocation,
      );

      const imagesAreSame = await compareScreenshots(
        screenshotPath,
        expectedPath,
        diffPath,
      );

      const test = {
        name: currentTestName,
        screenshotPath,
        expectedPath,
        diffPath,
      };

      if (imagesAreSame) {
        events.emit('pass', test);
      } else {
        events.emit('fail', test);
      }
    }
  }

  return true;
}
