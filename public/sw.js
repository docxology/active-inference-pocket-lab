/* Spin — minimal service worker
 * Cache-first for same-origin static assets, network-first for navigation.
 * Versioned cache: bump SW_VERSION to invalidate old caches.
 */
const SW_VERSION = 'spin-v2';
const CORE = ['/', '/index.html', '/manifest.webmanifest', '/spin-icon.svg'];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches
      .open(SW_VERSION)
      .then((c) => c.addAll(CORE))
      .then(() => self.skipWaiting()),
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k !== SW_VERSION).map((k) => caches.delete(k))).then(() =>
        self.clients.claim(),
      ),
    ),
  );
});

self.addEventListener('fetch', (event) => {
  const { request } = event;
  if (request.method !== 'GET') return;
  const url = new URL(request.url);
  if (url.origin !== location.origin) return;

  // Navigation requests: network-first, fall back to cache, then /index.html.
  if (request.mode === 'navigate') {
    event.respondWith(
      fetch(request)
        .then((res) => {
          const copy = res.clone();
          caches.open(SW_VERSION).then((c) => c.put(request, copy));
          return res;
        })
        .catch(() => caches.match(request).then((m) => m || caches.match('/index.html'))),
    );
    return;
  }

  // Static assets: cache-first.
  event.respondWith(
    caches.match(request).then((cached) => {
      if (cached) return cached;
      return fetch(request)
        .then((res) => {
          if (!res || !res.ok || res.type !== 'basic') return res;
          const copy = res.clone();
          caches.open(SW_VERSION).then((c) => c.put(request, copy));
          return res;
        })
        .catch(() => cached);
    }),
  );
});
