/**
 * @file SettingsContext.jsx — User preferences
 * @description Preferences the learner can tune: reduced motion, haptics,
 * sound, high-contrast, font scale, default stream. Persisted to localStorage
 * and respected by the rest of the app.
 *
 * Philosophy: Aggressive generosity includes giving users real control.
 *
 * @module contexts/SettingsContext
 */
import { createContext, useContext, useEffect, useReducer, useCallback } from 'react';
import { MotionConfig, useReducedMotion } from 'framer-motion';
import { normalizeSettings, readStored, writeStored } from '../utils/persistence';
import { configureFeedback } from '../utils/haptics';

const STORAGE_KEY = 'spin_settings';

const ACTIONS = {
  SET: 'SET',
  RESET: 'RESET',
};

/** @type {Object} Default settings — conservative, inclusive defaults. */
const defaults = {
  reducedMotion: false, // respects `prefers-reduced-motion` when false
  haptics: true,
  sound: false,
  highContrast: false,
  fontScale: 1, // 0.9, 1.0, 1.1, 1.25
  defaultStream: 'pulse',
  autoBookmark: true,
  showMathByDefault: false,
};

function load() {
  return readStored(STORAGE_KEY, (value) => normalizeSettings(value, defaults), defaults);
}

function reducer(state, action) {
  switch (action.type) {
    case ACTIONS.SET:
      return normalizeSettings({ ...state, ...action.payload }, defaults);
    case ACTIONS.RESET:
      return { ...defaults };
    default:
      return state;
  }
}

const SettingsContext = createContext(null);

/**
 * @param {Object} props
 * @param {React.ReactNode} props.children
 */
export function SettingsProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, null, load);
  const systemReducedMotion = useReducedMotion();
  const motionReduced = state.reducedMotion || !!systemReducedMotion;

  // Persist
  useEffect(() => {
    writeStored(STORAGE_KEY, state);
    configureFeedback(state);
  }, [state]);

  // Apply global CSS variable for font scale
  useEffect(() => {
    document.documentElement.style.setProperty('--font-scale', String(state.fontScale));
    document.documentElement.dataset.reducedMotion = String(motionReduced);
    document.documentElement.dataset.highContrast = String(state.highContrast);
  }, [state.fontScale, motionReduced, state.highContrast]);

  const set = useCallback((patch) => {
    dispatch({ type: ACTIONS.SET, payload: patch });
  }, []);

  const reset = useCallback(() => {
    dispatch({ type: ACTIONS.RESET });
  }, []);

  const value = { ...state, motionReduced, set, reset };

  return (
    <SettingsContext.Provider value={value}>
      <MotionConfig reducedMotion={motionReduced ? 'always' : 'never'}>{children}</MotionConfig>
    </SettingsContext.Provider>
  );
}

/**
 * @returns {Object & {set: Function, reset: Function}}
 */
export function useSettings() {
  const ctx = useContext(SettingsContext);
  if (!ctx) throw new Error('[useSettings] must be used within SettingsProvider');
  return ctx;
}
