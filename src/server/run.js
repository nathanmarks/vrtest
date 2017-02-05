// @flow

import { boot } from './server';
import { readConfig } from './utils/config';
import createRunner from './runner';

export default function run(userConfig: Object): Promise<any> {
  const config: vrtest$Config = readConfig(userConfig);

  const { profiles, selenium, storage, testUrl } = config;

  function runProfile(profile: vrtest$Profile): Promise<null> {
    const runner = createRunner({ profile, selenium, storage, testUrl });

    config.reporters.forEach((reporter) => {
      reporter(runner);
    });

    return runner.run();
  }

  function runProfiles(): Promise<Array<null>> {
    return Promise.all(profiles.map(runProfile));
  }

  let server;

  return boot(config)
    .then((httpServer) => {
      server = httpServer;
      return null;
    })
    .then(runProfiles)
    .then(() => server.close());
}
