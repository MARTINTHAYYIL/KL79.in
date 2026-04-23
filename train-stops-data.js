/* ============================================================
 * KL79.in  -  Train Route & Stops Database
 * ------------------------------------------------------------
 * The per-station train pages only record each train's FINAL
 * destination (e.g. TVC, MAS, NCJ). If someone searches
 * "Nileshwar → Mahe", the search returns nothing because Mahe
 * is never a "destination" — it's just a stop on the way.
 *
 * This file fills in the gap. For every destination code we
 * recognise, we store the ordered list of stops the train makes
 * through Kerala and beyond. The loader (train-data-loader.js)
 * uses these lists to enrich each train entry, so the Route
 * Finder can match on any intermediate stop.
 *
 * Maintenance:
 *   - Route templates are keyed by destination code (TVC, MAS, …)
 *     and by running direction (southbound / northbound).
 *   - Update when IR publishes a new timetable (twice a year).
 *   - All station names here are in English. The existing
 *     STATION_ALIASES in train-data-loader.js handles Malayalam /
 *     code / alternate spellings at match time.
 * ========================================================== */

(function () {
    /* ---------- Line segments (each ordered in its own direction) ---------- */

    // Kerala coastal line, Mangaluru → Shoranur (north → south)
    const COAST_KL = [
        'Mangaluru Central', 'Mangaluru Junction', 'Manjeshwaram',
        'Uppala', 'Kumbla', 'Kasaragod', 'Kanhangad', 'Nileshwar',
        'Cheruvathur', 'Payyanur', 'Kannapuram', 'Kannur',
        'Thalassery', 'Mahe', 'Vadakara', 'Quilandy', 'Kozhikode',
        'Parappanangadi', 'Tirur', 'Kuttippuram', 'Shoranur',
    ];

    // Shoranur → Ernakulam (via Thrissur)
    const SRR_ERS = [
        'Shoranur', 'Ottappalam', 'Wadakkanchery', 'Thrissur',
        'Irinjalakuda', 'Chalakudy', 'Angamaly', 'Aluva',
        'Ernakulam Town', 'Ernakulam Junction',
    ];

    // Ernakulam → Thiruvananthapuram via Alappuzha coast
    const ERS_TVC_ALP = [
        'Ernakulam Junction', 'Cherthala', 'Alappuzha', 'Harippad',
        'Karunagappally', 'Kayamkulam Junction', 'Kollam Junction',
        'Paravur', 'Varkala', 'Kochuveli', 'Thiruvananthapuram Central',
    ];

    // Ernakulam → Thiruvananthapuram via Kottayam
    const ERS_TVC_KTYM = [
        'Ernakulam Junction', 'Kottayam', 'Changanassery', 'Chengannur',
        'Mavelikara', 'Kayamkulam Junction', 'Kollam Junction',
        'Paravur', 'Varkala', 'Kochuveli', 'Thiruvananthapuram Central',
    ];

    // Thiruvananthapuram → Kanyakumari
    const TVC_CAPE = [
        'Thiruvananthapuram Central', 'Neyyattinkara', 'Parassala',
        'Nagercoil Junction', 'Kanyakumari',
    ];

    // Shoranur → Chennai Central (via Palakkad, Coimbatore, Salem)
    const SRR_MAS = [
        'Shoranur', 'Palakkad Junction', 'Coimbatore Junction',
        'Tiruppur', 'Erode Junction', 'Salem Junction', 'Jolarpettai',
        'Katpadi', 'Arakkonam', 'Chennai Central',
    ];

    // Shoranur → Chennai Egmore / Tambaram
    const SRR_MS = [
        'Shoranur', 'Palakkad Junction', 'Coimbatore Junction',
        'Tiruppur', 'Erode Junction', 'Salem Junction', 'Jolarpettai',
        'Katpadi', 'Arakkonam', 'Tambaram', 'Chennai Egmore',
    ];

    // Shoranur → Coimbatore
    const SRR_CBE = [
        'Shoranur', 'Palakkad Junction', 'Coimbatore Junction',
    ];

    // Shoranur → KSR Bengaluru (via Coimbatore-Salem)
    const SRR_SBC = [
        'Shoranur', 'Palakkad Junction', 'Coimbatore Junction',
        'Erode Junction', 'Salem Junction', 'Jolarpettai',
        'KSR Bengaluru',
    ];

    // Shoranur → Yesvantpur (via Mysuru)
    const SRR_YPR = [
        'Shoranur', 'Palakkad Junction', 'Coimbatore Junction',
        'Erode Junction', 'Salem Junction', 'Mysuru Junction',
        'Mandya', 'KSR Bengaluru', 'Yesvantpur',
    ];

    // Shoranur → Puducherry
    const SRR_PDY = [
        'Shoranur', 'Palakkad Junction', 'Coimbatore Junction',
        'Erode Junction', 'Salem Junction', 'Villupuram', 'Puducherry',
    ];

    // Shoranur → Kacheguda
    const SRR_KCG = [
        'Shoranur', 'Palakkad Junction', 'Coimbatore Junction',
        'Hubli Junction', 'Guntakal Junction', 'Secunderabad Junction',
        'Kacheguda',
    ];

    // Shoranur → Pune
    const SRR_PUNE = [
        'Shoranur', 'Palakkad Junction', 'Coimbatore Junction',
        'Erode Junction', 'Salem Junction', 'Pune Junction',
    ];

    // Mangaluru → Panvel (Konkan line)
    const MAQ_PANVEL = [
        'Mangaluru Central', 'Udupi', 'Kundapura', 'Bhatkal',
        'Murdeshwar', 'Honnavar', 'Kumta', 'Karwar', 'Madgaon',
        'Ratnagiri', 'Panvel',
    ];

    // Panvel → Nizamuddin (via Vasai Road, Surat, Bhopal, Agra)
    const PANVEL_NZM = [
        'Panvel', 'Vasai Road', 'Surat', 'Vadodara', 'Ratlam',
        'Kota', 'Bhopal', 'Jhansi', 'Agra Cantt', 'Hazrat Nizamuddin',
    ];

    // Panvel → Gujarat terminals (common tail for Okha / Bhavnagar / Gandhidham / Veraval)
    const PANVEL_GUJ = [
        'Panvel', 'Vasai Road', 'Surat', 'Vadodara', 'Ahmedabad',
        'Rajkot', 'Hapa', 'Jamnagar',
    ];

    // Chennai → Santragachi (Kolkata side)
    const MAS_SRC = [
        'Chennai Central', 'Vijayawada Junction', 'Visakhapatnam',
        'Bhubaneswar', 'Kharagpur Junction', 'Santragachi Junction',
    ];

    /* ---------- Helpers ---------- */

    function cat(...arrs) {
        const out = [];
        for (const a of arrs) {
            for (const s of a) {
                if (out[out.length - 1] !== s) out.push(s);
            }
        }
        return out;
    }

    const rev = a => a.slice().reverse();

    /* ---------- Full routes per destination, in running direction ----------
     *
     * ROUTES_SB: train running south through our stations.
     *   Destination is south of source (TVC, ERS, MAS, CBE, SBC, NCJ, ...).
     *   List is ordered north → south.
     *
     * ROUTES_NB: train running north through our stations.
     *   Destination is north / east (MAQ, LTT, NZM, OKHA, MRDW, ...).
     *   List is ordered south → north.
     * ------------------------------------------------------------ */

    // Southbound templates --------------------------------------------------
    const SB = {};
    SB['TVC']  = cat(COAST_KL, SRR_ERS, ERS_TVC_ALP);
    SB['CAPE'] = cat(SB['TVC'], TVC_CAPE);
    SB['NCJ']  = cat(SB['TVC'], ['Thiruvananthapuram Central', 'Neyyattinkara', 'Parassala', 'Nagercoil Junction']);
    SB['ERS']  = cat(COAST_KL, SRR_ERS);
    SB['ERN']  = SB['ERS'];
    SB['KCVL'] = cat(COAST_KL, SRR_ERS, [
        'Ernakulam Junction', 'Cherthala', 'Alappuzha', 'Harippad',
        'Kayamkulam Junction', 'Kollam Junction', 'Kochuveli',
    ]);
    SB['MAS'] = cat(COAST_KL, SRR_MAS);
    SB['MS']  = cat(COAST_KL, SRR_MS);
    SB['TBM'] = SB['MS'];
    SB['CBE'] = cat(COAST_KL, SRR_CBE);
    SB['SBC'] = cat(COAST_KL, SRR_SBC);
    SB['KSR'] = SB['SBC'];
    SB['YPR'] = cat(COAST_KL, SRR_YPR);
    SB['PDY'] = cat(COAST_KL, SRR_PDY);
    SB['KCG'] = cat(COAST_KL, SRR_KCG);
    SB['PUNE']= cat(COAST_KL, SRR_PUNE);
    SB['SRC'] = cat(COAST_KL, SRR_MAS, MAS_SRC);
    SB['CAN'] = cat(COAST_KL.slice(0, COAST_KL.indexOf('Kannur') + 1));
    SB['MAJN']= COAST_KL.slice(0, 2);
    SB['MAQ'] = COAST_KL.slice(0, 1);

    // Northbound templates --------------------------------------------------
    const NB = {};
    NB['MAQ']  = rev(COAST_KL);
    NB['MAJN'] = NB['MAQ'];
    NB['MRDW'] = cat(rev(COAST_KL), MAQ_PANVEL.slice(1, 5));  // up to Murdeshwar
    NB['LTT']  = cat(rev(COAST_KL), MAQ_PANVEL.slice(1), ['Lokmanya Tilak Terminus']);
    NB['NZM']  = cat(rev(COAST_KL), MAQ_PANVEL.slice(1), PANVEL_NZM.slice(1));
    NB['OKHA'] = cat(rev(COAST_KL), MAQ_PANVEL.slice(1), PANVEL_GUJ.slice(1), ['Okha']);
    NB['BVC']  = cat(rev(COAST_KL), MAQ_PANVEL.slice(1), PANVEL_GUJ.slice(1), ['Bhavnagar Terminus']);
    NB['GIMB'] = cat(rev(COAST_KL), MAQ_PANVEL.slice(1), PANVEL_GUJ.slice(1), ['Gandhidham']);
    NB['VRL']  = cat(rev(COAST_KL), MAQ_PANVEL.slice(1), PANVEL_GUJ.slice(1), ['Veraval']);
    // Kannur-originating eastern trains (Kannur → Bengaluru): they run
    // SOUTH through the coast to Kozhikode then east via Palakkad. Listed
    // as "Northbound" on some pages (rare); also as southbound — handled
    // by both directions pointing to the same list.
    NB['SBC']  = cat(
        ['Kannur', 'Thalassery', 'Mahe', 'Vadakara', 'Quilandy', 'Kozhikode'],
        SRR_SBC.slice(1),
    );
    NB['YPR']  = cat(
        ['Kannur', 'Thalassery', 'Mahe', 'Vadakara', 'Quilandy', 'Kozhikode'],
        SRR_YPR.slice(1),
    );

    /* ---------- Source-station alias map ----------
     * Maps incoming "fromEn" labels (as used on our station pages)
     * to the canonical spelling used in the route lists above.
     * Keep lowercase keys. */
    const SRC_ALIASES = {
        'payyannur':  'Payyanur',
        'payyanur':   'Payyanur',
        'pyn':        'Payyanur',
        'nileshwar':  'Nileshwar',
        'nileshwaram':'Nileshwar',
        'neeleswaram':'Nileshwar',
        'nls':        'Nileshwar',
        'kannur':     'Kannur',
        'cannanore':  'Kannur',
        'can':        'Kannur',
    };

    function canonSource(name) {
        if (!name) return '';
        const k = String(name).toLowerCase().replace(/^from\s+/, '').trim();
        return SRC_ALIASES[k] || name;
    }

    function parseDestinationCode(destination) {
        if (!destination) return '';
        // The destination string often contains "(XYZ)" — take the first.
        const m = String(destination).match(/\(([A-Z]{2,6})\)/);
        return m ? m[1].toUpperCase() : '';
    }

    function isNorthbound(category) {
        if (!category) return false;
        const s = String(category).toLowerCase();
        // English "North" OR Malayalam "വടക്ക്"
        return s.includes('north') || s.includes('വടക്ക');
    }

    /* ---------- Public: get downstream stops ----------
     *
     * routeFor(sourceEn, destination, destinationCategory)
     *   returns the ordered list of stops AFTER the source, in the
     *   train's running direction. If we can't look up the route,
     *   returns an empty array.
     * ------------------------------------------------------------ */
    function routeFor(sourceEn, destination, destinationCategory) {
        const code = parseDestinationCode(destination);
        if (!code) return [];
        const table = isNorthbound(destinationCategory) ? NB : SB;
        const route = table[code];
        if (!route || !route.length) return [];

        const src = canonSource(sourceEn).toLowerCase();
        let idx = -1;
        for (let i = 0; i < route.length; i++) {
            if (route[i].toLowerCase() === src) { idx = i; break; }
        }
        if (idx < 0) {
            // Loose fallback: substring match
            for (let i = 0; i < route.length; i++) {
                const stop = route[i].toLowerCase();
                if (stop.includes(src) || src.includes(stop)) { idx = i; break; }
            }
        }
        if (idx < 0) return route.slice(); // show whole route as last resort
        return route.slice(idx + 1);
    }

    window.KL79_TrainRoutes = {
        routeFor,
        parseDestinationCode,
        isNorthbound,
        /* For debugging / introspection */
        SOUTHBOUND: SB,
        NORTHBOUND: NB,
    };
})();
