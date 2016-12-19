// @flow
/* eslint-env mocha */

import { assert } from 'chai';
import start from './cli';

describe('cli', () => {
  describe('default export', () => {
    it('should be a function which boots the cli using commander and outputs the help', () => {
      const program = start();
      assert.ok(program);
    });
  });
});
