/**
 * @file haptics.test.js — Tests for haptic feedback utility
 */
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import {
  isHapticSupported,
  hapticLight,
  hapticMedium,
  hapticSuccess,
  hapticReward,
} from '../../utils/haptics';

describe('Haptics utility', () => {
  let vibrateSpy;

  beforeEach(() => {
    // Set up navigator.vibrate (not available in jsdom by default)
    vibrateSpy = vi.fn(() => true);
    navigator.vibrate = vibrateSpy;
  });

  afterEach(() => {
    delete navigator.vibrate;
  });

  it('detects haptic support', () => {
    expect(isHapticSupported()).toBe(true);
  });

  it('detects lack of haptic support', () => {
    delete navigator.vibrate;
    expect(isHapticSupported()).toBe(false);
  });

  it('hapticLight triggers 10ms vibration', () => {
    hapticLight();
    expect(vibrateSpy).toHaveBeenCalledWith(10);
  });

  it('hapticMedium triggers 25ms vibration', () => {
    hapticMedium();
    expect(vibrateSpy).toHaveBeenCalledWith(25);
  });

  it('hapticSuccess triggers pattern vibration', () => {
    hapticSuccess();
    expect(vibrateSpy).toHaveBeenCalledWith([15, 50, 30, 50, 15]);
  });

  it('hapticReward triggers pattern vibration', () => {
    hapticReward();
    expect(vibrateSpy).toHaveBeenCalledWith([10, 30, 20, 30, 40, 30, 20]);
  });

  it('does not throw when vibration not supported', () => {
    delete navigator.vibrate;
    expect(() => hapticLight()).not.toThrow();
    expect(() => hapticMedium()).not.toThrow();
    expect(() => hapticSuccess()).not.toThrow();
    expect(() => hapticReward()).not.toThrow();
  });
});
