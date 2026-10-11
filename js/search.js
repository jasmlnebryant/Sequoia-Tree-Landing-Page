// Search page: covers Figma screens 12 (entry), 13 (autocomplete),
// 14–15 (results), 16 (filters), 17 (filtered results) and 19 (no results).
// Results come from a small index of the prototype's pages.

(() => {
  const site = window.SequoiaSite;
  const form = document.getElementById("search-form");
  if (!form || !site) return;

  const input = document.getElementById("q");
  const view = document.getElementById("search-view");
  const clearBtn = form.querySelector("[data-clear]");
  const filterBtn = form.querySelector("[data-open-filters]");
  const sheet = document.getElementById("filter-sheet");
  const filterForm = document.getElementById("filter-form");

  /* ---------- Index ---------- */
  const VI = "Visitor Information";
  const ENTRIES = [
    { title: "Tickets & Tours", desc: "Buy entrance passes, book Crystal Cave time slots and find free ranger programs and day plans.", type: VI, loc: "Park-wide", href: "tickets-and-tours.html",
      kw: "ticket tickets buy book booking tours tour packages package passes pass reservation reservations day plans" },
    { title: "Entrance Fees & Passes", desc: "Compare entry options and find official purchase information.", type: VI, loc: "Park-wide", href: "fees-and-passes.html",
      kw: "fees fee passes pass ticket tickets entrance price prices cost annual purchase buy america beautiful" },
    { title: "Crystal Cave Guided Tour", desc: "A 50-minute guided cave tour with timed entry. $22 adult · $11 child. Sold online only.", type: "Tour", loc: "Sequoia NP", href: "crystal-cave.html", urgency: "2 left today",
      kw: "crystal cave tour tours ticket tickets timed time slot booking book guided marble kids family" },
    { title: "Hours & Seasons", desc: "Check access information before choosing when to visit.", type: VI, loc: "Park-wide", href: "hours-and-seasons.html",
      kw: "ticket tickets today hours open opening seasons season winter summer snow roads closures time" },
    { title: "Accessible Trails & Routes", desc: "Compare surfaces, steps and route details to plan for your access needs. Paved options include the Big Trees Trail and the Sherman Tree accessible trail.", type: VI, loc: "Park-wide", href: "accessible-trails.html",
      kw: "wheelchair access accessible accessibility trails trail routes route paved mobility step-free" },
    { title: "General Sherman: Accessible Approach", desc: "Review the approach to the landmark, including parking and route features. Paved, about 500 ft from the accessible lot on the Generals Highway.", type: "Landmark", loc: "Giant Forest", href: "general-sherman-tree.html#accessible-approach",
      kw: "wheelchair access accessible general sherman parking landmark tree approach" },
    { title: "Parking & Mobility Support", desc: "Find parking and mobility planning information before choosing an arrival point. Free temporary placards at visitor centers; summer shuttles are wheelchair-accessible.", type: VI, loc: "Park-wide", href: "#",
      kw: "wheelchair access accessible parking mobility placard shuttle" },
    { title: "Facilities & Sensory Resources", desc: "Review facilities and sensory resources that may be relevant to your visit. Free wheelchair loans, tactile exhibits and assistive listening for park films.", type: VI, loc: "Park-wide", href: "#",
      kw: "wheelchair access accessible facilities sensory restrooms loan tactile hearing vision" },
    { title: "Big Trees Trail", desc: "A 0.75 mi paved loop with a long boardwalk around Round Meadow.", type: "Trail", loc: "Giant Forest", href: "accessible-trails.html#big-trees-trail",
      kw: "trail trails big trees walk wheelchair access accessible paved meadow boardwalk" },
    { title: "Congress Trail", desc: "A 2.7 mi paved loop that starts near the General Sherman Tree.", type: "Trail", loc: "Giant Forest", href: "#",
      kw: "trail trails congress walk paved sherman hike" },
    { title: "General Grant Tree Trail", desc: "A 0.3 mi paved loop to the world's second-largest tree. Steep in places.", type: "Trail", loc: "Grant Grove", href: "accessible-trails.html?grove=grant#general-grant-tree-trail",
      kw: "trail trails general grant tree walk paved" },
    { title: "Giant Forest", desc: "Explore General Sherman and nearby sequoia trails.", type: "Grove", loc: "Giant Forest", href: "giant-forest.html",
      kw: "giant forest grove sherman trees sequoia" },
    { title: "General Sherman Tree", desc: "The largest tree on Earth by volume, with approach, parking and seasonal information.", type: "Landmark", loc: "Giant Forest", href: "general-sherman-tree.html",
      kw: "general sherman tree largest parking landmark sequoia" },
    { title: "Compare Groves", desc: "Compare the landmarks and planning information for Giant Forest and Grant Grove.", type: "Grove", loc: "Park-wide", href: "compare-groves.html",
      kw: "compare groves grove giant grant forest" },
    { title: "Why the Sequoias Matter", desc: "Discover the ecology, conservation, and human history of the sequoia groves.", type: "Learning", loc: "Park-wide", href: "about-the-sequoias.html",
      kw: "sequoia sequoias about ecology fire climate conservation history facts" },
    { title: "People & History", desc: "Indigenous connections, the protection of the groves and the history of the parks.", type: "Learning", loc: "Park-wide", href: "people-and-history.html",
      kw: "sequoia history people indigenous protection soldiers park" },
    { title: "Ranger Walks & Junior Ranger", desc: "Free ranger walks and talks, plus the Junior Ranger booklet at any visitor center.", type: "Tour", loc: "Park-wide", href: "tickets-and-tours.html#free-programs",
      kw: "ranger rangers walk walks talk talks program programs junior kids children free events tours guided" },
    { title: "Ready-made Day Plans", desc: "Pairings like Big Trees Day: a vehicle pass plus a Crystal Cave tour and the free shuttle.", type: "Tour", loc: "Park-wide", href: "tickets-and-tours.html#day-plans",
      kw: "package packages day plan plans itinerary itineraries bundle family tours" },
    { title: "Moro Rock", desc: "A granite dome with 350+ stairs to the summit. Free seasonal shuttle Route 2.", type: "Nearby", loc: "Giant Forest", href: "index.html#area-title",
      kw: "moro rock view viewpoint stairs climb nearby area" },
    { title: "Lodgepole Market & Grill", desc: "Groceries and grill meals about a 10 minute drive from Giant Forest Museum.", type: "Nearby", loc: "Giant Forest", href: "index.html#area-title",
      kw: "food eat restaurant grill market groceries lodgepole nearby" },
    { title: "Language Options", desc: "The park's Map & Guide comes in Spanish, French, German, Italian and Simplified Chinese. Braille guides at visitor centers.", type: VI, loc: "Park-wide", href: "#language",
      kw: "language languages translation spanish espanol french german italian chinese braille international" },
    { title: "Park Shuttles", desc: "Free seasonal shuttles link Giant Forest stops; the Sequoia Shuttle from Visalia needs a reservation.", type: VI, loc: "Giant Forest", href: "#",
      kw: "shuttle shuttles bus times schedule transit visalia free route moro sherman" },
    { title: "Plan Your Visit", desc: "Fees, hours, directions, accessibility and safety in one place.", type: VI, loc: "Park-wide", href: "plan-your-visit.html",
      kw: "plan visit trip planning essentials" },
  ];
  ENTRIES.forEach((e) => { e.words = (e.title + " " + e.kw).toLowerCase().split(/[^a-z0-9-]+/).filter(Boolean); });

  const TRENDING = [["Crystal Cave tickets", true], ["Hours today", false], ["Shuttle times", false], ["Parking at Sherman", false]];
  const SUGGESTED = ["Entrance passes", "Hours and seasons", "General Sherman parking", "Wheelchair access", "Sequoia history"];
  const POOL = ["tickets", "ticket prices", "crystal cave tickets", "tours", "ranger walks", "day plans", "language", "moro rock", "food", "entrance passes", "hours and seasons", "general sherman parking", "wheelchair access",
    "accessible trails", "sequoia history", "giant forest", "grant grove", "big trees trail", "congress trail"];
  const RELATED = [["Accessible Trails & Routes", "accessible-trails.html"], ["Tickets & Tours", "tickets-and-tours.html"], ["Parking & Mobility Support", "#"], ["Visitor Help", "#"]];
  const STOP = new Set(["and", "the", "of", "for", "to", "a", "an", "in", "at", "near"]);

  const tokens = (q) => q.toLowerCase().split(/[^a-z0-9-]+/).filter((t) => t && !STOP.has(t));
  const matches = (entry, q) => {
    const ts = tokens(q);
    return ts.length > 0 && ts.every((t) => entry.words.some((w) => w.startsWith(t)));
  };
  const search = (q, f) => ENTRIES.filter((e) => matches(e, q) && (!f.loc || e.loc === f.loc) && (!f.type || e.type === f.type));

  /* ---------- State ---------- */
  const state = {
    q: site.params.get("q") || "",
    loc: site.params.get("loc") || "",
    type: site.params.get("type") || "",
    submitted: !!site.params.get("q"),
  };

  const esc = (s) => String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
  const icon = (name, size = 18) => `<svg class="icon icon--${size}" aria-hidden="true"><use href="#i-${name}"/></svg>`;
  const ICONS = { Trail: "route", Landmark: "tree", Grove: "tree", Learning: "leaf", Tour: "ticket", Nearby: "pin" };
  const iconFor = (e) => ICONS[e.type] || (/access|wheelchair/i.test(e.title) ? "access" : /parking/i.test(e.title) ? "car" : /hour/i.test(e.title) ? "clock" : /facilit/i.test(e.title) ? "building" : "ticket");
  const quote = (q) => `‘${esc(q)}’`;

  const syncUrl = () => {
    if (site.embedded) return;
    const p = new URLSearchParams();
    if (state.submitted && state.q) p.set("q", state.q);
    if (state.loc) p.set("loc", state.loc);
    if (state.type) p.set("type", state.type);
    try { history.replaceState(null, "", "search.html" + (p.toString() ? "?" + p : "")); } catch {}
  };

  /* ---------- Views ---------- */
  const listCard = (rows) => `<ul class="list-card">${rows.join("")}</ul>`;
  const suggestionRow = (label, typed = "") => {
    const lower = label.toLowerCase();
    const shown = typed && lower.startsWith(typed.toLowerCase())
      ? `<mark>${esc(label.slice(0, typed.length))}</mark><span class="rest">${esc(label.slice(typed.length))}</span>`
      : esc(label);
    const hot = /crystal cave/i.test(label) ? `<span class="urgency">${icon("flame", 14)}<span>2 left today</span></span>` : "";
    return `<li><button class="list-row" type="button" data-run="${esc(label)}"><span class="list-row__icon">${icon("search", 16)}</span><span class="list-row__label">${shown}</span>${hot}${icon("upright", 16)}</button></li>`;
  };
  const pageRow = (e) => `<li><a class="list-row" href="${esc(e.href)}"><span class="list-row__icon">${icon(iconFor(e), 16)}</span><span class="list-row__label">${esc(e.title)}</span>${icon("right", 16)}</a></li>`;

  function renderIdle() {
    view.innerHTML = `<section class="search-group">
        <p class="search-suggest__label">Trending now</p>
        <div class="suggest-chips">${TRENDING.map(([l, hot]) => `<button class="suggest-chip${hot ? " suggest-chip--hot" : ""}" type="button" data-run="${esc(l)}">${icon(hot ? "flame" : "search", 14)}${esc(l)}</button>`).join("")}</div>
      </section>
      <section class="search-group">
        <header class="section-header"><p class="eyebrow">Need ideas?</p><h2 class="section-title">Suggested searches</h2></header>
        ${listCard(SUGGESTED.map((s) => suggestionRow(s)))}
      </section>`;
  }

  function renderTyping(q) {
    const words = q.toLowerCase();
    const sugg = POOL.filter((s) => s.startsWith(words) || s.split(" ").some((w) => w.startsWith(words))).slice(0, 4);
    const pages = ENTRIES.filter((e) => matches(e, q)).slice(0, 3);
    view.innerHTML = `
      ${sugg.length ? `<section class="search-group"><h2 class="section-title section-title--sm">Suggested searches</h2>${listCard(sugg.map((s) => suggestionRow(s, q)))}</section>` : ""}
      ${pages.length ? `<section class="search-group"><h2 class="section-title section-title--sm">Suggested pages</h2>${listCard(pages.map(pageRow))}</section>` : ""}
      <button class="btn btn--outline" type="button" data-run="${esc(q)}"><span>See all results for ${quote(q)}</span>${icon("right")}</button>`;
  }

  function renderResults() {
    const results = search(state.q, state);
    const filtered = !!(state.loc || state.type);
    if (!results.length && !filtered) return renderEmpty();

    const typeLabel = { [VI]: "Visitor Information", Trail: "Trails", Landmark: "Landmarks" }[state.type] || "All";
    const filters = filtered
      ? `<div class="chips">
          ${state.loc ? `<button class="chip chip--active" type="button" data-remove="loc">${esc(state.loc)} ${icon("close", 14)}<span class="visually-hidden">Remove filter</span></button>` : ""}
          ${state.type ? `<button class="chip chip--active" type="button" data-remove="type">${esc(typeLabel)} ${icon("close", 14)}<span class="visually-hidden">Remove filter</span></button>` : ""}
          <button class="chip" type="button" data-clear-all>${icon("close", 16)}Clear Filters</button>
          <button class="chip" type="button" data-edit-filters>${icon("edit", 16)}Edit Filters</button>
        </div>`
      : `<div class="filter-buttons">
          <div><button class="filter-btn filter-btn--active" type="button" data-edit-filters><span class="filter-btn__icon">${icon("sliders")}</span><span>Filters</span>${icon("down")}</button></div>
          <div><button class="filter-btn" type="button" data-edit-filters><span class="filter-btn__icon">${icon("pin")}</span><span>Location: All Locations</span>${icon("down")}</button>
            <p class="filter-note">Options: All Locations / Giant Forest / Grant Grove</p></div>
          <div><button class="filter-btn" type="button" data-edit-filters><span class="filter-btn__icon">${icon("file")}</span><span>Content Type: All</span>${icon("down")}</button>
            <p class="filter-note">Options: All / Visitor Information / Trails / Landmarks</p></div>
        </div>`;

    view.innerHTML = `
      <header class="results-head">
        <p class="eyebrow">${filtered ? "Filtered results" : "Search results"}</p>
        <h2 class="results-title">Results for ${quote(state.q)}</h2>
      </header>
      ${filters}
      ${results.length ? `<div class="result-list">${results.map((e) => `
        <article class="card result">
          <p class="result__meta"><span class="result__icon">${icon(iconFor(e))}</span>${esc(e.type)} · ${esc(e.loc)}</p>
          <h3 class="card__title">${esc(e.title)}</h3>
          ${e.urgency ? `<span class="urgency">${icon("flame", 14)}<span>${esc(e.urgency)}</span></span>` : ""}
          <p class="card__desc">${esc(e.desc)}</p>
          <a class="inset-row" href="${esc(e.href)}"><span>View ${esc(e.title)}</span>${icon("right")}</a>
        </article>`).join("")}</div>`
        : `<p class="page-desc">Clear a filter to see more results for ${quote(state.q)}.</p>`}`;
  }

  function renderEmpty() {
    view.innerHTML = `
      <div class="empty">
        <svg class="empty-art" viewBox="0 0 120 120" aria-hidden="true">
          ${[52, 42, 33, 24, 15].map((r, i) => `<circle cx="60" cy="60" r="${r}" fill="none" stroke="#B5582F" stroke-opacity="${0.55 - i * 0.07}" stroke-width="${i === 1 ? 2 : 1.2}"/>`).join("")}
          <circle cx="60" cy="60" r="7" fill="#B5582F"/>
        </svg>
        <h2 class="results-title">Here's what's close to ${quote(state.q)}</h2>
        <p class="page-desc">Try a different phrase, or explore these related topics.</p>
      </div>
      <section class="search-group">
        <header class="section-header"><p class="eyebrow">Related topics</p></header>
        <ul class="nav-rows">${RELATED.map(([l, h]) => `<li><a class="nav-row" href="${h}"><span class="nav-row__icon">${icon(/access/i.test(l) ? "access" : /parking/i.test(l) ? "car" : "help", 20)}</span><span class="nav-row__text"><span class="nav-row__label">${esc(l)}</span></span><svg class="icon icon--18 nav-row__arrow" aria-hidden="true"><use href="#i-right"/></svg></a></li>`).join("")}</ul>
      </section>
      <div class="actions">
        <button class="btn btn--outline" type="button" data-edit-search>${icon("edit")}<span>Edit Search</span></button>
        <a class="btn btn--clay-pill" href="#"><span>Contact a Ranger</span><span class="circle circle--cream circle--42" aria-hidden="true">${icon("right")}</span></a>
      </div>`;
  }

  function render() {
    const typed = input.value.trim();
    clearBtn.hidden = !input.value;
    filterBtn.hidden = !(state.submitted && typed === state.q && state.q);
    if (!typed) renderIdle();
    else if (state.submitted && typed === state.q) renderResults();
    else renderTyping(typed);
  }

  function run(q) {
    state.q = q.trim();
    state.submitted = !!state.q;
    input.value = state.q;
    syncUrl();
    render();
  }

  /* ---------- Filter sheet ---------- */
  let lastFocus = null;
  function openFilters() {
    lastFocus = document.activeElement;
    sheet.querySelector("[data-query-label]").textContent = state.q;
    filterForm.loc.value = state.loc;
    filterForm.type.value = state.type;
    sheet.hidden = false;
    sheet.querySelector('input[name="loc"]:checked').focus();
  }
  function closeFilters() {
    sheet.hidden = true;
    lastFocus?.focus?.();
  }

  /* ---------- Events ---------- */
  input.addEventListener("input", render);
  // Enter is handled directly: sandboxed hosts block form submission.
  const submitSearch = (e) => { e.preventDefault(); run(input.value); input.blur(); };
  form.addEventListener("submit", submitSearch);
  input.addEventListener("keydown", (e) => { if (e.key === "Enter") submitSearch(e); });
  clearBtn.addEventListener("click", () => { input.value = ""; state.submitted = false; state.loc = state.type = ""; syncUrl(); render(); input.focus(); });
  filterBtn.addEventListener("click", openFilters);

  view.addEventListener("click", (e) => {
    const t = e.target.closest("button");
    if (!t) return;
    if (t.dataset.run) run(t.dataset.run);
    else if ("editFilters" in t.dataset) openFilters();
    else if (t.dataset.remove) { state[t.dataset.remove] = ""; syncUrl(); render(); }
    else if ("clearAll" in t.dataset) { state.loc = state.type = ""; syncUrl(); render(); }
    else if ("editSearch" in t.dataset) { input.focus(); input.select(); }
  });

  const applyFilters = (e) => {
    e.preventDefault();
    state.loc = filterForm.loc.value;
    state.type = filterForm.type.value;
    syncUrl();
    closeFilters();
    render();
  };
  filterForm.addEventListener("submit", applyFilters);
  filterForm.querySelector('[type="submit"]').addEventListener("click", applyFilters);
  sheet.querySelector("[data-clear-filters]").addEventListener("click", () => { filterForm.loc.value = ""; filterForm.type.value = ""; });
  sheet.querySelectorAll("[data-close-filters]").forEach((b) => b.addEventListener("click", closeFilters));
  document.addEventListener("keydown", (e) => { if (e.key === "Escape" && !sheet.hidden) closeFilters(); });

  /* ---------- Start ---------- */
  input.value = state.q;
  render();
  if (!state.q) input.focus({ preventScroll: true });
})();
