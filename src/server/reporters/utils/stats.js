// @flow

import chalk from 'chalk';
import { log } from './logger';

export default function createStatsCollector(runner: vrtest$Runner) {
  const stats = {
    start: undefined,
    end: undefined,
    tests: 0,
    passes: 0,
    failures: 0,
  };

  runner.on('start', () => {
    stats.start = new Date();
  });

  runner.on('end', () => {
    stats.end = new Date();
  });

  runner.on('pass', () => {
    stats.tests += 1;
    stats.passes += 1;
  });

  runner.on('fail', () => {
    stats.tests += 1;
    stats.failures += 1;
  });

  return {
    get tests(): number {
      return stats.tests;
    },

    get passes(): number {
      return stats.passes;
    },

    get failures(): number {
      return stats.failures;
    },

    get duration(): number {
      if (!stats.end || !stats.start) {
        return 0;
      }
      return stats.end - stats.start;
    },

    logResults() {
      log('');
      log(chalk.white(`  Finished ${this.tests} tests in ${this.duration}ms.`));
      log(chalk.green(`  ${this.passes} passes.`));
      log(chalk.red(`  ${this.failures} failures.`));
      log('');
    },
  };
}
