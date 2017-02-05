// @flow

import { createSuite as suiteFactory } from './suite';
import { createTestController as testControllerFactory } from './testController';

function createVrTest(): vrtest$Client {
  const beforeFns: Array<Function> = [];

  const vrtest: vrtest$Client = {
    suites: [],
    before,
    runBeforeHooks,
    createSuite,
    createTestController,
    testController: null,
  };

  function before(callback: () => Promise<any>) {
    beforeFns.push(callback);
  }

  function runBeforeHooks(): Promise<any> {
    if (beforeFns.length) {
      return Promise.resolve(beforeFns.pop()()).then(runBeforeHooks);
    }
    return Promise.resolve();
  }

  function createSuite(name: string, options?: vrtest$SuiteOptions): vrtest$Suite {
    const newSuite = suiteFactory(name, options);
    vrtest.suites.push(newSuite);
    return newSuite;
  }

  function createTestController(): vrtest$TestController {
    vrtest.testController = testControllerFactory(vrtest.suites);
    return vrtest.testController;
  }

  return vrtest;
}

export { createVrTest };
