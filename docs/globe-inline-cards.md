# Globe inline cards — showing each tool as it populates

**Recommendation, up front.** Adopt a **thread-scoped "hop card" frontier** as the hero (Proposal 4), hardened with the **single corner focus card** from Proposal 3 for the no-thread web state. Concretely: when a thread is selected — the cold-open default, and the whole "watch the lead migrate" flow — render at most **three** compact cards riding the head of `firstMem` (a full *lead card* at the newest crossing member, plus one or two opacity-tapered *trail cards*), emitted into the existing `s` SVG string, collision-pruned against the shared `placed` array, capped hard and never scaling with card count. When **no** thread is selected (the deliberately anonymous genealogy web), show exactly **one** quiet focus card in the lower-left corner naming the global frontier tool, playing-gated, as a key-cached DOM node outside the SVG. This is the combination the brief anticipated — a focus card for the playhead plus thread-scoped hop cards during a trace, under a strict on-map budget — and it is the only structure that makes "each card as it populates" *legible* (hop-by-hop along the trace) while staying honest where the map cannot show 283 at once.

## 1. Problem framing

The globe already plots 283 dated cards as lat/lon dots that appear as `year <= T`, with `render()` re-emitting the entire `svg.innerHTML` string every play/drag/zoom frame (verified: a mid-play frame at T=1960 is 402 SVG nodes, 145 dots, 14 collision-pruned labels). The file's core invariant is *no per-frame re-binding of hundreds of nodes*: overlays like `#tlegend` and `#centerlist` live outside the SVG and are rebuilt only on a cache-key change; the dots/labels ride the one `innerHTML` write. The ask — "show each card in a compact form on the globe as it populates" — collides with this at two points. **Clutter:** a play tick crosses ~4 cards every 90ms (`playV += 14`, `qYear`), so any naive per-card card blizzards, and the modern frontier lands exactly in the densest label region — at default zoom "Veldhoven (ASML)" is *already* crowded out of `placed` by the London/Geneva/Berlin pile, so wide cards there will evict real making-centre labels. **Performance:** the feature must not add a node-rebinding class of work to a per-frame hot path. And it must not duplicate what already exists — the hover `.tip` (compact card, *on hover only*), the `#mcap` toolbar caption ("lead: Netherlands · 2019"), the item-3 newest-card **halo** ring during play, the `#hint` count, and the right-hand `#chips` **side list** (all 283, era-grouped, spatially divorced from the globe). The gap none of those fill: naming the tool that is *entering right now*, on the globe, beside its dot.

## 2. Recommended structure in detail

The structure is keyed on the exact branch `render()` already forks on: `if (!selThreads.length)` (web) vs `else` (thread trace).

### 2a. Thread trace — "hop cards" (the hero)

**What shows.** For the **first** selected thread only (`selThreads[0]`, the same focus thread the caption, halo, era-announce and stepper already privilege), walk `firstMem` — already computed at `ti===0` — from the newest visible member backward and emit up to **N = 3** cards:

- **Lead card** (newest crossing member): two lines — `KGLY[kind]` glyph in `KC[kind]` + `TA.esc(name)` truncated ~22ch, then a muted line `centerOf(hd) · year` (so it reads "Veldhoven (ASML) · 2019", consistent with the route string and hub labels).
- **Trail cards** (prior 1–2 hops): one line — glyph + name + year — opacity-tapered by the arc loop's own `rec = max(.35, i/(len-1))`, so older hops recede toward their bare dot.

Warm panel matching the app: `fill rgba(245,243,239,.94)`, `.5px rgba(0,0,0,.15)` border, radius 6, and a **2px left border in `threadColor(selThreads[0])`** so identity is carried by the same hue as the trace. Anchored **below** its member dot (`ly = P[1] + 8*rsc`) so the existing head-label keeps the slot *above* the dot and the two stack cleanly.

**When it enters/exits.** Cards are a **pure function of T** — the last N visible members with `year <= T`. As play advances and T crosses a member's year, that member becomes the new lead card, the prior lead demotes to a trail card, and the card that falls past index `len-N` reverts to a bare dot. There is **no CSS keyframe** — transience *is* the motion (the card appears when its hop lands and recedes as the next lands), which is what makes it reduced-motion-safe and scrub-cheap.

