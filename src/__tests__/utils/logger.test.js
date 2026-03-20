/**
 * @file logger.test.js — Tests for structured logger utility
 */
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { createLogger, configureLogger, getLogHistory, clearLogHistory } from '../../utils/logger';

describe('Logger utility', () => {
  beforeEach(() => {
    clearLogHistory();
    configureLogger({ level: 'debug', collect: true });
  });

  it('creates a logger with component prefix', () => {
    const consoleSpy = vi.spyOn(console, 'info').mockImplementation(() => {});
    const log = createLogger('TestComponent');
    log.info('Hello world');
    expect(consoleSpy).toHaveBeenCalledWith('[TestComponent]', 'Hello world');
    consoleSpy.mockRestore();
  });

  it('collects log entries when collect is enabled', () => {
    const consoleSpy = vi.spyOn(console, 'log').mockImplementation(() => {});
    const log = createLogger('Collector');
    log.info('Entry 1');
    log.info('Entry 2');
    const history = getLogHistory();
    expect(history).toHaveLength(2);
    expect(history[0].component).toBe('Collector');
    expect(history[0].level).toBe('info');
    expect(history[1].message).toBe('Entry 2');
    consoleSpy.mockRestore();
  });

  it('respects log level filtering', () => {
    configureLogger({ level: 'warn' });
    const consoleSpy = vi.spyOn(console, 'log').mockImplementation(() => {});
    const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});
    const log = createLogger('Filtered');
    log.info('Should be filtered');
    log.warn('Should appear');
    expect(consoleSpy).not.toHaveBeenCalledWith('[Filtered]', 'Should be filtered');
    expect(warnSpy).toHaveBeenCalledWith('[Filtered]', 'Should appear');
    consoleSpy.mockRestore();
    warnSpy.mockRestore();
  });

  it('clears log history', () => {
    const consoleSpy = vi.spyOn(console, 'log').mockImplementation(() => {});
    const log = createLogger('Clearable');
    log.info('One');
    expect(getLogHistory()).toHaveLength(1);
    clearLogHistory();
    expect(getLogHistory()).toHaveLength(0);
    consoleSpy.mockRestore();
  });

  it('logs errors at error level', () => {
    const errorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    const log = createLogger('ErrorTest');
    log.error('Something broke');
    expect(errorSpy).toHaveBeenCalledWith('[ErrorTest]', 'Something broke');
    errorSpy.mockRestore();
  });
});
