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
  const events: events$EventEmitter = new EventEmitter();
  const runner: vrtest$Runner = {
    options,
    on,
    run,
  };

  function on(event: string, cb: Function): events$EventEmitter {
    return events.on(event, cb);
  }

  function run(): Promise<null> {
    const driver = buildDriver(options);

    events.emit('start');

    return driver.manage().timeouts().setScriptTimeout(60000)
      .then(() => configureWindow(driver))
      .then(() => driver.get(`${options.profile.testUrl || options.testUrl}/tests`))
      .then(() => setupTests(driver))
      .then(() => runTests(driver, options, events))
      .then(() => {
        // console.log('quit driver');
        return driver.quit();
      })
      .catch((err) => {
        // console.log('error!');
        events.emit('error', err);
        return true;
      })
      .then(() => {
        // console.log('end');
        events.emit('end');
        return null;
      });
  }

  return runner;
}

function buildDriver(options: vrtest$RunnerOptions) {
  const { profile, selenium } = options;

  const driver = new Builder().forBrowser(profile.desiredCapabilities.browserName);

  if (selenium) {
    driver.usingServer(selenium.server);
  }

  return driver.build();
}

function configureWindow(driver: WebDriverClass, width: number = 1000, height: number = 800) {
  return driver.manage().window().setSize(width, height);
}

function setupTests(driver: WebDriverClass) {
  return driver
    .executeAsyncScript(
      /* istanbul ignore next */
      function () {
        const callback = arguments[arguments.length - 1];
        const vrtest = window.__vrtest__;
        return vrtest.runBeforeHooks()
          .then(() => {
            vrtest.createTestController();
            vrtest.testController.start();
            return callback();
          });
      },
    );
}

function nextTest(driver: WebDriverClass) {
  return driver
    .executeAsyncScript(
      /* istanbul ignore next */
      function getTestInfo() {
        const callback = arguments[arguments.length - 1];
        const testController = window.__vrtest__.testController;
        return testController.next().then(() => callback({
          suiteName: testController.currentSuite.name,
          testName: testController.currentTest.name,
          done: testController.done,
        }));
      },
    );
}

async function runTests(
  driver: WebDriverClass,
  options: vrtest$RunnerOptions,
  events: events$EventEmitter,
) {
  const { profile, storage } = options;

  let done = false;
  let lastSuite = '';

  while (done === false) {
    const testInfo = await nextTest(driver);

    done = testInfo.done;

    if (done === false) {
      const { testName, suiteName } = testInfo;

      if (lastSuite !== suiteName) {
        events.emit('suite', suiteName);
        lastSuite = suiteName;
      }

      events.emit('test', testName);

      const element = await driver.findElement(By.css('body > *:first-child'));
      const elementSize = await element.getSize();
      const elementLocation = await element.getLocation();
      const windowSize = await driver.manage().window().getSize();
      const screenshotData = await driver.takeScreenshot();

      const screenshotPath = path.resolve(storage.output, profile.name, `${testName}.png`);
      const expectedPath = path.resolve(storage.baseline, profile.name, `${testName}.png`);
      const diffPath = path.resolve(storage.output, profile.name, `${testName}.diff.png`);

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
        name: testName,
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
