/**
 * @file haptics.js — Haptic feedback utility
 * @description Provides touch feedback via the Vibration API.
 * Degrades gracefully on devices without vibration support.
 *
 * @module utils/haptics
 */

/**
 * Check if haptic feedback is supported.
 * @returns {boolean}
 */
export function isHapticSupported() {
  return typeof navigator !== 'undefined' && 'vibrate' in navigator;
}

/**
 * Trigger a light haptic tap (e.g. slider change, button press).
 */
export function hapticLight() {
  if (isHapticSupported()) {
    navigator.vibrate(10);
    console.log('[Haptics] Light tap');
  }
}

/**
 * Trigger a medium haptic tap (e.g. step advance, stream switch).
 */
export function hapticMedium() {
  if (isHapticSupported()) {
    navigator.vibrate(25);
    console.log('[Haptics] Medium tap');
  }
}

/**
 * Trigger a success haptic pattern (e.g. module completion).
 */
export function hapticSuccess() {
  if (isHapticSupported()) {
    navigator.vibrate([15, 50, 30, 50, 15]);
    console.log('[Haptics] Success pattern');
  }
}

/**
 * Trigger a reward haptic pattern (e.g. Spin animation).
 */
export function hapticReward() {
  if (isHapticSupported()) {
    navigator.vibrate([10, 30, 20, 30, 40, 30, 20]);
    console.log('[Haptics] Reward pattern');
  }
}
