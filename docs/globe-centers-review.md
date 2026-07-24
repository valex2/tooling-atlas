The improvement review is written to `/Users/Vassilis/Desktop/Tooling/tooling-atlas/docs/globe-centers-review.md`.

# Globe Centers — Improvement Review

The globe (`views/map.js`) plots 180 dated technology cards and labels roughly two dozen "centers" automatically. The labeling is mechanical, and it is wrong in ways that actively invert the essay's argument: it buries the real tool-making centers of the world and promotes placeholders and field stations in their place. This review documents the failure, rules on the user's four candidate centers, proposes a verified curated set, and sketches the fix.

---

## 1. What's wrong now

The center labels are produced by a four-step heuristic in `map.js` (≈ lines 268–302):

1. **Bucket** every card by its coordinate rounded to one decimal place (`c.lat.toFixed(1) + "," + c.lon.toFixed(1)`).
2. **Cluster** buckets greedily: walk buckets densest-first and merge any bucket whose squared coordinate distance to an existing cluster is `< 25` — i.e. within ~5°, about 500 km.
3. **Name** each cluster after the *single densest bucket's raw `place` string*, taking only the first comma-separated token (`place.split(",")[0]`).
4. **Keep** the 26 largest clusters by total card count.

Three structural flaws follow directly from this design:

- **A ~5° merge radius fuses distinct centers hundreds of km apart.** London, Paris, Delft and Veldhoven collapse into one "London" mass; the entire San Francisco Bay Area collapses into one dot; Tokyo and Toyota City are pulled into "Osaka."
- **Naming by the densest raw string means one arbitrary city speaks for a whole region** — and if that string is a placeholder or a facility name, the region inherits it.
- **The raw place strings are inconsistent**, so cards at one real place split across buckets (see §5), and a synthetic placeholder coordinate can out-rank a real historic lab sitting underneath it.

### Confirmed failures

- **"Pharma labs" is the #1 label (≈40 cards).** It comes from a single card, **High-Throughput Screening** (1995), whose `place` is the non-place `"Pharma labs, USA and Europe"` at a synthetic averaged coordinate `(40.7, −74.4)`. That coordinate lands almost exactly on top of Murray Hill, NJ `(40.68, −74.4)`, so the placeholder seeds and names an East-Coast blob that swallows Cambridge MA, New York, Washington, Waltham and East Fishkill.
- **"NASA Ames" (≈29 cards) labels all of Silicon Valley.** One card, **Computational Fluid Dynamics** (`"NASA Ames, California, USA"`), is the densest-named bucket in the Peninsula, so a single field-station string names the densest making-region on Earth — Palo Alto, Stanford, Mountain View, Santa Clara and San Jose all fold under it (**The Integrated Circuit**, **The Microprocessor**, **The GPU**, **The Transformer**, **Recombinant DNA**, **PageRank**…).
- **The "London" blob eats Veldhoven.** ASML's **The EUV Machine** (2019) and **The Measure Station** (2001), both placed `"Veldhoven, Netherlands"` ~500 km away, are absorbed into a "London"-named cluster — the hardest machine humans build, filed under the wrong country. Cambridge (Cavendish / MRC LMB) is swallowed the same way.
- **Bell Labs is erased.** `"Murray Hill, New Jersey, USA"` is the **single largest exact place-string in the corpus (9 cards)** — **The Transistor**, **The Bit**, **The MOSFET**, **The Silicon Solar Cell**, **Zone Refining**, **Unix and C**, and more — the physical and mathematical bedrock of everything downstream. It is absorbed into the "Pharma labs" blob and never named.

### Worst current labels

| Current label | Cards | What it actually is | Core cards it mislabels |
|---|---|---|---|
| **Pharma labs** | ~40 | A placeholder string, not a place; the US East-Coast blob | Transistor, Bit, MOSFET (Bell Labs); DRAM (IBM); RSA, Router (Cambridge MA) |
| **NASA Ames** | ~29 | One field station naming all of Silicon Valley | Integrated Circuit, Microprocessor, GPU, Transformer, Recombinant DNA |
| **London** | ~32 | A ~500 km England+NW-Europe megablob | EUV Machine (Veldhoven), DNA Sequencing (Cambridge), Matter Wave (Paris) |
| **Osaka** | ~4 | Denser than, and ~400 km from, the Tokyo cards it steals | Lithium-Ion Battery, CNC Controller (Tokyo); Toyota Production System |
| **Heidelberg** | ~3 | A lake-side city named over Mainz + Ludwigshafen | The Printing Press (Mainz); Haber–Bosch (Ludwigshafen) |
| **Meissen** | 1 | A porcelain town naming Berlin-era physics/rocketry | Czochralski Puller, Electron Microscope, The V-2 |
| **Shijiazhuang** | 1 | A pharma town named ~270 km over Beijing | The Solvent-Extraction Cascade (rare-earth science) |

