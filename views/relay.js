// Relay — the evidence layer for Report 1, "how the lead is won and lost".
//
// Structure. Six seams, top to bottom, each depending only on the ones above it:
//
//   0 CONFIG   the tunables, in one place, with the reason each number is what it is
//   1 DERIVE   pure functions over the corpus: panels, turns, holds, silences, stats.
//              No DOM, no SVG, no pixels. TENURE is the swappable seam: anything that
//              answers holds(cards) can drive this view, so an authored-tenure layer
//              drops in here without touching anything below.
//   2 SCALE    year -> x. Composed out of TA.timeScale('linear') segments; nothing forked.
//   3 LAYOUT   pure geometry: rows, offsets, heights. Returns numbers, never markup.
//   4 RENDER   pure string emitters. Take a model + a layout, return SVG. No state.
//   5 COPY     the argument, and the live sentences that state its limit.
//   6 MOUNT    the only part that touches the document: inject, then wire interaction.
//
// Nothing above MOUNT reads or writes the DOM, so every number on this page can be
// recomputed and asserted without a browser.
(function () {
  const KINK = window.KINK,
    KGLY = window.KGLY,
    KINDS = window.KINDS; // single source of truth (shared.js)
  const ALL = window.CARDS || [];
  const CARDS = ALL.filter(c => c.year);
  const byId = TA.byId(ALL);
  const esc = TA.esc;
  const enc = encodeURIComponent;

  // ═══ 0 · CONFIG ═══════════════════════════════════════════════════════════
  const CFG = {
    // A hold needs two cards no further apart than this. Not a taste call: the median
    // gap between neighbouring cards in a panel is 6 years and the 75th percentile is
    // 15, so 20 is "a bit more than three quarters of the time, one working stretch".
    // The coda prints the sensitivity at 15/20/25/30 so the reader can check the pick.
    HOLD_GAP: 20,
    // A stretch with no card ANYWHERE in the atlas, this long, is cut out of the axis
    // and labelled with what was removed. Must exceed HOLD_GAP, so a hold can never
    // straddle a cut — the one mark that carries a duration is never broken.
    FOLD_MIN: 120,
    SIL_MIN: 25, // a gap worth naming, in years
    CUTS: [1700, 1800], // authored subdivisions of the sparse era; see SCALE
    YMAX: 2030,
    GUT: 200, // left gutter: name, meter, counts, finding
    BANDW: 990,
    RPAD: 30,
    FOLDW: 26, // width of a cut-out marker
    SEG_MIN: 11, // no segment collapses to nothing
    SEG_PAD: 3, // added to each segment's card count before sharing out width
  };
  const AX0 = CFG.GUT;
  const AXW = AX0 + CFG.BANDW;
  const FULLW = AXW + CFG.RPAD;

  // ═══ 1 · DERIVE ═══════════════════════════════════════════════════════════
  // Country level, not the Timeline's swimlane. That lane folds Germany, Switzerland
  // and Finland into one European band, and this whole page is an argument about which
  // NATION was doing the hardest making — Jena is not Delft. `country` already treats
  // the US as one polity, so it avoids inventing handoffs inside America.
  const ctryOf = c => (c.country === "United States of America" ? "USA" : c.country || "—");

  // Editorial: which threads get a full-size panel, in the order the argument walks.
  // Machine tools and production systems are one continuous relay (Britain's tooling ->
  // the American system of manufactures -> flow), so they share a panel.
  const FLAGSHIP = [
    ["Precision Optics", ["Precision Optics"]],
    ["Machine Tools / Production Systems", ["Machine Tools", "Production Systems"]],
    ["Chip Lithography", ["Chip Lithography"]],
    ["The Network", ["The Network"]],
    ["Therapeutics", ["Therapeutics"]],
    ["Reading & Writing DNA", ["Reading & Writing DNA"]],
  ];

  function cardsOf(threads) {
    const seen = {};
    for (const c of CARDS) if ((c.threads || []).some(t => threads.includes(t))) seen[c.id] = c;
    return Object.values(seen).sort((a, b) => a.year - b.year || (a.id < b.id ? -1 : 1));
  }

  // Turns: neighbouring cards that share a country. This is the sequence — who appears,
  // in what order. It is NOT a tenure claim and nothing is drawn from it but the count.
  // One word for this unit everywhere: gutter, method, ledger, coda table. Never "run".
  function turnsOf(cards) {
    const rr = [];
    for (const c of cards) {
      const g = ctryOf(c);
      const last = rr[rr.length - 1];
      if (last && last.g === g) {
        last.n++;
        last.end = c.year;
        last.cards.push(c);
      } else rr.push({ g, n: 1, start: c.year, end: c.year, cards: [c] });
    }
    return rr;
  }

  // ── THE TENURE SEAM ───────────────────────────────────────────────────────
  // The only thing on this page allowed to colour a span of years. Swap this object
  // for an authored-tenure source and every count, meter, label, ledger row and coda
  // figure follows, because nothing downstream knows where holds come from.
  //
  // A LINK joins two cards that are neighbours in the panel's own sequence, share a
  // country, and sit no more than maxGap years apart. A HOLD is a maximal chain of
  // links. Two properties fall out by construction, not by luck:
  //   · every coloured year lies between two cards of the same country, and
  //   · no coloured stretch contains a card-free gap longer than maxGap.
  // So a single card can never claim a year. The 552 card in the machine-tools panel
  // claims 552 and stops; the centuries after it are not the atlas's to give away.
  const TENURE = {
    id: "linked-cards",
    maxGap: CFG.HOLD_GAP,
    holds(cards) {
      const out = [];
      let cur = null;
      for (let i = 1; i < cards.length; i++) {
        const p = cards[i - 1],
          c = cards[i];
        const linked = ctryOf(c) === ctryOf(p) && c.year - p.year <= this.maxGap;
        if (linked) {
          if (cur) {
            cur.b = c.year;
            cur.cards.push(c);
          } else cur = { g: ctryOf(c), a: p.year, b: c.year, cards: [p, c] };
        } else if (cur) {
          out.push(cur);
          cur = null;
        }
      }
      if (cur) out.push(cur);
      out.forEach(h => (h.n = h.cards.length));
      return out;
    },
  };

  // Silences: card-free gaps inside a panel's own span. Absence of evidence, drawn as
  // itself. Every silence this view draws prints its length in years — the axis is not
  // asked to convey it (see SCALE).
  function silencesOf(cards) {
    const out = [];
    for (let i = 1; i < cards.length; i++) {
      const g = cards[i].year - cards[i - 1].year;
      if (g >= CFG.SIL_MIN) out.push({ a: cards[i - 1].year, b: cards[i].year, g });
    }
    return out;
  }

  function buildModel(label, threads, tenure) {
    const cards = cardsOf(threads);
    const turns = turnsOf(cards);
    const holds = tenure.holds(cards);
    const sil = silencesOf(cards);
    const first = cards[0].year,
      last = cards[cards.length - 1].year;
    const span = last - first;
    const held = holds.reduce((a, h) => a + (h.b - h.a), 0);
    const seq = turns.map(r => r.g);
    let rt = 0;
    for (let i = 2; i < seq.length; i++) if (seq[i] === seq[i - 2]) rt++; // X->Y->X
    return {
      label,
      threads,
      cards,
      turns,
      holds,
      sil,
      first,
      last,
      span,
      held,
      rt,
      single: turns.filter(r => r.n === 1).length,
      cover: span ? held / span : 0,
      longest: holds.slice().sort((a, b) => b.b - b.a - (a.b - a.a) || (a.g < b.g ? -1 : 1))[0],
      widest: sil.slice().sort((a, b) => b.g - a.g || a.a - b.a)[0],
    };
  }

  const flagSet = new Set(FLAGSHIP.flatMap(f => f[1]));
  const restThreads = [...new Set(CARDS.flatMap(c => c.threads || []))]
    .filter(t => !flagSet.has(t))
    .sort();
  const FLAGS = FLAGSHIP.map(([l, t]) => buildModel(l, t, TENURE));
  // The index strip runs best-evidenced first and empties out as you scroll: the shape
  // of the corpus, readable before a single mark is.
  const INDEX = restThreads
    .map(t => buildModel(t, [t], TENURE))
    .sort((a, b) => b.cover - a.cover || (a.label < b.label ? -1 : 1));
  const MODELS = FLAGS.concat(INDEX);

  const HOLDS = MODELS.flatMap(m => m.holds.map(h => Object.assign({ panel: m.label }, h)));
  const TOT = MODELS.reduce(
    (a, m) => ({
      cards: a.cards + m.cards.length,
      turns: a.turns + m.turns.length,
      single: a.single + m.single,
      span: a.span + m.span,
      held: a.held + m.held,
      rt: a.rt + m.rt,
    }),
    { cards: 0, turns: 0, single: 0, span: 0, held: 0, rt: 0 },
  );
  const usaHolds = HOLDS.filter(h => h.g === "USA");
  const TOPC = usaHolds.length
    ? { g: "USA", n: usaHolds.length, y: usaHolds.reduce((a, h) => a + h.b - h.a, 0) }
    : { g: "—", n: 0, y: 0 };

  // What the rule this view refuses would have cost, measured on the panels actually
  // drawn rather than asserted from memory: paint every turn forward to the next
  // country's first card and find the single lone card that ends up claiming the most.
  const WORST = MODELS.reduce(
    (best, m) => {
      m.turns.forEach((r, i) => {
        if (r.n !== 1 || i >= m.turns.length - 1) return;
        const claim = m.turns[i + 1].start - r.start;
        if (claim > best.claim) best = { claim, g: r.g, year: r.start, panel: m.label };
      });
      return best;
    },
    { claim: 0, g: "—", year: 0, panel: "" },
  );

  // Sensitivity of the whole finding to the one parameter it rests on, computed live.
  const SENS = [15, 20, 25, 30].map(t => {
    const src = { maxGap: t, holds: TENURE.holds };
    const hs = MODELS.flatMap(m => src.holds(m.cards));
    return { t, n: hs.length, y: hs.reduce((a, h) => a + h.b - h.a, 0) };
  });

  // ── country colour ────────────────────────────────────────────────────────
  // Ranked by corpus frequency; the top four take the validated categorical slots
  // (blue/green/magenta/yellow — all-pairs CVD + normal vision on the cream surface,
  // per the dataviz validator), the tail folds to neutral. Never a hardcoded name.
  const CTRY_PAL = ["#2a78d6", "#008300", "#e87ba4", "#eda100"];
  const CTRY_NEUTRAL = "#9b968c";
  const ctryCount = {};
  CARDS.forEach(c => {
    const g = ctryOf(c);
    if (g && g !== "—") ctryCount[g] = (ctryCount[g] || 0) + 1;
  });
  const ctryRank = Object.keys(ctryCount).sort(
    (a, b) => ctryCount[b] - ctryCount[a] || (a < b ? -1 : 1),
  );
  const ctryColor = {};
  ctryRank.forEach((g, i) => (ctryColor[g] = i < CTRY_PAL.length ? CTRY_PAL[i] : CTRY_NEUTRAL));
  const colorOf = g => ctryColor[g] || CTRY_NEUTRAL;

  // ═══ 2 · SCALE ════════════════════════════════════════════════════════════
  // Year -> x. Three rules, all derived, all printed on the page:
  //
  //  (a) CUT OUT what is provably empty. A stretch with no card anywhere in the atlas
  //      and longer than FOLD_MIN is removed and replaced by a marked gutter carrying
  //      the exact number of years taken out. No year that has a card is ever elided.
  //  (b) SHARE THE REST OUT BY EVIDENCE. Each segment's width is proportional to the
  //      cards in it. The old axis spent 532 of 880px on 23 cards.
  //  (c) FROM linFrom ONWARD, ONE LINEAR RATE. linFrom is the decade of the earliest
  //      hold in the corpus, so every hold on this page necessarily sits inside a single
  //      linear stretch and hold widths are exactly proportional to hold years — the
  //      comparison this view exists to make cannot invert. That is the log scale's
  //      failure closed by construction rather than by promise: add a card that creates
  //      an earlier hold and linFrom moves back with it.
  //
  // Every segment is a TA.timeScale({mode:"linear"}); this composes them, it does not
  // fork a fourth scale.
  function buildScale(cards, holds) {
    const yrs = [...new Set(cards.map(c => c.year))].sort((a, b) => a - b);
    const ymin = yrs[0],
      ymax = CFG.YMAX;
    const holdFrom = holds.length ? Math.min(...holds.map(h => h.a)) : ymax;
    const linFrom = Math.max(ymin, Math.min(ymax, Math.floor(holdFrom / 10) * 10));

    const folds = [];
    for (let i = 1; i < yrs.length; i++)
      if (yrs[i] - yrs[i - 1] >= CFG.FOLD_MIN && yrs[i] <= linFrom)
        folds.push({ a: yrs[i - 1], b: yrs[i] });

    // kept stretches = everything the folds did not take
    const kept = [];
    let cur = ymin;
    for (const f of folds) {
      kept.push([cur, f.a]);
      cur = f.b;
    }
    kept.push([cur, ymax]);

    const cuts = CFG.CUTS.concat([linFrom]);
    const segs = [];
    for (const [a, b] of kept) {
      const ks = [a].concat(cuts.filter(c => c > a && c < b)).concat([b]);
      if (ks.length === 2 && a === b) segs.push({ a, b: a });
      else for (let i = 1; i < ks.length; i++) segs.push({ a: ks[i - 1], b: ks[i] });
    }
    segs.forEach((s, i) => {
      const lastSeg = i === segs.length - 1;
      s.n = cards.filter(c => c.year >= s.a && (c.year < s.b || (lastSeg && c.year <= s.b))).length;
    });

    // width by evidence, then lift anything under SEG_MIN and pay for it proportionally
    const avail = CFG.BANDW - CFG.FOLDW * folds.length;
    const wt = segs.map(s => s.n + CFG.SEG_PAD);
    const sum = wt.reduce((a, b) => a + b, 0);
    let w = wt.map(x => (avail * x) / sum);
    for (let pass = 0; pass < 40; pass++) {
      let owed = 0,
        slack = 0;
      w.forEach((x, i) => {
        if (x < CFG.SEG_MIN) {
          owed += CFG.SEG_MIN - x;
          w[i] = CFG.SEG_MIN;
        } else slack += x - CFG.SEG_MIN;
      });
      if (owed <= 0 || slack <= 0) break;
      w = w.map(x => (x <= CFG.SEG_MIN ? CFG.SEG_MIN : x - (owed * (x - CFG.SEG_MIN)) / slack));
    }

    // lay the segments and the fold gutters out left to right
    const items = [];
    let acc = AX0;
    for (let i = 0; i < segs.length; i++) {
      const f = i > 0 && folds.find(f => f.a === segs[i - 1].b && f.b === segs[i].a);
      if (f) {
        items.push({ fold: true, a: f.a, b: f.b, x0: acc, w: CFG.FOLDW });
        acc += CFG.FOLDW;
      }
      const s = segs[i];
      const x0 = acc,
        sw = w[i]; // bind per segment: `acc` keeps moving, a closure over it would not
      items.push({
        fold: false,
        a: s.a,
        b: s.b,
        n: s.n,
        x0,
        w: sw,
        // the one primitive, once per segment. A segment holding a single year (a card
        // marooned between two cut-outs) has no interval to interpolate, so it is a point.
        xs:
          s.b > s.a
            ? TA.timeScale({ mode: "linear", minY: s.a, maxY: s.b, x0, width: sw }).xs
            : () => x0 + sw / 2,
      });
      acc += sw;
    }
    const xOf = y => {
      for (const it of items) {
        if (y <= it.a) return it.fold ? it.x0 : it.xs(it.a);
        if (y < it.b) return it.fold ? it.x0 + it.w / 2 : it.xs(y);
      }
      const L = items[items.length - 1];
      return L.fold ? L.x0 + L.w : L.xs(L.b);
    };
    const linSeg = items.filter(it => !it.fold && it.a >= linFrom);
    const linRate = linSeg.length
      ? linSeg.reduce((a, s) => a + s.w, 0) / linSeg.reduce((a, s) => a + (s.b - s.a), 0)
      : 1;
    return { xOf, items, folds, ymin, ymax, linFrom, holdFrom, linRate };
  }
  const SCALE = buildScale(CARDS, HOLDS);
  const xOf = SCALE.xOf;

  // ═══ 3 · LAYOUT ═══════════════════════════════════════════════════════════
  // Metric sets. The rug grew (13px glyphs, 13px minimum separation) because the axis
  // gave it the room: the 1950-2000 stretch went from 133px to ~258px.
  const FLAG_M = {
    rugRow: 17,
    gly: 13,
    minDx: 13,
    bandH: 34,
    lane: 13,
    gap: 20,
    sil: 9.5,
    hold: 9,
    barH: 8,
    post: 2.5,
  };
  const IDX_M = {
    rugRow: 12,
    gly: 10.5,
    minDx: 10,
    bandH: 22,
    lane: 10,
    gap: 13,
    sil: 8.5,
    hold: 8,
    barH: 6,
    post: 2,
  };

  // Greedy word wrap against the same deterministic width estimate the renderer uses.
  function wrap(s, width, fs) {
    const out = [];
    let ln = "";
    for (const w of String(s).split(" ")) {
      if (ln && tw(ln + " " + w, fs) > width) {
        out.push(ln);
        ln = w;
      } else ln = ln ? ln + " " + w : w;
    }
    if (ln) out.push(ln);
    return out;
  }

  function layoutPanel(model, M, y, flagship) {
    // evidence rug: one kind-glyph per card, greedily packed into rows from the band up
    const rowEnd = [];
    const ticks = model.cards.map(c => {
      const x = xOf(c.year);
      let r = -1;
      for (let i = 0; i < rowEnd.length; i++)
        if (x - rowEnd[i] >= M.minDx) {
          r = i;
          break;
        }
      if (r < 0) {
        r = rowEnd.length;
        rowEnd.push(-1e9);
      }
      rowEnd[r] = x;
      return { c, x, r, dx: 0 };
    });
    // cards sharing a year would stack their posts on the identical pixel and hide a
    // country. Fan them deterministically, by id, never more than 3px off true.
    const bins = {};
    ticks.forEach(t => (bins[t.c.year] = (bins[t.c.year] || []).concat([t])));
    Object.keys(bins).forEach(k => {
      const g = bins[k];
      if (g.length > 1) g.forEach((t, i) => (t.dx = (i - (g.length - 1) / 2) * 3));
    });
    const rows = Math.max(1, rowEnd.length);
    const rugH = rows * M.rugRow;
    const bandTop = y + rugH + 4;
    // the gutter is prose and can be taller than the chart; the panel is whichever is
    // taller, so a long finding never runs into the next thread's name
    const name = wrap(model.label, CFG.GUT - 12, flagship ? 12.5 : 10.5);
    const prose = flagship ? wrap(PANEL_COPY[model.label] || "", CFG.GUT - 16, 10) : [];
    const head = (name.length - 1) * (flagship ? 14 : 12);
    // gutter height: name + the meter/stat line + the blurb. The longest-hold / widest-silence
    // foot lines are gone (they lived in `foot`), so the panel no longer reserves rows for them.
    const gutH = head + (flagship ? 32 : 28) + prose.length * 12;
    return {
      ticks,
      rows,
      name,
      head,
      prose,
      top: y,
      bandTop,
      bandBot: bandTop + M.bandH,
      laneY: bandTop + M.bandH + M.lane,
      height: Math.max(rugH + 4 + M.bandH + M.lane, gutH) + M.gap,
    };
  }

  // ═══ 4 · RENDER ═══════════════════════════════════════════════════════════
  const f = n => (Math.round(n * 10) / 10).toFixed(1);
  const tw = (s, fs) => String(s).length * fs * 0.56; // deterministic width estimate
  const num = n => String(n).replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  const rect = (x, y, w, h, a) =>
    `<rect x="${f(x)}" y="${f(y)}" width="${f(Math.max(w, 0))}" height="${f(h)}" ${a}/>`;
  const text = (x, y, s, a) => `<text x="${f(x)}" y="${f(y)}" ${a}>${s}</text>`;
  const line = (x1, y1, x2, y2, a) =>
    `<line x1="${f(x1)}" y1="${f(y1)}" x2="${f(x2)}" y2="${f(y2)}" ${a}/>`;

  const SILENCE = "#e9e5dd";
  const RULE = "#c2bbae";
  const LABEL = "#5f594f";

  // The axis band. Drawn twice: once at the top, once again above the index strip so
  // the small panels are never orphaned from their scale.
  // Returns two layers. `back` goes under the panels; `front` goes over them, because a
  // cut-out has to interrupt every mark that would otherwise appear to run across it.
  function drawAxis(top, chartH) {
    const H = 54;
    let back = "",
      front = "";
    // gridlines run the full chart; the decade comb only where the scale is linear, so
    // a reader who wants to measure a stretch can count hairlines instead of guessing.
    for (let yr = SCALE.linFrom; yr <= SCALE.ymax; yr += 10) {
      const col = yr % 100 === 0 ? "rgba(0,0,0,.10)" : "rgba(0,0,0,.045)";
      back += line(xOf(yr), top + H - 8, xOf(yr), chartH, `stroke="${col}" stroke-width="1"`);
    }
    for (const c of [1300, 1400, 1600, 1700, 1800])
      if (c > SCALE.ymin && c < SCALE.linFrom)
        back += line(
          xOf(c),
          top + H - 8,
          xOf(c),
          chartH,
          `stroke="rgba(0,0,0,.06)" stroke-width="1"`,
        );

    // cut-out gutters: the years the axis refuses to draw, named
    for (const fo of SCALE.folds) {
      const gx = SCALE.items.find(i => i.fold && i.a === fo.a).x0;
      front += rect(gx, top + H - 8, CFG.FOLDW, chartH - top - H + 8, `fill="#fcfbf9"`);
      for (const oy of [0, 1])
        front += `<path d="M${f(gx + 3)} ${f(top + H - 3 + oy * 9)} l${f(CFG.FOLDW - 6)} -8" stroke="${RULE}" stroke-width="1.3" fill="none"/>`;
      front +=
        text(
          gx + CFG.FOLDW / 2,
          top + H - 30,
          `${num(fo.b - fo.a)} yr`,
          `text-anchor="middle" font-size="8.5" font-weight="600" fill="${LABEL}"`,
        ) +
        text(
          gx + CFG.FOLDW / 2,
          top + H - 21,
          `cut`,
          `text-anchor="middle" font-size="8" fill="#9a948b"`,
        );
    }

    // Year labels. Centuries and the corpus's own first year get first refusal; the
    // halves only fill gaps the centuries left, so the axis never reads 1650·1750·1850
    // with the round numbers missing.
    const MAJOR = [SCALE.ymin, 1300, 1400, 1600, 1700, 1800, 1900, 1940, 1980, 2020];
    const MINOR = [1500, 1650, 1750, 1850, 1920, 1960, 2000];
    const placed = [];
    const fits = x => placed.every(p => Math.abs(p - x) >= 34);
    for (const list of [MAJOR, MINOR])
      for (const yr of list) {
        if (yr < SCALE.ymin || yr > SCALE.ymax) continue;
        if (SCALE.folds.some(fo => yr > fo.a && yr < fo.b)) continue;
        const x = xOf(yr);
        if (!fits(x)) continue;
        placed.push(x);
        back += text(
          x,
          top + H - 8,
          yr,
          `text-anchor="middle" font-size="10" font-weight="600" fill="#8f8a82"`,
        );
      }
    // and the one rate the reader is allowed to trust
    back += text(
      AXW,
      top + 11,
      `evidence-weighted before ${SCALE.linFrom} · linear after · ${f(SCALE.linRate * 10)} px per decade`,
      `text-anchor="end" font-size="9" fill="#9a948b"`,
    );
    return { back, front, h: H };
  }

  function drawGutter(m, lay, M, flagship) {
    const x = 8;
    let s = lay.name
      .map((l, i) =>
        text(
          x,
          lay.top + 11 + i * (flagship ? 14 : 12),
          esc(l),
          `font-size="${flagship ? 12.5 : 10.5}" font-weight="600" fill="#1c1c1c"`,
        ),
      )
      .join("");
    let ty = lay.top + lay.head + (flagship ? 25 : 23);
    // coverage meter — the panel's whole finding, before any mark is read
    const mw = flagship ? 116 : 92;
    s += rect(x, ty - 6, mw, 5, `fill="#e2ddd3" rx="2.5"`);
    if (m.cover > 0)
      s += rect(x, ty - 6, Math.max(mw * m.cover, 1.5), 5, `fill="#3a352d" rx="2.5"`);
    ty += flagship ? 13 : 11;
    // One stat line, not three: coverage + the honesty figure (how many turns are a single
    // card). The raw card count, the longest hold and the widest silence are DROPPED from the
    // gutter — the hold bar and the silence span already print those in the chart itself, so
    // the gutter was duplicating labels. Blurb carries the meaning; this line carries the caveat.
    s += text(
      x,
      ty,
      `${Math.round(m.cover * 100)}% held · ${m.single} of ${m.turns.length} turns on one card`,
      `font-size="9.5" fill="#8a857c"`,
    );
    if (flagship)
      lay.prose.forEach((l, i) => {
        s += text(x, ty + 14 + i * 12, esc(l), `font-size="10" fill="#5f594f"`);
      });
    return s;
  }

  function drawPanel(m, lay, M, flagship) {
    const x1 = xOf(m.first),
      x2 = xOf(m.last);
    let s = "";
    // 1 · the field: everything between this thread's first and last card that no hold
    //     covers. Largest area on the page, lowest contrast on the page — it is ground,
    //     not figure, and it is what the atlas actually has to say about those years.
    s += rect(x1, lay.bandTop, Math.max(x2 - x1, 2), M.bandH, `fill="${SILENCE}"`);

    // 2 · named silences. Ranked by YEARS, never by pixels: before 1900 the axis is
    //     evidence-weighted, so a wide gap on screen is not the long one and ranking by
    //     width would put the labels on the wrong holes. Every silence that gets a rule
    //     also gets its length in figures; anything too narrow to letter is left as plain
    //     wash and named in the gutter instead.
    const named = m.sil
      .map(g => Object.assign({ w: xOf(g.b) - xOf(g.a) }, g))
      .sort((a, b) => b.g - a.g || a.a - b.a)
      .slice(0, flagship ? 5 : 2);
    // a cut-out is painted over the panels, so a numeral that lands under one would be
    // sliced in half; those silences keep their wash and are named in the gutter instead
    const cuts = SCALE.items.filter(i => i.fold).map(i => [i.x0, i.x0 + i.w]);
    for (const g of named) {
      const full = `${num(g.g)} yr · no card`,
        shortl = `${num(g.g)} yr`;
      const lab =
        g.w >= tw(full, M.sil) + 26 ? full : g.w >= tw(shortl, M.sil) + 16 ? shortl : null;
      if (!lab) continue;
      const gy = lay.bandTop + M.bandH * 0.44,
        mid = (xOf(g.a) + xOf(g.b)) / 2,
        half = tw(lab, M.sil) / 2 + 5;
      if (cuts.some(c => mid - half - 3 < c[1] && mid + half + 3 > c[0])) continue;
      const dash = `stroke="${RULE}" stroke-width="1" stroke-dasharray="1 3"`;
      s +=
        `<g><title>Silence ${g.a}–${g.b} · ${num(g.g)} yr · no card in this panel</title>` +
        rect(xOf(g.a), lay.bandTop, g.w, M.bandH, `fill="transparent"`) +
        line(xOf(g.a) + 3, gy, mid - half, gy, dash) +
        line(mid + half, gy, xOf(g.b) - 3, gy, dash) +
        text(
          mid,
          gy + M.sil * 0.36,
          esc(lab),
          `text-anchor="middle" font-size="${M.sil}" font-weight="600" fill="${LABEL}"`,
        ) +
        `</g>`;
    }

    // 3 · holds. The only coloured span on the page, and the only mark with width.
    for (const h of m.holds) {
      const a = xOf(h.a),
        b = xOf(h.b),
        w = Math.max(b - a, 3),
        col = colorOf(h.g);
      s +=
        `<g><title>Hold ${esc(h.g)} ${h.a}–${h.b} · ${h.b - h.a} yr · ${h.n} cards · no gap over ${TENURE.maxGap} yr</title>` +
        rect(
          a - 2.5,
          lay.bandTop,
          w + 5,
          M.bandH,
          `fill="#ffffff" stroke="#ded8cd" stroke-width=".5" rx="2"`,
        ) +
        rect(a, lay.bandBot - M.barH, w, M.barH, `fill="${col}" rx="1"`) +
        `</g>`;
    }

    // 4 · posts: one per card, full band height, at the card's own year. A card is a
    //     fact; it is drawn whether or not anything holds around it.
    for (const t of lay.ticks)
      s += rect(
        t.x + t.dx - M.post / 2,
        lay.bandTop,
        M.post,
        M.bandH,
        `fill="${colorOf(ctryOf(t.c))}"`,
      );

    // 5 · the evidence rug — the dominant mark. Glyphs at full kind colour, each on a
    //     hairline stem down to its own post, clickable and focusable.
    for (const t of lay.ticks) {
      const cy = lay.bandTop - 6 - t.r * M.rugRow;
      s +=
        `<g data-id="${enc(t.c.id)}" tabindex="0" role="button" aria-label="${esc(t.c.name)} — ${esc(t.c.kind)}, ${esc(t.c.place || "")}, ${t.c.year}">` +
        line(
          t.x + t.dx,
          lay.bandTop,
          t.x + t.dx,
          cy + 3,
          `stroke="${colorOf(ctryOf(t.c))}" stroke-width=".75" stroke-opacity=".38"`,
        ) +
        `<circle cx="${f(t.x + t.dx)}" cy="${f(cy)}" r="7" fill="transparent"/>` +
        text(
          t.x + t.dx,
          cy + M.gly * 0.34,
          KGLY[t.c.kind],
          `text-anchor="middle" font-size="${M.gly}" fill="${KINK[t.c.kind]}"`,
        ) +
        `</g>`;
    }

    // 6 · hold labels, in their own lane, skipped rather than crammed
    let right = -1e9;
    for (const h of m.holds) {
      const a = xOf(h.a),
        w = Math.max(xOf(h.b) - a, 3);
      const tiers = [
        `${h.g} ${h.a}–${h.b} · ${h.b - h.a} yr · ${h.n} cards`,
        `${h.g} · ${h.b - h.a} yr`,
        `${h.b - h.a} yr`,
      ];
      const lab = tiers.find(t => tw(t, M.hold) <= Math.max(w, 46) + 30);
      if (!lab) continue;
      const lx = Math.min(a, AXW - tw(lab, M.hold));
      if (lx < right) continue;
      right = lx + tw(lab, M.hold) + 10;
      s += text(lx, lay.laneY - 2, esc(lab), `font-size="${M.hold}" fill="#4a453c"`);
    }
    return s;
  }

  // Compose the whole canvas: six flagship panels in the order the argument walks, a
  // divider, the axis again, then the index strip. Height is only known once every panel
  // has been laid out, so the axis (which spans the full height) is drawn last.
  function drawChart() {
    const AXH = 54;
    let body = "",
      y = AXH + 10;
    for (const m of FLAGS) {
      const lay = layoutPanel(m, FLAG_M, y, true);
      body += drawGutter(m, lay, FLAG_M, true) + drawPanel(m, lay, FLAG_M, true);
      y += Math.max(lay.height, 104);
    }
    const divY = y + 2;
    const divider =
      line(8, divY, AXW, divY, `stroke="rgba(0,0,0,.16)" stroke-width="1"`) +
      text(
        8,
        divY + 16,
        `The other ${INDEX.length} threads, best-evidenced first — and the evidence thins`,
        `font-size="11" font-weight="600" fill="#6f6f6f"`,
      );
    const axis2Top = divY + 26;
    y = axis2Top + AXH + 6;
    for (const m of INDEX) {
      const lay = layoutPanel(m, IDX_M, y, false);
      body += drawGutter(m, lay, IDX_M, false) + drawPanel(m, lay, IDX_M, false);
      y += Math.max(lay.height, 56);
    }
    const h = y + 8;
    // Each axis owns only the band BELOW it, down to where the next one takes over. Passing
    // both the full height drew every gridline and every cut-out gutter twice below the
    // second axis — double ink over ~half the canvas, and invisible to the golden test
    // because the doubling was baked into the blessed baseline.
    const a1 = drawAxis(0, axis2Top),
      a2 = drawAxis(axis2Top, h);
    // Gutters (in `front`) are opaque and were painted over `body`, slicing the one long
    // string that reaches past them — the index-strip heading. Divider goes in front of them.
    return { h, svg: a1.back + a2.back + body + a1.front + a2.front + divider };
  }

  // ═══ 5 · COPY ═════════════════════════════════════════════════════════════
  // Authored prose carries the argument; every number in it is injected live, so the
  // page cannot drift out of agreement with the corpus it is drawn from.
  // Two to four lines each, and every clause is checkable against the panel's own marks.
  // Where a country is named, the deck has a card for it; where the deck has none, the
  // blurb states the absence and claims nothing about the history it cannot see.
  const PANEL_COPY = {
    "Precision Optics":
      "Pisa, Delft, Jena, one American hold, then Veldhoven. " +
      "No Japanese card here: a hole in this atlas, not a verdict.",
    "Machine Tools / Production Systems":
      "Britain built the machines that build machines. America made the parts " +
      "interchangeable. Japan made them flow.",
    "Chip Lithography":
      "The hard part became light and glass, and left America for Veldhoven. " +
      "No Japanese card here: a hole in this atlas, not a verdict.",
    "The Network":
      "The near-control. Packet switching is British, the web is Swiss — " +
      "and an American card follows each.",
    Therapeutics:
      "Short American holds, mostly single cards. " +
      "The newest cards here are Chinese and Canadian.",
    "Reading & Writing DNA":
      "Britain and America trade places over and over. The best-covered of these six " +
      "panels, and still mostly unheld.",
  };

  // The two numbers a reader would otherwise try to eyeball off the axis, written out.
  const pct = (a, b) => (b ? Math.round((1000 * a) / b) / 10 : 0);

  const findingHTML = () =>
    `Of the <b>${num(TOT.span)}</b> years these ${MODELS.length} panels span, the record can carry ` +
    `<b>${num(TOT.held)}</b> — <b>${pct(TOT.held, TOT.span)}%</b>. The rest is not a lead being held; it is a lead we cannot see.` +
    `<span class="second">The corpus was gathered in English, and it shows: ${TOPC.n} of the ${HOLDS.length} holds, ` +
    `and ${num(TOPC.y)} of the ${num(TOT.held)} held years, are American — a fact about this atlas before it is one about the world.</span>`;

  // Only what a reader needs in order to SEE the marks: what a card is, what a hold is,
  // what a turn is, and the rule that keeps a lone card from claiming a century. The
  // counterexample that justifies that rule is a methodologist's business, so it sits in
  // the coda with the rest of the arithmetic.
  const methodHTML = () =>
    `A card is a dated place where something was made. Two cards from one country, neighbours in a panel and ` +
    `no more than <b>${TENURE.maxGap}</b> years apart, hold the years between them; a chain of such pairs is a hold — the only span ` +
    `drawn in colour. Nothing is ever painted forward to the next country's card. A turn is one country's unbroken ` +
    `stretch of cards, and <b>${TOT.single} of ${TOT.turns}</b> turns rest on a single card: a date, not a tenure.`;

  const axisNoteHTML = () =>
    `The axis gives its width to the years that have cards. ` +
    (SCALE.folds.length
      ? `${SCALE.folds.length} stretches with no card anywhere in the atlas — ` +
        SCALE.folds.map(fo => `${fo.a}–${fo.b}`).join(" and ") +
        `, ${num(SCALE.folds.reduce((a, fo) => a + fo.b - fo.a, 0))} years — are cut out and marked. `
      : "") +
    `From ${SCALE.linFrom} it is plain linear and the earliest hold starts in ${SCALE.holdFrom}, so every hold shares one scale: ` +
    `a longer hold is a wider bar. Silences reach further back and are not comparable by eye, so each prints its own length.`;

  const kindLegendHTML = () =>
    "<span>Kinds:</span>" +
    KINDS.map(
      k => `<span><span class="gly" style="color:${KINK[k]}">${KGLY[k]}</span> ${k}</span>`,
    ).join("");
  // Each swatch keys a mark, so each takes the mark's noun: hold, card, silence. "% held"
  // stays the adjective form, and only on the meter.
  const markLegendHTML = () =>
    "<span>Marks:</span>" +
    `<span><svg width="34" height="11" aria-hidden="true"><rect x="0" y="0" width="34" height="11" fill="${SILENCE}"/><rect x="0" y="5" width="34" height="6" fill="#2a78d6" rx="1"/></svg>hold</span>` +
    `<span><svg width="12" height="11" aria-hidden="true"><rect x="0" y="0" width="12" height="11" fill="${SILENCE}"/><rect x="5" y="0" width="2.5" height="11" fill="#2a78d6"/></svg>card</span>` +
    `<span><svg width="26" height="11" aria-hidden="true"><rect x="0" y="0" width="26" height="11" fill="${SILENCE}"/><line x1="1" y1="5.5" x2="25" y2="5.5" stroke="${RULE}" stroke-dasharray="1 3"/></svg>silence</span>`;
  const topN = ctryRank.slice(0, CTRY_PAL.length);
  const tail = ctryRank.length - topN.length;
  const ctryLegendHTML = () =>
    "<span>Countries:</span>" +
    topN
      .map(g => `<span><span class="sw" style="background:${colorOf(g)}"></span>${esc(g)}</span>`)
      .join("") +
    (tail
      ? `<span><span class="sw" style="background:${CTRY_NEUTRAL}"></span>+${tail} others</span>`
      : "");

  // The ledger: every hold in the atlas on ONE plain linear scale. The main chart
  // answers "when, and next to what"; this answers "how long", so no length on the
  // chart is ever the instrument a reader has to trust.
  const maxHold = Math.max(1, ...HOLDS.map(h => h.b - h.a));
  const ordered = HOLDS.slice().sort(
    (a, b) => b.b - b.a - (a.b - a.a) || a.a - b.a || (a.panel < b.panel ? -1 : 1),
  );
  const ledgerHTML = () =>
    `<h2>Every hold the record can carry</h2>` +
    `<p class="note">All ${HOLDS.length} of them, on one plain linear scale — ${num(maxHold)} years is the longest anything here ` +
    `can be shown to have held. Single-card turns have no length at all, so they are not in this list.</p>` +
    `<ol>` +
    ordered
      .map(h => {
        const d = h.b - h.a;
        return (
          `<li title="Hold ${esc(h.g)} ${h.a}–${h.b} · ${esc(h.panel)} · ${d} yr · ${h.n} cards">` +
          `<span class="who" style="border-color:${colorOf(h.g)}">${esc(h.g)}</span>` +
          `<span class="what">${esc(h.panel)} <i>${h.a}–${h.b}</i></span>` +
          `<span class="bar"><b style="width:${((100 * d) / maxHold).toFixed(1)}%;background:${colorOf(h.g)}"></b></span>` +
          `<span class="len">${d} yr</span></li>`
        );
      })
      .join("") +
    `</ol>`;

  // The coda: the rule, its one judgement call, its sensitivity, and the arithmetic.
  const rows = MODELS.slice().sort((a, b) => a.cover - b.cover || (a.label < b.label ? -1 : 1));
  const codaHTML = () =>
    `<h2>Coda — what the ${ALL.length} cards can and cannot support</h2>` +
    `<div class="formula">` +
    `<p>Sort a panel's cards by year. Two neighbours that share a country (the card's <code>country</code>, ` +
    `with the US as one polity) and sit <code>≤ ${TENURE.maxGap}</code> years apart form a <b>link</b>; a maximal chain of links is a ` +
    `<b>hold</b>, its length <code>last − first</code>. By construction no hold hides a card-free gap longer than ` +
    `${TENURE.maxGap} years, and a lone card holds nothing. Paint forward instead — hand each turn the years up to the next ` +
    `country's first card — and the loudest mark on the page becomes a lie: one ${esc(WORST.g)} card dated ${WORST.year} would take ` +
    `the next <b>${num(WORST.claim)}</b> years of ${esc(WORST.panel)} on its own.</p>` +
    `<p>A <b>turn</b> is a maximal stretch of neighbouring cards from one country, so a turn with one card is a country ` +
    `the sequence visits and leaves. A <b>round trip</b> is a turn whose country equals the one two turns earlier.</p>` +
    `<p>Totals over ${MODELS.length} panels (machine tools and production systems are one relay, read as one panel, and a card ` +
    `filed under two threads counts in both, which is why the card column sums past ${ALL.length}): ` +
    `<b>${HOLDS.length}</b> holds, <b>${num(TOT.held)}</b> held years of <b>${num(TOT.span)}</b> (${pct(TOT.held, TOT.span)}%), ` +
    `<b>${TOT.single} of ${TOT.turns}</b> turns on a single card, <b>${TOT.rt}</b> round trips.</p>` +
    `<p>The ${TENURE.maxGap}-year link is the one judgement call: ` +
    SENS.map(s => `<b>${s.t} yr</b> → ${s.n} holds, ${num(s.y)} yr (${pct(s.y, TOT.span)}%)`).join(
      "; ",
    ) +
    `. The percentage moves; the shape does not.</p></div>` +
    `<table><thead><tr><th>Panel</th><th>Cards</th><th>Turns</th><th>On one card</th><th>Holds</th><th>Held yr</th><th>Span yr</th><th>Held %</th></tr></thead><tbody>` +
    rows
      .map(
        m =>
          `<tr><td>${esc(m.label)}</td><td>${m.cards.length}</td><td>${m.turns.length}</td><td>${m.single}</td>` +
          `<td>${m.holds.length}</td><td>${m.held}</td><td>${num(m.span)}</td><td>${Math.round(m.cover * 100)}%</td></tr>`,
      )
      .join("") +
    `<tr class="tot"><td>All ${MODELS.length} panels</td><td>${TOT.cards}</td><td>${TOT.turns}</td><td>${TOT.single}</td>` +
    `<td>${HOLDS.length}</td><td>${num(TOT.held)}</td><td>${num(TOT.span)}</td><td>${pct(TOT.held, TOT.span)}%</td></tr>` +
    `</tbody></table>`;

  // ═══ 6 · MOUNT ════════════════════════════════════════════════════════════
  const chart = drawChart();
  const svg = document.getElementById("chart");
  svg.setAttribute("width", FULLW);
  svg.setAttribute("height", chart.h);
  svg.setAttribute("viewBox", "0 0 " + FULLW + " " + chart.h);
  svg.innerHTML = chart.svg;

  document.getElementById("finding").innerHTML = findingHTML();
  document.getElementById("method").innerHTML = methodHTML();
  document.getElementById("axnote").innerHTML = axisNoteHTML();
  document.getElementById("kindleg").innerHTML = kindLegendHTML();
  document.getElementById("markleg").innerHTML = markLegendHTML();
  document.getElementById("ctryleg").innerHTML = ctryLegendHTML();
  document.getElementById("ledger").innerHTML = ledgerHTML();
  document.getElementById("coda").innerHTML = codaHTML();

  // "How this is measured" toggle: the method + axis note default hidden, so the header is
  // thesis + finding + chart. A native <button> already handles Enter/Space; do not add kbd().
  const howbtn = document.getElementById("howbtn"),
    howto = document.getElementById("howto");
  if (howbtn && howto)
    howbtn.onclick = () => {
      const open = howto.hasAttribute("hidden");
      if (open) howto.removeAttribute("hidden");
      else howto.setAttribute("hidden", "");
      howbtn.setAttribute("aria-expanded", open ? "true" : "false");
    };

  // ── interaction: delegated on the SVG ─────────────────────────────────────
  const tip = document.getElementById("tip");
  const showTip = TA.tooltip(tip, byId);
  const idOf = el => {
    const g = el.closest && el.closest("[data-id]");
    return g ? decodeURIComponent(g.dataset.id) : null;
  };
  const open = id => {
    try {
      showDetail(byId[id]);
    } catch (err) {}
  };
  svg.addEventListener("click", e => {
    const id = idOf(e.target);
    if (id) open(id);
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
    open(id);
  });
})();
