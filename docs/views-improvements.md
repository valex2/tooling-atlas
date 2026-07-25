I have enough grounding across all three views and the shared history/palette machinery. Here is the roadmap.

Per my operating constraints I'm returning the document as my response rather than writing a report file; the content below is ready to drop into `docs/views-improvements.md`.

---

# Views Improvement Roadmap — Tree, Relay, Browse

*Synthesis of four reviewers' grounded notes, deduped, feasibility-checked against the hard constraints (zero-dep, no-build, performant, offline + inlined-bundle safe, warm/quiet aesthetic, WCAG-AA), and ranked by impact × effort × serves-the-argument. Source verified against `views/tree.js`, `views/relay.js`, `views/browse.js`, and `shared.js`.*

## Orientation

The essay's thesis is geographic — leadership migrates country to country and follows the hardest making — and **all three views currently under-serve exactly that axis**, even though `c.country` is clean and populated on all 283 cards and `ctryOf`/`ctryColor` already exist in Relay. That is the single biggest lever this pass has, and it is the through-line of the top of the roadmap.

- **Tree** is the strongest of the three where it counts: the click-to-select lineage (lights a card's full ancestry + descendants at 0.9, dims the rest) is the atlas's best single interaction. But it encodes country *nowhere* while 66% of its edges cross a border, its resting edge layer is a hairball, and its search box feels broken (outlines matches, dims nothing, no count, no scroll).
- **Relay** is the most rigorously built view — the tenure/scale/coda seam is self-verifying and should be left largely untouched — but it buries its own punchline: the honest aggregate numbers (≈4% of years held; 211 of 273 turns on a single card) surface only inside a collapsed toggle and at the bottom of a 4182px scroll, and the whole gutter (thread name + blurb) scrolls off-screen on mobile at the exact moment you reach the marks.
- **Browse** has unusually careful a11y and honest cross-mode state, and its weaknesses are almost all additive fills rather than rebuilds: country is invisible in every mode, Coverage wastes ~1000px and buries its strongest artifact (the era×kind gap matrix) last, and there's no zero-state.

## Tree — ranked

| # | Improvement | Why | Serves argument | Effort | Impact |
|---|---|---|---|---|---|
| 1 | Make cross-border genealogy edges visible (+ toggle) | 66% of edges cross a border; the core claim is invisible in the one view built to show idea flow | ★★★ | M | High |
| 2 | Give search teeth: dim non-matches, count, locate first hit | Search currently outlines matches but dims nothing — feels broken on a 4316px stage | — | S | Med |
| 3 | Order lanes by the four spines, not earliest card | Makes the Tree read as the essay's structure; groups a picked history | ★★ | M | Med |
| 4 | Calm the resting hairball with hover-preview lineage | At-rest 452 edges @0.25 undercut "ideas build on ideas" before any click | ★ | M | Med |
| 5 | Stop clamping the two most-ancient cards to the axis edge | `minY=540` lies about Paper (105) and Euclid (300) | ★ | S | Low |

## Relay — ranked

| # | Improvement | Why | Serves argument | Effort | Impact |
|---|---|---|---|---|---|
| 1 | Put the honesty number in the always-visible header | The quantified punchline is hidden in a collapsed toggle + page bottom | ★★★ | S | High |
| 2 | Make the gutter survive horizontal scroll (sticky HTML column) | Thread name/blurb scroll off-screen exactly when you reach the marks; mobile + WCAG | ★★ | M | High |
| 3 | Let a reader trace one country across panels (legend hover/click) | Thesis is migration; nothing lets you follow one country | ★★ | M | Med |
| 4 | Give blurb-named cameo countries a label foothold | "then Veldhoven", "the web is Swiss" render as anonymous grey at the argument's climax | ★★ | M | Med |
| 5 | Stop the ledger clipping each hold's year range | Ellipsis eats the terminal year — the one column a reader wants | — | S | Low |

## Browse — ranked

| # | Improvement | Why | Serves argument | Effort | Impact |
|---|---|---|---|---|---|
| 1 | Add a "By country" / leadership panel to Coverage | The essay's central axis is the one axis Coverage omits | ★★★ | M | High |
| 2 | Rebalance the Coverage grid; lead with the era×kind matrix | ~1000px dead whitespace; the gap artifact is rendered dead last | ★★ | M | High |
| 3 | Add sortable Country column to Table + include country in search | Can't sort/group by the thesis axis; "Korea" only matches inside free-text Place | ★★ | S | Med |
| 4 | Tame the "By decade" list (bin the sparse pre-1800 tail) | ~40 of 60 rows are 1-card ancient decades burying the dense modern shape | ★ | M | Med |
| 5 | Add a zero-results state to Cards and Table | Over-filtering yields a blank canvas + stale boilerplate hint | — | S | Med |
| 6 | Fix silent front-prose truncation (240 of 283 cards clip) | 85% of card fronts end mid-sentence with no affordance | — | M | Med |

## Cross-cutting

| # | Improvement | Why | Serves argument | Effort | Impact |
|---|---|---|---|---|---|
| 1 | Sequence the three "make geography visible" items together | Tree edges + Relay trace + Browse panel/column are one argument in three views; ship as a set | ★★★ | — | High |
| 2 | Batch visual changes and re-bless golden baselines once | Tree/Relay/Browse have blessed pixel baselines (see relay.js comments; Linux baselines already pending per work-state) — every pixel change costs a re-bless | — | S | (cost) |
| 3 | Align search behaviour across views | Browse search is robust; Tree's is not — same mental model should hold everywhere | — | S | Low |

---

## Top items, in depth

Ordered to lead with what most advances the essay's argument, then by impact/effort.

### 1. Tree — cross-border genealogy edges *(the core move)*

**Files/functions:** `views/tree.js` edge loop in `render()` (lines ~140-155); a new toggle in the control bar (alongside `#q`/`#reset`); subtitle in `views/tree.html`.

**How:** In the edge loop, compare `byId[c.id].country` vs `byId[en].country` (raw strings — both endpoints use the same field, no need to collapse USA). Same-country edges stay solid; cross-border get `stroke-dasharray="4 3"`, kept subtle at the resting 0.25 so it reads as texture, not noise. Add a checkbox "trace border crossings": when on, drop same-country edges to ~0.04 and lift cross-border edges *and their endpoint nodes* — turning the resting hairball into a literal picture of ideas jumping countries. On a selected lineage (`lit` set already computed), mark cross-border hops in the lit path with the dash plus a 3px dot at the bezier midpoint `(mx, (y1+y2)/2)`. Update the subtitle to name the new signal.

**Constraints:** Pure SVG attributes, zero deps. Nation-level granularity loses intra-empire nuance — acceptable for the thesis. Keep at-rest dashing subtle; the strong contrast lives behind the toggle/selection so the default view doesn't get busier. **Baseline cost:** changes at-rest pixels → re-bless.

### 2. Relay — the honesty number in the header *(highest value per byte)*

**Files/functions:** `views/relay.js` MOUNT block (~864-878); a new element in the `views/relay.html` hero, under the existing `.sub`.

**How:** `TOT` and `pct()` are already computed. Add `<p id="finding">` in the header and set its `innerHTML` in MOUNT from live values, e.g. *"Across the 27 threads drawn here, {pct(TOT.held,TOT.span)}% of the years can be shown as held, and {TOT.single} of {TOT.turns} country turns rest on a single dated card — a date, not a tenure."* ~6 lines of wiring. Numbers stay live-injected, so zero drift risk (same pattern as `methodHTML`/`codaHTML`).

**Constraints:** Keep it to one line on mobile (CSS clamp/`text-wrap:balance`). No data-integrity risk. This is the cheapest item on the board that materially advances the argument — do it first among Relay work.

### 3. Browse — "By country" leadership panel in Coverage

**Files/functions:** `views/browse.js` — `renderCoverage()` (457-552), `filtered()` (200-223), the initial `getState()` block (42-52), `syncHash()` (71-83), `renderCount()` pill logic (166-196), and the `hashchange` re-hydration (688-693).

**How:** Add a `country` module var; parse `st.country` on load; add it to `syncHash`; add one branch to `filtered()`: `if (country && c.country !== country) return false;`. Build a `byCountry` list scoped by `hist` (like the other panels), reuse `bars()`/`segBar()`, sort by count desc. To serve the thesis rather than run a flat census, **stack/weight by Make+Manufacture** so the panel reads as "where the hardest making concentrates." Link each row to `#mode=table&country=…`; add `country = st.country || ""` to the `hashchange` handler so the drill-link lands, and a removable country pill in `renderCount()` (mirror the existing `decade` pill, including its `kbd()` wiring). Display-abbreviate the long `"United States of America"` label.

**Constraints:** Keep it a static ranked inventory (a coverage census), *not* a migration animation — that's the Globe's lane. Zero new deps; rides existing helpers.

### 4. Browse — rebalance the Coverage grid, lead with the era×kind matrix

**Files/functions:** `views/browse.js` `renderCoverage()` innerHTML (458-470); grid CSS in `views/browse.html` (~line 105) and the `@media (max-width:760px)` rule (127-129).

**How:** Reorder the emitted blocks: era×kind **matrix first, full width** (it literally says "red = gap, nothing written yet" — it *is* the coverage argument); then a paired row of the two short cards side by side — "By kind" + the new "By country" — so neither stretches to a 60-row height; then "Threads by size"; then "By decade". Pure markup reordering — the components already render correctly. Verify the single-column `@media` rule still applies cleanly to the reordered cards.

**Constraints:** Low risk, no new components. This and item 3 are natural to ship together (both touch `renderCoverage`).

### 5. Relay — sticky gutter that survives horizontal scroll

**Files/functions:** `views/relay.js` `drawGutter()` (536-570) and `layoutPanel()` (returns `top`/`height`); `views/relay.html` `.scroll` region.

**How:** Lift the gutter (name, coverage meter, caveat line, blurb) out of the SVG `<text>` at `x=8..200` into an HTML overlay column, positioned per panel from the `lay.top`/`lay.height` numbers `layoutPanel` already returns — no geometry rewrite. Pin it against horizontal scroll. **Precedent already in the repo:** `tree.js` `pinLabels()` (93-98) solves the identical "label must survive horizontal scroll" problem by re-adding `scroll.scrollLeft` to each label's `left` on the `scroll` event; mirror that for a left-pinned column (or use `position:sticky;left:0` if the gutter becomes real HTML in the scroll flow). This lets blurbs wrap in real CSS and retires the hand-rolled `wrap()`/`tw()` estimator (a clean break, consistent with the repo's no-shim policy).

