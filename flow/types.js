declare type VrTestOptions = {};

declare type VrTest = {
  suites: Array<Suite>,
  createSuite: (name: string, options?: SuiteOptions) => Suite,
  createRunner: () => Runner,
};

declare type Runner = {
  start: () => Generator<any, boolean, void>,
};

declare type SuiteOptions = {};

declare type Suite = {
  name: string,
  options: SuiteOptions,
  tests: Array<Object>,
  createTest: (string, Function) => Suite,
};

declare type Test = {
  name: string,
  exec: (Document|Object) => Promise<any>,
};

// export type ServerConfig = {
//   port: number,
// };
