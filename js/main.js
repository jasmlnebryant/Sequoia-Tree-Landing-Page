// Visit the Giant Sequoias — shared interactions for every page.
// Menu, carousels, the grove switch, and link handling.
//
// When a page runs inside the published preview, it is loaded with
// window.SEQUOIA_EMBED = { href, params, hash }. In that mode, links to other
// pages ask the preview to switch pages instead of navigating the frame.

(() => {
  const EMBED = window.SEQUOIA_EMBED || null;
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const scrollBehavior = reduceMotion ? "auto" : "smooth";

  // Query string and hash, from the URL or from the preview.
  const params = new URLSearchParams(EMBED ? EMBED.params : location.search);
  const startHash = EMBED ? EMBED.hash : location.hash.slice(1);
  window.SequoiaSite = { params, embedded: !!EMBED };

  const isPageLink = (href) => /^(?!https?:|mailto:|tel:|#)[\w./-]+\.html([?#].*)?$/.test(href);

  /** Go to another page of the prototype. */
  const go = (href) => {
    if (EMBED) window.parent.postMessage({ type: "sequoia-navigate", href }, "*");
    else location.href = href;
  };
  window.SequoiaSite.go = go;

  /* ---------- Tell the preview which page loaded ---------- */
  if (window.parent !== window) {
    const here = EMBED ? EMBED.href : (location.pathname.split("/").pop() || "index.html") + location.search + location.hash;
    try {
      window.parent.postMessage({ type: "sequoia-site-ready", href: here, title: document.title.split(" · ")[0] }, "*");
    } catch {}
  }

  /* ---------- Missing photos fall back to the section color ---------- */
  document.querySelectorAll("img").forEach((img) => {
    const hide = () => { img.style.visibility = "hidden"; };
    if (img.complete && img.naturalWidth === 0 && img.getAttribute("src")) hide();
    img.addEventListener("error", hide);
  });

  /* ---------- Toast ---------- */
  const toast = document.querySelector("[data-toast]");
  let toastTimer;
  const showToast = (message) => {
    if (!toast) return;
    toast.textContent = message;
    toast.hidden = false;
    requestAnimationFrame(() => toast.classList.add("is-visible"));
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => {
      toast.classList.remove("is-visible");
      setTimeout(() => { toast.hidden = true; }, 250);
    }, 2600);
  };
  window.SequoiaSite.toast = showToast;

  const labelOf = (a) => {
    const el = a.querySelector(".nav-row__label, .tile__label, .ring-row__label, .conditions-card__title, .menu-group__row span:nth-child(2), .btn span, .log-slice span, .inset-row span, .story-slot span");
    return (el || a).textContent.replace(/\s+/g, " ").replace("→", "").trim();
  };

  /* ---------- Scroll to a section, switching the grove panel if needed ---------- */
  const scrollToId = (id, behavior = scrollBehavior) => {
    const target = id && document.getElementById(id);
    if (!target) return;
    const panel = target.closest("[data-segment-panel]");
    if (panel && panel.hidden) selectSegment(panel.parentElement.querySelector("[data-segment]"), panel.dataset.segmentPanel);
    window.scrollTo({ top: target.getBoundingClientRect().top + window.scrollY - 12, behavior });
  };

  /* ---------- Links ---------- */
  document.addEventListener("click", (e) => {
    const a = e.target.closest("a[href]");
    if (!a) return;
    const href = a.getAttribute("href");

    if (href === "#") {
      e.preventDefault();
      showToast(`${labelOf(a)} isn't built yet in this prototype.`);
      return;
    }
    if (href.startsWith("#")) {
      e.preventDefault();
      scrollToId(href.slice(1));
      if (href === "#search") document.getElementById("site-search")?.focus({ preventScroll: true });
      return;
    }
    if (EMBED && isPageLink(href)) {
      e.preventDefault();
      go(href);
    }
  });

  /* ---------- Home page search box: go to the search page ---------- */
  // Enter and the button are handled directly: sandboxed hosts block form submission.
  document.querySelectorAll("form.search:not(#search-form)").forEach((form) => {
    const input = form.querySelector("input");
    const submit = (e) => {
      e.preventDefault();
      const q = input.value.trim();
      go("search.html" + (q ? "?q=" + encodeURIComponent(q) : ""));
    };
    form.addEventListener("submit", submit);
    input.addEventListener("keydown", (e) => { if (e.key === "Enter") submit(e); });
    form.querySelector('[type="submit"]')?.addEventListener("click", submit);
  });

  /* ---------- Mobile menu ---------- */
  const toggle = document.querySelector("[data-menu-toggle]");
  const drawer = document.getElementById("menu-drawer");
  if (toggle && drawer) {
    const icon = toggle.querySelector("[data-menu-icon] use");
    const setOpen = (open) => {
      drawer.classList.toggle("is-open", open);
      toggle.setAttribute("aria-expanded", String(open));
      toggle.setAttribute("aria-label", open ? "Close menu" : "Open menu");
      icon?.setAttribute("href", open ? "#i-close" : "#i-menu");
    };
    toggle.addEventListener("click", () => setOpen(!drawer.classList.contains("is-open")));
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && drawer.classList.contains("is-open")) { setOpen(false); toggle.focus(); }
    });
    drawer.addEventListener("click", (e) => { if (e.target.closest("a[href]:not([href='#'])")) setOpen(false); });
  }

  /* ---------- Grove switch (accessible trails) ---------- */
  function selectSegment(group, key) {
    if (!group) return;
    group.querySelectorAll("[data-segment-key]").forEach((btn) => {
      const on = btn.dataset.segmentKey === key;
      btn.setAttribute("aria-selected", String(on));
      btn.tabIndex = on ? 0 : -1;
    });
    group.parentElement.querySelectorAll("[data-segment-panel]").forEach((p) => { p.hidden = p.dataset.segmentPanel !== key; });
  }
  document.querySelectorAll("[data-segment]").forEach((group) => {
    const keys = [...group.querySelectorAll("[data-segment-key]")].map((b) => b.dataset.segmentKey);
    group.addEventListener("click", (e) => {
      const btn = e.target.closest("[data-segment-key]");
      if (btn) selectSegment(group, btn.dataset.segmentKey);
    });
    group.addEventListener("keydown", (e) => {
      if (e.key !== "ArrowRight" && e.key !== "ArrowLeft") return;
      const current = keys.indexOf(group.querySelector('[aria-selected="true"]').dataset.segmentKey);
      const next = keys[(current + (e.key === "ArrowRight" ? 1 : keys.length - 1)) % keys.length];
      selectSegment(group, next);
      group.querySelector(`[data-segment-key="${next}"]`).focus();
    });
    const wanted = params.get(group.dataset.segment);
    selectSegment(group, keys.includes(wanted) ? wanted : keys[0]);
  });

  /* ---------- Hero carousel (home) ---------- */
  const hero = document.querySelector("[data-hero]");
  if (hero) {
    const slides = [...hero.querySelectorAll(".hero__slide")];
    const dots = [...hero.querySelectorAll("[data-hero-dots] .dot")];
    const countEl = hero.querySelector("[data-hero-count]");
    const nameEl = hero.querySelector("[data-hero-name]");
    const pad = (n) => String(n).padStart(2, "0");
    let index = 0;
    let timer = null;

    const show = (i) => {
      index = (i + slides.length) % slides.length;
      slides.forEach((s, n) => {
        s.classList.toggle("is-active", n === index);
        s.setAttribute("aria-hidden", String(n !== index));
      });
      dots.forEach((d, n) => {
        d.classList.toggle("is-active", n === index);
        d.setAttribute("aria-selected", String(n === index));
      });
      countEl.textContent = `${pad(index + 1)} / ${pad(slides.length)}`;
      nameEl.textContent = slides[index].dataset.name;
    };
    const stop = () => { clearInterval(timer); timer = null; };
    const start = () => { if (!reduceMotion && !timer) timer = setInterval(() => show(index + 1), 6000); };

    hero.querySelector("[data-hero-prev]").addEventListener("click", () => { stop(); show(index - 1); });
    hero.querySelector("[data-hero-next]").addEventListener("click", () => { stop(); show(index + 1); });
    dots.forEach((d, n) => d.addEventListener("click", () => { stop(); show(n); }));

    let startX = null;
    hero.addEventListener("pointerdown", (e) => { if (e.pointerType !== "mouse") startX = e.clientX; });
    hero.addEventListener("pointerup", (e) => {
      if (startX === null) return;
      const dx = e.clientX - startX;
      if (Math.abs(dx) > 40) { stop(); show(index + (dx < 0 ? 1 : -1)); }
      startX = null;
    });
    hero.addEventListener("keydown", (e) => {
      if (e.key === "ArrowRight") { stop(); show(index + 1); }
      if (e.key === "ArrowLeft") { stop(); show(index - 1); }
    });
    hero.addEventListener("mouseenter", stop);
    hero.addEventListener("mouseleave", start);
    hero.addEventListener("focusin", stop);
    start();
  }

  /* ---------- Grove carousel (home, scroll-snap) ---------- */
  const groves = document.querySelector("[data-grove-carousel]");
  if (groves) {
    const track = groves.querySelector("[data-grove-track]");
    const cards = [...track.children];
    const dots = [...groves.querySelectorAll("[data-grove-dots] .dot")];
    const prev = groves.querySelector("[data-grove-prev]");
    const next = groves.querySelector("[data-grove-next]");
    const offsetOf = (c) => c.offsetLeft - track.offsetLeft;
    const current = () => {
      const left = track.scrollLeft;
      return cards.reduce((best, c, i) => (Math.abs(offsetOf(c) - left) < Math.abs(offsetOf(cards[best]) - left) ? i : best), 0);
    };
    const update = () => {
      const i = current();
      dots.forEach((d, n) => d.classList.toggle("is-active", n === i));
      prev.disabled = track.scrollLeft <= 2;
      next.disabled = track.scrollLeft >= track.scrollWidth - track.clientWidth - 2;
    };
    const step = (dir) => {
      const i = Math.min(Math.max(current() + dir, 0), cards.length - 1);
      track.scrollTo({ left: offsetOf(cards[i]) - parseFloat(getComputedStyle(track).paddingLeft), behavior: scrollBehavior });
    };
    prev.addEventListener("click", () => step(-1));
    next.addEventListener("click", () => step(1));
    track.addEventListener("scroll", () => requestAnimationFrame(update), { passive: true });
    window.addEventListener("resize", update);
    update();
  }

  /* ---------- Jump to a section named in the link (page.html#section) ---------- */
  if (startHash) setTimeout(() => scrollToId(startHash, "auto"), 60);
})();