**Constraints:** Two layers must stay vertically aligned across zoom/font metrics — test 320-1400px. Primarily a mobile/WCAG win (wide desktop already fits), and mobile + WCAG are explicit constraints. **Baseline cost:** moves marks off the SVG → re-bless.

### 6. Browse — Country column in Table + country in search

**Files/functions:** `views/browse.js` `COLS` (336-344), row template (404-411), search haystack (208-218); table `min-width` in `views/browse.html` (129).

**How:** Add `["country","Country"]` to `COLS` and emit `<td>${c.country||""}</td>` in the row — it sorts for free via the existing `val()`/`tableRows()` path, grouping all Japanese or German tools together. Append `+ " " + (c.country||"")` to the search haystack so "Korea"/"Netherlands" match the clean field, not just where the string happens to sit in free-text Place. Widen the table `min-width` slightly (currently 660px) for the 7th column.

**Constraints:** One-line changes on existing code paths. Place (city) and Country (sortable axis) both earn their place. Small effort, directly serves the argument — pairs with items 3-4 as the Browse geography set.

### 7. Tree — give search teeth

**Files/functions:** `views/tree.js` node loop in `render()` (131-136), the `#q` `oninput` handler (173-179), the global `aria-live` region.

**How:** When `q` is non-empty, extend the `dimd` computation (line 133) so non-matches get the existing `.dim` treatment (the selection path already proves `.dim` reads well), keep `.hl` outlines on matches, write "N matches" into the existing global aria-live region, and scroll the earliest match into view via `pos[id].x → scroll.scrollLeft`. Debounce the scroll (or only scroll when the match set shrinks to a stable few) so it isn't jumpy per-keystroke. Ensure search-dim and history-dim combine as a single `.dim` class (no double-darkening). Optionally widen the match test beyond `c.name` to person/place, matching Browse.

