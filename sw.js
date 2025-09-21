const CACHE_NAME = 'panbeh-vpn-cache-v1';
const assetsToCache = [
  '/',
  '/index.html',
  '/favicon.svg'
];

// Install event: cache static assets
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('Cache opened');
      return cache.addAll(assetsToCache);
    })
  );
});

// Activate event: clean up old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            console.log('Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});

// Fetch event: serve from cache, fall back to network, and update cache
self.addEventListener('fetch', (event) => {
  // We only want to cache GET requests.
  if (event.request.method !== 'GET') {
    return;
  }
  
  event.respondWith(
    caches.open(CACHE_NAME).then((cache) => {
      return fetch(event.request).then((networkResponse) => {
        // If the request is successful, update the cache.
        if (networkResponse.ok) {
            // Check if the request is for a local asset before caching
            if (new URL(event.request.url).origin === self.location.origin) {
                 cache.put(event.request, networkResponse.clone());
            }
        }
        return networkResponse;
      }).catch(() => {
        // If the network fails, try to serve from the cache.
        return cache.match(event.request);
      });
    })
  );
});
