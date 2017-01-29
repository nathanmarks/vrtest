// @flow

import { createVrTest } from './vrtest';

const vrtest = createVrTest();

export default vrtest;

if (window) {
  window.__vrtest__ = vrtest; // yolo
}
