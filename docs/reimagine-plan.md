# Autonomous reimagine / polish / fix program

Started **2026-07-24 14:09 EEST**, run **≥ 4 hours** (until ~18:10 EEST), one iteration
every ~30 min, **completely autonomously** (auto-push each green change).

## Hard rules for every iteration
1. **Never push red.** Each change must pass `npm run check` + `node test/smoke.mjs`
   (both platforms re-blessed on any visual change) + a puppeteer console-error check,
   and CI must go green before the next iteration.
2. **No fabrication.** Do not author card facts, blurbs, or history claims autonomously.
   Data work is limited to hygiene (place-string normalization, coord/threads/region
   integrity, link resolution). If a card needs a *factual* correction, log it to
   `docs/review-needed.md` for the human — do not invent content.
3. **Reversible & logged.** One focused change per commit; append every shipped change to
   the log below so the human can review or revert.
4. Don't touch the globe CENTERS table, the globe pointer/touch/keyboard block, or the
   reduced-motion play logic except deliberately as a planned item.

## Backlog (prioritized; pick the next unstarted, re-scope if the audit shows no real issue)
| # | Track | Item | Status |
|---|-------|------|--------|
| 4 | interaction | Globe wheel/trackpad zoom toward the cursor (deferred follow-up) | **done** |
| 5 | a11y | Keyboard + focus-visible audit across nav + Browse/Tree/Globe controls | **done** |
| 6 | data | Audit the ~100 new cards' place strings for region mis-tags; normalize (vault) | **done** (clean — no mis-tags; fixed 1 byline: Cymer San Diego) |
| 7 | data | New-card integrity: coords present, threads ∈ HISTORIES, region non-empty, builds-on/enables resolve | **done** (clean — 283/283 coords+threads+region, 0 orphan threads, 0 broken links) |
| 8 | interaction | Globe "find a tool" search → fly the globe to the selected card | **done** |
| 9 | narrative | Home onboarding refresh for the 283-card corpus (counts, four-histories clarity) | **done** (Home already dynamic+clear; fixed 1 stale hardcoded count) |
| 10 | polish | Tree legibility at 283 nodes / deep-history era (105 AD) rendering | **done** (audited clean — lanes stagger to avoid overlap; new cards + era bands render cleanly at 283) |
| 11 | polish | Relay legibility with more turns (ledger/coda) | **done** (audited clean — chart/ledger/coda read well at 283 cards, 273 turns, 26-panel table) |
| 12 | a11y | Colour-contrast (WCAG) + ARIA roles + skip-link pass | **done** |
| 13 | polish | Cross-view typography/spacing/colour consistency pass | **done** (audited clean — identical --ink/--mut/--bg/--line tokens + font stack across all 5 views; nav+palette shared; greys unified in item 12) |
| 14 | perf | Bundle size (2 MB) — safe reductions without a build step | **done** (audited — 4 embedded copies already slimmed of front/back; countries geometry 1x; the 4-copy structure is a check-guarded invariant; no safe reduction without risky rearchitecture) |
| 15 | meta | Per-view meta description / OG / favicon | **done** |
| 16 | polish | Browse filters/search + coverage matrix with the new threads | **done** (audited clean — cards/table/coverage all render at 283 cards/27 threads; new Agriculture+Navigation present; no overflow, no console errors) |

The list may grow: a "completeness critic" pass at the end of each iteration can append
newly-found issues here. When the backlog is genuinely dry before 4h, add polish rounds.

## Shipped log
- (iterations append here: `<commit> — <one-line what changed>`)
- `293fd55` — item 4: globe wheel/trackpad zoom now zooms toward the cursor (reuses focusZoom; zoom-out stays centered)
- `06d01aa` — item 5: a11y keyboard/focus — aria-current on active nav pill, keyboard-removable Browse filter pills, native help-close button (rest already accessible)
- item 6+7: data-hygiene audit — corpus clean (no region mis-tags, 0 orphan threads, 0 broken builds-on/enables links); normalized 1 stray byline (Cymer 'San Diego, USA' -> 'San Diego, California, USA')
- item 8: globe "find a tool" now shows a ranked results dropdown (keyboard-navigable, aria combobox); arrow previews (spin-to), Enter/click flies to the card AND opens its detail panel
- item 9: Home — the top gauge/history-cards/footnote are all data-driven and accurate; the only stale copy was the Browse sub's hardcoded '180 tools' -> reworded to 'The whole corpus' (staleness-proof)
- item 10: Tree legibility audited at 283 nodes across the dense Cold War→AI-Age era — the thread-lane stagger keeps cards non-overlapping and the genealogy lines faint; no fix needed
- item 11: Relay audited clean at 283 cards (chart + 26-panel coda legible; custom per-thread blurbs informative)
- item 12: a11y — sub-AA secondary greys across all views consolidated to #6d6961 (now 4.5:1+), help-close #777, coverage links opacity fix; skip-to-main-content link via shared injection (role=main on each view)
- item 15: meta — destaled index description (dropped removed 'timeline', added 'migration relay'); added the shared 4-colour favicon + theme-color to the four views (they had titles/OG but no tab icon)

## Completeness-critic — worthwhile follow-ups for the human (NOT done autonomously)
- **Globe thread-migration paths carry identity by COLOUR ALONE** (shared.js TPAL comment flags this): unlike the Tree, the globe's selected-thread paths/arrowheads have no text labels, so thread identity there is undecodable for colour-blind users without opening the picker. Labelling the paths (as the Tree does) would close a real a11y gap. Substantive; left for review.
- **Re-run the missing-cards gap analysis on the 283-card corpus** — the vault resync filled most gaps; a fresh pass would show what non-US making is still absent (and whether any thread is now thin).
- **Bundle Home shell** (built in build_standalone.py, separate from index.html) doesn't get the skip-to-content link the iframe'd views got (item 12).
- **Providence, RI** tags "US (other)" while its machine-tool-belt partner Worcester, MA tags "US Northeast" — a taxonomy call (add Rhode Island to the Northeast lane?), not a place-string bug.
- **Real OG preview images** per view (currently text-only OG tags); would need image generation.
- **Globe drag inertia / momentum** — deferred as gold-plating; add if desired.