**Constraints:** Local, no new state beyond what `setState` already stores. Doesn't advance the argument, but fixes a control that currently *feels broken* — cheap and high-perceived-quality.

---

## Nice-to-have

- **Tree — hover-preview lineage** (`render()`, node `mouseenter`): on hover with nothing selected, raise that node's immediate/`anc`+`desc` edges to ~0.8 and drop the rest to ~0.06; clears on `mouseleave`, no state change. Cache per-id lit sets (Integrated Circuit = 58 nodes) to avoid recompute stutter. Optionally lower the resting edge opacity from 0.25 → ~0.12 so the at-rest layer is texture. No touch equivalent — mobile keeps tap-to-select. *Serves the argument, but overlaps item 1's toggle; sequence after it.*
- **Tree — order lanes by the four spines** (`lanes` sort, line 27): sort by `historyOf(thread)[0]` in `HISTORIES` spine order, then earliest member within group; add a faint per-history gutter label. Chip Lithography resolves to `optics` via `historyOf()[0]`. *Genuinely serves structure; deferred only because it reshuffles every lane's vertical position → a full re-bless for a readability (not correctness) gain.*
- **Browse — By-decade tail binning:** collapse pre-~1800 into one "before 1800" row (or a few era bins), per-decade only where dense. Loses per-decade drill for ancient decades (each holds 1 card) — acceptable.
- **Browse — front-prose "more" affordance:** overflow-detect after render, add a quiet bottom fade + "↓ more" only on overflowing cards. *Real UX gap (240/283 clip), but Cards is kept byte-identical to the blessed Deck (browse.js:11-12) — any face change risks a re-bless for a non-argument fix; scope tightly and batch.*
- **Relay — cameo-country label foothold:** where a flagship blurb names a country, echo it as a small labelled callout on that country's marks by extending the existing hold-label tier system to named single-card cases. **Must be label/outline only — do not add a 5th hue** (breaks the CVD-validated 4-slot palette on cream).
- **Relay — ledger year-range mini-column:** give the year range its own right-aligned column (like `.len`) in `ledgerHTML()` so the panel name absorbs the ellipsis instead of the year. Do it only if touching the ledger anyway.
- **Tree — un-clamp the two ancient cards:** set `minY` to ~100. Log-in-time means post-1500 barely moves, but two cards is a modest payoff for shifting (and re-blessing) every x position; re-verify the `600`-start gridline loop and era bands. *Borderline gold-plating unless the empty left third is addressed too.*