**How many at once / culling.** Hard cap **3** (thread), independent of how many cards are lit or how many threads are selected (only `selThreads[0]` gets cards). Consecutive co-located members collapse into one `×n` card (reuse the loop's `same` test, `|Δlat|<0.2 && |Δlon|<0.2`) — this kills the worst case of a thread parked in one city. Cards are emitted **after** the thread head-labels and **before** the hub loop, testing and pushing against the same `placed` array, so: head-labels always win their slot, hub/city labels yield to a card, and a colliding trail card is dropped (**newest always wins**). Off-globe/back-hemisphere members are skipped (the `vis()` + `P[2]<0` guards the head-label loop already uses).

**Dense-cluster guard (the real fix).** The European frontier is dense at *default* zoom, not only when zoomed out, so a plain low-`rsc` guard is inverted. Instead: **the lead card always renders** (it is the trace's current location — the identity you most want), and **trail cards are the first thing dropped** under collision. Additionally drop to **N = 1 (lead only)** whenever `placed` collisions force a trail card out *or* `rsc` is low — i.e. shed trail cards under pressure, never the lead. Net effect at the crowded European hop: one lead card ("Veldhoven (ASML) · 2019") wins the slot that a hub label was already losing anyway; no net label loss.

### 2b. No-thread web — single corner focus card

The web is deliberately the "everything connects" counter-state; per-dot cards there would be the hairball the code already fights, and there is no single geographic frontier to anchor to. So show **exactly one** card, `#nowcard`, pinned bottom-left (sibling of `#hint` in `#wrap`), naming the **global newest** card with `year <= T` (max-year, tie-break id). It is a **DOM node outside the SVG**, rewritten only when its card id changes (a closure `_nowId`, exactly the `#mcap`/`#legendKey`/`#stepKey` discipline), so drag/rotate/zoom frames touch no DOM here. It shows **only while `playing`** (matching the item-3 halo's guard) so the settled web renders pixel-identically. Its dot gets the same halo ring, generalising item-3.

**Fast-scrub vs slow-play vs at-rest.**
- **Slow play (thread):** each hand-off lands as a lead card, the prior demotes, the oldest sheds — you read the migration tool-by-tool, reinforced by the halo on the same dot and the `#mcap` country. This is the literal "each card as it populates," made legible.
- **Fast scrub (thread):** cards are a pure function of T, so a multi-hop slider jump just shows the last N at the landing year — no animation to thrash, no stale accumulation, no flicker beyond what the dots already do.
- **At rest (thread):** the lead + up to 2 trail cards render statically off `firstMem`, so the recent trace is named even when paused (the cold-open selects `Chip Lithography`, so cards show on first load).
- **No-thread play:** one corner card ticks the frontier; **at rest** it is empty (`:empty{display:none}`, no layout shift).

**Reduced motion.** Two things. (1) The cards carry **no CSS animation** — they are a T-function, so nothing violates `prefers-reduced-motion`. (2) Under reduce, the play button already *jumps straight to T=max* rather than sweeping (verified in the `#play` handler), so "populating" never animates during play regardless; the cards then simply show the final last-N of the trace, and remain fully live during manual **scrub/step**, which is the reduced-motion user's way through time. The corner card's text-swap reuses the `#mcap` pulse, which is already suppressed under reduce.

## 3. Implementation sketch

Everything lives in `render()` and one small DOM node; no changes to `startTimer`/`step`/`yearSlider`/`play` (they all already funnel through `render()`).

**Thread cards (SVG string, in the `else` branch).**
- Add a helper `hopCard(P, {name, sub, glyph, col, tier, count, op})` returning `rect + glyph <text> + label <text>` (~3 nodes), styled inline like every existing label.
- After the head-label loop and the item-3 halo block, for `ti===0` walk `firstMem` from the end: collect up to N members, skipping `!vis(hd.lon,hd.lat)` / `P[2]<0`; collapse consecutive `same` members into one with a `count`; compute `P = proj(hd.lon, hd.lat)`, `ly = P[1] + 8*rsc`, box width from name length; collision-test/push against `placed` (the existing `placed.some(...)` predicate); append via `hopCard` using `threadColor(selThreads[0])`, `KGLY[kind]`, `KC[kind]`, `centerOf(hd)`, and `rec` for trail opacity. Lead is `tier:0` (full), trail `tier:1` (tapered); shed trail on collision or low `rsc`.
- Reuses only already-computed state: `firstMem`, `placed`, `rec`, `same`, `proj`, `vis`, `threadColor`, `centerOf`, `KC`, `KGLY`, `TA.esc`. No second O(283) scan.

**No-thread corner card (DOM overlay).**
- In `render()`, fold frontier detection into the pass that already builds `#hint`: replace the `CARDS.filter(...through T).length` count-only line (~line 490) with one O(283) loop that yields **both** the count and the max-year card — **net-zero** added scan.
- Add `#nowcard` to `#wrap` in `map.html` with `.nowcard` CSS beside `.hint`/`.mcap` (warm panel, `KC[kind]` left border, `:empty{display:none}`, and a `@media(max-width:760px)` reposition so it clears the stacked `#chips`). Declare `let _nowId = null` beside `_prevLeadCountry`.
- After the count/frontier loop: if `!selThreads.length && playing`, and `frontier.id !== _nowId`, rewrite `#nowcard.innerHTML` (name in `KINK[kind]`, `kind · place · year`), set `borderLeftColor = KC[kind]`, fire the `#mcap`-style pulse unless reduced-motion; else clear it. Generalise the item-3 halo to ring the frontier dot too.

**Why this stays per-frame cheap.** Thread cards are ≤9 SVG nodes concatenated into the one `s` string already shipped by `svg.innerHTML = s` — negligible against 402 nodes. No-thread is a single key-gated DOM write on a node *outside* the SVG; drag/zoom frames pay one id-compare. `pointer-events:none` on every card means zero hit-test cost and the dot underneath stays the tap/hover target.

**How it composes without duplicating.** The hover `.tip` is cursor-following, on-demand, and carries the `.s` significance blurb — the hop cards drop the blurb and pin to the dot, so they never look like a stuck tooltip. `#mcap` names the *country*; the lead card names the *tool + centre* — three registers (halo rings the dot, caption states the country, card names the tool) agreeing on one hand-off. The halo marks the same lead dot the lead card sits on. The `#chips` side list stays the exhaustive 283-index; the cards are the transient on-globe focus, not a second list.

## 4. The four approaches

| # | Approach | Clutter | Perf | Arg-fit | Disc. | Effort⁻¹ | Verdict |
|---|----------|:---:|:---:|:---:|:---:|:---:|---------|
| 1 | Transient headline card in DOM overlay, coalesced one-per-step, ≤2 live | 8 | 9 | 7 | 7 | 6 | strong |
| 2 | Persistent score-ranked "frontier chips", collision-pruned into the render string | 7 | 8 | 8 | 8 | 7 | strong |
| 3 | Single anchored corner focus card (`#nowcard`), one card ever | 9 | 9 | 8 | 7 | 7 | **lead** |
| 4 | Thread-scoped "hop cards" riding the frontier (+ one no-thread card) | 6 | 9 | 9 | 7 | 6 | strong |

**Why the recommendation is 4 hardened by 3, not 3 alone.** Proposal 3 scored highest and cleanest by *dissolving* both constraints — "exactly one card ever" — but the judge's lead verdict names its cost squarely: it **does not satisfy the literal ask**. Quantile play crosses ~4 cards per tick, so a single frontier card surfaces only ~1-in-4 populating cards; you never see "each." Proposal 4 has the highest argument-fit (9) precisely because its hop cards name *each hand-off as it lands* along the trace — the thing the essay is about — and its hard cap of 3 refuses the hairball by construction. Its two dings are both fixable with borrowed discipline: (a) the dense-European-cluster clutter (its clutter score of 6) is fixed by shedding *trail* cards first and always keeping the lead — which is the crowded cluster's own current location anyway; (b) the structural wart the judge caught — the no-thread frontier card can't be built in the `if(!selThreads.length)` branch because the max-year dot isn't known until *after* the dots loop, and an SVG-string card there fights z-order — is fixed by taking that one card from Proposal 3 as a **corner DOM overlay** instead, which is cleaner, key-gated, and sidesteps z-order entirely. The result keeps Proposal 4's argument-fit and Proposal 3's clutter/perf discipline. Proposals 1 and 2 lose on the ask itself: #1's `T !== _cardBaseT` gate can't tell dense *play* from a *scrub* (both mutate T) so the densest, most climactic modern instants would silently spawn nothing (`BURST` misfires), and its coalescing needs hand-tuning against the 90ms cadence; #2's chips are the *widest* text objects dropped into the *already-crowded* `placed` array, so collision-pruning makes them nearly vanish exactly in the modern era they most want to narrate, and its significance term is near-inert in this data (`en` averages 1.6; only 1 of 283 has `en>=8`), gutting its ranking story.

## 5. What NOT to do (the clutter traps)

- **Do not draw one card per crossing.** ~4 cards/90ms with any multi-hundred-ms life stacks dozens of nodes over the modern field. Cap and cull *before* emitting, never after.
- **Do not scale card count with lit dots.** The cap must be a constant (3 / 1), independent of the 283 and of how many threads are selected. Only `selThreads[0]` gets cards.
- **Do not let cards outrank labels in `placed`.** Emit them *after* head-labels, *before* hubs; a card may evict a hub label (acceptable — usually the trace's own location) but must never overprint a thread head-label or another card.
- **Do not shed the lead under pressure.** In the dense cluster, drop *trail* cards, keep the lead. A low-zoom-only guard is inverted — the pressure is at default zoom too.
- **Do not use CSS entrance animations.** `innerHTML` is rebuilt every frame, so keyframes restart every frame (flicker) and violate reduced-motion. Make cards a pure function of T; transience is the motion.
- **Do not put per-frame card state in the SVG string for the no-thread card.** Use the key-gated DOM overlay (`_nowId`) so rotate/zoom frames pay one integer compare, matching `#tlegend`/`#mcap`.
- **Do not re-show the hover blurb or re-list the side index.** Drop `.s` significance (that's the `.tip`'s job) and never render toward "a list on the globe" (that's `#chips`). The cards are the *entering* tool, nothing more.
- **Do not claim "each card" for the web state.** Be honest: the anonymous genealogy web shows one frontier card; "each card" is delivered where it can be legible — along the selected trace.

---

## Shipped
Implemented as recommended: thread-scoped hop cards (≤3 riding firstMem's head — a full lead card at the newest crossing member + 1-2 opacity-tapered trail cards, emitted into the SVG string, collision-pruned against `placed`; dense-guard keeps the lead and sheds trail under collision/low-rsc) + a single corner `#nowcard` DOM overlay naming the global newest card, shown only while playing (no-thread web), data-keyed on id (never per-frame). render() stays ~4.3ms; deterministic (SELFCHECK stable); reduced-motion safe. Cold-open shows the frontier hop card on first load.
