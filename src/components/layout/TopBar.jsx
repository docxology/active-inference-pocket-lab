/**
 * @file TopBar.jsx — Minimal top bar
 * @description Brand mark plus quick links to Search, Glossary, Settings.
 * Kept intentionally slim to preserve mobile screen real estate.
 * @module components/layout/TopBar
 */
import { Link, useLocation } from 'react-router-dom';
import './TopBar.css';

const QUICK = [
  { to: '/search', icon: '🔎', label: 'Search' },
  { to: '/glossary', icon: '📖', label: 'Glossary' },
  { to: '/settings', icon: '⚙️', label: 'Settings' },
];

export default function TopBar() {
  const loc = useLocation();
  const isModule = loc.pathname.startsWith('/modules/');
  if (isModule) return null;

  return (
    <header className="topbar" role="banner">
      <Link to="/" className="topbar__brand" aria-label="Spin — home">
        <span className="topbar__spin" aria-hidden>🌀</span>
        <span className="topbar__name">Spin</span>
      </Link>
      <nav className="topbar__quick" aria-label="Quick links">
        {QUICK.map((q) => (
          <Link
            key={q.to}
            to={q.to}
            className={`topbar__quick-item${loc.pathname === q.to ? ' is-active' : ''}`}
            aria-label={q.label}
          >
            <span aria-hidden>{q.icon}</span>
          </Link>
        ))}
      </nav>
    </header>
  );
}
