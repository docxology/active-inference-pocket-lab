/**
 * @file GenerativeGraph.jsx — Hierarchical generative model diagram
 * @description SVG diagram showing a three-layer hierarchical model with
 * tunable precision. Used by Module 4 (Generative Architecture) and Module 5.
 *
 * @module components/interactive/GenerativeGraph
 */
import { useMemo } from 'react';
import './GenerativeGraph.css';

/**
 * @typedef {Object} GraphNode
 * @property {string} id
 * @property {string} label
 * @property {number} x
 * @property {number} y
 * @property {'obs'|'state'|'param'} kind
 */

const DEFAULT_NODES = [
  { id: 's3', label: 's³', x: 160, y: 40, kind: 'state' },
  { id: 's2', label: 's²', x: 80, y: 120, kind: 'state' },
  { id: 's2b', label: 's²′', x: 240, y: 120, kind: 'state' },
  { id: 's1', label: 's¹', x: 40, y: 200, kind: 'state' },
  { id: 's1b', label: 's¹′', x: 160, y: 200, kind: 'state' },
  { id: 's1c', label: 's¹″', x: 280, y: 200, kind: 'state' },
  { id: 'o1', label: 'o₁', x: 40, y: 280, kind: 'obs' },
  { id: 'o2', label: 'o₂', x: 160, y: 280, kind: 'obs' },
  { id: 'o3', label: 'o₃', x: 280, y: 280, kind: 'obs' },
];

const DEFAULT_EDGES = [
  ['s3', 's2'],
  ['s3', 's2b'],
  ['s2', 's1'],
  ['s2', 's1b'],
  ['s2b', 's1b'],
  ['s2b', 's1c'],
  ['s1', 'o1'],
  ['s1b', 'o2'],
  ['s1c', 'o3'],
];

/**
 * GenerativeGraph — Draw a hierarchical generative model.
 *
 * @param {Object} props
 * @param {number} [props.precision=1] - 0.2..2 visual thickness scaler.
 * @param {string} [props.highlight] - Optional node id to highlight.
 */
export default function GenerativeGraph({ precision = 1, highlight }) {
  const { nodes, edges } = useMemo(() => ({ nodes: DEFAULT_NODES, edges: DEFAULT_EDGES }), []);

  const nodeMap = useMemo(() => Object.fromEntries(nodes.map((n) => [n.id, n])), [nodes]);

  return (
    <div className="gen-graph" role="img" aria-label="Hierarchical generative model">
      <svg viewBox="0 0 320 320" className="gen-graph__svg">
        <defs>
          <marker
            id="arrow"
            viewBox="0 -5 10 10"
            refX="14"
            refY="0"
            markerWidth="6"
            markerHeight="6"
            orient="auto"
          >
            <path d="M0,-5 L10,0 L0,5" fill="var(--color-vision)" />
          </marker>
        </defs>

        {/* Edges */}
        {edges.map(([a, b]) => {
          const na = nodeMap[a];
          const nb = nodeMap[b];
          if (!na || !nb) return null;
          return (
            <line
              key={`${a}-${b}`}
              x1={na.x}
              y1={na.y}
              x2={nb.x}
              y2={nb.y}
              stroke="var(--color-vision)"
              strokeOpacity={0.35 + 0.25 * precision}
              strokeWidth={1 + precision}
              markerEnd="url(#arrow)"
            />
          );
        })}

        {/* Nodes */}
        {nodes.map((n) => {
          const isHi = highlight === n.id;
          const fill =
            n.kind === 'obs'
              ? 'var(--color-accent)'
              : n.kind === 'state'
                ? 'var(--color-vision)'
                : 'var(--color-core)';
          return (
            <g
              key={n.id}
              transform={`translate(${n.x}, ${n.y})`}
              className={`gen-graph__node ${isHi ? 'hi' : ''}`}
            >
              {n.kind === 'obs' ? (
                <rect x="-14" y="-14" width="28" height="28" rx="5" fill={fill} />
              ) : (
                <circle r="14" fill={fill} />
              )}
              <text
                textAnchor="middle"
                dominantBaseline="central"
                fontSize="11"
                fontFamily="var(--font-family-mono)"
                fill="var(--color-text-inverse)"
              >
                {n.label}
              </text>
            </g>
          );
        })}
      </svg>
      <div className="gen-graph__legend">
        <span>
          <span className="gen-graph__swatch state" /> hidden states
        </span>
        <span>
          <span className="gen-graph__swatch obs" /> observations
        </span>
      </div>
    </div>
  );
}
