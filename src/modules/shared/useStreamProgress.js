/**
 * @file useStreamProgress.js — Shared progress hook for module streams
 * @description Wraps `useApp` and `useActivityBank` so each stream can report
 * progress in two lines. Returns an `onProgress` callback (0..1) plus an
 * `onComplete` callback that marks 100% and records the session to the
 * Activity Bank for streak tracking.
 *
 * @module modules/shared/useStreamProgress
 */
import { useCallback, useRef, useEffect } from 'react';
import { useApp } from '../../contexts/AppContext';
import { useActivityBank } from '../../contexts/ActivityBankContext';
import { usePageVisible } from '../../utils/useAnimationEnabled';

/**
 * Returns { onProgress, onComplete } already bound to the given module + stream.
 *
 * @param {number} moduleId
 * @param {'pulse'|'vision'|'core'} streamKey
 * Legacy third-argument time estimates are ignored; activity uses measured visible, unpaused time.
 */
export function useStreamProgress(moduleId, streamKey) {
  const { updateProgress } = useApp();
  const { recordActivity, isPaused } = useActivityBank();
  const visible = usePageVisible();
  const startedAt = useRef(null);
  const elapsed = useRef(0);
  const completed = useRef(false);
  useEffect(() => {
    if (isPaused || !visible) return;
    startedAt.current = performance.now();
    return () => {
      if (startedAt.current !== null) elapsed.current += performance.now() - startedAt.current;
      startedAt.current = null;
    };
  }, [isPaused, visible]);

  const onProgress = useCallback(
    (frac) => {
      updateProgress(moduleId, streamKey, Math.round(frac * 100));
    },
    [moduleId, streamKey, updateProgress],
  );

  const onComplete = useCallback(() => {
    if (completed.current) return;
    completed.current = true;
    updateProgress(moduleId, streamKey, 100);
    const current = startedAt.current === null ? 0 : performance.now() - startedAt.current;
    recordActivity(moduleId, streamKey, (elapsed.current + current) / 60000);
  }, [moduleId, streamKey, updateProgress, recordActivity]);

  return { onProgress, onComplete };
}
