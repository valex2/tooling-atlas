// ta.js — cross-view primitives, loaded as the FIRST <script> in every view, BEFORE
// shared.js (shared.js's rebuildById builds on TA.byId). Everything here is either a LAZY
// factory or a plain data constant: nothing reads window.CARDS or the DOM at parse time, so
// this file is safe to load ahead of the data and before anything is in the document.
window.TA = window.TA || {};

// The one HTML escaper for view-side interpolation (regenerate.py keeps its own for build
// time). Was `xesc` in atlas.html.
window.TA.esc = s => String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

// id -> card index. The Timeline passes the FILTERED set (cards with a year); every other
// caller passes the full corpus. Same builder either way. Was duplicated verbatim in map.js,
// tree.js, atlas.html and shared.js.
window.TA.byId = cards => Object.fromEntries((cards || []).map(c => [c.id, c]));

// Lineage graph walks over a byId index: anc() follows builds-on, desc() follows enables.
// Byte-identical recursion that used to be copied in tree.js and atlas.html.
window.TA.lineage = function (byId) {
  function walk(id, s, key) {
    for (const p of byId[id][key] || [])
      if (byId[p] && !s.has(p)) {
        s.add(p);
        walk(p, s, key);
      }
    return s;
  }
  return {
    anc: (id, s) => walk(id, s, "bo"),
    desc: (id, s) => walk(id, s, "en"),
  };
};

// Year -> position. mode "log" (default) is the log-in-time axis shared by the Timeline and
// the Tree — it compresses the sparse pre-1800 range and expands the dense 20th–21st c.;
// mode "linear" is the Globe's plain normalised fraction. frac() clamps y to [minY,maxY];
// xs() maps that fraction across [x0, x0+width].
window.TA.timeScale = function (o) {
  const minY = o.minY,
    maxY = o.maxY,
    x0 = o.x0 || 0,
    width = o.width == null ? 1 : o.width,
    k = o.k;
  const frac =
    o.mode === "linear"
      ? y => Math.max(0, Math.min(1, (y - minY) / (maxY - minY)))
      : y => {
          const c = Math.max(minY, Math.min(maxY, y));
          return 1 - Math.log(1 + (maxY - c) / k) / Math.log(1 + (maxY - minY) / k);
        };
  return { frac, xs: y => x0 + width * frac(y) };
};

// Era gridlines + collision-bumped era labels across the top band, keyed off window.ERAS
// (read lazily, at call time). `cls` is the class stamped on each vertical gridline div: the
// Tree tags them "bg" so its re-render sweep removes them, the Timeline emits none. `layoutH`
// is the current stage height, passed per call. Was byte-identical eraBandHtml() in both.
window.TA.eraBand = function (xs, layoutH, cls) {
  const c = cls ? ' class="' + cls + '"' : "";
  const SUB = [1, 10, 19],
    rightEdge = [-1e9, -1e9, -1e9];
  let h = "";
  window.ERAS.forEach(e => {
    const a = xs(e[1]),
      b = xs(e[2]);
    h += `<div${c} style="position:absolute;left:${a}px;top:0;height:${layoutH}px;border-left:1px solid rgba(0,0,0,.08);z-index:0"></div>`;
    const cx = (a + b) / 2,
      w = e[0].length * 5.6 + 12;
    let left = cx - w / 2;
    let r = 0;
    for (; r < SUB.length; r++) {
      if (left >= rightEdge[r] + 4) break;
    }
    if (r >= SUB.length) {
      r = 0;
      for (let i = 1; i < SUB.length; i++) if (rightEdge[i] < rightEdge[r]) r = i;
    }
    rightEdge[r] = Math.max(rightEdge[r], left + w);
    h += `<div style="position:absolute;left:${cx}px;top:${SUB[r]}px;transform:translateX(-50%);font-size:9px;font-weight:600;color:rgba(0,0,0,.32);z-index:4;white-space:nowrap;background:rgba(252,251,249,.9);padding:0 3px;border-radius:3px">${e[0]}</div>`;
  });
  return h;
};

// Hover tooltip shared by the Globe and the Tree. Both hold a `.tip` element and a byId
// index; the markup is identical. Returns a bound showTip(id, event).
window.TA.tooltip = function (tip, byId) {
  const KC = window.KCOL,
    KINK = window.KINK;
  return function (id, e) {
    const c = byId[id];
    tip.style.borderLeftColor = KC[c.kind];
    tip.innerHTML = `<div class="t" style="color:${KINK[c.kind]}">${c.name}</div><div class="m">${c.kind} · ${c.place} · ${c.year}</div><div class="s">${c.sig || ""}</div>`;
    tip.style.display = "block";
    tip.style.left = Math.min(e.clientX + 14, window.innerWidth - 270) + "px";
    tip.style.top = e.clientY + 14 + "px";
  };
};

// Landmark events on the time axis, drawn by the Timeline and the Tree. ERAS lives in
// shared.js; this is its sibling constant. Was duplicated in both views.
window.EVENTS = [
  [1769, "Watt steam engine"],
  [1776, "American Revolution"],
  [1957, "Sputnik"],
  [1969, "Moon landing"],
  [1971, "Microprocessor"],
  [1989, "World Wide Web"],
  [2003, "Iraq War"],
  [2007, "iPhone"],
  [2012, "Deep learning"],
  [2020, "COVID-19"],
];
