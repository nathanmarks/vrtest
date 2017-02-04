// @flow

import path from 'path';
import express from 'express';
// import runTests from './run';

export function boot(config: vrtest$Config): Promise<Server> {
  const { scripts = [], tests = [] } = config;

  const app: express$Application = express();

  app.set('view engine', 'ejs');
  app.set('views', path.resolve(__dirname, 'views'));

  // app.get('/run', (req: express$Request, res: express$Response) => {
  //   runTests(`http://localhost:${config.app.port}/tests`);
  //   res.json({ foo: 'bar' });
  // });

  app.get('/tests', (req: express$Request, res: express$Response) => {
    res.render('tester', { scripts: [...scripts, ...tests] });
  });

  app.get('/resource', (req: express$Request, res: express$Response) => {
    const file = req.query.file;
    if (file.startsWith('http')) {
      res.redirect(file);
    } else {
      res.sendFile(file);
    }
  });

  return new Promise((resolve) => {
    const server = app.listen(config.server.port, '0.0.0.0', (err?: ?Error) => {
      if (err) {
        throw err;
      }

      // console.log(`vrtest server listening on port ${config.server.port}`);

      resolve(server);
    });
  });
}
