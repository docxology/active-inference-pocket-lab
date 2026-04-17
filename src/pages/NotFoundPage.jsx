/**
 * @file NotFoundPage.jsx — 404
 */
import { Link } from 'react-router-dom';

export default function NotFoundPage() {
  return (
    <div
      className="page"
      style={{ textAlign: 'center', padding: 'var(--space-2xl) var(--space-md)' }}
    >
      <div style={{ fontSize: 64 }}>🌀</div>
      <h1 style={{ marginTop: 'var(--space-md)' }}>Lost in the phase space</h1>
      <p
        style={{
          color: 'var(--color-text-secondary)',
          maxWidth: '40ch',
          margin: '0 auto var(--space-lg)',
        }}
      >
        This route isn't part of the generative model. Minimize surprise by returning home.
      </p>
      <div
        style={{
          display: 'flex',
          gap: 'var(--space-sm)',
          justifyContent: 'center',
          flexWrap: 'wrap',
        }}
      >
        <Link to="/" className="button button--primary">
          Home
        </Link>
        <Link to="/modules" className="button">
          Modules
        </Link>
        <Link to="/search" className="button">
          Search
        </Link>
      </div>
    </div>
  );
}
