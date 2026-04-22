/* ================================================================
   SERVICE WORKER — E_M_P_G App
   Permite instalacion como PWA y funcionamiento offline
   ================================================================ */

var CACHE = 'empg-v1';

var ARCHIVOS = [
    './',
    './index.html',
    './manifest.json'
];

/* Instalacion: guarda los archivos en cache */
self.addEventListener('install', function(e) {
    e.waitUntil(
        caches.open(CACHE)
            .then(function(cache) { return cache.addAll(ARCHIVOS); })
            .then(function() { return self.skipWaiting(); })
    );
});

/* Activacion: limpia caches viejas */
self.addEventListener('activate', function(e) {
    e.waitUntil(
        caches.keys().then(function(keys) {
            return Promise.all(
                keys.filter(function(k) { return k !== CACHE; })
                    .map(function(k) { return caches.delete(k); })
            );
        }).then(function() { return self.clients.claim(); })
    );
});

/* Fetch: sirve desde cache, luego red */
self.addEventListener('fetch', function(e) {
    if (e.request.method !== 'GET') return;

    e.respondWith(
        caches.match(e.request).then(function(cached) {
            if (cached) return cached;

            return fetch(e.request).then(function(response) {
                if (response && response.status === 200 && response.type === 'basic') {
                    var clone = response.clone();
                    caches.open(CACHE).then(function(cache) { cache.put(e.request, clone); });
                }
                return response;
            }).catch(function() {
                if (e.request.destination === 'document') {
                    return caches.match('./index.html');
                }
            });
        })
    );
});