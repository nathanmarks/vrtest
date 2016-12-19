// @flow

import { createVrTest } from './vrtest';

const vrtest = createVrTest();

if (window) {
  window.__vrtest__ = vrtest; // yolo
}

export default vrtest;
