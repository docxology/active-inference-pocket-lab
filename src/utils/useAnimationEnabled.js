import { useState, useEffect } from 'react';
import { useSettings } from '../contexts/SettingsContext';
import { useActivityBank } from '../contexts/ActivityBankContext';

/** Track page visibility so off-screen simulations and activity timers can pause. */
export function usePageVisible() {
  const [visible, setVisible] = useState(() => !document.hidden);
  useEffect(() => {
    const update = () => setVisible(!document.hidden);
    document.addEventListener('visibilitychange', update);
    return () => document.removeEventListener('visibilitychange', update);
  }, []);
  return visible;
}

/** Run continuous animation only while visible, active, and motion is permitted. */
export function useAnimationEnabled() {
  const { motionReduced } = useSettings();
  const { isPaused } = useActivityBank();
  return usePageVisible() && !motionReduced && !isPaused;
}
