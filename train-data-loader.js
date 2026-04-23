/* ============================================================
 * KL79.in - Train Data Loader
 * ------------------------------------------------------------
 * Two data sources feed this loader:
 *
 *  1. Per-station HTML pages (`Payyannur.html`, `Nileshwar.html`,
 *     `Kannur.html`) — hand-curated, include descriptions and
 *     friendly ML names. These are the "primary" source and win
 *     any conflicts.
 *
 *  2. `train-schedules.js` — a central database of full stop
 *     lists for daily trains on the corridor. This lets us
 *     synthesise `fromEn = <any schedule station>` entries so the
 *     "From" dropdown can list Kasaragod, Cheruvathur, Thalassery,
 *     Kozhikode, Ernakulam, etc. — not just the three stations
 *     that have dedicated HTML pages.
 *
 * Merge strategy:
 *   - Start with the HTML-page entries.
 *   - For every (station, train-number) pair NOT already present
 *     from page data, add a synthesised entry from the schedule.
 *   - `stops` list on each entry still powers intermediate-stop
 *     search (e.g. Thalassery → Mahe).
 *
 * Usage:
 *   KL79_TrainData.load().then(data => { ... });
 *   KL79_TrainData.findRoutes('Kasaragod', 'Ernakulam').then(...);
 * ========================================================== */

