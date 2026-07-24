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
    tip = document.getElementById("tip");
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
      // warm NEUTRAL, deliberately outside KCOL: a busy country must not read as
      // "Make" (KCOL.Make #b06a1e = rgba(176,106,30)). Same 0.12→0.72 alpha ramp.
      const fill =
        o.c > 0 ? `rgba(150,140,120,${(0.12 + (0.6 * o.c) / maxc).toFixed(3)})` : "#e7e3db";
      for (const ring of o.r) {
        const d = ringPath(ring);
        if (d)
          s += `<path class="cty" data-ci="${ci}" d="${d}" fill="${fill}" stroke="rgba(0,0,0,.14)" stroke-width=".4"/>`;
      }
    });
    const rsc = Math.max(0.6, Math.min(3, scale / (Math.min(W, H) * 0.46)));
    if (!selThreads.length) {
      // genealogy arcs (builds-on -> enables), only when no thread is selected
      for (const c of CARDS) {
        if (c.lat == null) continue;
        for (const en of c.en || []) {
          const b = byId[en];
          if (!b || b.lat == null || b.year > T) continue;
          if (Math.abs(c.lat - b.lat) < 0.2 && Math.abs(c.lon - b.lon) < 0.2) continue;
          if (!vis(c.lon, c.lat) || !vis(b.lon, b.lat)) continue;
          const A = proj(c.lon, c.lat),
            B = proj(b.lon, b.lat);
          const mx = (A[0] + B[0]) / 2,
            my = (A[1] + B[1]) / 2 - Math.hypot(B[0] - A[0], B[1] - A[1]) * 0.18;
          s += `<path d="M${A[0].toFixed(1)} ${A[1].toFixed(1)} Q${mx.toFixed(1)} ${my.toFixed(1)} ${B[0].toFixed(1)} ${B[1].toFixed(1)}" fill="none" stroke="${KC[b.kind]}" stroke-opacity="${(0.1 + 0.3 * tfrac(b.year)).toFixed(2)}" stroke-width="1"/>`;
        }
      }
    } else {
      // thread migration paths: each selected thread's cards joined in chronological order
      // B3: paths carried identity by COLOUR ALONE. Give each path a text head-label
      // (matching how the Timeline labels its traces) so a thread is legible even when
      // its colour is ambiguous or neutral. Collision-pruned so many selected threads
      // do not clutter — a label that would overlap an already-placed one is dropped.
      const _tlab = [];
      selThreads.forEach(t => {
        const col = threadColor(t);
        const mem = CARDS.filter(c => c.threads.includes(t) && c.lat != null && c.year <= T).sort(
          (a, b) => a.year - b.year || a.id.localeCompare(b.id),
        );
        for (let i = 0; i < mem.length - 1; i++) {
          const a = mem[i],
            b = mem[i + 1];
          if (!vis(a.lon, a.lat) || !vis(b.lon, b.lat)) continue;
          const A = proj(a.lon, a.lat),
            B = proj(b.lon, b.lat);
          const same = Math.abs(a.lat - b.lat) < 0.2 && Math.abs(a.lon - b.lon) < 0.2;
          if (same) {
            const rr = 5 * rsc;
            s += `<circle cx="${A[0].toFixed(1)}" cy="${(A[1] - rr).toFixed(1)}" r="${rr.toFixed(1)}" fill="none" stroke="${col}" stroke-opacity=".55" stroke-width="1.4"/>`;
            continue;
          }
          const dx = B[0] - A[0],
            dy = B[1] - A[1];
          const mx = (A[0] + B[0]) / 2 - dy * 0.18,
            my = (A[1] + B[1]) / 2 + dx * 0.18;
          s += `<path d="M${A[0].toFixed(1)} ${A[1].toFixed(1)} Q${mx.toFixed(1)} ${my.toFixed(1)} ${B[0].toFixed(1)} ${B[1].toFixed(1)}" fill="none" stroke="${col}" stroke-opacity=".85" stroke-width="${(2 * Math.min(1.6, rsc)).toFixed(1)}" stroke-linecap="round"/>`;
          const tx = B[0] - mx,
            ty = B[1] - my,
            tl = Math.hypot(tx, ty) || 1,
            ux = tx / tl,
            uy = ty / tl,
            ah = 6 * rsc;
          s += `<path d="M${B[0].toFixed(1)} ${B[1].toFixed(1)} L${(B[0] - ux * ah - uy * ah * 0.55).toFixed(1)} ${(B[1] - uy * ah + ux * ah * 0.55).toFixed(1)} L${(B[0] - ux * ah + uy * ah * 0.55).toFixed(1)} ${(B[1] - uy * ah - ux * ah * 0.55).toFixed(1)} Z" fill="${col}" fill-opacity=".9"/>`;
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
            _tlab.some(q => Math.abs(q.x - lx) < (q.w + w) / 2 + 2 && Math.abs(q.y - ly) < fs + 3)
          )
            break;
          _tlab.push({ x: lx, y: ly, w });
          s += `<text x="${lx.toFixed(1)}" y="${ly.toFixed(1)}" text-anchor="middle" font-size="${fs}" font-weight="600" fill="${col}" stroke="#f5f3ef" stroke-width="3" paint-order="stroke" style="pointer-events:none">${TA.esc(t)}</text>`;
          break;
        }
      });
    }
    // dots
    for (const c of CARDS) {
      if (c.lat == null) continue;
      const fnd = c.id === foundId;
      if (c.year > T && !fnd) continue;
      const p = proj(c.lon, c.lat);
      if (p[2] < 0) continue;
      const r = (3 + Math.min(4, (c.en ? c.en.length : 0) * 0.8)) * rsc * (fnd ? 1.6 : 1);
      const onT = selThreads.length ? selThreads.find(t => c.threads.includes(t)) : null;
      // A scoped history dims any card outside it (spec §5 canvas step); All dims nothing.
      const offH = curHist && window.historyMatch && !window.historyMatch(c, curHist);
      const off = offH || (selThreads.length && !onT);
      const fo = fnd ? 1 : off ? 0.07 : 0.3 + 0.65 * tfrac(c.year);
      const ring = fnd ? "#111" : onT ? threadColor(onT) : "#fff";
      const rw = fnd ? "2.2" : onT ? "2" : ".8";
      s += `<circle class="dot" data-id="${encodeURIComponent(c.id)}" cx="${p[0].toFixed(1)}" cy="${p[1].toFixed(1)}" r="${r.toFixed(1)}" fill="${KC[c.kind]}" fill-opacity="${fo}" stroke="${ring}" stroke-width="${rw}"/>`;
    }
    // region labels (density clusters), sized by card count, collision-pruned (densest placed first)
    const _lab = [];
    for (const h of HUBS) {
      if (!vis(h.lon, h.lat)) continue;
      const p = proj(h.lon, h.lat);
      if (p[2] < 0) continue;
      const fs = 6.5 + Math.min(7, Math.sqrt(h.n) * 1.7),
        ly = p[1] - 9,
        lx = p[0],
        w = h.city.length * fs * 0.56 + 6;
      if (_lab.some(q => Math.abs(q.x - lx) < (q.w + w) / 2 + 2 && Math.abs(q.y - ly) < fs + 3))
        continue;
      _lab.push({ x: lx, y: ly, w });
      s += `<text x="${lx.toFixed(1)}" y="${ly.toFixed(1)}" text-anchor="middle" font-size="${fs.toFixed(1)}" font-weight="600" fill="#333" style="paint-order:stroke;stroke:#f5f3ef;stroke-width:2.5px">${h.city}</text>`;
    }
    svg.innerHTML = s;
    // dots/countries are handled by one set of delegated listeners on the svg (set up once,
    // below) — no per-frame re-binding of hundreds of nodes while dragging/playing.
    document.getElementById("hint").textContent =
      `${CARDS.filter(c => c.lat != null && c.year <= T).length} of ${CARDS.length} tools through ${T}`;
    // The era rail depends only on T and chipsOpen, never on rotation/zoom — so it is
    // NOT rebuilt here. render() runs on every mousemove while dragging; rebuilding 161
    // rows plus their handlers per frame was the single biggest cost in the drag loop.
    // Callers that actually change T or chipsOpen call renderChips() themselves.
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
        '" font-size="8" fill="#bbb" text-anchor="middle">' +
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
      '" font-size="7.5" fill="#9a9488">cumulative — dashed = world shape</text></svg>';
    return s;
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
            ' <span style="color:#aaa">' +
            c.year +
            "</span></div>",
        )
        .join("") || "<div style='color:#bbb'>No tools recorded here.</div>";
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
      '<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:6px"><div style="font-size:10.5px;text-transform:uppercase;letter-spacing:.05em;color:#888">Tools through ' +
      T +
      " (" +
      list.length +
      ')</div><span id="chipstog" style="cursor:pointer;color:#888;font-size:13px">' +
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
          '<div style="font-size:9.5px;font-weight:600;color:#7a746a;margin:9px 0 2px;border-bottom:.5px solid #eee">' +
          nm +
          "</div>" +
          grp
            .map(
              c =>
                '<div class="chip2" data-id="' +
                encodeURIComponent(c.id) +
                '" style="cursor:pointer;display:flex;gap:6px;align-items:baseline;padding:2px 4px;border-radius:6px"><span style="color:#aaa;font-size:10px;min-width:30px">' +
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
  // interaction
  let dn = false,
    lx,
    ly,
    moved = false,
    chipsOpen = true;
  const ERAS = window.ERAS;
  svg.addEventListener("mousedown", e => {
    if (e.target.classList.contains("dot")) return;
    dn = true;
    moved = false;
    lx = e.clientX;
    ly = e.clientY;
    svg.classList.add("drag");
    e.preventDefault();
  });
  window.addEventListener("mousemove", e => {
    if (!dn) return;
    moved = true;
    const k = 0.25 * (300 / scale);
    rotLon -= (e.clientX - lx) * k;
    rotLat += (e.clientY - ly) * k;
    rotLat = Math.max(-90, Math.min(90, rotLat));
    lx = e.clientX;
    ly = e.clientY;
    render();
  });
  window.addEventListener("mouseup", () => {
    dn = false;
    svg.classList.remove("drag");
  });
  svg.addEventListener(
    "wheel",
    e => {
      e.preventDefault();
      scale *= e.deltaY < 0 ? 1.15 : 0.87;
      scale = Math.max(80, Math.min(6000, scale));
      render();
    },
    { passive: false },
  );
  const yr = document.getElementById("yr"),
    ylab = document.getElementById("ylab");
  yr.oninput = e => {
    stop();
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
  document.getElementById("play").onclick = function () {
    if (playing) {
      stop();
      return;
    }
    playing = true;
    this.textContent = "❚❚ pause";
    this.classList.add("on");
    let v = +yr.value >= 1000 ? 0 : +yr.value;
    timer = setInterval(() => {
      v += 14;
      if (v >= 1000) {
        v = 1000;
        T = qYear(1);
        yr.value = 1000;
        ylab.textContent = T;
        render();
        renderChips();
        stop();
        return;
      }
      T = qYear(v / 1000);
      yr.value = v;
      ylab.textContent = T;
      render();
      renderChips();
    }, 90);
  };
  document.getElementById("reset").onclick = () => {
    rotLon = cLon;
    rotLat = Math.min(55, cLat + 6);
    scale = Math.min(W, H) * 0.46;
    render();
  };
  document.getElementById("msearch").oninput = e => {
    const q = e.target.value.toLowerCase();
    if (!q) {
      foundId = null;
      render();
      return;
    }
    const c = CARDS.find(c => c.lat != null && c.name.toLowerCase().includes(q));
    if (c) {
      foundId = c.id;
      rotLon = c.lon;
      rotLat = Math.max(-80, Math.min(80, c.lat));
      if (scale < 320) scale = 420;
      render();
    }
  };
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
            return `<div class="trow" data-t="${encodeURIComponent(t)}" style="display:flex;align-items:center;gap:7px;padding:3px 6px;border-radius:6px;cursor:pointer;font-size:12px;${on ? "background:#f3efe9" : ""}"><span style="width:10px;height:10px;border-radius:50%;background:${col};flex:0 0 auto;border:.5px solid rgba(0,0,0,.2)"></span><span style="flex:1">${t}</span><span style="color:#aaa;font-size:10.5px">${counts[t]}</span></div>`;
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
  window.addEventListener("resize", render);
  // Delegated interaction (bound once): tooltip on dot hover, open card on dot click,
  // open country panel on country click (unless the gesture was a drag).
  svg.addEventListener("mousemove", e => {
    const d = e.target.closest(".dot");
    if (d) showTip(decodeURIComponent(d.dataset.id), e);
    else tip.style.display = "none";
  });
  svg.addEventListener("mouseleave", () => (tip.style.display = "none"));
  svg.addEventListener("click", e => {
    const d = e.target.closest(".dot");
    if (d) {
      try {
        showDetail(byId[decodeURIComponent(d.dataset.id)]);
      } catch (err) {}
      return;
    }
    const ct = e.target.closest(".cty");
    if (ct && !moved) showCountry(+ct.dataset.ci);
  });
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
})();
