// @flow

import { boot } from './server';
import { readConfig } from './utils/config';
import createRunner from './runner';

export default function run(userConfig: Object): Promise<any> {
  const config: vrtest$Config = readConfig(userConfig);

  const { profiles, selenium, storage } = config;

  function runProfile(): Promise<null> {
    const profile = profiles[0];
    const runner = createRunner({ profile, selenium, storage });

    config.reporters.forEach((reporter) => {
      reporter(runner);
    });

    return runner.run();
  }

  let server;

  return boot(config)
    .then((httpServer) => {
      server = httpServer;
      return null;
    })
    .then(runProfile)
    .then(() => server.close());
}
