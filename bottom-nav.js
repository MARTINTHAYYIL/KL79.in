/* ============================================================
 * KL79.in  -  Mobile Bottom Tab Nav
 * ------------------------------------------------------------
 * Auto-injects a fixed bottom tab bar on mobile (hidden >768px
 * via kl79-theme.css). Highlights the active tab based on the
 * current URL.
 * ========================================================== */

(function () {
    if (document.getElementById('kl79-bottom-nav')) return;

    const path = location.pathname.toLowerCase();
    const isHome    = path === '/' || path === '/index.html' || path === '';
    const isSearch  = path.endsWith('/search.html');
    const isBus     = /^\/(chittarikkal|vellarikundu|alakode|iritty|kanhangad|konnakkad|kunnumkai|malom|olyambadi|olayambadi|bheemanady|cherupuzha)\.html$/i.test(path);

    function cls(cond, extra) {
        let c = '';
        if (cond) c += ' active';
        if (extra) c += ' ' + extra;
        return c;
    }

    const html = `
        <nav class="kl79-bottom-nav" id="kl79-bottom-nav" aria-label="Mobile navigation">
            <a href="/" class="${cls(isHome).trim()}" aria-label="Home">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
                <span>Home</span>
            </a>
            <a href="/Chittarikkal.html" class="${cls(isBus).trim()}" aria-label="Buses">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"><path d="M8 6v6"/><path d="M15 6v6"/><path d="M2 12h19.6"/><path d="M18 18h3s.5-1.7.8-2.8c.1-.4.2-.8.2-1.2 0-.4-.1-.8-.2-1.2l-1.4-5C20.1 6.8 19.1 6 18 6H4a2 2 0 0 0-2 2v10h3"/><circle cx="7" cy="18" r="2"/><path d="M9 18h5"/><circle cx="16" cy="18" r="2"/></svg>
                <span>Bus</span>
            </a>
            <a href="/search.html" class="${cls(isSearch).trim()}" aria-label="Search">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
                <span>Search</span>
            </a>
            <a href="https://wa.me/916238693615" target="_blank" rel="noopener" class="accent" aria-label="WhatsApp">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 0 0-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347"/></svg>
                <span>WhatsApp</span>
            </a>
            <a href="/Tourist-Places.html" aria-label="More">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"><circle cx="5" cy="12" r="1"/><circle cx="12" cy="12" r="1"/><circle cx="19" cy="12" r="1"/></svg>
                <span>More</span>
            </a>
        </nav>
    `;

    function mount() {
        if (document.getElementById('kl79-bottom-nav')) return;
        document.body.insertAdjacentHTML('beforeend', html);
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', mount);
    } else {
        mount();
    }
})();
