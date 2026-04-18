/* ============================================================
 * KL79.in  -  Service Worker
 * ------------------------------------------------------------
 * Strategy:
 *   - HTML pages: network-first, fallback to cache, fallback to
 *     a cached offline screen. (So content stays fresh when online
 *     but timings are still readable with no signal.)
 *   - CSS / JS / fonts / images: cache-first with background update.
 *
 * Bump CACHE_VERSION whenever you change the shell so users get
 * a fresh copy on their next visit.
 * ========================================================== */

const CACHE_VERSION = 'kl79-v2';
const CORE = [
    '/',
    '/index.html',
    '/search.html',
    '/kl79-theme.css',
    '/search-data.js',
    '/bus-data-loader.js',
    '/leaving-soon.js',
    '/manifest.json',
    '/icon.svg',
];

self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_VERSION).then(cache =>
            cache.addAll(CORE).catch(() => {
                /* Ignore individual file failures — still install */
            })
        )
    );
    self.skipWaiting();
});

self.addEventListener('activate', (event) => {
    event.waitUntil(
        caches.keys().then(keys =>
            Promise.all(keys
                .filter(k => k !== CACHE_VERSION)
                .map(k => caches.delete(k)))
        ).then(() => self.clients.claim())
    );
});

function isHtmlRequest(req) {
    if (req.mode === 'navigate') return true;
    const accept = req.headers.get('accept') || '';
    return accept.includes('text/html');
}

self.addEventListener('fetch', (event) => {
    const req = event.request;
    if (req.method !== 'GET') return;

    const url = new URL(req.url);
    // Don't cache cross-origin stuff (Google Fonts CDN, analytics, etc.)
    if (url.origin !== location.origin) return;

    if (isHtmlRequest(req)) {
        // Network-first for pages
        event.respondWith((async () => {
            try {
                const fresh = await fetch(req);
                const cache = await caches.open(CACHE_VERSION);
                cache.put(req, fresh.clone());
                return fresh;
            } catch (e) {
                const cached = await caches.match(req);
                if (cached) return cached;
                return caches.match('/index.html');
            }
        })());
        return;
    }

    // Cache-first for assets
    event.respondWith((async () => {
        const cached = await caches.match(req);
        if (cached) {
            // Revalidate in background
            fetch(req).then(fresh => {
                if (fresh && fresh.ok) {
                    caches.open(CACHE_VERSION).then(c => c.put(req, fresh));
                }
            }).catch(() => {});
            return cached;
        }
        try {
            const fresh = await fetch(req);
            if (fresh && fresh.ok) {
                const cache = await caches.open(CACHE_VERSION);
                cache.put(req, fresh.clone());
            }
            return fresh;
        } catch (e) {
            return new Response('Offline', { status: 503 });
        }
    })());
});
