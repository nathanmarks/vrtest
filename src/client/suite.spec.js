// @flow
/* eslint-env mocha */

import { assert } from 'chai';
import { createSuite } from './suite';

describe('server/suite', () => {
  describe('export createSuite()', () => {
    it('should be a function', () => {
      assert.strictEqual(typeof createSuite, 'function');
    });

    it('should return a suite', () => {
      const mySuite = createSuite('mySuite');
      assert.strictEqual(mySuite.name, 'mySuite');
    });
  });

  describe('suite', () => {
    let mySuite;

    beforeEach(() => {
      mySuite = createSuite('mySuite');
    });

    describe('.createTest', () => {
      it('creates a test and adds it to the array of tests in the suite', () => {
        const fooFn = () => {};
        mySuite.createTest('foo', fooFn);

        assert.strictEqual(mySuite.tests.length, 1);
        assert.strictEqual(mySuite.tests[0].name, 'foo');
        // assert.strictEqual(mySuite.tests[0].callback, fooFn);
      });
    });
  });
});
