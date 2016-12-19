// @flow
/* eslint-env mocha */

import { assert } from 'chai';
import { createVrTest } from './vrtest';

describe('client/vrtest', () => {
  let vrtest;

  beforeEach(() => {
    vrtest = createVrTest();
  });

  it('should create an object', () => {
    assert.strictEqual(vrtest.toString(), '[object Object]');
  });

  describe('.createSuite', () => {
    let suite;

    beforeEach(() => {
      suite = vrtest.createSuite('foo');
    });

    it('should create a suite, store the reference and return it', () => {
      assert.strictEqual(suite.toString(), '[object Object]');
      assert.strictEqual(vrtest.suites.length, 1);
      assert.strictEqual(vrtest.suites[0], suite);
    });
  });
});
