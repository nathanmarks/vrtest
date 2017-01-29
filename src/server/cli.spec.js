// @flow
/* eslint-env mocha */

import { assert } from 'chai';
import start from './cli';

describe('cli', () => {
  describe('default export', () => {
    it('should be a function', () => {
      assert.strictEqual(typeof start, 'function');
    });
  });
});
