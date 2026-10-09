/**
 * @file Drawer.jsx — Physics-Based Slide-Out Drawer
 * @description Implements the "Physics of the Drawer" philosophy.
 * Uses spring animations for spatial reality — never teleports the user.
 * Used for Core math content, settings, and detailed information.
 *
 * @module components/layout/Drawer
 */
import { motion, AnimatePresence } from 'framer-motion';
import { useEffect, useRef, useEffectEvent } from 'react';
import { createPortal } from 'react-dom';
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
  const panelRef = useRef(null);
  const close = useEffectEvent(onClose);
  useEffect(() => {
    if (!isOpen) return;
    const previousFocus = document.activeElement;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const root = document.getElementById('root');
    const wasInert = root?.inert;
    if (root) root.inert = true;
    const panel = panelRef.current;
    const focusable = () =>
      [
        ...panel.querySelectorAll('button, a[href], input, select, textarea, [tabindex="0"]'),
      ].filter((element) => !element.disabled);
    (focusable()[0] || panel).focus();
    const handleKey = (event) => {
      if (event.key === 'Escape') {
        event.preventDefault();
        close();
      }
      if (event.key !== 'Tab') return;
      const elements = focusable();
      const first = elements[0] || panel;
      const last = elements.at(-1) || panel;
      if (
        event.shiftKey &&
        (document.activeElement === first || document.activeElement === panel)
      ) {
        event.preventDefault();
        last.focus();
      } else if (
        !event.shiftKey &&
        (document.activeElement === last || document.activeElement === panel)
      ) {
        event.preventDefault();
        first.focus();
      }
    };
    panel.addEventListener('keydown', handleKey);
    return () => {
      panel.removeEventListener('keydown', handleKey);
      document.body.style.overflow = previousOverflow;
      if (root) root.inert = wasInert;
      if (previousFocus?.isConnected) previousFocus.focus();
    };
  }, [isOpen]);
  return createPortal(
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
            ref={panelRef}
            tabIndex={-1}
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
            <div className="drawer__handle-area" aria-hidden="true">
              <span className="drawer__handle" />
            </div>

            {/* Header */}
            <header className="drawer__header">
              <h3 className="drawer__title">{title || 'Drawer'}</h3>
              <button className="drawer__close" onClick={onClose} aria-label="Close drawer">
                ✕
              </button>
            </header>

            {/* Content */}
            <div className="drawer__content">{children}</div>
          </motion.div>
        </>
      )}
    </AnimatePresence>,
    document.body,
  );
}
