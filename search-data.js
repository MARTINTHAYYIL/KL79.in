/*
 * KL79.in — Bilingual search data
 * Each entry carries English + Malayalam text plus keywords, so users
 * can search in either language and still get relevant results.
 *
 * category:
 *   "bus"       = bus source pages (where you board)
 *   "train"     = train station pages
 *   "info"      = general info pages (business / tourism / news / groups)
 *   "place"     = notable destination (links to closest bus page)
 *   "topic"     = searchable topics like "KSRTC", "AC sleeper", "Bangalore bus"
 *
 * "keywords" is a lowercased, space-separated string used by the matcher.
 * Add as many aliases / misspellings as make sense.
 */

window.KL79_SEARCH_DATA = [
    /* ---------- BUS SOURCE PAGES ---------- */
    {
        title_en: "Buses from Chittarikkal",
        title_ml: "ചിറ്റാരിക്കാൽ ബസ് സമയങ്ങൾ",
        subtitle: "To Kannur, Kanhangad, Bangalore, Ernakulam & more",
        url: "/Chittarikkal.html",
        icon: "🚌",
        category: "bus",
        keywords: "chittarikkal chitarikal chitarikkal ചിറ്റാരിക്കാൽ bus timing സമയം kl79 kannur കണ്ണൂർ bangalore ബാംഗ്ലൂർ"
    },
    {
        title_en: "Buses from Bheemanady",
        title_ml: "ഭീമനടി ബസ് സമയങ്ങൾ",
        subtitle: "Bheemanady bus stop schedule",
        url: "/Bheemanady.html",
        icon: "🚌",
        category: "bus",
        keywords: "bheemanady bheemanadi bhimanady ഭീമനടി bus സമയം"
    },
    {
        title_en: "Buses from Cherupuzha",
        title_ml: "ചെറുപുഴ ബസ് സമയങ്ങൾ",
        subtitle: "Cherupuzha — buses to Kannur, Iritty, Alakode",
        url: "/Cherupuzha.html",
        icon: "🚌",
        category: "bus",
        keywords: "cherupuzha cherupuza ചെറുപുഴ bus സമയം alakode iritty"
    },
    {
        title_en: "Buses from Kunnumkai",
        title_ml: "കുന്നുംകൈ ബസ് സമയങ്ങൾ",
        subtitle: "Kunnumkai bus schedule",
        url: "/Kunnumkai.html",
        icon: "🚌",
        category: "bus",
        keywords: "kunnumkai kunnumkay kunnum kai കുന്നുംകൈ bus സമയം"
    },
    {
        title_en: "Buses from Malom",
        title_ml: "മാലോം ബസ് സമയങ്ങൾ",
        subtitle: "Malom (Kasaragod) bus schedule",
        url: "/malom.html",
        icon: "🚌",
        category: "bus",
        keywords: "malom മാലോം bus സമയം kattamkavala കാറ്റാംകവല"
    },
    {
        title_en: "Buses from Alakode",
        title_ml: "ആലക്കോട് ബസ് സമയങ്ങൾ",
        subtitle: "Alakode bus timings — Kannur, Cherupuzha, Iritty",
        url: "/Alakode.html",
        icon: "🚌",
        category: "bus",
        keywords: "alakode aalakode aalakkode ആലക്കോട് bus സമയം kannur"
    },
    {
        title_en: "Buses from Konnakkad",
        title_ml: "കൊന്നക്കാട് ബസ് സമയങ്ങൾ",
        subtitle: "Konnakkad bus stop schedule",
        url: "/Konnakkad.html",
        icon: "🚌",
        category: "bus",
        keywords: "konnakkad konakad konnakad കൊന്നക്കാട് bus സമയം"
    },
    {
        title_en: "Buses from Vellarikundu",
        title_ml: "വെള്ളരിക്കുണ്ട് ബസ് സമയങ്ങൾ",
        subtitle: "Vellarikundu RTO area bus schedule",
        url: "/Vellarikundu.html",
        icon: "🚌",
        category: "bus",
        keywords: "vellarikundu vellarikkundu വെള്ളരിക്കുണ്ട് bus സമയം rto kl79"
    },
    {
        title_en: "Buses from Kanhangad / Nileshwar",
        title_ml: "കാഞ്ഞങ്ങാട് / നീലേശ്വരം ബസ് സമയങ്ങൾ",
        subtitle: "Kanhangad & Nileshwar — bus timings",
        url: "/Kanhangad.html",
        icon: "🚌",
        category: "bus",
        keywords: "kanhangad kanjangad nileshwar nileswar കാഞ്ഞങ്ങാട് നീലേശ്വരം bus സമയം"
    },
    {
        title_en: "Buses from Iritty",
        title_ml: "ഇരിട്ടി ബസ് സമയങ്ങൾ",
        subtitle: "Iritty bus stand schedule",
        url: "/Iritty.html",
        icon: "🚌",
        category: "bus",
        keywords: "iritty irity ഇരിട്ടി bus സമയം"
    },
    {
        title_en: "Buses from Olayambadi",
        title_ml: "ഓലയമ്പാടി ബസ് സമയങ്ങൾ",
        subtitle: "Olayambadi bus stop schedule",
        url: "/Olayambadi.html",
        icon: "🚌",
        category: "bus",
        keywords: "olayambadi oolayambadi olyambadi ഓലയമ്പാടി bus സമയം"
    },

    /* ---------- TRAIN STATION PAGES ---------- */
    {
        title_en: "Payyannur Railway Station — Train Timings",
        title_ml: "പയ്യന്നൂർ റെയിൽവേ സ്റ്റേഷൻ — ട്രെയിൻ സമയങ്ങൾ",
        subtitle: "All trains passing through Payyannur",
        url: "/Payyannur.html",
        icon: "🚆",
        category: "train",
        keywords: "payyannur payannur പയ്യന്നൂർ train ട്രെയിൻ railway സ്റ്റേഷൻ station timing"
    },
    {
        title_en: "Nileshwar Railway Station — Train Timings",
        title_ml: "നീലേശ്വരം റെയിൽവേ സ്റ്റേഷൻ — ട്രെയിൻ സമയങ്ങൾ",
        subtitle: "All trains passing through Nileshwar",
        url: "/Nileshwar.html",
        icon: "🚆",
        category: "train",
        keywords: "nileshwar nileswar neeleswaram നീലേശ്വരം train ട്രെയിൻ railway സ്റ്റേഷൻ station timing"
    },
    {
        title_en: "Kannur Railway Station — Train Timings",
        title_ml: "കണ്ണൂർ റെയിൽവേ സ്റ്റേഷൻ — ട്രെയിൻ സമയങ്ങൾ",
        subtitle: "All trains passing through Kannur",
        url: "/Kannur.html",
        icon: "🚆",
        category: "train",
        keywords: "kannur കണ്ണൂർ train ട്രെയിൻ railway സ്റ്റേഷൻ station timing cannanore"
    },

    /* ---------- INFORMATION PAGES ---------- */
    {
        title_en: "Business Directory",
        title_ml: "ബിസിനസ് ഡയറക്ടറി",
        subtitle: "Local shops & services in the KL79 region",
        url: "/Business.html",
        icon: "🏢",
        category: "info",
        keywords: "business shop store shops services കട business directory bussiness listing advertise travels m3 creations"
    },
    {
        title_en: "Tourist Places in KL79 Region",
        title_ml: "ടൂറിസം സ്ഥലങ്ങൾ",
        subtitle: "Places to visit in and around KL79 / Kasaragod",
        url: "/Tourist-Places.html",
        icon: "🏞️",
        category: "info",
        keywords: "tourist tourism കാഴ്ചകൾ places ടൂറിസം സ്ഥലം visit sightseeing ranipuram posadigumpe bekal"
    },
    {
        title_en: "WhatsApp Groups",
        title_ml: "WhatsApp ഗ്രൂപ്പുകൾ",
        subtitle: "Join local WhatsApp groups for news & updates",
        url: "/Whatsapp-groups.html",
        icon: "💬",
        category: "info",
        keywords: "whatsapp group groups ഗ്രൂപ്പ് join community chat news updates"
    },
    {
        title_en: "Local News & Elections",
        title_ml: "തിരഞ്ഞെടുപ്പ് വാർത്തകൾ",
        subtitle: "Latest news and election coverage",
        url: "/Election.html",
        icon: "📰",
        category: "info",
        keywords: "news election വാർത്ത തിരഞ്ഞെടുപ്പ് panchayat vote results"
    },

    /* ---------- PLACES / DESTINATIONS ---------- */
    /* These route users to the nearest/most relevant bus or train page */
    {
        title_en: "Bangalore buses",
        title_ml: "ബാംഗ്ലൂർ ബസ്",
        subtitle: "Night buses to Bangalore (AC sleeper, KSRTC Swift, etc.)",
        url: "/Chittarikkal.html",
        icon: "🚌",
        category: "topic",
        keywords: "bangalore bengaluru ബാംഗ്ലൂർ ബംഗളൂരു bus night ksrtc swift sleeper ac chittarikkal alakode payyavur golden kalpaka kingline"
    },
    {
        title_en: "Ernakulam / Kochi buses",
        title_ml: "എറണാകുളം / കൊച്ചി ബസ്",
        subtitle: "Night buses to Ernakulam & Kottayam",
        url: "/Chittarikkal.html",
        icon: "🚌",
        category: "topic",
        keywords: "ernakulam kochi cochin kottayam എറണാകുളം കൊച്ചി കോട്ടയം bus sleeper jacobs shiya madhavi kalpaka ksrtc"
    },
    {
        title_en: "Mangalore (Mangalapuram) buses",
        title_ml: "മംഗലാപുരം ബസ്",
        subtitle: "Buses towards Mangalore via Kanhangad",
        url: "/Chittarikkal.html",
        icon: "🚌",
        category: "topic",
        keywords: "mangalore mangalapuram mangaluru മംഗലാപുരം bus ksrtc kanhangad"
    },
    {
        title_en: "Mananthavady / Sulthan Bathery buses",
        title_ml: "മാനന്തവാടി / സുൽത്താൻ ബത്തേരി ബസ്",
        subtitle: "Buses towards Wayanad via Iritty",
        url: "/Chittarikkal.html",
        icon: "🚌",
        category: "topic",
        keywords: "mananthavady manandhavadi sultan bathery wayanad iritty kalpetta മാനന്തവാടി സുൽത്താൻ ബത്തേരി വയനാട്"
    },
    {
        title_en: "Thalassery / Kannur side buses",
        title_ml: "തലശ്ശേരി / കണ്ണൂർ ബസ്",
        subtitle: "Buses towards Thalassery, Kannur, Kozhikode",
        url: "/Chittarikkal.html",
        icon: "🚌",
        category: "topic",
        keywords: "thalassery thalasserry kannur kozhikode calicut cannanore തലശ്ശേരി കണ്ണൂർ കോഴിക്കോട് bus"
    },
    {
        title_en: "Parappa / Panathur route buses",
        title_ml: "പരപ്പ / പാണത്തൂർ ബസ്",
        subtitle: "Via Parappa, Odayamchal, Panathur",
        url: "/Vellarikundu.html",
        icon: "🚌",
        category: "topic",
        keywords: "parappa panathur odayamchal പരപ്പ പാണത്തൂർ ഓടയംചാൽ bus vellarikundu"
    },
    {
        title_en: "Cherupuzha / Alakode side buses",
        title_ml: "ചെറുപുഴ / ആലക്കോട് ബസ്",
        subtitle: "Local buses towards Cherupuzha, Alakode, Iritty",
        url: "/Chittarikkal.html",
        icon: "🚌",
        category: "topic",
        keywords: "cherupuzha alakode iritty local bus ചെറുപുഴ ആലക്കോട് ഇരിട്ടി"
    },

    /* ---------- SEARCHABLE TOPICS ---------- */
    {
        title_en: "KSRTC buses",
        title_ml: "കെ.എസ്.ആർ.ടി.സി ബസ്",
        subtitle: "All KSRTC bus timings across the region",
        url: "/Chittarikkal.html",
        icon: "🚌",
        category: "topic",
        keywords: "ksrtc k.s.r.t.c kerala state transport corporation government bus കെ എസ് ആർ ടി സി"
    },
    {
        title_en: "AC Sleeper / Semi-Sleeper buses",
        title_ml: "എ.സി സ്ലീപ്പർ ബസ്",
        subtitle: "Premium night services — Jacobs, Kalpaka, Golden, Shiya",
        url: "/Chittarikkal.html",
        icon: "🛏️",
        category: "topic",
        keywords: "ac sleeper semi sleeper premium night bus jacobs kalpaka golden shiya kingline എസി സ്ലീപ്പർ ബസ്"
    },
    {
        title_en: "Swift / KSRTC Swift buses",
        title_ml: "കെ.എസ്.ആർ.ടി.സി സ്വിഫ്റ്റ്",
        subtitle: "KSRTC Swift premium services",
        url: "/Chittarikkal.html",
        icon: "🚌",
        category: "topic",
        keywords: "swift ksrtc swift air bus സ്വിഫ്റ്റ്"
    },
    {
        title_en: "KL79 / Vellarikundu RTO",
        title_ml: "കെ.എൽ 79 വെള്ളരിക്കുണ്ട് RTO",
        subtitle: "About the KL79 RTO region",
        url: "/",
        icon: "ℹ️",
        category: "topic",
        keywords: "kl79 kl 79 vellarikundu rto vehicle registration കെ എൽ 79 rto kasaragod"
    },
    {
        title_en: "Advertise on KL79.in",
        title_ml: "KL79.in ൽ പരസ്യം നൽകുക",
        subtitle: "Contact us on WhatsApp to advertise your business",
        url: "https://wa.me/916238693615?text=I%20want%20to%20advertise%20on%20KL79.in",
        icon: "📢",
        category: "topic",
        keywords: "advertise ad advertising promote business പരസ്യം whatsapp contact"
    },
    {
        title_en: "Report a timing change",
        title_ml: "സമയം മാറ്റം അറിയിക്കുക",
        subtitle: "WhatsApp us if a bus or train timing has changed",
        url: "https://wa.me/916238693615?text=I%20want%20to%20report%20a%20timing%20change",
        icon: "📱",
        category: "topic",
        keywords: "report change update timing bus train മാറ്റം അറിയിക്കുക contact whatsapp"
    }
];

