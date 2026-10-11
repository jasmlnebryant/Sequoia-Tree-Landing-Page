// Packs the preview and every page into one self-contained HTML file,
// for hosts that can only serve a single page (like a published Claude artifact).
//   node scripts/build-preview-bundle.mjs [output path]
// Default output: dist/preview-bundle.html (ignored by git).
//
// Each page gets its CSS, scripts and ring textures inlined. The preview keeps
// them in a JSON block and shows one at a time with srcdoc; links between pages
// are routed through the preview (see SEQUOIA_EMBED in js/main.js).

import { readFileSync, writeFileSync, mkdirSync, readdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const out = process.argv[2] || join(ROOT, "dist", "preview-bundle.html");
const read = (p) => readFileSync(join(ROOT, p), "utf8");

const css = read("css/styles.css").replace(/url\("\.\.\/assets\/textures\/([^"]+)"\)/g, (_, file) =>
  `url("data:image/svg+xml;base64,${readFileSync(join(ROOT, "assets/textures", file)).toString("base64")}")`);

const pageFiles = readdirSync(ROOT).filter((f) => f.endsWith(".html") && f !== "preview.html");
const pages = {};
for (const file of pageFiles) {
  let html = read(file);
  const scripts = [...html.matchAll(/<script src="([^"]+)" defer><\/script>\n?/g)];
  for (const m of scripts) html = html.replace(m[0], "");
  html = html
    .replace('<link rel="stylesheet" href="css/styles.css">', `<style>\n${css}\n</style>`)
    .replace("<head>", "<head><!--EMBED-->")
    .replace("</body>", scripts.map((m) => `<script>\n${read(m[1])}\n</script>\n`).join("") + "</body>");
  if (/href="css\/|src="js\//.test(html)) throw new Error(`Unresolved asset in ${file}`);
  pages[file] = html;
}

const preview = read("preview.html");
const head = preview.match(/<head>([\s\S]*?)<\/head>/)[1].replace(/\s*<meta[^>]*>/g, "");
let body = preview.match(/<body>([\s\S]*?)<\/body>/)[1];
body = body
  .replace(' src="index.html" title=', " title=")
  .replace(/\s*<a href="index.html"[^>]*>Open full page<\/a>/, "")
  .replace('        try { history.replaceState(null, "", "#" + mode); } catch {}\n', "");
const json = JSON.stringify(pages).replace(/</g, "\\u003c");
body = body.replace("  <script>", `  <script type="application/json" id="pages">${json}</script>\n  <script>`);

mkdirSync(dirname(out), { recursive: true });
writeFileSync(out, head.trim() + "\n" + body.trim() + "\n");
console.log(`Wrote ${out} (${pageFiles.length} pages, ${(Buffer.byteLength(head + body) / 1024).toFixed(0)} KB)`);
