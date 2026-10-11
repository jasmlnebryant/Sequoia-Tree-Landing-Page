// Visit the Giant Sequoias — interactions
// Mobile menu, hero carousel, grove carousel, missing-photo fallback.

(() => {
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---------- Missing photos fall back to the section color ---------- */
  document.querySelectorAll("img").forEach((img) => {
    const hide = () => { img.style.visibility = "hidden"; };
    if (img.complete && img.naturalWidth === 0 && img.getAttribute("src")) hide();
    img.addEventListener("error", hide);
  });

  /* ---------- Let preview.html know the page loaded ---------- */
  if (window.parent !== window) {
    try { window.parent.postMessage({ type: "sequoia-site-ready" }, "*"); } catch {}
  }

  /* ---------- Search (no results page yet) ---------- */
  document.querySelector("form.search")?.addEventListener("submit", (e) => e.preventDefault());

  /* ---------- Mobile menu ---------- */
  const toggle = document.querySelector("[data-menu-toggle]");
  const nav = document.getElementById("primary-nav");
  if (toggle && nav) {
    const icon = toggle.querySelector("[data-menu-icon] use");
    const setOpen = (open) => {
      nav.classList.toggle("is-open", open);
      toggle.setAttribute("aria-expanded", String(open));
      toggle.setAttribute("aria-label", open ? "Close menu" : "Open menu");
      icon?.setAttribute("href", open ? "#i-close" : "#i-menu");
    };
    toggle.addEventListener("click", () => setOpen(!nav.classList.contains("is-open")));
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && nav.classList.contains("is-open")) { setOpen(false); toggle.focus(); }
    });
    nav.addEventListener("click", (e) => { if (e.target.closest("a")) setOpen(false); });
  }

  /* ---------- Hero carousel ---------- */
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
        const active = n === index;
        s.classList.toggle("is-active", active);
        s.setAttribute("aria-hidden", String(!active));
      });
      dots.forEach((d, n) => {
        d.classList.toggle("is-active", n === index);
        d.setAttribute("aria-selected", String(n === index));
      });
      countEl.textContent = `${pad(index + 1)} / ${pad(slides.length)}`;
      nameEl.textContent = slides[index].dataset.name;
    };

    const stop = () => { clearInterval(timer); timer = null; };
    const start = () => {
      if (reduceMotion || timer) return;
      timer = setInterval(() => show(index + 1), 6000);
    };

    hero.querySelector("[data-hero-prev]").addEventListener("click", () => { stop(); show(index - 1); });
    hero.querySelector("[data-hero-next]").addEventListener("click", () => { stop(); show(index + 1); });
    dots.forEach((d, n) => d.addEventListener("click", () => { stop(); show(n); }));

    // Swipe
    let startX = null;
    hero.addEventListener("pointerdown", (e) => { if (e.pointerType !== "mouse") startX = e.clientX; });
    hero.addEventListener("pointerup", (e) => {
      if (startX === null) return;
      const dx = e.clientX - startX;
      if (Math.abs(dx) > 40) { stop(); show(index + (dx < 0 ? 1 : -1)); }
      startX = null;
    });

    // Keyboard arrows when focus is inside the carousel
    hero.addEventListener("keydown", (e) => {
      if (e.key === "ArrowRight") { stop(); show(index + 1); }
      if (e.key === "ArrowLeft") { stop(); show(index - 1); }
    });

    // Pause autoplay while hovered or focused
    hero.addEventListener("mouseenter", stop);
    hero.addEventListener("mouseleave", start);
    hero.addEventListener("focusin", stop);

    start();
  }

  /* ---------- Grove carousel (native scroll-snap) ---------- */
  const groves = document.querySelector("[data-grove-carousel]");
  if (groves) {
    const track = groves.querySelector("[data-grove-track]");
    const cards = [...track.children];
    const dots = [...groves.querySelectorAll("[data-grove-dots] .dot")];
    const prev = groves.querySelector("[data-grove-prev]");
    const next = groves.querySelector("[data-grove-next]");

    const current = () => {
      const left = track.scrollLeft;
      let best = 0;
      cards.forEach((c, i) => {
        if (Math.abs(c.offsetLeft - track.offsetLeft - left) < Math.abs(cards[best].offsetLeft - track.offsetLeft - left)) best = i;
      });
      return best;
    };

    const update = () => {
      const i = current();
      dots.forEach((d, n) => d.classList.toggle("is-active", n === i));
      const max = track.scrollWidth - track.clientWidth;
      prev.disabled = track.scrollLeft <= 2;
      next.disabled = track.scrollLeft >= max - 2;
    };

    const go = (dir) => {
      const i = Math.min(Math.max(current() + dir, 0), cards.length - 1);
      track.scrollTo({
        left: cards[i].offsetLeft - track.offsetLeft - parseFloat(getComputedStyle(track).paddingLeft),
        behavior: reduceMotion ? "auto" : "smooth",
      });
    };

    prev.addEventListener("click", () => go(-1));
    next.addEventListener("click", () => go(1));
    track.addEventListener("scroll", () => requestAnimationFrame(update), { passive: true });
    window.addEventListener("resize", update);
    update();
  }
})();
