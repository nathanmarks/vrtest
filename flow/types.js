// @flow

/**
 * SERVER
 */

declare type vrtest$Config = {
  tests: Array<string>,
  testUrl: string,
  scripts?: Array<string>,
  stylesheets?: Array<string>,
  storage: {
    baseline: string,
    output: string,
  },
  server: {
    host: string,
    port: number,
  },
  selenium: {
    server: string,
  },
  reporters: Array<(vrtest$Runner) => vrtest$Reporter>,
  profiles: Array<vrtest$Profile>,
};

declare type vrtest$Reporter = {};

declare type vrtest$Runner = {
  options: vrtest$RunnerOptions,
  on(string, Function): events$EventEmitter,
  run(runOptions: vrtest$RunOptions): Promise<null>,
};

declare type vrtest$RunOptions = {
  interactive?: boolean,
  record?: boolean,
  grep?: boolean,
  profiles?: boolean,
};

declare type vrtest$Profile = {
  name: string,
  testUrl?: string,
  desiredCapabilities: Object,
};

declare type vrtest$RunnerOptions = {
  interactive?: boolean,
  profile: vrtest$Profile,
  storage: vrtest$Storage,
  selenium: {
    server: string,
  },
  testUrl: string,
};

declare type vrtest$Storage = {
  baseline: string,
  output: string,
};

// declare class vrtest$Storage {
//   constructor(profile?: vrtest$Profile): void;
//   getBaseline(test: string): Promise<any>;
//   writeBaseline(test: string): Promise<any>;
//   getResult(test: string): Promise<any>;
//   writeResult(test: string): Promise<any>;
// };

/**
 * CLIENT
 */

declare type vrtest$Client = {
  suites: Array<vrtest$Suite>,
  testController: null | vrtest$TestController,
  before(callback: () => Promise<any>): void,
  runBeforeHooks(): Promise<any>,
  createSuite(name: string, options?: vrtest$SuiteOptions): vrtest$Suite,
  createTestController(): vrtest$TestController,
};

declare type vrtest$TestController = {
  start: () => vrtest$TestController,
  next: () => Promise<vrtest$TestController>,
  done: boolean,
  currentTest: null | vrtest$Test,
  currentSuite: null | vrtest$Suite,
};

declare type vrtest$Suite = {
  name: string,
  options: vrtest$SuiteOptions,
  tests: Array<vrtest$Test>,
  createTest(string, Function): vrtest$Test,
};

declare type vrtest$SuiteOptions = {};

declare type vrtest$Test = {
  name: string,
  exec: (Document|Object) => Promise<any>,
};
