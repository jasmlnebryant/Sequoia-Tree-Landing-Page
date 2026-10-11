// Site content, taken from the hi-fi screens in the Figma file
// (page "5 - Initial Wireframes", frames named "HI-FI · …").
// Practical facts come from nps.gov/seki. scripts/build-pages.mjs renders this.

/* ---------------------------------------------------------------
   Where each button goes, by its visible label.
   Labels not listed here point to pages that weren't designed yet
   and show a "not built yet" message.
   --------------------------------------------------------------- */
export const LINKS = {
  // Home and utilities
  "Home": "index.html",
  "Search": "search.html",

  // Plan your visit
  "Plan Your Visit": "plan-your-visit.html",
  "Plan your visit": "plan-your-visit.html",
  "Plan Your Visit overview": "plan-your-visit.html",
  "Entrance Fees & Passes": "fees-and-passes.html",
  "Fees & Passes": "fees-and-passes.html",
  "Back to Fees & Passes": "fees-and-passes.html",
  "Continue to Official Pass Purchase": "purchase.html",
  "Open Official Purchase Site": "https://www.recreation.gov/sitepass/72471",
  "Hours & Seasons": "hours-and-seasons.html",
  "Accessibility": "accessible-trails.html",
  "Accessible Trails & Routes": "accessible-trails.html",

  // Groves
  "Explore the Groves": "compare-groves.html",
  "Compare Groves": "compare-groves.html",
  "Compare groves": "compare-groves.html",
  "Giant Forest": "giant-forest.html",
  "Explore Giant Forest": "giant-forest.html",
  "Giant Forest access details": "giant-forest.html#getting-here",
  "Nearby Trails": "giant-forest.html#trails-walks",
  "General Sherman Tree": "general-sherman-tree.html",
  "View General Sherman": "general-sherman-tree.html",
  "View General Sherman’s accessible approach": "general-sherman-tree.html#accessible-approach",
  "Big Trees Trail": "accessible-trails.html#big-trees-trail",
  "View Big Trees Trail": "accessible-trails.html#big-trees-trail",

  // Learn
  "About the Sequoias": "about-the-sequoias.html",
  "People & History": "people-and-history.html",

  // Official sources (external)
  "Official NPS Sources": "https://www.nps.gov/seki/",
  "Official sources: Indigenous Connections": "https://www.nps.gov/seki/learn/historyculture/native-americans.htm",
  "Official sources: Park Protection & History": "https://www.nps.gov/seki/learn/historyculture/index.htm",
  "Official sources: Park History": "https://www.nps.gov/seki/learn/historyculture/index.htm",
};

/* Icon for a link or tile, chosen from its label. */
export const ICON_RULES = [
  [/fee|pass\b|passes|ticket|purchase|entrance|payment|reservation/i, "ticket"],
  [/hour|season/i, "clock"],
  [/parking|mobility/i, "car"],
  [/direction|transport|arrival|getting/i, "nav"],
  [/wheelchair|accessib/i, "access"],
  [/trail|walk|route|approach/i, "route"],
  [/itinerar|overview/i, "cal"],
  [/ranger|safety|rule|protect/i, "shield"],
  [/alert|condition/i, "alert"],
  [/map/i, "map"],
  [/food|stay/i, "food"],
  [/history|people|indigenous|source/i, "book"],
  [/fire/i, "flame"],
  [/climate|conservation/i, "globe"],
  [/fact|life cycle|about|ecology/i, "leaf"],
  [/grove|forest|sherman|grant|landmark|tree/i, "tree"],
  [/compare/i, "compare"],
  [/search|result/i, "search"],
  [/help|contact|language/i, "help"],
  [/home/i, "home"],
  [/facilit|sensory/i, "building"],
];

export const NAV = [
  ["Plan Your Visit", "plan"],
  ["Explore the Groves", "groves"],
  ["About the Sequoias", "learn"],
  ["Visitor Help", "help"],
];

