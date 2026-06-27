# Tooling Cards — Atlas

Interactive views of the Tooling-Leadership card deck (sourced from the Obsidian vault).
Everything runs offline from local files — **no internet/CDN required**. Just open `index.html`.

## Views
- **Globe** (`map.html`) — orthographic globe (hand-rolled projection, no dependencies). Drag to spin, scroll to zoom. Dots coloured by the four Ms, opacity = recency; countries shaded by tool count; migration arcs; year scrubber.
- **Timeline** (`views/atlas.html`) — swimlanes by thread / geography / four Ms on a time axis, with Cold-War / WWII bands and key-event lines. Overview→medium→full cards, zoom & pan.
- **Tree** (`views/tree.html`) — branching genealogy (builds-on → enables).
- **Deck** (`views/deck.html`) — flip cards (front = moment, back = aftermath).

## Data
- `data/cards.js`  — `window.CARDS`, the card model (id, name, kind, year, place, lat/lon, threads, buildson/enables, significance). Loaded via `<script src>` (no fetch, so file:// works).
- `data/countries.js` — `window.COUNTRIES`, basemap rings + per-country tool counts.
- `data/ne/` — bundled Natural Earth low-res shapefile (basemap source).

## Regenerate after editing cards
```
pip install pyshp        # one-time
python3 regenerate.py    # reads the vault, rewrites data/cards.js + data/countries.js
```
Set a different vault path with `VAULT=/path/to/vault python3 regenerate.py`.

The vault remains the single source of truth; this repo is the presentation layer.
