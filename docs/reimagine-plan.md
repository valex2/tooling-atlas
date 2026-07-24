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
| 4 | interaction | Globe wheel/trackpad zoom toward the cursor (deferred follow-up) | pending |
| 5 | a11y | Keyboard + focus-visible audit across nav + Browse/Tree/Globe controls | pending |
| 6 | data | Audit the ~100 new cards' place strings for region mis-tags; normalize (vault) | pending |
| 7 | data | New-card integrity: coords present, threads ∈ HISTORIES, region non-empty, builds-on/enables resolve | pending |
| 8 | interaction | Globe "find a tool" search → fly the globe to the selected card | pending |
| 9 | narrative | Home onboarding refresh for the 283-card corpus (counts, four-histories clarity) | pending |
| 10 | polish | Tree legibility at 283 nodes / deep-history era (105 AD) rendering | pending |
| 11 | polish | Relay legibility with more turns (ledger/coda) | pending |
| 12 | a11y | Colour-contrast (WCAG) + ARIA roles + skip-link pass | pending |
| 13 | polish | Cross-view typography/spacing/colour consistency pass | pending |
| 14 | perf | Bundle size (2 MB) — safe reductions without a build step | pending |
| 15 | meta | Per-view meta description / OG / favicon | pending |
| 16 | polish | Browse filters/search + coverage matrix with the new threads | pending |

The list may grow: a "completeness critic" pass at the end of each iteration can append
newly-found issues here. When the backlog is genuinely dry before 4h, add polish rounds.

## Shipped log
- (iterations append here: `<commit> — <one-line what changed>`)
