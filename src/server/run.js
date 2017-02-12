// @flow

import { boot } from './server';
import createRunner from './runner';

export default function run(
  config: vrtest$Config,
  runOptions?: vrtest$RunOptions = {},
): Promise<any> {
  const { profiles, selenium, storage, testUrl } = config;

  function runProfile(profile: vrtest$Profile): Promise<null> {
    const runner = createRunner({ profile, selenium, storage, testUrl });

    config.reporters.forEach((reporter) => {
      reporter(runner);
    });

    return runner.run(runOptions);
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
