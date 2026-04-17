/**
 * @file GlossaryPage.jsx — Full searchable glossary
 * @description Every term, every cross-link, wired to the module registry.
 * @module pages/GlossaryPage
 */
import { useEffect, useMemo, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { getAllGlossary } from '../data/glossary';
import { getModuleBySlug } from '../data/modules';
import './GlossaryPage.css';

export default function GlossaryPage() {
  const location = useLocation();
  const [query, setQuery] = useState('');
  const entries = useMemo(() => getAllGlossary(), []);
  const q = query.trim().toLowerCase();
  const filtered = useMemo(
    () =>
      entries.filter((e) => {
        if (!q) return true;
        const hay = `${e.term} ${e.short} ${e.formal || ''}`.toLowerCase();
        return hay.includes(q);
      }),
    [entries, q],
  );
  const letters = useMemo(() => {
    const byLetter = {};
    for (const e of filtered) {
      const L = (e.term[0] || '#').toUpperCase();
      byLetter[L] = byLetter[L] || [];
      byLetter[L].push(e);
    }
    return Object.keys(byLetter)
      .sort()
      .map((L) => ({ L, items: byLetter[L].sort((a, b) => a.term.localeCompare(b.term)) }));
  }, [filtered]);

  useEffect(() => {
    const raw = location.hash?.replace(/^#/, '') || '';
    if (!raw || raw.startsWith('gl-')) return;
    const el = document.getElementById(raw);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, [location.hash, filtered]);

  return (
    <div className="page glossary-page">
      <div className="container">
        <header className="glossary-page__header">
          <h1>Glossary</h1>
          <p className="glossary-page__sub">
            The technical vocabulary of active inference, cross-linked to the modules where each
            concept lives.
          </p>
          <label className="glossary-page__search">
            <span className="sr-only">Search</span>
            <input
              type="search"
              placeholder="Search terms, e.g. 'precision'…"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
          </label>
          <div className="glossary-page__meta">
            Showing {filtered.length} / {entries.length} terms
          </div>
        </header>

        <div className="glossary-page__jumps">
          {letters.map(({ L }) => (
            <a key={L} href={`#gl-${L}`} className="glossary-page__jump">
              {L}
            </a>
          ))}
        </div>

        <div className="glossary-page__list">
          {letters.map(({ L, items }) => (
            <section key={L} id={`gl-${L}`} className="glossary-page__section">
              <h2 className="glossary-page__letter">{L}</h2>
              <ul>
                {items.map((entry) => (
                  <li key={entry.key} id={entry.key} className="glossary-page__item">
                    <h3 className="glossary-page__term">{entry.term}</h3>
                    <p className="glossary-page__short">{entry.short}</p>
                    {entry.formal && (
                      <p className="glossary-page__formal">
                        <code>{entry.formal}</code>
                      </p>
                    )}
                    {entry.relatedModules?.length > 0 && (
                      <div className="glossary-page__links">
                        {entry.relatedModules.map((slug) => {
                          const mod = getModuleBySlug(slug);
                          if (!mod) return null;
                          return (
                            <Link
                              key={slug}
                              to={`/modules/${mod.id}`}
                              className="glossary-page__link"
                            >
                              {mod.icon} {mod.title}
                            </Link>
                          );
                        })}
                      </div>
                    )}
                  </li>
                ))}
              </ul>
            </section>
          ))}
        </div>
      </div>
    </div>
  );
}