---

## 2. The user's four candidates

| Candidate | Verdict | One line |
|---|---|---|
| **Silicon Valley** | **Include (corrected)** | The densest making-region in the corpus — 21 cards inside a 0.4° radius (Peninsula + Santa Clara Valley); drop "San Francisco" from the name (the one SF card, GPT-3's **The Scaled-Up Language Model**, sits ~37 km north, outside the radius). This is exactly the label that replaces the bogus "NASA Ames." |
| **Shenzhen** | **Exclude — corpus gap** | **Zero cards.** No `Shenzhen` place-string exists; China's cards sit in Beijing, Shijiazhuang, Wuxi, Changsha, Heilongjiang, Chang'an and Hong Kong. Adding it would invent a center the data cannot support — the honest read is that the corpus under-represents Chinese electronics manufacturing. |
| **Bell Labs** | **Include** | The largest single real place-string in the corpus (9 cards, Murray Hill NJ) and the highest-value single correction on the map; its name is currently erased by the "Pharma labs" placeholder colliding on its coordinate. |
| **Precision Valley** | **Include with caveat** | Vermont's Springfield/Windsor "Precision Valley" proper **has no card**, so it can't be labeled directly. The interchangeable-parts lineage the user is pointing at is captured instead by the **New England machine-tool belt** (Waltham 1813, Providence 1861, Worcester 1908). Include as that belt; note VT Precision Valley as a genuine corpus gap. |

---

## 3. Recommended curated center set

Verified centers only (each card confirmed by name, year and coordinate). Ordered by significance. **13 of the 19 are non-US** — the point of curation is to surface the real non-US centers the US-heavy heuristic buries.

| # | Center | Country | lat, lon | Cards | Era | Why |
|---|---|---|---|---|---|---|
| 1 | **Silicon Valley** (Peninsula & Santa Clara Valley) | USA | 37.44, −122.14 | 21 | 1939–2017 | Densest making-region in the corpus; Integrated Circuit, Microprocessor, GPU, CUDA, Transformer, Recombinant DNA, PageRank. Replaces "NASA Ames." |
| 2 | **Bell Labs** (Murray Hill, NJ) | USA | 40.68, −74.40 | 9 | 1947–1969 | The greatest industrial lab ever run: Transistor, Bit, MOSFET, zone refining — the bedrock of everything downstream. Replaces "Pharma labs." |
| 3 | **London** (Maudslay → Faraday/Bessemer → DeepMind) | UK | 51.51, −0.13 | 10 | 1622–2023 | Three making waves in one metro: screw-cutting lathe, induction ring, Bessemer steel, now AlphaFold & GNoME. Corrected to England-only. |
| 4 | **Los Angeles Basin** (aerospace & Caltech) | USA | 34.05, −118.30 | 6 | 1960–2015 | SoCal propulsion-and-beams belt: the Laser, F-1 engine, Mead–Conway EDA, directed evolution, Falcon 9. (Drop "/JPL" — no JPL card.) |
| 5 | **Cambridge** (Cavendish Lab & MRC LMB) | UK | 52.20, 0.12 | 5 | 1919–2006 | Europe's densest tool-making node for reading life: mass spectrograph, central dogma, monoclonal antibodies, DNA & next-gen sequencing. Freed from "London." |
| 6 | **Berkeley / East Bay** (Rad Lab, UC Berkeley, Cetus) | USA | 37.86, −122.28 | 4 | 1931–2012 | The cyclotron invented big-science accelerators; the same hills produced PCR and CRISPR-Cas9. Split out of the Bay-Area blob. |
| 7 | **Berlin & the Baltic north** | Germany | 52.52, 13.40 | 3 | 1916–1944 | Czochralski crystal-pulling (still how every wafer is grown), Ruska's electron microscope, von Braun's V-2. Replaces "Meissen." |
| 8 | **Keihin / Greater Tokyo** (Tokyo–Kawasaki) | Japan | 35.60, 139.70 | 3 | 1956–1996 | FANUC's CNC controller, Sony's first lithium-ion cell, Ajinomoto build-up film (under ~95% of advanced packages). Freed from "Osaka." |
| 9 | **Rhine-Neckar** (Ludwigshafen–Heidelberg) | Germany | 49.44, 8.56 | 3 | 1859–1984 | Haber–Bosch high-pressure ammonia (feeds ~half the planet), the spectroscope, cryo-EM. Freed from a mislocated "Heidelberg." |
| 10 | **IBM Hudson Valley** (Poughkeepsie/Yorktown/East Fishkill) | USA | 41.50, −73.83 | 3 | 1954–1983 | Dennard's DRAM cell and chemical-mechanical planarization; the punch card. Extracted from the "Pharma labs" mass. |
| 11 | **New England machine-tool belt** | USA | 42.15, −71.48 | 3 | 1813–1908 | The interchangeable-parts lineage (the "Precision Valley" intent): first integrated machine shop, universal miller, production grinder. |
| 12 | **Baikonur Cosmodrome** | Kazakhstan | 45.96, 63.31 | 2 | 1957–2011 | Korolev's R-7, first rocket to reach orbit, and its still-flying Soyuz descendant. Currently undersized at rank #14. |
| 13 | **Hsinchu Science Park** (TSMC) | Taiwan | 24.80, 120.97 | 2 | 1987–2002 | The most consequential hardware-making place on Earth: immersion lithography + the high-yield process recipe print >90% of leading-edge chips. |
| 14 | **Veldhoven** (ASML) | Netherlands | 51.42, 5.39 | 2 | 2001–2019 | The EUV scanner + van den Brink's overlay metrology — the physical bottleneck the whole semiconductor world funnels through. Freed from "London." |
| 15 | **Toronto** (deep learning & molecular biology) | Canada | 43.65, −79.38 | 2 | 1955–2012 | Smithies' gel electrophoresis and Krizhevsky's AlexNet code (cuda-convnet) that touched off the deep-learning era. |
| 16 | **Mainz** (the Printing Press) | Germany | 50.00, 8.27 | 1 | 1440 | Gutenberg's press — the first mass-replication technology and the information infrastructure of the modern world. Freed from "Heidelberg." |
| 17 | **Chukyo / Toyota City** (Toyota Production System) | Japan | 35.08, 137.16 | 1 | 1950s | Birthplace of lean pull-flow, the most-imitated way of making anything. Currently mislabeled "Osaka." |
| 18 | **Beijing** (rare-earth separation science) | China | 39.99, 116.30 | 1 | 1972 | Xu Guangxian's solvent-extraction cascade made rare-earth separation calculable — the science behind China's rare-earth position. Replaces "Shijiazhuang." |
| 19 | **Deccan / Hyderabad** (crucible wootz steel) | India | 17.38, 78.49 | 1 | c.1750 | The purest illustration of the atlas's tacit-knowledge thesis: a watered-steel recipe never written down and simply lost. India's only card. |

**Non-US: 13 of 19 (68%)** — a deliberate correction to a corpus that is ~51% US but whose auto-labeler is far more US-skewed than that.

Several single-card entries (Mainz, Chukyo, Beijing, Deccan) are included on **significance, not density** — each is a world-historic center that would otherwise go dark. That is a curatorial choice the anchor scheme makes possible; the density heuristic never could.

---

## 4. Centers dropped or unverified

- **Silicon Valley "San Francisco" extension** — dropped from the *name*: the only SF card (**The Scaled-Up Language Model**, GPT-3) is outside the 0.4° radius. SF is a distinct place.
- **Route 128 / Greater Boston** — real 12-card cluster, but the *name* overclaims: "Route 128" is a postwar minicomputer story none of these cards (Sketchpad, RSA, the Router, the Base Editor) tell. Keep the cluster; rename to **Cambridge / Greater Boston** before shipping.
- **San Diego / La Jolla** (Backpropagation, DFT, DNA-Encoded Libraries, Lentiviral Vector) — a genuine 4-card center; cut only to hold US labels below corpus share. Strongest re-add candidate.
- **Osaka advanced-materials cluster** — 4 real cards, but they span three different Sumitomo companies + a government lab over 38 years; the "keiretsu complex" framing overclaims. Include only as plain "Osaka" if at all.
- **Swiss science** (CERN/Web, IBM Zurich STM, Bern, Jura optics) and **"Lancashire–Clyde belt"** — rejected as whole-country/whole-region blobs that repeat the same over-broad anti-pattern, with anachronistic institution names attached to centuries-older cards.
- **Northern Italy (Renaissance instruments)** — real 6-card cluster but the name is anachronistic (spans 1202–1800) and geographically loose (half are Tuscany). Ship only under a de-anachronized name.
- **Vancouver (LNP), Geoje/Okpo (Mega-Block), Sendai (TSV), Delft & The Hague, Helsinki (ALD), Bletchley Park (Bombe), Philadelphia (modified-RNA letter), Chicago, Detroit** — real single/double-card origins cut for label-count and balance; several (Geoje, Vancouver, Helsinki) are the *only* card for their country and are worth re-adding to keep a country on the map.
- **Shenzhen, Precision Valley (VT proper), and other China singletons** — genuine corpus gaps, not labels to invent.

---

## 5. Data cleanup required first

No labeling scheme is reliable until the place data is normalized. The good news: **for every spelling-variant cluster except La Jolla, the rounded coordinate is identical across variants** — so coordinate, not free-text `place`, is the reliable clustering key, and a curated anchor table (§6) can key off it.

Required fixes:

1. **Kill the three non-places.**
   - **High-Throughput Screening** — `"Pharma labs, USA and Europe"` at the synthetic `(40.7, −74.4)` is the corpus's worst offender: not a place, and its fake coordinate lands on Bell Labs. Repoint to a real origin site and coordinate so it stops colliding with Murray Hill.
   - **Wootz Steel** — `"Deccan, India"` (a region) → `"Hyderabad, India"` (matches its `(17.38, 78.49)` coordinate).
   - **The Graphite Anode** — `"Heilongjiang, China"` (a province) → its actual city.
2. **Collapse spelling variants** (one real place, several strings):
   - **Mountain View** ×3: `"…California, USA"` / `"…USA"` / `"…United States"` (**The Integrated Circuit**, **The DNA Nanoball Array**, **The Transformer**…).
   - **Cambridge MA** ×2: `"…Massachusetts, USA"` vs `"Cambridge, USA"` (**RSA**, **Flow Chemistry**) — and keep it distinct from Cambridge, England.
   - **Stanford**, **Palo Alto**, **San Jose**, **La Jolla** each ×2.
3. **Standardize the grammar** to `City, State/Region, Country` with a fixed country token: backfill the 13 state-less US cards and replace every `"United States"` with `"USA"`.
4. **Reconcile La Jolla's two coordinates** (~6 km apart) to one, so its two cards cluster together.
5. **Derive `region`/`regionGroup` from coordinate (or a new `placeId`), not from the free-text string** — today the same coordinate gets contradictory region tags (San Jose's **Chemically Amplified Resist** filed "US (other)" while **The FPGA** at the identical point is "Silicon Valley / California").
6. **Handle era-vs-modern-nation pairs explicitly** (`historicalPlace` / `modernPlace`): Königsberg/Kaliningrad, Chang'an/Xi'an, 1957 Baikonur = USSR; fix the Baikonur & Sukhumi `regionGroup:"Russia"` tags that contradict their own country fields.

The cleanest durable fix is a stable **`placeId` slug per card** (`us-nj-murray-hill`, `us-ca-mountain-view`, …), bootstrapped from the rounded coordinate and hand-merged for the handful of clusters. Curation then keys off `placeId`, immune to display-string drift.

---

## 6. Recommended implementation

Replace the "name the cluster after its single densest raw city" rule (`map.js` ≈ 275–302) with a **curated anchor table** and a fallback:

```js
const CENTERS = [
  { name: "Bell Labs (Murray Hill, NJ)", lat: 40.68, lon: -74.40, radiusDeg: 0.05 },
  { name: "Silicon Valley",              lat: 37.44, lon: -122.14, radiusDeg: 0.40 },
  { name: "Veldhoven (ASML)",            lat: 51.42, lon: 5.39,    radiusDeg: 0.10 },
  // … the 19 verified centers from §3 …
];
```

Shape of the change:

1. **Assign, don't cluster-then-name.** For each card, find the anchor whose center is within its `radiusDeg` (nearest wins on ties) and add the card to that center. This is a small O(cards × centers) loop that replaces the greedy `< 25` merge entirely — no more 500 km fusions.
2. **Fall back to raw place only for unanchored cards.** Cards that match no anchor keep the existing behavior: bucket by coordinate, name by first `place` token — but now operating only on the long tail, not on the centers we care about.
3. **Keep collision-pruning.** Retain the top-N cap and add a small label-overlap prune so, e.g., the tight **Bell Labs** anchor (`radiusDeg 0.05`) does not draw on top of the repointed High-Throughput Screening card. The tight radius plus the §5 repoint together stop the Pharma-labs/Murray-Hill collision.
4. **Size and place from members, name from the table.** Keep sizing by member count and drawing at the anchor's `lat/lon`; the `name` is now authoritative instead of inherited from whichever string happened to be densest.

Because the anchors key off coordinate (or `placeId`), they are immune to the place-string inconsistencies in §5 — Mountain View's three spellings all fall inside the Silicon Valley radius regardless of how they're written.

**Essay implications.** The globe would finally *name the centers the essay argues about*. Today the map contradicts the text: the essay is about Bell Labs, Silicon Valley, the tacit-knowledge monopolies of ASML, TSMC and the Deccan smiths — and the map labels those exact places "Pharma labs," "NASA Ames," "London" and nothing at all. The curated set puts the real centers on the globe, with visible non-US weight (13 of 19), so the picture and the argument finally agree.