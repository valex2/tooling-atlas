# Globe Improvement Roadmap

Synthesis of five design-lens reviews, deduped, feasibility-checked against the hard
constraints (zero-dependency, no build step, must stay smooth at 283 cards while
`render()` runs every drag/play frame, must work offline and inside the inlined bundle,
keep the warm/quiet aesthetic), and ranked by impact × effort × **does it serve the
essay's argument** (leadership migrates country to country, following the hardest making).

Everything below was checked against the current code and against rendered states
(default, two-thread trace) — not guessed.

## Where the globe stands

The globe's *machinery* is strong and largely done: the orthographic projection, the
unified pointer/keyboard interaction, the curated 37-center anchor table, ranked search,
the collision-pruned labels, reduced-motion handling, and AA contrast are all in place and
should be left alone. Its *argument* is weak in three concrete, verified ways. **(1) The
state a first-timer lands on argues nothing** — boot is `T = qYear(1)` (2024) with no
thread selected, so the opening paint is the full 452-edge genealogy web coloured by
*kind*: a rendered hairball that reads as "everything connects to everything," the opposite
of a directional country-to-country claim. **(2) Thread identity collapses to colour
exactly when it matters** — I selected Critical Materials + Electronic Switching and only
*one* thread label ("Critical Materials") rendered; the head-label loop `break`s on the
first collision and drops the label entirely, and it overprinted the "Keihin / Greater
Tokyo" hub label because thread and hub labels are pruned in two independent passes. A
colour-blind user then has green-vs-blue and nothing else. **(3) The verb the view exists
to demonstrate is never surfaced** — nothing ever names the *country* that holds the lead
or announces when the frontier crosses a border, and there is no non-visual channel at all
(zero `aria-live`, the SVG is an opaque `role="img"`). Fixing those three is worth more
than any amount of projection or shading polish.

## Ranked roadmap

| # | Improvement | Why it matters | Serves argument? | Effort | Impact |
|---|-------------|----------------|:---------------:|:------:|:------:|
| 1 | **Thread identity beyond colour** (guarantee a label per thread + unify pruning + per-slot dash backstop) | Closes the *documented* gap; verified that a whole thread renders label-less today | ✅ direct | S–M | High |
| 2 | **Cold-open on a canonical migration** + one "watch the lead migrate" button | First paint becomes the argument, not the hairball; collapses 3 discovery steps to 0 | ✅ direct | M | High |
| 3 | **Live migration caption** ("lead: Japan → Netherlands · 2017") + recency taper on legs | Names the verb "migrates" as an event; makes net drift readable, not a static web | ✅ direct | M | High |
| 4 | **Non-visual migration channel** (`aria-live` + text route string, in popover too) | The only equivalent path for AT/low-vision; also backstops colour-blind identity | ✅ direct | M | High |
| 5 | **Hop-by-hop stepper** (‹ ›, along the selected thread) + speed toggle | Lets you *read* a hand-off instead of catching it flying past at 11fps | ✅ direct | S | Med-High |
| 6 | **Make the default state argue, not web** (distance/depth fade + desaturate arcs) | Turns the confirmed hairball into "long cross-region hops pop, local noise recedes" | ✅ direct | M | High |
| 7 | **Making-center as a first-class object** (click-a-center dossier + keyboard center list) | Centers are the essay's actual unit; today only whole countries are clickable | ✅ direct | M | Med-High |
| 8 | **Deep-link the moment** (`t=` year, optional `rot=`, gated to gesture-end) | The one thing the globe shows — the lead at an instant — can't be linked today | ✅ direct | M | Med-High |
| 9 | **Follow builds-on / enables as a geographic hop** | The most literal "ideas travel" gesture currently only swaps a panel | ✅ direct | S | Med |
| 10 | **Era ticks on the slider + click-an-era to jump** | Quantile-mapped slider has zero temporal orientation; ties the era rail to the control | ◑ partial | S–M | Med |
| 11 | **Declutter off-thread dots** (drop stroke) **+ depth-sort dots** | Kills the verified white-ring speckle competing with traces; stops hub occlusion | ◑ focus only | S | Med |
| 12 | **Rootedness in the country layer** (Make+Manufacture share as glyph/weight) | Encodes the "stays put" half of the thesis, which has *no* encoding today | ✅ but risky | M | Med |

## Top items in depth

### 1. Thread identity beyond colour — lead with this

This is the known gap and I reproduced its failure: two threads selected, only
"Critical Materials" got a label; "Electronic Switching" rendered in blue with no text
anywhere, and the one label that did render overprinted the "Keihin / Greater Tokyo" hub
label. Four small changes in `render()`, all inside the existing loops — no new per-frame
node binding:

