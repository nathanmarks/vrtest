// @flow

const DEFAULT_OPTIONS = {};

export function createSuite(name: string, options?: SuiteOptions): Suite {
  const suite = {
    name,
    options: applyDefaultOptions(options),
    tests: [],
    createTest,
  };

  function createTest(testName: string, callback: Function): Test {
    const test = testFactory(testName, callback);
    suite.tests.push(test);
    return test;
  }

  return suite;
}

function testFactory(name: string, callback: Function): Test {
  function exec(...args: any): Promise<any> {
    return Promise.resolve(callback(...args));
  }

  return { name, exec };
}

function applyDefaultOptions(options?: SuiteOptions = {}): SuiteOptions {
  return { ...DEFAULT_OPTIONS, ...options };
}
