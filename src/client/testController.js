// @flow

export function createTestController(suites: Array<vrtest$Suite>): vrtest$TestController {
  const controller: vrtest$TestController = {
    // totalSuites: suites.length,
    // totalTests: suites.reduce((res, n) => res + n.tests.length, 0),
    currentTest: null,
    generator: null,
    done: false,
    next,
    start,
    suites,
  };

  function start(...args: any): vrtest$TestController {
    controller.generator = testGenerator(...args);
    return controller;
  }

  function next(): Promise<vrtest$TestController> {
    if (!controller.generator) {
      throw new Error('testController has not been started.');
    }

    const { done, value } = controller.generator.next();

    return Promise.resolve(value).then(() => {
      if (done) {
        controller.done = true;
      }

      return controller;
    });
  }

  function* testGenerator(...args: any): Generator<Promise<typeof undefined>, boolean, void> {
    for (let i = 0; i < suites.length; i += 1) {
      for (let j = 0; j < suites[i].tests.length; j += 1) {
        controller.currentTest = suites[i].tests[j];
        yield controller.currentTest.exec(...args);
      }
    }

    return true;
  }

  return controller;
}
