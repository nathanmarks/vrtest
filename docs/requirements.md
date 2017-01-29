# Requirements

This document describes the basic requirements of `vrtest`.

## What problem is it solving?

The goal of this library is to provide a user friendly solution to running visual regression tests.

## Requirements overview

### Test definition
- Users can define their tests in a simple JS file (used to create test server)
- Users can define their own test server URL
- Users can define their tests as a set of URLs (?)
- Users can import the `vrtest` client themselves
- Users can omit importing and rely on a global  (?)

### Baseline (comparison) images
- Baseline images are stored in the filesystem by default
- Baseline images can optionally be stored remotely (interface for writing+reading methods?)
- Baseline images can be viewed via the browser GUI

### Recording baseline images
- Baseline images can be recorded via the CLI
- Baseline images can be recorded individually
- Baseline images can be recorded for new tests only
- Baseline images can be recorded via the browser GUI

### Running tests
- Tests can be run via the CLI tool or the browser based GUI.
- Tests can be run using webdriver directly with local browsers or via a selenium server.
- Tests can be run individually
- CLI test runs should provide an output suitable for multiple test reporters
- Browser GUI should (at the minimum) update immediately after tests have completed (websockets?)
- Tests can be run in multiple browsers
- Configuration is easy to change for local vs CI 

### Storing test output
- Should store all images by default
- Should provide an interface for alternative storage options

### Reviewing conflicts
- CLI should provide an interface for accepting or declining diffs (interactive mode?)
- Browser GUI should provide an interface for reviewing and accepting or declining diffs