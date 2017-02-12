// @flow

import { assert } from 'chai';
import { spy } from 'sinon';
import ngrok from 'ngrok';
import proxyquire from 'proxyquire';
import run from '../../src/server/run';
import { readConfig } from '../../src/server/utils/config';
import buildFixture from '../fixtures/build';

describe('integration: browserstack', () => {
  let consoleLog;
  let jsonReporter;
  let testUrl;

  function createDockerConfig(tests) {
    return readConfig({
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
        default: {
          desiredCapabilities: {
            'browserstack.user': process.env.BROWSERSTACK_USER,
            'browserstack.key': process.env.BROWSERSTACK_KEY,
            'browserstack.video': false,
            'browserstack.selenium_version': '3.0.1',
          },
        },
        osx_chrome: {
          desiredCapabilities: {
            browserName: 'chrome',
            os: 'OS X',
            os_version: 'Sierra',
          },
        },
        osx_safari: {
          desiredCapabilities: {
            browserName: 'safari',
            os: 'OS X',
            os_version: 'Sierra',
          },
        },
        edge: {
          desiredCapabilities: {
            browserName: 'edge',
            os: 'WINDOWS',
            os_version: '10',
          },
        },
      },
      reporters: [jsonReporter],
    });
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
        assert.strictEqual(consoleLog.args.length, 3, 'there should be 3 result sets logged');

        const profiles = ['osx_chrome', 'osx_safari', 'edge'];

        Array(3).forEach((n, i) => {
          const results = JSON.parse(consoleLog.args[i][0]);
          const idx = profiles.indexOf(results.profile);
          assert.strictEqual(idx !== -1, true);
          profiles.splice(idx, 1);
          assert.strictEqual(results.total, 2);
          assert.strictEqual(results.passes, 2);
          assert.strictEqual(results.failures, 0);
        });
        return null;
      });
  });
});
