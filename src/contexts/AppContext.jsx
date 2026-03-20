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
};

/** localStorage key for persisted progress */
const STORAGE_KEY = 'spin_module_progress';

/**
 * Load persisted module progress from localStorage.
 * @returns {Object} Persisted module progress or empty object
 */
function loadPersistedProgress() {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      const parsed = JSON.parse(stored);
      console.log('[AppContext] Restored persisted progress', {
        moduleCount: Object.keys(parsed).length,
      });
      return parsed;
    }
  } catch (error) {
    console.error('[AppContext] Failed to load persisted progress:', error);
  }
  return {};
}

/**
 * Persist module progress to localStorage.
 * @param {Object} progress - Module progress object
 */
function persistProgress(progress) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
  } catch (error) {
    console.error('[AppContext] Failed to persist progress:', error);
  }
}

/** @type {Object} Initial app state */
const initialState = {
  activeStream: STREAMS.PULSE,
  currentModuleId: null,
  moduleProgress: loadPersistedProgress(),
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
      return { ...state, activeStream: action.payload };

    case ACTIONS.SET_MODULE:
      return { ...state, currentModuleId: action.payload };

    case ACTIONS.SET_MODULE_PROGRESS: {
      const { moduleId, stream, progress } = action.payload;
      const nextProgress = {
        ...state.moduleProgress,
        [moduleId]: {
          ...state.moduleProgress[moduleId],
          [stream]: Math.min(100, Math.max(0, progress)),
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
  const [state, dispatch] = useReducer(appReducer, initialState);

  // Persist progress on change
  useEffect(() => {
    persistProgress(state.moduleProgress);
  }, [state.moduleProgress]);

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
   * Calculate the total progress for a module across all streams.
   * @param {number|string} moduleId
   * @returns {number} Average progress (0-100)
   */
  const getModuleProgress = useCallback((moduleId) => {
    const mp = state.moduleProgress[moduleId];
    if (!mp) return 0;
    const values = [mp.pulse || 0, mp.vision || 0, mp.core || 0];
    return Math.round(values.reduce((a, b) => a + b, 0) / 3);
  }, [state.moduleProgress]);

  /**
   * Calculate overall progress across all modules.
   * @returns {number} Overall progress (0-100)
   */
  const getOverallProgress = useCallback(() => {
    const ids = Object.keys(state.moduleProgress);
    if (ids.length === 0) return 0;
    const total = ids.reduce((sum, id) => sum + getModuleProgress(id), 0);
    return Math.round(total / 10); // 10 total modules
  }, [state.moduleProgress, getModuleProgress]);

  const value = {
    ...state,
    setStream,
    setModule,
    updateProgress,
    getModuleProgress,
    getOverallProgress,
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
