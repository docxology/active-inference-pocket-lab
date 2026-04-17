/**
 * @file SearchPage.jsx — App-wide search
 * @description Fuzzy search across modules, glossary, and streams.
 * @module pages/SearchPage
 */
import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { modules } from '../data/modules';
import { getAllGlossary } from '../data/glossary';
import './SearchPage.css';

function score(hay, q) {
  const h = hay.toLowerCase();
  const n = q.toLowerCase();
  if (!n) return 0;
  if (h === n) return 100;
  if (h.startsWith(n)) return 80;
  if (h.includes(n)) return 40;
  // simple substring char density
  let hits = 0;
  let j = 0;
  for (const c of h) {
    if (j < n.length && c === n[j]) {
      hits++;
      j++;
    }
  }
  return j === n.length ? 20 + hits / h.length : 0;
}

export default function SearchPage() {
  const [query, setQuery] = useState('');
  const q = query.trim();

  const results = useMemo(() => {
    if (!q) return { modules: [], glossary: [] };
    const modScored = modules
      .map((m) => ({
        item: m,
        score:
          score(m.title, q) +
          score(m.subtitle || '', q) * 0.5 +
          score((m.tags || []).join(' '), q) * 0.7,
      }))
      .filter((r) => r.score > 0)
      .sort((a, b) => b.score - a.score)
      .slice(0, 12);

    const glScored = getAllGlossary()
      .map((g) => ({
        item: g,
        score: score(g.term, q) + score(g.short, q) * 0.5 + score(g.formal || '', q) * 0.3,
      }))
      .filter((r) => r.score > 0)
      .sort((a, b) => b.score - a.score)
      .slice(0, 20);

    return { modules: modScored, glossary: glScored };
  }, [q]);

  return (
    <div className="page search-page">
      <div className="container">
        <header className="search-page__header">
          <h1>Search</h1>
          <input
            className="search-page__input"
            type="search"
            placeholder="free energy, precision, policy…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            autoFocus
          />
        </header>

        {!q && (
          <div className="search-page__empty">
            <p>
              Try: <em>free energy</em>, <em>Markov blanket</em>, <em>precision</em>,{' '}
              <em>policy</em>.
            </p>
          </div>
        )}

        {q && results.modules.length === 0 && results.glossary.length === 0 && (
          <div className="search-page__empty">
            <p>
              No matches. Try a simpler term or search the <Link to="/glossary">glossary</Link>.
            </p>
          </div>
        )}

        {results.modules.length > 0 && (
          <section className="search-page__section">
            <h2>Modules</h2>
            <ul>
              {results.modules.map(({ item }) => (
                <li key={item.id} className="search-page__item">
                  <Link to={`/modules/${item.id}`} className="search-page__link">
                    <span className="search-page__icon">{item.icon}</span>
                    <span>
                      <strong>{item.title}</strong>
                      <small>{item.subtitle}</small>
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        )}

        {results.glossary.length > 0 && (
          <section className="search-page__section">
            <h2>Glossary</h2>
            <ul>
              {results.glossary.map(({ item }) => (
                <li key={item.key} className="search-page__item">
                  <Link
                    to={`/glossary#gl-${(item.term[0] || '#').toUpperCase()}`}
                    className="search-page__link"
                  >
                    <strong>{item.term}</strong>
                    <small>{item.short}</small>
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        )}
      </div>
    </div>
  );
}
