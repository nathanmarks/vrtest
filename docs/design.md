# Design

This document describes the basic design of the major components.

## Configuration

- Should be able to define profiles
  - Wtf is a profile?!
- Should have an option to pass the client test bundle
- Should have an option to pass a glob of JS files defining tests
- Should have an option to enable global client API inclusion
- Should have an option to load arbitrary scripts/styles
- 

## CLI

The CLI serves as an interface for all key functionality.

### Config

All commands should accept a `-c` /`--config-file` argument to allow the user to pass a configuration. If not provided, a config file will be looked for in the current working directory.

### `run`

This command should run the test suite from start to finish. 

- Should accept test names as a variadic (? or a grep option) argument

A few considerations:

- Should users be able to accept/decline diffs via an interactive mode?
- Should there be an option to overrwrite all existing baseline images?

## Test client

## Test server

## Browser GUI