(function () {
    /* Canonical display order for train stations that have their
     * OWN dedicated HTML page. Fetched at runtime to extract the
     * curated `trainTimingsData` object. */
    const TRAIN_PAGES = [
        'Payyannur.html',
        'Nileshwar.html',
        'Kannur.html',
    ];

    const STATION_LABELS_ML = {
        'Payyannur.html': 'പയ്യന്നൂർ',
        'Nileshwar.html': 'നീലേശ്വരം',
        'Kannur.html':    'കണ്ണൂർ',
    };
    const STATION_LABELS_EN = {
        'Payyannur.html': 'Payyannur',
        'Nileshwar.html': 'Nileshwar',
        'Kannur.html':    'Kannur',
    };

    /* Station aliases — every station the user might type when
     * searching (English, Malayalam, short station codes, nicknames).
     * Shared between "From" and "To" matching. */
    const STATION_ALIASES = {
        'payyannur':         ['payyannur', 'payyanur', 'പയ്യന്നൂർ', 'pyn', 'pay'],
        'nileshwar':         ['nileshwar', 'nileshwaram', 'നീലേശ്വരം', 'neeleswaram', 'nls', 'nle'],
        'kannur':            ['kannur', 'cannanore', 'കണ്ണൂർ', 'can'],
        'mangaluru':         ['mangaluru', 'mangalore', 'mangalapuram', 'മംഗലാപുരം', 'മംഗളൂരു', 'maq', 'majn'],
        'kasaragod':         ['kasaragod', 'kasargod', 'കാസർഗോഡ്', 'kgq'],
        'kanhangad':         ['kanhangad', 'kanjangad', 'കാഞ്ഞങ്ങാട്', 'kzgd', 'kzd', 'kze'],
        'cheruvathur':       ['cheruvathur', 'cheruvathoor', 'ചെറുവത്തൂർ', 'chv'],
        'kannapuram':        ['kannapuram', 'കണ്ണപുരം', 'kpq'],
        'thalassery':        ['thalassery', 'tellicherry', 'തലശ്ശേരി', 'tly'],
        'mahe':              ['mahe', 'mahé', 'മാഹി'],
        'vadakara':          ['vadakara', 'vatakara', 'വടകര', 'bdj'],
        'quilandy':          ['quilandy', 'koyilandy', 'കൊയിലാണ്ടി', 'qld'],
        'kozhikode':         ['kozhikode', 'calicut', 'കോഴിക്കോട്', 'cli', 'clt'],
        'parappanangadi':    ['parappanangadi', 'പരപ്പനങ്ങാടി', 'pgi'],
        'tirur':             ['tirur', 'തിരൂർ', 'tir'],
        'kuttippuram':       ['kuttippuram', 'കുറ്റിപ്പുറം', 'ktu'],
        'shornur':           ['shornur', 'shoranur', 'ഷൊർണൂർ', 'sru', 'srr'],
        'palakkad':          ['palakkad', 'palghat', 'പാലക്കാട്', 'pgt'],
        'thrissur':          ['thrissur', 'trichur', 'തൃശ്ശൂർ', 'tcr'],
        'aluva':              ['aluva', 'alwaye', 'ആലുവ', 'awy'],
        'ernakulam':         ['ernakulam', 'kochi', 'എറണാകുളം', 'കൊച്ചി', 'ers', 'ern'],
        'kottayam':          ['kottayam', 'കോട്ടയം', 'ktym'],
        'alappuzha':         ['alappuzha', 'alleppey', 'ആലപ്പുഴ', 'alp', 'allp'],
        'kayamkulam':        ['kayamkulam', 'കായംകുളം', 'kyj'],
        'kollam':            ['kollam', 'quilon', 'കൊല്ലം', 'qln'],
        'varkala':           ['varkala', 'വർക്കല', 'vak'],
        'thiruvananthapuram':['thiruvananthapuram', 'trivandrum', 'തിരുവനന്തപുരം', 'tvc'],
        'nagercoil':         ['nagercoil', 'nagarkoil', 'നാഗർകോവിൽ', 'ncj'],
        'chennai':           ['chennai', 'madras', 'ചെന്നൈ', 'mas', 'ms'],
        'bangalore':         ['bangalore', 'bengaluru', 'ബാംഗ്ലൂർ', 'ബംഗളൂരു', 'sbc', 'ksr'],
        'coimbatore':        ['coimbatore', 'കോയമ്പത്തൂർ', 'cbe'],
    };

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

    function matchesStation(haystack, needle) {
        if (!needle) return false;
        const h = normalise(haystack);
        const n = normalise(needle);
        if (!h || !n) return false;
        if (h.includes(n)) return true;

        for (const key of Object.keys(STATION_ALIASES)) {
            const group = STATION_ALIASES[key].map(normalise);
            if (group.some(g => g && n.includes(g))) {
                return group.some(g => g && h.includes(g));
            }
        }
        return false;
    }

    /* Extract the `trainTimingsData` object from HTML using brace counting. */
    function extractTrainData(html) {
        const marker = 'const trainTimingsData';
        const idx = html.indexOf(marker);
        if (idx === -1) return null;
        const openBrace = html.indexOf('{', idx);
        if (openBrace === -1) return null;

        let depth = 0, end = -1, inStr = false, strCh = '', prev = '';
        for (let i = openBrace; i < html.length; i++) {
            const c = html[i];
            if (inStr) {
                if (c === strCh && prev !== '\\') inStr = false;
            } else {
                if (c === '"' || c === "'" || c === '`') { inStr = true; strCh = c; }
                else if (c === '{') depth++;
                else if (c === '}') { depth--; if (depth === 0) { end = i; break; } }
            }
            prev = c;
        }
        if (end === -1) return null;

        const objText = html.slice(openBrace, end + 1);
        try {
            const fn = new Function('return (' + objText + ');');
            return fn();
        } catch (e) {
            console.warn('KL79 train-data-loader: parse failed', e);
            return null;
        }
    }

    async function fetchPage(page) {
        try {
            const resp = await fetch('/' + page, { cache: 'no-cache' });
            if (!resp.ok) throw new Error('HTTP ' + resp.status);
            const html = await resp.text();
            const data = extractTrainData(html);
            if (!data) return null;

            const sourceLabel = data.source_location || '';
            const fromMatch = sourceLabel.match(/From\s+([^\-–—]+)/i);
            const fromEn = fromMatch ? fromMatch[1].trim()
                                     : (STATION_LABELS_EN[page] || page.replace('.html', ''));
            const fromMlMatch = sourceLabel.split('-').slice(1).join('-').trim()
                                || STATION_LABELS_ML[page] || '';

            return {
                page,
                fromEn,
                fromMl: fromMlMatch,
                sourceLabel,
                categories: data.categories || [],
            };
        } catch (e) {
            console.warn('KL79 train-data-loader: failed to fetch', page, e);
            return null;
        }
    }

    /* ---- Synthesise train entries from the central schedules DB ----
     * For each schedule × each stop, emit one "from this station" entry
     * with the remaining stops as its downstream list. The last stop in
     * each schedule is the terminal — we skip emitting a "from terminal"
     * entry (you can't travel from the terminal further). */
    function synthesiseFromSchedules() {
        const obj = (typeof window !== 'undefined') && window.KL79_TrainSchedules;
        if (!obj || !Array.isArray(obj.schedules)) return [];

        const out = [];
        obj.schedules.forEach(sch => {
            const stops = Array.isArray(sch.stops) ? sch.stops : [];
            if (stops.length < 2) return;
            const terminalPair = stops[stops.length - 1];
            const terminal = Array.isArray(terminalPair) ? terminalPair[0] : '';

            for (let i = 0; i < stops.length - 1; i++) {
                const [fromEn, time] = stops[i];
                const downstreamPairs = stops.slice(i + 1); // [[name, time], ...]
                const downstream     = downstreamPairs.map(s => s[0]);
                const label = (obj.stationLabels && obj.stationLabels[fromEn]) || {};
                const terminalTime = (stops[stops.length - 1] || [])[1] || '';

                out.push({
                    fromEn:            fromEn,
                    fromMl:            label.ml || '',
                    fromPage:          '', // synthesised — no dedicated page
                    toCategory:        sch.dest_label || terminal,
                    time:              time || '',
                    nameMl:            sch.name_ml || '',
                    nameEn:            sch.name_en || '',
                    number:            sch.number || '',
                    destination:       terminal,
                    destinationTime:   terminalTime,
                    frequency:         sch.frequency || '',
                    description:       '',
                    stops:             downstream,
                    stopsWithTimes:    downstreamPairs,
                    synthesised:       true,
                });
            }
        });
        return out;
    }

    let cache = null;
    let inFlight = null;

    async function load() {
        if (cache) return cache;
        if (inFlight) return inFlight;

        inFlight = (async () => {
            const results = await Promise.all(TRAIN_PAGES.map(fetchPage));
            const sources = results.filter(Boolean);

            const pageTrains = [];
            const stations = new Set();

            sources.forEach(src => {
                stations.add(src.fromEn);
                src.categories.forEach(cat => {
                    const category = cat.destination_category || '';
                    (cat.trains || []).forEach(t => {
                        /* Enrich with downstream stops from the central
                           schedules DB if possible (via number match),
                           else fall back to the old route-template
                           lookup. */
                        let stops = [];
                        let stopsWithTimes = []; // [[name, time], ...]
                        let destinationTime = '';

                        /* Preferred: match by train number against the
                           central DB. This gives the exact stop list +
                           times for trains that exist in both sources. */
                        try {
                            const sched = (window.KL79_TrainSchedules &&
                                           Array.isArray(window.KL79_TrainSchedules.schedules))
                                ? window.KL79_TrainSchedules.schedules : [];
                            const match = sched.find(s =>
                                s.number && t.number &&
                                String(s.number).trim() === String(t.number).trim());
                            if (match && Array.isArray(match.stops)) {
                                const idx = match.stops.findIndex(
                                    st => matchesStation(st[0], src.fromEn));
                                if (idx >= 0) {
                                    stopsWithTimes = match.stops.slice(idx + 1);
                                    stops = stopsWithTimes.map(s => s[0]);
                                    const terminalPair = match.stops[match.stops.length - 1];
                                    destinationTime = (terminalPair && terminalPair[1]) || '';
                                }
                            }
                        } catch (e) { /* non-fatal */ }

                        /* Fallback: route-template based lookup. */
                        if (stops.length === 0) {
                            try {
                                if (window.KL79_TrainRoutes &&
                                    typeof window.KL79_TrainRoutes.routeFor === 'function') {
                                    stops = window.KL79_TrainRoutes.routeFor(
                                        src.fromEn,
                                        t.destination || '',
                                        category,
                                    ) || [];
                                }
                            } catch (e) { /* non-fatal */ }
                        }

                        pageTrains.push({
                            fromEn:          src.fromEn,
                            fromMl:          src.fromMl,
                            fromPage:        src.page,
                            toCategory:      category,
                            time:            t.time || '',
                            nameMl:          t.name_ml || '',
                            nameEn:          t.name_en || '',
                            number:          t.number || '',
                            destination:     t.destination || '',
                            destinationTime: destinationTime,
                            frequency:       t.frequency || '',
                            description:     t.description || '',
                            stops:           stops,
                            stopsWithTimes:  stopsWithTimes,
                            synthesised:     false,
                        });
                    });
                });
            });

            /* Dedupe key: fromEn + train number (case-insensitive). */
            const keyOf = t => normalise(t.fromEn) + '|' + String(t.number || '').trim();
            const seen = new Set(pageTrains.map(keyOf));

            const synthesised = synthesiseFromSchedules();
            synthesised.forEach(t => {
                const k = keyOf(t);
                if (!seen.has(k)) {
                    seen.add(k);
                    pageTrains.push(t);
                    stations.add(t.fromEn);
                }
            });

            /* Also surface every station the schedules DB knows about
               in the global stations set so the "From" dropdown is
               complete even for stations with only a handful of trains. */
            const schedObj = window.KL79_TrainSchedules;
            if (schedObj && Array.isArray(schedObj.orderedStations)) {
                schedObj.orderedStations.forEach(s => stations.add(s));
            }

            cache = {
                trains:   pageTrains,
                sources:  sources,
                stations: Array.from(stations).sort(),
            };
            return cache;
        })();

        return inFlight;
    }

    function parseTime(t) {
        if (!t) return null;
        const m = t.toString().trim().match(/^(\d{1,2})[.:](\d{2})\s*(am|pm|AM|PM)?/);
        if (!m) return null;
        let h = parseInt(m[1], 10);
        const min = parseInt(m[2], 10);
        const ampm = (m[3] || '').toLowerCase();
        if (ampm === 'am') { if (h === 12) h = 0; }
        else if (ampm === 'pm') { if (h !== 12) h += 12; }
        return h * 60 + min;
    }

    async function findRoutes(from, to) {
        const { trains } = await load();
        if (!from && !to) return [];

        const filtered = trains.filter(tr => {
            const fromHit = !from || matchesStation(tr.fromEn, from) || matchesStation(tr.fromMl, from);
            const toHit = !to || matchesStation(tr.destination, to)
                              || matchesStation(tr.toCategory, to)
                              || matchesStation(tr.nameEn, to)
                              || matchesStation(tr.nameMl, to)
                              || (Array.isArray(tr.stops) &&
                                  tr.stops.some(s => matchesStation(s, to)));
            return fromHit && toHit;
        });

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

    function splitDestinations(s) {
        if (!s) return [];
        return s.split(/[,،/]/).map(p => p.trim()).filter(Boolean);
    }

    function cleanCategory(s) {
        if (!s) return '';
        return String(s)
            .replace(/\s*ഭാഗത്തേക്ക്\s*$/u, '')
            .replace(/\s*ഭാഗത്തേക്ക്\b/gu, '')
            .replace(/\s*ഭാഗത്ത്\s*$/u, '')
            .replace(/\s*\btowards?\b.*$/i, '')
            .replace(/\s*\(.*?\)\s*/g, ' ')
            .replace(/\s+-\s+/g, ' · ')
            .trim();
    }

    async function allStations() {
        const { trains, stations } = await load();
        const destinations = new Set();
        trains.forEach(t => {
            splitDestinations(t.destination).forEach(v => destinations.add(v));
        });
        return {
            stations: stations.map(s => ({ label: s, kind: 'station' })),
            destinations: Array.from(destinations).map(d => ({ label: d, kind: 'destination' })),
        };
    }

    async function destinationsFrom(from) {
        const { trains } = await load();

        if (!from || !from.trim()) {
            const { destinations } = await allStations();
            const sub = destinations.map(d => d.label)
                                    .sort((a, b) => a.localeCompare(b, 'ml'));
            return { main: [], sub, combined: sub };
        }

        const mainSet = new Set();
        const subSet = new Set();
        const stopSet = new Set();

        trains.forEach(t => {
            if (!matchesStation(t.fromEn, from) && !matchesStation(t.fromMl, from)) return;
            const cleaned = cleanCategory(t.toCategory);
            if (cleaned) mainSet.add(cleaned);
            splitDestinations(t.destination).forEach(v => subSet.add(v));
            if (Array.isArray(t.stops)) t.stops.forEach(s => stopSet.add(s));
        });

        mainSet.forEach(m => subSet.delete(m));
        stopSet.forEach(s => subSet.delete(s)); // stops become their own group
        const main = Array.from(mainSet);
        const sub = Array.from(subSet).sort((a, b) => a.localeCompare(b, 'ml'));
        const stops = Array.from(stopSet).sort((a, b) => a.localeCompare(b, 'en'));
        // Stops come after terminal destinations so the datalist shows the
        // "big" destinations first but you can also scroll to any en-route stop.
        return { main, sub, stops, combined: [...main, ...sub, ...stops] };
    }

    /* Ordered list of sources for the "From" dropdown.
     * Priority: the three stations with dedicated HTML pages first
     * (preserves the curated UX), then every other station from the
     * central schedules DB in geographic (north → south) order. */
    function orderedSources() {
        const schedObj = (typeof window !== 'undefined') && window.KL79_TrainSchedules;
        const page = TRAIN_PAGES.map(p => ({
            page: p,
            en:   STATION_LABELS_EN[p] || p.replace(/\.html$/, ''),
            ml:   STATION_LABELS_ML[p] || '',
            primary: true,
        }));
        const pageEnSet = new Set(page.map(p => p.en));

        if (!schedObj || !Array.isArray(schedObj.orderedStations)) return page;

        const extra = schedObj.orderedStations
            .filter(name => !pageEnSet.has(name))
            .map(name => {
                const lbl = (schedObj.stationLabels && schedObj.stationLabels[name]) || {};
                return {
                    page:    '',     // no dedicated HTML page
                    en:      name,
                    ml:      lbl.ml || '',
                    primary: false,
                };
            });

        return page.concat(extra);
    }

    window.KL79_TrainData = {
        load,
        findRoutes,
        allStations,
        destinationsFrom,
        orderedSources,
        parseTime,
        matchesStation,
        TRAIN_PAGES,
        STATION_LABELS_ML,
        STATION_LABELS_EN,
    };
})();
