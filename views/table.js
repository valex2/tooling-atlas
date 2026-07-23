(function () {
  const KC = window.KCOL,
    KINK = window.KINK,
    KGLY = window.KGLY; // single source of truth (shared.js)
  const KINDS = window.KINDS;
  const COLS = [
    ["name", "Tool"],
    ["kind", "Kind"],
    ["year", "Year"],
    ["place", "Place"],
    ["threads", "Threads"],
    ["links", "Links"],
    ["sig", "Significance"],
  ];
  let q = "",
    kind = null,
    selT = [],
    goal = "",
    decade = "",
    hist = "",
    sortK = "year",
    sortDir = 1;
  try {
    const st = getState();
    if (st.kind) kind = st.kind;
    selT = getThreads();
    if (st.q) q = st.q;
    if (st.goal) goal = st.goal;
    if (st.decade) decade = st.decade;
    if (st.hist && historyByKey(st.hist)) hist = st.hist;
  } catch (e) {}
  const allThreads = [...new Set(CARDS.flatMap(c => c.threads))].sort();
  // Thread <select> options: scoped to the chosen history's threads, or all 25 when All.
  function fillThreads() {
    const ts = hist ? threadsIn(hist) : allThreads;
    document.getElementById("thread").innerHTML =
      '<option value="">all threads</option>' + ts.map(t => `<option>${t}</option>`).join("");
  }
  fillThreads();
  // History = single-select FILTER (hist=), above the multi-select thread TRACE (thread=).
  // Picking a history scopes the thread <select> to its threads and drops out-of-scope traces.
  function pickHist(h) {
    hist = h || "";
    if (hist) selT = selT.filter(t => threadsIn(hist).includes(t));
    fillThreads();
    render();
  }
  const _histbar = document.getElementById("histbar");
  if (_histbar) historyBar(_histbar, pickHist);
  // faint "→" between the four Ms so they read as an order (see it → build a billion), not peers
  document.getElementById("kinds").innerHTML = KINDS.map(
    k => `<button class="chip" data-k="${k}" style="border-color:${KC[k]}">${k}</button>`,
  ).join('<span class="sep" aria-hidden="true">→</span>');
  function headRow() {
    // aria-sort carries the sort state for screen readers; the ▲/▼ glyph is visual only.
    // This blows away the <th>s, so remember which one had focus and put it back below —
    // otherwise sorting by keyboard drops focus to <body> after a single Enter.
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
        render();
      };
      th.onclick = sort;
      // Deliberately NOT kbd(): that sets role="button", which overrides the <th>'s
      // implicit columnheader role. aria-sort is only defined on columnheader, so it
      // would go inert, AND the table would lose its headers entirely — cells would
      // read "1957" instead of "Year, 1957". Focusability is added by hand instead so
      // the header keeps its semantics.
      th.setAttribute("tabindex", "0");
      // Deliberately NO aria-label: on a columnheader the accessible name is what AT
      // announces when entering EVERY cell in the column, so "Year — activate to sort"
      // would be read out on all 161 rows. The header text names it; aria-sort carries
      // the state; role + tabindex carry the affordance.
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
  function rows() {
    let r = CARDS.filter(c => {
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
    r.sort((a, b) => {
      let x = val(a, sortK),
        y = val(b, sortK);
      if (typeof x === "string") ((x = x.toLowerCase()), (y = ("" + y).toLowerCase()));
      return x < y ? -sortDir : x > y ? sortDir : 0;
    });
    return r;
  }
  function render() {
    headRow();
    const r = rows();
    document.getElementById("body").innerHTML = r
      .map(
        c => `<tr>
  <td><b>${c.name}</b><div class="thr">${c.person || ""}</div></td>
  <td><span class="kpill" style="background:${KC[c.kind]}1f;color:${KINK[c.kind]}"><span aria-hidden="true">${KGLY[c.kind]}</span> ${c.kind}</span></td>
  <td>${c.year}</td><td>${c.place || ""}</td>
  <td class="thr">${c.threads.join(", ")}</td>
  <td title="builds on ${c.bo.length}, enables ${c.en.length}">${c.bo.length}→${c.en.length}</td>
  <td class="sig">${c.sig || ""}</td></tr>`,
      )
      .join("");
    document.getElementById("count").innerHTML =
      `${r.length} of ${CARDS.length} tools` +
      selT
        .map(
          t =>
            ` · <span class="tpill" data-t="${encodeURIComponent(t)}" style="cursor:pointer;color:#33302b">${t} ✕</span>`,
        )
        .join("") +
      (decade ? ` · <span style="cursor:pointer;color:#33302b" id="cdec">${decade}s ✕</span>` : "");
    const cd = document.getElementById("cdec");
    if (cd)
      cd.onclick = () => {
        decade = "";
        render();
      };
    document.querySelectorAll("#count .tpill").forEach(
      el =>
        (el.onclick = () => {
          const t = decodeURIComponent(el.dataset.t);
          selT = selT.filter(x => x !== t);
          render();
        }),
    );
    document.querySelectorAll("#body tr").forEach((tr, ix) => {
      tr.style.cursor = "pointer";
      tr.onclick = () => showDetail(r[ix]);
      // NOT kbd(): it sets role="button", which makes the row's <td>s presentational,
      // so a screen reader would read only the card name and drop Year/Place/Threads —
      // the whole point of a data table. Focusable + Enter/Space by hand keeps the row a
      // row. Pixel-neutral (tabindex/keydown don't render), same pattern as the <th>s.
      tr.setAttribute("tabindex", "0");
      tr.addEventListener("keydown", e => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          showDetail(r[ix]);
        }
      });
    });
    try {
      setState({
        kind: kind || "",
        thread: selT.join(","),
        q: q || "",
        goal: goal || "",
        decade: decade || "",
      });
    } catch (e) {}
    document
      .querySelectorAll("#kinds .chip")
      .forEach(b => b.classList.toggle("on", b.dataset.k === kind));
  }
  document.getElementById("q").oninput = e => {
    q = e.target.value.toLowerCase();
    render();
  };
  document.getElementById("thread").onchange = e => {
    const v = e.target.value;
    if (v && !selT.includes(v)) selT.push(v);
    e.target.value = "";
    render();
  };
  document.getElementById("goal").onchange = e => {
    goal = e.target.value;
    render();
  };
  document.querySelectorAll("#kinds .chip").forEach(
    b =>
      (b.onclick = () => {
        kind = kind === b.dataset.k ? null : b.dataset.k;
        render();
      }),
  );
  document.getElementById("reset").onclick = () => {
    q = "";
    kind = null;
    selT = [];
    goal = "";
    decade = "";
    hist = "";
    try {
      setHistory("");
    } catch (e) {}
    fillThreads();
    if (_histbar) historyBar(_histbar, pickHist); // resync the pill state to All
    document.getElementById("q").value = "";
    document.getElementById("thread").value = "";
    document.getElementById("goal").value = "";
    render();
  };
  try {
    if (q) {
      document.getElementById("q").value = q;
    }
    if (goal) document.getElementById("goal").value = goal;
  } catch (e) {}
  render();
  // C1: honour a tool carried across views via the hash — open its panel and flash/scroll its row.
  try {
    const _f = getState().card || "";
    const _byId = TA.byId(CARDS);
    if (_f && _byId[_f]) {
      showDetail(_byId[_f]);
      const _ix = rows().findIndex(c => c.id === _f);
      if (_ix >= 0) {
        const _tr = document.querySelectorAll("#body tr")[_ix];
        if (_tr) {
          _tr.scrollIntoView({ block: "center" });
          _tr.classList.add("flash");
        }
      }
    }
  } catch (e) {}
})();
