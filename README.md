# Sequoia Tree Landing Page

A mobile-first visitor website for the giant sequoia groves of **Sequoia & Kings Canyon National Parks**, helping visitors plan a trip, compare Giant Forest and Grant Grove, find accessible routes, and learn why these trees matter.

> **Status:** The mobile-first landing page is built (HTML, CSS, vanilla JS). Hi-fi designs for the remaining pages live in Figma.

## The problem

Planning a visit to the sequoia groves means piecing together fees, hours, seasonal road closures, parking and accessibility details from many different pages. This project reorganizes that information around what visitors actually need to decide before they go.

## Design process

The full process lives in the Figma file, one page per stage:

1. **Research**
2. **Card sorting**
3. **Information architecture, taxonomy & metadata**
4. **Sitemap**
5. **Initial wireframes** — 19 mobile screens plus desktop home
6. **User testing**
7. **Revised wireframes**
8. **Visual direction explorations** — five rounds iterating from three distinct directions to the final system

📐 [View the Figma file](https://www.figma.com/design/5QRgraGpPxRSA0uwQegd6D/landing-page)

## Design system

| | |
|---|---|
| **Headings** | Averia Serif Libre — warm, hand-carved, park-sign feel |
| **Body & UI** | DM Sans |
| **Palette** | Sand `#EDE5D7` · Paper `#F6F0E6` · Bark `#3A2A1F` · Moss `#4E5A41` · Clay `#B5582F` · Cream `#F8F3EA` |
| **Signature motif** | Tree rings — section textures, rounded "growth ring" section cards, ring-shaped step and fact markers, and log-slice placeholders |

Key patterns:

- **Photo hero carousel** with the headline set over the image
- **Rounded, stacking section bands** that move through sand, paper, bark and moss so every section reads distinctly
- **Fact cards** with ring markers for practical details (hours, fees, route features)
- **Trail ratings** — a three-step difficulty meter plus feature-based accessibility checks (paved, step-free, grade, accessible parking) rather than a single accessibility score

## Content

Practical information (fees, hours, seasonal access, trail and accessibility details) is sourced from the official [National Park Service site for Sequoia & Kings Canyon](https://www.nps.gov/seki/). Trail ratings are derived from NPS trail information; visitor reviews are planned for a later phase. Fees and seasonal dates change, so content should be rechecked against NPS before launch.

## Tools

- **Figma** — research through high-fidelity design
- **Claude (Anthropic)** — AI collaborator for visual direction explorations, building screens in Figma, content research and, next, front-end code

## How I worked with AI

I directed the design decisions; Claude generated options and did the heavy lifting. Each round I reviewed the explorations, picked a direction (or combined elements from several, even mocking up my own "frankenstein" version), and asked for the next set. That loop took the project from greyscale wireframes to a full hi-fi system: choosing a direction, refining typography, fixing card contrast, separating sections, and developing the tree-ring motif.

## Next steps

- [x] Build the mobile landing page in HTML/CSS from the hi-fi Home screen
- [x] Make it responsive up to the desktop layout
- [x] Add the photo and grove carousels
- [ ] Add the four photos to `assets/img/` (see the note there)
- [ ] Publish with GitHub Pages
- [ ] Build the inner pages (Plan Your Visit, groves, accessibility)
- [ ] Recheck all park information against NPS before publishing

## Run it locally

No build step needed. Open `index.html` in a browser, or serve the folder:

```
python3 -m http.server
```

then visit http://localhost:8000.

## Project structure

```
index.html                 Landing page markup (semantic HTML + inline icon sprite)
css/styles.css             Design tokens, mobile-first styles, desktop layout at 1024px
js/main.js                 Mobile menu, hero carousel, grove carousel
assets/textures/           Tree-ring SVG textures
assets/img/                Photos
scripts/generate-textures.mjs   Regenerates the ring textures (node scripts/generate-textures.mjs)
```
