# Tooling Cards — Atlas

Interactive views of the Tooling-Leadership card deck. **Runs fully offline** from local files (no CDN/network). Open `index.html`.

> **The framing.** Every tool does one of four jobs, and they fall in order.
> **Measure** — seeing what's there (microscope, X-ray, reading DNA).
> **Model** — a way to think about it (an equation or rule that predicts without touching the real thing).
> **Make** — building one working copy (a single transistor, engine, molecule).
> **Manufacture** — building a billion, cheap and identical, on a factory floor.
> *See it, understand it, build one, build a million.* And because ideas are free to copy, the lead that lasts almost always sits at the far end — in the making at scale, where the skill is in the doing and can't be written down.

## Views (all cross-linked by the top-right nav; "?" button shows the framing on any page)
- **Globe** (`map.html`) — rotatable orthographic globe (own projection, no deps). Drag to spin, scroll to zoom, density-based year scrubber, find-a-tool + thread filter. Colour = the four Ms, opacity = recency, countries shaded by tool count. **Click a country** for its stats + a per-country innovation timeline (cumulative line vs. the world). A right **chip sidebar** lists innovations as they appear over time, grouped by era (collapsible).
- **Timeline** (`views/atlas.html`) — swimlanes by thread / geography (US grouped with sub-regions) / four Ms, on a time axis. Historical-era bands + single-year event markers, alternating lane shading, pinned lane-label column. Overview→chip→medium→full cards, zoom/pan.
- **Tree** (`views/tree.html`) — branching genealogy (builds-on → enables), data-driven lanes, same era/event overlays + pinned labels.
- **Deck** (`views/deck.html`) — flip cards (front = moment, back = aftermath + Obsidian link).
- **Table** (`table.html`) — sortable, searchable database; filter by kind / thread / goal / mechanism.
- **Dashboard** (`dashboard.html`) — counts by kind, decade histogram, thread sizes, and the **era × kind gap matrix** (red = nothing written yet → what to make next).

Click any card/row/dot/country → a **detail panel** with significance, threads, clickable builds-on/enables (walk the genealogy), and **"Open note in Obsidian ↗"**. Kind/thread/goal/mechanism/search persist in the URL hash and carry between views (bookmarkable).

## Data
- `data/cards.js` — `window.CARDS`: id, name, kind, year, place, lat/lon, person, sig, goal, mechanism, threads, builds-on/enables, country. (Loaded via `<script src>`, so `file://` works.)
- `data/countries.js` — `window.COUNTRIES`: basemap rings + name + per-country tool count.
- `data/ne/` — bundled Natural Earth low-res shapefile.
- `shared.js` — nav, detail panel, Obsidian links, help overlay, URL state (shared by all views).

## Regenerate after editing cards in the vault
```
pip install pyshp            # one-time
python3 regenerate.py        # rewrites data/cards.js + data/countries.js from the vault
```
Vault path defaults to `/Users/Vassilis/Documents/Obsidian Vault`; override with `VAULT=/path python3 regenerate.py`.

## Architecture
The **vault is the single source of truth** for card content; this repo is the presentation layer. `regenerate.py` is the only bridge (vault → `data/*.js`). Each view is a small self-contained file reading `window.CARDS`; `shared.js` holds everything common. No build step, no server, no network.
