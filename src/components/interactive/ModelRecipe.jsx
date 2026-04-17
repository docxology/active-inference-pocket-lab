/**
 * @file ModelRecipe.jsx — A, B, C, D, E ingredient explorer
 * @description Card-based recipe for building a discrete POMDP. Lets the user
 * flip between ingredients and see a plain-language explanation alongside a
 * small matrix preview. Used by Module 6 (Designing Models).
 *
 * @module components/interactive/ModelRecipe
 */
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import './ModelRecipe.css';

/**
 * @typedef {Object} Ingredient
 * @property {string} symbol
 * @property {string} name
 * @property {string} plain
 * @property {string} formal
 * @property {number[][]} matrix
 * @property {string[]} rowLabels
 * @property {string[]} colLabels
 */

/** @type {Ingredient[]} */
const INGREDIENTS = [
  {
    symbol: 'A',
    name: 'Likelihood',
    plain: 'How hidden states appear — what you would see in each world.',
    formal: 'A[o, s] = p(o | s)',
    matrix: [
      [0.8, 0.1, 0.1],
      [0.1, 0.8, 0.1],
      [0.1, 0.1, 0.8],
    ],
    rowLabels: ['o=red', 'o=green', 'o=blue'],
    colLabels: ['s=a', 's=b', 's=c'],
  },
  {
    symbol: 'B',
    name: 'Transitions',
    plain: "How the world moves — what you believe happens next, given an action.",
    formal: "B[s', s, u] = p(s' | s, u)",
    matrix: [
      [0.9, 0.05, 0.05],
      [0.05, 0.9, 0.05],
      [0.05, 0.05, 0.9],
    ],
    rowLabels: ["s'=a", "s'=b", "s'=c"],
    colLabels: ['s=a', 's=b', 's=c'],
  },
  {
    symbol: 'C',
    name: 'Preferences',
    plain: 'Which observations you want to see — your bias toward goal states.',
    formal: 'C[o] = log p̃(o)',
    matrix: [[2], [0], [-1]],
    rowLabels: ['o=red', 'o=green', 'o=blue'],
    colLabels: ['C'],
  },
  {
    symbol: 'D',
    name: 'Prior',
    plain: 'Where the world starts — what you believe at time 0.',
    formal: 'D[s] = p(s₀)',
    matrix: [[0.33], [0.33], [0.34]],
    rowLabels: ['s=a', 's=b', 's=c'],
    colLabels: ['D'],
  },
  {
    symbol: 'E',
    name: 'Habits',
    plain: 'A prior over policies. Shortcuts your planner can take.',
    formal: 'E[π]',
    matrix: [[0.2], [0.5], [0.3]],
    rowLabels: ['π₁', 'π₂', 'π₃'],
    colLabels: ['E'],
  },
];

/**
 * ModelRecipe — recipe navigator.
 */
export default function ModelRecipe() {
  const [idx, setIdx] = useState(0);
  const ing = INGREDIENTS[idx];

  return (
    <div className="model-recipe">
      <nav className="model-recipe__tabs" role="tablist">
        {INGREDIENTS.map((ing, i) => (
          <button
            key={ing.symbol}
            role="tab"
            aria-selected={i === idx}
            className={`model-recipe__tab ${i === idx ? 'active' : ''}`}
            onClick={() => setIdx(i)}
          >
            <span className="model-recipe__tab-symbol">{ing.symbol}</span>
            <span className="model-recipe__tab-name">{ing.name}</span>
          </button>
        ))}
      </nav>

      <AnimatePresence mode="wait">
        <motion.div
          key={ing.symbol}
          className="model-recipe__card"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.25 }}
        >
          <h4 className="model-recipe__title">
            <span className="model-recipe__title-symbol">{ing.symbol}</span>
            <span>— {ing.name}</span>
          </h4>
          <p className="model-recipe__plain">{ing.plain}</p>
          <p className="model-recipe__formal">{ing.formal}</p>
          <table className="model-recipe__matrix">
            <thead>
              <tr>
                <th />
                {ing.colLabels.map((c) => (
                  <th key={c}>{c}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {ing.matrix.map((row, r) => (
                <tr key={r}>
                  <th scope="row">{ing.rowLabels[r]}</th>
                  {row.map((v, c) => (
                    <td
                      key={c}
                      style={{
                        background: `rgba(124,107,255,${Math.min(1, Math.max(0, v))})`,
                      }}
                    >
                      {v.toFixed(2)}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
