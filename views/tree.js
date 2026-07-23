(function () {
  const KC = window.KCOL,
    KINK = window.KINK,
    KGLY = window.KGLY; // single source of truth (shared.js)
  // legend glyphs: kind is never carried by colour alone (matches atlas.html / table.js)
  document.querySelectorAll(".legend .gly").forEach(e => (e.textContent = KGLY[e.dataset.k] || ""));
  const byId = TA.byId(CARDS);
  const ERAS = window.ERAS;
  const EVENTS = window.EVENTS;
  const minY = 540,
    maxY = 2030,
    x0 = 170,
    W = 118,
    H = 34,
    WIDTH = 4316,
    LOGK = 35;
  // Log-in-time x-axis (default): compress the sparse pre-1800 range, expand the dense
  // 20th–21st c. See TA.timeScale in ta.js.
  const xs = TA.timeScale({ x0, width: WIDTH, minY, maxY, k: LOGK }).xs;
  // auto lanes by primary thread, ordered by earliest member
  const prim = c => (c.threads && c.threads.length ? c.threads[0] : "—");
  const tmin = {};
  CARDS.forEach(c => {
    const t = prim(c);
    tmin[t] = Math.min(tmin[t] ?? 9999, c.year || 9999);
  });
  const lanes = [...new Set(CARDS.map(prim))].sort((a, b) => tmin[a] - tmin[b]);
  let sel = null,
    q = "",
    hist = "",
    pos = {},
    layoutH = 0,
    layoutW = 0;
  try {
    const st = getState();
    if (st.q) q = st.q;
    hist = getHistory(); // #hist= scopes the genealogy to one history's threads
  } catch (e) {}
  // a card is in-history if any of its threads belongs to the picked history (shared.js)
  const inHist = c => !hist || historyMatch(c, hist);
  const ERABAND = 28; // dedicated top band for era labels (pushes everything below down)
  // Era gridlines + labels (TA.eraBand in ta.js). "bg" tags the gridline divs so render()'s
  // sweep removes them; layoutH is read fresh at each call.
  const eraBandHtml = () => TA.eraBand(xs, layoutH, "bg");
  const scroll = document.getElementById("scroll"),
    stage = document.getElementById("stage"),
    svg = document.getElementById("edges"),
    tip = document.getElementById("tip");
  function layout() {
    pos = {};
    let curY = 40 + ERABAND;
    const LM = {},
      items = {};
    lanes.forEach(l => (items[l] = []));
    CARDS.forEach(c => items[prim(c)].push(c));
    const meta = [];
    // history filter: drop lanes with no in-history card; off-history cards in a
    // kept lane stay laid out and get dimmed in render() (Timeline's .dim treatment).
    const shown = hist ? lanes.filter(l => items[l].some(inHist)) : lanes;
    for (const l of shown) {
      const arr = items[l].sort((a, b) => a.year - b.year);
      const rr = [];
      for (const c of arr) {
        const x = xs(c.year);
        let r = -1;
        for (let i = 0; i < rr.length; i++)
          if (x - rr[i] >= 10) {
            r = i;
            break;
          }
        if (r < 0) {
          r = rr.length;
          rr.push(0);
        }
        rr[r] = x + W;
        c._r = r;
        c._x = x;
      }
      const nr = Math.max(1, rr.length);
      for (const c of arr) {
        c._y = curY + c._r * (H + 10);
        pos[c.id] = { x: c._x, y: c._y };
      }
      LM[l] = curY + (nr * (H + 10) - 10) / 2;
      meta.push([l, LM[l], curY, curY + nr * (H + 10)]);
      curY += nr * (H + 10) + 18;
    }
    layoutH = curY + 10;
    layoutW = xs(maxY) + W + 20;
    return meta;
  }
  const { anc, desc } = TA.lineage(byId);
  function pinLabels() {
    document.querySelectorAll("#stage .lanelab").forEach(e => {
      if (e.dataset.bl == null) e.dataset.bl = parseFloat(e.style.left) || 0;
      e.style.left = +e.dataset.bl + scroll.scrollLeft + "px";
    });
  }
  function render() {
    const meta = layout();
    stage.style.width = layoutW + "px";
    stage.style.height = layoutH + "px";
    svg.setAttribute("width", layoutW);
    svg.setAttribute("height", layoutH);
    svg.setAttribute("viewBox", "0 0 " + layoutW + " " + layoutH);
    let lit = null;
    if (sel) {
      lit = new Set([sel]);
      anc(sel, lit);
      desc(sel, lit);
    }
    let h = "";
    meta.forEach((m, i) => {
      if (i % 2)
        h += `<div class="bg" style="position:absolute;left:0;top:${m[2]}px;width:${layoutW}px;height:${m[3] - m[2]}px;background:rgba(0,0,0,.03);z-index:0"></div>`;
    });
    h += eraBandHtml();
    EVENTS.forEach((ev, i) => {
      const x = xs(ev[0]);
      h += `<div class="bg" style="position:absolute;left:${x}px;top:${16 + ERABAND}px;height:${layoutH - 16 - ERABAND}px;border-left:1px solid rgba(154,106,58,.35);z-index:0"></div><div style="position:absolute;left:${x}px;top:${16 + ERABAND}px;width:6px;height:6px;border-radius:50%;background:#9a6a3a;transform:translate(-3px,-3px);z-index:4"></div><div style="position:absolute;left:${x + 3}px;top:${(i % 2 ? 16 : 27) + ERABAND}px;font-size:8px;color:#7a5a30;background:rgba(252,251,249,.85);padding:0 2px;z-index:4;white-space:nowrap">${ev[1]}</div>`;
    });
    for (let y = 600; y <= 2030; y += 10) {
      if (y < 1200 && y % 100) continue;
      const gx = xs(y),
        mj = y % 50 === 0;
      h += `<div class="gl ${mj ? "maj" : ""}" style="left:${gx}px;top:${24 + ERABAND}px;height:${layoutH - 30 - ERABAND}px"></div>`;
      if (mj)
        h += `<div class="yr" style="left:${gx + 2}px;top:${8 + ERABAND}px;color:#999;font-weight:600">${y}</div>`;
    }
    for (const m of meta) h += `<div class="lanelab" style="top:${m[1]}px">${m[0]}</div>`;
    for (const c of CARDS) {
      if (!pos[c.id]) continue; // card's lane was filtered out by the history scope
      const dimd = (lit && !lit.has(c.id)) || !inHist(c);
      const hl = (lit && lit.has(c.id) && c.id !== sel) || (q && c.name.toLowerCase().includes(q));
      h += `<div class="c${dimd ? " dim" : ""}${c.id === sel ? " sel" : ""}${hl ? " hl" : ""}" data-id="${encodeURIComponent(c.id)}" style="left:${c._x}px;top:${c._y}px;border-left-color:${KC[c.kind]}"><div class="ti" style="color:${KINK[c.kind]}"><span aria-hidden="true">${KGLY[c.kind]}</span> ${c.name}</div><div class="yt">${c.kind} · ${c.year}</div></div>`;
    }
    [...stage.querySelectorAll(".c,.lanelab,.gl,.yr,.bg")].forEach(e => e.remove());
    stage.insertAdjacentHTML("beforeend", h);
    let e = "";
    for (const c of CARDS) {
      const a = pos[c.id];
      if (!a) continue;
      for (const en of c.en || []) {
        const b = pos[en];
        if (!b) continue;
        const on = lit ? lit.has(c.id) && lit.has(en) : true;
        const op = lit ? (on ? 0.9 : 0.05) : 0.25;
        const x1 = a.x + W,
          y1 = a.y + H / 2,
          x2 = b.x,
          y2 = b.y + H / 2,
          mx = (x1 + x2) / 2;
        e += `<path d="M${x1} ${y1} C${mx} ${y1} ${mx} ${y2} ${x2} ${y2}" fill="none" stroke="${KC[byId[en].kind]}" stroke-opacity="${op}" stroke-width="${lit && on ? 2 : 1}"/>`;
      }
    }
    svg.innerHTML = e;
    stage.querySelectorAll(".c").forEach(el => {
      const id = decodeURIComponent(el.dataset.id);
      el.onclick = () => {
        sel = sel === id ? null : id;
        try {
          showDetail(byId[id]);
        } catch (e) {}
        render();
      };
      el.onmousemove = ev => showTip(id, ev);
      el.onmouseleave = () => (tip.style.display = "none");
      kbd(el, () => el.onclick(), byId[id] && byId[id].name);
    });
    pinLabels();
  }
  const showTip = TA.tooltip(tip, byId);
  document.getElementById("q").oninput = e => {
    q = e.target.value.toLowerCase();
    try {
      setState({ q: q });
    } catch (e) {}
    render();
  };
  try {
    if (q) document.getElementById("q").value = q;
  } catch (e) {}
  document.getElementById("reset").onclick = () => {
    sel = null;
    q = "";
    document.getElementById("q").value = "";
    render();
  };
  // history selector (shared.js historyBar): single-select FILTER on #hist=,
  // rebuilt on each pick so the active pill state stays correct.
  function onPickHistory() {
    hist = getHistory();
    buildHistbar();
    render();
  }
  function buildHistbar() {
    const el = document.getElementById("histbar");
    if (el && window.historyBar) historyBar(el, onPickHistory);
  }
  buildHistbar();
  scroll.addEventListener("scroll", pinLabels);
  try {
    const _f = getState().card || "";
    if (_f && byId[_f]) {
      sel = _f; // local highlight: light this tool's ancestry & descendants
      showDetail(byId[_f]);
    }
  } catch (e) {}
  render();
})();
