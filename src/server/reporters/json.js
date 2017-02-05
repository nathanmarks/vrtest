// @flow

import createStatsCollector from './utils/stats';
import { log } from './utils/logger';

export default function createJSONReporter(runner: vrtest$Runner) {
  const stats = createStatsCollector(runner);
  const results = {
    profile: runner.options.profile.name,
    total: 0,
    passes: 0,
    failures: 0,
    tests: [],
  };

  runner.on('pass', (test) => {
    results.tests.push({
      name: test.name,
      passed: true,
    });
  });

  runner.on('fail', (test) => {
    results.tests.push({
      name: test.name,
      passed: false,
    });
  });

  runner.on('end', () => {
    results.total = stats.tests;
    results.passes = stats.passes;
    results.failures = stats.failures;

    const resultString = JSON.stringify(results);
    log(resultString);
  });
}
