// @flow

import { assert } from 'chai';
import { spy } from 'sinon';
import proxyquire from 'proxyquire';
import { Browser } from 'selenium-webdriver';
import run from '../../src/server/run';
import buildFixture from '../fixtures/build';

describe('integration: docker selenium host', () => {
  let consoleLog;
  let jsonReporter;

  beforeEach(() => {
    consoleLog = spy();
    jsonReporter = proxyquire('../../src/server/reporters/json', {
      './utils/logger': {
        log: consoleLog,
      },
    }).default;
  });

  it('should pass both tests', function () {
    this.timeout(Infinity);

    return buildFixture('simple/tests.js')
      .then((stats) => {
        const tests = stats.compilation.assets['tests.js'].existsAt;

        const config = {
          tests,
          testUrl: process.env.SELENIUM_TEST_URL || 'http://10.200.10.1:3090',
          storage: {
            baseline: 'test/fixtures/simple/baseline',
            output: 'tmp/output',
          },
          selenium: {
            server: 'http://127.0.0.1:4444/wd/hub',
          },
          profiles: [{
            name: 'chrome',
            browser: Browser.CHROME,
          }],
          reporters: [jsonReporter],
        };

        return run(config);
      })
      .then(() => {
        const results = JSON.parse(consoleLog.args[0][0]);
        assert.strictEqual(results.total, 2);
        assert.strictEqual(results.passes, 2);
        assert.strictEqual(results.failures, 0);
        return null;
      });
  });
});
