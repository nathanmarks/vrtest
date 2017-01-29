// @flow

import commander from 'commander';
import { boot } from './server';
import { readConfig } from './utils/config';

export default function start(
  args: Array<any> = process.argv,
  program: Object = commander,
) {
  program
    .version('0.1.0')
    .description('See help for specific commands using [command] --help');

  program
    .command('run')
    .description('Run the visual regression tests')
    .action(() => {
      console.log('run');
    });

  program
    .command('server')
    .option('-c, --config', 'Specify a .js config file')
    .description('Run the visual regression test server')
    .action((config = {}) => {
      return boot(readConfig(config));
    });

  if (!args.slice(2).length) {
    program.outputHelp();
  } else {
    program.parse(args);
  }
}
