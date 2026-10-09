/* Build replaces the version and asset list with the exact production bundle. */
const SW_VERSION = '__SPIN_CACHE_VERSION__';
const CORE = ['/', '/index.html', '/manifest.webmanifest', '/spin-icon.svg'];
const PRECACHE = /* __SPIN_PRECACHE__ */ [];

self.addEventListener('install', (event) => {
  // Atomic installation: a missing bundle fails rather than claiming offline readiness.
  event.waitUntil(
    caches.open(SW_VERSION).then((cache) => cache.addAll([...new Set([...CORE, ...PRECACHE])])),
  );
});

self.addEventListener('message', (event) => {
  if (event.data?.type === 'SKIP_WAITING') self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    (async () => {
      // Retain one previous Spin cache for tabs still using its hashed chunks after an explicit update.
      const keys = (await caches.keys()).filter(
        (key) => key.startsWith('spin-') && key !== SW_VERSION,
      );
      await Promise.all(keys.slice(0, -1).map((key) => caches.delete(key)));
      await self.clients.claim();
    })(),
  );
});

self.addEventListener('fetch', (event) => {
  const { request } = event;
  if (request.method !== 'GET' || new URL(request.url).origin !== self.location.origin) return;
  if (request.mode === 'navigate') {
    // The shell and hashed assets always belong to the same build.
    event.respondWith(
      caches
        .open(SW_VERSION)
        .then(
          async (cache) =>
            (await cache.match('/index.html', { ignoreVary: true })) || fetch(request),
        ),
    );
    return;
  }
  // Cache only build-listed assets, never API responses or SPA fallbacks for missing assets.
  const path = new URL(request.url).pathname;
  if (![...CORE, ...PRECACHE].includes(path) && !path.startsWith('/assets/')) return;
  event.respondWith(
    (async () => {
      const cache = await caches.open(SW_VERSION);
      const current = await cache.match(request, { ignoreVary: true });
      if (current) return current;
      // An older open tab can request its old hashed chunk after an explicit update.
      const previous = (await caches.keys()).filter(
        (key) => key.startsWith('spin-') && key !== SW_VERSION,
      );
      for (const key of previous.reverse()) {
        const response = await (await caches.open(key)).match(request, { ignoreVary: true });
        if (response) return response;
      }
      return fetch(request);
    })(),
  );
});
