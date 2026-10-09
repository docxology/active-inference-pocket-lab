import { describe, it, expect } from 'vitest';
import {
  isHapticSupported,
  hapticLight,
  hapticMedium,
  hapticSuccess,
  hapticReward,
  configureFeedback,
} from '../../utils/haptics';

describe('feedback on real unsupported browser APIs', () => {
  it('detects jsdom does not implement vibration', () => {
    expect(isHapticSupported()).toBe(false);
  });
  it.each([hapticLight, hapticMedium, hapticSuccess, hapticReward])(
    'can call %s without vibration support',
    (action) => {
      expect(() => action()).not.toThrow();
    },
  );
  it('can disable feedback without fabricating hardware support', () => {
    configureFeedback({ haptics: false, sound: false });
    expect(() => hapticSuccess()).not.toThrow();
    configureFeedback({ haptics: true, sound: false });
  });
});
