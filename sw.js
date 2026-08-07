const CACHE_NAME = 'sy-beginner-deepreader-v2';
const ASSETS = [
  './',
  './index.html',
  './manifest.json',
  './icon-192.png',
  './icon-512.png'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(ASSETS))
  );
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k !== CACHE_NAME).map((k) => caches.delete(k)))
    )
  );
  self.clients.claim();
});

function isHtmlRequest(request) {
  return request.mode === 'navigate' ||
    (request.destination === 'document') ||
    request.url.endsWith('/') ||
    request.url.endsWith('index.html');
}

self.addEventListener('fetch', (event) => {
  const req = event.request;

  if (isHtmlRequest(req)) {
    // Network-first for the app shell itself, so content/feature updates
    // reach the device as soon as there's a connection, without needing
    // a service-worker version bump. Falls back to cache when offline.
    event.respondWith(
      fetch(req).then((response) => {
        const copy = response.clone();
        caches.open(CACHE_NAME).then((cache) => cache.put(req, copy));
        return response;
      }).catch(() => caches.match(req))
    );
    return;
  }

  // Cache-first for static assets (icons, manifest) — rarely change,
  // and this keeps things fast and fully offline-capable.
  event.respondWith(
    caches.match(req).then((cached) => {
      return cached || fetch(req).then((response) => {
        const copy = response.clone();
        caches.open(CACHE_NAME).then((cache) => cache.put(req, copy));
        return response;
      }).catch(() => cached);
    })
  );
});
