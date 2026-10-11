// Builds the prototype's pages from content/site.mjs.
//   node scripts/build-pages.mjs
// - Writes one HTML file per page in PAGES, plus search.html.
// - Refreshes the shared sprite, header and footer inside index.html.
// - Points every placeholder link (href="#") at its page using LINKS, by label.

import { readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { LINKS, ICON_RULES, NAV, MENU, FOOTER, PAGES } from "../content/site.mjs";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const SITE = "Visit the Giant Sequoias";

/* ---------- helpers ---------- */
const esc = (s) => String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
const slug = (s) => String(s).toLowerCase().replace(/[’']/g, "").replace(/&/g, "and").replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
const hrefFor = (label) => LINKS[label] || "#";
const iconFor = (label) => (ICON_RULES.find(([re]) => re.test(label)) || [null, "leaf"])[1];
const isExternal = (href) => /^https?:/.test(href);
const linkAttrs = (href) => `href="${esc(href)}"${isExternal(href) ? ' target="_blank" rel="noopener"' : ""}`;
const icon = (name, size = 20, cls = "") => `<svg class="icon icon--${size}${cls ? " " + cls : ""}" aria-hidden="true"><use href="#i-${name}"/></svg>`;

/* ---------- icon sprite ---------- */
const ICONS = {
  search: '<circle cx="11" cy="11" r="7"/><path d="m20 20-4-4"/>',
  menu: '<path d="M4 7h16M4 12h10M4 17h16"/>',
  close: '<path d="M6 6l12 12M18 6 6 18"/>',
  right: '<path d="M5 12h14M13 6l6 6-6 6"/>',
  left: '<path d="M19 12H5M11 6l-6 6 6 6"/>',
  upright: '<path d="M7 17 17 7M8 7h9v9"/>',
  ext: '<path d="M14 4h6v6M20 4l-9 9"/><path d="M18 14v6H4V6h6"/>',
  ticket: '<path d="M3 8a2 2 0 0 0 2-2h14a2 2 0 0 0 2 2v2a2 2 0 0 0 0 4v2a2 2 0 0 0-2 2H5a2 2 0 0 0-2-2v-2a2 2 0 0 0 0-4z"/><path d="M13 6v2M13 11v2M13 16v2"/>',
  clock: '<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>',
  nav: '<path d="M3 11 21 3l-8 18-2-8z"/>',
  car: '<path d="M5 17h14v-5l-2-5H7l-2 5z"/><circle cx="7.5" cy="17.5" r="1.5"/><circle cx="16.5" cy="17.5" r="1.5"/>',
  access: '<circle cx="12" cy="4.5" r="1.8"/><path d="M5 8.5h14M12 8.5v5.5M8.5 21l3.5-7 3.5 7"/>',
  route: '<circle cx="6" cy="19" r="3"/><path d="M9 19h8.5a3.5 3.5 0 0 0 0-7h-11a3.5 3.5 0 0 1 0-7H15"/><circle cx="18" cy="5" r="3"/>',
  cal: '<rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/>',
  shield: '<path d="M12 2 4 5v6c0 5 3.5 9 8 11 4.5-2 8-6 8-11V5z"/>',
  alert: '<path d="M10.3 3.9 1.8 18a2 2 0 0 0 1.7 3h17a2 2 0 0 0 1.7-3L13.7 3.9a2 2 0 0 0-3.4 0z"/><path d="M12 9v4M12 17h.01"/>',
  map: '<path d="M9 3 3 6v15l6-3 6 3 6-3V3l-6 3z"/><path d="M9 3v15M15 6v15"/>',
  food: '<path d="M7 3v8a2 2 0 0 0 2 2v8M5 3v5M9 3v5M17 3c-2 0-3 2-3 5s1 4 3 4v9"/>',
  book: '<path d="M4 4h6a3 3 0 0 1 3 3v13a2 2 0 0 0-2-2H4z"/><path d="M20 4h-6a3 3 0 0 0-3 3"/><path d="M20 4v14h-7"/>',
  leaf: '<path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.5 19 2c1 2 2 4.2 2 8 0 5.5-4.8 10-10 10z"/><path d="M2 21c0-3 1.9-5.4 5-6"/>',
  tree: '<path d="M12 2 6 10h3l-4 6h14l-4-6h3z"/><path d="M12 16v6"/>',
  flame: '<path d="M12 22c4 0 7-3 7-7 0-4-3-6-4-10-2 2-3 4-3 6-1-1-2-2-2-4-2 2-5 5-5 8 0 4 3 7 7 7z"/>',
  globe: '<circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3c3 3 3 15 0 18M12 3c-3 3-3 15 0 18"/>',
  compare: '<rect x="3" y="4" width="7" height="16" rx="1.5"/><rect x="14" y="4" width="7" height="16" rx="1.5"/>',
  help: '<circle cx="12" cy="12" r="9"/><path d="M9.5 9a2.5 2.5 0 0 1 4.9.8c0 1.7-2.4 2.2-2.4 3.7"/><path d="M12 17h.01"/>',
  home: '<path d="M3 11 12 4l9 7"/><path d="M5 10v10h14V10"/>',
  building: '<rect x="4" y="3" width="16" height="18" rx="1.5"/><path d="M9 7h1M14 7h1M9 11h1M14 11h1M9 15h1M14 15h1"/>',
  image: '<rect x="3" y="3" width="18" height="18" rx="3"/><circle cx="9" cy="9" r="2"/><path d="m21 15-5-5L5 21"/>',
  edit: '<path d="M12 20h9"/><path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4z"/>',
  camera: '<path d="M4 7h3l2-3h6l2 3h3v13H4z"/><circle cx="12" cy="13" r="3.5"/>',
  file: '<path d="M6 3h8l4 4v14H6z"/><path d="M14 3v4h4M9 12h6M9 16h6"/>',
  sliders: '<path d="M4 6h10M4 12h4M12 12h8M4 18h12"/><circle cx="16" cy="6" r="2"/><circle cx="10" cy="12" r="2"/><circle cx="18" cy="18" r="2"/>',
  pin: '<path d="M12 21s-7-6.2-7-11a7 7 0 0 1 14 0c0 4.8-7 11-7 11z"/><circle cx="12" cy="10" r="2.5"/>',
  minus: '<path d="M5 12h14"/>',
  plus: '<path d="M12 5v14M5 12h14"/>',
  down: '<path d="m6 9 6 6 6-6"/>',
  yes: '<path d="m5 12 5 5 9-10"/>',
  no: '<path d="M7 7l10 10M17 7 7 17"/>',
  partial: '<path d="M6 12h12"/>',
};
const SPRITE = `  <svg class="sprite" aria-hidden="true" focusable="false">
    <defs>
${Object.entries(ICONS).map(([k, v]) => `      <symbol id="i-${k}" viewBox="0 0 24 24">${v}</symbol>`).join("\n")}
    </defs>
  </svg>`;

/* ---------- header, menu, footer ---------- */
function header(active, variant, back) {
  if (variant === "search") {
    return `  <header class="site-header site-header--search">
    <div class="container site-header__bar">
      <h1 class="brand brand--page">Search</h1>
      <a class="close-pill" href="index.html">${icon("close", 16)}Close</a>
    </div>
  </header>`;
  }
  const menuRow = (label) => `<li><a class="menu-row" href="#">${label}${icon("right", 16)}</a></li>`;
  return `  <header class="site-header">
    <div class="container site-header__bar">
      <div class="header-lead">
        ${back ? `<a class="back-btn" href="${back}" aria-label="Back" data-back>${icon("left", 22)}</a>` : ""}
        <a class="brand" href="index.html"><span class="brand__line">Visit the Giant</span> <span class="brand__line">Sequoias</span></a>
      </div>

      <nav class="utility-nav" aria-label="Utilities">
        <a class="pill-link" href="search.html">${icon("search", 18)}Search${icon("right", 16, "pill-link__arrow")}</a>
        <a class="pill-link" href="#">${icon("alert", 18)}Alerts &amp; Conditions${icon("right", 16, "pill-link__arrow")}</a>
        <a class="pill-link" href="#">${icon("map", 18)}Maps${icon("right", 16, "pill-link__arrow")}</a>
      </nav>

      <div class="header-actions">
        <a class="icon-btn icon-btn--cream" href="search.html" aria-label="Search">${icon("search", 20)}</a>
        <button class="icon-btn icon-btn--sage" type="button" aria-label="Open menu" aria-expanded="false" aria-controls="menu-drawer" data-menu-toggle>
          <svg class="icon icon--20" aria-hidden="true" data-menu-icon><use href="#i-menu"/></svg>
        </button>
      </div>
    </div>

    <nav class="desktop-nav" aria-label="Main">
      <ul class="container desktop-nav__list">
${NAV.map(([label, key]) => `        <li><a href="#"${key === active ? ' aria-current="page"' : ""}>${esc(label)}${icon("right", 16)}</a></li>`).join("\n")}
      </ul>
    </nav>

    <nav class="menu-drawer" id="menu-drawer" aria-label="Menu">
      <div class="container menu-drawer__inner">
        <div class="menu-group">
          <p class="menu-group__head"><span>${esc(MENU.group.title)}</span><span class="circle circle--clay circle--32" aria-hidden="true">${icon("minus", 16)}</span></p>
          <ul class="menu-group__list">
${MENU.group.items.map((l) => `            <li><a class="menu-group__row" href="#"><span class="menu-group__icon">${icon(iconFor(l), 18)}</span><span>${esc(l)}</span>${icon("right", 16)}</a></li>`).join("\n")}
          </ul>
          <a class="menu-group__overview" href="#">${esc(MENU.group.overview)}${icon("right", 16)}</a>
        </div>
        <ul class="menu-rows">
${MENU.sections.map((l) => `          ${menuRow(esc(l))}`).join("\n")}
        </ul>
        <p class="menu-label">Utilities</p>
        <ul class="menu-rows">
${MENU.utilities.map((l) => `          ${menuRow(esc(l))}`).join("\n")}
          ${menuRow("Home")}
        </ul>
      </div>
    </nav>
  </header>`;
}

const footer = () => `  <footer class="site-footer">
    <nav class="container" aria-label="Footer">
      <ul class="footer-rows">
${FOOTER.map((l) => `        <li><a href="#">${esc(l)}<span aria-hidden="true">→</span></a></li>`).join("\n")}
      </ul>
    </nav>
  </footer>

  <div class="toast" role="status" aria-live="polite" data-toast hidden></div>`;

/* ---------- section pieces ---------- */
const DARK = new Set(["bark", "moss"]);
const eyebrowTone = (bg) => (bg === "bark" ? " eyebrow--peach" : bg === "moss" ? " eyebrow--sage" : "");

function crumbs(list) {
  if (!list?.length) return "";
  const items = list.map((l) => {
    const h = hrefFor(l);
    return h === "#" ? `<li><span>${esc(l)}</span></li>` : `<li><a href="${h}">${esc(l)}</a></li>`;
  });
  return `<nav class="breadcrumb" aria-label="Breadcrumb"><ol>${items.join("")}</ol></nav>`;
}

function sectionHead({ eyebrow, title, desc }, bg, level = 2) {
  if (!eyebrow && !title && !desc) return "";
  return `<header class="section-header${DARK.has(bg) ? " section-header--dark" : ""}">
          ${eyebrow ? `<p class="eyebrow${eyebrowTone(bg)}">${esc(eyebrow)}</p>` : ""}
          ${title ? `<h${level} class="section-title">${esc(title)}</h${level}>` : ""}
          ${desc ? `<p class="section-desc">${esc(desc)}</p>` : ""}
        </header>`;
}

const btnPrimary = (label, bg, ic = "right") => DARK.has(bg)
  ? `<a class="btn btn--cream-pill" href="#"><span>${esc(label)}</span><span class="circle circle--clay circle--42" aria-hidden="true">${icon(ic, 18)}</span></a>`
  : `<a class="btn btn--clay-pill" href="#"><span>${esc(label)}</span><span class="circle circle--cream circle--42" aria-hidden="true">${icon(ic, 18)}</span></a>`;
const btnSecondary = (label, bg, ic = "right", left = false) =>
  `<a class="btn ${DARK.has(bg) ? "btn--outline-light" : "btn--outline"}" href="#">${left ? icon(ic, 18) : ""}<span>${esc(label)}</span>${left ? "" : icon(ic, 18)}</a>`;

function meter(level, small = false) {
  return `<span class="meter${small ? " meter--sm" : ""}" aria-hidden="true">${[1, 2, 3].map((n) => `<span${n <= level ? ' class="is-on"' : ""}></span>`).join("")}</span>`;
}
const LEVELS = { 1: "Easy", 2: "Moderate", 3: "Strenuous" };
const FEAT_LABEL = { yes: "Yes", no: "No", partial: "Partly" };

function rating({ level, feats }) {
  return `<div class="rating">
            <div class="rating__row"><span class="rating__label">Difficulty</span><span class="rating__value">${meter(level)}<strong>${LEVELS[level]}</strong></span></div>
            <hr class="rating__rule">
            <span class="rating__label">Accessibility</span>
            <ul class="rating__feats">
${feats.map(([st, label]) => `              <li class="feat feat--${st}"><span class="feat__dot">${icon(st, 14)}</span><span class="visually-hidden">${FEAT_LABEL[st]}: </span>${esc(label)}</li>`).join("\n")}
            </ul>
            <p class="rating__note">Based on NPS trail information · Visitor reviews coming later</p>
          </div>`;
}

const ringMarker = `<svg class="fact__marker" viewBox="0 0 20 20" aria-hidden="true"><circle cx="10" cy="10" r="8.25" fill="none" stroke="currentColor" stroke-width="1.5"/><circle cx="10" cy="10" r="3.5" fill="currentColor"/></svg>`;

function card(c) {
  const id = c.title ? ` id="${slug(c.title)}"` : "";
  const photo = c.img ? `<img class="card__photo" src="${c.img.src}" alt="${esc(c.img.alt)}" loading="lazy">` : "";
  const head = (c.loc || c.title || c.desc) ? `<div class="card__head">
            ${c.loc ? `<p class="card__loc">${esc(c.loc)}</p>` : ""}
            ${c.title ? `<h2 class="card__title${c.img ? " card__title--lg" : ""}">${esc(c.title)}</h2>` : ""}
            ${c.desc ? `<p class="card__desc">${esc(c.desc)}</p>` : ""}
          </div>` : "";
  const facts = c.fields ? `<dl class="facts">
${c.fields.map(([l, v]) => `            <div class="fact">${ringMarker}<div><dt>${esc(l)}</dt><dd>${esc(v)}</dd></div></div>`).join("\n")}
          </dl>` : "";
  const links = c.links ? `<ul class="inset-links">
${c.links.map((l) => `            <li><a class="inset-row" href="#"><span>${esc(l)}</span>${icon(isExternal(hrefFor(l)) ? "ext" : "right", 18)}</a></li>`).join("\n")}
          </ul>` : "";
  const cta = c.cta ? btnPrimary(c.cta, "sand") : "";
  return `<article class="card${c.img ? " card--photo" : ""}"${id}>
          ${photo}
          <div class="card__body">
          ${head}
          ${c.rating ? rating(c.rating) : ""}
          ${facts}
          ${links}
          ${cta}
          </div>
        </article>`;
}

const R = {
  intro: (b) => `<div class="intro">
        ${crumbs(b.crumbs)}
        ${b.eyebrow ? `<p class="eyebrow">${esc(b.eyebrow)}</p>` : ""}
        <h1 class="page-title">${esc(b.title)}</h1>
        ${b.desc ? `<p class="page-desc">${esc(b.desc)}</p>` : ""}
      </div>`,

  hero: (b) => `${crumbs(b.crumbs)}
      <div class="page-hero">
        <img src="${b.img.src}" alt="${esc(b.img.alt)}">
        <div class="page-hero__shade" aria-hidden="true"></div>
        <div class="page-hero__text">
          ${b.eyebrow ? `<p class="eyebrow eyebrow--peach">${esc(b.eyebrow)}</p>` : ""}
          <h1 class="page-hero__title">${esc(b.title)}</h1>
          ${b.desc ? `<p class="page-hero__desc">${esc(b.desc)}</p>` : ""}
        </div>
      </div>`,

  tiles: (b) => `${sectionHead(b, b.bg)}
      <ul class="tiles${b.cols === 3 ? " tiles--3" : ""}">
${b.items.map((l) => `        <li><a class="tile" href="#"><span class="tile__top"><span class="tile__icon">${icon(iconFor(l), 24)}</span>${icon("upright", 16, "tile__arrow")}</span><span class="tile__label">${esc(l)}</span></a></li>`).join("\n")}
      </ul>`,

  rows: (b) => `${sectionHead(b, b.bg)}
      <ul class="nav-rows">
${b.items.map((it) => {
    const item = typeof it === "string" ? { label: it } : it;
    const meta = item.level ? `<span class="nav-row__meta">${meter(item.level, true)}${LEVELS[item.level]} · ${esc(item.meta)}</span>` : "";
    return `        <li><a class="nav-row" href="#"><span class="nav-row__icon">${icon(iconFor(item.label), 20)}</span><span class="nav-row__text"><span class="nav-row__label">${esc(item.label)}</span>${meta}</span>${icon("right", 18, "nav-row__arrow")}</a></li>`;
  }).join("\n")}
      </ul>`,

  facts: (b) => `${b.outer ? sectionHead({ eyebrow: b.outer }, b.bg) : ""}
      ${card(b)}`,

  feature: (b) => `${sectionHead({ eyebrow: b.eyebrow }, b.bg)}
      <article class="feature">
        <img class="feature__photo" src="${b.img.src}" alt="${esc(b.img.alt)}" loading="lazy">
        <div class="feature__text">
          <h2 class="feature__title">${esc(b.title)}</h2>
          <p class="feature__desc">${esc(b.desc)}</p>
          <a class="pill pill--clay" href="#">${esc(b.cta)}${icon("right", 14)}</a>
        </div>
      </article>`,

  ugc: (b) => `${sectionHead(b, b.bg)}
      <ul class="log-slices">
        <li><a class="log-slice" href="#">${icon("image", 24)}<span>Visitor photo</span></a></li>
        <li><a class="log-slice" href="#">${icon("image", 24)}<span>Visitor photo</span></a></li>
      </ul>
      <a class="story-slot" href="#">${icon("file", 22)}<span>Visitor story</span></a>`,

  notice: (b) => `${sectionHead({ eyebrow: b.eyebrow }, b.bg)}
      <p class="notice-text">${esc(b.text)}</p>
      <div class="actions">
        ${btnPrimary(b.primary, b.bg, b.primaryIcon)}
        ${b.secondary ? btnSecondary(b.secondary, b.bg) : ""}
      </div>`,

  ctas: (b) => `${b.eyebrow ? sectionHead({ eyebrow: b.eyebrow }, b.bg) : ""}
      <div class="actions">
        ${btnPrimary(b.primary, b.bg, b.primaryIcon)}
        ${b.secondary ? btnSecondary(b.secondary, b.bg, b.secondaryIcon, b.secondaryLeft) : ""}
      </div>`,

  topics: (b) => `${sectionHead(b, b.bg)}
      <div class="topic-grid">
${b.items.map(([title, desc, ic]) => `        <article class="card topic">
          <span class="topic__icon">${icon(ic, 22)}</span>
          <h2 class="card__title">${esc(title)}</h2>
          <p class="card__desc">${esc(desc)}</p>
          <a class="inset-row" href="#"><span>${esc(title)}</span>${icon("right", 18)}</a>
        </article>`).join("\n")}
      </div>`,

  reflect: (b) => `${sectionHead(b, b.bg)}
      <div class="reflect-grid">
${b.cards.map(([eb, text, action, ic]) => `        <div class="reflect">
          ${eb ? `<p class="eyebrow eyebrow--sage">${esc(eb)}</p>` : ""}
          <p class="reflect__text">${esc(text)}</p>
          <a class="pill pill--cream" href="#">${icon(ic, 16)}${esc(action)}</a>
        </div>`).join("\n")}
      </div>`,

  segment: (b) => {
    const first = b.options[0][0];
    return `<div class="segment" role="tablist" aria-label="Choose a grove" data-segment="${b.name}">
${b.options.map(([key, label]) => `        <button class="segment__opt" type="button" role="tab" id="tab-${key}" aria-controls="panel-${key}" aria-selected="${key === first}" data-segment-key="${key}"><span class="segment__dot" aria-hidden="true"></span>${esc(label)}</button>`).join("\n")}
      </div>
${b.options.map(([key]) => `      <div class="segment-panel" id="panel-${key}" role="tabpanel" aria-labelledby="tab-${key}" data-segment-panel="${key}"${key === first ? "" : " hidden"}>
        ${b.panels[key].map(card).join("\n        ")}
      </div>`).join("\n")}`;
  },
};

/* ---------- page assembly ---------- */
function renderSections(sections) {
  let prev = "sand";
  let out = "";
  sections.forEach((b, i) => {
    const bg = b.bg || "sand";
    const first = i === 0;
    const texture = bg === "bark" ? " tex-heartwood" : bg === "moss" ? " tex-moss" : first && b.t !== "hero" ? " tex-sand" : "";
    const id = b.title && b.t !== "facts" ? ` id="${slug(b.title)}"` : "";
    const cls = `block block--${b.t} bg-${bg}${texture}${first ? " block--first" : ""}${DARK.has(bg) ? " on-dark" : ""}`;
    const inner = `\n      <div class="container">\n      ${R[b.t](b)}\n      </div>\n    `;
    if (bg !== prev) {
      out += `\n    <div class="band-wrap bg-${prev}">\n    <section class="${cls} band"${id}>${inner}</section>\n    </div>`;
    } else {
      out += `\n    <section class="${cls}"${id}>${inner}</section>`;
    }
    prev = bg;
  });
  return out;
}

function shell({ title, description, nav, main, variant, back, scripts = [] }) {
  const fullTitle = title === SITE ? SITE : `${title} · ${SITE}`;
  return `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>${esc(fullTitle)}</title>
  <meta name="description" content="${esc(description)}">
  <meta name="theme-color" content="#6B5848">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Averia+Serif+Libre:ital,wght@0,700;1,700&family=DM+Sans:opsz,wght@9..40,400;9..40,500;9..40,600;9..40,700&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="css/styles.css">
  <script src="js/main.js" defer></script>
${scripts.map((s) => `  <script src="${s}" defer></script>`).join("\n")}
</head>
<body class="inner-page${variant ? " inner-page--" + variant : ""}">
  <!-- build:sprite -->
${SPRITE}
  <!-- /build:sprite -->

  <a class="skip-link" href="#main">Skip to content</a>

  <!-- build:header -->
${header(nav, variant, back)}
  <!-- /build:header -->

  <main id="main" class="page-main">${main}
  </main>

  <!-- build:footer -->
${footer()}
  <!-- /build:footer -->
</body>
</html>
`;
}

/* Resolve href="#" on every link by its visible label. */
function resolveLinks(html) {
  return html.replace(/<a([^>]*?)\shref="#"([^>]*)>([\s\S]*?)<\/a>/g, (whole, pre, post, inner) => {
    const named = inner.match(/class="nav-row__label">([^<]*)</);
    const label = (named ? named[1] : inner).replace(/<span class="visually-hidden">[\s\S]*?<\/span>/g, "").replace(/<[^>]+>/g, "").replace(/→/g, "")
      .replace(/&amp;/g, "&").replace(/\s+/g, " ").trim();
    const href = hrefFor(label);
    if (href === "#") return whole;
    return `<a${pre} ${linkAttrs(href)}${post}>${inner}</a>`;
  });
}

const replaceRegion = (html, name, content) =>
  html.replace(new RegExp(`(<!-- build:${name} -->)[\\s\\S]*?(<!-- /build:${name} -->)`), `$1\n${content}\n  $2`);

/* ---------- search page shell (states are drawn by js/search.js) ---------- */
const searchMain = `
    <div class="container search-page">
      <form class="search search--page" id="search-form" role="search" action="search.html">
        <label class="visually-hidden" for="q">Search the site</label>
        ${icon("search", 20, "search__icon")}
        <input class="search__input" id="q" name="q" type="search" autocomplete="off" placeholder="Search trees, trails, passes, accessibility…">
        <button class="search__clear" type="button" aria-label="Clear search" data-clear hidden>${icon("close", 16)}</button>
        <button class="search__filter" type="button" aria-label="Filters" data-open-filters hidden>${icon("sliders", 18)}</button>
      </form>
      <div class="search-view" id="search-view" aria-live="polite"></div>
    </div>

    <div class="sheet" id="filter-sheet" role="dialog" aria-modal="true" aria-labelledby="filters-title" hidden>
      <div class="sheet__scrim" data-close-filters></div>
      <form class="sheet__panel" id="filter-form">
        <div class="sheet__head">
          <div>
            <p class="eyebrow">Refine results</p>
            <h2 class="section-title" id="filters-title">Search Filters</h2>
          </div>
          <button class="close-pill close-pill--light" type="button" data-close-filters>${icon("close", 16)}Close</button>
        </div>
        <p class="query-pill">${icon("search", 16)}<span>Query:</span> <strong data-query-label></strong></p>
        <fieldset class="radio-card">
          <legend class="radio-card__legend">Location</legend>
          ${["All Locations", "Giant Forest", "Grant Grove"].map((l, i) => `<label class="radio-row"><input type="radio" name="loc" value="${i ? esc(l) : ""}"${i ? "" : " checked"}><span class="radio-row__ring" aria-hidden="true"></span><span>${esc(l)}</span></label>`).join("\n          ")}
        </fieldset>
        <fieldset class="radio-card">
          <legend class="radio-card__legend">Content Type</legend>
          ${[["", "All content types"], ["Visitor Information", "Visitor Information"], ["Trail", "Trails"], ["Landmark", "Landmarks"]].map(([v, l], i) => `<label class="radio-row"><input type="radio" name="type" value="${esc(v)}"${i ? "" : " checked"}><span class="radio-row__ring" aria-hidden="true"></span><span>${esc(l)}</span></label>`).join("\n          ")}
        </fieldset>
        <div class="actions">
          <button class="btn btn--outline" type="button" data-clear-filters><span>Clear Filters</span>${icon("close", 18)}</button>
          <button class="btn btn--clay-pill" type="submit"><span>Apply Filters</span><span class="circle circle--cream circle--42" aria-hidden="true">${icon("right", 18)}</span></button>
        </div>
      </form>
    </div>`;

/* ---------- write files ---------- */
const written = [];
/* Where the in-page back button goes when there is no history to return to:
   the page's own "parent", else its nearest linked breadcrumb, else home. */
function parentOf(page) {
  if (page.parent) return page.parent;
  const crumbsList = page.sections.find((b) => b.crumbs)?.crumbs || [];
  const linked = crumbsList.map(hrefFor).filter((h) => h !== "#" && h !== page.file);
  return linked.at(-1) || "index.html";
}

for (const page of PAGES) {
  const html = resolveLinks(shell({ ...page, back: parentOf(page), main: renderSections(page.sections) }));
  writeFileSync(join(ROOT, page.file), html);
  written.push(page.file);
}

writeFileSync(join(ROOT, "search.html"), resolveLinks(shell({
  title: "Search", description: "Search trees, trails, passes and accessibility information.",
  variant: "search", main: searchMain, scripts: ["js/search.js"],
})));
written.push("search.html");

let home = readFileSync(join(ROOT, "index.html"), "utf8");
home = replaceRegion(home, "sprite", SPRITE);
home = replaceRegion(home, "header", header(null));
home = replaceRegion(home, "footer", footer());
writeFileSync(join(ROOT, "index.html"), resolveLinks(home));
written.push("index.html (shared regions + links)");

console.log("Built:\n  " + written.join("\n  "));
