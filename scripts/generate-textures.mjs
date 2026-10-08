// Generates the tree-ring SVG textures used across the site.
// Uses the same ring geometry as the Figma designs, so the coded
// textures match the mockups. Run: node scripts/generate-textures.mjs

import { writeFileSync, mkdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const OUT = join(dirname(fileURLToPath(import.meta.url)), "..", "assets", "textures");
mkdirSync(OUT, { recursive: true });

const INK = "#3A2A1F";
const CREAM = "#F8F3EA";

// One slightly irregular growth ring.
function ringPath(cx, cy, r, seed, sy = 0.92) {
  const N = 72;
  let d = "";
  for (let k = 0; k <= N; k++) {
    const a = (k / N) * Math.PI * 2;
    const rr =
      r *
      (1 +
        0.025 * Math.sin(3 * a + seed) +
        0.018 * Math.sin(7 * a + seed * 2) +
        0.01 * Math.sin(13 * a + seed * 3));
    const x = (cx + Math.cos(a) * rr).toFixed(1);
    const y = (cy + Math.sin(a) * rr * sy).toFixed(1);
    d += (k ? " L" : "M") + x + " " + y;
  }
  return d + " Z";
}

// A set of rings; `heart` adds the heartwood center and a radial crack.
function rings({ w, h, cx, cy, n, step, color, opacity, heart = false }) {
  let paths = "";
  let r = step * 0.8;
  for (let i = 0; i < n; i++) {
    r += step * (0.75 + ((i * 37) % 10) / 20);
    paths += `<path d="${ringPath(cx, cy, r, i * 1.3)}" stroke-width="${i % 5 === 4 ? 2 : 1.1}"/>`;
  }
  const extra = heart
    ? `<circle cx="${cx}" cy="${cy}" r="${step * 0.5}" fill="${color}" fill-opacity="0.5" stroke="none"/>` +
      `<path d="M${cx} ${cy} L${cx - step * n * 0.9} ${cy + step * n * 0.35}" stroke-width="1.2"/>`
    : "";
  return (
    `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}" fill="none">` +
    `<g stroke="${color}" stroke-opacity="${opacity}"${heart ? ` fill="none"` : ""}>${paths}${extra}</g></svg>\n`
  );
}

const textures = {
  // Mobile
  "rings-sand.svg": { w: 390, h: 300, cx: 400, cy: -20, n: 14, step: 16, color: INK, opacity: 0.07 },
  "heartwood.svg": { w: 390, h: 340, cx: 318, cy: 150, n: 16, step: 13, color: CREAM, opacity: 0.12, heart: true },
  "log-slice.svg": { w: 165, h: 165, cx: 82.5, cy: 82.5, n: 5, step: 13, color: CREAM, opacity: 0.14 },
  // Desktop
  "rings-sand-wide.svg": { w: 1280, h: 320, cx: 1260, cy: -60, n: 14, step: 20, color: INK, opacity: 0.06 },
  "rings-hero-wide.svg": { w: 1280, h: 420, cx: 1300, cy: -40, n: 18, step: 22, color: INK, opacity: 0.05 },
  "rings-intro.svg": { w: 360, h: 460, cx: 300, cy: 80, n: 12, step: 18, color: CREAM, opacity: 0.1 },
  "rings-grove-sheet.svg": { w: 1200, h: 700, cx: 1100, cy: 120, n: 22, step: 20, color: CREAM, opacity: 0.06 },
  "heartwood-wide.svg": { w: 1280, h: 420, cx: 1010, cy: 200, n: 22, step: 15, color: CREAM, opacity: 0.12, heart: true },
};

for (const [name, opts] of Object.entries(textures)) {
  writeFileSync(join(OUT, name), rings(opts));
  console.log("wrote", name);
}
