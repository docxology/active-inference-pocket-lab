/**
 * @file MathBlock.jsx — LaTeX Equation Renderer
 * @description Renders mathematical equations using KaTeX.
 * Supports collapsible derivation steps for the Core stream.
 *
 * @module components/interactive/MathBlock
 */
import { useMemo, useState } from 'react';
import katex from 'katex';
import 'katex/dist/katex.min.css';
import './MathBlock.css';

/**
 * MathBlock — Renders a LaTeX equation with optional derivation steps.
 *
 * @param {Object} props
 * @param {string} props.latex - LaTeX string to render
 * @param {boolean} [props.displayMode=true] - Display mode (block) vs inline
 * @param {string} [props.label] - Equation label/number
 * @param {string} [props.description] - Plain text description
 * @param {Array<{latex: string, note: string}>} [props.steps] - Derivation steps
 * @returns {JSX.Element}
 */
export default function MathBlock({ latex, displayMode = true, label, description, steps }) {
  const [stepsOpen, setStepsOpen] = useState(false);

  const { html: mainHtml, error: mainError } = useMemo(() => {
    if (!latex) return { html: '', error: null };
    try {
      const html = katex.renderToString(latex, {
        displayMode,
        throwOnError: false,
        errorColor: 'var(--color-error)',
        trust: true,
      });
      return { html, error: null };
    } catch (err) {
      console.error('[MathBlock] KaTeX render error:', err.message);
      return { html: '', error: err.message };
    }
  }, [latex, displayMode]);

  return (
    <div className="math-block">
      {label && <span className="math-block__label">{label}</span>}

      <div
        className="math-block__equation"
        aria-label={`Mathematical equation: ${description || latex}`}
        dangerouslySetInnerHTML={{ __html: mainHtml }}
      />

      {mainError && <p className="math-block__error">⚠️ Render error: {mainError}</p>}

      {description && <p className="math-block__description">{description}</p>}

      {steps && steps.length > 0 && (
        <div className="math-block__steps">
          <button
            type="button"
            className="math-block__steps-toggle"
            onClick={() => setStepsOpen(!stepsOpen)}
            aria-expanded={stepsOpen}
          >
            {stepsOpen ? '▾ Hide derivation' : '▸ Show derivation steps'}
            <span className="math-block__step-count">({steps.length} steps)</span>
          </button>

          {stepsOpen && (
            <ol className="math-block__steps-list">
              {steps.map((step, i) => (
                <DerivationStep key={i} step={step} index={i} />
              ))}
            </ol>
          )}
        </div>
      )}
    </div>
  );
}

/**
 * DerivationStep — Single step in a derivation.
 * @param {Object} props
 * @param {Object} props.step - { latex, note }
 * @param {number} props.index - Step index
 */
function DerivationStep({ step, index }) {
  const html = useMemo(() => {
    if (!step.latex) return '';
    try {
      return katex.renderToString(step.latex, {
        displayMode: true,
        throwOnError: false,
      });
    } catch (err) {
      console.error(`[MathBlock] Step ${index} render error:`, err.message);
      return '';
    }
  }, [step.latex, index]);

  return (
    <li className="math-block__step">
      <div className="math-block__step-equation" dangerouslySetInnerHTML={{ __html: html }} />
      {step.note && <p className="math-block__step-note">{step.note}</p>}
    </li>
  );
}
