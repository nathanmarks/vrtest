// @flow
/* eslint-env mocha */

import { assert } from 'chai';
import { spy } from 'sinon';
import { createTestController } from './testController';
import { createSuite } from './suite';

describe('client/testController', () => {
  let fooDocument;
  let testController;
  let suite;
  let suites;

  beforeEach(() => {
    fooDocument = {
      add: spy(),
    };
    suite = createSuite('foo');
    suites = [suite];

    suite.createTest('button', (doc) => {
      doc.add('<button>foo</button>');
    });

    suite.createTest('heading', (doc) => {
      doc.add('<h1>foo</h1>');
    });

    testController = createTestController(suites);
  });

  describe('.start -> .next', () => {
    it('should return the test controller and start the underlying generator', () => {
      const test = testController.start(fooDocument);

      assert.strictEqual(test, testController);

      testController.next();

      assert.strictEqual(fooDocument.add.callCount, 1);
      assert.strictEqual(fooDocument.add.args[0][0], '<button>foo</button>');

      // testRunner.next();
      // assert.strictEqual(fooDocument.add.callCount, 2);
      // assert.strictEqual(fooDocument.add.args[1][0], '<h1>foo</h1>');

      // const results = testRunner.next();

      // assert.strictEqual(results.value, true);
      // assert.strictEqual(results.done, true);
    });
  });
});
