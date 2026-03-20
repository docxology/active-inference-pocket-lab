/**
 * @file logger.js — Structured logging utility
 * @description Provides a configurable logging system with component prefixes,
 * log levels, and optional log collection for debugging.
 *
 * @module utils/logger
 */

/** @type {'debug'|'info'|'warn'|'error'} Current log level */
let currentLevel = 'info';

/** @type {Array<Object>} Collected log entries (when enabled) */
const logHistory = [];

/** @type {boolean} Whether to collect logs for later inspection */
let collectLogs = false;

/** Log level priority map */
const LEVELS = { debug: 0, info: 1, warn: 2, error: 3 };

/**
 * Configure the logger.
 * @param {{ level?: string, collect?: boolean }} options
 */
export function configureLogger(options = {}) {
  if (options.level && LEVELS[options.level] !== undefined) {
    currentLevel = options.level;
  }
  if (options.collect !== undefined) {
    collectLogs = options.collect;
  }
  console.log(`[Logger] Configured: level=${currentLevel}, collect=${collectLogs}`);
}

/**
 * Create a prefixed logger for a component.
 * @param {string} componentName - Name for the log prefix
 * @returns {{ debug: Function, info: Function, warn: Function, error: Function }}
 */
export function createLogger(componentName) {
  const prefix = `[${componentName}]`;

  function log(level, ...args) {
    if (LEVELS[level] < LEVELS[currentLevel]) return;

    const entry = {
      timestamp: new Date().toISOString(),
      component: componentName,
      level,
      message: args.map((a) => (typeof a === 'object' ? JSON.stringify(a) : String(a))).join(' '),
    };

    if (collectLogs) {
      logHistory.push(entry);
      // Keep history bounded
      if (logHistory.length > 500) logHistory.shift();
    }

    const consoleFn = level === 'debug' ? console.log : console[level] || console.log;
    consoleFn(prefix, ...args);
  }

  return {
    debug: (...args) => log('debug', ...args),
    info: (...args) => log('info', ...args),
    warn: (...args) => log('warn', ...args),
    error: (...args) => log('error', ...args),
  };
}

/**
 * Get collected log history.
 * @returns {Array<Object>}
 */
export function getLogHistory() {
  return [...logHistory];
}

/**
 * Clear log history.
 */
export function clearLogHistory() {
  logHistory.length = 0;
}