## Leave it alone

- **Tree's click-to-select lineage.** It's the atlas's best interaction and the reference the other views' dimming borrows from. Extend around it (items 1, 4, 7); don't refactor it.
- **Relay's DERIVE/SCALE/TENURE/coda math (seams 1-5).** Deliberately DOM-free and self-verifying, with the tenure rule, the fold logic, and the "paint-forward would be a lie" counterexample all load-bearing and documented. Every proposed change here is presentational (header, gutter, legend interaction) — keep it that way.
- **Browse's hand-rolled a11y** (focusable `th`/`tr` that preserve `columnheader`/`row` semantics, `inert` turned-away faces, the deliberate *non*-use of `kbd()` on cards/headers/rows). The comments explain why each choice avoids an a11y trap; new columns/panels must ride these paths, not replace them.
- **The 4-slot country palette.** Do not add a 5th hue anywhere (Relay cameo, Tree, Browse) — the four slots are CVD-validated on the cream surface. Isolate/label the tail; never colour it.
- **Coverage's History-only scoping** and **Relay country-trace as dim-not-filter.** Both protect the honesty of the "what's missing / how little there is" claim; letting kind/thread/q filter Coverage, or making the country trace a hard filter, would silently turn a real gap into "nothing matching your filter."
- **The Globe.** Out of scope for this pass by instruction; the Browse "By country" panel must stay a static census so it doesn't drift into Globe territory.
---

## Implementation notes (added on review)
- **DROPPED — Relay "honesty number in the header" (Relay #1):** re-adds the finding pull-quote the user explicitly had removed earlier ("this should also be removed"). Not implemented; would contradict a direct instruction.
- The dedicated **Cross-cutting reviewer failed** (StructuredOutput retry cap); the Cross-cutting section above is backfilled from the other three reviewers' notes, so it is thinner than the per-view sections.
- Verified against data before acting: Tree cross-border edges = 298/452 (66%, confirmed); Tree search highlights matches but does not dim non-matches or count; Relay `finding` refs are comments only (the element was already removed).
