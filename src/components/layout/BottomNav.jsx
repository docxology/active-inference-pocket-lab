/**
 * @file BottomNav.jsx — Mobile Bottom Navigation
 * @description Five-tab bottom navigation: Home, Modules, Hearth, Map, Pause.
 * Touch-optimized with 48px minimum targets.
 * 
 * @module components/layout/BottomNav
 */
import { useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import './BottomNav.css';

const NAV_ITEMS = [
  { path: '/',          label: 'Home',    icon: '🌀' },
  { path: '/modules',   label: 'Modules', icon: '📚' },
  { path: '/hearth',    label: 'Hearth',  icon: '🔥' },
  { path: '/map',       label: 'Map',     icon: '🗺️' },
  { path: '/pause',     label: 'Pause',   icon: '🌙' },
];

/**
 * BottomNav — Primary mobile navigation bar.
 * @returns {JSX.Element}
 */
export default function BottomNav() {
  const location = useLocation();
  const navigate = useNavigate();

  return (
    <nav className="bottom-nav glass" role="navigation" aria-label="Main navigation">
      {NAV_ITEMS.map((item) => {
        const isActive = location.pathname === item.path ||
          (item.path !== '/' && location.pathname.startsWith(item.path));

        return (
          <button
            key={item.path}
            id={`nav-${item.label.toLowerCase()}`}
            className={`bottom-nav__item ${isActive ? 'active' : ''}`}
            onClick={() => navigate(item.path)}
            aria-current={isActive ? 'page' : undefined}
            aria-label={item.label}
          >
            <span className="bottom-nav__icon">{item.icon}</span>
            <span className="bottom-nav__label">{item.label}</span>
            {isActive && (
              <motion.span
                className="bottom-nav__dot"
                layoutId="nav-dot"
                transition={{ type: 'spring', stiffness: 500, damping: 35 }}
              />
            )}
          </button>
        );
      })}
    </nav>
  );
}
