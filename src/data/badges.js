/**
 * @file badges.js — Clarity Badge Registry
 * @description Hearth replaces leaderboards. Badges celebrate clarity and
 * consistency rather than speed or rank. Each badge is pure: a name, icon,
 * and a function that returns true/false given current activity state.
 *
 * @module data/badges
 */

/**
 * @typedef {Object} BadgeContext
 * @property {number} totalMinutes
 * @property {number} currentStreak
 * @property {Array} sessions
 * @property {Object} moduleProgress
 * @property {number} quizzesPassed
 */

/**
 * @typedef {Object} Badge
 * @property {string} id
 * @property {string} label
 * @property {string} icon
 * @property {string} description
 * @property {(ctx: BadgeContext) => boolean} earned
 * @property {(ctx: BadgeContext) => number} progress - 0..1 toward unlock
 */

/** @type {Badge[]} */
const badges = [
  {
    id: 'first-spin',
    label: 'First Spin',
    icon: '🌀',
    description: 'Completed your first learning session.',
    earned: (c) => c.sessions.length > 0,
    progress: (c) => (c.sessions.length > 0 ? 1 : 0),
  },
  {
    id: 'ten-minutes',
    label: 'Ten Minutes',
    icon: '⏱️',
    description: 'Ten minutes of active learning banked.',
    earned: (c) => c.totalMinutes >= 10,
    progress: (c) => Math.min(1, c.totalMinutes / 10),
  },
  {
    id: 'three-day-streak',
    label: '3-Day Streak',
    icon: '🔥',
    description: 'Three days in a row with a spin.',
    earned: (c) => c.currentStreak >= 3,
    progress: (c) => Math.min(1, c.currentStreak / 3),
  },
  {
    id: 'seven-day-streak',
    label: '7-Day Streak',
    icon: '🌙',
    description: 'A full week of consistent orbits.',
    earned: (c) => c.currentStreak >= 7,
    progress: (c) => Math.min(1, c.currentStreak / 7),
  },
  {
    id: 'three-streams',
    label: 'Full Helix',
    icon: '✨',
    description: 'Completed all three streams of at least one module.',
    earned: (c) =>
      Object.values(c.moduleProgress || {}).some(
        (p) => (p.pulse || 0) >= 100 && (p.vision || 0) >= 100 && (p.core || 0) >= 100,
      ),
    progress: (c) => {
      const best = Object.values(c.moduleProgress || {}).reduce((max, p) => {
        const avg = ((p.pulse || 0) + (p.vision || 0) + (p.core || 0)) / 3;
        return Math.max(max, avg);
      }, 0);
      return best / 100;
    },
  },
  {
    id: 'pulse-path',
    label: 'Pulse Path',
    icon: '💓',
    description: 'Finished the Pulse stream of three modules.',
    earned: (c) =>
      Object.values(c.moduleProgress || {}).filter((p) => (p.pulse || 0) >= 100).length >= 3,
    progress: (c) =>
      Math.min(
        1,
        Object.values(c.moduleProgress || {}).filter((p) => (p.pulse || 0) >= 100).length / 3,
      ),
  },
  {
    id: 'vision-path',
    label: 'Vision Path',
    icon: '🎨',
    description: 'Finished the Vision stream of three modules.',
    earned: (c) =>
      Object.values(c.moduleProgress || {}).filter((p) => (p.vision || 0) >= 100).length >= 3,
    progress: (c) =>
      Math.min(
        1,
        Object.values(c.moduleProgress || {}).filter((p) => (p.vision || 0) >= 100).length / 3,
      ),
  },
  {
    id: 'core-path',
    label: 'Core Path',
    icon: '🔬',
    description: 'Finished the Core stream of three modules.',
    earned: (c) =>
      Object.values(c.moduleProgress || {}).filter((p) => (p.core || 0) >= 100).length >= 3,
    progress: (c) =>
      Math.min(
        1,
        Object.values(c.moduleProgress || {}).filter((p) => (p.core || 0) >= 100).length / 3,
      ),
  },
  {
    id: 'quiz-thinker',
    label: 'Quiz Thinker',
    icon: '🧠',
    description: 'Passed five module quizzes.',
    earned: (c) => (c.quizzesPassed || 0) >= 5,
    progress: (c) => Math.min(1, (c.quizzesPassed || 0) / 5),
  },
  {
    id: 'whole-orbit',
    label: 'Whole Orbit',
    icon: '🌐',
    description: 'Explored all ten modules in some form.',
    earned: (c) => Object.keys(c.moduleProgress || {}).length >= 10,
    progress: (c) => Math.min(1, Object.keys(c.moduleProgress || {}).length / 10),
  },
];

/**
 * @returns {Badge[]}
 */
export function getAllBadges() {
  return badges;
}

/**
 * Evaluate every badge against context.
 * @param {BadgeContext} ctx
 * @returns {Array<Badge & {isEarned: boolean, progressValue: number}>}
 */
export function evaluateBadges(ctx) {
  return badges.map((b) => ({
    ...b,
    isEarned: b.earned(ctx),
    progressValue: b.progress(ctx),
  }));
}

export default badges;
