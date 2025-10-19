// public/service-worker.js
// Compact Pool Technician (CPT) — Offline-first service worker

const CACHE_VERSION = 'v4'; // increment this each time you want to force a full refresh
const CACHE_NAME = `cpt-cache-${CACHE_VERSION}`;

// 🧱 Core assets always cached at install
const CORE_ASSETS = [
  '/',
  '/index.html',
  '/manifest.json',
  '/favicon.ico',
  '/CPT-Logo-192.png',
  '/CPT-Logo-512.png'
];

// 🧩 Patterns for runtime caching (diagnostics, JSON, scripts, CSS, media)
const RUNTIME_PATTERNS = [
  /\.json$/i,          // flows, errors, symptoms
  /\/static\/js\//i,   // JS bundles
  /\/static\/css\//i,  // CSS bundles
  /\/media\//i         // images / media used in flows
];

// 🛠️ Install event — pre-cache core app shell
self.addEventListener('install', (event) => {
  console.log(`[SW] Installing ${CACHE_NAME} …`);
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(CORE_ASSETS))
  );
  self.skipWaiting();
});

// ♻️ Activate event — clear out old caches
self.addEventListener('activate', (event) => {
  console.log(`[SW] Activating ${CACHE_NAME}`);
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys.map((key) => {
          if (key !== CACHE_NAME) {
            console.log(`[SW] Deleting old cache ${key}`);
            return caches.delete(key);
          }
        })
      )
    )
  );
  self.clients.claim();
  console.log(`[SW] Now controlling pages — active cache: ${CACHE_NAME}`);
});

// ⚡ Fetch handler — cache-first for static + JSON, network-first for others
self.addEventListener('fetch', (event) => {
  const req = event.request;
  const url = new URL(req.url);

  // Skip cross-origin requests (analytics, etc.)
  if (url.origin !== self.location.origin) return;

  // Determine if this request matches runtime cache patterns
  const shouldCache = RUNTIME_PATTERNS.some((regex) => regex.test(url.pathname));

  if (shouldCache) {
    // Cache-first: respond from cache, then update in background
    event.respondWith(
      caches.match(req).then((cached) => {
        const fetchPromise = fetch(req)
          .then((response) => {
            const clone = response.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(req, clone));
            return response;
          })
          .catch(() => cached);
        return cached || fetchPromise;
      })
    );
    return;
  }

  // Default network-first for everything else
  event.respondWith(
    fetch(req)
      .then((response) => {
        const clone = response.clone();
        caches.open(CACHE_NAME).then((cache) => cache.put(req, clone));
        return response;
      })
      .catch(() => caches.match(req))
  );
});

// 💬 Message handler to trigger skipWaiting from index.js if needed
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});