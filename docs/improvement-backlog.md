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
| 3 | a11y/mobile | 390px audit of Relay (chart + ledger) and Tree — no horizontal body scroll, legible controls | **done** (audited clean — no body h-overflow anywhere; SVGs scroll in-container) |
| 4 | interaction | Globe wheel/trackpad zoom toward the cursor | **done** (reimagine loop, 293fd55) |
| 5 | a11y | Keyboard + focus-visible audit across nav + Browse controls | **done** (reimagine loop, 0e6010a) |
| 6 | data-quality | Anachronism handling (Königsberg/Chang'an) + durable placeId | **open (optional)** — current place strings work; cosmetic |

Ordered safest-first. Items may be re-scoped or dropped if the audit shows the
"problem" isn't real — that gets logged here rather than gold-plated.

> NOTE (2026-07): this early backlog is SUPERSEDED. Items 1-5 shipped (tracked in docs/reimagine-plan.md and the globe/views fix plans). Only item 6 (anachronism/placeId) remains, and it's optional cosmetic data-quality — the current strings tag correctly. Kept for historical record.
