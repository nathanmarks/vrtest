// @flow
/* eslint-env mocha */

import { assert } from 'chai';
import { spy, stub } from 'sinon';
import proxyquire from 'proxyquire';

describe('cli', () => {
  let runSpy;
  let readyConfigSpy;
  let start;

  beforeEach(() => {
    runSpy = spy();
    readyConfigSpy = spy();
    runSpy = stub().returns(Promise.resolve({}));
    start = proxyquire('./cli', {
      './run': {
        default: runSpy,
      },
      './utils/config': {
        readConfig: readyConfigSpy,
      },
    }).default;
  });

  describe('vrtest run', () => {
    it('should run the visual regression tests', () => {
      start(['', '', 'run']);
      assert.strictEqual(runSpy.callCount, 1);
    });

    it('should run the visual regression tests with a config file', () => {
      start(['', '', 'run', '-c', 'path/to/config.js']);
      assert.strictEqual(runSpy.callCount, 1);
      assert.strictEqual(readyConfigSpy.args[0][0], 'path/to/config.js');

      start(['', '', 'run', '--config', 'path/to/config.js']);
      assert.strictEqual(runSpy.callCount, 2);
      assert.strictEqual(readyConfigSpy.args[1][0], 'path/to/config.js');
    });

    it('should run the visual regression tests in record mode', () => {
      start(['', '', 'run', '-r']);
      assert.strictEqual(runSpy.callCount, 1);
      assert.strictEqual(runSpy.args[0][1].record, true);

      start(['', '', 'run', '--record']);
      assert.strictEqual(runSpy.callCount, 2);
      assert.strictEqual(runSpy.args[1][1].record, true);
    });
  });
});
