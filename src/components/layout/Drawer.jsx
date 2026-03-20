/**
 * @file Drawer.jsx — Physics-Based Slide-Out Drawer
 * @description Implements the "Physics of the Drawer" philosophy.
 * Uses spring animations for spatial reality — never teleports the user.
 * Used for Core math content, settings, and detailed information.
 * 
 * @module components/layout/Drawer
 */
import { motion, AnimatePresence } from 'framer-motion';
import './Drawer.css';

/**
 * Drawer — Slide-up drawer with physics-based spring animation.
 * 
 * @param {Object} props
 * @param {boolean} props.isOpen - Whether drawer is visible
 * @param {Function} props.onClose - Callback to close the drawer
 * @param {string} [props.title] - Drawer header title
 * @param {React.ReactNode} props.children - Drawer content
 * @returns {JSX.Element}
 */
export default function Drawer({ isOpen, onClose, title, children }) {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Overlay */}
          <motion.div
            className="drawer__overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={onClose}
            aria-hidden="true"
          />

          {/* Drawer Panel */}
          <motion.div
            className="drawer"
            role="dialog"
            aria-modal="true"
            aria-label={title || 'Drawer'}
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{
              type: 'spring',
              stiffness: 300,
              damping: 30,
              mass: 0.8,
            }}
          >
            {/* Handle */}
            <div className="drawer__handle-area" onClick={onClose}>
              <span className="drawer__handle" />
            </div>

            {/* Header */}
            {title && (
              <header className="drawer__header">
                <h3 className="drawer__title">{title}</h3>
                <button
                  className="drawer__close"
                  onClick={onClose}
                  aria-label="Close drawer"
                >
                  ✕
                </button>
              </header>
            )}

            {/* Content */}
            <div className="drawer__content">
              {children}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
