// @flow

export function createTestController(suites: Array<vrtest$Suite>): vrtest$TestController {
  const controller: vrtest$TestController = {
    currentTest: null,
    currentSuite: null,
    done: false,
    next,
    start,
  };

  let generator;

  function start(...args: any): vrtest$TestController {
    generator = testGenerator(...args);
    return controller;
  }

  function next(): Promise<vrtest$TestController> {
    if (!generator) {
      throw new Error('testController has not been started.');
    }

    const { done, value } = generator.next();

    return Promise.resolve(value).then(() => {
      if (done) {
        controller.done = true;
      }

      return controller;
    });
  }

  function* testGenerator(...args: any): Generator<Promise<typeof undefined>, boolean, void> {
    for (let i = 0; i < suites.length; i += 1) {
      controller.currentSuite = suites[i];
      for (let j = 0; j < suites[i].tests.length; j += 1) {
        controller.currentTest = suites[i].tests[j];
        yield controller.currentTest.exec(...args);
      }
    }

    return true;
  }

  return controller;
}
