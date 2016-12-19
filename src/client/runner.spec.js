// @flow
/* eslint-env mocha */

import { assert } from 'chai';
import { spy } from 'sinon';
import { createRunner } from './runner';
import { createSuite } from './suite';

describe('client/runner', () => {
  let fooDocument;
  let runner;
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

    runner = createRunner(suites);
  });

  describe('.start', () => {
    it('should return a generator that runs each test', () => {
      const testRunner = runner.start(fooDocument);

      assert.strictEqual(testRunner.toString(), '[object Generator]');

      testRunner.next();
      assert.strictEqual(fooDocument.add.callCount, 1);
      assert.strictEqual(fooDocument.add.args[0][0], '<button>foo</button>');

      testRunner.next();
      assert.strictEqual(fooDocument.add.callCount, 2);
      assert.strictEqual(fooDocument.add.args[1][0], '<h1>foo</h1>');

      const results = testRunner.next();

      assert.strictEqual(results.value, true);
      assert.strictEqual(results.done, true);
    });
  });
});
