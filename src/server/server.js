// @flow

import express from 'express';
import { promisify } from 'bluebird';

const server: express$Application = express();

server.get('/', (req: express$Request, res: express$Response) => {
  res.send('Hello World!');
});

export function boot(config: Object): Promise<express$Application> {
  console.log(config.tests);

  return promisify(server.listen)(config.server.port)
    .then(() => {
      console.log(`Example app listening on port ${config.server.port}!`);
      return server;
    });
}
