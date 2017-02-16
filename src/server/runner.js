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
import createStatsCollector from './reporters/utils/stats';

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

  async function run(runOptions: vrtest$RunOptions): Promise<vrtest$Stats> {
    const driver = await buildDriver(options);
    const testUrl = `${options.profile.testUrl || options.testUrl}/tests`;
    const stats = createStatsCollector(runner);

    function handleError(err: any) {
      events.emit('error', err);
      return driver.quit();
    }

    process.on('unhandledRejection', handleError);
    process.on('uncaughtException', handleError);

    events.emit('start');

    await driver.manage().timeouts().setScriptTimeout(60000).catch(handleError);
    await driver.manage().window().setSize(1000, 700).catch(handleError);
    await driver.get(testUrl).catch(handleError);
    await setupTests(driver).catch(handleError);
    await runTests(driver, events, options, runOptions).catch(handleError);
    await driver.quit().catch(handleError);

    events.emit('end');

    return stats.all;
  }

  return runner;
}

function buildDriver(options: vrtest$RunnerOptions) {
  const { profile, selenium } = options;

  const driver = new Builder().withCapabilities(profile.desiredCapabilities);

  if (selenium) {
    driver.usingServer(selenium.server);
  }

  return driver.build();
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
  events: events$EventEmitter,
  options: vrtest$RunnerOptions,
  runOptions: vrtest$RunOptions,
) {
  const { profile, storage } = options;
  const { record } = runOptions;

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

      const screenshotPath = path.resolve(
        record ? storage.baseline : storage.output,
        profile.name,
        suiteName,
        `${testName}.png`,
      );
      const expectedPath = path.resolve(
        storage.baseline,
        profile.name,
        suiteName,
        `${testName}.png`,
      );
      const diffPath = path.resolve(
        storage.output,
        profile.name,
        suiteName,
        `${testName}.diff.png`,
      );

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
