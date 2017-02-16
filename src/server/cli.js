// @flow

import commander from 'commander';
import { boot } from './server';
import { readConfig } from './utils/config';
import run from './run';

export default function start(
  args: Array<any> = process.argv,
  program: Object = new commander.Command(),
) {
  program
    .version('0.1.0')
    .description('See help for specific commands using [command] --help');

  program
    .command('run')
    .description('Run the visual regression tests')
    .option('-c, --config <file>', 'Specify a .js config file')
    .option('-r, --record', 'Record new baseline images')
    // .option('-i, --interactive', 'Enable interactive mode')
    // .option('-g, --grep', 'grep the tests')
    // .option('-p', '--profiles', 'specify the config profiles to run')
    .action(({ config, ...other }) => {
      return run(readConfig(config), other)
        .then((stats) => {
          if (stats.failures) {
            process.exit(1);
          }
          return null;
        });
    });

  program
    .command('server')
    .description('Run the visual regression test server')
    .option('-c, --config', 'Specify a .js config file')
    .action((config = {}) => {
      return boot(readConfig(config));
    });

  if (!args.slice(2).length) {
    program.outputHelp();
  } else {
    program.parse(args);
  }
}
