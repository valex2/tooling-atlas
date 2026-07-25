# Globe controls — refactor plan (high-level structure)

The globe toolbar accreted controls across seven feature batches (play, "watch the lead
migrate", ‹ › stepper, speed toggle, "lead:" caption, year slider + era ticks, reset view,
find-a-tool + dropdown, histories bar, thread picker, kinds/marks/countries legend, hidden
keyboard centre list). They're crammed into one bar and wired ad hoc across ~1180 lines.
This refactor makes the controls **cohesive and legible** without changing what they do —
and, per the request, **the front end is re-rendered and eyeballed at every back-end step.**

## The structure (grouping)
Reorganize the controls into four functional clusters, each a labelled/spaced group:

1. **Transport (time)** — play · watch-the-lead-migrate · ‹ › stepper · speed · the year
   slider + era ticks · the "lead: … · year" caption. Everything that moves T. Group these
   into one coherent transport bar so the time story reads as one control surface.
2. **Scope (what's shown)** — the histories bar + the thread picker. What subset is traced.
3. **Locate** — find-a-tool (search → fly + dossier).
4. **View** — reset view / zoom. Spatial framing.
5. **Reference** — the kinds/marks/countries legend (demote visually; it's a key, not a control).

## The method — iterative, front-end-visualized (the requirement)
Refactor **one cluster per iteration**, never the whole bar at once, so nothing breaks silently:
1. **Inventory** the cluster's DOM (map.html) + its handlers/state (map.js) before touching it.
2. **Refactor** that cluster's markup + wiring into a cohesive, well-named block — behaviour
   IDENTICAL, just grouped/renamed/de-duplicated. Extract shared helpers where wiring repeats.
3. **VISUALIZE**: rebuild, render the globe (default + the cluster's active states) with
   puppeteer, and LOOK — confirm the cluster reads better and is not visually broken. This is
   the non-negotiable step: every back-end change is checked against a rendered front end.
4. **Functional-verify**: assert every control in the cluster still works (play advances T,
   stepper steps, search flies, histories scope, etc.) and no console errors. Confirm the
   batch A–G globe features are all intact.
5. **Gate + ship**: `npm run check` + `node test/smoke.mjs`; re-bless BOTH platforms on any
   visual change; one commit per cluster; push; green CI before the next cluster.

## Iteration order (safest → most visible)
| Iter | Cluster | Focus | Status |
|------|---------|-------|--------|
| R1 | Back-end audit + seams | Map every control's DOM/handler/state; extract a single `controls` init section; NO visual change (0px) — pure code reorganization, prove it | **done** |
| R2 | Transport | Group play/migrate/stepper/speed/slider/caption into one transport surface; unify their wiring; the time story reads as one control | **done** |
| R3 | Scope + Locate | Tidy the histories bar + thread picker + find-a-tool grouping and spacing | **done** |
| R4 | View + Reference | Reset/zoom grouped; demote the legend to a clean reference key; final toolbar balance pass | pending |

Then (separate, after the refactor lands on a clean structure): implement the **inline "card
as it populates" feature** per docs/globe-inline-cards.md, on the refactored transport cluster.

## Hard rules
Same as every batch: never push red; behaviour-preserving (this is a refactor — no feature
changes, no measurement/label changes); one cluster per commit; re-bless both platforms on
visual change; keep the warm aesthetic; zero-dep/no-build/283-card-performant. Don't disturb
the batch A–G globe features — reorganize their controls, don't change what they do.

## Shipped log
- (iterations append here)
- R1: extracted a sectioned `// ===== CONTROLS =====` seam (Transport / Scope / Locate / View / Reference sub-sections) + a `// ===== BOOT =====` band, with an audit inventory (control→id→handler→state) at the head. PROVEN a pure move+comment reorg: the sorted non-comment code-line multiset is byte-identical before/after (0 code lines added/removed/changed), globe 0px (4 runs), 45/45 functional-sweep assertions pass. Gives R2-R4 one sub-section each to edit.
- R2: grouped the six transport controls into one cohesive `.transport` surface (rounded warm pill: play · watch-the-lead-migrate · ‹ › stepper · speed · year+ticks slider centrepiece · lead caption anchoring the right); utility controls (reset/find/histories/threads) reflow to a clean second row. map.html-only (map.js UNTOUCHED — strongest behaviour proof); 45-control functional sweep + batch A-G all pass; smoke 0px twice after re-bless. Baselines re-blessed both platforms.
- R3: grouped SCOPE (history bar + threads picker, in one subtle `.scope` tray echoing the R2 surface) and LOCATE (find-a-tool) on the second toolbar row; moved the inline dropdown styles into `.anchor`/CSS classes (keeping `display:none` inline where map.js reads it). map.html-only (map.js UNTOUCHED); functional sweep + batch A-G pass; smoke 0px twice. NOTE for R4: a PRE-EXISTING layout bug surfaced — row 2 partly sits under #chips (content offset top:120px), clipping the legend/some pills; R4's balance pass should give the toolbar vertical room. Baselines re-blessed both platforms.
