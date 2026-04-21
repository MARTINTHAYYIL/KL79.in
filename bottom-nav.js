/* ============================================================
 * KL79.in  -  Mobile Bottom Tab Nav
 * ------------------------------------------------------------
 * Auto-injects a fixed bottom tab bar on mobile (hidden >768px
 * via kl79-theme.css).
 *
 * The "Bus" tab opens a slide-up sheet listing all 11 bus
 * source pages. The "More" tab opens a sheet with WhatsApp
 * Groups, Business, Tourist Places, News.
 * ========================================================== */

(function () {
    if (document.getElementById('kl79-bottom-nav')) return;

    const path = location.pathname.toLowerCase();
    const isHome    = path === '/' || path === '/index.html' || path === '';
    const isBus     = /^\/(chittarikkal|vellarikundu|alakode|iritty|kanhangad|konnakkad|kunnumkai|malom|olyambadi|olayambadi|bheemanady|cherupuzha)\.html$/i.test(path);
    const isMore    = /^\/(tourist-places|business|whatsapp-groups|election|news)\.html$/i.test(path);

    /* Canonical source list — same order as the Route Finder. */
    const SOURCES = [
        { page: 'Chittarikkal.html', ml: 'ചിറ്റാരിക്കാൽ',        en: 'Chittarikkal' },
        { page: 'Bheemanady.html',   ml: 'ഭീമനടി',                 en: 'Bheemanady'   },
        { page: 'Cherupuzha.html',   ml: 'ചെറുപുഴ',               en: 'Cherupuzha'   },
        { page: 'Kunnumkai.html',    ml: 'കുന്നുംകൈ',              en: 'Kunnumkai'    },
        { page: 'malom.html',        ml: 'മാലോം',                  en: 'Malom'        },
        { page: 'Alakode.html',      ml: 'ആലക്കോട്',               en: 'Alakode'      },
        { page: 'Konnakkad.html',    ml: 'കൊന്നക്കാട്',            en: 'Konnakkad'    },
        { page: 'Vellarikundu.html', ml: 'വെള്ളരിക്കുണ്ട്',         en: 'Vellarikundu' },
        { page: 'Kanhangad.html',    ml: 'കാഞ്ഞങ്ങാട് / നീലേശ്വരം', en: 'Kanhangad/Nileshwar' },
        { page: 'Iritty.html',       ml: 'ഇരിട്ടി',                 en: 'Iritty'       },
        { page: 'olyambadi.html',    ml: 'ഓലയമ്പാടി',              en: 'Olayambadi'   },
    ];

    const MORE_LINKS = [
        { href: '/Whatsapp-groups.html', ml: 'WhatsApp ഗ്രൂപ്പുകൾ', en: 'WhatsApp Groups',  icon: 'whatsapp' },
        { href: '/Business.html',        ml: 'ബിസിനസ്സ്',            en: 'Business Directory', icon: 'briefcase' },
        { href: '/Tourist-Places.html',  ml: 'ടൂറിസം',                en: 'Tourist Places',   icon: 'map' },
        { href: '/Election.html',        ml: 'വാർത്തകൾ',              en: 'News',             icon: 'news' },
    ];

    const MORE_ICONS = {
        whatsapp: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 0 0-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347"/></svg>',
        briefcase: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"><rect x="2" y="7" width="20" height="14" rx="2" ry="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/></svg>',
        map: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"><polygon points="1 6 1 22 8 18 16 22 23 18 23 2 16 6 8 2 1 6"/><line x1="8" y1="2" x2="8" y2="18"/><line x1="16" y1="6" x2="16" y2="22"/></svg>',
        news: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"><path d="M4 22h16a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2H8a2 2 0 0 0-2 2v16a2 2 0 0 1-2 2zm0 0a2 2 0 0 1-2-2v-9c0-1.1.9-2 2-2h2"/><path d="M18 14h-8"/><path d="M15 18h-5"/><path d="M10 6h8v4h-8V6z"/></svg>',
    };

    function getSources() {
        try {
            if (window.KL79_BusData && typeof window.KL79_BusData.orderedSources === 'function') {
                const live = window.KL79_BusData.orderedSources();
                if (Array.isArray(live) && live.length) return live;
            }
        } catch (e) { /* fallthrough */ }
        return SOURCES;
    }

    function cls(cond) { return cond ? ' active' : ''; }

    function esc(s) {
        return String(s == null ? '' : s)
            .replace(/&/g, '&amp;').replace(/</g, '&lt;')
            .replace(/>/g, '&gt;').replace(/"/g, '&quot;');
    }

    /* ---------- BOTTOM NAV ---------- */
    const navHtml = `
        <nav class="kl79-bottom-nav" id="kl79-bottom-nav" aria-label="Mobile navigation">
            <a href="/" class="${cls(isHome).trim()}" aria-label="Home">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
                <span>Home</span>
            </a>
            <button type="button" id="kl79-nav-bus-btn" class="${cls(isBus).trim()}" aria-label="Bus sources" aria-haspopup="dialog" aria-expanded="false">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"><path d="M8 6v6"/><path d="M15 6v6"/><path d="M2 12h19.6"/><path d="M18 18h3s.5-1.7.8-2.8c.1-.4.2-.8.2-1.2 0-.4-.1-.8-.2-1.2l-1.4-5C20.1 6.8 19.1 6 18 6H4a2 2 0 0 0-2 2v10h3"/><circle cx="7" cy="18" r="2"/><path d="M9 18h5"/><circle cx="16" cy="18" r="2"/></svg>
                <span>Bus</span>
            </button>
            <a href="/#route-finder" aria-label="Search">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
                <span>Search</span>
            </a>
            <a href="https://wa.me/916238693615" target="_blank" rel="noopener" class="accent" aria-label="WhatsApp">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 0 0-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347"/></svg>
                <span>WhatsApp</span>
            </a>
            <button type="button" id="kl79-nav-more-btn" class="${cls(isMore).trim()}" aria-label="More" aria-haspopup="dialog" aria-expanded="false">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"><circle cx="5" cy="12" r="1"/><circle cx="12" cy="12" r="1"/><circle cx="19" cy="12" r="1"/></svg>
                <span>More</span>
            </button>
        </nav>
    `;

    function buildBusSheet() {
        const sources = getSources();
        /* Match the desktop "From X - മലയാളം" format the user showed. */
        const listHtml = sources.map(s => `
            <a href="/${esc(s.page)}" class="kl79-sheet-row">
                <span class="kl79-sheet-row-main">From ${esc(s.en)} — ${esc(s.ml || '')}</span>
                <svg class="kl79-sheet-row-arrow" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"><polyline points="9 18 15 12 9 6"/></svg>
            </a>
        `).join('');

        return `
            <div class="kl79-sheet-overlay" id="kl79-bus-overlay" hidden></div>
            <div class="kl79-sheet" id="kl79-bus-sheet" role="dialog" aria-modal="true" aria-labelledby="kl79-bus-sheet-title" hidden>
                <div class="kl79-sheet-handle" aria-hidden="true"></div>
                <div class="kl79-sheet-head">
                    <div>
                        <div id="kl79-bus-sheet-title" class="kl79-sheet-title">ബസ് സമയങ്ങൾ</div>
                        <div class="kl79-sheet-subtitle">സ്ഥലം തിരഞ്ഞെടുക്കുക · Choose a source</div>
                    </div>
                    <button type="button" class="kl79-sheet-close" data-sheet-close="bus" aria-label="Close">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                    </button>
                </div>
                <div class="kl79-sheet-list">
                    ${listHtml}
                </div>
            </div>
        `;
    }

    function buildMoreSheet() {
        const listHtml = MORE_LINKS.map(l => `
            <a href="${esc(l.href)}" class="kl79-sheet-row kl79-sheet-row-more">
                <span class="kl79-sheet-row-icon">${MORE_ICONS[l.icon] || ''}</span>
                <span class="kl79-sheet-row-text">
                    <span class="kl79-sheet-row-ml">${esc(l.ml)}</span>
                    <span class="kl79-sheet-row-en">${esc(l.en)}</span>
                </span>
                <svg class="kl79-sheet-row-arrow" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"><polyline points="9 18 15 12 9 6"/></svg>
            </a>
        `).join('');

        return `
            <div class="kl79-sheet-overlay" id="kl79-more-overlay" hidden></div>
            <div class="kl79-sheet" id="kl79-more-sheet" role="dialog" aria-modal="true" aria-labelledby="kl79-more-sheet-title" hidden>
                <div class="kl79-sheet-handle" aria-hidden="true"></div>
                <div class="kl79-sheet-head">
                    <div>
                        <div id="kl79-more-sheet-title" class="kl79-sheet-title">കൂടുതൽ</div>
                        <div class="kl79-sheet-subtitle">More sections on KL79.in</div>
                    </div>
                    <button type="button" class="kl79-sheet-close" data-sheet-close="more" aria-label="Close">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                    </button>
                </div>
                <div class="kl79-sheet-list">
                    ${listHtml}
                </div>
            </div>
        `;
    }

    function openSheet(kind) {
        const overlay = document.getElementById(`kl79-${kind}-overlay`);
        const sheet   = document.getElementById(`kl79-${kind}-sheet`);
        if (!overlay || !sheet) return;
        /* Close any other open sheet first */
        ['bus','more'].forEach(other => {
            if (other !== kind) closeSheet(other);
        });
        overlay.hidden = false;
        sheet.hidden = false;
        requestAnimationFrame(() => {
            overlay.classList.add('open');
            sheet.classList.add('open');
        });
        const btn = document.getElementById(`kl79-nav-${kind}-btn`);
        if (btn) btn.setAttribute('aria-expanded', 'true');
        document.body.style.overflow = 'hidden';
    }

    function closeSheet(kind) {
        const overlay = document.getElementById(`kl79-${kind}-overlay`);
        const sheet   = document.getElementById(`kl79-${kind}-sheet`);
        if (!overlay || !sheet) return;
        overlay.classList.remove('open');
        sheet.classList.remove('open');
        setTimeout(() => {
            overlay.hidden = true;
            sheet.hidden = true;
        }, 250);
        const btn = document.getElementById(`kl79-nav-${kind}-btn`);
        if (btn) btn.setAttribute('aria-expanded', 'false');
        document.body.style.overflow = '';
    }

    function mount() {
        if (document.getElementById('kl79-bottom-nav')) return;
        document.body.insertAdjacentHTML('beforeend', navHtml);
        document.body.insertAdjacentHTML('beforeend', buildBusSheet());
        document.body.insertAdjacentHTML('beforeend', buildMoreSheet());

        const busBtn  = document.getElementById('kl79-nav-bus-btn');
        const moreBtn = document.getElementById('kl79-nav-more-btn');

        if (busBtn)  busBtn.addEventListener('click', (e) => { e.preventDefault(); openSheet('bus'); });
        if (moreBtn) moreBtn.addEventListener('click', (e) => { e.preventDefault(); openSheet('more'); });

        /* Close buttons + overlay clicks */
        document.querySelectorAll('[data-sheet-close]').forEach(btn => {
            btn.addEventListener('click', () => closeSheet(btn.dataset.sheetClose));
        });
        ['bus','more'].forEach(k => {
            const ov = document.getElementById(`kl79-${k}-overlay`);
            if (ov) ov.addEventListener('click', () => closeSheet(k));
        });

        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                closeSheet('bus');
                closeSheet('more');
            }
        });
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', mount);
    } else {
        mount();
    }
})();
