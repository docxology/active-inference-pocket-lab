/**
 * @file Test setup for Vitest + Testing Library
 * @description Configures jsdom environment, provides localStorage polyfill,
 * and extends expect with DOM matchers.
 */

// Polyfill localStorage for jsdom environments that lack it
if (typeof globalThis.localStorage === 'undefined' || typeof globalThis.localStorage.getItem !== 'function') {
  const store = {};
  globalThis.localStorage = {
    getItem: (key) => (key in store ? store[key] : null),
    setItem: (key, value) => { store[key] = String(value); },
    removeItem: (key) => { delete store[key]; },
    clear: () => { Object.keys(store).forEach((k) => delete store[k]); },
    get length() { return Object.keys(store).length; },
    key: (i) => Object.keys(store)[i] || null,
  };
}

import '@testing-library/jest-dom';

