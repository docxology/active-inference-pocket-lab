/** @file Validated device-local learning state. Existing storage keys stay compatible. */
import { modules } from '../data/modules';

/** Whether a value is a plain JSON record. */
export function isRecord(value) {
  return value !== null && typeof value === 'object' && !Array.isArray(value);
}

/** Whether an ID belongs to a registered module. */
export function isModuleId(id) {
  return modules.some((mod) => String(mod.id) === String(id));
}

/** Whether a value names a learning stream. */
export function isStream(value) {
  return ['pulse', 'vision', 'core'].includes(value);
}

/** Load JSON through a schema validator; malformed or unavailable storage is reported. */
export function readStored(key, normalize, fallback) {
  try {
    const raw = localStorage.getItem(key);
    return raw === null ? fallback : normalize(JSON.parse(raw));
  } catch (error) {
    console.warn(`[Persistence] Could not read ${key}:`, error.message);
    return fallback;
  }
}

/** Persist JSON without preventing learning when device storage is unavailable. */
export function writeStored(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
    return true;
  } catch (error) {
    console.warn(`[Persistence] Could not save ${key}:`, error.message);
    return false;
  }
}

/** Keep only registered module/stream pairs with finite numeric values. */
export function normalizeProgress(value, max = 100) {
  if (!isRecord(value)) return {};
  const result = {};
  for (const [id, streams] of Object.entries(value)) {
    if (!isModuleId(id) || !isRecord(streams)) continue;
    const valid = Object.fromEntries(
      Object.entries(streams)
        .filter(([key, number]) => isStream(key) && Number.isFinite(number))
        .map(([key, number]) => [key, Math.min(max, Math.max(0, Math.round(number)))]),
    );
    if (Object.keys(valid).length) result[id] = valid;
  }
  return result;
}

/** Validate the last selected learning stream for each registered module. */
export function normalizeStreamChoices(value) {
  if (!isRecord(value)) return {};
  return Object.fromEntries(
    Object.entries(value).filter(([id, stream]) => isModuleId(id) && isStream(stream)),
  );
}

/** Validate settings by field rather than trusting arbitrary stored JSON. */
export function normalizeSettings(value, defaults) {
  if (!isRecord(value)) return { ...defaults };
  const result = { ...defaults };
  for (const [key, defaultValue] of Object.entries(defaults)) {
    if (typeof defaultValue === 'boolean' && typeof value[key] === 'boolean')
      result[key] = value[key];
  }
  if ([0.9, 1, 1.1, 1.25].includes(value.fontScale)) result.fontScale = value.fontScale;
  if (isStream(value.defaultStream)) result.defaultStream = value.defaultStream;
  return result;
}

const validDate = (value) => typeof value === 'string' && Number.isFinite(Date.parse(value));
const nonNegative = (value) => Number.isFinite(value) && value >= 0;

/** Validate activity collections, counters, dates and bookmark targets. */
export function normalizeActivity(value, defaults) {
  if (!isRecord(value)) return { ...defaults };
  const sessions = Array.isArray(value.sessions)
    ? value.sessions
        .filter(
          (session) =>
            isRecord(session) &&
            isModuleId(session.moduleId) &&
            isStream(session.stream) &&
            nonNegative(session.duration) &&
            validDate(session.timestamp),
        )
        .slice(-200)
    : [];
  const goodQuestions = Array.isArray(value.goodQuestions)
    ? value.goodQuestions
        .filter(
          (question) =>
            isRecord(question) &&
            typeof question.text === 'string' &&
            question.text.trim() &&
            validDate(question.timestamp),
        )
        .slice(0, 100)
    : [];
  const b = value.bookmark;
  const bookmark =
    isRecord(b) &&
    isModuleId(b.moduleId) &&
    isStream(b.stream) &&
    (typeof b.position === 'string' || nonNegative(b.position))
      ? b
      : null;
  return {
    ...defaults,
    sessions,
    goodQuestions,
    bookmark,
    isPaused: value.isPaused === true,
    pausedAt: validDate(value.pausedAt) ? value.pausedAt : null,
    totalMinutes: nonNegative(value.totalMinutes) ? value.totalMinutes : 0,
    quizzesPassed:
      Number.isInteger(value.quizzesPassed) && value.quizzesPassed >= 0 ? value.quizzesPassed : 0,
  };
}
