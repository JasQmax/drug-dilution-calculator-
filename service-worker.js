// service-worker.js

const CACHE_NAME = 'pwa-cache-v2';
const ASSETS_TO_CACHE = [
  '/',
  '/index.html',
  '/styles.css',
  '/main.js',
  '/offline.html', // 👈 Add this
  '/icon.png'
];

// Install event
self.addEventListener('install', event => {
  console.log('📦 Installing service worker...');
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      console.log('📁 Caching assets...');
      return cache.addAll(ASSETS_TO_CACHE);
    })
  );
});

// Activate event
self.addEventListener('activate', event => {
  console.log('🚀 Activating new service worker...');
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(
        keys.filter(key => key !== CACHE_NAME).map(key => caches.delete(key))
      )
    )
  );
});

// Fetch event
self.addEventListener('fetch', event => {
  event.respondWith(
    fetch(event.request)
      .then(response => {
        // Network success: optionally update cache
        return response;
      })
      .catch(() => {
        // Network failure: try cache or fallback
        return caches.match(event.request).then(cachedResponse => {
          if (cachedResponse) return cachedResponse;
          if (event.request.mode === 'navigate') {
            // Show offline page only for page navigations
            return caches.match('/offline.html');
          }
        });
      })
  );
});