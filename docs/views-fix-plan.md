# Views roadmap — implementation (Tree / Relay / Browse)

Executing docs/views-improvements.md in sequential batches (each: implement → check + smoke +
console → visual review → bless both platforms on visual change → commit → push → green CI).
Same hard rules as the globe pass. **Relay #1 (honesty number in header) is DROPPED** — it re-adds
the finding pull-quote the user removed earlier.

| Batch | View | Items | Status |
|-------|------|-------|--------|
| H | Tree | Cross-border genealogy edges + toggle (#1); give search teeth: dim non-matches + count + locate (#2); un-clamp the two most-ancient cards (#5) | pending |
| I | Browse | "By country"/leadership panel in Coverage (#1); rebalance grid, lead with era×kind matrix (#2); sortable Country column + country in search (#3); zero-results state (#5) | pending |
| J | Relay | Sticky gutter under horizontal scroll (#2); trace one country across panels via legend (#3); cameo-country label foothold (#4); stop ledger clipping the hold year range (#5) | pending |
| K | polish | Tree lane order by spine (#3) + hover-preview lineage (#4); Browse decade-tail binning (#4) + front-truncation affordance (#6) | pending |

## Shipped log
- (batches append here)
