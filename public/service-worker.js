// public/service-worker.js
// Compact Pool Technician (CPT) — Full offline-first PWA with flows, errors, and symptoms

const CACHE_VERSION = 'v6';
const CACHE_NAME = `cpt-cache-${CACHE_VERSION}`;

// 🧱 Core shell assets always cached at install
const CORE_ASSETS = [
  '/',
  '/index.html',
  '/manifest.webmanifest',
  '/favicon.ico',
  '/CPT-Logo-192.png',
  '/CPT-Logo-512.png',
  '/static/js/',     // pre-cache app shell bundles
  '/static/css/'
];

// 🧩 Known JSON assets (flows, errors, symptoms)
const DATA_ASSETS = [
  '/flows/jandy-jxi-v1.json',
  '/errors/jandy-jxi-errors-v1.json',
  '/symptoms/jandy-jxi-symptoms-v1.json'
  // 👉 Add more model files here as you create them
];

// 🔍 Runtime cache patterns for dynamic resources
const RUNTIME_PATTERNS = [
  /\.json$/i,          // diagnostic flows, errors, symptoms
  /\/static\/js\//i,   // JS bundles
  /\/static\/css\//i,  // CSS bundles
  /\/media\//i         // any referenced media
];

// 🧰 INSTALL: Pre-cache all critical files + known JSON data
self.addEventListener('install', (event) => {
  console.log(`[SW] Installing ${CACHE_NAME}...`);
  event.waitUntil(
    (async () => {
      const cache = await caches.open(CACHE_NAME);
      try {
        console.log('[SW] Caching core app shell and JSON data...');
        await cache.addAll([...CORE_ASSETS, ...DATA_ASSETS]);
      } catch (err) {
        console.warn('[SW] Some assets failed to cache:', err);
      }
    })()
  );
  self.skipWaiting();
});

// ♻️ ACTIVATE: Clear out old caches
self.addEventListener('activate', (event) => {
  console.log(`[SW] Activating ${CACHE_NAME}...`);
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys.map((key) => {
          if (key !== CACHE_NAME) {
            console.log(`[SW] Deleting old cache: ${key}`);
            return caches.delete(key);
          }
        })
      )
    )
  );
  self.clients.claim();
  console.log(`[SW] Now controlling all clients with ${CACHE_NAME}`);
});

// ⚡ FETCH: Serve cached, update dynamically
self.addEventListener('fetch', (event) => {
  const req = event.request;
  const url = new URL(req.url);

  // Skip external requests
  if (req.method !== 'GET' || url.origin !== self.location.origin) return;

  const shouldCache = RUNTIME_PATTERNS.some((regex) => regex.test(url.pathname));

  if (shouldCache) {
    event.respondWith(cacheFirst(req));
  } else {
    event.respondWith(networkFirst(req));
  }
});

// 💾 CACHE-FIRST strategy for JSON, JS, CSS, etc.
async function cacheFirst(req) {
  const cache = await caches.open(CACHE_NAME);
  const cached = await cache.match(req);
  if (cached) return cached;

  try {
    const fresh = await fetch(req);
    cache.put(req, fresh.clone());
    return fresh;
  } catch {
    return caches.match('/index.html');
  }
}

// 🌐 NETWORK-FIRST strategy for HTML navigation
async function networkFirst(req) {
  const cache = await caches.open(CACHE_NAME);
  try {
    const fresh = await fetch(req);
    cache.put(req, fresh.clone());
    return fresh;
  } catch {
    const cached = await cache.match(req);
    return cached || caches.match('/index.html');
  }
}

// 💬 Handle skipWaiting messages
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});