export const MENU = {
  group: {
    title: "Plan Your Visit",
    items: ["Entrance Fees & Passes", "Hours & Seasons", "Directions & Transportation", "Accessibility", "Food & Places to Stay", "Safety & Visitor Rules"],
    overview: "Plan Your Visit overview",
  },
  sections: ["Explore the Groves", "About the Sequoias", "Visitor Help"],
  utilities: ["Search", "Alerts & Conditions", "Maps"],
};

export const FOOTER = ["Home", "Visitor Help", "Contact a Ranger", "Language Resources", "Official NPS Sources"];

const IMG = {
  mist: { src: "assets/img/hero-giant-forest.jpg", alt: "Giant sequoia trunks rising through mist in Giant Forest" },
  sherman: { src: "assets/img/hero-general-sherman.jpg", alt: "The General Sherman Tree, the largest tree on Earth by volume" },
  giantForest: { src: "assets/img/grove-giant-forest.jpg", alt: "Giant sequoias along a forest trail in Giant Forest" },
  grantGrove: { src: "assets/img/grove-grant-grove.jpg", alt: "Looking up the furrowed trunk of a giant sequoia in Grant Grove" },
};

/* ---------------------------------------------------------------
   Pages. Each section has a type `t` and a background `bg`
   (sand, paper, bark, moss). A change of background starts a
   rounded "growth ring" band, as in the Figma screens.
   --------------------------------------------------------------- */
