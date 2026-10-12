# Sequoia Tree Landing Page

A mobile-first visitor website for the giant sequoia groves of **Sequoia & Kings Canyon National Parks**, helping visitors plan a trip, compare Giant Forest and Grant Grove, find accessible routes, and learn why these trees matter.

> **Status:** A clickable prototype of every hi-fi page from Figma (HTML, CSS, vanilla JS), with real NPS content. Pages that weren't designed yet show a short "not built yet" message.

## The problem

Planning a visit to the sequoia groves means piecing together fees, hours, seasonal road closures, parking and accessibility details from many different pages. This project reorganizes that information around what visitors actually need to decide before they go.

## Design process

The full process lives in the Figma file, one page per stage:

1. **Research**
2. **Card sorting**
3. **Information architecture, taxonomy & metadata**
4. **Sitemap**
5. **Visual direction explorations** — five rounds iterating from three distinct directions to the final system
6. **Initial wireframes** — 19 mobile screens plus desktop home
7. **Prototyped wireframes** — the clickable prototype, with tickets & timed tours, language, nearby places, visitor posts and a sticky header
8. **User testing**
9. **Revised wireframes** — changes after user testing
10. **Code export** — photos for the coded site

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
- **Claude (Anthropic)** — AI collaborator for visual direction explorations, building screens in Figma, content research and front-end code

## How I worked with AI

I directed the design decisions; Claude generated options and did the heavy lifting. Each round I reviewed the explorations, picked a direction (or combined elements from several, even mocking up my own "frankenstein" version), and asked for the next set. That loop took the project from greyscale wireframes to a full hi-fi system: choosing a direction, refining typography, fixing card contrast, separating sections, and developing the tree-ring motif.

## Next steps

- [x] Build the mobile landing page in HTML/CSS from the hi-fi Home screen
- [x] Make it responsive up to the desktop layout
- [x] Add the photo and grove carousels
- [x] Build the hi-fi pages from Figma and link them together
- [x] Apply the user-testing revisions (Figma page 9 "Revised Wireframes"): history links from the hero and Giant Forest, a Safety & Visitor Guidelines page that answers the pets question, today's hours in the park status card, clearer Crystal Cave booking steps, one burnt-orange button style, a swipeable hero and a sticky search bar on Home
- [ ] Add the four photos to `assets/img/` (see the note there)
- [ ] Design and build the remaining pages (Grant Grove, Directions, Current Conditions, Visitor Help…)
- [ ] Publish with GitHub Pages
- [ ] Recheck all park information against NPS before publishing

## Pages

| Page | File | Figma screen |
|---|---|---|
| Home | `index.html` | 01 (mobile) and Desktop Home |
| Menu | drawer on every page | 02 |
| Plan Your Visit | `plan-your-visit.html` | 03 |
| Hours & Seasons | `hours-and-seasons.html` | 04 |
| Entrance Fees & Passes | `fees-and-passes.html` | 05 |
| Official purchase handoff | `purchase.html` | 06 |
| Compare Groves | `compare-groves.html` | 07 |
| Giant Forest | `giant-forest.html` | 08 |
| General Sherman Tree | `general-sherman-tree.html` | 09 |
| About the Sequoias | `about-the-sequoias.html` | 10 |
| People & History | `people-and-history.html` | 11 |
| Search (entry, autocomplete, results, filters, no results) | `search.html` | 12–17, 19 |
| Accessible Trails & Routes | `accessible-trails.html` | 18 |
| Safety & Visitor Guidelines (pets answer) | `safety-and-visitor-guidelines.html` | 25 (revised, page 9) |
| Tickets & Tours (passes, timed tours, free programs, day plans) | `tickets-and-tours.html` | 20 (prototyped) |
| Crystal Cave: choose a date, time and tickets | `crystal-cave.html` | 21 (prototyped) |
| Tour checkout handoff | `tour-checkout.html` | 24 (prototyped) |

Try searching for **tickets**, **wheelchair access** or **tree elevator** to see the search states.

## Editing pages

Inner pages are generated, so edit the content rather than the HTML:

- `content/site.mjs` holds each page's copy and the `LINKS` map that decides where every button goes (by its label).
- `node scripts/build-pages.mjs` rebuilds the pages and refreshes the shared header, menu and footer in `index.html`.
- `node scripts/build-preview-bundle.mjs` packs everything into one file (`dist/preview-bundle.html`) for hosts that serve a single page.

## Run it locally

No build step needed. Open `index.html` in a browser, or serve the folder:

```
python3 -m http.server
```

then visit http://localhost:8000.

### Preview phone and desktop side by side

Open `preview.html` to see the site as if it were opened in Safari: an iPhone frame or a Mac browser window. Click through it like the real site and use the Safari back and forward arrows (or reload) to move through your history. Inner pages also have their own back button in the mobile header. Flip the **Safari bar** switch (or press **S**) to hide the browser bars and see the site full-screen. Use the **Mobile / Desktop** buttons (or press **M** / **D**) to switch between the two layouts without resizing your window. Each frame scrolls independently.

## Project structure

```
index.html                 Home page (hand-built; shared regions filled by the build)
*.html                     Inner pages and search, generated from content/site.mjs
preview.html               Mobile / Desktop preview in Safari chrome (back, forward, reload)
content/site.mjs           Page content and link map
js/search.js               Search page states and index
css/styles.css             Design tokens, mobile-first styles, desktop layout at 1024px
js/main.js                 Menu, carousels, grove switch, links between pages
assets/textures/           Tree-ring SVG textures
assets/img/                Photos
scripts/build-pages.mjs    Builds the pages from content/site.mjs
scripts/build-preview-bundle.mjs   Packs the preview and pages into one file
scripts/generate-textures.mjs   Regenerates the ring textures
```
