/**
 * @file GlossaryChips.jsx — Row of glossary term chips (for Pulse/Vision closers)
 * @module components/interactive/GlossaryChips
 */
import GlossaryLink from './GlossaryLink';
import { getGlossaryEntry } from '../../data/glossary';
import './GlossaryLink.css';

/**
 * @param {Object} props
 * @param {string[]} props.keys - Glossary keys to show (invalid keys skipped)
 * @param {string} [props.caption]
 */
export default function GlossaryChips({ keys, caption = 'Terms' }) {
  const valid = keys.filter((k) => getGlossaryEntry(k));
  if (valid.length === 0) return null;

  return (
    <div className="glossary-chips" role="navigation" aria-label="Glossary terms">
      <p className="glossary-chips__label">{caption}</p>
      <ul className="glossary-chips__list">
        {valid.map((k) => (
          <li key={k} className="glossary-chips__chip">
            <GlossaryLink glossaryKey={k} />
          </li>
        ))}
      </ul>
    </div>
  );
}