1. **Don't abort on collision (`map.js` L207–223).** The head-label loop scans newest→oldest
   but on the first collision does `break`, so it never tries an older card. Change the
   *collision* `break` (L219) to `continue`, so it walks back along the thread until a
   member lands a non-colliding on-globe anchor. Keep the post-placement `break` (L222) —
   still one label per thread. Preferring newest keeps the "newest = current lead" reading;
   we only fall back when forced.
2. **Unify the two collision passes.** Thread labels use `_tlab` (L175); hub labels use
   `_lab` (L244). They never test against each other — hence the overprint. Share one
   `placed[]` array: emit thread head-labels *first* into it (the palette caps at 5, so at
   most 5), then run the hub loop (L245–257) against the *same* array so a colliding hub
   label is simply dropped. Thread labels win the slot — correct when a trace is the focus.
3. **Colour-independent path backstop.** `threadSlot` already maps thread→slot 0–4. Add a
   per-slot `stroke-dasharray` on the path stroke (L197), e.g.
   `["", "5 3", "1 3", "7 3 1 3", "2 2"][slot]`, kept subtle. Now identity survives even
   when colour is ambiguous *and* the label is rotated off-globe.
4. **Corner-legend fallback.** Track whether a selected thread placed *any* on-globe label
   this frame; if not, show a tiny fixed swatch+name chip in a corner (a static DOM node
   outside the SVG, rebuilt only when `selThreads` changes — never per frame). Identity is
   then never colour-only, even for neutral (slot >5) threads.

Effort S–M, no dependency, no measurable frame cost. This is the highest-value change on
the list.

### 2. Cold-open on a canonical migration (+ one button)

The boot block (`map.js` L1158–1161) lands every first-timer on the hairball; the payoff
requires three non-obvious steps (open picker → pick thread → find play). Gate a curated
opening strictly on empty hash:

- After the `getState()` read, if there is **no** `card`/`thread`/`hist` param, call
  `setThreads(["Chip Lithography"])` (the essay's Britain→US→Japan→Netherlands→Taiwan
  spine; Critical Materials is the alternate), set `T` to that thread's earliest card year
  (`min` year over its members), reset rotation to frame the relevant centers, and add the
  `.on`/a pulse to `#play` **without starting the timer**. Auto-playing on load is jarring;
  pre-trace + emphasize the play button instead.
- Any incoming `#thread`/`#card`/`#hist` deep-link is respected untouched — `getThreads()`
  at L48 and the C1 read at L1164 already run first; we only default when they're empty.
- Clearing the thread returns to the (improved, item 6) all-dots genealogy view, so nothing
  is lost — it just isn't the cold open.

Add **one** button to `.bar` (`map.html` L46–51), "watch the lead migrate", that calls
`setThreads([canonical])`, sets `T` to the first year, and starts the existing play handler
— the whole argument in one click, for returning users who cleared the thread. Ship the
cold-open *and* this button as the single first-gesture pattern; do **not** also ship the
coach-mark overlay (they compete). Effort M.

### 3. Live migration caption + recency taper

Surface the verb. With a thread selected, `mem` (the chronological member list) is already
computed each frame at L178. Reuse it:

- Take the first selected thread's newest **visible** member, read `card.country`, and
  write a fixed caption near `#play`: `lead: Netherlands · 2017`. Hold the previous
  frame's country in a closure; when it changes, briefly show a transition string
  `Japan → Netherlands`. Honor the existing `prefers-reduced-motion` check (L858) for the
  emphasis animation; place it clear of the era rail on the ≤760px stacked layout
  (`map.html` L34). Multi-thread: use the first selected, or hide when >1. Pure text off
  data already in memory — no per-node cost, no change to the delegated-listener model.
