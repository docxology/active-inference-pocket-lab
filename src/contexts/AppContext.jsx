/**
 * @file AppContext.jsx — Global application state
 * @description Provides app-wide state: current module, active stream, progress.
 *
 * The AppContext manages the "Triple-Stream Architecture" state, allowing
 * users to switch between Pulse/Vision/Core streams at any time.
 * Module progress is persisted to localStorage for cross-session continuity.
 *
 * @module contexts/AppContext
 */
import { createContext, useContext, useReducer, useCallback, useEffect } from 'react';
import { modules } from '../data/modules';
import {
  isModuleId,
  isStream,
  normalizeProgress,
  normalizeStreamChoices,
  readStored,
  writeStored,
} from '../utils/persistence';

/** @enum {string} Stream types for the Triple-Stream Architecture */
export const STREAMS = {
  PULSE: 'pulse',
  VISION: 'vision',
  CORE: 'core',
};

/** @enum {string} Action types for the app reducer */
const ACTIONS = {
  SET_STREAM: 'SET_STREAM',
  SET_MODULE: 'SET_MODULE',
  SET_MODULE_PROGRESS: 'SET_MODULE_PROGRESS',
  RESTORE_PROGRESS: 'RESTORE_PROGRESS',
  SET_POSITION: 'SET_POSITION',
};

/** localStorage key for persisted progress */
const STORAGE_KEY = 'spin_module_progress';

/**
 * Load persisted module progress from localStorage.
 * @returns {Object} Persisted module progress or empty object
 */
function loadPersistedProgress() {
  return readStored(STORAGE_KEY, normalizeProgress, {});
}

/**
 * Persist module progress to localStorage.
 * @param {Object} progress - Module progress object
 */
function persistProgress(progress) {
  writeStored(STORAGE_KEY, progress);
}

/** @type {Object} Initial app state */
const initialState = {
  activeStream: STREAMS.PULSE,
  currentModuleId: null,
  moduleProgress: {},
  streamPositions: {},
  streamChoices: {},
};

/**
 * App state reducer — pure function for state transitions.
 * @param {Object} state - Current state
 * @param {Object} action - Dispatched action
 * @returns {Object} Next state
 */
function appReducer(state, action) {
  switch (action.type) {
    case ACTIONS.SET_STREAM:
      if (!isStream(action.payload)) return state;
      return {
        ...state,
        activeStream: action.payload,
        streamChoices: state.currentModuleId
          ? { ...state.streamChoices, [state.currentModuleId]: action.payload }
          : state.streamChoices,
      };

    case ACTIONS.SET_MODULE:
      return isModuleId(action.payload)
        ? { ...state, currentModuleId: Number(action.payload) }
        : state;

    case ACTIONS.SET_POSITION: {
      const { moduleId, stream, position } = action.payload;
      if (!isModuleId(moduleId) || !isStream(stream) || !Number.isInteger(position) || position < 0)
        return state;
      if (state.streamPositions[moduleId]?.[stream] === position) return state;
      return {
        ...state,
        streamPositions: {
          ...state.streamPositions,
          [moduleId]: { ...state.streamPositions[moduleId], [stream]: position },
        },
      };
    }

    case ACTIONS.SET_MODULE_PROGRESS: {
      const { moduleId, stream, progress } = action.payload;
      if (!isModuleId(moduleId) || !isStream(stream) || !Number.isFinite(progress)) return state;
      const value = Math.max(
        state.moduleProgress[moduleId]?.[stream] || 0,
        Math.min(100, Math.max(0, progress)),
      );
      if (state.moduleProgress[moduleId]?.[stream] === value) return state;
      const nextProgress = {
        ...state.moduleProgress,
        [moduleId]: {
          ...state.moduleProgress[moduleId],
          [stream]: value,
        },
      };
      return { ...state, moduleProgress: nextProgress };
    }

    case ACTIONS.RESTORE_PROGRESS:
      return { ...state, moduleProgress: action.payload };

    default:
      console.warn(`[AppContext] Unknown action type: ${action.type}`);
      return state;
  }
}

