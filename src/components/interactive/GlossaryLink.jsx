/**
 * @file GlossaryLink.jsx — Inline link to a glossary entry by stable key
 * @module components/interactive/GlossaryLink
 */
import { Link } from 'react-router-dom';
import { getGlossaryEntry } from '../../data/glossary';
import './GlossaryLink.css';

/**
 * @param {Object} props
 * @param {string} props.glossaryKey - Key in glossary.js / modules.js `glossary` arrays
 * @param {React.ReactNode} [props.children] - Override label (defaults to term title)
 * @param {string} [props.className]
 */
export default function GlossaryLink({ glossaryKey, children, className = '' }) {
  const def = getGlossaryEntry(glossaryKey);
  const label = children ?? def?.term ?? glossaryKey;
  const title = def?.short ? `${def.term}: ${def.short}` : `Glossary: ${glossaryKey}`;

  return (
    <Link
      to={`/glossary#${glossaryKey}`}
      className={`glossary-link ${className}`.trim()}
      title={title}
    >
      {label}
    </Link>
  );
}
