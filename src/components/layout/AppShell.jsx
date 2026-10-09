/**
 * @file AppShell.jsx — Main Application Shell
 * @description Mobile-first shell with bottom navigation and content area.
 * Wraps all pages with the BottomNav and optional StreamSwitcher.
 *
 * @module components/layout/AppShell
 */
import { Outlet, useLocation } from 'react-router-dom';
import { useEffect, useRef } from 'react';
import StreamErrorBoundary from './StreamErrorBoundary';
import PwaStatus from './PwaStatus';
import BottomNav from './BottomNav';
import TopBar from './TopBar';
import './AppShell.css';

/**
 * AppShell — Root layout wrapper for the application.
 * @returns {JSX.Element}
 */
export default function AppShell() {
  const { pathname } = useLocation();
  const mainRef = useRef(null);
  const previousPath = useRef(pathname);
  useEffect(() => {
    if (previousPath.current === pathname) return;
    previousPath.current = pathname;
    window.scrollTo({ top: 0, behavior: 'instant' });
    mainRef.current.focus({ preventScroll: true });
  }, [pathname]);
  return (
    <div className="app-shell">
      <a className="app-shell__skip" href="#main-content">
        Skip to content
      </a>
      <TopBar />
      <PwaStatus />
      <main id="main-content" ref={mainRef} tabIndex={-1} className="app-shell__content">
        <StreamErrorBoundary key={pathname}>
          <Outlet />
        </StreamErrorBoundary>
      </main>
      <BottomNav />
    </div>
  );
}
