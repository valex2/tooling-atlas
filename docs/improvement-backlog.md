# Improvement backlog — auto-push loop

Tracks the user greenlit for an autonomous implement-and-push loop: **interaction
polish**, **data quality**, **accessibility & mobile**. Each item is independently
shippable and gated by `npm run check` + `node test/smoke.mjs` (both platforms
re-blessed) + a console-error check before it is pushed. CI must go green before
the next item starts.

Dropped from the auto-push loop: **implement the 24 Relay sidebar blurbs** — the
verified blurb text was never saved, so re-deriving it under auto-push would risk
fabrication. Left for a review-mode pass.

| # | Track | Item | Status |
|---|-------|------|--------|
| 1 | a11y | Globe time-lapse (`setInterval` play) ignores `prefers-reduced-motion` — under reduce, snap to full T instead of animating | **done** |
| 2 | interaction | Cross-view hash-carry audit: `#card=` / `#hist=` / `#mode=` must behave identically across Home/Globe/Tree/Relay/Browse; fix drift | **done** |
| 3 | a11y/mobile | 390px audit of Relay (chart + ledger) and Tree — no horizontal body scroll, legible controls | pending |
| 4 | interaction | Globe wheel/trackpad zoom toward the cursor (deferred follow-up), keeping the fixed-centre projection sane | pending |
| 5 | a11y | Keyboard + focus-visible audit across the two-tier nav and Browse's filter controls | pending |
| 6 | data-quality | Anachronism handling for era-vs-modern place names (Königsberg, Chang'an) + a durable `placeId` per card | pending |

Ordered safest-first. Items may be re-scoped or dropped if the audit shows the
"problem" isn't real — that gets logged here rather than gold-plated.