- In the same path loop (L181–205), **taper leg opacity** by recency (`i/(mem.length-1)`
  with a floor ~0.35 so deep history doesn't vanish) so each path carries an inherent
  direction of travel, and during play **halo** the single newest card at `T` (a second
  ring in the innerHTML string — not a re-bound node) so the eye tracks a moving marker.

Effort M. This is the visible twin of item 4 and should share the "who leads now" logic.

### 4. Non-visual migration channel

The honest a11y ceiling: verified zero `aria-live` anywhere, and the SVG is an opaque
`role="img"`. A screen-reader user pressing play — the one control the page is built around
— hears nothing.

- Add a visually-hidden `<div class="sr-only" aria-live="polite" aria-atomic="true">` (add
  a `.sr-only` rule to the style block, `map.html` L8–40).
- **Route string, built only when `selThreads` changes** (not per frame): reuse the `mem`
  sort, map each card to its anchored CENTER via `anchorOf` (L320) or its `place`, collapse
  consecutive duplicates (`Silicon Valley ×3`), producing e.g.
  `Electronic Switching: Manchester 1837 → … → Hsinchu 2011`. Write it to the live region
  *and* expose it as visible text under each selected row in the thread popover (`paint()`,
  L1055) — the same ordered migration the arc encodes, for sighted-low-vision and
  colour-blind users too.
- **During play, announce coarsely**: only when `T` crosses an `ERAS` boundary (the bands
  already exist), e.g. `Entering the Information Age, 1991; lead now in Silicon Valley` —
  never per frame. Debounce the slider `oninput` (L836) so a fast drag doesn't flood the
  queue. Define "lead" defensibly as the newest card's anchored center so narration doesn't
  overclaim.

This also subsumes the weaker "mirror `#hint` into an `aria-describedby`" idea — don't ship
both or focus reads twice. Effort M.

### 6. Make the default (no-thread) state argue, not web

Even with the cold-open, clearing a thread returns here, so it must read as the essay's
"ideas travel" claim rather than decoration. The genealogy loop (L153–168) draws every
`enables` edge, all bowed the same direction, coloured by *kind*. Re-weight it with pure
per-arc arithmetic in the existing loop — no new nodes, cheaper is fine:

- **Distance fade:** multiply the current `0.1 + 0.3*tfrac(b.year)` opacity by a great-circle
  distance factor so long cross-region migrations pop and short/local links recede.
- **Depth dim:** scale opacity by the arc midpoint's `cosc` so back-of-limb arcs don't pile
  onto front ones.
- **Desaturate to one quiet warm neutral** (kind already lives on the dots, so it's
  recoverable) so the web stops competing with the country shading in four colours.

Stronger, still-cheap extension: **drop within-country edges** (an idea that stayed put is
not migration) and give the survivors a small arrowhead (reuse the thread-path arrowhead
math at L198–204), with a **hard cap** on drawn arcs to protect the drag-frame budget. This
is where the "ideas travel" half of the thesis actually becomes legible at rest. Effort M;
needs a visual pass at a few rotations so the weighting doesn't erase the web entirely.

## Nice-to-have / gold-plating

- **One-sentence thread stories** (curated `thread → sentence` map surfaced in the caption
  slot, e.g. "Chip Lithography: invented in US/UK labs, industrialised in Japan, now made
  only by ASML and TSMC"). Genuinely good, but ~15 accurate sentences is a content burden
  and belongs after items 3–4 land the structural caption; keep to 1–2 lines.
- **Full center-to-center arc bundling** (aggregate the 452 edges into ~30–40 weighted
  hub-to-hub flows). The most ambitious version of item 6 and the boldest thesis rendering,
  but *large*, and risks turning the calm default into a flow-map showpiece and silently
  dropping long-tail cards no center claims. Do the cheap re-weighting first; consider
  bundling only if that proves insufficient.
- **Continuous rAF play with a crawling migration front** (partial-arc de Casteljau split,
  static/dynamic layer split). Beautiful, and the right long-term shape, but *large* with
  real regression surface — the layer split complicates hit-testing and touches the drag
  path that is currently correct and fast. Stage it behind the cheaper stepper (item 5);
  don't take it on as a single change.
- **Radial ocean gradient + crisper limb.** One `<radialGradient>` in a `<defs>`, costs
  nothing per frame. Honestly decoration that doesn't advance the argument; fine to add if
  it stays subtle enough not to muddy the recency-opacity read on faint old dots.

## Leave it alone

- **First-visit thesis coach-mark overlay.** Redundant once the cold-open (item 2) or the
  demo button carries the argument on first paint; onboarding overlays are easily resented.
  Ship it *only* if neither of those ships.
- **`aria-describedby` mirroring `#hint`.** Subsumed by the `aria-live` region (item 4);
  shipping both makes focus announce the state twice.
- **Speed toggle on its own.** Low-impact gold-plating; only worth it bundled with the
  stepper (item 5).
- **Clip country polygons to the horizon (great-circle limb walk).** Genuinely fiddly
  geometry (winding order, multiple crossings, holes) for a chord artifact only visible at
  deep zoom near the limb — high risk of introducing worse artifacts than it fixes. Lowest
  priority; only if deep-zoom cartographic polish ever becomes a goal.
