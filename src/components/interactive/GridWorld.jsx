/**
 * @file GridWorld.jsx — Discrete active-inference grid simulator
 * @description Small grid-world where an agent minimises expected free energy
 * to reach a goal while resolving uncertainty about foggy tiles. Used by
 * Module 7 (Discrete Worlds).
 *
 * @module components/interactive/GridWorld
 */
import { useState, useMemo, useCallback, useEffect, useRef } from 'react';
import { softmax } from '../../utils/activeInference';
import './GridWorld.css';

/**
 * @typedef {Object} GridCell
 * @property {number} x
 * @property {number} y
 * @property {boolean} goal
 * @property {boolean} fog
 */

const ACTIONS = [
  { name: 'up', dx: 0, dy: -1, label: '↑' },
  { name: 'right', dx: 1, dy: 0, label: '→' },
  { name: 'down', dx: 0, dy: 1, label: '↓' },
  { name: 'left', dx: -1, dy: 0, label: '←' },
  { name: 'stay', dx: 0, dy: 0, label: '·' },
];

/**
 * Manhattan distance.
 */
function dist(a, b) {
  return Math.abs(a.x - b.x) + Math.abs(a.y - b.y);
}

/**
 * Build an initial 4×4 grid with one goal and two fog tiles.
 */
function defaultGrid(size = 4) {
  const cells = [];
  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      cells.push({
        x,
        y,
        goal: x === size - 1 && y === size - 1,
        fog: (x === 1 && y === 2) || (x === 2 && y === 1),
      });
    }
  }
  return cells;
}

/**
 * GridWorld — Active-inference agent in a 4×4 grid.
 *
 * @param {Object} props
 * @param {number} [props.size=4]
 * @param {number} [props.risk=1] - risk weight on goal seeking (pragmatic value)
 * @param {number} [props.ambiguity=1] - ambiguity weight (epistemic drive)
 * @param {boolean} [props.running=true]
 * @returns {JSX.Element}
 */
export default function GridWorld({ size = 4, risk = 1, ambiguity = 1, running = true }) {
  const [grid] = useState(() => defaultGrid(size));
  const [agent, setAgent] = useState({ x: 0, y: 0 });
  const [revealed, setRevealed] = useState(() => new Set());
  const [trail, setTrail] = useState([]);
  const [stepNo, setStepNo] = useState(0);
  const intervalRef = useRef(null);

  const goal = useMemo(() => grid.find((c) => c.goal), [grid]);

  // Compute EFE for each action from the agent's current tile.
  const scores = useMemo(() => {
    if (!goal) return [];
    return ACTIONS.map((a) => {
      const nx = Math.max(0, Math.min(size - 1, agent.x + a.dx));
      const ny = Math.max(0, Math.min(size - 1, agent.y + a.dy));
      const next = grid.find((c) => c.x === nx && c.y === ny);
      if (!next) return { action: a, G: Infinity };
      const riskTerm = dist({ x: nx, y: ny }, goal); // low when close to goal
      const fogTerm = next.fog && !revealed.has(`${nx},${ny}`) ? -1.5 : 0; // bonus for exploring fog
      const G = risk * riskTerm + ambiguity * fogTerm;
      return { action: a, G, nx, ny };
    });
  }, [agent, grid, revealed, risk, ambiguity, goal, size]);

  // Policy distribution: softmax over -G (lower G = higher probability).
  const policy = useMemo(() => {
    const gs = scores.map((s) => -s.G);
    return softmax(gs);
  }, [scores]);

  const reachedGoal = agent.x === goal?.x && agent.y === goal?.y;

  // Step loop
  useEffect(() => {
    if (!running || reachedGoal) {
      if (intervalRef.current) clearInterval(intervalRef.current);
      return;
    }
    intervalRef.current = setInterval(() => {
      // Pick action argmax (deterministic for smooth demo).
      const best = scores.reduce((best, s) => (s.G < best.G ? s : best), { G: Infinity });
      if (!best || best.G === Infinity) return;
      setAgent({ x: best.nx, y: best.ny });
      setTrail((t) => [...t.slice(-20), { x: best.nx, y: best.ny }]);
      setRevealed((r) => {
        const n = new Set(r);
        n.add(`${best.nx},${best.ny}`);
        return n;
      });
      setStepNo((s) => s + 1);
    }, 650);
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [running, scores, reachedGoal]);

  const reset = useCallback(() => {
    setAgent({ x: 0, y: 0 });
    setRevealed(new Set());
    setTrail([]);
    setStepNo(0);
  }, []);

  return (
    <div className="grid-world">
      <div
        className="grid-world__board"
        style={{ gridTemplateColumns: `repeat(${size}, 1fr)` }}
        role="img"
        aria-label="Active inference grid world"
      >
        {grid.map((cell) => {
          const isAgent = cell.x === agent.x && cell.y === agent.y;
          const isGoal = cell.goal;
          const fogHidden = cell.fog && !revealed.has(`${cell.x},${cell.y}`);
          const onTrail = trail.some((t) => t.x === cell.x && t.y === cell.y);
          return (
            <div
              key={`${cell.x}-${cell.y}`}
              className={[
                'grid-world__cell',
                isGoal ? 'goal' : '',
                fogHidden ? 'fog' : '',
                onTrail ? 'trail' : '',
                isAgent ? 'agent' : '',
              ]
                .filter(Boolean)
                .join(' ')}
            >
              {isGoal && !isAgent && <span className="grid-world__icon">✦</span>}
              {isAgent && <span className="grid-world__icon">●</span>}
              {fogHidden && !isAgent && <span className="grid-world__icon">?</span>}
            </div>
          );
        })}
      </div>

      <div className="grid-world__policy">
        <span className="grid-world__policy-title">Policy q(π)</span>
        <div className="grid-world__policy-bars">
          {ACTIONS.map((a, i) => (
            <div key={a.name} className="grid-world__policy-item">
              <span className="grid-world__policy-label">{a.label}</span>
              <div className="grid-world__policy-track">
                <div
                  className="grid-world__policy-fill"
                  style={{ width: `${(policy[i] || 0) * 100}%` }}
                />
              </div>
              <span className="grid-world__policy-value">
                {((policy[i] || 0) * 100).toFixed(0)}%
              </span>
            </div>
          ))}
        </div>
      </div>

      <footer className="grid-world__footer">
        <span>step {stepNo}</span>
        <span>{reachedGoal ? '✦ reached — hearth kept' : 'thinking…'}</span>
        <button className="grid-world__reset" onClick={reset}>
          reset
        </button>
      </footer>
    </div>
  );
}
