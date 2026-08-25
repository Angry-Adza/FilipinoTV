const CACHE_NAME = "filipinotv-shell-v1";
const SHELL_ASSETS = [
  "index.html",
  "style.css",
  "app.js",
  "streams.js",
  "manifest.json",
  "icons/icon-192.png",
  "icons/icon-512.png"
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(SHELL_ASSETS);
    })
  );
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys.map((key) => {
          if (key !== CACHE_NAME) {
            return caches.delete(key);
          }
        })
      )
    )
  );
  self.clients.claim();
});

self.addEventListener("fetch", (event) => {
  const req = event.request;

  // Don’t cache HLS streams; only cache shell
  if (req.url.endsWith(".m3u8") || req.url.includes("live")) {
    return;
  }

  event.respondWith(
    caches.match(req).then((cached) => {
      return (
        cached ||
        fetch(req).catch(() => {
          // Optional: fallback for offline
          if (req.mode === "navigate") {
            return caches.match("index.html");
          }
        })
      );
    })
  );
});
