/**
 * @file HearthPage.jsx — Community Celebration Space
 * @description Celebrates consistency, clarity, and curiosity. Replaces
 * competition with warmth: the Hearth shows per-module journey, earned badges,
 * and a timeline of your recent spins.
 *
 * @module pages/HearthPage
 */
import { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useActivityBank } from '../contexts/ActivityBankContext';
import { useApp } from '../contexts/AppContext';
import { modules } from '../data/modules';
import './HearthPage.css';

/**
 * Derive a chronological list of daily learning minutes for the last 28 days.
 */
function useDailyMinutes(sessions) {
  return useMemo(() => {
    const days = [];
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const bucket = new Map();
    for (const s of sessions) {
      const d = new Date(s.timestamp);
      d.setHours(0, 0, 0, 0);
      const k = d.getTime();
      bucket.set(k, (bucket.get(k) || 0) + (Number(s.duration) || 0));
    }
    for (let i = 27; i >= 0; i--) {
      const d = new Date(today);
      d.setDate(today.getDate() - i);
      const k = d.getTime();
      days.push({ date: d, minutes: bucket.get(k) || 0 });
    }
    return days;
  }, [sessions]);
}

const BADGES = [
  { id: 'first-spin', label: 'First Spin', icon: '🌀', test: ({ sessions }) => sessions.length > 0 },
  { id: 'ten-minutes', label: '10 Minutes', icon: '⏱️', test: ({ totalMinutes }) => totalMinutes >= 10 },
  { id: 'hour', label: 'First Hour', icon: '⏳', test: ({ totalMinutes }) => totalMinutes >= 60 },
  { id: 'streak-3', label: '3-Day Streak', icon: '🔥', test: ({ currentStreak }) => currentStreak >= 3 },
  { id: 'streak-7', label: '7-Day Streak', icon: '🔥🔥', test: ({ currentStreak }) => currentStreak >= 7 },
  {
    id: 'pulse-open',
    label: 'Pulse Opened',
    icon: '💓',
    test: ({ sessions }) => sessions.some((s) => s.stream === 'pulse'),
  },
  {
    id: 'vision-open',
    label: 'Vision Opened',
    icon: '✨',
    test: ({ sessions }) => sessions.some((s) => s.stream === 'vision'),
  },
  {
    id: 'core-open',
    label: 'Core Opened',
    icon: '🔬',
    test: ({ sessions }) => sessions.some((s) => s.stream === 'core'),
  },
  {
    id: 'triple-module',
    label: 'Triple Stream',
    icon: '🎭',
    test: ({ moduleProgress }) =>
      Object.values(moduleProgress).some((mp) => (mp?.pulse || 0) > 0 && (mp?.vision || 0) > 0 && (mp?.core || 0) > 0),
  },
  {
    id: 'first-complete',
    label: 'First Module Complete',
    icon: '🏅',
    test: ({ moduleProgress }) =>
      Object.values(moduleProgress).some(
        (mp) => (mp?.pulse || 0) >= 100 && (mp?.vision || 0) >= 100 && (mp?.core || 0) >= 100,
      ),
  },
  {
    id: 'quiz-1',
    label: 'First Quiz',
    icon: '🧠',
    test: ({ quizzesPassed }) => quizzesPassed >= 1,
  },
  { id: 'quiz-5', label: '5 Quizzes', icon: '🎓', test: ({ quizzesPassed }) => quizzesPassed >= 5 },
  {
    id: 'question',
    label: 'Good Question',
    icon: '❓',
    test: ({ goodQuestions }) => goodQuestions.length > 0,
  },
  {
    id: 'halfway',
    label: 'Halfway Home',
    icon: '🌗',
    test: ({ moduleProgress }) => {
      const n = Object.values(moduleProgress).filter(
        (mp) => ((mp?.pulse || 0) + (mp?.vision || 0) + (mp?.core || 0)) / 3 >= 100,
      ).length;
      return n >= 5;
    },
  },
  {
    id: 'orbit',
    label: 'Closed the Orbit',
    icon: '🌌',
    test: ({ moduleProgress }) => {
      const n = Object.values(moduleProgress).filter(
        (mp) => ((mp?.pulse || 0) + (mp?.vision || 0) + (mp?.core || 0)) / 3 >= 100,
      ).length;
      return n >= 10;
    },
  },
];

