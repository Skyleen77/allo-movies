const CACHE_NAME = 'allo-movie-cache-v1';
const urlsToCache = [
  '/',
  '/favicon.ico',
  '/manifest.json',
  '/icons/android-chrome-192x192.png',
  '/icons/android-chrome-512x512.png',
  '/hero.jpg',
];

// Installation du service worker
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('Opened cache');
      return cache.addAll(urlsToCache);
    }),
  );
});

// Activation et nettoyage des caches précédents
self.addEventListener('activate', (event) => {
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            return caches.delete(cacheName);
          }
        }),
      );
    }),
  );
});

// Intercepter les requêtes pour utiliser les données en cache
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      // Retourne la réponse du cache ou fetch la requête réseau
      return response || fetch(event.request);
    }),
  );
});

// Gestion des notifications push
self.addEventListener('push', (event) => {
  console.log('Push event', event);
  const data = event.data.json();
  console.log('Push received', data);
  const { title, message, icon } = data;

  const options = {
    body: message,
    icon: icon || '/icons/android-chrome-192x192.png',
    badge: '/icons/android-chrome-192x192.png',
  };

  try {
    event.waitUntil(self.registration.showNotification(title, options));
  } catch (error) {
    console.error('Error handling push event:', error);
  }
});
