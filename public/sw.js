const CACHE_NAME = 'steppet-cache-v2';
const PRECACHE_URLS = [
  '/',
  '/manifest.webmanifest',
  '/styles/base.css',
  '/styles/layout.css',
  '/styles/pet.css',
  '/styles/pages.css',
  '/styles/battle.css',
  '/src/gameState.js',
  '/src/pet.js',
  '/src/steps.js',
  '/src/battle.js',
  '/components/home.js',
  '/components/profile.js',
  '/components/battleLog.js',
  '/src/ui.js',
  '/src/main.js',
  '/data/battles.json',
  '/data/evolution.json',
  '/data/petStats.json'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(PRECACHE_URLS)).then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys.map((key) => {
          if (key !== CACHE_NAME) {
            return caches.delete(key);
          }
        })
      )
    ).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') {
    return;
  }

  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      if (cachedResponse) {
        return cachedResponse;
      }

      return fetch(event.request)
        .then((response) => {
          const clone = response.clone();
          caches.open(CACHE_NAME).then((cache) => {
            if (event.request.url.startsWith(self.location.origin)) {
              cache.put(event.request, clone);
            }
          });
          return response;
        })
        .catch(() => caches.match('/'));
    })
  );
});