export const PAGES = [
  {
    file: "plan-your-visit.html", nav: "plan", title: "Plan Your Visit",
    description: "Fees, hours, directions, accessibility and safety for a visit to the giant sequoia groves.",
    sections: [
      { t: "intro", eyebrow: "Trip planning", title: "Plan Your Visit", desc: "Find the essentials for a visit to the giant sequoia groves." },
      { t: "tiles", cols: 3, items: ["Entrance Fees & Passes", "Hours & Seasons", "Directions & Transportation", "Accessibility", "Food & Places to Stay", "Safety & Visitor Rules"] },
      { t: "rows", bg: "bark", eyebrow: "Where to next", title: "Plan where to go", items: ["Compare Groves", "Current Conditions"] },
    ],
  },
  {
    file: "hours-and-seasons.html", nav: "plan", title: "Hours & Seasons",
    description: "Park access hours, visitor center hours and seasonal road and trail access.",
    sections: [
      { t: "intro", crumbs: ["Home", "Plan Your Visit"], eyebrow: "Plan your visit", title: "Hours & Seasons" },
      { t: "facts", title: "Park access", fields: [
        ["Park entry and access hours", "Open 24 hours a day, 365 days a year"],
        ["Entry requirements", "No reservations needed. Buy an entrance pass at the gate (cashless) or online."],
      ] },
      { t: "facts", title: "Visitor center and facility hours", desc: "Facility opening hours are separate from park access. Check the facility you plan to visit.", fields: [
        ["Visitor center hours", "Foothills, Giant Forest Museum and Kings Canyon Visitor Center are open year-round, about 9 am–4:30 pm (longer in summer)"],
        ["Other facility hours", "Lodgepole Visitor Center: about May–mid-October. Cedar Grove Visitor Center: summer only."],
      ] },
      { t: "facts", bg: "paper", outer: "Seasonal access", title: "Seasonal road and trail access", fields: [
        ["Seasonal road access", "Generals Hwy between Lodgepole and Grant Grove is unplowed early January–mid-March. Hwy 180 to Cedar Grove is open late April–mid-November."],
        ["Seasonal trail access", "Grove trails stay open but are often snowy in winter. Cedar Grove and Mineral King are spring–fall areas. Chains may be required whenever it snows."],
      ] },
      { t: "notice", bg: "bark", eyebrow: "Before you travel", text: "Check current conditions before traveling.", primary: "View Current Conditions", primaryIcon: "upright", secondary: "Find Directions" },
    ],
  },
  {
    file: "fees-and-passes.html", nav: "plan", title: "Entrance Fees & Passes",
    description: "Entrance fees, accepted passes, international visitor fees and how to pay.",
    sections: [
      { t: "intro", crumbs: ["Home", "Plan Your Visit"], eyebrow: "Plan your visit", title: "Entrance Fees & Passes", desc: "Find the entry information that applies to your visit." },
      { t: "facts", title: "Standard entrance options", fields: [
        ["Entrance options and amounts", "Private vehicle $35 · Motorcycle $30 · On foot or bike $20 · Annual park pass $70"],
        ["Validity and entry conditions", "Valid 1–7 days for both parks and the Hume Lake District of Sequoia National Forest"],
      ] },
      { t: "facts", title: "Existing passes and eligibility", fields: [
        ["Accepted passes", "Sequoia & Kings Canyon Annual Pass and all America the Beautiful passes"],
        ["Eligibility and required documentation", "Bring photo ID with any America the Beautiful pass. Seniors, military, 4th graders and people with permanent disabilities may qualify for free or discounted passes."],
      ] },
      { t: "facts", bg: "paper", outer: "Visiting from abroad", title: "International visitor information", desc: "Review the information that applies to your visit.", fields: [
        ["Fees, eligibility and conditions", "Non-US residents 16+ pay an extra $100 per person unless entering with an Annual or America the Beautiful pass ($250 non-resident annual pass)."],
      ] },
      { t: "facts", bg: "paper", title: "Payment and purchase options", fields: [
        ["Payment methods and purchase locations", "Cards and mobile pay only at entrance stations. Cash accepted at the Foothills and Kings Canyon visitor center park stores."],
        ["Official purchase provider", "Recreation.gov (digital passes)"],
      ] },
      { t: "ctas", bg: "bark", eyebrow: "Ready to purchase", primary: "Continue to Official Pass Purchase", primaryIcon: "upright", secondary: "Entry Reservation Information" },
    ],
  },
  {
    file: "purchase.html", nav: "plan", title: "Continue to the official purchase site",
    description: "Leave this site to buy a park pass from Recreation.gov, the official provider.",
    sections: [
      { t: "intro", eyebrow: "Leaving this site", title: "Continue to the official purchase site", desc: "Review current fees, eligibility, and payment details with the official provider." },
      { t: "facts", fields: [["Official purchase destination", "Recreation.gov, the official federal site for park passes"]] },
      { t: "ctas", primary: "Open Official Purchase Site", primaryIcon: "ext", secondary: "Back to Fees & Passes", secondaryIcon: "left", secondaryLeft: true },
    ],
  },
  {
    file: "compare-groves.html", nav: "groves", title: "Choose a Grove",
    description: "Compare Giant Forest and Grant Grove: landmarks, walks, parking and accessibility.",
    sections: [
      { t: "intro", eyebrow: "Explore the groves", title: "Choose a Grove", desc: "Compare the landmarks and planning information for each grove." },
      { t: "facts", img: IMG.giantForest, loc: "Grove · Giant Forest", title: "Giant Forest", desc: "Explore General Sherman and nearby sequoia trails.", fields: [
        ["Park", "Sequoia National Park"],
        ["Featured landmark", "General Sherman Tree"],
        ["Walking options", "Sherman Tree Trail (0.5 mi), Congress Trail (2.7 mi loop), Big Trees Trail (0.75 mi loop)"],
        ["Arrival and parking information", "Main Sherman Tree lot off Wolverton Road; free summer shuttle from Giant Forest Museum"],
        ["Accessibility details", "Paved accessible trail to General Sherman (about 500 ft); Big Trees Trail is paved with boardwalk"],
      ], links: ["Giant Forest access details", "Directions & Transportation", "Current conditions", "People & History"], cta: "Explore Giant Forest" },
      { t: "facts", bg: "moss", img: IMG.grantGrove, loc: "Grove · Grant Grove", title: "Grant Grove", desc: "Discover General Grant and the surrounding grove.", fields: [
        ["Park", "Kings Canyon National Park"],
        ["Featured landmark", "General Grant Tree"],
        ["Walking options", "General Grant Tree Trail (0.3 mi paved loop); Panoramic Point (0.5 mi, seasonal)"],
        ["Arrival and parking information", "General Grant Tree lot near Grant Grove Village, via Hwy 180 and the Big Stump entrance"],
        ["Accessibility details", "Paved but steep in places; not designated wheelchair-accessible. Tactile and Braille panels along the trail."],
      ], links: ["Grant Grove access details", "Directions & Transportation", "Current conditions", "People & History"], cta: "Explore Grant Grove" },
    ],
  },
  {
    file: "giant-forest.html", nav: "groves", title: "Giant Forest",
    description: "Giant Forest in Sequoia National Park: General Sherman, trails, arrival and accessibility.",
    sections: [
      { t: "hero", img: IMG.mist, eyebrow: "Grove · Giant Forest · Sequoia National Park", title: "Giant Forest", desc: "Explore General Sherman and nearby sequoia trails. Use the arrival and access information to plan your time in the grove." },
      { t: "feature", eyebrow: "Featured landmark", img: IMG.sherman, title: "General Sherman Tree", desc: "Learn about the landmark and compare walking approaches.", cta: "View General Sherman" },
      { t: "rows", eyebrow: "Things to do", title: "Trails & Walks", items: [
        { label: "Congress Trail", level: 2, meta: "2.7 mi loop · Paved" },
        { label: "Big Trees Trail", level: 1, meta: "0.75 mi loop · Accessible" },
        "All Trails & Walks",
      ] },
      { t: "facts", outer: "Getting here", title: "Getting Here", fields: [
        ["Arrival and parking information", "Main Sherman Tree lot off Wolverton Road, 2 mi north of Giant Forest Museum. Summer lots fill early; free shuttles run late May–early September."],
      ], cta: "Plan Your Arrival" },
      { t: "rows", bg: "bark", eyebrow: "Access", title: "Accessibility", items: ["Accessible Trails & Routes", "Parking & Mobility Support"] },
      { t: "rows", bg: "bark", eyebrow: "Right now", title: "Conditions", items: ["Current Conditions"] },
      { t: "rows", bg: "paper", eyebrow: "Learn more", title: "Related History & Ecology", items: ["People & History", "Fire & Forest Ecology"] },
      { t: "ugc", bg: "moss", eyebrow: "Community", title: "Visitor Photos & Stories", desc: "This area is reserved for visitor-submitted photos and stories. No collected submissions are available yet." },
    ],
  },
  {
    file: "general-sherman-tree.html", nav: "groves", title: "General Sherman Tree",
    description: "Walking and accessible approaches to the General Sherman Tree, with parking and seasonal access.",
    sections: [
      { t: "hero", crumbs: ["Explore the Groves", "Giant Forest"], img: IMG.sherman, eyebrow: "Landmark · Giant Forest", title: "General Sherman Tree", desc: "Discover General Sherman in Giant Forest. Review the approach, parking and seasonal information before choosing your route." },
      { t: "facts", outer: "Route options", title: "Main walking approach", desc: "Review the walking route and its effort before your visit.",
        rating: { level: 2, feats: [["yes", "Paved"], ["no", "Step-free"], ["no", "Gentle grade"], ["yes", "Accessible parking"], ["yes", "Benches"]] },
        fields: [
          ["Route effort", "Moderate: 0.5 mi down, then about a 200 ft climb back at ~7,000 ft"],
          ["Surface", "Paved"],
          ["Steps", "Some stairs; benches along the trail"],
          ["Parking", "Main Sherman Tree lot off Wolverton Road (5 accessible spaces)"],
          ["Seasonal access", "Open year-round; can be snowy or icy in winter"],
        ] },
      { t: "facts", bg: "paper", outer: "Access needs", title: "Accessible approach", desc: "Review the specific route features and parking arrangements for your access needs.",
        rating: { level: 1, feats: [["yes", "Wheelchair accessible"], ["yes", "Paved"], ["yes", "Step-free"], ["yes", "Grade ≤ 5%"], ["yes", "Accessible parking"], ["yes", "Accessible restrooms"]] },
        fields: [
          ["Route effort", "Easy: about 500 ft, gently sloped (inclines up to 5%)"],
          ["Surface", "Paved, limited cross-slopes"],
          ["Steps", "None"],
          ["Parking", "Sherman Tree Accessible Parking Area on the Generals Hwy. Placard required; free temporary placards at visitor centers."],
          ["Seasonal access", "Year-round; fewer accessible spaces in winter; wheelchair-accessible shuttle in summer"],
        ] },
      { t: "rows", bg: "bark", eyebrow: "Keep exploring", title: "Related planning & learning", items: ["Accessibility", "Directions & Parking", "Current Conditions", "Tree Facts & Life Cycle", "People & History", "Nearby Trails"] },
    ],
  },
  {
    file: "about-the-sequoias.html", nav: "learn", title: "Why the Sequoias Matter",
    description: "The ecology, conservation and human history of the giant sequoia groves.",
    sections: [
      { t: "hero", img: IMG.grantGrove, eyebrow: "About the Sequoias", title: "Why the Sequoias Matter", desc: "Discover the ecology, conservation, and human history of the sequoia groves." },
      { t: "topics", eyebrow: "Learning topics", title: "Start learning", items: [
        ["Tree Facts & Life Cycle", "Learn about giant sequoias and the stages of their lives.", "tree"],
        ["Fire & Forest Ecology", "Explore the relationship between sequoias, fire and the forest around them.", "flame"],
      ] },
      { t: "topics", bg: "paper", items: [
        ["Climate & Conservation", "Learn about conservation questions and the future of the groves.", "globe"],
        ["People & History", "Explore human connections to the groves and their protection history.", "book"],
      ] },
      { t: "reflect", bg: "moss", eyebrow: "Future contributions", title: "Visitor reflections", desc: "This area is reserved for future visitor reflections and photo contributions.", cards: [
        ["Photo contribution", "Upload a photo or add a short reflection about your visit.", "Add photo", "camera"],
        [null, "Share what you noticed, learned, or remembered from your visit.", "Add reflection", "edit"],
      ] },
      { t: "ctas", bg: "moss", primary: "Explore the Groves" },
    ],
  },
  {
    file: "people-and-history.html", nav: "learn", title: "People & History",
    description: "Indigenous connections, the protection of the groves and the history of the parks.",
    sections: [
      { t: "intro", crumbs: ["About the Sequoias"], eyebrow: "About the Sequoias", title: "People & History", desc: "Explore the human connections and protection history of the sequoia groves." },
      { t: "facts", title: "Indigenous Connections", desc: "Explore Indigenous connections to the lands around the sequoia groves through official, attributed sources.",
        fields: [["Community attribution and source information", "Homelands of the Mono (Monache), Yokuts, Tübatulabal, Paiute, and Western Shoshone · Source: NPS"]],
        links: ["Official sources: Indigenous Connections"] },
      { t: "facts", bg: "paper", outer: "Stewardship", title: "Protecting the Groves", desc: "Explore the efforts to protect the groves and the people involved in their stewardship.",
        fields: [["Protection history and source information", "1891–1913: U.S. Army cavalry, including Buffalo Soldiers led by Charles Young, protected the parks · Source: NPS"]],
        links: ["Official sources: Park Protection & History"] },
      { t: "facts", bg: "bark", outer: "The parks", title: "Park History", desc: "Learn about the history of the parks and the care of the sequoia groves.",
        fields: [["Historical details and dates", "Sequoia NP established Sept 25, 1890 · General Grant NP one week later · Kings Canyon NP 1940"]],
        links: ["Official sources: Park History"] },
      { t: "ctas", bg: "bark", primary: "Explore the Groves" },
    ],
  },
  {
    file: "accessible-trails.html", nav: "plan", title: "Accessible Trails & Routes",
    description: "Compare surfaces, steps, grades and parking for accessible routes in Giant Forest and Grant Grove.",
    sections: [
      { t: "intro", crumbs: ["Plan Your Visit", "Accessibility"], eyebrow: "Accessibility", title: "Accessible Trails & Routes", desc: "Compare route features rather than a single accessibility rating." },
      { t: "segment", name: "grove", options: [["giant", "Giant Forest"], ["grant", "Grant Grove"]], panels: {
        giant: [
          { loc: "Landmark · Giant Forest", title: "General Sherman: Accessible Approach", desc: "Review each route feature against your access needs.",
            rating: { level: 1, feats: [["yes", "Wheelchair accessible"], ["yes", "Paved"], ["yes", "Step-free"], ["yes", "Grade ≤ 5%"], ["yes", "Accessible parking"], ["yes", "Accessible restrooms"]] },
            fields: [
              ["Surface", "Paved, slightly sloped"],
              ["Steps", "None"],
              ["Distance", "About 500 ft (150 m)"],
              ["Duration", "About 15–30 min round trip (estimate)"],
              ["Slope or elevation information", "Inclines up to 5%, limited cross-slopes"],
              ["Accessible parking", "Sherman Tree Accessible Parking Area, Generals Hwy"],
              ["Nearby facilities", "Accessible restrooms, benches and outdoor exhibits"],
              ["Access details", "Placard required to park; free temporary placards at visitor centers"],
            ], links: ["Current conditions", "View General Sherman’s accessible approach"] },
          { loc: "Trail · Giant Forest", title: "Big Trees Trail", desc: "Review each route feature against your access needs.",
            rating: { level: 1, feats: [["yes", "Wheelchair accessible"], ["yes", "Paved + boardwalk"], ["yes", "Step-free"], ["partial", "Moderate slopes"], ["yes", "Accessible parking"], ["yes", "Accessible restrooms"]] },
            fields: [
              ["Surface", "Paved, with a long boardwalk section"],
              ["Steps", "None"],
              ["Distance", "0.75 mi (1 km) loop around Round Meadow"],
              ["Duration", "About 30–45 min (estimate)"],
              ["Slope or elevation information", "Moderately sloped; level landings at exhibits"],
              ["Accessible parking", "Dedicated trailhead lot, 9 spaces (no access aisles)"],
              ["Nearby facilities", "Accessible flush restrooms and bottle filler at the trailhead"],
              ["Access details", "Benches with backrests; 0.25 mi paved link from Giant Forest Museum"],
              ["Elevation gain", "Not listed by NPS; moderately sloped loop"],
            ], links: ["Current conditions"] },
        ],
        // Grant Grove wasn't detailed in Figma; facts from nps.gov/seki accessibility pages.
        grant: [
          { loc: "Landmark · Grant Grove", title: "General Grant Tree Trail", desc: "Review each route feature against your access needs.",
            rating: { level: 1, feats: [["no", "Wheelchair accessible"], ["yes", "Paved"], ["partial", "Stairs can be bypassed"], ["no", "Gentle grade"], ["yes", "Accessible parking"], ["yes", "Accessible restrooms"], ["yes", "Tactile & Braille panels"]] },
            fields: [
              ["Surface", "Paved, with steep sections"],
              ["Steps", "Stairs on the short path around the General Grant Tree; they can be bypassed to finish the loop"],
              ["Distance", "0.3 mi (0.5 km) loop"],
              ["Duration", "About 20–30 min (estimate)"],
              ["Slope or elevation information", "Steep in places; not designated wheelchair-accessible"],
              ["Accessible parking", "One accessible space at the trailhead"],
              ["Nearby facilities", "Accessible flush restrooms and drinking fountains"],
              ["Access details", "Tactile panels with raised illustrations and Braille; benches at pullouts"],
            ], links: ["Current conditions"] },
          { loc: "Viewpoint · Grant Grove", title: "Panoramic Point", desc: "Review each route feature against your access needs.",
            rating: { level: 1, feats: [["yes", "Paved"], ["yes", "Step-free"], ["partial", "Grade 6.5–8.5%"], ["yes", "Accessible parking"], ["yes", "Accessible restroom"], ["yes", "Benches"]] },
            fields: [
              ["Surface", "Paved, moderately steep"],
              ["Steps", "None to the first viewpoint"],
              ["Distance", "0.5 mi (0.8 km)"],
              ["Duration", "About 20–30 min (estimate)"],
              ["Slope or elevation information", "75 ft gain; 6.5% average grade, 8.5% at the steepest"],
              ["Accessible parking", "One space with a marked access aisle"],
              ["Nearby facilities", "Accessible vault restroom, picnic tables and benches"],
              ["Access details", "Seasonal: the road opens in late May and closes when snow makes it impassable"],
            ], links: ["Current conditions"] },
        ],
      } },
    ],
  },
];
