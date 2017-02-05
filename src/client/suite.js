// @flow

const DEFAULT_OPTIONS = {};

export function createSuite(name: string, options?: vrtest$SuiteOptions): vrtest$Suite {
  const suite = {
    name,
    options: applyDefaultOptions(options),
    tests: [],
    createTest,
  };

  function createTest(testName: string, callback: Function): vrtest$Test {
    const test = testFactory(testName, callback);
    suite.tests.push(test);
    return test;
  }

  return suite;
}

function testFactory(name: string, callback: Function): vrtest$Test {
  function exec(...args: any): Promise<any> {
    return Promise.resolve(callback(...args))
      .then(() => {
        return new Promise((resolve) => {
          window.requestAnimationFrame(resolve);
        });
      });
  }

  return { name, exec };
}

function applyDefaultOptions(options?: vrtest$SuiteOptions = {}): vrtest$SuiteOptions {
  return { ...DEFAULT_OPTIONS, ...options };
}
