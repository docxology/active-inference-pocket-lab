import { describe, it, expect } from 'vitest';
import {
  normalizeProgress,
  normalizeActivity,
  normalizeSettings,
  readStored,
  writeStored,
} from '../../utils/persistence';

const defaults = {
  sessions: [],
  goodQuestions: [],
  bookmark: null,
  isPaused: false,
  pausedAt: null,
  totalMinutes: 0,
  quizzesPassed: 0,
};

describe('device state validation', () => {
  it('reports a real DOM Storage quota failure without pretending data was saved', () => {
    expect(writeStored('too-large', { payload: 'x'.repeat(5_000_000) })).toBe(false);
    expect(localStorage.getItem('too-large')).toBeNull();
  });
  it.each([null, [], 'bad', 123])('rejects a non-record progress payload %s', (input) => {
    expect(normalizeProgress(input)).toEqual({});
  });
  it('preserves valid legacy progress and clamps it', () => {
    expect(
      normalizeProgress({
        1: { pulse: 40.5, core: 200, vision: -2, other: 50 },
        2: null,
        11: { pulse: 100 },
      }),
    ).toEqual({ 1: { pulse: 41, core: 100, vision: 0 } });
  });
  it('rejects malformed JSON and keeps the usable fallback', () => {
    localStorage.setItem('test-state', '{bad');
    expect(readStored('test-state', normalizeProgress, {})).toEqual({});
  });
  it('round-trips through real DOM Storage', () => {
    expect(writeStored('test-state', { 1: { core: 25 } })).toBe(true);
    expect(readStored('test-state', normalizeProgress, {})).toEqual({ 1: { core: 25 } });
  });
  it('validates preference types and rejects arbitrary fields', () => {
    const settings = { reducedMotion: false, fontScale: 1, defaultStream: 'pulse' };
    expect(
      normalizeSettings(
        { reducedMotion: 'false', fontScale: -1, defaultStream: 'missing', unexpected: 1 },
        settings,
      ),
    ).toEqual(settings);
    expect(
      normalizeSettings({ reducedMotion: true, fontScale: 1.25, defaultStream: 'core' }, settings),
    ).toEqual({ reducedMotion: true, fontScale: 1.25, defaultStream: 'core' });
  });
  it('recovers corrupted collection shapes without crashing the Hearth', () => {
    expect(
      normalizeActivity(
        {
          sessions: null,
          goodQuestions: 'bad',
          bookmark: { moduleId: 99 },
          totalMinutes: '100',
          quizzesPassed: -2,
        },
        defaults,
      ),
    ).toEqual(defaults);
  });
  it('keeps valid activity and rejects invalid sessions and dates', () => {
    const valid = { moduleId: 2, stream: 'core', duration: 1.5, timestamp: '2026-10-09T12:00:00Z' };
    const result = normalizeActivity(
      {
        sessions: [valid, { ...valid, duration: -1 }, { ...valid, timestamp: 'bad' }],
        totalMinutes: 1.5,
      },
      defaults,
    );
    expect(result.sessions).toEqual([valid]);
    expect(result.totalMinutes).toBe(1.5);
  });
});
