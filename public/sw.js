const CACHE_NAME = "life-quest-map-v0-3";
const APP_SHELL = ["/", "/quests", "/map", "/skills", "/history", "/profile"];
const STATIC_ASSETS = new Set(["/icon.svg", "/manifest.webmanifest"]);

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll([...APP_SHELL, ...STATIC_ASSETS])).then(() => self.skipWaiting())
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(keys.filter((key) => key.startsWith("life-quest-map-") && key !== CACHE_NAME).map((key) => caches.delete(key))))
      .then(() => self.clients.claim())
  );
});

function networkFirstNavigation(request) {
  return fetch(request)
    .then((response) => {
      if (response.ok) caches.open(CACHE_NAME).then((cache) => cache.put(request, response.clone()));
      return response;
    })
    .catch(() => caches.match(request).then((cached) => cached || caches.match("/")));
}

function cacheFirstStatic(request) {
  return caches.match(request).then((cached) => cached || fetch(request).then((response) => {
    if (response.ok) caches.open(CACHE_NAME).then((cache) => cache.put(request, response.clone()));
    return response;
  }));
}

self.addEventListener("fetch", (event) => {
  const { request } = event;
  if (request.method !== "GET") return;

  const url = new URL(request.url);
  if (url.origin !== self.location.origin) return;

  if (request.mode === "navigate") {
    event.respondWith(networkFirstNavigation(request));
    return;
  }

  if (STATIC_ASSETS.has(url.pathname)) {
    event.respondWith(cacheFirstStatic(request));
  }
  // Next.js assets, API requests, and every other resource remain network-only.
});
