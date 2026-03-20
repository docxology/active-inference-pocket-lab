/**
 * @file ActivityBankContext.jsx — Activity Banking System
 * @description Manages user energy, planned pauses, and bookmark state.
 * 
 * Philosophy: "Seasonal Rhythms" — Design for capacity fluctuations.
 * If a user needs to hibernate, the interface holds their place like
 * a bookmark in a heavy stone book. No penalties for rest.
 * 
 * @module contexts/ActivityBankContext
 */
import { createContext, useContext, useReducer, useCallback, useEffect } from 'react';

/** @constant {string} LocalStorage key for persisting activity state */
const STORAGE_KEY = 'spin_activity_bank';

/** @enum {string} Activity action types */
const ACTIONS = {
  RECORD_ACTIVITY: 'RECORD_ACTIVITY',
  PAUSE: 'PAUSE',
  RESUME: 'RESUME',
  BOOKMARK: 'BOOKMARK',
  CLEAR_BOOKMARK: 'CLEAR_BOOKMARK',
  LOAD_STATE: 'LOAD_STATE',
};

/**
 * Load persisted state from localStorage.
 * @returns {Object|null} Persisted state or null
 */
function loadPersistedState() {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      const parsed = JSON.parse(stored);
      console.log('[ActivityBank] Restored persisted state', { 
        sessionCount: parsed.sessions?.length || 0,
        isPaused: parsed.isPaused,
      });
      return parsed;
    }
  } catch (err) {
    console.warn('[ActivityBank] Failed to load persisted state:', err.message);
  }
  return null;
}

/** @type {Object} Default activity bank state */
const defaultState = {
  sessions: [],          // Array of { startTime, endTime, moduleId, stream, duration }
  isPaused: false,
  pausedAt: null,
  bookmark: null,        // { moduleId, stream, position, timestamp }
  totalMinutes: 0,       // Total active time in minutes
  currentStreak: 0,      // Consecutive days with activity ("Spin" count)
  lastActiveDate: null,
};

/**
 * Activity Bank reducer.
 * @param {Object} state
 * @param {Object} action
 * @returns {Object}
 */
function activityReducer(state, action) {
  switch (action.type) {
    case ACTIONS.LOAD_STATE:
      return { ...defaultState, ...action.payload };

    case ACTIONS.RECORD_ACTIVITY: {
      const session = {
        ...action.payload,
        timestamp: new Date().toISOString(),
      };
      const newMinutes = state.totalMinutes + (session.duration || 0);
      return {
        ...state,
        sessions: [...state.sessions.slice(-99), session], // Keep last 100 sessions
        totalMinutes: newMinutes,
        lastActiveDate: new Date().toISOString().split('T')[0],
      };
    }

    case ACTIONS.PAUSE:
      console.log('[ActivityBank] User pausing — bookmarking state');
      return {
        ...state,
        isPaused: true,
        pausedAt: new Date().toISOString(),
      };

    case ACTIONS.RESUME:
      console.log('[ActivityBank] User resuming from pause');
      return {
        ...state,
        isPaused: false,
        pausedAt: null,
      };

    case ACTIONS.BOOKMARK:
      console.log('[ActivityBank] Bookmark set:', action.payload);
      return {
        ...state,
        bookmark: {
          ...action.payload,
          timestamp: new Date().toISOString(),
        },
      };

    case ACTIONS.CLEAR_BOOKMARK:
      return { ...state, bookmark: null };

    default:
      console.warn(`[ActivityBank] Unknown action: ${action.type}`);
      return state;
  }
}

const ActivityBankContext = createContext(null);

/**
 * ActivityBankProvider — Wraps app with activity tracking state.
 * Automatically persists to localStorage on state changes.
 * 
 * @param {Object} props
 * @param {React.ReactNode} props.children
 */
export function ActivityBankProvider({ children }) {
  const persisted = loadPersistedState();
  const [state, dispatch] = useReducer(
    activityReducer,
    persisted || defaultState,
  );

  // Persist state changes to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch (err) {
      console.warn('[ActivityBank] Failed to persist state:', err.message);
    }
  }, [state]);

  const recordActivity = useCallback((moduleId, stream, durationMinutes) => {
    dispatch({
      type: ACTIONS.RECORD_ACTIVITY,
      payload: { moduleId, stream, duration: durationMinutes },
    });
  }, []);

  const pause = useCallback(() => {
    dispatch({ type: ACTIONS.PAUSE });
  }, []);

  const resume = useCallback(() => {
    dispatch({ type: ACTIONS.RESUME });
  }, []);

  const setBookmark = useCallback((moduleId, stream, position) => {
    dispatch({
      type: ACTIONS.BOOKMARK,
      payload: { moduleId, stream, position },
    });
  }, []);

  const clearBookmark = useCallback(() => {
    dispatch({ type: ACTIONS.CLEAR_BOOKMARK });
  }, []);

  const value = {
    ...state,
    recordActivity,
    pause,
    resume,
    setBookmark,
    clearBookmark,
  };

  return (
    <ActivityBankContext.Provider value={value}>
      {children}
    </ActivityBankContext.Provider>
  );
}

/**
 * useActivityBank — Hook to access activity banking state.
 * @returns {Object} Activity bank state and actions
 * @throws {Error} If used outside ActivityBankProvider
 */
export function useActivityBank() {
  const context = useContext(ActivityBankContext);
  if (!context) {
    throw new Error('[useActivityBank] Must be used within an ActivityBankProvider');
  }
  return context;
}
