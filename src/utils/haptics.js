/**
 * @file haptics.js — Haptic feedback utility
 * @description Provides touch feedback via the Vibration API.
 * Degrades gracefully on devices without vibration support.
 *
 * @module utils/haptics
 */

let feedback = { haptics: true, sound: false };
let audioContext;

/** Apply the learner's feedback preferences without reading storage on each tap. */
export function configureFeedback(settings) {
  feedback = { haptics: settings.haptics, sound: settings.sound };
}

function completionTone() {
  if (!feedback.sound) return;
  const Audio = globalThis.AudioContext || globalThis.webkitAudioContext;
  if (!Audio) return;
  try {
    audioContext ||= new Audio();
    if (audioContext.state === 'suspended') {
      audioContext
        .resume()
        .catch((error) => console.warn('[Haptics] Audio resume failed:', error.message));
    }
    const oscillator = audioContext.createOscillator();
    const gain = audioContext.createGain();
    oscillator.connect(gain);
    gain.connect(audioContext.destination);
    oscillator.frequency.value = 528;
    const now = audioContext.currentTime;
    gain.gain.setValueAtTime(0.05, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.2);
    oscillator.start(now);
    oscillator.stop(now + 0.2);
  } catch (error) {
    console.warn('[Haptics] Audio feedback unavailable:', error.message);
  }
}

/**
 * Check if haptic feedback is supported.
 * @returns {boolean}
 */
export function isHapticSupported() {
  return typeof navigator !== 'undefined' && typeof navigator.vibrate === 'function';
}

/**
 * Trigger a light haptic tap (e.g. slider change, button press).
 */
export function hapticLight() {
  if (feedback.haptics && isHapticSupported()) {
    navigator.vibrate(10);
    console.log('[Haptics] Light tap');
  }
}

/**
 * Trigger a medium haptic tap (e.g. step advance, stream switch).
 */
export function hapticMedium() {
  if (feedback.haptics && isHapticSupported()) {
    navigator.vibrate(25);
    console.log('[Haptics] Medium tap');
  }
}

/**
 * Trigger a success haptic pattern (e.g. module completion).
 */
export function hapticSuccess() {
  completionTone();
  if (feedback.haptics && isHapticSupported()) {
    navigator.vibrate([15, 50, 30, 50, 15]);
    console.log('[Haptics] Success pattern');
  }
}

/**
 * Trigger a reward haptic pattern (e.g. Spin animation).
 */
export function hapticReward() {
  if (feedback.haptics && isHapticSupported()) {
    navigator.vibrate([10, 30, 20, 30, 40, 30, 20]);
    console.log('[Haptics] Reward pattern');
  }
}
