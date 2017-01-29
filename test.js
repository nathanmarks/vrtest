// @flow
/* eslint-disable prefer-arrow-callback, flowtype/require-return-type, prefer-rest-params */

const webdriver = require('selenium-webdriver');

const { Builder, Browser } = webdriver;

function configureWindow(driver, width = 1000, height = 800) {
  return driver.manage().window().setSize(width, height);
}

function loadTestPage(driver) {
  return driver.get('http://localhost:3090');
}

function setupTests(driver) {
  return driver
    .executeScript(function () {
      window.__vrtest__.createRunner();
      window.__vrtest__.runner.start();
    });
}

async function runTests(driver) {
  let completed = false;

  while (completed === false) {
    await driver
      .executeAsyncScript(function () {
        const callback = arguments[arguments.length - 1];
        const runner = window.__vrtest__.runner;
        return runner.next().then(() => callback(runner));
      })
      .then((runner) => {
        console.log(runner.completed);
        completed = runner.completed;
      });
  }

  return 'foo';
}

const driver = new Builder()
    .forBrowser(Browser.PHANTOM_JS)
    .build();

configureWindow(driver)
  .then(() => loadTestPage(driver))
  .then(() => setupTests(driver))
  .then(() => runTests(driver))
  .then(() => driver.quit())
  .catch((err) => {
    console.error(err);
  });

// driver.get('http://localhost:3090');
// driver.findElement(By.name('q')).sendKeys('webdriver');
// driver.findElement(By.name('btnG')).click();
// driver.wait(until.titleIs('webdriver - Google Search'), 5000);
// driver.quit();
