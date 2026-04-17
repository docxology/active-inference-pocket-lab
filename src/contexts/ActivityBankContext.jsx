/**
 * @file ActivityBankContext.jsx — Activity Banking System
 * @description Manages learner energy, planned pauses, bookmarks, streaks, and
 * quiz outcomes. Designed around Seasonal Rhythms: capacity fluctuates, rest
 * is not a penalty.
 *
 * Responsibilities:
 *  - Record per-session activity (module, stream, duration).
 *  - Compute a real day-streak from session dates.
 *  - Persist bookmarks so "your place is held".
 *  - Track quiz pass counts for badges.
 *
 * @module contexts/ActivityBankContext
 */
import { createContext, useContext, useReducer, useCallback, useEffect, useMemo } from 'react';

/** @constant {string} */
const STORAGE_KEY = 'spin_activity_bank';

const ACTIONS = {
  RECORD_ACTIVITY: 'RECORD_ACTIVITY',
  PAUSE: 'PAUSE',
  RESUME: 'RESUME',
  BOOKMARK: 'BOOKMARK',
  CLEAR_BOOKMARK: 'CLEAR_BOOKMARK',
  RECORD_QUIZ: 'RECORD_QUIZ',
  RECORD_QUESTION: 'RECORD_QUESTION',
  RESET_ALL: 'RESET_ALL',
};

function loadPersistedState() {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) return JSON.parse(stored);
  } catch (err) {
    console.warn('[ActivityBank] Failed to load:', err.message);
  }
  return null;
}

/** @type {Object} */
const defaultState = {
  sessions: [], // { moduleId, stream, duration, timestamp }
  isPaused: false,
  pausedAt: null,
  bookmark: null, // { moduleId, stream, position, timestamp }
  totalMinutes: 0,
  quizzesPassed: 0,
  goodQuestions: [], // user-curated prompts — they make the Hearth warmer
};

function activityReducer(state, action) {
  switch (action.type) {
    case ACTIONS.RECORD_ACTIVITY: {
      const session = { ...action.payload, timestamp: new Date().toISOString() };
      const addMinutes = Number(session.duration) || 0;
      return {
        ...state,
        sessions: [...state.sessions.slice(-199), session], // bound to last 200
        totalMinutes: Math.round((state.totalMinutes + addMinutes) * 100) / 100,
      };
    }
    case ACTIONS.PAUSE:
      return { ...state, isPaused: true, pausedAt: new Date().toISOString() };
    case ACTIONS.RESUME:
      return { ...state, isPaused: false, pausedAt: null };
    case ACTIONS.BOOKMARK:
      return {
        ...state,
        bookmark: { ...action.payload, timestamp: new Date().toISOString() },
      };
    case ACTIONS.CLEAR_BOOKMARK:
      return { ...state, bookmark: null };
    case ACTIONS.RECORD_QUIZ: {
      const passed = action.payload.passed ? 1 : 0;
      return { ...state, quizzesPassed: state.quizzesPassed + passed };
    }
    case ACTIONS.RECORD_QUESTION:
      return {
        ...state,
        goodQuestions: [
          { text: action.payload.text, moduleId: action.payload.moduleId, timestamp: new Date().toISOString() },
          ...state.goodQuestions.slice(0, 99),
        ],
      };
    case ACTIONS.RESET_ALL:
      return { ...defaultState };
    default:
      return state;
  }
}

/**
 * Derive a streak: the length of the most recent consecutive run of days
 * (ending today or yesterday) on which any activity was recorded.
 * @param {Array} sessions
 * @returns {number}
 */
export function computeStreak(sessions) {
  if (!sessions || sessions.length === 0) return 0;
  const days = new Set(
    sessions.map((s) => {
      const d = new Date(s.timestamp);
      return `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`;
    }),
  );

  const today = new Date();
  let cursor = new Date(today);
  // Accept today *or* yesterday as the leading edge (time-zone kind, no-penalty)
  const todayKey = `${today.getFullYear()}-${today.getMonth()}-${today.getDate()}`;
  const yesterday = new Date(today);
  yesterday.setDate(today.getDate() - 1);
  const yesterdayKey = `${yesterday.getFullYear()}-${yesterday.getMonth()}-${yesterday.getDate()}`;

  if (!days.has(todayKey) && !days.has(yesterdayKey)) return 0;
  if (!days.has(todayKey)) cursor = yesterday;

  let streak = 0;
  while (true) {
    const k = `${cursor.getFullYear()}-${cursor.getMonth()}-${cursor.getDate()}`;
    if (!days.has(k)) break;
    streak += 1;
    cursor.setDate(cursor.getDate() - 1);
  }
  return streak;
}

const ActivityBankContext = createContext(null);

/**
 * @param {Object} props
 * @param {React.ReactNode} props.children
 */
export function ActivityBankProvider({ children }) {
  const persisted = loadPersistedState();
  const [state, dispatch] = useReducer(activityReducer, { ...defaultState, ...(persisted || {}) });

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch (err) {
      console.warn('[ActivityBank] Failed to persist:', err.message);
    }
  }, [state]);

  const recordActivity = useCallback((moduleId, stream, durationMinutes) => {
    dispatch({
      type: ACTIONS.RECORD_ACTIVITY,
      payload: { moduleId, stream, duration: durationMinutes },
    });
  }, []);

  const pause = useCallback(() => dispatch({ type: ACTIONS.PAUSE }), []);
  const resume = useCallback(() => dispatch({ type: ACTIONS.RESUME }), []);
  const setBookmark = useCallback((moduleId, stream, position) => {
    dispatch({ type: ACTIONS.BOOKMARK, payload: { moduleId, stream, position } });
  }, []);
  const clearBookmark = useCallback(() => dispatch({ type: ACTIONS.CLEAR_BOOKMARK }), []);
  const recordQuiz = useCallback((passed) => {
    dispatch({ type: ACTIONS.RECORD_QUIZ, payload: { passed } });
  }, []);
  const addGoodQuestion = useCallback((text, moduleId) => {
    if (!text || !text.trim()) return;
    dispatch({ type: ACTIONS.RECORD_QUESTION, payload: { text: text.trim(), moduleId } });
  }, []);
  const resetAll = useCallback(() => dispatch({ type: ACTIONS.RESET_ALL }), []);

  const currentStreak = useMemo(() => computeStreak(state.sessions), [state.sessions]);

  const value = {
    ...state,
    currentStreak,
    lastActiveDate: state.sessions.at?.(-1)?.timestamp?.slice(0, 10) || null,
    recordActivity,
    pause,
    resume,
    setBookmark,
    clearBookmark,
    recordQuiz,
    addGoodQuestion,
    resetAll,
  };

  return <ActivityBankContext.Provider value={value}>{children}</ActivityBankContext.Provider>;
}

export function useActivityBank() {
  const context = useContext(ActivityBankContext);
  if (!context) throw new Error('[useActivityBank] must be used within ActivityBankProvider');
  return context;
}
