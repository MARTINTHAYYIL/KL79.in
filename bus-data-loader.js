/* ============================================================
 * KL79.in - Bus Data Loader
 * ------------------------------------------------------------
 * Fetches each bus page at runtime, extracts the busTimingsData
 * object embedded in the HTML, and builds a combined index.
 *
 * Usage (from any page):
 *   KL79_BusData.load().then(data => { ... });
 *   KL79_BusData.findRoutes('Chittarikkal', 'Iritty').then(list => ...);
 *
 * Caches results in sessionStorage so repeat lookups are instant.
 * ========================================================== */

(function () {
    /* Canonical display order — matches the site's "From" menu on the
     * homepage. Chittarikkal first. This order is used everywhere:
     * Route Finder From dropdown, mobile bus sheet, etc. */
    const BUS_PAGES = [
        'Chittarikkal.html',
        'Bheemanady.html',
        'Cherupuzha.html',
        'Kunnumkai.html',
        'malom.html',
        'Alakode.html',
        'Konnakkad.html',
        'Vellarikundu.html',
        'Kanhangad.html',
        'Iritty.html',
        'olyambadi.html',
    ];

    /* Pretty Malayalam labels for each source page.
     * Falls back to the English page name if not listed here. */
    const SOURCE_LABELS_ML = {
        'Chittarikkal.html': 'ചിറ്റാരിക്കാൽ',
        'Bheemanady.html':   'ഭീമനടി',
        'Cherupuzha.html':   'ചെറുപുഴ',
        'Kunnumkai.html':    'കുന്നുംകൈ',
        'malom.html':        'മാലോം',
        'Alakode.html':      'ആലക്കോട്',
        'Konnakkad.html':    'കൊന്നക്കാട്',
        'Vellarikundu.html': 'വെള്ളരിക്കുണ്ട്',
        'Kanhangad.html':    'കാഞ്ഞങ്ങാട് / നീലേശ്വരം',
        'Iritty.html':       'ഇരിട്ടി',
        'olyambadi.html':    'ഓലയമ്പാടി',
    };
    const SOURCE_LABELS_EN = {
        'Chittarikkal.html': 'Chittarikkal',
        'Bheemanady.html':   'Bheemanady',
        'Cherupuzha.html':   'Cherupuzha',
        'Kunnumkai.html':    'Kunnumkai',
        'malom.html':        'Malom',
        'Alakode.html':      'Alakode',
        'Konnakkad.html':    'Konnakkad',
        'Vellarikundu.html': 'Vellarikundu',
        'Kanhangad.html':    'Kanhangad / Nileshwar',
        'Iritty.html':       'Iritty',
        'olyambadi.html':    'Olayambadi',
    };

    /* Known station aliases — English <-> Malayalam spelling variants.
     * Used for fuzzy matching in the route finder so the user can
     * type "Bangalore" and still match "ബാംഗ്ലൂർ" in the data. */
    const STATION_ALIASES = {
        'chittarikkal': ['chittarikkal', 'chitharickal', 'ചിറ്റാരിക്കാൽ', 'chittarikal'],
        'kanhangad':    ['kanhangad', 'kanjangad', 'kanhanghad', 'കാഞ്ഞങ്ങാട്'],
        'nileshwar':    ['nileshwar', 'nileshwaram', 'നീലേശ്വരം', 'neeleswaram'],
        'mangalore':    ['mangalore', 'mangalapuram', 'മംഗലാപുരം', 'mangaluru'],
        'kasaragod':    ['kasaragod', 'kasargod', 'കാസർഗോഡ്', 'കാസർകോട്'],
        'bangalore':    ['bangalore', 'bengaluru', 'ബാംഗ്ലൂർ', 'ബംഗളൂരു'],
        'ernakulam':    ['ernakulam', 'kochi', 'എറണാകുളം', 'കൊച്ചി'],
        'mananthavady': ['mananthavady', 'manandhavady', 'മാനന്തവാടി'],
        'iritty':       ['iritty', 'ഇരിട്ടി'],
        'payyannur':    ['payyannur', 'പയ്യന്നൂർ'],
        'kannur':       ['kannur', 'cannanore', 'കണ്ണൂർ'],
        'bheemanady':   ['bheemanady', 'bheemanadi', 'ഭീമനടി'],
        'cherupuzha':   ['cherupuzha', 'ചെറുപുഴ'],
        'alakode':      ['alakode', 'ആലക്കോട്'],
        'konnakkad':    ['konnakkad', 'konnakad', 'കൊന്നക്കാട്'],
        'kunnumkai':    ['kunnumkai', 'kunnumkayi', 'കുന്നുംകൈ'],
        'malom':        ['malom', 'malam', 'മാലോം', 'മലോം'],
        'olayambadi':   ['olayambadi', 'olyambadi', 'ഓലയമ്പാടി'],
        'vellarikundu': ['vellarikundu', 'വെള്ളരിക്കുണ്ട്'],
        'parappa':      ['parappa', 'പരപ്പ'],
        'odayanchal':   ['odayanchal', 'ഒടയംചാൽ'],
        'kottiyur':     ['kottiyur', 'കൊട്ടിയൂർ'],
        'bathery':      ['bathery', 'sulthan bathery', 'ബത്തേരി'],
        'thalassery':   ['thalassery', 'തലശ്ശേരി'],
        'kozhikode':    ['kozhikode', 'calicut', 'കോഴിക്കോട്'],
        'thrissur':     ['thrissur', 'തൃശ്ശൂർ'],
    };

    /* Normalise a string for matching: lowercase, strip punctuation,
     * collapse whitespace, NFKD to decompose combined chars. */
    function normalise(s) {
        if (!s) return '';
        return String(s)
            .normalize('NFKD')
            .toLowerCase()
            .replace(/[\u0300-\u036f]/g, '')
            .replace(/[^\p{L}\p{N}\s]/gu, ' ')
            .replace(/\s+/g, ' ')
            .trim();
    }

    /* Does `haystack` contain any alias of `needle`? */
    function matchesStation(haystack, needle) {
        if (!needle) return false;
        const h = normalise(haystack);
        const n = normalise(needle);
        if (!h || !n) return false;

        if (h.includes(n)) return true;

        // Check alias groups
        for (const key of Object.keys(STATION_ALIASES)) {
            const group = STATION_ALIASES[key];
            const normalisedGroup = group.map(normalise);
            if (normalisedGroup.some(g => g && n.includes(g))) {
                // `needle` is in this group — does haystack contain ANY alias?
                return normalisedGroup.some(g => g && h.includes(g));
            }
        }
        return false;
    }

    /* Extract busTimingsData from HTML text.
     * Matches: const busTimingsData = { ... };
     * Uses brace counting so nested objects don't trip us up. */
    function extractBusData(html) {
        const marker = 'const busTimingsData';
        const idx = html.indexOf(marker);
        if (idx === -1) return null;

        const openBrace = html.indexOf('{', idx);
        if (openBrace === -1) return null;

        let depth = 0;
        let end = -1;
        let inStr = false;
        let strCh = '';
        let prev = '';

        for (let i = openBrace; i < html.length; i++) {
            const c = html[i];
            if (inStr) {
                if (c === strCh && prev !== '\\') inStr = false;
            } else {
                if (c === '"' || c === "'" || c === '`') {
                    inStr = true; strCh = c;
                } else if (c === '{') {
                    depth++;
                } else if (c === '}') {
                    depth--;
                    if (depth === 0) { end = i; break; }
                }
            }
            prev = c;
        }
        if (end === -1) return null;

        const objText = html.slice(openBrace, end + 1);
        try {
            // Evaluate in an isolated function scope.
            // The embedded object is plain JS (not JSON) with single-quoted strings etc.
            // eslint-disable-next-line no-new-func
            const fn = new Function('return (' + objText + ');');
            return fn();
        } catch (e) {
            console.warn('KL79 bus-data-loader: parse failed', e);
            return null;
        }
    }

    /* Fetch one bus page and return its parsed data + source key. */
    async function fetchPage(page) {
        try {
            const resp = await fetch('/' + page, { cache: 'no-cache' });
            if (!resp.ok) throw new Error('HTTP ' + resp.status);
            const html = await resp.text();
            const data = extractBusData(html);
            if (!data) return null;

            // Pull the English source-name from "From X - malayalam"
            const sourceLabel = data.source_location || '';
            const fromMatch = sourceLabel.match(/From\s+([^\-–—]+)/i);
            const fromEn = fromMatch ? fromMatch[1].trim() : page.replace('.html', '');
            const fromMlMatch = sourceLabel.split('-').slice(1).join('-').trim();

            return {
                page,
                fromEn,
                fromMl: fromMlMatch,
                sourceLabel,
                categories: data.categories || [],
            };
        } catch (e) {
            console.warn('KL79 bus-data-loader: failed to fetch', page, e);
            return null;
        }
    }

    let cache = null;
    let inFlight = null;

    async function load() {
        if (cache) return cache;
        if (inFlight) return inFlight;

        inFlight = (async () => {
            const results = await Promise.all(BUS_PAGES.map(fetchPage));
            const sources = results.filter(Boolean);

            // Flatten into bus records
            const buses = [];
            const stations = new Set();

            sources.forEach(src => {
                stations.add(src.fromEn);
                src.categories.forEach(cat => {
                    (cat.buses || []).forEach(b => {
                        buses.push({
                            fromEn: src.fromEn,
                            fromMl: src.fromMl,
                            fromPage: src.page,
                            toCategory: cat.destination_category || '',
                            time: b.time || '',
                            busName: b.bus_name || '',
                            destination: b.destination || '',
                            route: b.route_details || '',
                            serviceType: b.service_type || '',
                            description: b.description || '',
                        });
                    });
                });
            });

            cache = { buses, sources, stations: Array.from(stations).sort() };
            return cache;
        })();

        return inFlight;
    }

    /* Parse a time string like "5:25 am" or "10.50 PM" into minutes since midnight.
     * Returns null if unparseable. */
    function parseTime(t) {
        if (!t) return null;
        const m = t.toString().trim().match(/^(\d{1,2})[.:](\d{2})\s*(am|pm|AM|PM)?/);
        if (!m) return null;
        let h = parseInt(m[1], 10);
        const min = parseInt(m[2], 10);
        const ampm = (m[3] || '').toLowerCase();
        if (ampm === 'am') {
            if (h === 12) h = 0;
        } else if (ampm === 'pm') {
            if (h !== 12) h += 12;
        }
        return h * 60 + min;
    }

    /* Find routes from `from` to `to` (both strings; either may be en or ml). */
    async function findRoutes(from, to) {
        const { buses } = await load();
        if (!from && !to) return [];

        const filtered = buses.filter(b => {
            const fromHit = !from || matchesStation(b.fromEn, from) || matchesStation(b.fromMl, from);
            const toHit = !to || matchesStation(b.destination, to)
                              || matchesStation(b.route, to)
                              || matchesStation(b.toCategory, to);
            return fromHit && toHit;
        });

        // Sort by time of day
        filtered.sort((a, b) => {
            const ta = parseTime(a.time);
            const tb = parseTime(b.time);
            if (ta == null && tb == null) return 0;
            if (ta == null) return 1;
            if (tb == null) return -1;
            return ta - tb;
        });
        return filtered;
    }

    /* Split a destination field into individual place tokens.
     * Destinations in the data are often comma-separated lists like
     * "കാഞ്ഞങ്ങാട്, മംഗലാപുരം" (Kanhangad, Mangalore). */
    function splitDestinations(s) {
        if (!s) return [];
        return s.split(/[,،/]/).map(p => p.trim()).filter(Boolean);
    }

    /* Clean up a destination_category heading for display.
     * The source data uses phrases like "ഇരിട്ടി ഭാഗത്തേക്ക്" (towards Iritty)
     * or "നീലേശ്വരം / കാഞ്ഞങ്ങാട് ഭാഗത്തേക്ക്". For the dropdown we drop the
     * trailing direction word so the user sees clean place names. */
    function cleanCategory(s) {
        if (!s) return '';
        return String(s)
            // Drop common Malayalam direction suffixes
            .replace(/\s*ഭാഗത്തേക്ക്\s*$/u, '')
            .replace(/\s*ഭാഗത്തേക്ക്\b/gu, '')
            .replace(/\s*ഭാഗത്ത്\s*$/u, '')
            .replace(/\s*വഴി\s*$/u, '')
            // English equivalents (defensive)
            .replace(/\s*\btowards?\b.*$/i, '')
            .trim();
    }

    /* Suggest all known station names for autocomplete — both from/to.
     * Returns a list of {label, kind} where kind is 'station' or 'destination'. */
    async function allStations() {
        const { buses, stations } = await load();
        const destinations = new Set();
        buses.forEach(b => {
            splitDestinations(b.destination).forEach(v => destinations.add(v));
            // Also include route-detail tokens so via-points are suggestable
            splitDestinations((b.route || '').replace(/വഴി|via/gi, ''))
                .forEach(v => { if (v.length >= 2) destinations.add(v); });
        });

        const stationItems = stations.map(s => ({ label: s, kind: 'station' }));
        const destItems = Array.from(destinations).map(d => ({ label: d, kind: 'destination' }));
        return { stations: stationItems, destinations: destItems };
    }

    /* Destinations reachable from a given `from` string (station name or alias).
     *
     * Returns an object:
     *   {
     *     main: [...category-heading labels in the order they appear on the page],
     *     sub:  [...individual destinations + via-points, alphabetised],
     *     combined: [main..., sub...]   // convenient for filling a datalist
     *   }
     *
     * The `main` entries are the `destination_category` values from the source
     * page (e.g. "ഇരിട്ടി ഭാഗത്തേക്ക്") — these represent high-level directions
     * and should appear at the top of any dropdown.
     */
    async function destinationsFrom(from) {
        const { buses } = await load();

        if (!from || !from.trim()) {
            // No From selected — return every destination as a fallback,
            // with no main entries.
            const { destinations } = await allStations();
            const sub = destinations.map(d => d.label)
                                    .sort((a, b) => a.localeCompare(b, 'ml'));
            return { main: [], sub, combined: sub };
        }

        const mainSet = new Set();   // preserves insertion order
        const subSet = new Set();

        buses.forEach(b => {
            if (!matchesStation(b.fromEn, from) && !matchesStation(b.fromMl, from)) return;

            const cleaned = cleanCategory(b.toCategory);
            if (cleaned) mainSet.add(cleaned);

            splitDestinations(b.destination).forEach(v => subSet.add(v));
            // Also include via-points from route_details
            splitDestinations((b.route || '').replace(/വഴി|via/gi, ''))
                .forEach(v => { if (v.length >= 2) subSet.add(v); });
        });

        // De-dupe: if a sub entry is already a main category, drop it from sub
        mainSet.forEach(m => subSet.delete(m));

        const main = Array.from(mainSet);
        const sub = Array.from(subSet).sort((a, b) => a.localeCompare(b, 'ml'));
        return { main, sub, combined: [...main, ...sub] };
    }

    /* Canonical ordered source list for menus / dropdowns.
     * Synchronous — doesn't require loading any bus pages. */
    function orderedSources() {
        return BUS_PAGES.map(page => ({
            page,
            en: SOURCE_LABELS_EN[page] || page.replace(/\.html$/, ''),
            ml: SOURCE_LABELS_ML[page] || '',
        }));
    }

    window.KL79_BusData = {
        load,
        findRoutes,
        allStations,
        destinationsFrom,
        orderedSources,
        parseTime,
        matchesStation,
        BUS_PAGES,
        SOURCE_LABELS_ML,
        SOURCE_LABELS_EN,
    };
})();
