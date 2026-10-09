import { useState, useEffect, useCallback } from 'react';
import { useApp } from '../../contexts/AppContext';
import { useActivityBank } from '../../contexts/ActivityBankContext';
import { useSettings } from '../../contexts/SettingsContext';

/** Restore a stream's step and keep automatic bookmarks synchronized with navigation. */
export function useLearningPosition(moduleId, stream, stepCount) {
  const { currentPositions, streamPositions, setCurrentPosition, setStreamPosition } = useApp();
  const { setBookmark } = useActivityBank();
  const { autoBookmark } = useSettings();
  const [index, setIndex] = useState(() =>
    Math.min(
      stepCount - 1,
      currentPositions[moduleId]?.[stream] ?? streamPositions[moduleId]?.[stream] ?? 0,
    ),
  );
  useEffect(() => {
    if (!moduleId) return;
    setCurrentPosition(moduleId, stream, index);
    if (autoBookmark && moduleId) {
      setStreamPosition(moduleId, stream, index);
      setBookmark(moduleId, stream, index);
    }
  }, [autoBookmark, moduleId, stream, index, setCurrentPosition, setStreamPosition, setBookmark]);
  const go = useCallback(
    (position) => {
      setIndex(Math.max(0, Math.min(stepCount - 1, position)));
    },
    [stepCount],
  );
  return [index, go];
}
