(function () {
  const KC = window.KCOL,
    KINK = window.KINK,
    KGLY = window.KGLY; // single source of truth (shared.js)
  // legend glyphs: kind is never carried by colour alone (matches atlas.html / table.js)
  document.querySelectorAll(".legend .gly").forEach(e => (e.textContent = KGLY[e.dataset.k] || ""));
  const D2R = Math.PI / 180;
  // Linear recency ramp for opacity (not an x-axis): TA.timeScale in "linear" mode.
  const tfrac = TA.timeScale({ minY: 1600, maxY: 2025, mode: "linear" }).frac;
  const byId = TA.byId(CARDS);
  const YS = CARDS.map(c => c.year)
    .filter(y => y)
    .sort((a, b) => a - b);
  function qYear(frac) {
    const i = Math.min(YS.length - 1, Math.max(0, Math.round(frac * (YS.length - 1))));
    return YS[i];
  }
  const maxc = Math.max(1, ...COUNTRIES.map(o => o.c));
  // item 12 (rootedness): the globe's other half of the thesis — "the hardest making STAYS PUT".
  // Count-shading (the alpha ramp below) says only WHERE the tools are; it can't say which places
  // concentrate the hard, physical making (Make + Manufacture) versus the movable Measure/Model
  // work. So compute, ONCE, each country's making-SHARE = (Make+Manufacture)/total of its cards,
  // and precompute it PER COUNTRIES-entry (parallel to COUNTRIES, indexed by ci) so the render
  // loop is a pure lookup + arithmetic — no per-frame scan. The join is by the card `country`
  // string to the COUNTRIES `n` name; all 24 card-countries match a COUNTRIES.n exactly (verified),
  // so no name-normalisation is needed. Countries with no cards get share 0 (they stay neutral).
  const HARD_KINDS = new Set(["Make", "Manufacture"]);
  const _mkAgg = {};
  for (const c of CARDS) {
    const k = c.country;
    if (!k) continue;
    const a = _mkAgg[k] || (_mkAgg[k] = { tot: 0, hard: 0 });
    a.tot++;
    if (HARD_KINDS.has(c.kind)) a.hard++;
  }
  // share in [0,1] for each COUNTRIES entry, 0 where the country has no cards / no match.
  const ctyShare = COUNTRIES.map(o => {
    const a = _mkAgg[o.n];
    return a && a.tot ? a.hard / a.tot : 0;
  });
  // Encoding = a SUBTLE hue nudge of the SAME single fill: blend the warm-NEUTRAL grey toward the
  // "Make" earth-tone (KCOL.Make #b06a1e) by MAKE_BLEND × share, keeping the count-driven ALPHA
  // untouched. Toward Make means +red, −green, −blue ⇒ a high-making country reads slightly
  // warmer/earthier; a low-making one stays neutral-grey. No new SVG node, no new layer — it can't
  // clutter the arcs/dots/labels. MAKE_BLEND is the max blend at 100% making; kept low on purpose
  // (a quiet, honest signal, not a second colour axis) — see the visual-pass note in the commit.
  const NEUT_RGB = [150, 140, 120];
  const MAKE_RGB = [176, 106, 30];
  const MAKE_BLEND = 0.35;
  // centroid of data for initial view
  let cLon = 0,
    cLat = 0;
  (function () {
    let x = 0,
      y = 0,
      z = 0,
      n = 0;
    for (const c of CARDS) {
      if (c.lat == null) continue;
      const la = c.lat * D2R,
        lo = c.lon * D2R;
      x += Math.cos(la) * Math.cos(lo);
      y += Math.cos(la) * Math.sin(lo);
      z += Math.sin(la);
      n++;
    }
    cLon = Math.atan2(y, x) / D2R;
    cLat = Math.atan2(z, Math.hypot(x, y)) / D2R;
  })();
  let rotLon = cLon,
    rotLat = Math.min(55, cLat + 6),
    scale = 0,
    T = 0,
    playing = false,
    timer = null,
    foundId = null;
  let selThreads = [];
  try {
    selThreads = getThreads();
  } catch (e) {}
  // item 2: the canonical cold-open migration — the essay's Chip Lithography spine (its members
  // run through China/Korea/Germany's printing lineage, then US → Japan → Netherlands → Taiwan).
  // Shared by the empty-hash cold-open (end of file) and the "watch the lead migrate" button.
  // COLD_LON/COLD_LAT frame the relevant making-centres instead of the default Atlantic centroid,
  // which would put Japan and Taiwan on the far side of the globe.
  const COLD_THREAD = "Chip Lithography";
  const COLD_LON = 40,
    COLD_LAT = 30;
  // History filter (the essay's spine): single-select scope on #hist=, read from
  // window.HISTORIES via the shared helpers. Independent of the multi-select thread
  // trace — it scopes the thread popover to that history's threads and dims off-history
  // dots, never touching the migration/genealogy geometry. repaintThreads is the popover
  // rebuild hook, set once the picker IIFE has defined its paint().
  let curHist = "";
  try {
    curHist = getHistory();
  } catch (e) {}
  let repaintThreads = null;
  // Was a local 8-colour palette assigned by rank and cycled with %. It failed
  // hard: orange vs green measured deltaE 0.3 under protanopia (identical for
  // ~8% of men), the two reds 9.5 for normal vision, and the brown read as grey.
  // Worse, `Math.max(0, indexOf(t))` gave every UNSELECTED thread slot 0, so it
  // rendered in the same red as the first selected one. Now shares the validated
  // palette in shared.js, so a thread keeps one colour across every view.
  const threadSlot = new Map();
  // Past the five validated slots a thread stays selected but renders neutral —
  // honest ("selected, not colour-coded") rather than reusing a hue that already
  // means another thread.
  const threadColor = t => window.threadColor(threadSlot, t) || "#9b968c";
  const svg = document.getElementById("g"),
    tip = document.getElementById("tip"),
    wrap = document.getElementById("wrap");
  // Corner-legend cache key: the set of selected threads that placed NO on-globe head-label
  // this frame (with their colours). The legend chip strip is a static DOM node OUTSIDE the
  // SVG, rebuilt ONLY when this key changes — never per drag/play frame. null = never built.
  let _legendKey = null;
  // item 5: cached enabled/disabled state of the ‹ › stepper, flipped only when a thread is
  // (de)selected so a drag/play frame never touches those button nodes.
  let _stepKey = null;
  // Item 3/4 state, closure-held across frames so render() stays a cheap textContent write:
  //   _prevLeadCountry — last frame's lead country, so a change (play/scrub crossing a border)
  //                      can surface a brief "Japan → Netherlands" transition string.
  //   _capTimer        — settles the transition string back to the steady caption.
  //   _prevEra         — the ERAS band T last sat in, so aria-live speaks only on a crossing.
  //   _eraTimer / _pendingEraMsg — debounce so a fast slider drag across several eras announces
  //                      only the last one (a play step lands its crossings seconds apart).
  //   _routeKey        — selThreads signature; the route string is rebuilt ONLY when it changes.
  let _prevLeadCountry = null,
    _capTimer = null,
    _prevEra = null,
    _eraTimer = null,
    _pendingEraMsg = null,
    _routeKey = null;
  // item 8 (deep-link the moment): the hash carries the instant the globe shows — #t=<year> and
  // #rot=<lon,lat> — but it is written ONLY on gesture-END, never per render frame. render() runs
  // on every drag/scrub/play frame; writing history.replaceState there would thrash the URL. So
  // render() only (re)arms a 400ms debounce via scheduleHashWrite(); the single setState fires once
  // the drag/scrub/play settles. _ready gates it so the initial hydrate/cold-open renders (which are
  // not gestures) never write — the first WRITE is the user's first real move.
  let _hashTimer = null,
    _ready = false;
  let W = 0,
    H = 0,
    cx = 0,
    cy = 0;
  function size() {
    const r = svg.getBoundingClientRect();
    W = r.width;
    H = r.height;
    cx = W / 2;
    cy = H / 2;
    if (!scale) scale = Math.min(W, H) * 0.46;
  }
  function proj(lon, lat) {
    const l = (lon - rotLon) * D2R,
      p = lat * D2R,
      p0 = rotLat * D2R;
    const cosc = Math.sin(p0) * Math.sin(p) + Math.cos(p0) * Math.cos(p) * Math.cos(l);
    const x = scale * Math.cos(p) * Math.sin(l);
    const y = scale * (Math.cos(p0) * Math.sin(p) - Math.sin(p0) * Math.cos(p) * Math.cos(l));
    return [cx + x, cy - y, cosc];
  }
  function vis(lon, lat) {
    const l = (lon - rotLon) * D2R,
      p = lat * D2R,
      p0 = rotLat * D2R;
    return Math.sin(p0) * Math.sin(p) + Math.cos(p0) * Math.cos(p) * Math.cos(l) >= 0;
  }
  function ringPath(ring) {
    let pts = [];
    for (let i = 0; i < ring.length; i++) {
      const p = proj(ring[i][0], ring[i][1]);
      if (p[2] >= 0) pts.push(p[0].toFixed(1) + " " + p[1].toFixed(1));
    }
    return pts.length < 3 ? null : "M" + pts.join("L") + "Z";
  }
  function gline(co) {
    let d = "",
      pen = false;
    for (const c of co) {
      const p = proj(c[0], c[1]);
      if (p[2] >= 0) {
        d += (pen ? "L" : "M") + p[0].toFixed(1) + " " + p[1].toFixed(1);
        pen = true;
      } else pen = false;
    }
    return d;
  }
  function render() {
    size();
    // Idempotent and O(selected): reconcile here so every entry point that can
    // mutate selThreads is covered without each one having to remember.
    window.threadSlots(threadSlot, selThreads);
    let s = "";
    s += `<circle cx="${cx}" cy="${cy}" r="${scale}" fill="#dbe5ee" stroke="rgba(0,0,0,.22)" stroke-width="1.2"/>`;
    // graticule
    let g = "";
    for (let lon = -180; lon < 180; lon += 30) {
      const co = [];
      for (let lat = -90; lat <= 90; lat += 4) co.push([lon, lat]);
      g += `<path d="${gline(co)}" fill="none" stroke="rgba(0,0,0,.06)" stroke-width=".6"/>`;
    }
    for (let lat = -60; lat <= 60; lat += 30) {
      const co = [];
      for (let lon = -180; lon <= 180; lon += 4) co.push([lon, lat]);
      g += `<path d="${gline(co)}" fill="none" stroke="rgba(0,0,0,.06)" stroke-width=".6"/>`;
    }
    s += g;
    // countries
    COUNTRIES.forEach((o, ci) => {
      // Count still drives ALPHA (the 0.12→0.72 ramp). Making-SHARE nudges the HUE of the same
      // fill toward the Make earth-tone (item 12) — a busy-but-movable country stays warm-neutral
      // grey; a busy-and-hard-making one reads a touch earthier. Empty countries stay #e7e3db.
      let fill;
      if (o.c > 0) {
        const alpha = (0.12 + (0.6 * o.c) / maxc).toFixed(3);
        const f = MAKE_BLEND * ctyShare[ci]; // 0 (neutral) … MAKE_BLEND (fully hard-making)
        const r = Math.round(NEUT_RGB[0] + (MAKE_RGB[0] - NEUT_RGB[0]) * f);
        const g = Math.round(NEUT_RGB[1] + (MAKE_RGB[1] - NEUT_RGB[1]) * f);
        const b = Math.round(NEUT_RGB[2] + (MAKE_RGB[2] - NEUT_RGB[2]) * f);
        fill = `rgba(${r},${g},${b},${alpha})`;
      } else fill = "#e7e3db";
      for (const ring of o.r) {
        const d = ringPath(ring);
        if (d)
          s += `<path class="cty" data-ci="${ci}" d="${d}" fill="${fill}" stroke="rgba(0,0,0,.14)" stroke-width=".4"/>`;
      }
    });
    const rsc = Math.max(0.6, Math.min(3, scale / (Math.min(W, H) * 0.46)));
    // ONE shared placed-labels array for BOTH thread head-labels and hub/city labels, so the
    // two passes test against each other. Thread labels are emitted FIRST (palette caps at 5
    // slots ⇒ ≤5 of them), then hubs run against the SAME array — a hub label that collides
    // with a thread label is dropped, so a trace (the focus) never gets overprinted.
    const placed = [];
    // Selected threads that landed an on-globe head-label THIS frame. selThreads minus this
    // is the "identity is missing from the map" set that the corner legend backstops.
    const labeled = new Set();
    // First selected thread's chronological members (year ≤ T), captured in the loop below and
    // reused after it for the caption, the newest-card halo, and the coarse era announcement —
    // all pure reads off data already computed for the path, no extra per-node cost.
    let firstMem = null;
    if (!selThreads.length) {
      // Genealogy web (builds-on -> enables), default no-thread state. Was one kind-coloured,
      // equally-weighted arc per edge — a hairball reading "everything connects to everything,"
      // the opposite of the essay's directional-migration claim. Re-weighted here with pure
      // per-arc arithmetic so LONG cross-region hops pop and short/local noise recedes:
      //   distance fade  — great-circle angle 0..π mapped to a 0.15..1 factor (long links win)
      //   depth dim      — midpoint facing (mean endpoint cosc, ≥0 on the front hemisphere)
      //   recency        — the original tfrac(year) ramp, floored so deep history stays faint
      // Drawn in ONE quiet warm neutral (kind still lives on the DOTS, so it stays recoverable)
      // so the web no longer competes with the country shading. Co-located edges (an idea that
      // stayed put is not migration) are dropped by an angular threshold, and the survivors are
      // sorted by weight and HARD-CAPPED so the drag frame never pays for all 452 at once.
      const ARC = "#9b8f7e"; // muted warm brown-grey, deliberately outside KCOL
      const ARC_CAP = 120;
      const arcs = [];
      for (const c of CARDS) {
        if (c.lat == null) continue;
        for (const en of c.en || []) {
          const b = byId[en];
          if (!b || b.lat == null || b.year > T) continue;
          // great-circle angular distance between the two endpoints (radians, 0..π)
          const la = c.lat * D2R,
            lb = b.lat * D2R;
          const dot =
            Math.sin(la) * Math.sin(lb) +
            Math.cos(la) * Math.cos(lb) * Math.cos((c.lon - b.lon) * D2R);
          const ang = Math.acos(Math.max(-1, Math.min(1, dot)));
          // stayed-put / co-located: not a migration, drop it (~2.3°, subsumes the old
          // 0.2° coord skip). Distance fade below then further recedes the merely-short.
          if (ang < 0.04) continue;
          if (!vis(c.lon, c.lat) || !vis(b.lon, b.lat)) continue;
          const A = proj(c.lon, c.lat),
            B = proj(b.lon, b.lat);
          const depth = (A[2] + B[2]) / 2; // both endpoints front-visible ⇒ ≥0
          if (depth <= 0) continue;
          const distf = 0.15 + 0.85 * (ang / Math.PI);
          const rf = 0.4 + 0.6 * tfrac(b.year);
          const op = 0.6 * distf * depth * rf;
          arcs.push({ A, B, op });
        }
      }
      arcs.sort((x, y) => y.op - x.op);
      const nArc = Math.min(ARC_CAP, arcs.length);
      for (let i = 0; i < nArc; i++) {
        const { A, B, op } = arcs[i];
        const ostr = op.toFixed(2);
        const mx = (A[0] + B[0]) / 2,
          my = (A[1] + B[1]) / 2 - Math.hypot(B[0] - A[0], B[1] - A[1]) * 0.18;
        s += `<path d="M${A[0].toFixed(1)} ${A[1].toFixed(1)} Q${mx.toFixed(1)} ${my.toFixed(1)} ${B[0].toFixed(1)} ${B[1].toFixed(1)}" fill="none" stroke="${ARC}" stroke-opacity="${ostr}" stroke-width="1"/>`;
        // small arrowhead at B (the enabled/newer end) so the web reads as directional,
        // reusing the thread-path arrowhead math against the arc's incoming tangent.
        const tx = B[0] - mx,
          ty = B[1] - my,
          tl = Math.hypot(tx, ty) || 1,
          ux = tx / tl,
          uy = ty / tl,
          ah = 4 * rsc;
        s += `<path d="M${B[0].toFixed(1)} ${B[1].toFixed(1)} L${(B[0] - ux * ah - uy * ah * 0.5).toFixed(1)} ${(B[1] - uy * ah + ux * ah * 0.5).toFixed(1)} L${(B[0] - ux * ah + uy * ah * 0.5).toFixed(1)} ${(B[1] - uy * ah - ux * ah * 0.5).toFixed(1)} Z" fill="${ARC}" fill-opacity="${ostr}"/>`;
      }
    } else {
      // thread migration paths: each selected thread's cards joined in chronological order
      // B3: paths carried identity by COLOUR ALONE. Give each path a text head-label
      // (matching how the Timeline labels its traces) so a thread is legible even when
      // its colour is ambiguous or neutral. Collision-pruned so many selected threads
      // do not clutter — a label that would overlap an already-placed one is dropped.
      selThreads.forEach((t, ti) => {
        const col = threadColor(t);
        // Per-slot dash backstop: identity survives even when colour is ambiguous (protanopia)
        // or the head-label is off-globe. threadSlot.get(t) is undefined past slot 5 (neutral
        // thread) — the index guard leaves those undashed rather than crashing.
        const dash = ["", "5 3", "1 3", "7 3 1 3", "2 2"][threadSlot.get(t)] || "";
        const da = dash ? ` stroke-dasharray="${dash}"` : "";
        const mem = CARDS.filter(c => c.threads.includes(t) && c.lat != null && c.year <= T).sort(
          (a, b) => a.year - b.year || a.id.localeCompare(b.id),
        );
        if (ti === 0) firstMem = mem;
        for (let i = 0; i < mem.length - 1; i++) {
          const a = mem[i],
            b = mem[i + 1];
          // Recency taper: leg i joins mem[i]→mem[i+1], so i=0 is the OLDEST leg. Fade opacity
          // by i/(mem.length-1) with a 0.35 floor (deep history stays visible), giving every
          // path an inherent direction of travel — newest hops brightest.
          const rec = mem.length > 1 ? Math.max(0.35, i / (mem.length - 1)) : 1;
          if (!vis(a.lon, a.lat) || !vis(b.lon, b.lat)) continue;
          const A = proj(a.lon, a.lat),
            B = proj(b.lon, b.lat);
          const same = Math.abs(a.lat - b.lat) < 0.2 && Math.abs(a.lon - b.lon) < 0.2;
          if (same) {
            const rr = 5 * rsc;
            s += `<circle cx="${A[0].toFixed(1)}" cy="${(A[1] - rr).toFixed(1)}" r="${rr.toFixed(1)}" fill="none" stroke="${col}" stroke-opacity="${(0.55 * rec).toFixed(2)}" stroke-width="1.4"/>`;
            continue;
          }
          const dx = B[0] - A[0],
            dy = B[1] - A[1];
          const mx = (A[0] + B[0]) / 2 - dy * 0.18,
            my = (A[1] + B[1]) / 2 + dx * 0.18;
          s += `<path d="M${A[0].toFixed(1)} ${A[1].toFixed(1)} Q${mx.toFixed(1)} ${my.toFixed(1)} ${B[0].toFixed(1)} ${B[1].toFixed(1)}" fill="none" stroke="${col}" stroke-opacity="${(0.85 * rec).toFixed(2)}" stroke-width="${(2 * Math.min(1.6, rsc)).toFixed(1)}" stroke-linecap="round"${da}/>`;
          const tx = B[0] - mx,
            ty = B[1] - my,
            tl = Math.hypot(tx, ty) || 1,
            ux = tx / tl,
            uy = ty / tl,
            ah = 6 * rsc;
          s += `<path d="M${B[0].toFixed(1)} ${B[1].toFixed(1)} L${(B[0] - ux * ah - uy * ah * 0.55).toFixed(1)} ${(B[1] - uy * ah + ux * ah * 0.55).toFixed(1)} L${(B[0] - ux * ah + uy * ah * 0.55).toFixed(1)} ${(B[1] - uy * ah - ux * ah * 0.55).toFixed(1)} Z" fill="${col}" fill-opacity="${(0.9 * rec).toFixed(2)}"/>`;
        }
        // head-label at the newest visible tool on this thread's path
        for (let i = mem.length - 1; i >= 0; i--) {
          const hd = mem[i];
          if (!vis(hd.lon, hd.lat)) continue;
          const P = proj(hd.lon, hd.lat);
          if (P[2] < 0) continue;
          const fs = 10,
            lx = P[0],
            ly = P[1] - 10 * Math.min(1.4, rsc),
            w = t.length * fs * 0.56 + 6;
          if (
            placed.some(q => Math.abs(q.x - lx) < (q.w + w) / 2 + 2 && Math.abs(q.y - ly) < fs + 3)
          )
            // Was `break` — abandoning the whole thread on the FIRST collision, so a whole
            // trace could render label-less. `continue` walks back newest→older until a
            // member lands a non-colliding, on-globe anchor. Newest = current lead, so we
            // only fall back when forced.
            continue;
          placed.push({ x: lx, y: ly, w });
          labeled.add(t);
          s += `<text x="${lx.toFixed(1)}" y="${ly.toFixed(1)}" text-anchor="middle" font-size="${fs}" font-weight="600" fill="${col}" stroke="#f5f3ef" stroke-width="3" paint-order="stroke" style="pointer-events:none">${TA.esc(t)}</text>`;
          break;
        }
      });
      // Item 3: during play, halo the single newest card at/just-before T on the first thread —
      // an extra ring in the innerHTML string (NOT a re-bound node) so the eye tracks a moving
      // marker. Drawn only while playing, so the settled default states are untouched.
      if (playing && firstMem && firstMem.length) {
        const lead = firstMem[firstMem.length - 1];
        if (vis(lead.lon, lead.lat)) {
          const P = proj(lead.lon, lead.lat);
          if (P[2] >= 0) {
            const hr = (9 * rsc).toFixed(1),
              hc = threadColor(selThreads[0]);
            s += `<circle cx="${P[0].toFixed(1)}" cy="${P[1].toFixed(1)}" r="${hr}" fill="none" stroke="${hc}" stroke-width="1.5" stroke-opacity=".9"/>`;
          }
        }
      }
    }
    // dots — depth-sorted so front-of-globe dots draw over back ones (one sort over ≤283
    // per frame is cheap). Emitted after the arcs, so every dot sits above the web.
    const dots = [];
    for (const c of CARDS) {
      if (c.lat == null) continue;
      const fnd = c.id === foundId;
      if (c.year > T && !fnd) continue;
      const p = proj(c.lon, c.lat);
      if (p[2] < 0) continue;
      dots.push({ c, p, fnd });
    }
    dots.sort((a, b) => a.p[2] - b.p[2]); // back (low facing) first, front last ⇒ hubs on top
    for (const { c, p, fnd } of dots) {
      const r = (3 + Math.min(4, (c.en ? c.en.length : 0) * 0.8)) * rsc * (fnd ? 1.6 : 1);
      const onT = selThreads.length ? selThreads.find(t => c.threads.includes(t)) : null;
      // A scoped history dims any card outside it (spec §5 canvas step); All dims nothing.
      const offH = curHist && window.historyMatch && !window.historyMatch(c, curHist);
      const off = offH || (selThreads.length && !onT);
      const fo = fnd ? 1 : off ? 0.07 : 0.3 + 0.65 * tfrac(c.year);
      // Ring only where it CARRIES meaning: the found/searched dot and on-thread dots. Plain
      // and off-thread dots drop the stroke entirely — the white ring was a speckle field
      // competing with the traces. Kind still reads from the fill; no ring needed to find it.
      const ring = fnd
        ? ` stroke="#111" stroke-width="2.2"`
        : onT
          ? ` stroke="${threadColor(onT)}" stroke-width="2"`
          : "";
      s += `<circle class="dot" data-id="${encodeURIComponent(c.id)}" cx="${p[0].toFixed(1)}" cy="${p[1].toFixed(1)}" r="${r.toFixed(1)}" fill="${KC[c.kind]}" fill-opacity="${fo}"${ring}/>`;
    }
    // region labels (density clusters), sized by card count, collision-pruned (densest placed
    // first). Shares `placed` with the thread head-labels above — those were emitted first, so
    // a hub label overlapping a thread label is dropped (the trace wins its slot).
    for (const h of HUBS) {
      if (!vis(h.lon, h.lat)) continue;
      const p = proj(h.lon, h.lat);
      if (p[2] < 0) continue;
      const fs = 6.5 + Math.min(7, Math.sqrt(h.n) * 1.7),
        ly = p[1] - 9,
        lx = p[0],
        w = h.city.length * fs * 0.56 + 6;
      if (placed.some(q => Math.abs(q.x - lx) < (q.w + w) / 2 + 2 && Math.abs(q.y - ly) < fs + 3))
        continue;
      placed.push({ x: lx, y: ly, w });
      // item 7: a curated making-centre label is a clickable object (opens its dossier via the
      // delegated tap flow) — so it drops the `pointer-events:none` the inert tail-city labels keep,
      // and carries a `.clab` class + its name. Pure attribute/cursor change: the label paints
      // pixel-identically, so the default globe render is unchanged.
      const isCenter = centerNames.has(h.city);
      const pe = isCenter ? "cursor:pointer" : "pointer-events:none";
      const tag = isCenter ? ` class="clab" data-center="${encodeURIComponent(h.city)}"` : "";
      s += `<text${tag} x="${lx.toFixed(1)}" y="${ly.toFixed(1)}" text-anchor="middle" font-size="${fs.toFixed(1)}" font-weight="600" fill="#333" style="paint-order:stroke;stroke:#f5f3ef;stroke-width:2.5px;${pe}">${h.city}</text>`;
    }
    svg.innerHTML = s;
    // Corner-legend fallback: identity is NEVER colour-only. Any selected thread that placed
    // no on-globe head-label this frame (rotated off-globe, or crowded out) gets a fixed
    // swatch+name chip. This is a STATIC DOM node OUTSIDE the SVG — rebuilt ONLY when the
    // no-label set (or a chip's colour) changes, so a drag that keeps the set stable touches
    // no DOM here. render() must stay per-frame cheap; wholesale rebuilding this every frame
    // would defeat that. The colour is folded into the key so a slot reassignment repaints.
    const noLabel = selThreads.filter(t => !labeled.has(t));
    const key = noLabel.map(t => t + "" + threadColor(t)).join("");
    if (key !== _legendKey) {
      _legendKey = key;
      let leg = document.getElementById("tlegend");
      if (!noLabel.length) {
        if (leg) leg.remove();
      } else {
        if (!leg) {
          leg = document.createElement("div");
          leg.id = "tlegend";
          leg.setAttribute("aria-hidden", "false");
          leg.setAttribute(
            "aria-label",
            "Selected threads not labelled on the globe (rotated out of view)",
          );
          leg.style.cssText =
            "position:absolute;left:8px;top:8px;display:flex;flex-direction:column;gap:4px;z-index:20;pointer-events:none;max-width:60%";
          wrap.appendChild(leg);
        }
        leg.innerHTML = noLabel
          .map(t => {
            const col = threadColor(t);
            return `<span style="display:flex;align-items:center;gap:6px;background:rgba(245,243,239,.92);border:.5px solid rgba(0,0,0,.15);border-radius:11px;padding:2px 8px 2px 6px;font-size:11px;font-weight:600;color:#333;box-shadow:0 1px 3px rgba(0,0,0,.12)"><span style="width:10px;height:10px;border-radius:50%;background:${col};flex:0 0 auto;border:.5px solid rgba(0,0,0,.2)"></span>${TA.esc(t)}</span>`;
          })
          .join("");
      }
    }
    // item 5: the ‹ › stepper only acts with a thread selected — reflect that in the buttons.
    // Cached on the selection flip (like the legend above) so a drag/play frame never touches
    // these nodes.
    const stepKey = selThreads.length ? "1" : "0";
    if (stepKey !== _stepKey) {
      _stepKey = stepKey;
      const dis = !selThreads.length;
      ["stepprev", "stepnext"].forEach(id => {
        const b = document.getElementById(id);
        if (b) {
          b.disabled = dis;
          b.setAttribute("aria-disabled", dis ? "true" : "false");
        }
      });
    }
    // dots/countries are handled by one set of delegated listeners on the svg (set up once,
    // below) — no per-frame re-binding of hundreds of nodes while dragging/playing.
    document.getElementById("hint").textContent =
      `${CARDS.filter(c => c.lat != null && c.year <= T).length} of ${CARDS.length} tools through ${T}`;
    // Item 3: live migration caption (single-thread only; hidden for none/multi). Pure text off
    // firstMem — a cheap textContent write, no per-node cost, on a STATIC node updated in place.
    const cap = document.getElementById("mcap");
    if (cap) {
      if (selThreads.length === 1 && firstMem && firstMem.length) {
        const lead = firstMem[firstMem.length - 1];
        const country = lead.country || lead.place || "—";
        const base = `lead: ${country} · ${lead.year}`;
        if (_prevLeadCountry !== null && _prevLeadCountry !== country) {
          // Frontier crossed a border this frame (play/scrub): show the transition briefly,
          // then settle. The colour pulse is MOTION, so it is suppressed under
          // prefers-reduced-motion; the text itself always changes.
          cap.textContent = `${_prevLeadCountry} → ${country}`;
          const reduce =
            window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
          if (reduce) {
            cap.classList.remove("pulse"); // no motion under reduce, and clear any prior pulse
          } else {
            cap.classList.remove("pulse");
            void cap.offsetWidth; // restart the keyframe
            cap.classList.add("pulse");
          }
          clearTimeout(_capTimer);
          _capTimer = setTimeout(() => {
            cap.textContent = base;
            _capTimer = null;
          }, 1500);
        } else if (!_capTimer) {
          cap.textContent = base;
        }
        _prevLeadCountry = country;
      } else {
        // no thread, or >1 selected: empty ⇒ .mcap:empty{display:none}, so no layout shift
        clearTimeout(_capTimer);
        _capTimer = null;
        _prevLeadCountry = null;
        cap.textContent = "";
      }
    }
    // Item 4: coarse era-crossing announcement to the aria-live region. Speaks ONLY when T
    // crosses an ERAS boundary (never per frame), and is debounced so a fast slider drag across
    // several eras announces just the last one — a play step lands its crossings seconds apart.
    if (selThreads.length && firstMem && firstMem.length) {
      let eraName = null;
      for (const e of ERAS)
        if (T >= e[1] && T < e[2]) {
          eraName = e[0];
          break;
        }
      if (_prevEra === null) {
        _prevEra = eraName; // prime silently on first paint — never announce the initial state
      } else if (eraName && eraName !== _prevEra) {
        _prevEra = eraName;
        const lead = firstMem[firstMem.length - 1];
        const a = anchorOf(lead);
        // "lead" defined defensibly as the newest card's anchored center (fall back to place)
        const where = a ? a[0] : lead.place ? lead.place.split(",")[0].trim() : lead.country || "";
        _pendingEraMsg = `Entering the ${eraName}, ${T}; lead now in ${where}`;
        clearTimeout(_eraTimer);
        _eraTimer = setTimeout(() => {
          const live = document.getElementById("mlive");
          if (live) live.textContent = _pendingEraMsg;
          _eraTimer = null;
        }, 400);
      }
    } else {
      _prevEra = null; // no thread: re-prime fresh on the next selection
    }
    // The era rail depends only on T and chipsOpen, never on rotation/zoom — so it is
    // NOT rebuilt here. render() runs on every mousemove while dragging; rebuilding 161
    // rows plus their handlers per frame was the single biggest cost in the drag loop.
    // Callers that actually change T or chipsOpen call renderChips() themselves.
    // item 8: (re)arm the debounced hash write. This is the ONE hook that covers every entry
    // point that mutates T/rotation (drag, scrub, zoom, keyboard, step, play, chip/center picks)
    // — it only clears+sets a timer here (no DOM, no history), so it is cheap per frame; the
    // actual replaceState fires 400ms after the LAST change, i.e. once the gesture settles.
    scheduleHashWrite();
  }
  // item 8: debounced writer for #t/#rot. setState uses history.replaceState (composes with the
  // existing #card/#thread/#hist params, and REPLACES rather than pushes — no history spam). Held
  // to gesture-END by the 400ms debounce: a continuous drag/scrub or a play sweep (frames < 400ms
  // apart) keeps resetting the timer, so exactly one write lands when motion stops.
  function scheduleHashWrite() {
    if (!_ready) return;
    clearTimeout(_hashTimer);
    _hashTimer = setTimeout(() => {
      _hashTimer = null;
      try {
        setState({ t: String(T), rot: rotLon.toFixed(1) + "," + rotLat.toFixed(1) });
      } catch (e) {}
    }, 400);
  }
  // hubs — CURATED CENTERS first, raw-city clusters for the long tail.
  // The old rule named every ~5° coordinate blob after its single densest raw place-string.
  // That inverted the essay's argument: it labeled Silicon Valley "NASA Ames" (one field
  // station in it), buried Bell Labs (the corpus's largest single place) under a "Pharma labs"
  // placeholder whose synthetic coordinate sat on Murray Hill, and fused Veldhoven/ASML — the
  // EUV machine — into a 500 km "London" blob. Now a curated anchor table names the real
  // making-centers the essay argues about; each card is ASSIGNED to the nearest anchor within
  // its radius (degrees), and only cards no center claims fall through to the old density rule,
  // so minor real places still read honestly. See docs/globe-centers-review.md.
  // [name, lat, lon, radiusDeg]
  const CENTERS = [
    ["Silicon Valley", 37.44, -122.14, 0.4],
    ["Bell Labs", 40.68, -74.4, 0.06],
    ["London", 51.51, -0.13, 0.3],
    ["Los Angeles Basin", 34.05, -118.3, 0.7],
    ["Cambridge, England", 52.2, 0.12, 0.25],
    ["Berkeley / East Bay", 37.86, -122.28, 0.13],
    ["Berlin", 52.52, 13.4, 0.4],
    ["Keihin / Greater Tokyo", 35.6, 139.7, 0.55],
    ["Rhine-Neckar", 49.44, 8.56, 0.4],
    ["IBM Hudson Valley", 41.5, -73.83, 0.55],
    ["Cambridge / Greater Boston", 42.37, -71.11, 0.35],
    ["New England machine-tool belt", 42.03, -71.6, 0.35],
    ["Baikonur", 45.96, 63.31, 0.3],
    ["Hsinchu", 24.8, 120.97, 0.2],
    ["Veldhoven (ASML)", 51.42, 5.39, 0.2],
    ["Toronto", 43.65, -79.38, 0.3],
    ["Mainz", 50.0, 8.27, 0.15],
    ["Toyota City", 35.08, 137.16, 0.25],
    ["Beijing", 39.99, 116.3, 0.3],
    ["Deccan / Hyderabad", 17.38, 78.49, 0.3],
    ["Peenemünde", 54.14, 13.79, 0.2],
    // Added with the 283-card vault resync (14 of these 16 non-US), each adversarially
    // verified to catch its own cards without stealing from a neighbour. See
    // docs/globe-centers-review.md for the method.
    ["Paris", 48.85, 2.31, 0.19],
    ["Baghdad (House of Wisdom)", 33.31, 44.36, 0.05],
    ["San Diego / La Jolla", 32.78, -117.2, 0.2],
    ["Zurich", 47.38, 8.54, 0.06],
    ["Osaka (advanced materials)", 34.69, 135.5, 0.15],
    ["Jena", 50.93, 11.59, 0.05],
    ["South Holland (Leiden–Delft–The Hague)", 52.08, 4.4, 0.16],
    ["Manchester", 53.48, -2.24, 0.05],
    ["West Midlands (Coalbrookdale–Black Country)", 52.55, -2.15, 0.36],
    ["New York City", 40.71, -74.01, 0.1],
    ["Geneva", 46.21, 6.11, 0.1],
    ["Venice / Murano", 45.45, 12.345, 0.08],
    ["Pisa", 43.72, 10.4, 0.05],
    ["Glasgow", 55.86, -4.25, 0.05],
    ["Pearl River Delta (Shenzhen–Hong Kong)", 22.43, 114.11, 0.2],
    ["Vancouver (UBC)", 49.27, -123.18, 0.1],
  ];
  const anchorOf = c => {
    let best = null,
      bd = Infinity;
    for (const a of CENTERS) {
      const d = Math.hypot(c.lat - a[1], c.lon - a[2]);
      if (d <= a[3] && d < bd) {
        bd = d;
        best = a;
      }
    }
    return best;
  };
  // item 7: names of the curated centres, so the hub-label loop can tag those labels as
  // clickable (`.clab`) while the raw long-tail city labels stay inert. Built once (not per
  // frame); render() only executes after this runs.
  const centerNames = new Set(CENTERS.map(a => a[0]));
  // Item 4: the ordered migration as TEXT — the non-visual twin of the arc. Each card maps to
  // its anchored CENTER (anchorOf) or falls back to its raw place; consecutive duplicates
  // collapse to "Silicon Valley ×3". Built ONLY when selThreads changes (announceRoutes below
  // and the popover paint()), NEVER per render frame.
  const centerOf = c => {
    const a = anchorOf(c);
    if (a) return a[0];
    return (c.place ? c.place.split(",")[0].trim() : "") || c.country || "somewhere";
  };
  const routeString = t => {
    const mem = CARDS.filter(c => c.threads.includes(t) && c.lat != null).sort(
      (a, b) => a.year - b.year || a.id.localeCompare(b.id),
    );
    const steps = [];
    for (const c of mem) {
      const nm = centerOf(c);
      const last = steps[steps.length - 1];
      if (last && last.name === nm) last.n++;
      else steps.push({ name: nm, year: c.year, n: 1 });
    }
    return steps.map(s => (s.n > 1 ? `${s.name} ×${s.n}` : `${s.name} ${s.year}`)).join(" → ");
  };
  // Write the route(s) to the aria-live region. Self-guards on a selThreads signature so it is a
  // no-op when called for an unrelated repaint (e.g. a history-scope change), announcing only on
  // a genuine thread-selection change.
  function announceRoutes() {
    const key = selThreads.join("|");
    if (key === _routeKey) return;
    _routeKey = key;
    const live = document.getElementById("mlive");
    if (!live) return;
    live.textContent = selThreads.length
      ? selThreads.map(t => `${t}: ${routeString(t)}`).join(". ")
      : "";
  }
  const anchored = new Map();
  const rest = [];
  CARDS.forEach(c => {
    if (c.lat == null) return;
    const a = anchorOf(c);
    if (a) {
      let h = anchored.get(a[0]);
      if (!h) anchored.set(a[0], (h = { n: 0, city: a[0], lat: a[1], lon: a[2] }));
      h.n++;
    } else rest.push(c);
  });
  // long tail: the OLD rule, now applied only to cards no curated center claims —
  // cluster leftovers by ~5° and name each by its densest raw city.
  const hg = {};
  rest.forEach(c => {
    const k = c.lat.toFixed(1) + "," + c.lon.toFixed(1);
    (hg[k] = hg[k] || []).push(c);
  });
  const _pts = Object.values(hg)
    .map(g => ({
      n: g.length,
      city: (g[0].place || "").split(",")[0],
      lat: g[0].lat,
      lon: g[0].lon,
    }))
    .sort((a, b) => b.n - a.n);
  const _CL = [];
  for (const p of _pts) {
    let m = null;
    for (const c of _CL) {
      const dla = c.lat - p.lat,
        dlo = c.lon - p.lon;
      if (dla * dla + dlo * dlo < 25) {
        m = c;
        break;
      }
    }
    if (m) {
      const t = m.n + p.n;
      m.lat = (m.lat * m.n + p.lat * p.n) / t;
      m.lon = (m.lon * m.n + p.lon * p.n) / t;
      m.n = t;
    } else _CL.push({ n: p.n, city: p.city, lat: p.lat, lon: p.lon });
  }
  // Curated centers place FIRST in the collision-pruner (they always win a label), then the
  // biggest tail clusters fill the remaining slots.
  const HUBS = [
    ...[...anchored.values()].sort((a, b) => b.n - a.n),
    ..._CL.sort((a, b) => b.n - a.n),
  ].slice(0, 40);
  const PANELCSS =
    "position:fixed;top:0;right:0;width:330px;max-width:92vw;height:100%;background:#fff;border-left:.5px solid rgba(0,0,0,.15);box-shadow:-8px 0 30px rgba(0,0,0,.12);z-index:2000;overflow:auto;padding:18px 18px 50px;font:13px/1.5 -apple-system,BlinkMacSystemFont,sans-serif;color:#1c1c1c";
  function countryChart(inC) {
    const w = 294,
      h = 112,
      x0 = 6,
      x1 = w - 6,
      y0 = 10,
      yb = h - 15,
      mn = 1600,
      mx = 2030;
    const sx = y => x0 + ((Math.max(mn, Math.min(mx, y)) - mn) / (mx - mn)) * (x1 - x0);
    function cum(cards, norm) {
      if (!cards.length) return "";
      const ys = cards
        .map(c => c.year)
        .filter(Boolean)
        .sort((a, b) => a - b);
      let d = "M" + x0 + " " + yb;
      let n = 0;
      for (const y of ys) {
        n++;
        d +=
          " L" +
          sx(y).toFixed(1) +
          " " +
          yb +
          " L" +
          sx(y).toFixed(1) +
          " " +
          (yb - (n / norm) * (yb - y0)).toFixed(1);
      }
      d += " L" + x1 + " " + (yb - (n / norm) * (yb - y0)).toFixed(1);
      return d;
    }
    const wTot = CARDS.filter(c => c.year).length,
      cTot = inC.length || 1;
    let s = '<svg width="' + w + '" height="' + h + '" style="display:block;margin:10px 0">';
    for (let y = 1700; y <= 2000; y += 100) {
      const x = sx(y);
      s +=
        '<line x1="' +
        x +
        '" y1="' +
        y0 +
        '" x2="' +
        x +
        '" y2="' +
        yb +
        '" stroke="#eee"/><text x="' +
        x +
        '" y="' +
        (h - 3) +
        '" font-size="8" fill="#6d6961" text-anchor="middle">' +
        y +
        "</text>";
    }
    s +=
      '<path d="' +
      cum(
        CARDS.filter(c => c.year),
        wTot,
      ) +
      '" fill="none" stroke="#bbb" stroke-width="1" stroke-dasharray="3 3" opacity=".75"/>';
    s += '<path d="' + cum(inC, cTot) + '" fill="none" stroke="#5a544c" stroke-width="1.5"/>';
    const by = {};
    inC.forEach(c => {
      (by[c.year] = by[c.year] || []).push(c);
    });
    Object.values(by).forEach(g =>
      g
        .sort((a, b) => (a.kind < b.kind ? -1 : 1))
        .forEach((c, i) => {
          const x = sx(c.year),
            yy = yb - 5 - i * 7;
          s +=
            '<circle class="cdot" data-id="' +
            encodeURIComponent(c.id) +
            '" cx="' +
            x.toFixed(1) +
            '" cy="' +
            yy +
            '" r="3.4" fill="' +
            KC[c.kind] +
            '" fill-opacity=".92" stroke="#fff" stroke-width=".6" style="cursor:pointer"><title>' +
            c.name +
            " (" +
            c.year +
            ")</title></circle>";
        }),
    );
    s +=
      '<line x1="' +
      x0 +
      '" y1="' +
      yb +
      '" x2="' +
      x1 +
      '" y2="' +
      yb +
      '" stroke="#ccc"/><text x="' +
      x0 +
      '" y="' +
      (y0 + 2) +
      '" font-size="7.5" fill="#6d6961">cumulative — dashed = world shape</text></svg>';
    return s;
  }
  // item 9 (and the dossier rows of item 7): fly the globe to a card — rotate to its lon/lat,
  // zoom in if we are far out, and mark it as the found dot. This is the SAME rotate/zoom the
  // find-a-tool pick and the #card deep-link use, factored out so a link-follow and a dossier
  // row can both perform the geographic hop.
  function flyTo(c) {
    if (!c || c.lat == null) return;
    foundId = c.id;
    rotLon = c.lon;
    rotLat = Math.max(-80, Math.min(80, c.lat));
    if (scale < 320) scale = 420;
    render();
  }
  // item 7: making-CENTRE dossier. Built on the showCountry panel pattern — a right-hand panel
  // listing every card the centre ANCHORS (anchorOf(c) === this centre, the same assignment the
  // labels use), sorted by year. Title = centre name; subtitle = count + era span. Each row opens
  // the card's detail AND flies the globe to it (reusing flyTo above).
  function showCenter(name) {
    const center = CENTERS.find(a => a[0] === name);
    if (!center) return;
    const inC = CARDS.filter(c => c.lat != null && anchorOf(c) === center).sort(
      (a, b) => a.year - b.year || a.id.localeCompare(b.id),
    );
    let p = document.getElementById("appdetail");
    if (!p) {
      p = document.createElement("div");
      p.id = "appdetail";
      p.style.cssText = PANELCSS;
      document.body.appendChild(p);
    }
    const bk = {};
    inC.forEach(c => (bk[c.kind] = (bk[c.kind] || 0) + 1));
    const bars = window.KINDS.filter(k => bk[k])
      .map(
        k =>
          '<span style="display:inline-block;background:' +
          KC[k] +
          "1f;color:" +
          KINK[k] +
          ';border-radius:8px;padding:1px 7px;margin:2px 3px 0 0;font-size:11px">' +
          k +
          " " +
          bk[k] +
          "</span>",
      )
      .join("");
    const yrs = inC.map(c => c.year).filter(Boolean);
    const span = yrs.length
      ? yrs[0] === yrs[yrs.length - 1]
        ? "" + yrs[0]
        : yrs[0] + "–" + yrs[yrs.length - 1]
      : "";
    const list =
      inC
        .map(
          c =>
            '<div class="ctool" data-id="' +
            encodeURIComponent(c.id) +
            '" style="cursor:pointer;padding:3px 0;border-bottom:.5px solid #eee;font-size:12px"><span style="color:' +
            KC[c.kind] +
            '">●</span> ' +
            c.name +
            ' <span style="color:#6d6961">' +
            c.year +
            "</span></div>",
        )
        .join("") || "<div style='color:#6d6961'>No tools anchored here.</div>";
    p.innerHTML =
      '<div style="display:flex;justify-content:space-between"><div style="font-size:16px;font-weight:600">' +
      TA.esc(name) +
      '</div><button id="appdx" aria-label="Close panel" style="cursor:pointer;color:#777;font-size:18px;line-height:1;background:none;border:0;padding:2px 4px">✕</button></div><div style="color:#6f6f6f;font-size:12px;margin:2px 0 8px">making-centre · ' +
      inC.length +
      " tool" +
      (inC.length != 1 ? "s" : "") +
      (span ? " · " + span : "") +
      "</div>" +
      bars +
      '<div style="margin-top:10px">' +
      list +
      "</div>";
    p.style.display = "block";
    document.getElementById("appdx").onclick = () => (p.style.display = "none");
    p.querySelectorAll(".ctool").forEach(el => {
      const c = byId[decodeURIComponent(el.dataset.id)];
      el.onclick = () => {
        flyTo(c);
        try {
          showDetail(c);
        } catch (e) {}
      };
      kbd(el, () => el.onclick(), c ? "Open " + c.name + " (" + c.year + ")" : null);
    });
  }
  function showCountry(ci) {
    const o = COUNTRIES[ci];
    if (!o) return;
    const name = o.n || "(area)";
    const inC = CARDS.filter(c => c.country === name).sort((a, b) => a.year - b.year);
    let p = document.getElementById("appdetail");
    if (!p) {
      p = document.createElement("div");
      p.id = "appdetail";
      p.style.cssText = PANELCSS;
      document.body.appendChild(p);
    }
    const bk = {};
    inC.forEach(c => (bk[c.kind] = (bk[c.kind] || 0) + 1));
    const bars = window.KINDS.filter(k => bk[k])
      .map(
        k =>
          '<span style="display:inline-block;background:' +
          KC[k] +
          "1f;color:" +
          KINK[k] +
          ';border-radius:8px;padding:1px 7px;margin:2px 3px 0 0;font-size:11px">' +
          k +
          " " +
          bk[k] +
          "</span>",
      )
      .join("");
    const list =
      inC
        .map(
          c =>
            '<div class="ctool" data-id="' +
            encodeURIComponent(c.id) +
            '" style="cursor:pointer;padding:3px 0;border-bottom:.5px solid #eee;font-size:12px"><span style="color:' +
            KC[c.kind] +
            '">●</span> ' +
            c.name +
            ' <span style="color:#6d6961">' +
            c.year +
            "</span></div>",
        )
        .join("") || "<div style='color:#6d6961'>No tools recorded here.</div>";
    p.innerHTML =
      '<div style="display:flex;justify-content:space-between"><div style="font-size:16px;font-weight:600">' +
      name +
      '</div><button id="appdx" aria-label="Close panel" style="cursor:pointer;color:#777;font-size:18px;line-height:1;background:none;border:0;padding:2px 4px">✕</button></div><div style="color:#6f6f6f;font-size:12px;margin:2px 0 8px">' +
      inC.length +
      " tool" +
      (inC.length != 1 ? "s" : "") +
      "</div>" +
      bars +
      countryChart(inC) +
      '<div style="margin-top:6px">' +
      list +
      "</div>";
    p.style.display = "block";
    document.getElementById("appdx").onclick = () => (p.style.display = "none");
    p.querySelectorAll(".ctool,.cdot").forEach(el => {
      const c = byId[decodeURIComponent(el.dataset.id)];
      el.onclick = () => {
        try {
          showDetail(c);
        } catch (e) {}
      };
      kbd(el, () => el.onclick(), c ? "Open " + c.name + " (" + c.year + ")" : null);
    });
  }
  function renderChips() {
    const el = document.getElementById("chips");
    if (!el) return;
    const list = CARDS.filter(c => c.year <= T);
    let html =
      '<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:6px"><div style="font-size:10.5px;text-transform:uppercase;letter-spacing:.05em;color:#6d6961">Tools through ' +
      T +
      " (" +
      list.length +
      ')</div><span id="chipstog" style="cursor:pointer;color:#6d6961;font-size:13px">' +
      (chipsOpen ? "▾" : "▸") +
      "</span></div>";
    if (chipsOpen) {
      for (let i = ERAS.length - 1; i >= 0; i--) {
        const nm = ERAS[i][0],
          a = ERAS[i][1],
          b = ERAS[i][2];
        const grp = list.filter(c => c.year >= a && c.year < b).sort((x, y) => y.year - x.year);
        if (!grp.length) continue;
        html +=
          '<div style="font-size:9.5px;font-weight:600;color:#6d6961;margin:9px 0 2px;border-bottom:.5px solid #eee">' +
          nm +
          "</div>" +
          grp
            .map(
              c =>
                '<div class="chip2" data-id="' +
                encodeURIComponent(c.id) +
                '" style="cursor:pointer;display:flex;gap:6px;align-items:baseline;padding:2px 4px;border-radius:6px"><span style="color:#6d6961;font-size:10px;min-width:30px">' +
                c.year +
                '</span><span style="color:' +
                KC[c.kind] +
                ';font-size:7px">●</span><span style="font-size:11.5px">' +
                c.name +
                "</span></div>",
            )
            .join("");
      }
    }
    el.innerHTML = html;
    const tg = document.getElementById("chipstog");
    if (tg) {
      tg.onclick = () => {
        chipsOpen = !chipsOpen;
        renderChips();
      };
      kbd(tg, () => tg.onclick(), "Toggle the tools list");
    }
    el.querySelectorAll(".chip2").forEach(d => {
      d.onmouseenter = () => (d.style.background = "#efece6");
      d.onmouseleave = () => (d.style.background = "");
      d.onclick = () => {
        const c = byId[decodeURIComponent(d.dataset.id)];
        if (!c) return;
        foundId = c.id;
        rotLon = c.lon;
        rotLat = Math.max(-80, Math.min(80, c.lat));
        render();
        try {
          showDetail(c);
        } catch (e) {}
      };
      const _c = byId[decodeURIComponent(d.dataset.id)];
      kbd(d, () => d.onclick(), _c && _c.name);
    });
  }
  const showTip = TA.tooltip(tip, byId);
  // interaction — Pointer Events unify mouse, touch and pen (the old model was mouse-only,
  // so a phone/tablet could neither rotate nor zoom the globe). A single pointer that starts
  // off a dot rotates; two pointers pinch-zoom; a pointer that never travels past TAP_SLOP
  // stays a tap and opens the dot/country under it. Touch pointers are captured to the svg so
  // a drag that leaves the element still delivers moves — the same reason the old mouse loop
  // listened on window. render() runs per move exactly as before, so the delegated-listener
  // performance model (no per-frame re-binding of hundreds of nodes) is untouched.
  let lx,
    ly,
    sx,
    sy,
    moved = false,
    chipsOpen = true;
  const pointers = new Map(); // active pointerId -> {x,y}
  let dragId = null; // the pointer currently rotating, or null
  let pinch = null; // {dist, scale} while two pointers are down
  let lastTap = 0,
    lastTapX = 0,
    lastTapY = 0;
  const TAP_SLOP = 6; // px a tap may drift before it becomes a drag (touch fingers jitter)
  const clampScale = s => Math.max(80, Math.min(6000, s));
  const ERAS = window.ERAS;
  // Zoom in toward a screen point by inverse-projecting it to lon/lat, recentring the globe
  // there, then scaling up. On this fixed-centre orthographic projection there is no pan
  // offset, so "zoom toward" a point means pulling it to the centre.
  function focusZoom(sx, sy, factor) {
    const xp = (sx - cx) / scale,
      yp = (cy - sy) / scale,
      rho = Math.hypot(xp, yp);
    if (rho > 1e-6 && rho <= 1) {
      const cc = Math.asin(Math.min(1, rho)),
        p0 = rotLat * D2R;
      rotLat = Math.max(
        -90,
        Math.min(
          90,
          Math.asin(Math.cos(cc) * Math.sin(p0) + (yp * Math.sin(cc) * Math.cos(p0)) / rho) / D2R,
        ),
      );
      rotLon =
        rotLon +
        Math.atan2(
          xp * Math.sin(cc),
          rho * Math.cos(cc) * Math.cos(p0) - yp * Math.sin(cc) * Math.sin(p0),
        ) /
          D2R;
    }
    scale = clampScale(scale * factor);
    render();
  }
  // A clean tap (no drag) opens the dot/country under the point. Pointer capture redirects
  // pointer events' target to the svg, so hit-test the live DOM at the release point instead.
  function openAt(clientX, clientY) {
    const el = document.elementFromPoint(clientX, clientY);
    if (!el || !el.closest) return;
    const d = el.closest(".dot");
    if (d) {
      try {
        showDetail(byId[decodeURIComponent(d.dataset.id)]);
      } catch (e) {}
      return;
    }
    // item 7: a curated centre label opens its dossier (checked before the country beneath it).
    const cl = el.closest(".clab");
    if (cl) {
      try {
        showCenter(decodeURIComponent(cl.dataset.center));
      } catch (e) {}
      return;
    }
    const ct = el.closest(".cty");
    if (ct) showCountry(+ct.dataset.ci);
  }
  svg.addEventListener("pointerdown", e => {
    pointers.set(e.pointerId, { x: e.clientX, y: e.clientY });
    try {
      svg.setPointerCapture(e.pointerId);
    } catch (err) {}
    if (pointers.size === 2) {
      // second finger: switch from rotate to pinch-zoom
      const p = [...pointers.values()];
      pinch = { dist: Math.hypot(p[0].x - p[1].x, p[0].y - p[1].y) || 1, scale };
      dragId = null;
      moved = true; // a two-finger gesture is never a tap
      svg.classList.remove("drag");
    } else if (pointers.size === 1) {
      moved = false;
      lx = sx = e.clientX;
      ly = sy = e.clientY;
      // Starting on a dot must not rotate — it is a tap to open (mirrors the old
      // mousedown early-return on .dot).
      dragId = e.target.classList && e.target.classList.contains("dot") ? null : e.pointerId;
      if (dragId != null) svg.classList.add("drag");
      // Focusing the region on grab makes the keyboard controls immediately available.
      try {
        svg.focus({ preventScroll: true });
      } catch (err) {}
    }
    e.preventDefault();
  });
  svg.addEventListener("pointermove", e => {
    const pt = pointers.get(e.pointerId);
    if (!pt) return;
    pt.x = e.clientX;
    pt.y = e.clientY;
    if (pinch && pointers.size >= 2) {
      const p = [...pointers.values()];
      const d = Math.hypot(p[0].x - p[1].x, p[0].y - p[1].y) || 1;
      scale = clampScale(pinch.scale * (d / pinch.dist));
      render();
      return;
    }
    // Measure tap-vs-drag travel from the START of the gesture (lx/ly move every frame for
    // the rotation delta, so measuring against them keeps every step under slop forever).
    // Tracked even when this pointer does not rotate (it began on a dot), so a real drag that
    // starts on a dot is still not mistaken for a tap.
    if (
      pointers.size === 1 &&
      !moved &&
      Math.abs(e.clientX - sx) + Math.abs(e.clientY - sy) > TAP_SLOP
    )
      moved = true;
    if (e.pointerId !== dragId) return;
    const k = 0.25 * (300 / scale);
    rotLon -= (e.clientX - lx) * k;
    rotLat = Math.max(-90, Math.min(90, rotLat + (e.clientY - ly) * k));
    lx = e.clientX;
    ly = e.clientY;
    render();
  });
  function endPointer(e) {
    const had = pointers.has(e.pointerId);
    pointers.delete(e.pointerId);
    if (pointers.size < 2) pinch = null;
    if (e.pointerId === dragId) {
      dragId = null;
      svg.classList.remove("drag");
    }
    if (!had || moved || pointers.size !== 0) return; // only a clean, final tap opens/zooms
    openAt(e.clientX, e.clientY);
    // Double-tap / double-click to zoom in toward the point. Detected here rather than via
    // the dblclick event, which is unreliable on touch under touch-action:none.
    const now = Date.now();
    if (
      now - lastTap < 300 &&
      Math.abs(e.clientX - lastTapX) + Math.abs(e.clientY - lastTapY) < 24
    ) {
      const r = svg.getBoundingClientRect();
      focusZoom(e.clientX - r.left, e.clientY - r.top, 1.6);
      lastTap = 0;
    } else {
      lastTap = now;
      lastTapX = e.clientX;
      lastTapY = e.clientY;
    }
  }
  svg.addEventListener("pointerup", endPointer);
  svg.addEventListener("pointercancel", endPointer);
  svg.addEventListener(
    "wheel",
    e => {
      e.preventDefault();
      if (e.deltaY < 0) {
        // Zoom IN toward the cursor, reusing the double-tap focus math: focusZoom pulls
        // the point under the cursor toward centre, then scales up. It only recentres
        // when the cursor is over the disc (rho<=1) and otherwise just scales about
        // centre, so a wheel off the globe still zooms without error.
        const r = svg.getBoundingClientRect();
        focusZoom(e.clientX - r.left, e.clientY - r.top, 1.15);
      } else {
        // Zoom OUT stays centred — a plain shrink about the middle. Recentring on the way
        // out too made the globe spin toward the cursor while shrinking, which reads as
        // jarring; a calm centred step-back is what you want when pulling back out.
        scale = clampScale(scale * 0.87);
        render();
      }
    },
    { passive: false },
  );
  // Keyboard access to the globe (focusable via tabindex in the markup): arrows spin, +/-
  // zoom, Home resets. Step is scale-aware so a zoomed-in globe nudges finely.
  svg.addEventListener("keydown", e => {
    const step = Math.max(1.5, Math.min(15, 8 * (300 / scale)));
    let hit = true;
    switch (e.key) {
      case "ArrowLeft":
        rotLon -= step;
        break;
      case "ArrowRight":
        rotLon += step;
        break;
      case "ArrowUp":
        rotLat = Math.min(90, rotLat + step);
        break;
      case "ArrowDown":
        rotLat = Math.max(-90, rotLat - step);
        break;
      case "+":
      case "=":
        scale = clampScale(scale * 1.15);
        break;
      case "-":
      case "_":
        scale = clampScale(scale * 0.87);
        break;
      case "Home":
        rotLon = cLon;
        rotLat = Math.min(55, cLat + 6);
        scale = Math.min(W, H) * 0.46;
        break;
      default:
        hit = false;
    }
    if (hit) {
      e.preventDefault();
      render();
    }
  });
  // ===================================================================================
  // CONTROLS — INVENTORY (R1 audit). Each control -> DOM id(s) -> handler(s) -> state it
  // reads (R) / writes (W). Module-level closures the handlers share live above this seam
  // (rotLon/rotLat/scale, T, playing/timer, selThreads, curHist, foundId, threadSlot,
  // repaintThreads, _ready, W/H, and the helpers render()/renderChips()/flyTo()/stop() ...).
  //
  // TRANSPORT (playback + time)
  //   #yr + #ylab   yr.oninput                 W:T,ylab; stop(),clearInvite(),render,renderChips
  //   #play         .onclick                   R/W:playing,timer,playV; W:T,yr.value,ylab; startTimer/stop
  //   #speed        speedBtn.onclick           R/W:playSpeed; re-arms startTimer while playing
  //   #stepprev/#stepnext .onclick->step(dir)  R:selThreads,T,threadYears; W:T,yr.value,ylab (disabled set in render via _stepKey)
  //   #migrate      migrateBtn.onclick         W:selThreads,T,yr.value,ylab; setThreads,repaintThreads,then #play.click
  //   #eratk        buildEraTicks + .etk.onclick  R:YS,ERAS,yearSlider; W:T,yr.value,ylab; stop(),clearInvite()
  //   helpers: clearInvite(), yearSlider(), stop(), startTimer(), threadYears(), step()
  // SCOPE (filter the corpus)
  //   #threadbtn/#threadpanel  IIFE paint()    R/W:selThreads,threadSlot; W:repaintThreads; setThreads,announceRoutes,render
  //   #histbar      historyBar(onPick)         W:curHist; repaintThreads(),render
  // LOCATE (find / fly to a place)
  //   #msearch/#mresults  IIFE (input/keydown/doc-click)  W:foundId,rotLon,rotLat,scale; render,showDetail
  //   .xnav         document click             R:byId; flyTo()  (builds-on/enables geographic hop)
  //   #centerlist   buildCenterList + .clbtn.onclick  R:CENTERS,anchored; showCenter()->flyTo+panel
  // VIEW (rotate / zoom / reset)
  //   #reset        .onclick                   W:rotLon,rotLat,scale; render
  //   window resize -> render ; svg mousemove/mouseleave -> tooltip (showTip)
  //   NB: the pointer/touch/wheel/keyboard rotate-zoom handlers + focusZoom()/openAt() stay
  //       ABOVE this seam (large, already contiguous, adjacent) — deliberately NOT moved (see foot).
  // REFERENCE (read-only readouts) — no discrete listener; driven inside render()/announceRoutes():
  //   #mcap live migration caption · #mlive aria-live route/era announcements · #hint count
  // BOOT / hydrate / cold-open run LAST, in their exact original order (see the BOOT band below).
  // ===================================================================================
  // ===== CONTROLS =====
  // ----- Transport -----
  const yr = document.getElementById("yr"),
    ylab = document.getElementById("ylab");
  // The cold-open (item 2) pulses #play to invite a replay; ANY playback engagement fulfils
  // that invitation, so drop the emphasis the moment the user drives the timeline themselves.
  function clearInvite() {
    const b = document.getElementById("play");
    if (b) b.classList.remove("invite");
  }
  // Slider value (0..1000) whose qYear() lands on (or nearest to) a given year — the inverse of
  // qYear, used by the stepper and the "watch the lead migrate" button to move the range control
  // in lockstep with T.
  function yearSlider(y) {
    let i = YS.indexOf(y);
    if (i < 0) {
      let bd = Infinity;
      for (let k = 0; k < YS.length; k++) {
        const d = Math.abs(YS[k] - y);
        if (d < bd) {
          bd = d;
          i = k;
        }
      }
    }
    return Math.round((i / (YS.length - 1)) * 1000);
  }
  yr.oninput = e => {
    stop();
    clearInvite();
    T = qYear(+e.target.value / 1000);
    ylab.textContent = T;
    render();
    renderChips();
  };
  function stop() {
    playing = false;
    clearInterval(timer);
    const b = document.getElementById("play");
    b.textContent = "▶ play";
    b.classList.remove("on");
  }
  // item 5: speed toggle. The play sweep is a setInterval; the toggle multiplies its RATE by
  // adjusting the interval (the step size is unchanged, so the same frames are shown, faster).
  // playV is the current slider position, held in closure so a mid-play speed change can restart
  // the interval WITHOUT losing where the sweep is.
  let playSpeed = 1,
    playV = 0;
  function startTimer() {
    clearInterval(timer);
    timer = setInterval(
      () => {
        playV += 14;
        if (playV >= 1000) {
          playV = 1000;
          T = qYear(1);
          yr.value = 1000;
          ylab.textContent = T;
          render();
          renderChips();
          stop();
          return;
        }
        T = qYear(playV / 1000);
        yr.value = playV;
        ylab.textContent = T;
        render();
        renderChips();
      },
      Math.max(16, Math.round(90 / playSpeed)),
    );
  }
  document.getElementById("play").onclick = function () {
    if (playing) {
      stop();
      return;
    }
    clearInvite();
    // Reduced motion: no frame-by-frame sweep (a JS setInterval the CSS reduced-motion
    // rule can't touch). Jump straight to the final state — all tools, T = max year — in
    // one render, and never enter the playing state so the button stays "▶ play", unstuck.
    if (window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      T = qYear(1);
      yr.value = 1000;
      ylab.textContent = T;
      render();
      renderChips();
      return;
    }
    playing = true;
    this.textContent = "❚❚ pause";
    this.classList.add("on");
    playV = +yr.value >= 1000 ? 0 : +yr.value;
    startTimer();
  };
  const speedBtn = document.getElementById("speed");
  if (speedBtn) {
    speedBtn.onclick = () => {
      playSpeed = playSpeed === 1 ? 2 : 1;
      speedBtn.textContent = playSpeed + "×";
      if (playing) startTimer(); // re-arm the interval at the new rate, keeping playV
    };
  }
  // item 5: hop-by-hop stepper. With a thread selected, step T to each successive card year
  // along the FIRST selected thread's path so a hand-off can be READ, not caught flying past.
  // ‹ = the previous card year (strictly < T), › = the next (strictly > T); render() keeps the
  // batch-C caption and head-label in sync. Stepping halts any autoplay.
  function threadYears() {
    const t = selThreads[0];
    if (!t) return [];
    return [
      ...new Set(CARDS.filter(c => c.threads.includes(t) && c.lat != null).map(c => c.year)),
    ].sort((a, b) => a - b);
  }
  function step(dir) {
    if (!selThreads.length) return;
    stop();
    clearInvite();
    const years = threadYears();
    if (!years.length) return;
    let idx;
    if (dir > 0) {
      idx = years.findIndex(y => y > T);
      if (idx < 0) idx = years.length - 1; // already at/after the last hand-off: stay on it
    } else {
      idx = 0;
      for (let i = 0; i < years.length; i++) if (years[i] < T) idx = i; // largest year < T
    }
    T = years[idx];
    yr.value = yearSlider(T);
    ylab.textContent = T;
    render();
    renderChips();
  }
  const stepPrev = document.getElementById("stepprev"),
    stepNext = document.getElementById("stepnext");
  if (stepPrev) stepPrev.onclick = () => step(-1);
  if (stepNext) stepNext.onclick = () => step(1);
  // item 5: "watch the lead migrate" — the whole argument in one click, for a returning user who
  // cleared the thread. Select the canonical thread, rewind T to its FIRST member year, and start
  // the existing play handler (which itself honours reduced-motion by jumping to the final state).
  const migrateBtn = document.getElementById("migrate");
  if (migrateBtn)
    migrateBtn.onclick = () => {
      clearInvite();
      selThreads = [COLD_THREAD];
      try {
        setThreads(selThreads);
      } catch (e) {}
      if (repaintThreads) repaintThreads();
      const yrs = threadYears();
      const y0 = yrs.length ? yrs[0] : qYear(0);
      T = y0;
      yr.value = yearSlider(y0);
      ylab.textContent = T;
      render();
      renderChips();
      if (!playing) document.getElementById("play").click();
    };
  // item 10: era ticks on the #yr slider + click-an-era to jump. The slider is quantile-mapped
  // (qYear/yearSlider), so it has no temporal orientation on its own. Mark each ERAS boundary at
  // yearSlider(startYear) — the SAME mapping the thumb uses — so a tick lines up with where the
  // thumb sits at that year, and make each era a keyboard-reachable button that JUMPS T to that
  // era's start. --thr/--thd (thumb radius / width, in map.html) inset the tick track by the
  // native thumb geometry so the mark under value V matches the thumb centre at value V. Built
  // ONCE: positions are fixed functions of the YS quantiles, never recomputed per frame.
  (function buildEraTicks() {
    const host = document.getElementById("eratk");
    if (!host) return;
    const min = YS[0],
      max = YS[YS.length - 1];
    // only eras that overlap the data span get a tick (earlier eras would pile up at slider 0)
    const bounds = ERAS.filter(e => e[2] > min && e[1] <= max);
    host.innerHTML = bounds
      .map((e, i) => {
        const name = e[0],
          start = e[1];
        const f = Math.min(1, Math.max(0, yearSlider(start) / 1000));
        const nf = i < bounds.length - 1 ? Math.min(1, Math.max(0, yearSlider(bounds[i + 1][1]) / 1000)) : 1;
        // left = thumb-centre position for this year; width spans to the next boundary so the whole
        // era segment is a click target (a 1px tick alone is unhittable). Both use (100% - --thd)
        // and the --thr offset, matching the thumb's own travel.
        const left = `calc(var(--thr) + ${f.toFixed(4)} * (100% - var(--thd)))`;
        const width = `calc(${Math.max(0, nf - f).toFixed(4)} * (100% - var(--thd)))`;
        return `<button type="button" class="etk" data-y="${start}" style="left:${left};width:${width}" aria-label="Jump to the ${TA.esc(name)} era, from ${start}" title="${TA.esc(name)} · ${start}"></button>`;
      })
      .join("");
    host.querySelectorAll(".etk").forEach(b => {
      b.onclick = () => {
        stop();
        clearInvite();
        const y = +b.dataset.y;
        // jump T to the era's start year; the thumb follows via the same yearSlider() mapping the
        // tick is positioned with, so thumb and tick coincide. render()+renderChips() keep the
        // globe, caption and tools list in step (and, being a gesture, schedule the #t hash write).
        T = y;
        yr.value = yearSlider(y);
        ylab.textContent = T;
        render();
        renderChips();
      };
    });
  })();
  // ----- Scope -----
  // multi-select thread picker — each selected thread traces its migration path in its own colour
  (function () {
    const btn = document.getElementById("threadbtn"),
      pan = document.getElementById("threadpanel");
    if (!btn || !pan) return;
    const counts = {};
    CARDS.forEach(c => c.threads.forEach(t => (counts[t] = (counts[t] || 0) + 1)));
    const allThs = Object.keys(counts).sort((a, b) => counts[b] - counts[a]);
    // When a history is active the popover shows only that history's threads (spec §5,
    // step 1); All shows every thread as before. selThreads is left intact — history and
    // thread are independent hash params, so a trace can survive a history scope change.
    const ths = () =>
      curHist && window.threadsIn
        ? allThs.filter(t => window.threadsIn(curHist).indexOf(t) >= 0)
        : allThs;
    function paint() {
      window.threadSlots(threadSlot, selThreads);
      // .trow rows and #tclr are keyboard-operable now, but this rebuilds pan.innerHTML
      // wholesale — so activating a row destroyed the focused element and dropped focus
      // to <body>, making the list untraversable by keyboard. Remember and restore.
      const act = document.activeElement,
        keep =
          act && act.closest && act.closest("#threadpanel")
            ? act.id === "tclr"
              ? "#tclr"
              : act.classList.contains("trow")
                ? `.trow[data-t="${act.dataset.t}"]`
                : null
            : null;
      pan.innerHTML =
        ths()
          .map(t => {
            const on = selThreads.includes(t);
            const col = on ? threadColor(t) : "#ccc";
            const row = `<div class="trow" data-t="${encodeURIComponent(t)}" style="display:flex;align-items:center;gap:7px;padding:3px 6px;border-radius:6px;cursor:pointer;font-size:12px;${on ? "background:#f3efe9" : ""}"><span style="width:10px;height:10px;border-radius:50%;background:${col};flex:0 0 auto;border:.5px solid rgba(0,0,0,.2)"></span><span style="flex:1">${t}</span><span style="color:#6d6961;font-size:10.5px">${counts[t]}</span></div>`;
            // Item 4: the same ordered migration the arc encodes, as text under each selected
            // row — so colour-blind / low-vision sighted users get the route too, not just AT.
            const route = on
              ? `<div class="troute" style="font-size:10px;color:#6d6961;line-height:1.35;margin:-1px 0 4px 24px;white-space:normal">${TA.esc(routeString(t))}</div>`
              : "";
            return row + route;
          })
          .join("") +
        (selThreads.length
          ? `<div id="tclr" style="text-align:center;color:#5a544c;cursor:pointer;font-size:11.5px;padding:6px 0 2px;border-top:.5px solid #eee;margin-top:4px">clear all</div>`
          : "");
      btn.textContent =
        (selThreads.length
          ? selThreads.length + (selThreads.length > 1 ? " threads" : " thread")
          : "threads") + " ▾";
      pan.querySelectorAll(".trow").forEach(r => {
        const t = decodeURIComponent(r.dataset.t);
        r.onclick = () => {
          const i = selThreads.indexOf(t);
          if (i >= 0) selThreads.splice(i, 1);
          else selThreads.push(t);
          try {
            setThreads(selThreads);
          } catch (e) {}
          paint();
          render();
        };
        const verb = selThreads.includes(t) ? "Deselect thread " : "Select thread ";
        kbd(r, () => r.onclick(), verb + t + " (" + counts[t] + " tools)");
      });
      const clr = document.getElementById("tclr");
      if (clr) {
        clr.onclick = () => {
          selThreads = [];
          try {
            setThreads([]);
          } catch (e) {}
          paint();
          render();
        };
        kbd(clr, () => clr.onclick(), "Clear all selected threads");
      }
      if (keep) {
        const back = pan.querySelector(keep);
        if (back) back.focus();
      }
      // Route string to the aria-live region — self-guarded, so it announces only when the
      // set of selected threads actually changed (not on a history-scope repaint).
      announceRoutes();
    }
    // aria-expanded on the button is the only thing that tells AT whether the panel is
    // open — the label ("3 threads") is identical in both states.
    function setOpen(open, refocus) {
      pan.style.display = open ? "block" : "none";
      btn.setAttribute("aria-expanded", open ? "true" : "false");
      if (!open && refocus) btn.focus();
    }
    btn.onclick = ev => {
      ev.stopPropagation();
      setOpen(pan.style.display === "none");
    };
    pan.addEventListener("click", ev => ev.stopPropagation());
    document.addEventListener("click", () => setOpen(false));
    // Escape closes and hands focus back to the button, so keyboard users are not
    // stranded inside a panel they can only leave by tabbing past every thread.
    document.addEventListener("keydown", ev => {
      if (ev.key === "Escape" && pan.style.display !== "none") setOpen(false, true);
    });
    repaintThreads = paint;
    paint();
  })();
  // History selector — the shared historyBar renders the pills (one source of markup);
  // picking a history scopes the thread popover and dims off-history dots. Incoming
  // #hist= is already honoured at load via curHist (read above) feeding paint()/render().
  if (window.historyBar) {
    window.historyBar(document.getElementById("histbar"), function (hk) {
      curHist = hk || "";
      if (repaintThreads) repaintThreads();
      render();
    });
  }
  // ----- Locate -----
  // "find a tool" — a results dropdown under the search box. Typing shows up to 8 name
  // matches (exact/prefix/word-start ranked first); hovering or arrowing a row PREVIEWS it
  // (spin-to + highlight ring, the old behaviour); clicking a row or pressing Enter also
  // opens its detail panel via the shared showDetail(). Keyboard-first and role=listbox so
  // AT can traverse it; aria-activedescendant tracks the highlighted row.
  (function () {
    const inp = document.getElementById("msearch"),
      box = document.getElementById("mresults");
    if (!inp || !box) return;
    let results = [],
      active = -1;
    const placeOf = c => c.place || c.country || "";
    // rank: exact name (0) < prefix (1) < word-start (2) < substring (3); ties by match
    // position, then name length, then name — so "the transistor" beats a mid-word hit.
    function search(q) {
      q = q.trim().toLowerCase();
      if (!q) return [];
      const out = [];
      for (const c of CARDS) {
        if (c.lat == null) continue;
        const n = c.name.toLowerCase(),
          i = n.indexOf(q);
        if (i < 0) continue;
        const s = n === q ? 0 : i === 0 ? 1 : /[^a-z0-9]/.test(n[i - 1]) ? 2 : 3;
        out.push({ c, s, i });
      }
      out.sort(
        (a, b) =>
          a.s - b.s ||
          a.i - b.i ||
          a.c.name.length - b.c.name.length ||
          a.c.name.localeCompare(b.c.name),
      );
      return out.slice(0, 8).map(o => o.c);
    }
    // Preview = the old as-you-type behaviour: highlight the dot and spin (and zoom in once)
    // toward it. No detail panel — that is reserved for an explicit pick.
    function preview(c) {
      foundId = c.id;
      rotLon = c.lon;
      rotLat = Math.max(-80, Math.min(80, c.lat));
      if (scale < 320) scale = 420;
      render();
    }
    // Pick = preview + open the shared detail panel (what every other view does on click).
    function pick(c) {
      preview(c);
      try {
        showDetail(c);
      } catch (e) {}
    }
    function setActive(i, doPreview) {
      active = i;
      box.querySelectorAll(".mrow").forEach(r => {
        const on = +r.dataset.idx === active;
        r.setAttribute("aria-selected", on ? "true" : "false");
        if (on) r.scrollIntoView({ block: "nearest" });
      });
      if (active >= 0) {
        inp.setAttribute("aria-activedescendant", "mrow-" + active);
        if (doPreview) preview(results[active]);
      } else inp.removeAttribute("aria-activedescendant");
    }
    function close(clearFound) {
      box.style.display = "none";
      box.innerHTML = "";
      results = [];
      active = -1;
      inp.setAttribute("aria-expanded", "false");
      inp.removeAttribute("aria-activedescendant");
      if (clearFound && foundId != null) {
        foundId = null;
        render();
      }
    }
    function paint() {
      box.innerHTML = results
        .map((c, idx) => {
          const gly = KGLY[c.kind] || "";
          return (
            `<div class="mrow" id="mrow-${idx}" role="option" data-idx="${idx}" aria-selected="false">` +
            `<div style="display:flex;gap:6px;align-items:baseline">` +
            `<span style="color:${KC[c.kind]};font-size:9px">${gly}</span>` +
            `<span style="flex:1;font-size:12px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap">${TA.esc(c.name)}</span>` +
            `<span style="color:#6d6961;font-size:10px">${c.year || ""}</span></div>` +
            `<div style="color:#6d6961;font-size:10px;margin-left:15px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap">${TA.esc(placeOf(c))}</div>` +
            `</div>`
          );
        })
        .join("");
      box.style.display = "block";
      inp.setAttribute("aria-expanded", "true");
      box.querySelectorAll(".mrow").forEach(r => {
        const idx = +r.dataset.idx;
        // keep focus in the input on press so the row click still fires against a live box
        r.addEventListener("mousedown", e => e.preventDefault());
        r.addEventListener("mouseenter", () => setActive(idx, true));
        r.addEventListener("click", () => {
          setActive(idx, false);
          pick(results[idx]);
          close();
        });
      });
    }
    inp.addEventListener("input", () => {
      const q = inp.value.trim();
      if (!q) {
        close(true);
        return;
      }
      results = search(q);
      if (!results.length) {
        close(true);
        return;
      }
      paint();
      setActive(0, true); // auto-highlight + preview the top hit as you type
    });
    inp.addEventListener("keydown", e => {
      const open = box.style.display !== "none" && results.length;
      if (e.key === "Escape") {
        e.preventDefault();
        if (open) close();
        else inp.blur();
        return;
      }
      if (!open) return;
      if (e.key === "ArrowDown") {
        e.preventDefault();
        setActive((active + 1) % results.length, true);
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        setActive((active - 1 + results.length) % results.length, true);
      } else if (e.key === "Enter" && active >= 0) {
        e.preventDefault();
        pick(results[active]);
        close();
      }
    });
    // Clicking anywhere outside the box/input closes the dropdown and drops the highlight.
    document.addEventListener("click", e => {
      if (e.target.closest && e.target.closest("#msearch,#mresults")) return;
      if (box.style.display !== "none") close(true);
    });
  })();
  // Opening a dot/country is handled by the pointer flow above (openAt on a clean tap), so a
  // drag never opens anything and a synthesized click is not relied on. No click listener here.
  // item 9: follow a builds-on / enables link as a GEOGRAPHIC hop. shared.js showDetail wires each
  // .xnav to re-open the linked card (swapping the panel); this delegated listener — GLOBE-ONLY, so
  // it never touches xnav on the other views — adds the fly on top. It bubbles AFTER showDetail's
  // own target-phase handler, and reads the link's target id from the (now-detached) span, so the
  // panel swap and the globe rotation stay in sync. .xnav lives only inside the detail panel.
  document.addEventListener("click", e => {
    const x = e.target.closest && e.target.closest(".xnav");
    if (!x) return;
    const c2 = byId[decodeURIComponent(x.dataset.id)];
    if (c2) flyTo(c2);
  });
  // item 7: keyboard-reachable list of making-centres. Appended INSIDE #wrap but hidden
  // (opacity:0, pointer-events:none) until a child button receives focus (#centerlist:focus-within),
  // so the DEFAULT globe render is pixel-identical and it never intercepts a pointer on the globe.
  // A keyboard user tabbing off the globe svg lands on it; Enter opens the same dossier a label tap
  // does. Native <button>s, so Enter/Space and Tab traversal come for free.
  (function buildCenterList() {
    const host = document.getElementById("wrap");
    if (!host) return;
    const items = CENTERS.map(a => ({ name: a[0], n: (anchored.get(a[0]) || { n: 0 }).n }))
      .filter(o => o.n > 0)
      .sort((a, b) => b.n - a.n);
    if (!items.length) return;
    const box = document.createElement("div");
    box.id = "centerlist";
    box.setAttribute("aria-label", "Making-centres — open a centre's dossier");
    box.innerHTML =
      '<div class="cl-h">making-centres</div>' +
      items
        .map(
          o =>
            `<button type="button" class="clbtn" data-center="${encodeURIComponent(o.name)}">` +
            `<span class="cl-t">${TA.esc(o.name)}</span><span class="cl-n">${o.n}</span></button>`,
        )
        .join("");
    host.appendChild(box);
    box.querySelectorAll(".clbtn").forEach(b => {
      b.onclick = () => showCenter(decodeURIComponent(b.dataset.center));
    });
  })();
  // ----- View -----
  // (rotate/zoom via the pointer/touch/wheel/keyboard handlers + focusZoom/openAt above; only
  //  #reset, the resize repaint, and the hover-tooltip are wired here.)
  document.getElementById("reset").onclick = () => {
    rotLon = cLon;
    rotLat = Math.min(55, cLat + 6);
    scale = Math.min(W, H) * 0.46;
    render();
  };
  window.addEventListener("resize", render);
  // Delegated interaction (bound once): tooltip on dot hover, open card on dot click,
  // open country panel on country click (unless the gesture was a drag).
  svg.addEventListener("mousemove", e => {
    const d = e.target.closest(".dot");
    if (d) showTip(decodeURIComponent(d.dataset.id), e);
    else tip.style.display = "none";
  });
  svg.addEventListener("mouseleave", () => (tip.style.display = "none"));
  // ----- Reference -----
  // #mcap (migration caption), #mlive (aria-live routes/era crossings) and #hint are updated
  // INSIDE render()/announceRoutes() above — no standalone control wiring to place in this seam.
  // ===== BOOT (mount · #card / #t,#rot hydrate · cold-open) =====
  T = qYear(1);
  document.getElementById("ylab").textContent = T;
  render();
  renderChips();
  // C1 READ side: a tool focused in another view arrives via the URL hash. Open its
  // detail panel and, so it is actually visible, spin the globe to it and highlight it.
  try {
    const _f = getState().card || "";
    if (_f && byId[_f]) {
      const c = byId[_f];
      foundId = c.id;
      if (c.lat != null) {
        rotLon = c.lon;
        rotLat = Math.max(-80, Math.min(80, c.lat));
        if (scale < 320) scale = 420;
      }
      render();
      showDetail(c);
    }
  } catch (e) {}
  // item 8 (HYDRATE side): restore the moment from the hash. #t=<year> sets T (and the slider via
  // the existing yearSlider()); #rot=<lon,lat> sets the rotation. Runs ALONGSIDE the #card read
  // above and BEFORE the cold-open below, so the cold-open can honour t/rot for year/rotation.
  let _hadT = false,
    _hadRot = false;
  try {
    const st = getState();
    if (st.t) {
      const y = parseInt(st.t, 10);
      if (!isNaN(y)) {
        T = y;
        yr.value = yearSlider(y);
        document.getElementById("ylab").textContent = T;
        _hadT = true;
      }
    }
    if (st.rot) {
      const m = st.rot.split(",");
      const lo = parseFloat(m[0]),
        la = parseFloat(m[1]);
      if (!isNaN(lo)) rotLon = lo;
      if (!isNaN(la)) {
        rotLat = Math.max(-90, Math.min(90, la));
        _hadRot = true;
      } else if (!isNaN(lo)) _hadRot = true;
    }
    if (_hadT || _hadRot) {
      render();
      renderChips();
    }
  } catch (e) {}
  // item 2 + item 8: cold-open on the canonical migration. The trigger is an empty THREAD/CARD/HIST
  // (the things that name a view) — NOT a whole-empty hash. Writing #t/#rot on gesture-end means a
  // reloaded page is no longer literally empty, so gating on the whole hash would silently kill the
  // cold open. A bare #t=1990 (no thread) therefore STILL cold-opens COLD_THREAD, just AT 1990: the
  // decision is "no view chosen ⇒ show the canonical one," honouring any t/rot for the instant.
  try {
    const st = getState();
    if (!st.card && !st.thread && !st.hist) {
      selThreads = [COLD_THREAD];
      try {
        setThreads(selThreads);
      } catch (e) {}
      // T = global max year (the WHOLE …US → Japan → Netherlands → Taiwan path drawn at rest, the
      // batch-C caption naming the current lead — which IS the argument), UNLESS #t pinned a year.
      if (!_hadT) {
        T = qYear(1);
        yr.value = yearSlider(T);
        document.getElementById("ylab").textContent = T;
      }
      // Frame the relevant making-centres, UNLESS #rot pinned a rotation.
      if (!_hadRot) {
        rotLon = COLD_LON;
        rotLat = COLD_LAT;
      }
      if (repaintThreads) repaintThreads(); // popover shows the thread selected + its route
      render();
      renderChips();
      // Pulse #play to invite the replay — WITHOUT starting the timer (autoplay on load is
      // jarring). The pulse ANIMATION is gated to (prefers-reduced-motion:no-preference) in CSS,
      // so under reduce only the static ring shows; the trace itself is always drawn.
      const pb = document.getElementById("play");
      if (pb) pb.classList.add("invite");
    }
  } catch (e) {}
  // item 8: init/hydrate/cold-open are done — from here on any render() is a real gesture, so let
  // the debounced hash writer arm. Nothing above wrote #t/#rot (those renders ran with _ready
  // false), so a cold-open URL stays clean until the user's first move.
  _ready = true;
})();
