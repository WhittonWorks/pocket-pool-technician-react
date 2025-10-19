// public/service-worker.js
// Compact Pool Technician (CPT) — Full offline-first PWA support

const CACHE_VERSION = 'v5'; // bump to invalidate old cache
const CACHE_NAME = `cpt-cache-${CACHE_VERSION}`;

// 🧱 Core assets to always cache
const CORE_ASSETS = [
  '/',
  '/index.html',
  '/manifest.webmanifest',
  '/favicon.ico',
  '/CPT-Logo-192.png',
  '/CPT-Logo-512.png'
];

// 🧩 Runtime caching patterns (JSON flows, JS, CSS, images)
const RUNTIME_PATTERNS = [
  /\.json$/i,          // Flows, errors, symptoms JSON
  /\/static\/js\//i,   // JS bundles
  /\/static\/css\//i,  // CSS bundles
  /\/media\//i         // Embedded media
];

// 🧰 Install event — cache the core app shell
self.addEventListener('install', (event) => {
  console.log(`[SW] Installing ${CACHE_NAME}...`);
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) =>
      cache.addAll(CORE_ASSETS).catch((err) =>
        console.warn('[SW] Core cache failed:', err)
      )
    )
  );
  self.skipWaiting();
});

// ♻️ Activate event — clear old versions
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
  console.log(`[SW] Ready and controlling all clients`);
});

// ⚡ Fetch handler — cache-first for JSON & assets, network-first for others
self.addEventListener('fetch', (event) => {
  const req = event.request;
  const url = new URL(req.url);

  // Ignore non-GET or external requests
  if (req.method !== 'GET' || url.origin !== self.location.origin) return;

  // Determine if this request should be cached
  const shouldCache = RUNTIME_PATTERNS.some((regex) => regex.test(url.pathname));

  if (shouldCache) {
    event.respondWith(cacheFirst(req));
  } else {
    event.respondWith(networkFirst(req));
  }
});

// 💾 Cache-first (for JSON, JS, CSS, etc.)
async function cacheFirst(req) {
  const cache = await caches.open(CACHE_NAME);
  const cached = await cache.match(req);
  if (cached) return cached;

  try {
    const fresh = await fetch(req);
    cache.put(req, fresh.clone());
    return fresh;
  } catch {
    return caches.match('/index.html'); // fallback if offline
  }
}

// 🌐 Network-first (for HTML navigations)
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

// 💬 Allow skipWaiting message from app
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});// public/service-worker.js
// Compact Pool Technician (CPT) — Full offline-first PWA support

const CACHE_VERSION = 'v5'; // bump to invalidate old cache
const CACHE_NAME = `cpt-cache-${CACHE_VERSION}`;

// 🧱 Core assets to always cache
const CORE_ASSETS = [
  '/',
  '/index.html',
  '/manifest.webmanifest',
  '/favicon.ico',
  '/CPT-Logo-192.png',
  '/CPT-Logo-512.png'
];

// 🧩 Runtime caching patterns (JSON flows, JS, CSS, images)
const RUNTIME_PATTERNS = [
  /\.json$/i,          // Flows, errors, symptoms JSON
  /\/static\/js\//i,   // JS bundles
  /\/static\/css\//i,  // CSS bundles
  /\/media\//i         // Embedded media
];

// 🧰 Install event — cache the core app shell
self.addEventListener('install', (event) => {
  console.log(`[SW] Installing ${CACHE_NAME}...`);
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) =>
      cache.addAll(CORE_ASSETS).catch((err) =>
        console.warn('[SW] Core cache failed:', err)
      )
    )
  );
  self.skipWaiting();
});

// ♻️ Activate event — clear old versions
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
  console.log(`[SW] Ready and controlling all clients`);
});

// ⚡ Fetch handler — cache-first for JSON & assets, network-first for others
self.addEventListener('fetch', (event) => {
  const req = event.request;
  const url = new URL(req.url);

  // Ignore non-GET or external requests
  if (req.method !== 'GET' || url.origin !== self.location.origin) return;

  // Determine if this request should be cached
  const shouldCache = RUNTIME_PATTERNS.some((regex) => regex.test(url.pathname));

  if (shouldCache) {
    event.respondWith(cacheFirst(req));
  } else {
    event.respondWith(networkFirst(req));
  }
});

// 💾 Cache-first (for JSON, JS, CSS, etc.)
async function cacheFirst(req) {
  const cache = await caches.open(CACHE_NAME);
  const cached = await cache.match(req);
  if (cached) return cached;

  try {
    const fresh = await fetch(req);
    cache.put(req, fresh.clone());
    return fresh;
  } catch {
    return caches.match('/index.html'); // fallback if offline
  }
}

// 🌐 Network-first (for HTML navigations)
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

// 💬 Allow skipWaiting message from app
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});