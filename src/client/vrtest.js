// @flow

import { createSuite as suiteFactory } from './suite';
import { createTestController as testControllerFactory } from './testController';

function createVrTest(): vrtest$Client {
  const vrtest: vrtest$Client = {
    suites: [],
    createSuite,
    createTestController,
    testController: null,
  };

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
