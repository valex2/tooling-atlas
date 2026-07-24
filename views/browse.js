// browse.js — the unified Browse view. Three modes (cards / table / coverage), one visible at a
// time, driven by a segmented ARIA tablist. The three renderers are lifted near-verbatim from
// deck.html (Cards), table.js (Table), and dashboard.html (Coverage); only their getElementById
// calls are rewritten to the canonical ids in browse.html and their filter/state wiring is unified.
(function () {
  const DATA = window.CARDS || [];
  const KINDS = window.KINDS;
  const KCOL = window.KCOL, // bright hex fills (table pills, coverage bars)
    KINK = window.KINK,
    KGLY = window.KGLY;
  // Cards use CSS vars for stripes/tags exactly as deck.html did (kept byte-identical so Cards
  // mode matches the blessed Deck render).
  const KCV = {
    Measure: "var(--Measure)",
    Model: "var(--Model)",
    Make: "var(--Make)",
    Manufacture: "var(--Manufacture)",
  };
  const ERAS = window.ERAS;
  const allThreads = [...new Set(DATA.flatMap(c => c.threads))].sort();
  const byName = Object.fromEntries(DATA.map(c => [c.name, c]));

  const MODES = ["cards", "table", "coverage"];
  const SUBS = {
    cards: "Flip a card to read the aftermath — moment on the front, aftermath on the back.",
    table: "Sort and filter every tool in the atlas.",
    coverage: "What the atlas covers — and what it's still missing.",
  };
  const validMode = m => (MODES.indexOf(m) >= 0 ? m : null);

  // ---- shared state (all filters live in the hash; mode + sort are the source-of-truth vars) ----
  let mode = "cards";
  let q = "",
    kind = null,
    selT = [],
    goal = "",
    decade = "",
    hist = "",
    sortK = "year", // Table-only; kept as a module var (NOT hashed — no URL pollution)
    sortDir = 1;

  try {
    const st = getState();
    if (st.kind) kind = st.kind;
    selT = getThreads(); // carries #thread= in from Globe/Timeline/Tree
    if (st.q) q = st.q;
    if (st.goal) goal = st.goal;
    if (st.decade) decade = st.decade;
    if (st.hist && historyByKey(st.hist)) hist = st.hist; // carries #hist= in
    const m = validMode(st.mode);
    if (m) mode = m;
  } catch (e) {}

  // ---- DOM refs ----
  const modeseg = document.getElementById("modeseg");
  const tabs = [...modeseg.querySelectorAll('[role="tab"]')];
  const modesub = document.getElementById("modesub");
  const histbarEl = document.getElementById("histbar");
  const filtersEl = document.getElementById("filters");
  const covnoteEl = document.getElementById("covnote");
  const kindsEl = document.getElementById("kinds");
  const threadAddEl = document.getElementById("threadadd");
  const goalEl = document.getElementById("goal");
  const qEl = document.getElementById("q");
  const resetEl = document.getElementById("reset");
  const countEl = document.getElementById("count");
  const railEl = document.getElementById("rail");
  const modebody = document.getElementById("modebody");

  // ---- shared hash sync ----
  function syncHash() {
    try {
      setState({
        mode: mode,
        kind: kind || "",
        thread: selT.join(","),
        q: q || "",
        goal: goal || "",
        decade: decade || "",
        hist: hist || "",
      });
    } catch (e) {}
  }

  // ===================== SHARED CONTROLS =====================
  // Kind chips — table's ordered "→"-separated treatment, each carrying its KGLY glyph so kind is
  // legible without colour.
  kindsEl.innerHTML = KINDS.map(
    k =>
      `<button class="chip kchip" data-k="${k}" style="border-color:${KCOL[k]}"><span aria-hidden="true">${KGLY[k]}</span> ${k}</button>`,
  ).join('<span class="sep" aria-hidden="true">→</span>');
  kindsEl.querySelectorAll(".chip").forEach(b => {
    b.onclick = () => {
      kind = kind === b.dataset.k ? null : b.dataset.k;
      syncHash();
      renderActive();
    };
  });

  // Thread <select> options scoped to the chosen history's threads; already-selected omitted.
  function fillThreads() {
    const ts = hist ? threadsIn(hist) : allThreads;
    threadAddEl.innerHTML =
      '<option value="">add thread…</option>' +
      ts
        .filter(t => !selT.includes(t))
        .map(t => `<option>${t}</option>`)
        .join("");
  }
  threadAddEl.onchange = e => {
    const v = e.target.value;
    if (v && !selT.includes(v)) selT.push(v);
    e.target.value = "";
    syncHash();
    renderActive();
  };
  goalEl.onchange = e => {
    goal = e.target.value;
    syncHash();
    renderActive();
  };
  qEl.oninput = e => {
    q = e.target.value.toLowerCase();
    syncHash();
    renderActive();
  };

  // History = single-select FILTER (hist=), effective in ALL THREE modes. Picking a history scopes
  // the thread <select> to its threads and drops any out-of-scope trace.
  function pickHist(h) {
    hist = h || "";
    if (hist) selT = selT.filter(t => threadsIn(hist).includes(t));
    fillThreads();
    syncHash();
    renderActive();
  }
  historyBar(histbarEl, pickHist);

  function clearFilters() {
    q = "";
    kind = null;
    selT = [];
    goal = "";
    decade = "";
    hist = "";
    try {
      setHistory("");
    } catch (e) {}
    qEl.value = "";
    goalEl.value = "";
    fillThreads();
    historyBar(histbarEl, pickHist); // resync the pill state to All
  }
  resetEl.onclick = () => {
    clearFilters();
    try {
      const d = document.getElementById("appdetail");
      if (d) d.style.display = "none";
      setState({ card: "" });
    } catch (e) {}
    syncHash();
    renderActive();
  };

  // Count line + removable thread/decade pills (shared by Cards & Table).
  function renderCount(n, noun) {
    let html =
      noun === "cards"
        ? `${n} card${n != 1 ? "s" : ""}${selT.length === 1 ? " in this lineage, oldest first" : ""}`
        : `${n} of ${DATA.length} tools`;
    html += selT
      .map(t => ` · <span class="tpill" data-t="${encodeURIComponent(t)}">${t} ✕</span>`)
      .join("");
    if (decade) html += ` · <span class="tpill" id="cdec">${decade}s ✕</span>`;
    countEl.innerHTML = html;
    const cd = document.getElementById("cdec");
    if (cd)
      cd.onclick = () => {
        decade = "";
        syncHash();
        renderActive();
      };
    countEl.querySelectorAll(".tpill[data-t]").forEach(
      el =>
        (el.onclick = () => {
          const t = decodeURIComponent(el.dataset.t);
          selT = selT.filter(x => x !== t);
          syncHash();
          renderActive();
        }),
    );
  }

  // Shared working set: hist + kind + thread(multi) + goal + decade + search. Empty ⇒ the whole
  // corpus, so Cards with no filters is byte-identical to the old Deck.
  function filtered() {
    return DATA.filter(c => {
      if (hist && !historyMatch(c, hist)) return false;
      if (kind && c.kind !== kind) return false;
      if (selT.length && !threadMatch(c, selT)) return false;
      if (goal && c.goal !== goal) return false;
      if (decade && Math.floor(c.year / 10) * 10 !== +decade) return false;
      if (q) {
        const hay = (
          c.name +
          " " +
          (c.person || "") +
          " " +
          (c.place || "") +
          " " +
          c.threads.join(" ") +
          " " +
          (c.sig || "")
        ).toLowerCase();
        if (!hay.includes(q)) return false;
      }
      return true;
    });
  }

  // ===================== CARDS MODE (from deck.html) =====================
  function cssid(s) {
    return s.replace(/[^a-z0-9]/gi, "_");
  }
  // Front-header date: a clean derived decade so the grid reads uniformly. Display only.
  function decadeLabel(y) {
    return y ? Math.floor(y / 10) * 10 + "s" : "";
  }
  function cardHTML(c) {
    const others = c.threads.map(t => `<span class="xchip" data-t="${t}">${t}</span>`).join("");
    const marks = [];
    if (c.threads.length > 1) marks.push(c.threads.length + " threads");
    return `<div class="scene"><div class="card" id="card-${cssid(c.name)}">
  <div class="face front"><div class="stripe" style="background:${KCV[c.kind]}"></div>
    <div class="corner">${marks.join(" · ")}</div>
    <div class="pad"><div class="hd">${c.kind} · ${c.place} · ${decadeLabel(c.year)}</div>
      <div class="who">${c.name}</div><div class="maker">${c.person}</div><div class="tool">${c.tool}</div>
      <div class="txt">${c.front}</div></div>
    <div class="foot"><span class="tag" style="background:${KCV[c.kind]}1f;color:${KINK[c.kind]}"><span aria-hidden="true">${KGLY[c.kind]}</span> ${c.kind}</span>
      <span class="tag">${c.year}</span>
      <button class="flipbtn" type="button" style="margin-left:auto">Show aftermath ⟲</button></div>
  </div>
  <div class="face back" inert><div class="stripe" style="background:${KCV[c.kind]}"></div>
    <div class="pad"><div class="label">Aftermath</div><div class="txt">${c.back}</div>
      <div class="xlinks"><div class="h">Why it matters</div><div style="font-size:12.5px;line-height:1.5;margin-bottom:4px">${c.sig || ""}</div></div><div class="xlinks"><div class="h">Cross-links</div>${others}${location.protocol === "file:" ? '<div style="margin-top:8px"><a href="obsidian://open?vault=Obsidian%20Vault&file=' + encodeURIComponent("Tooling Card - " + c.name.replace(/\//g, "-")) + '" style="color:#9a6a3a;font-size:11px;text-decoration:none">Open note in Obsidian ↗</a></div>' : ""}</div></div>
    <div class="foot"><span class="tag">Goal ${c.goal}</span><span class="tag">${c.conf}</span>
      <button class="flipbtn" type="button" style="margin-left:auto">Show the moment ⟲</button></div>
  </div></div></div>`;
  }
  // Single entry point for flip state. `inert` (not aria-hidden) on the turned-away face removes it
  // from BOTH the a11y tree and the tab order — every back face carries a focusable obsidian:// link
  // and a.xcard wikilinks, so aria-hidden would be the aria-hidden-focus trap. The card is
  // deliberately NOT role=button (that is children-presentational and would collapse its prose and
  // links into a single label). The two .flipbtn buttons carry keyboard operation instead.
  function setFlip(el, on) {
    el.classList.toggle("flip", on);
    el.querySelector(".front").inert = on;
    el.querySelector(".back").inert = !on;
  }
  function rail() {
    if (selT.length !== 1) {
      railEl.className = "";
      railEl.innerHTML = "";
      return;
    }
    const t = selT[0];
    const ms = DATA.filter(c => c.threads.includes(t)).sort((a, b) => a.year - b.year);
    railEl.className = "rail";
    railEl.innerHTML =
      `<span class="rl">${t} lineage</span>` +
      ms
        .map(
          (c, i) =>
            `${i ? '<span class="arr">→</span>' : ""}<span class="node" data-go="${c.name}">${c.year} ${c.name}</span>`,
        )
        .join(" ");
    railEl.querySelectorAll("[data-go]").forEach(n => (n.onclick = () => scrollTo2(n.dataset.go)));
  }
  function scrollTo2(name, flip) {
    const el = document.getElementById("card-" + cssid(name));
    if (!el) return;
    el.scrollIntoView({ behavior: "smooth", block: "center" });
    if (flip) setFlip(el, true);
    el.parentElement.style.outline = "2px solid var(--accent)";
    setTimeout(() => (el.parentElement.style.outline = ""), 1600);
  }
  function renderCards() {
    const v = filtered().sort((a, b) => a.year - b.year);
    rail();
    renderCount(v.length, "cards");
    modebody.innerHTML =
      '<div class="grid" id="grid"></div><p class="hint">Generated from the live card notes. Curator notes are intentionally omitted — the deck shows only what a reader sees.</p>';
    document.getElementById("grid").innerHTML = v.map(cardHTML).join("");
    modebody.querySelectorAll(".card").forEach(el => {
      el.onclick = e => {
        if (e.target.closest("a")) return;
        const tc = e.target.closest(".xchip");
        if (tc) {
          e.stopPropagation();
          selT = [tc.dataset.t];
          kind = null;
          hist = "";
          try {
            setHistory("");
          } catch (x) {}
          fillThreads();
          historyBar(histbarEl, pickHist);
          syncHash();
          renderActive();
          return;
        }
        setFlip(el, !el.classList.contains("flip"));
      };
      // No kbd() on the card: it would set role="button" and its blanket preventDefault on Enter
      // would also stop Enter following the a.xcard wikilinks. The .flipbtn buttons carry keyboard
      // operation properly instead.
      el.querySelectorAll(".flipbtn").forEach(
        b =>
          (b.onclick = e => {
            e.stopPropagation();
            setFlip(el, !el.classList.contains("flip"));
            const vis = el.querySelector(
              (el.classList.contains("flip") ? ".back" : ".front") + " .flipbtn",
            );
            if (vis) vis.focus();
          }),
      );
    });
  }

  // ===================== TABLE MODE (from table.js) =====================
  const COLS = [
    ["name", "Tool"],
    ["kind", "Kind"],
    ["year", "Year"],
    ["place", "Place"],
    ["threads", "Threads"],
    ["links", "Links"],
    ["sig", "Significance"],
  ];
  function headRow() {
    // aria-sort carries the sort state for screen readers; the ▲/▼ glyph is visual only. Rebuilding
    // the <th>s drops focus, so remember which one had it and restore below.
    const act = document.activeElement,
      prev = act && act.closest ? act.closest("#head th") : null,
      refocusK = prev && prev.dataset.k;
    document.getElementById("head").innerHTML = COLS.map(
      c =>
        `<th data-k="${c[0]}" aria-sort="${sortK === c[0] ? (sortDir > 0 ? "ascending" : "descending") : "none"}">${c[1]}${sortK === c[0] ? (sortDir > 0 ? " ▲" : " ▼") : ""}</th>`,
    ).join("");
    document.querySelectorAll("#head th").forEach(th => {
      const sort = () => {
        const k = th.dataset.k;
        if (sortK === k) sortDir *= -1;
        else {
          sortK = k;
          sortDir = 1;
        }
        renderTable();
      };
      th.onclick = sort;
      // Deliberately NOT kbd(): role="button" would override the <th>'s implicit columnheader role,
      // taking aria-sort inert and stripping the table of headers. Focusability is added by hand so
      // the header keeps its semantics.
      th.setAttribute("tabindex", "0");
      th.addEventListener("keydown", e => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          sort();
        }
      });
    });
    if (refocusK) document.querySelector(`#head th[data-k="${refocusK}"]`).focus();
  }
  function val(c, k) {
    return k === "links"
      ? c.bo.length + c.en.length
      : k === "threads"
        ? c.threads.join(", ")
        : c[k];
  }
  function tableRows() {
    const r = filtered();
    r.sort((a, b) => {
      let x = val(a, sortK),
        y = val(b, sortK);
      if (typeof x === "string") ((x = x.toLowerCase()), (y = ("" + y).toLowerCase()));
      return x < y ? -sortDir : x > y ? sortDir : 0;
    });
    return r;
  }
  function renderTable() {
    if (!document.getElementById("head"))
      modebody.innerHTML =
        '<table id="tbl"><thead><tr id="head"></tr></thead><tbody id="body"></tbody></table>';
    headRow();
    const r = tableRows();
    document.getElementById("body").innerHTML = r
      .map(
        c => `<tr>
  <td><b>${c.name}</b><div class="thr">${c.person || ""}</div></td>
  <td><span class="kpill" style="background:${KCOL[c.kind]}1f;color:${KINK[c.kind]}"><span aria-hidden="true">${KGLY[c.kind]}</span> ${c.kind}</span></td>
  <td>${c.year}</td><td>${c.place || ""}</td>
  <td class="thr">${c.threads.join(", ")}</td>
  <td title="builds on ${c.bo.length}, enables ${c.en.length}">${c.bo.length}→${c.en.length}</td>
  <td class="sig">${c.sig || ""}</td></tr>`,
      )
      .join("");
    renderCount(r.length, "tools");
    document.querySelectorAll("#body tr").forEach((tr, ix) => {
      tr.style.cursor = "pointer";
      tr.onclick = () => showDetail(r[ix]);
      // NOT kbd(): role="button" makes the row's <td>s presentational, so a screen reader would read
      // only the tool name and drop Year/Place/Threads. Focusable + Enter/Space by hand keeps the
      // row a row.
      tr.setAttribute("tabindex", "0");
      tr.addEventListener("keydown", e => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          showDetail(r[ix]);
        }
      });
    });
  }

  // ===================== COVERAGE MODE (from dashboard.html) =====================
  function bars(el, data, max, colorfn, linkfn) {
    el.innerHTML = data
      .map(d => {
        const inner = `<span class="lab">${d.k}</span><div class="bar" style="width:${Math.max(2, (d.v / max) * 260)}px;background:${colorfn(d.k)}"></div><span class="n">${d.v}</span>`;
        return linkfn
          ? `<a class="row" href="${linkfn(d.k)}" style="text-decoration:none;color:inherit">${inner}</a>`
          : `<div class="row">${inner}</div>`;
      })
      .join("");
  }
  function segBar(pk, total, max, wpx) {
    const w = Math.max(2, (total / max) * wpx);
    const segs = KINDS.filter(k => pk[k])
      .map(
        k => `<div title="${k}: ${pk[k]}" style="flex:${pk[k]} 0 0;background:${KCOL[k]}"></div>`,
      )
      .join("");
    return `<div class="bar" style="width:${w}px;display:flex;overflow:hidden">${segs}</div>`;
  }
  function perKind(list) {
    const o = {};
    list.forEach(c => {
      o[c.kind] = (o[c.kind] || 0) + 1;
    });
    return o;
  }
  function renderCoverage() {
    modebody.innerHTML =
      '<div id="cov"><p id="covsub"></p>' +
      '<div class="legend">' +
      KINDS.map(
        k => `<span><span class="sw" style="background:${KCOL[k]}"></span>${k}</span>`,
      ).join('<span aria-hidden="true" class="lsep">→</span>') +
      "</div>" +
      '<div class="grid">' +
      '<div class="card"><h2>By kind</h2><div id="cov-kind"></div></div>' +
      '<div class="card"><h2>By decade</h2><div id="cov-decade"></div></div>' +
      '<div class="card full"><h2>Threads by size</h2><div id="cov-thread"></div></div>' +
      '<div class="card full"><h2>Coverage — era × kind <span style="font-weight:400;color:var(--mut)">(red = gap, nothing written yet)</span></h2><div id="cov-matrix"></div></div>' +
      "</div></div>";
    // Coverage is scoped by History ONLY (the per-tool bar is hidden). Letting kind/q/thread filter
    // it would empty columns and turn every red gap cell into "nothing matching your filter" — a
    // different, misleading claim in the one panel whose whole job is "what is MISSING".
    const scope = hist ? DATA.filter(c => historyMatch(c, hist)) : DATA;
    const threads = [...new Set(scope.flatMap(c => c.threads))];
    document.getElementById("covsub").textContent =
      scope.length +
      " tools · " +
      threads.length +
      " threads · " +
      new Set(scope.map(c => c.country).filter(Boolean)).size +
      " countries" +
      (hist ? " · " + historyByKey(hist).label : "");
    // by kind
    const kc = KINDS.map(k => ({ k, v: scope.filter(c => c.kind === k).length }));
    bars(
      document.getElementById("cov-kind"),
      kc,
      Math.max(1, ...kc.map(d => d.v)),
      k => KCOL[k] || "#999",
      k => "#mode=table&kind=" + encodeURIComponent(k),
    );
    // by decade (stacked by kind)
    const decCards = {};
    scope.forEach(c => {
      if (!c.year) return;
      const d = Math.floor(c.year / 10) * 10;
      (decCards[d] = decCards[d] || []).push(c);
    });
    const decs = Object.keys(decCards)
      .map(Number)
      .sort((a, b) => a - b);
    const dmax = Math.max(1, ...decs.map(d => decCards[d].length));
    document.getElementById("cov-decade").innerHTML = decs
      .map(d => {
        const n = decCards[d].length;
        return `<a class="row" href="#mode=table&decade=${d}" style="text-decoration:none;color:inherit"><span class="lab" style="width:46px">${d}s</span>${segBar(perKind(decCards[d]), n, dmax, 240)}<span class="n">${n}</span></a>`;
      })
      .join("");
    // threads by size (stacked by kind), grouped under the histories
    const groups = hist ? [historyByKey(hist)] : window.HISTORIES;
    const tmax = Math.max(1, ...threads.map(t => scope.filter(c => c.threads.includes(t)).length));
    document.getElementById("cov-thread").innerHTML = groups
      .map(g => {
        const rows = g.threads
          .map(t => ({ k: t, cards: scope.filter(c => c.threads.includes(t)) }))
          .sort((a, b) => b.cards.length - a.cards.length);
        const head = `<div class="hgroup"><span class="hgl">${g.label}</span> <span class="hgt">${g.tag}</span></div>`;
        return (
          head +
          rows
            .map(d => {
              const n = d.cards.length,
                e = encodeURIComponent(d.k);
              const links = `<span class="vlinks"><a href="map.html#thread=${e}" title="Trace on globe">⊙ globe</a><a href="#mode=table&thread=${e}" title="List in the table">▦ table</a></span>`;
              return `<div class="row"><a href="#mode=table&thread=${e}" class="lab" style="text-decoration:none;color:var(--mut)">${d.k}</a>${segBar(perKind(d.cards), n, tmax, 260)}<span class="n">${n}</span>${links}</div>`;
            })
            .join("")
        );
      })
      .join("");
    // era x kind matrix
    let h =
      "<table><tr><th>Era</th>" +
      KINDS.map(
        k =>
          `<th><a href="#mode=table&kind=${encodeURIComponent(k)}" style="color:${KCOL[k]};text-decoration:none">${k}</a></th>`,
      ).join("") +
      "<th>Σ</th></tr>";
    for (const [name, a, b] of ERAS) {
      let rsum = 0;
      let cells = "";
      for (const k of KINDS) {
        const n = scope.filter(c => c.kind === k && c.year >= a && c.year < b).length;
        rsum += n;
        cells += `<td class="${n === 0 ? "gap" : ""}">${n || "·"}</td>`;
      }
      h += `<tr><td class="era">${name} <span style="color:#bbb">${a}–${b - 1}</span></td>${cells}<td>${rsum}</td></tr>`;
    }
    h += "</table>";
    document.getElementById("cov-matrix").innerHTML = h;
  }

  // Coverage's drill links are bare in-page hashes — `#mode=table&kind=…` / `&decade=…` /
  // `&thread=…` — so a click just changes the hash and the hashchange handler below re-hydrates
  // the filters FROM that hash. Because the hash carries only the one filter, Table lands clean:
  // no stale sibling filter accumulates, and the URL stays shareable, with no interceptor needed.
  // (The globe vlink stays a real cross-view link to map.html.)

  // ===================== MODE DISPATCH =====================
  function renderActive() {
    fillThreads();
    kindsEl.querySelectorAll(".chip").forEach(b => b.classList.toggle("on", b.dataset.k === kind));
    if (mode === "cards") renderCards();
    else if (mode === "table") renderTable();
    else renderCoverage();
  }
  function setMode(m) {
    mode = m;
    tabs.forEach(t => {
      const on = t.dataset.mode === m;
      t.setAttribute("aria-selected", on ? "true" : "false");
      t.tabIndex = on ? 0 : -1;
    });
    modebody.setAttribute("aria-labelledby", "tab-" + m);
    modebody.className = "m-" + m;
    modesub.textContent = SUBS[m];
    const cov = m === "coverage";
    filtersEl.hidden = cov;
    covnoteEl.hidden = !cov;
    if (cov) {
      // Coverage does not use the per-tool filter bar; clear its stray pills so the count line is
      // not showing thread/decade pills that no longer act on the panel.
      railEl.className = "";
      railEl.innerHTML = "";
      countEl.innerHTML = "";
    }
    syncHash();
    renderActive();
  }

  tabs.forEach(t => {
    t.addEventListener("click", () => setMode(t.dataset.mode));
    t.addEventListener("keydown", e => {
      const i = tabs.indexOf(t);
      let j = -1;
      if (e.key === "ArrowRight" || e.key === "ArrowDown") j = (i + 1) % tabs.length;
      else if (e.key === "ArrowLeft" || e.key === "ArrowUp")
        j = (i - 1 + tabs.length) % tabs.length;
      else if (e.key === "Home") j = 0;
      else if (e.key === "End") j = tabs.length - 1;
      else if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        setMode(t.dataset.mode);
        return;
      } else return;
      e.preventDefault();
      setMode(tabs[j].dataset.mode);
      tabs[j].focus();
    });
  });

  // seed persistent control values, then render the initial mode
  fillThreads();
  if (q) qEl.value = q;
  if (goal) goalEl.value = goal;
  setMode(mode);

  // ---- #card= arrival (mode-specific) ----
  // Cards: scroll + flip IN PLACE (Cards does NOT open the #appdetail panel). Table: open the panel
  // + flash the row. Coverage: open the panel.
  function fh(clear) {
    const m = (location.hash || "").match(/card=([^&]+)/);
    if (!m) return;
    const key = decodeURIComponent(m[1]);
    const c = (window.__byId && window.__byId[key]) || byName[key];
    if (!c) return;
    const nm = c.name;
    // clear=true (an in-page xcard click): if the target card is filtered out of the current view,
    // drop the filters first so the link never lands on nothing. On initial load (clear=false) any
    // seeded #thread=/#hist= is kept.
    if (clear && !document.getElementById("card-" + cssid(nm))) {
      clearFilters();
      syncHash();
      renderActive();
    }
    setTimeout(() => {
      try {
        scrollTo2(nm, true);
      } catch (x) {}
    }, 80);
  }
  (function initCard() {
    try {
      const f = getState().card || "";
      if (!f) return;
      if (mode === "cards") {
        fh(false);
        return;
      }
      const c = (window.__byId && window.__byId[f]) || byName[f];
      if (!c) return;
      showDetail(c);
      if (mode === "table") {
        const ix = tableRows().findIndex(x => x.id === c.id);
        if (ix >= 0) {
          const tr = document.querySelectorAll("#body tr")[ix];
          if (tr) {
            tr.scrollIntoView({ block: "center" });
            tr.classList.add("flash");
          }
        }
      }
    } catch (e) {}
  })();

  // ---- hashchange: keep the in-memory mode var (the source of truth) and the DOM in sync ----
  // Card wikilinks are bare href="#card=Name" and REPLACE the whole hash (dropping #mode= and every
  // filter). showDetail uses replaceState (no hashchange), so this only fires on a real navigation:
  // an xcard click, a manual URL edit, or Back/Forward. In each case re-stamp #mode= from the
  // in-memory var so opening a card never desyncs the tab, and resolve any card= in place.
  window.addEventListener("hashchange", function () {
    const st = getState();
    const m = validMode(st.mode);
    if (!m) {
      // hash was wiped (xcard): restamp mode + surviving state; in Cards, resolve the card in place.
      if (mode === "cards") fh(true);
      syncHash();
      return;
    }
    if (m !== mode) {
      // external / Back-Forward mode change: re-hydrate the filters from the hash, then switch.
      if (st.kind) kind = st.kind;
      else kind = null;
      selT = getThreads();
      q = st.q || "";
      goal = st.goal || "";
      decade = st.decade || "";
      hist = st.hist && historyByKey(st.hist) ? st.hist : "";
      qEl.value = q;
      goalEl.value = goal;
      setMode(m);
      return;
    }
    // same mode, hash changed (a bare card= change): resolve it in Cards.
    if (mode === "cards") fh(true);
  });

  // Cross-view "Open as card" (map/tree/relay → this view, incl. the single-file bundle): switch to
  // Cards first, then scroll + flip the target.
  window.addEventListener("message", function (e) {
    if (e.data && e.data.type === "focuscard") {
      if (mode !== "cards") setMode("cards");
      const c = byName[e.data.id] || (window.__byId && window.__byId[e.data.id]);
      try {
        scrollTo2(c ? c.name : e.data.id, true);
      } catch (x) {}
    }
  });
})();
