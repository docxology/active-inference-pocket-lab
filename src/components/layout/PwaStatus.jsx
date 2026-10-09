import { useEffect, useState } from 'react';
import './PwaStatus.css';

/** Show offline status and offer an explicit update once a new complete bundle is installed. */
export default function PwaStatus() {
  const [online, setOnline] = useState(() => navigator.onLine);
  const [waiting, setWaiting] = useState(null);
  const [offlineReady, setOfflineReady] = useState(false);
  useEffect(() => {
    const updateOnline = () => setOnline(navigator.onLine);
    window.addEventListener('online', updateOnline);
    window.addEventListener('offline', updateOnline);
    return () => {
      window.removeEventListener('online', updateOnline);
      window.removeEventListener('offline', updateOnline);
    };
  }, []);
  useEffect(() => {
    if (!import.meta.env.PROD || !('serviceWorker' in navigator)) return;
    let active = true;
    let registration;
    const updateFound = () => {
      const worker = registration.installing;
      worker?.addEventListener('statechange', () => {
        if (!active || worker.state !== 'installed') return;
        if (navigator.serviceWorker.controller) setWaiting(registration.waiting);
      });
    };
    navigator.serviceWorker
      .register('/sw.js', { scope: '/', updateViaCache: 'none' })
      .then((reg) => {
        if (!active) return;
        registration = reg;
        setWaiting(reg.waiting);
        reg.addEventListener('updatefound', updateFound);
        return navigator.serviceWorker.ready.then(() => {
          if (active) setOfflineReady(true);
        });
      })
      .catch((error) => console.warn('[PwaStatus] Offline installation failed:', error.message));
    return () => {
      active = false;
      registration?.removeEventListener('updatefound', updateFound);
    };
  }, []);
  if (online && !waiting) return null;
  return (
    <aside className="pwa-status" aria-label="Lab connection">
      {!online && (
        <p role="status">
          {offlineReady
            ? 'Offline · your lab and progress stay on this device.'
            : 'Offline · some activities may need a connection.'}
        </p>
      )}
      {waiting && (
        <button
          onClick={() => {
            navigator.serviceWorker.addEventListener(
              'controllerchange',
              () => window.location.reload(),
              { once: true },
            );
            waiting.postMessage({ type: 'SKIP_WAITING' });
          }}
        >
          Update available · reload lab
        </button>
      )}
    </aside>
  );
}
