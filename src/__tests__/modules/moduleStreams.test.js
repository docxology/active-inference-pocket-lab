/**
 * @file moduleStreams.test.js — Ensures every module lazy bundle exports triple streams
 */
import { describe, it, expect } from 'vitest';

const loaders = {
  1: () => import('../../modules/module1/index.js'),
  2: () => import('../../modules/module2/index.js'),
  3: () => import('../../modules/module3/index.js'),
  4: () => import('../../modules/module4/index.js'),
  5: () => import('../../modules/module5/index.js'),
  6: () => import('../../modules/module6/index.js'),
  7: () => import('../../modules/module7/index.js'),
  8: () => import('../../modules/module8/index.js'),
  9: () => import('../../modules/module9/index.js'),
  10: () => import('../../modules/module10/index.js'),
};

describe('Module stream bundles', () => {
  for (const id of Object.keys(loaders)) {
    it(`module ${id} exports PulseStream, VisionStream, CoreStream`, async () => {
      const m = await loaders[id]();
      expect(m.PulseStream).toBeTypeOf('function');
      expect(m.VisionStream).toBeTypeOf('function');
      expect(m.CoreStream).toBeTypeOf('function');
    });
  }
});