/*
 * Normalize a string for search matching:
 *  - lowercase
 *  - strip punctuation / accents
 *  - collapse whitespace
 */
window.KL79_normalize = function (str) {
    if (!str) return "";
    return String(str)
        .toLowerCase()
        .normalize("NFKD")
        .replace(/[.,;:!?'"\-_/\\()]+/g, " ")
        .replace(/\s+/g, " ")
        .trim();
};

/*
 * Score an entry against a query. Higher = more relevant.
 * Match logic: we split the query into words and check if each word
 * appears somewhere in the entry's searchable blob. All words must match.
 * Matches in title score higher than matches in keywords.
 */
window.KL79_search = function (query, limit) {
    limit = limit || 12;
    const q = window.KL79_normalize(query);
    if (!q) return [];

    const words = q.split(" ").filter(Boolean);
    if (words.length === 0) return [];

    const results = [];

    window.KL79_SEARCH_DATA.forEach(function (item) {
        const titleBlob = window.KL79_normalize(
            (item.title_en || "") + " " + (item.title_ml || "")
        );
        const subBlob = window.KL79_normalize(item.subtitle || "");
        const kwBlob = window.KL79_normalize(item.keywords || "");
        const fullBlob = titleBlob + " " + subBlob + " " + kwBlob;

        // every query word must appear somewhere in the blob
        let ok = true;
        let score = 0;
        for (let i = 0; i < words.length; i++) {
            const w = words[i];
            if (!fullBlob.includes(w)) { ok = false; break; }
            if (titleBlob.includes(w)) score += 5;
            else if (subBlob.includes(w)) score += 2;
            else score += 1;
            // bonus for exact token match in title
            if ((" " + titleBlob + " ").includes(" " + w + " ")) score += 3;
            // bonus if title starts with the word
            if (titleBlob.startsWith(w)) score += 2;
        }

        if (ok) {
            // category weighting (pages > topics > etc)
            if (item.category === "bus" || item.category === "train" || item.category === "info") score += 2;
            results.push({ item: item, score: score });
        }
    });

    results.sort(function (a, b) { return b.score - a.score; });
    return results.slice(0, limit).map(function (r) { return r.item; });
};
