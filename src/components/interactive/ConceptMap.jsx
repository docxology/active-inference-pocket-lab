/**
 * @file ConceptMap.jsx — Interactive concept graph
 * @description Force-directed visualization of the main concepts covered
 * across all 10 modules. Tapping a node reveals its plain-language
 * definition. Used by Module 10 (The Whole Orbit).
 *
 * @module components/interactive/ConceptMap
 */
import { useEffect, useRef, useState } from 'react';
import { getGlossaryEntry } from '../../data/glossary';
import './ConceptMap.css';

/**
 * Node seed positions arranged by module affiliation (lightly clustered).
 */
const NODES = [
  { id: 'prior', x: 60, y: 60, mod: 1 },
  { id: 'posterior', x: 120, y: 40, mod: 2 },
  { id: 'likelihood', x: 180, y: 60, mod: 2 },
  { id: 'surprise', x: 240, y: 40, mod: 1 },
  { id: 'freeEnergy', x: 160, y: 140, mod: 3 },
  { id: 'kl', x: 80, y: 170, mod: 3 },
  { id: 'entropy', x: 240, y: 170, mod: 3 },
  { id: 'generativeModel', x: 60, y: 230, mod: 4 },
  { id: 'hierarchical', x: 160, y: 230, mod: 4 },
  { id: 'precision', x: 260, y: 230, mod: 4 },
  { id: 'predictiveCoding', x: 110, y: 300, mod: 5 },
  { id: 'messagePassing', x: 210, y: 300, mod: 5 },
  { id: 'matrixA', x: 60, y: 360, mod: 6 },
  { id: 'matrixB', x: 160, y: 360, mod: 6 },
  { id: 'expectedFreeEnergy', x: 260, y: 360, mod: 6 },
  { id: 'pomdp', x: 120, y: 420, mod: 7 },
  { id: 'policy', x: 220, y: 420, mod: 7 },
  { id: 'generalizedCoordinates', x: 60, y: 480, mod: 8 },
  { id: 'gradientFlow', x: 170, y: 480, mod: 8 },
  { id: 'modelEvidence', x: 270, y: 480, mod: 9 },
  { id: 'markovBlanket', x: 120, y: 540, mod: 10 },
  { id: 'selfEvidence', x: 220, y: 540, mod: 10 },
];

const EDGES = [
  ['prior', 'posterior'],
  ['posterior', 'likelihood'],
  ['likelihood', 'surprise'],
  ['surprise', 'freeEnergy'],
  ['freeEnergy', 'kl'],
  ['freeEnergy', 'entropy'],
  ['freeEnergy', 'generativeModel'],
  ['generativeModel', 'hierarchical'],
  ['hierarchical', 'precision'],
  ['precision', 'predictiveCoding'],
  ['predictiveCoding', 'messagePassing'],
  ['generativeModel', 'matrixA'],
  ['matrixA', 'matrixB'],
  ['matrixB', 'expectedFreeEnergy'],
  ['expectedFreeEnergy', 'pomdp'],
  ['pomdp', 'policy'],
  ['freeEnergy', 'gradientFlow'],
  ['gradientFlow', 'generalizedCoordinates'],
  ['expectedFreeEnergy', 'modelEvidence'],
  ['modelEvidence', 'markovBlanket'],
  ['markovBlanket', 'selfEvidence'],
  ['selfEvidence', 'freeEnergy'],
];

const MOD_COLORS = [
  '#ff6b6b', // 1
  '#7c6bff',
  '#6bcb77',
  '#ffb86b',
  '#ff6b6b',
  '#7c6bff',
  '#6bcb77',
  '#ffb86b',
  '#ff6b6b',
  '#7c6bff',
];

/**
 * ConceptMap — tap a node to learn its meaning.
 */
export default function ConceptMap() {
  const svgRef = useRef(null);
  const [selected, setSelected] = useState(null);
  const [positions, setPositions] = useState(NODES);

  // Very-light force simulation — just enough springiness to feel alive.
  useEffect(() => {
    let raf;
    let t = 0;
    function tick() {
      t += 1;
      if (t % 4 === 0) {
        setPositions((prev) =>
          prev.map((n) => ({
            ...n,
            x: n.x + Math.sin(t * 0.01 + n.y * 0.02) * 0.2,
            y: n.y + Math.cos(t * 0.01 + n.x * 0.02) * 0.2,
          })),
        );
      }
      raf = requestAnimationFrame(tick);
    }
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);

  const nodeMap = Object.fromEntries(positions.map((n) => [n.id, n]));
  const selNode = selected ? nodeMap[selected] : null;
  const entry = selected ? getGlossaryEntry(selected) : null;

  return (
    <div className="concept-map">
      <svg
        ref={svgRef}
        viewBox="0 0 320 600"
        className="concept-map__svg"
        role="img"
        aria-label="Concept map of active inference"
      >
        {EDGES.map(([a, b], i) => {
          const na = nodeMap[a];
          const nb = nodeMap[b];
          if (!na || !nb) return null;
          const isActive =
            selected && (selected === a || selected === b);
          return (
            <line
              key={i}
              x1={na.x}
              y1={na.y}
              x2={nb.x}
              y2={nb.y}
              stroke={isActive ? 'var(--color-accent)' : 'rgba(255,255,255,0.12)'}
              strokeWidth={isActive ? 1.5 : 1}
            />
          );
        })}
        {positions.map((n) => (
          <g
            key={n.id}
            transform={`translate(${n.x},${n.y})`}
            onClick={() => setSelected(n.id)}
            className={`concept-map__node ${selected === n.id ? 'sel' : ''}`}
            role="button"
            aria-label={`Concept: ${n.id}`}
          >
            <circle r="9" fill={MOD_COLORS[n.mod - 1]} opacity={0.85} />
            <text
              y="22"
              textAnchor="middle"
              fontSize="9"
              fill="var(--color-text-secondary)"
            >
              {n.id}
            </text>
          </g>
        ))}
      </svg>

      {entry && selNode && (
        <div className="concept-map__panel" role="status" aria-live="polite">
          <button
            className="concept-map__close"
            onClick={() => setSelected(null)}
            aria-label="Close definition"
          >
            ×
          </button>
          <h4>{entry.term}</h4>
          <p>{entry.short}</p>
          {entry.formal && <p className="concept-map__formal">{entry.formal}</p>}
          {entry.relatedModules?.length > 0 && (
            <p className="concept-map__hint">
              modules: {entry.relatedModules.join(', ')}
            </p>
          )}
        </div>
      )}

      {!entry && (
        <p className="concept-map__hint" style={{ textAlign: 'center' }}>
          tap a node to unfurl its meaning
        </p>
      )}
    </div>
  );
}
