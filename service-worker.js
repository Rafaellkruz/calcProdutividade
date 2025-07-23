const CACHE_NAME = "produtividade-cache-v1";
const urlsToCache = [
  "./",
  "./index.html",
  "./styles.css", // NOME CORRIGIDO
  "./app.js",
  "./manifest.json",
  "./icon-192x192.png",
  "./icon-512x512.png"
];

// Instala o Service Worker e adiciona os arquivos ao cache
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(urlsToCache);
    })
  );
});

// Busca recursos do cache ou da rede
self.addEventListener("fetch", (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      return response || fetch(event.request);
    })
  );
});

// Atualiza o cache ao instalar uma nova versão
self.addEventListener("activate", (event) => {
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (!cacheWhitelist.includes(cacheName)) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});
