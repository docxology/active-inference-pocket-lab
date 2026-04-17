/**
 * @file useStreamProgress.js — Shared progress hook for module streams
 * @description Wraps `useApp` and `useActivityBank` so each stream can report
 * progress in two lines. Returns an `onProgress` callback (0..1) plus an
 * `onComplete` callback that marks 100% and records the session to the
 * Activity Bank for streak tracking.
 *
 * @module modules/shared/useStreamProgress
 */
import { useCallback } from 'react';
import { useApp } from '../../contexts/AppContext';
import { useActivityBank } from '../../contexts/ActivityBankContext';

/**
 * Returns { onProgress, onComplete } already bound to the given module + stream.
 *
 * @param {number} moduleId
 * @param {'pulse'|'vision'|'core'} streamKey
 * @param {number} [minutesEstimate=4]
 */
export function useStreamProgress(moduleId, streamKey, minutesEstimate = 4) {
  const { updateProgress } = useApp();
  const { recordActivity } = useActivityBank();

  const onProgress = useCallback(
    (frac) => {
      updateProgress(moduleId, streamKey, Math.round(frac * 100));
    },
    [moduleId, streamKey, updateProgress],
  );

  const onComplete = useCallback(() => {
    updateProgress(moduleId, streamKey, 100);
    recordActivity?.(moduleId, streamKey, minutesEstimate);
  }, [moduleId, streamKey, minutesEstimate, updateProgress, recordActivity]);

  return { onProgress, onComplete };
}
