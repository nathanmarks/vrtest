// @flow

import { assert } from 'chai';
import { spy } from 'sinon';
import proxyquire from 'proxyquire';
import run from '../../src/server/run';
import buildFixture from '../fixtures/build';

describe('integration: server/run', () => {
  let consoleLog;
  let jsonReporter;

  function createDockerConfig(tests) {
    return {
      tests,
      testUrl: process.env.DOCKER_TEST_URL || 'http://10.200.10.1:3090',
      storage: {
        baseline: 'test/fixtures/simple/baseline',
        output: 'tmp/output',
      },
      selenium: {
        server: 'http://127.0.0.1:4444/wd/hub',
      },
      profiles: [{
        name: 'chrome',
        desiredCapabilities: {
          browserName: 'chrome',
        },
      }],
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

  it('should fail the second test', function () {
    this.timeout(Infinity);

    return buildFixture('simple/tests-broken.js')
      .then((stats) => {
        const tests = stats.compilation.assets['tests.js'].existsAt;
        const config = createDockerConfig(tests);

        return run(config);
      })
      .then(() => {
        const results = JSON.parse(consoleLog.args[0][0]);
        assert.strictEqual(results.total, 2);
        assert.strictEqual(results.passes, 1);
        assert.strictEqual(results.failures, 1);
        assert.strictEqual(results.tests[0].passed, true);
        assert.strictEqual(results.tests[1].passed, false);
        return null;
      });
  });
});
