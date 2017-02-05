// @flow

import { assert } from 'chai';
import { spy } from 'sinon';
import ngrok from 'ngrok';
import proxyquire from 'proxyquire';
import run from '../../src/server/run';
import buildFixture from '../fixtures/build';

describe('integration: browserstack', () => {
  let consoleLog;
  let jsonReporter;
  let testUrl;

  function createDockerConfig(tests) {
    return {
      tests,
      testUrl,
      server: {
        host: 'localhost',
        port: 3090,
      },
      storage: {
        baseline: 'test/fixtures/simple/baseline',
        output: 'tmp/output',
      },
      selenium: {
        server: 'http://hub-cloud.browserstack.com/wd/hub',
      },
      profiles: {
        osx_chrome: {
          desiredCapabilities: {
            browserName: 'chrome',
            os: 'OS X',
            os_version: 'El Capitan',
            'browserstack.user': process.env.BROWSERSTACK_USER,
            'browserstack.key': process.env.BROWSERSTACK_KEY,
            'browserstack.selenium_version': '3.0.1',
          },
        },
      },
      reporters: [jsonReporter],
    };
  }

  beforeEach(() => {
    consoleLog = spy();
    jsonReporter = proxyquire('../../src/server/reporters/json', {
      './utils/logger': {
        log: consoleLog,
      },
    }).default;

    return new Promise((resolve) => {
      ngrok.connect(3090, (err, url) => {
        if (err) {
          throw err;
        } else {
          testUrl = url;
          resolve();
        }
      });
    });
  });

  afterEach(() => {
    ngrok.disconnect();
    ngrok.kill();
  });

  it('should pass both tests', function () {
    this.timeout(Infinity);

    return buildFixture('simple/tests.js')
      .then((stats) => {
        const tests = stats.compilation.assets['tests.js'].existsAt;
        const config = createDockerConfig(tests);

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

  // it('should fail the second test', function () {
  //   this.timeout(Infinity);

  //   return buildFixture('simple/tests-broken.js')
  //     .then((stats) => {
  //       const tests = stats.compilation.assets['tests.js'].existsAt;
  //       const config = createDockerConfig(tests);

  //       return run(config);
  //     })
  //     .then(() => {
  //       const results = JSON.parse(consoleLog.args[0][0]);
  //       assert.strictEqual(results.total, 2);
  //       assert.strictEqual(results.passes, 1);
  //       assert.strictEqual(results.failures, 1);
  //       assert.strictEqual(results.tests[0].passed, true);
  //       assert.strictEqual(results.tests[1].passed, false);
  //       return null;
  //     });
  // });
});
