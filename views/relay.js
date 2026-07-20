(function () {
  const KC = window.KCOL,
    KINK = window.KINK,
    KGLY = window.KGLY,
    KINDS = window.KINDS; // single source of truth (shared.js)
  const CARDS = window.CARDS || [];
  const byId = TA.byId(CARDS);

  // ── panels ───────────────────────────────────────────────────────────────
  // Six flagship panels above the fold, then every remaining thread in an index
  // strip below. A panel is a label + a set of threads: usually one, but the
  // machine-tools lineage is a continuous relay (Britain's tooling → the American
  // system of manufactures → mass production), so its two threads share one panel.
  const FLAGSHIP = [
    ["Precision Optics", ["Precision Optics"]],
    ["Machine Tools / Production Systems", ["Machine Tools", "Production Systems"]],
    ["Chip Lithography", ["Chip Lithography"]],
    ["Reading & Writing DNA", ["Reading & Writing DNA"]],
    ["Therapeutics", ["Therapeutics"]],
    ["The Network", ["The Network"]],
  ];
  const flagThreads = new Set(FLAGSHIP.flatMap(f => f[1]));
  const allThreads = [...new Set(CARDS.flatMap(c => c.threads || []))];
  const tmin = {};
  CARDS.forEach(c =>
    (c.threads || []).forEach(t => (tmin[t] = Math.min(tmin[t] ?? 9999, c.year || 9999))),
  );
  const indexThreads = allThreads
    .filter(t => !flagThreads.has(t))
    .sort((a, b) => tmin[a] - tmin[b]);

  // cards of a panel = union of its threads, deduped, sorted by year then id
  function panelCards(threads) {
    const seen = {};
    for (const c of CARDS)
      if (c.year && (c.threads || []).some(t => threads.includes(t))) seen[c.id] = c;
    return Object.values(seen).sort((a, b) => a.year - b.year || (a.id < b.id ? -1 : 1));
  }

  // Country runs at the COUNTRY level — the granularity Report 1's argument lives at
  // (optics Delft->Jena->Japan->Netherlands; machine tools Britain->America->Japan).
  // NOT regionGroup: that is the Timeline's swimlane, which folds Germany, Finland,
  // Switzerland etc. into one continental-Europe band — so Finland 1974 (the caption's
  // own example of the proxy misleading) could not even appear as Finland. `country`
  // already keeps the US as one polity (no Northeast/Silicon-Valley split at this field),
  // so it avoids the intra-US false handoffs without merging distinct European nations.
  const shortCtry = c => (c.country === "United States of America" ? "USA" : c.country || "—");
  const groupOf = shortCtry;
  function runsOf(cs) {
    const rr = [];
    for (const c of cs) {
      const g = groupOf(c);
      const last = rr[rr.length - 1];
      if (last && last.g === g) {
        last.n++;
        last.end = c.year;
        last.cards.push(c);
      } else rr.push({ g, n: 1, start: c.year, end: c.year, cards: [c] });
    }
    return rr;
  }

  // ── country colour ───────────────────────────────────────────────────────
  // Colour is a SECONDARY channel here (every proxy cell is labelled), but a stable
  // country→hue map makes handoffs and round-trips (a country returning) read at a
  // glance. Ranked by corpus frequency; the top four take the validated categorical
  // slots (blue/green/magenta/yellow — pass all-pairs CVD + normal-vision on the cream
  // surface #fcfbf9, see dataviz validator), the long tail folds to neutral. Never a
  // hardcoded country name: the ranking is derived from the data.
  const CTRY_PAL = ["#2a78d6", "#008300", "#e87ba4", "#eda100"];
  const CTRY_NEUTRAL = "#9b968c";
  const ctryCount = {};
  CARDS.forEach(c => {
    const g = groupOf(c);
    if (g && g !== "—") ctryCount[g] = (ctryCount[g] || 0) + 1;
  });
  const ctryRank = Object.keys(ctryCount).sort(
    (a, b) => ctryCount[b] - ctryCount[a] || (a < b ? -1 : 1),
  );
  const ctryColor = {};
  ctryRank.forEach((g, i) => (ctryColor[g] = i < CTRY_PAL.length ? CTRY_PAL[i] : CTRY_NEUTRAL));
  const colorOf = g => ctryColor[g] || CTRY_NEUTRAL;

  // ── time axis: LINEAR with a visible break at 1700 ───────────────────────
  // NOT the Timeline's log scale — that renders an 88-year hold starting before ~1775
  // narrower than a modern 20-year one, inverting the exact comparison this view exists
  // to make. ta.js's timeScale has a linear mode but only as ONE monotone segment; a
  // broken axis is two of them composed (pre/post 1700), NOT a fourth forked scale.
  const YMIN = Math.min(...CARDS.map(c => c.year).filter(Boolean));
  const BREAK = 1700,
    YMAX = 2030;
  const LABW = 150,
    PREW = 62,
    GAP = 20,
    MAINW = 880,
    RPAD = 28;
  const AX0 = LABW;
  const preXs = TA.timeScale({ mode: "linear", minY: YMIN, maxY: BREAK, x0: AX0, width: PREW }).xs;
  const postXs = TA.timeScale({
    mode: "linear",
    minY: BREAK,
    maxY: YMAX,
    x0: AX0 + PREW + GAP,
    width: MAINW,
  }).xs;
  const xOf = y => (y <= BREAK ? preXs(y) : postXs(y));
  const AXW = AX0 + PREW + GAP + MAINW;
  const FULLW = AXW + RPAD;
  const AXH = 44; // top band: year labels + break marker

  const esc = TA.esc;
  const enc = encodeURIComponent;
  const tw = (s, fs) => String(s).length * fs * 0.56; // text-width estimate (deterministic)

  // ── build one panel; returns { html, height } laid out from y ─────────────
  function panel(label, threads, y, D) {
    const cs = panelCards(threads);
    const rr = runsOf(cs);
    const single = rr.filter(r => r.n === 1).length;
    // evidence rug: one kind-glyph tick per card, collision-stacked into rows
    const rowEnd = [];
    const ticks = cs.map(c => {
      const x = xOf(c.year);
      let r = -1;
      for (let i = 0; i < rowEnd.length; i++)
        if (x - rowEnd[i] >= D.minDx) {
          r = i;
          break;
        }
      if (r < 0) {
        r = rowEnd.length;
        rowEnd.push(0);
      }
      rowEnd[r] = x;
      return { c, x, r };
    });
    const nrows = Math.max(1, rowEnd.length);
    const rugTop = y;
    const rugH = nrows * D.rugRow;
    const proxyTop = rugTop + rugH + 5;
    const proxyBot = proxyTop + D.proxyH;
    let h = "";
    // left label (spans the panel)
    h += `<text x="8" y="${rugTop + D.lab - 2}" font-size="${D.lab}" font-weight="600" fill="#1c1c1c">${esc(label)}</text>`;
    h += `<text x="8" y="${rugTop + D.lab + 11}" font-size="9.5" fill="#8a857c">${cs.length} cards · ${rr.length} runs${single ? " · " + single + " single-card" : ""}</text>`;
    // rug baseline
    h += `<line x1="${AX0}" y1="${proxyTop - 3}" x2="${AXW}" y2="${proxyTop - 3}" stroke="rgba(0,0,0,.10)" stroke-width=".5"/>`;
    // rug ticks (clickable → showDetail)
    for (const t of ticks) {
      const cy = rugTop + t.r * D.rugRow + D.rugRow - 3;
      h +=
        `<g data-id="${enc(t.c.id)}" tabindex="0" role="button" aria-label="${esc(t.c.name)} — ${esc(t.c.kind)}, ${esc(t.c.place || "")}, ${t.c.year}">` +
        `<circle cx="${t.x.toFixed(1)}" cy="${cy}" r="6" fill="transparent"/>` +
        `<text x="${t.x.toFixed(1)}" y="${cy + 3.5}" text-anchor="middle" font-size="${D.gly}" fill="${KINK[t.c.kind]}">${KGLY[t.c.kind]}</text>` +
        `</g>`;
    }
    // proxy strip: one abutting cell per country-run
    rr.forEach((r, i) => {
      const x1 = xOf(r.start);
      const x2 = i < rr.length - 1 ? xOf(rr[i + 1].start) : Math.max(xOf(r.end), x1) + 10;
      const w = Math.max(x2 - x1, 5);
      const col = colorOf(r.g);
      const yrs = r.start === r.end ? "" + r.start : r.start + "–" + r.end;
      const xf = x1.toFixed(1),
        wf = w.toFixed(1);
      h += `<g><title>${esc(r.g)} — ${yrs} · ${r.n} card${r.n > 1 ? "s" : ""}${r.n === 1 ? " (a lead on a single card)" : ""}</title>`;
      h += `<rect x="${xf}" y="${proxyTop}" width="${wf}" height="${D.proxyH}" fill="${col}" fill-opacity="0.20" stroke="${col}" stroke-opacity="0.85" stroke-width="0.75"/>`;
      h += `<rect x="${xf}" y="${proxyTop}" width="${wf}" height="2.5" fill="${col}" fill-opacity="0.9"/>`;
      if (r.n === 1)
        h += `<rect x="${xf}" y="${proxyTop}" width="${wf}" height="${D.proxyH}" fill="url(#rl-hatch)"/>`;
      if (w >= tw(r.g, 9) + 6)
        h += `<text x="${(x1 + w / 2).toFixed(1)}" y="${proxyTop + D.proxyH / 2 + 3}" text-anchor="middle" font-size="9" fill="#2a2620">${esc(r.g)}</text>`;
      h += `</g>`;
    });
    return { html: h, height: proxyBot - rugTop + D.gap };
  }

  // ── assemble ─────────────────────────────────────────────────────────────
  const FLAG_D = { rugRow: 15, gly: 12, proxyH: 20, lab: 12, minDx: 11, gap: 20 };
  const IDX_D = { rugRow: 12, gly: 10, proxyH: 15, lab: 10.5, minDx: 9, gap: 14 };

  let body = "";
  let y = AXH + 8;
  for (const [label, threads] of FLAGSHIP) {
    const p = panel(label, threads, y, FLAG_D);
    body += p.html;
    y += p.height;
  }
  // divider into the index strip
  const divY = y + 2;
  body += `<line x1="8" y1="${divY}" x2="${AXW}" y2="${divY}" stroke="rgba(0,0,0,.16)" stroke-width="1"/>`;
  body += `<text x="8" y="${divY + 15}" font-size="11" font-weight="600" fill="#6f6f6f">The other ${indexThreads.length} threads</text>`;
  y = divY + 26;
  for (const t of indexThreads) {
    const p = panel(t, [t], y, IDX_D);
    body += p.html;
    y += p.height;
  }
  const totalH = y + 6;

  // top axis + full-height gridlines (drawn first, behind the panels)
  let axis = "";
  axis += `<defs><pattern id="rl-hatch" width="6" height="6" patternUnits="userSpaceOnUse" patternTransform="rotate(45)"><line x1="0" y1="0" x2="0" y2="6" stroke="rgba(28,28,28,0.30)" stroke-width="1.4"/></pattern></defs>`;
  // pre-1700 compressed band
  axis += `<rect x="${AX0}" y="${AXH - 6}" width="${PREW}" height="${totalH - AXH + 6}" fill="rgba(0,0,0,.028)"/>`;
  axis += `<text x="${AX0 + PREW / 2}" y="${AXH - 26}" text-anchor="middle" font-size="9" fill="#8a857c">pre-1700</text>`;
  axis += `<text x="${AX0 + PREW / 2}" y="${AXH - 15}" text-anchor="middle" font-size="8" fill="#b0a99c">${YMIN}→ (compressed)</text>`;
  // axis break marker in the gap
  const bx = AX0 + PREW + GAP / 2;
  for (const off of [-3, 3]) {
    axis += `<path d="M${bx + off - 4} ${AXH - 8} l8 -6 M${bx + off - 4} ${totalH} l8 -6" stroke="#fcfbf9" stroke-width="5"/>`;
    axis += `<path d="M${bx + off - 4} ${AXH - 8} l8 -6" stroke="#c7bfb0" stroke-width="1.3"/>`;
  }
  axis += `<rect x="${AX0 + PREW}" y="${AXH - 6}" width="${GAP}" height="${totalH - AXH + 6}" fill="#fcfbf9"/>`;
  // post-1700 major gridlines + labels (1700 itself is marked by the break glyph +
  // the pre-1700 band, so labelling it again only collides with the band caption)
  const majors = [1750, 1800, 1850, 1900, 1950, 2000];
  for (const yr of majors) {
    const gx = xOf(yr);
    axis += `<line x1="${gx.toFixed(1)}" y1="${AXH - 6}" x2="${gx.toFixed(1)}" y2="${totalH}" stroke="rgba(0,0,0,.06)" stroke-width="1"/>`;
    axis += `<text x="${gx.toFixed(1)}" y="${AXH - 15}" text-anchor="middle" font-size="10" font-weight="600" fill="#8f8f8f">${yr}</text>`;
  }
  // redraw the break gap over the 1700 gridline so it reads as a clean break
  axis += `<rect x="${AX0 + PREW}" y="${AXH - 6}" width="${GAP}" height="${totalH - AXH + 6}" fill="#fcfbf9"/>`;
  for (const off of [-3, 3]) {
    axis += `<path d="M${bx + off - 4} ${AXH - 8} l8 -6" stroke="#c7bfb0" stroke-width="1.3"/>`;
  }

  const svg = document.getElementById("chart");
  svg.setAttribute("width", FULLW);
  svg.setAttribute("height", totalH);
  svg.setAttribute("viewBox", "0 0 " + FULLW + " " + totalH);
  svg.innerHTML = axis + body;

  // ── legends ──────────────────────────────────────────────────────────────
  document.getElementById("kindleg").innerHTML =
    "<span>Corpus:</span>" +
    KINDS.map(
      k => `<span><span class="gly" style="color:${KINK[k]}">${KGLY[k]}</span> ${k}</span>`,
    ).join("");
  const topN = ctryRank.slice(0, CTRY_PAL.length);
  const tail = ctryRank.length - topN.length;
  document.getElementById("ctryleg").innerHTML =
    "<span>Proxy lead:</span>" +
    topN
      .map(g => `<span><span class="sw" style="background:${colorOf(g)}"></span>${esc(g)}</span>`)
      .join("") +
    (tail
      ? `<span><span class="sw" style="background:${CTRY_NEUTRAL}"></span>+${tail} more (grey)</span>`
      : "");

  // ── coda: run-length distribution + round-trips, computed live ───────────
  function stats(cs) {
    const rr = runsOf(cs);
    const seq = rr.map(r => r.g);
    let rt = 0;
    for (let i = 2; i < seq.length; i++) if (seq[i] === seq[i - 2]) rt++; // X→Y→X
    const dist = {};
    rr.forEach(r => (dist[r.n] = (dist[r.n] || 0) + 1));
    return {
      cards: cs.length,
      runs: rr.length,
      single: rr.filter(r => r.n === 1).length,
      rt,
      dist,
    };
  }
  const rows = allThreads
    .map(t => [t, stats(panelCards([t]))])
    .sort((a, b) => b[1].single - a[1].single || a[0].localeCompare(b[0]));
  const tot = rows.reduce(
    (a, [, s]) => ({ runs: a.runs + s.runs, single: a.single + s.single, rt: a.rt + s.rt }),
    { runs: 0, single: 0, rt: 0 },
  );
  const distStr = d =>
    Object.keys(d)
      .map(Number)
      .sort((a, b) => a - b)
      .map(n => `${d[n]}×${n}`)
      .join(", ");

  document.getElementById("reliab").innerHTML =
    `Proxy reliability, computed live over all ${allThreads.length} threads: ` +
    `<b>${tot.single} of ${tot.runs}</b> country-runs rest on a single card; <b>${tot.rt}</b> round-trip excursions (X→Y→X). ` +
    `<span style="color:#8a857c">Method below.</span>`;

  document.getElementById("coda").innerHTML =
    `<h2>Coda — how reliable is the proxy? (computed live from the ${CARDS.length} cards)</h2>` +
    `<div class="formula">Sort a thread's cards by year; collapse consecutive cards that share a country (the card's <code>country</code>, with the US as one) into <b>runs</b>. ` +
    `A <b>run length</b> is the card count of a run. A <b>single-card run</b> (length 1) is the proxy handing a country the lead on one card. ` +
    `A <b>round-trip</b> is a run <code>r[i]</code> whose country equals <code>r[i−2]</code>'s but differs from <code>r[i−1]</code>'s — a country the trace left and returned to: ` +
    `<code>count = #{ i≥2 : country(r[i]) = country(r[i−2]) }</code>. ` +
    `Totals: <b>${tot.single} of ${tot.runs}</b> runs single-card, <b>${tot.rt}</b> round-trips. ` +
    `<span style="color:#8a857c">(An earlier draft circulated an irreproducible &ldquo;44 of 90&rdquo;; this is the live figure and its definition.)</span></div>` +
    `<table><thead><tr><th>Thread</th><th>Cards</th><th>Runs</th><th>Single-card</th><th>Round-trips</th><th style="text-align:left;padding-left:16px">Run-length distribution</th></tr></thead><tbody>` +
    rows
      .map(
        ([t, s]) =>
          `<tr><td>${esc(t)}</td><td>${s.cards}</td><td>${s.runs}</td><td>${s.single}</td><td>${s.rt}</td><td class="dist" style="text-align:left;padding-left:16px">${distStr(s.dist)}</td></tr>`,
      )
      .join("") +
    `<tr class="tot"><td>All ${allThreads.length} threads</td><td></td><td>${tot.runs}</td><td>${tot.single}</td><td>${tot.rt}</td><td style="text-align:left;padding-left:16px"></td></tr>` +
    `</tbody></table>`;

  // ── interaction: delegated on the SVG ────────────────────────────────────
  const tip = document.getElementById("tip");
  const showTip = TA.tooltip(tip, byId);
  const idOf = el => {
    const g = el.closest && el.closest("[data-id]");
    return g ? decodeURIComponent(g.dataset.id) : null;
  };
  svg.addEventListener("click", e => {
    const id = idOf(e.target);
    if (id)
      try {
        showDetail(byId[id]);
      } catch (err) {}
  });
  svg.addEventListener("mousemove", e => {
    const id = idOf(e.target);
    if (id) showTip(id, e);
    else tip.style.display = "none";
  });
  svg.addEventListener("mouseleave", () => (tip.style.display = "none"));
  svg.addEventListener("keydown", e => {
    if (e.key !== "Enter" && e.key !== " ") return;
    const id = idOf(document.activeElement);
    if (!id) return;
    e.preventDefault();
    try {
      showDetail(byId[id]);
    } catch (err) {}
  });
})();
