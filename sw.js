const CACHE_NAME = "powerback-v2";
const urlsToCache = [
  '/pwa/',
  '/pwa/index.html',
  '/pwa/dashboard/citizen.html',
  '/pwa/dashboard/police.html',
  '/pwa/dashboard/ngo.html',
  '/pwa/dashboard/watch.html',
  '/pwa/assets/css/dashboard.css',
  '/pwa/assets/js/app.js',
  '/pwa/assets/js/dashboard-common.js',
  '/pwa/assets/js/citizen-dashboard.js',
  '/pwa/assets/js/police-dashboard.js',
  '/pwa/assets/js/ngo-dashboard.js',
  '/pwa/assets/js/watch-dashboard.js',
  '/pwa/manifest.json',
  'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap',
  'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css'
];

// Install SW
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(urlsToCache);
    })
  );
});

// Fetch
self.addEventListener("fetch", (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      return response || fetch(event.request);
    })
  );
});
