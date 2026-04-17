/**
 * @file GlossaryTermsLine.jsx — Inline key term links from the module registry
 * @module modules/shared/GlossaryTermsLine
 */
import GlossaryLink from '../../components/interactive/GlossaryLink';
import { getModuleById } from '../../data/modules';
import './GlossaryTermsLine.css';

/**
 * @param {Object} props
 * @param {number} props.moduleId
 * @param {number} [props.max=4]
 */
export default function GlossaryTermsLine({ moduleId, max = 4 }) {
  const mod = getModuleById(moduleId);
  const keys = (mod.glossary || []).slice(0, max);
  if (keys.length === 0) return null;

  return (
    <p className="glossary-terms-line">
      <span className="glossary-terms-line__label">Key terms</span>
      {keys.map((k, i) => (
        <span key={k} className="glossary-terms-line__item">
          {i > 0 ? <span aria-hidden="true"> · </span> : ' '}
          <GlossaryLink glossaryKey={k} />
        </span>
      ))}
    </p>
  );
}
