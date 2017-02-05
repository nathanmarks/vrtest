// @flow

import { assert } from 'chai';
import { spy } from 'sinon';
import proxyquire from 'proxyquire';
import run from '../../src/server/run';
import buildFixture from '../fixtures/build';

describe.only('integration: server/run', () => {
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
          storage: {
            baseline: 'test/fixtures/simple/baseline',
            output: 'tmp/output',
          },
          profiles: [{
            name: 'phantomjs',
            desiredCapabilities: {
              browserName: 'phantomjs',
            },
          }],
          reporters: [jsonReporter],
        };

        return run(config);
      })
      // .then(() => {
      //   return new Promise((resolve) => {
      //     setTimeout(() => {
      //       resolve();
      //     }, 360000);
      //   });
      // })
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

  //       const config = {
  //         tests,
  //         storage: {
  //           baseline: 'test/fixtures/simple/baseline',
  //           output: 'tmp/output',
  //         },
  //         profiles: [{
  //           name: 'phantomjs',
  //           browser: 'phantomjs',
  //         }],
  //         reporters: [jsonReporter],
  //       };

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
