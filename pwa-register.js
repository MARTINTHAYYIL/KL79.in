/* Register the KL79.in service worker. Silent-fails in unsupported
   browsers. Include with <script src="/pwa-register.js" defer></script>
   on every page. */
(function () {
    if (!('serviceWorker' in navigator)) return;
    // Don't register on file:// — only over http/https
    if (!/^https?:/.test(location.protocol)) return;
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/service-worker.js')
            .catch(err => console.warn('SW register failed:', err));
    });
})();
