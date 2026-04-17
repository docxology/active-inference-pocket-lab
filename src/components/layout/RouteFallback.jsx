/**
 * @file RouteFallback.jsx — Suspense Fallback
 * @description Minimal, reduced-motion-safe loading view for lazy routes.
 * Shows a subtle orbit glyph + "Loading…" label. Honors prefers-reduced-motion
 * by omitting the spin animation (handled in global.css).
 *
 * @module components/layout/RouteFallback
 */
import './RouteFallback.css';

/**
 * RouteFallback — Shown while a lazy route chunk is fetching.
 * @returns {JSX.Element}
 */
export default function RouteFallback() {
  return (
    <div className="route-fallback" role="status" aria-live="polite">
      <span className="route-fallback__glyph" aria-hidden="true">
        🌀
      </span>
      <span className="route-fallback__label">Loading…</span>
    </div>
  );
}