export default function HearthPage() {
  const bank = useActivityBank();
  const { moduleProgress, getOverallProgress } = useApp();
  const daily = useDailyMinutes(bank.sessions);
  const earned = useMemo(() => BADGES.filter((b) => b.test({ ...bank, moduleProgress })), [bank, moduleProgress]);
  const recent = useMemo(() => bank.sessions.slice(-8).reverse(), [bank.sessions]);
  const maxDay = Math.max(1, ...daily.map((d) => d.minutes));
  const overall = getOverallProgress?.() || 0;

  return (
    <div className="page hearth-page">
      <div className="container">
        <motion.header
          className="hearth-page__header"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1>The Hearth</h1>
          <p>Warmth, not competition. Celebrate your journey.</p>
        </motion.header>

        <motion.div
          className="hearth-page__flame"
          animate={{ scale: [1, 1.05, 1] }}
          transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
        >
          🔥
        </motion.div>

        <div className="hearth-page__stats">
          <Stat value={bank.totalMinutes} label="Minutes banked" delay={0.1} />
          <Stat value={bank.sessions.length} label="Spins" delay={0.2} />
          <Stat value={bank.currentStreak} label="Day streak" delay={0.3} />
          <Stat value={`${overall}%`} label="Overall progress" delay={0.4} />
        </div>

        <motion.section className="hearth-page__section" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}>
          <h2>Last four weeks</h2>
          <div className="hearth-page__sparkline" role="img" aria-label="Daily learning minutes for the last 28 days">
            {daily.map((d, i) => {
              const h = Math.round((d.minutes / maxDay) * 100);
              const today = i === daily.length - 1;
              return (
                <span
                  key={i}
                  className={`hearth-page__day${today ? ' is-today' : ''}${d.minutes > 0 ? ' is-active' : ''}`}
                  style={{ '--h': `${h}%` }}
                  title={`${d.date.toLocaleDateString()} — ${d.minutes.toFixed(1)} min`}
                />
              );
            })}
          </div>
          <div className="hearth-page__legend">
            <span>4 weeks ago</span>
            <span>today</span>
          </div>
        </motion.section>

        <motion.section className="hearth-page__section" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}>
          <h2>Journey</h2>
          <div className="hearth-page__journey">
            {modules.map((m) => {
              const mp = moduleProgress[m.id] || {};
              const avg = Math.round(((mp.pulse || 0) + (mp.vision || 0) + (mp.core || 0)) / 3);
              return (
                <Link key={m.id} to={`/modules/${m.id}`} className="hearth-page__journey-row">
                  <span className="hearth-page__journey-icon">{m.icon}</span>
                  <span className="hearth-page__journey-title">
                    <strong>{m.title}</strong>
                    <small>{m.subtitle}</small>
                  </span>
                  <span className="hearth-page__journey-bar">
                    <span className="hearth-page__journey-fill" style={{ width: `${avg}%` }} />
                  </span>
                  <span className="hearth-page__journey-pct">{avg}%</span>
                </Link>
              );
            })}
          </div>
        </motion.section>

        <motion.section className="hearth-page__section" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}>
          <h2>Clarity badges <small>{earned.length}/{BADGES.length}</small></h2>
          <div className="hearth-page__badges">
            {BADGES.map((b) => {
              const isEarned = earned.some((e) => e.id === b.id);
              return (
                <div key={b.id} className={`hearth-page__badge${isEarned ? ' earned' : ''}`} title={b.label}>
                  <span className="hearth-page__badge-icon">{b.icon}</span>
                  <span className="hearth-page__badge-label">{b.label}</span>
                </div>
              );
            })}
          </div>
        </motion.section>

        <motion.section className="hearth-page__section" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }}>
          <h2>Recent spins</h2>
          {recent.length === 0 ? (
            <div className="hearth-page__empty-state">
              <p>No spins yet. Pick a module and breathe into it.</p>
              <Link to="/modules" className="button button--primary">Open a module</Link>
            </div>
          ) : (
            <ul className="hearth-page__timeline">
              {recent.map((s, i) => {
                const mod = modules.find((m) => m.id === s.moduleId);
                return (
                  <li key={i} className="hearth-page__timeline-item">
                    <span className="hearth-page__timeline-icon">{mod?.icon || '✨'}</span>
                    <span>
                      <strong>{mod?.title || `Module ${s.moduleId}`}</strong>
                      <small> · {s.stream} · {Number(s.duration).toFixed(1)} min</small>
                    </span>
                    <time dateTime={s.timestamp}>{new Date(s.timestamp).toLocaleString()}</time>
                  </li>
                );
              })}
            </ul>
          )}
        </motion.section>

        <motion.section className="hearth-page__section" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.7 }}>
          <h2>Good questions</h2>
          <p className="hearth-page__section-desc">Questions you marked as illuminating.</p>
          {bank.goodQuestions.length === 0 ? (
            <div className="hearth-page__empty-state">
              <p>✨ Your good questions will appear here as you explore.</p>
            </div>
          ) : (
            <ul className="hearth-page__questions">
              {bank.goodQuestions.slice(0, 12).map((q, i) => (
                <li key={i}>
                  <blockquote>{q.text}</blockquote>
                  <small>
                    {q.moduleId ? `Module ${q.moduleId} · ` : ''}
                    {new Date(q.timestamp).toLocaleDateString()}
                  </small>
                </li>
              ))}
            </ul>
          )}
        </motion.section>
      </div>
    </div>
  );
}

function Stat({ value, label, delay }) {
  return (
    <motion.div
      className="hearth-page__stat glass"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
    >
      <span className="hearth-page__stat-value">{value}</span>
      <span className="hearth-page__stat-label">{label}</span>
    </motion.div>
  );
}
