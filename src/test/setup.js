/**
 * @file Test setup for Vitest + Testing Library
 * @description Configures jsdom environment, provides localStorage polyfill,
 * and extends expect with DOM matchers.
 */

// Use jsdom's real Storage implementation rather than Node's unrelated Web Storage.
import { JSDOM } from 'jsdom';
const storage = new JSDOM('', { url: 'http://localhost' }).window.localStorage;
Object.defineProperty(globalThis, 'localStorage', { configurable: true, value: storage });

import '@testing-library/jest-dom';
import { afterEach } from 'vitest';
import { cleanup } from '@testing-library/react';

afterEach(() => {
  cleanup();
  localStorage.clear();
});
