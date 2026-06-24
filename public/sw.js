// public/sw.js
const CACHE_NAME = "fintrack-pwa-v3"; // Incremented version to clear out the bad cache entirely

const ASSETS_TO_CACHE = [
  "/",
  "/manifest.json",
  "/icon-192x192.png",
  "/icon-512x512.png"
];

// Force setup instantly
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(ASSETS_TO_CACHE))
  );
  self.skipWaiting();
});

// Wipe out old broken caches cleanly
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

// Network-first with strict Next.js App Router exemptions
self.addEventListener("fetch", (event) => {
  const url = event.request.url;

  // CRITICAL BYPASS: Do not let the Service Worker touch Next.js internals,
  // layout chunks, or hot-reload telemetry streams. Let Next.js handle its own code.
  if (
    !url.startsWith(self.location.origin) || 
    url.includes("/_next/") || 
    url.includes("/api/") ||
    event.request.headers.get("RSC") || // Next.js React Server Component data
    event.request.headers.get("Next-Router-State-Tree")
  ) {
    return; // Pass through to the real live network cleanly
  }

  event.respondWith(
    fetch(event.request)
      .then((response) => {
        // Only cache successful pages/assets, leave framework code alone
        if (response.status === 200 && event.request.method === "GET") {
          const responseClone = response.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, responseClone);
          });
        }
        return response;
      })
      .catch(() => {
        // Fall back to stored shell assets if completely offline
        return caches.match(event.request);
      })
  );
});