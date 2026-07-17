const CACHE_NAME = "geokit-cache-v1";
const ASSETS_TO_CACHE = [
  "/",
  "/about",
  "/privacy",
  "/terms",
  "/tools/llms-txt-generator",
  "/tools/ai-robots-txt-generator",
  "/tools/schema-generator",
  "/tools/llms-txt-validator",
  "/tools/geo-checklist",
  "/tools/ai-sitemap-generator",
  "/tools/meta-tag-generator",
  "/tools/qa-content-formatter",
  "/tools/geo-score",
  "/tools/schema-validator",
  "/favicon.png",
  "/icon-192.png",
  "/icon-512.png"
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(ASSETS_TO_CACHE);
    })
  );
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cache) => {
          if (cache !== CACHE_NAME) {
            return caches.delete(cache);
          }
        })
      );
    })
  );
  self.clients.claim();
});

self.addEventListener("fetch", (event) => {
  // Skip non-GET requests and API calls
  if (event.request.method !== "GET" || event.request.url.includes("/api/")) {
    return;
  }

  // Handle caching with Stale-While-Revalidate
  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      if (cachedResponse) {
        // Update the cache in the background
        fetch(event.request)
          .then((networkResponse) => {
            if (networkResponse.status === 200) {
              caches.open(CACHE_NAME).then((cache) => {
                cache.put(event.request, networkResponse);
              });
            }
          })
          .catch(() => {
            // Ignore network errors when offline
          });
        return cachedResponse;
      }

      return fetch(event.request)
        .then((networkResponse) => {
          if (!networkResponse || networkResponse.status !== 200 || networkResponse.type !== "basic") {
            return networkResponse;
          }

          const responseToCache = networkResponse.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, responseToCache);
          });

          return networkResponse;
        })
        .catch(() => {
          // If offline and navigating to a page, fall back to cached homepage
          if (event.request.mode === "navigate") {
            return caches.match("/");
          }
        });
    })
  );
});