const AppContext = createContext(null);

/**
 * AppProvider — Wraps the app with global state.
 * Persists module progress to localStorage on every update.
 * @param {Object} props
 * @param {React.ReactNode} props.children
 */
export function AppProvider({ children }) {
  const [state, dispatch] = useReducer(appReducer, null, () => ({
    ...initialState,
    moduleProgress: loadPersistedProgress(),
    streamPositions: readStored(
      'spin_stream_positions',
      (value) => normalizeProgress(value, 1000),
      {},
    ),
    streamChoices: readStored('spin_stream_choices', normalizeStreamChoices, {}),
  }));

  // Persist progress on change
  useEffect(() => {
    persistProgress(state.moduleProgress);
  }, [state.moduleProgress]);

  useEffect(() => {
    writeStored('spin_stream_positions', state.streamPositions);
  }, [state.streamPositions]);

  useEffect(() => {
    writeStored('spin_stream_choices', state.streamChoices);
  }, [state.streamChoices]);

  const setStreamPosition = useCallback((moduleId, stream, position) => {
    dispatch({ type: ACTIONS.SET_POSITION, payload: { moduleId, stream, position } });
  }, []);

  const setStream = useCallback((stream) => {
    console.log(`[AppContext] Stream switched to: ${stream}`);
    dispatch({ type: ACTIONS.SET_STREAM, payload: stream });
  }, []);

  const setModule = useCallback((moduleId) => {
    console.log(`[AppContext] Module set to: ${moduleId}`);
    dispatch({ type: ACTIONS.SET_MODULE, payload: moduleId });
  }, []);

  const updateProgress = useCallback((moduleId, stream, progress) => {
    console.log(`[AppContext] Progress update: Module ${moduleId}, ${stream} → ${progress}%`);
    dispatch({
      type: ACTIONS.SET_MODULE_PROGRESS,
      payload: { moduleId, stream, progress },
    });
  }, []);

  /**
   * Wipe all module progress — used by Settings' "Clear all progress" action.
   * Also clears persisted ActivityBank state so the Hearth resets.
   */
  const resetApp = useCallback(() => {
    try {
      localStorage.removeItem(STORAGE_KEY);
      localStorage.removeItem('spin_activity_bank');
      localStorage.removeItem('spin_stream_positions');
      localStorage.removeItem('spin_stream_choices');
    } catch (error) {
      console.warn('[AppContext] Failed to clear device storage:', error.message);
    }
    dispatch({ type: ACTIONS.RESTORE_PROGRESS, payload: {} });
    // Full reload ensures hooks that cached persisted state reinitialize.
    if (typeof window !== 'undefined') window.location.reload();
  }, []);

  /**
   * Calculate the total progress for a module across all streams.
   * @param {number|string} moduleId
   * @returns {number} Average progress (0-100)
   */
  const getModuleProgress = useCallback(
    (moduleId) => {
      const mp = state.moduleProgress[moduleId];
      if (!mp) return 0;
      const values = [mp.pulse || 0, mp.vision || 0, mp.core || 0];
      return Math.round(values.reduce((a, b) => a + b, 0) / 3);
    },
    [state.moduleProgress],
  );

  /**
   * Calculate overall progress across all modules.
   * @returns {number} Overall progress (0-100)
   */
  const getOverallProgress = useCallback(() => {
    const ids = Object.keys(state.moduleProgress);
    if (ids.length === 0) return 0;
    const total = ids.reduce((sum, id) => sum + getModuleProgress(id), 0);
    return Math.round(total / modules.length);
  }, [state.moduleProgress, getModuleProgress]);

  const value = {
    ...state,
    setStream,
    setModule,
    updateProgress,
    getModuleProgress,
    getOverallProgress,
    resetApp,
    setStreamPosition,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

/**
 * useApp — Hook to access global app state.
 * @returns {Object} App state and actions
 * @throws {Error} If used outside AppProvider
 */
export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('[useApp] Must be used within an AppProvider');
  }
  return context;
}
