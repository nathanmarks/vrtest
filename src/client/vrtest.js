// @flow

import { createSuite as suiteFactory } from './suite';
import { createRunner as runnerFactory } from './runner';

function createVrTest(): VrTest {
  const vrtest = {
    suites: [],
    createSuite,
    createRunner,
  };

  function createSuite(name: string, options?: SuiteOptions): Suite {
    const newSuite = suiteFactory(name, options);
    vrtest.suites.push(newSuite);
    return newSuite;
  }

  function createRunner(): Runner {
    return runnerFactory(vrtest.suites);
  }

  return vrtest;
}

export { createVrTest };
