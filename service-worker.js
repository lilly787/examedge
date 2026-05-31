// ExamEdge Offline-First PWA Service Worker
const CACHE_NAME = "examedge-cache-v2";
const ASSETS_TO_CACHE = [
  "index.html",
  "index.css",
  "questions.js",
  "database.js",
  "app.js",
  "manifest.json",
  "https://cdn.tailwindcss.com",
  "https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Outfit:wght@400;500;600;700;800&display=swap",
  "https://img.icons8.com/nolan/192/graduation-cap.png",
  "https://img.icons8.com/nolan/512/graduation-cap.png"
];

// Installation phase: pre-cache static web shell assets
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log("[Service Worker] Pre-caching static assets for offline use...");
      return cache.addAll(ASSETS_TO_CACHE);
    }).then(() => self.skipWaiting())
  );
});

// Activation phase: clean up expired cache partitions
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((name) => {
          if (name !== CACHE_NAME) {
            console.log("[Service Worker] Clearing stale cache: " + name);
            return caches.delete(name);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

// Fetch interception phase: Cache-First offline fallback routine
self.addEventListener("fetch", (event) => {
  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      // If resource is cached, serve it immediately
      if (cachedResponse) {
        return cachedResponse;
      }

      // Otherwise, attempt standard network fetch
      return fetch(event.request).then((networkResponse) => {
        // Only cache successful standard requests
        if (!networkResponse || networkResponse.status !== 200 || networkResponse.type !== "basic") {
          return networkResponse;
        }

        // Clone response stream before caching it dynamically
        const responseToCache = networkResponse.clone();
        caches.open(CACHE_NAME).then((cache) => {
          cache.put(event.request, responseToCache);
        });

        return networkResponse;
      }).catch(() => {
        // If network fetch fails and resource isn't cached (full offline fallback)
        console.warn("[Service Worker] Network request failed offline: " + event.request.url);
      });
    })
  );
});
