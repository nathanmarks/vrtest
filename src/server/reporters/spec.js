// @flow

import chalk from 'chalk';
import logSymbols from 'log-symbols';
import createStatsCollector from './utils/stats';
import { log } from './utils/logger';

export default function createSpecReporter(runner: vrtest$Runner) {
  const stats = createStatsCollector(runner);

  runner.on('start', () => {
    log('');
    log(`  ${chalk.white('Starting tests')}`);
  });

  runner.on('suite', (suiteName) => {
    log('');
    log(`  ${chalk.yellow(suiteName)}`);
  });

  runner.on('pass', (test) => {
    log(`    ${chalk.green(logSymbols.success)}  ${test.name}`);
  });

  runner.on('fail', (test) => {
    log(`    ${chalk.red(logSymbols.error)}  ${test.name}`);
  });

  runner.on('end', () => {
    stats.logResults();
  });
}
