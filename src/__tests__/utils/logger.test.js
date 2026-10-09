/**
 * @file logger.test.js — Tests for structured logger utility
 */
import { describe, it, expect, beforeEach } from 'vitest';
import { createLogger, configureLogger, getLogHistory, clearLogHistory } from '../../utils/logger';

describe('Logger utility', () => {
  beforeEach(() => {
    clearLogHistory();
    configureLogger({ level: 'debug', collect: true });
  });

  it('creates a logger with component prefix', () => {
    const log = createLogger('TestComponent');
    log.info('Hello world');
    expect(getLogHistory()[0]).toMatchObject({
      component: 'TestComponent',
      message: 'Hello world',
    });
  });

  it('collects log entries when collect is enabled', () => {
    const log = createLogger('Collector');
    log.info('Entry 1');
    log.info('Entry 2');
    const history = getLogHistory();
    expect(history).toHaveLength(2);
    expect(history[0].component).toBe('Collector');
    expect(history[0].level).toBe('info');
    expect(history[1].message).toBe('Entry 2');
  });

  it('respects log level filtering', () => {
    configureLogger({ level: 'warn' });
    const log = createLogger('Filtered');
    log.info('Should be filtered');
    log.warn('Should appear');
    expect(getLogHistory()).toHaveLength(1);
    expect(getLogHistory()[0].level).toBe('warn');
  });

  it('clears log history', () => {
    const log = createLogger('Clearable');
    log.info('One');
    expect(getLogHistory()).toHaveLength(1);
    clearLogHistory();
    expect(getLogHistory()).toHaveLength(0);
  });

  it('logs errors at error level', () => {
    const log = createLogger('ErrorTest');
    log.error('Something broke');
    expect(getLogHistory()[0]).toMatchObject({ level: 'error', message: 'Something broke' });
  });
});
