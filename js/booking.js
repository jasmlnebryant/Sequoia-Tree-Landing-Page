// Crystal Cave booking (Figma screen 21) and the checkout handoff (screen 24).
// Availability is sample data for the prototype. Prices: $22 adult, $11 child.

(() => {
  const site = window.SequoiaSite;
  const params = site ? site.params : new URLSearchParams(location.search);
  const icon = (name, size = 14) => `<svg class="icon icon--${size}" aria-hidden="true"><use href="#i-${name}"/></svg>`;

  const TIMES = ["9:00 AM", "10:00 AM", "11:00 AM", "12:00 PM", "1:00 PM", "2:00 PM", "3:00 PM"];
  // Spots left per time, by date (sample data).
  const DATES = [
    { key: "2026-07-17", day: "Fri", num: "17", label: "Fri, Jul 17", left: [3, 0, 6, 12, 5, 14, 9] },
    { key: "2026-07-18", day: "Sat", num: "18", label: "Sat, Jul 18", left: [0, 4, 2, 12, 15, 9, 14] },
    { key: "2026-07-19", day: "Sun", num: "19", label: "Sun, Jul 19", left: [10, 12, 14, 15, 11, 15, 13] },
    { key: "2026-07-20", day: "Mon", num: "20", label: "Mon, Jul 20", left: [15, 14, 15, 12, 15, 15, 15] },
    { key: "2026-07-21", day: "Tue", num: "21", label: "Tue, Jul 21", left: [15, 15, 13, 15, 14, 15, 15] },
  ];
  const statusFor = (n) => (n === 0 ? "Booked" : n < 10 ? `${n} left` : "Open");
  const money = (n) => "$" + n;

  /* ---------- Checkout handoff: show what was chosen ---------- */
  const readout = document.querySelector("[data-booking-readout] span");
  if (readout && params.get("time")) {
    const adults = +params.get("adults") || 0, kids = +params.get("kids") || 0;
    const parts = [params.get("date") || "Sat, Jul 18", params.get("time")];
    if (adults) parts.push(`${adults} adult${adults > 1 ? "s" : ""}`);
    if (kids) parts.push(`${kids} child${kids > 1 ? "ren" : ""}`);
    parts.push(money(adults * 22 + kids * 11));
    readout.textContent = parts.join(" · ");
  }

  /* ---------- Booking widget ---------- */
  const root = document.querySelector("[data-booking]");
  if (!root) return;
  const priceAdult = +root.dataset.priceAdult, priceChild = +root.dataset.priceChild;
  const datesEl = root.querySelector("[data-dates]");
  const slotsEl = root.querySelector("[data-slots]");
  const urgencyEl = root.querySelector("[data-urgency]");
  const noteEl = root.querySelector("[data-booking-note]");
  const summary = document.querySelector("[data-booking-summary]");

  const wanted = (params.get("time") || "").replace(/^(\d{1,2}:\d{2})$/, (t) => TIMES.find((x) => x.startsWith(t + " ")) || t);
  const state = {
    date: 1,
    time: TIMES.indexOf(wanted) >= 0 ? TIMES.indexOf(wanted) : 2,
    qty: { adult: 2, child: 0 },
  };

  function renderDates() {
    datesEl.innerHTML = DATES.map((d, i) => {
      const low = d.left.some((n) => n > 0 && n < 5);
      return `<button class="date-chip" type="button" role="radio" aria-checked="${i === state.date}" tabindex="${i === state.date ? 0 : -1}" data-date="${i}" aria-label="${d.label}${low ? ", few spots left" : ""}">
        <span class="date-chip__day">${d.day}</span><span class="date-chip__num">${d.num}</span><span class="date-chip__status${low ? " is-low" : ""}">${low ? "Few left" : "Open"}</span></button>`;
    }).join("");
  }

  function renderSlots() {
    const left = DATES[state.date].left;
    if (left[state.time] === 0) state.time = left.findIndex((n) => n > 0);
    slotsEl.innerHTML = TIMES.map((t, i) => {
      const n = left[i];
      return `<button class="slot-btn" type="button" role="radio" aria-checked="${i === state.time}" tabindex="${i === state.time ? 0 : -1}" data-time="${i}"${n === 0 ? " disabled" : ""} aria-label="${t}, ${statusFor(n)}">
        <span class="slot-btn__time">${t}</span><span class="slot-btn__status${n > 0 && n < 5 ? " is-low" : ""}">${i === state.time ? `${icon("yes", 12)} Selected` : statusFor(n)}</span></button>`;
    }).join("");
    // Urgency badge: the scarcest open time that day
    let low = -1;
    left.forEach((n, i) => { if (n > 0 && n < 5 && (low < 0 || n < left[low])) low = i; });
    urgencyEl.hidden = low < 0;
    if (low >= 0) urgencyEl.querySelector("span").textContent = `${left[low]} left at ${TIMES[low].replace(" AM", "").replace(" PM", "")}`;
  }

  function renderQty() {
    const left = DATES[state.date].left[state.time];
    const total = state.qty.adult + state.qty.child;
    root.querySelectorAll("[data-qty]").forEach((row) => {
      const k = row.dataset.qty;
      row.querySelector("output").textContent = state.qty[k];
      row.querySelector('[data-step="-1"]').disabled = state.qty[k] === 0;
      row.querySelector('[data-step="1"]').disabled = total >= left;
    });
    const note = noteEl.querySelector("span");
    if (total > 0 && total === left && left < 10) {
      noteEl.hidden = false;
      note.textContent = `You're booking the last ${left} spot${left > 1 ? "s" : ""} at ${TIMES[state.time]}.`;
    } else if (left < 10 && total >= left) {
      noteEl.hidden = false;
      note.textContent = `${TIMES[state.time]} has ${left} spot${left > 1 ? "s" : ""} left. Choose another time for a bigger group.`;
    } else {
      noteEl.hidden = true;
    }

    const d = DATES[state.date], t = TIMES[state.time];
    // Say plainly which time is picked (user testing: P2 missed the preselected time)
    const selLine = root.querySelector("[data-selected-line]");
    if (selLine) selLine.textContent = `Selected: ${d.label} · ${t}. Tap another time to change it.`;
    if (!summary) return;
    const parts = [];
    if (state.qty.adult) parts.push(`${state.qty.adult} adult${state.qty.adult > 1 ? "s" : ""}`);
    if (state.qty.child) parts.push(`${state.qty.child} child${state.qty.child > 1 ? "ren" : ""}`);
    summary.querySelector("[data-summary-when]").textContent = `${d.label} · ${t}`;
    summary.querySelector("[data-summary-what]").textContent = parts.length ? parts.join(" + ") : "Add tickets to continue";
    summary.querySelector("[data-summary-total]").textContent = money(state.qty.adult * priceAdult + state.qty.child * priceChild);
    const cta = summary.querySelector("[data-checkout]");
    const q = new URLSearchParams({ date: d.label, time: t, adults: state.qty.adult, kids: state.qty.child });
    cta.setAttribute("href", "tour-checkout.html?" + q.toString());
    cta.setAttribute("aria-disabled", String(total === 0));
  }

  const render = () => { renderDates(); renderSlots(); renderQty(); };

  // Keep the group within the spots left when the time changes
  const fit = () => {
    const left = DATES[state.date].left[state.time];
    while (state.qty.adult + state.qty.child > left) {
      if (state.qty.child) state.qty.child--; else state.qty.adult--;
    }
  };

  datesEl.addEventListener("click", (e) => {
    const b = e.target.closest("[data-date]"); if (!b) return;
    state.date = +b.dataset.date; renderDates(); renderSlots(); fit(); renderQty();
    datesEl.querySelector(`[data-date="${state.date}"]`).focus();
  });
  slotsEl.addEventListener("click", (e) => {
    const b = e.target.closest("[data-time]"); if (!b || b.disabled) return;
    state.time = +b.dataset.time; renderSlots(); fit(); renderQty();
    slotsEl.querySelector(`[data-time="${state.time}"]`).focus();
  });
  // Arrow keys move within each radio group
  const arrows = (el, attr, count, apply) => el.addEventListener("keydown", (e) => {
    if (!["ArrowRight", "ArrowLeft", "ArrowDown", "ArrowUp"].includes(e.key)) return;
    e.preventDefault();
    const btns = [...el.querySelectorAll(`[${attr}]:not(:disabled)`)];
    const i = btns.indexOf(document.activeElement);
    const next = btns[(i + (e.key === "ArrowRight" || e.key === "ArrowDown" ? 1 : btns.length - 1)) % btns.length];
    next?.click();
  });
  arrows(datesEl, "data-date");
  arrows(slotsEl, "data-time");
  root.addEventListener("click", (e) => {
    const b = e.target.closest("[data-step]"); if (!b || b.disabled) return;
    const k = b.closest("[data-qty]").dataset.qty;
    state.qty[k] = Math.max(0, state.qty[k] + +b.dataset.step);
    renderQty();
  });

  fit();
  render();
})();
