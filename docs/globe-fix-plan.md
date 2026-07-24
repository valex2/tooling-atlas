# Globe roadmap — implementation (all 12 items)

Executing `docs/globe-improvements.md` in sequential batches (all touch map.js render/
interaction, so no parallelism). Each batch: implement → check + smoke + console → bless
both platforms on visual change → commit → push → green CI. Same hard rules as the reimagine
loop (never push red, no fabrication, reversible commits).

| Batch | Items | Focus | Status |
|-------|-------|-------|--------|
| A | 1 | Thread identity beyond colour (fix label-drop bug, unify collision passes, per-slot dash, corner-legend fallback) | **done** |
| B | 6, 11 | Default state argues: depth/distance fade + desaturate genealogy arcs; drop off-thread dot strokes; depth-sort dots | **done** |
| C | 3, 4 | Live migration caption ("lead: Japan → Netherlands · 2017") + aria-live non-visual channel | pending |
| D | 2, 5 | Cold-open on a canonical migration (Chip Lithography spine) + "watch the lead migrate" button + hop stepper + speed toggle | pending |
| E | 7, 9 | Making-center as first-class object (click-a-center dossier + keyboard list); follow builds-on/enables as a geographic hop | pending |
| F | 8, 10 | Deep-link the moment (t=/rot=, gesture-gated); era ticks on the slider + click-an-era | pending |
| G | 12 | Rootedness in the country layer (Make+Manufacture share as glyph/weight) — risky, careful, last | pending |

Design defaults chosen (per roadmap, no user round-trip): cold-open thread = **Chip
Lithography** (Britain→US→Japan→Netherlands→Taiwan spine); dash patterns per slot; caption
names the lead country + border-crossings.

## Shipped log
- (batches append here)
- Batch A (item 1): fixed the label-drop bug (break→continue; 24/72→0/72 unlabeled frames), unified thread+hub collision passes (no more overprint), per-slot stroke-dasharray backstop, and an off-SVG corner legend for threads whose label rotates off-globe. Default 0px.
- Batch B (items 6+11): re-weighted the default genealogy web — distance fade + depth dim + recency, desaturated to one warm neutral, dropped co-located edges, small arrowheads, hard cap 120 arcs (was ~400); decluttered dots (no ring on off-thread dots, depth-sorted). render() ~3.7ms. The hairball now reads as a directional web; cross-region corridors pop.
