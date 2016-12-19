// @flow

export function createRunner(suites: Array<Suite>): Runner {
  const runner = {
    currentSuite: 0,
    currentTest: 0,
    totalSuites: suites.length,
    totalTests: suites.reduce((res, n) => res + n.tests.length, 0),
    start,
  };

  function* start(...args: any): Generator<any, boolean, void> {
    for (let i = 0; i < suites.length; i += 1) {
      for (let j = 0; j < suites[i].tests.length; j += 1) {
        const test = suites[i].tests[j];
        yield test.exec(...args);
      }
    }

    return true;
  }

  return runner;
}
