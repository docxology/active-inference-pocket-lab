/**
 * @file AppShell.jsx — Main Application Shell
 * @description Mobile-first shell with bottom navigation and content area.
 * Wraps all pages with the BottomNav and optional StreamSwitcher.
 * 
 * @module components/layout/AppShell
 */
import { Outlet } from 'react-router-dom';
import BottomNav from './BottomNav';
import './AppShell.css';

/**
 * AppShell — Root layout wrapper for the application.
 * @returns {JSX.Element}
 */
export default function AppShell() {
  return (
    <div className="app-shell">
      <main className="app-shell__content">
        <Outlet />
      </main>
      <BottomNav />
    </div>
  );
}
