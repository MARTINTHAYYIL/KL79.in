/* ============================================================
 * KL79.in  -  Leaving Soon widget
 * ------------------------------------------------------------
 * Drops into any bus page that already defines `busTimingsData`.
 * Looks at the current time and shows the next 4 departures.
 *
 * Usage in HTML:
 *   <div id="leaving-soon"></div>
 *   <script src="/leaving-soon.js"></script>
 *   (Place the script AFTER busTimingsData is defined.)
 *
 * Auto-refreshes the countdown every 30s.
 * ========================================================== */

(function () {
    'use strict';

    const MOUNT_ID = 'leaving-soon';
    const SHOW_COUNT = 4;          // how many upcoming to show
    const REFRESH_MS = 30 * 1000;  // re-render every 30s

    function parseTime(t) {
        if (!t) return null;
        const m = t.toString().trim().match(/^(\d{1,2})[.:](\d{2})\s*(am|pm|AM|PM)?/);
        if (!m) return null;
        let h = parseInt(m[1], 10);
        const min = parseInt(m[2], 10);
        const ampm = (m[3] || '').toLowerCase();
        if (ampm === 'am') { if (h === 12) h = 0; }
        else if (ampm === 'pm') { if (h !== 12) h += 12; }
        if (h > 23 || min > 59) return null;
        return h * 60 + min;
    }

    function nowMinutes() {
        const d = new Date();
        return d.getHours() * 60 + d.getMinutes();
    }

    function formatCountdown(diff) {
        if (diff < 0) return '';
        if (diff === 0) return 'leaving now';
        if (diff < 60) return `in ${diff} min`;
        const h = Math.floor(diff / 60);
        const m = diff % 60;
        if (h < 3 && m > 0) return `in ${h}h ${m}m`;
        if (h < 3) return `in ${h}h`;
        return `in ${h}h`;
    }

    function esc(s) {
        return String(s || '')
            .replace(/&/g, '&amp;').replace(/</g, '&lt;')
            .replace(/>/g, '&gt;').replace(/"/g, '&quot;');
    }

    function collectBuses(data) {
        if (!data || !data.categories) return [];
        const list = [];
        data.categories.forEach(cat => {
            (cat.buses || []).forEach(b => {
                list.push({
                    time: b.time || '',
                    minutes: parseTime(b.time),
                    busName: b.bus_name || '',
                    destination: b.destination || '',
                    route: b.route_details || '',
                    category: cat.destination_category || '',
                });
            });
        });
        return list.filter(x => x.minutes != null);
    }

    function pickUpcoming(buses, now) {
        // First try buses strictly in the future
        const upcoming = buses
            .filter(b => b.minutes >= now)
            .sort((a, b) => a.minutes - b.minutes)
            .slice(0, SHOW_COUNT);

        // If it's late at night and nothing left today,
        // show tomorrow's first departures
        if (upcoming.length === 0) {
            return buses
                .slice()
                .sort((a, b) => a.minutes - b.minutes)
                .slice(0, SHOW_COUNT)
                .map(b => Object.assign({ tomorrow: true }, b));
        }
        return upcoming;
    }

    function rowHtml(b, now) {
        const diff = b.tomorrow ? null : (b.minutes - now);
        const countdown = b.tomorrow
            ? 'tomorrow'
            : formatCountdown(diff);

        const dest = b.destination || '—';
        const viaLine = b.route ? ` · <span style="color:var(--ink-muted)">via ${esc(b.route)}</span>` : '';

        const sourceName = (window.busTimingsData && window.busTimingsData.source_location) || '';
        const shareText = `🚌 ${b.time} — ${b.busName} to ${dest}\n${sourceName}\nhttps://kl79.in${location.pathname}`;
        const waHref = 'https://wa.me/?text=' + encodeURIComponent(shareText);

        return `
            <div class="ls-row">
                <div>
                    <div class="ls-time">${esc(b.time)}</div>
                    <div class="ls-countdown">${esc(countdown)}</div>
                </div>
                <div class="ls-info">
                    <b>${esc(b.busName || 'Bus')}</b> → ${esc(dest)}${viaLine}
                </div>
                <a class="ls-share" href="${waHref}" target="_blank" rel="noopener" title="Share on WhatsApp">
                    <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 0 0-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347"/></svg>
                    Share
                </a>
            </div>
        `;
    }

    function render() {
        const mount = document.getElementById(MOUNT_ID);
        if (!mount) return;
        const data = window.busTimingsData;
        if (!data) {
            mount.innerHTML = '';
            return;
        }

        const now = nowMinutes();
        const buses = collectBuses(data);
        const upcoming = pickUpcoming(buses, now);
        const anyTomorrow = upcoming.some(b => b.tomorrow);

        const title = anyTomorrow
            ? 'Tomorrow\'s first buses · നാളത്തെ ആദ്യ ബസുകൾ'
            : 'Leaving soon · ഉടൻ പുറപ്പെടുന്നവ';

        if (!upcoming.length) {
            mount.innerHTML = `
                <div class="ls-card">
                    <div class="ls-title"><span class="ls-dot"></span>${esc(title)}</div>
                    <div class="ls-none">No upcoming departures found.</div>
                </div>`;
            return;
        }

        mount.innerHTML = `
            <div class="ls-card">
                <div class="ls-title"><span class="ls-dot"></span>${esc(title)}</div>
                ${upcoming.map(b => rowHtml(b, now)).join('')}
            </div>`;
    }

    // Initial render — wait for DOM + busTimingsData to be set
    function init() {
        render();
        setInterval(render, REFRESH_MS);
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
