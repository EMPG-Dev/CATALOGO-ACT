/* ============================================================
   SERVICE WORKER — E_M_P_G App
   Permite instalación como PWA y funcionamiento offline
   ============================================================ */

const CACHE_NAME = 'empg-v1';

// Archivos que se cachean al instalar
const PRECACHE_URLS = [
    './',
    './index.html',
    './manifest.json'
];

/* ---- Instalación: guarda los archivos en caché ---- */
self.addEventListener('install', event => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(cache => cache.addAll(PRECACHE_URLS))
            .then(() => self.skipWaiting())
    );
});

/* ---- Activación: limpia cachés viejas ---- */
self.addEventListener('activate', event => {
    event.waitUntil(
        caches.keys().then(keys =>
            Promise.all(
                keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k))
            )
        ).then(() => self.clients.claim())
    );
});

/* ---- Fetch: sirve desde caché, luego red ---- */
self.addEventListener('fetch', event => {
    // Solo intercepta peticiones GET
    if (event.request.method !== 'GET') return;

    event.respondWith(
        caches.match(event.request).then(cached => {
            if (cached) return cached;

            return fetch(event.request)
                .then(response => {
                    // Guarda en caché si es válida
                    if (response && response.status === 200 && response.type === 'basic') {
                        const clone = response.clone();
                        caches.open(CACHE_NAME).then(cache => cache.put(event.request, clone));
                    }
                    return response;
                })
                .catch(() => {
                    // Fallback offline: retorna index.html para navegación
                    if (event.request.destination === 'document') {
                        return caches.match('./index.html');
                    }
                });
        })
    );
});