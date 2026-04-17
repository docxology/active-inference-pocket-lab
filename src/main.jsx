/**
 * @file main.jsx — Application Entry Point
 * @description Mounts the React app, imports global styles, and registers
 * the service worker for offline-first behavior (production only).
 */
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import './styles/global.css';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
);

// Register the service worker in production to enable offline learning.
if ('serviceWorker' in navigator && import.meta.env.PROD) {
  window.addEventListener('load', () => {
    navigator.serviceWorker
      .register('/sw.js', { scope: '/' })
      .catch((err) => console.warn('[SW] registration failed:', err));
  });
}
