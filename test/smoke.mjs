// Visual regression + smoke test: load every view in headless Chrome, assert no console
// errors and no in-app error banner, confirm the card count is consistent, and compare a
// pinned screenshot of each view against a committed golden image in test/baseline/.
//
// Run by .github/workflows/ci.yml as well as locally.
//
//   npm i --prefix test          # one-time: puppeteer-core, pixelmatch, pngjs
//   node test/smoke.mjs
//
// Current renders and *-diff.png land in test/shots/ (gitignored scratch). Baselines in
// test/baseline/<platform>/ are COMMITTED and a normal run never writes them — re-bless
// deliberately, and review the image diff before committing:
//
//   UPDATE_BASELINE=1 node test/smoke.mjs
//
// SELFCHECK=1 captures every view twice in one run and asserts a 0-pixel self-diff; use it
// to prove a view is deterministic before adding it to the golden set.
//
// Baselines are per-platform because these views use the system font stack, so darwin and
// linux legitimately rasterise differently — a single shared golden set is not possible.
// A platform with no baseline directory is a HARD FAILURE: skipping it meant Linux CI
// compared zero pixels and still printed "ALL VIEWS CLEAN". Bless a set per platform.
// The platform is only half the story though — the rasteriser is the installed Chrome, so
// each baseline set also records the browser that blessed it in browser.txt, and a run
// against a different one says so loudly instead of failing mysteriously.
//
// Uses your installed Chrome; override with CHROME=/path/to/chrome.
import puppeteer from 'puppeteer-core';
import pixelmatch from 'pixelmatch';
import { PNG } from 'pngjs';
import { spawn } from 'child_process';

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.dirname(HERE);
const SHOT = path.join(HERE, 'shots');
const PLATFORM = process.platform;
const BASE = path.join(HERE, 'baseline', PLATFORM);
const PORT = 8765;
// One host string for the guard, the readiness probe, AND the captures. They used to split
// between 127.0.0.1 and localhost, so on a box where those resolve differently the guard
// could clear while the captures hit a different listener. Keep them identical.
const HOST = `http://127.0.0.1:${PORT}`;
const CHROME = process.env.CHROME || (process.platform === 'darwin'
  ? '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'
  : '/usr/bin/google-chrome');
// `!!process.env.X` made UPDATE_BASELINE=0 / =false / =no all silently re-bless
// every golden image — the one operation that must never happen by accident.
const truthy = v => !!v && !["0", "false", "no", "off", ""].includes(String(v).toLowerCase());
const UPDATE = truthy(process.env.UPDATE_BASELINE);
const SELFCHECK = truthy(process.env.SELFCHECK);
fs.mkdirSync(SHOT, { recursive: true });
if (UPDATE) fs.mkdirSync(BASE, { recursive: true });
// No golden set for this OS yet — fail. A skip here is indistinguishable from a pass in
// CI logs and exit codes, which is how a "visual regression test" ends up testing nothing.
const NO_PLATFORM_BASELINE = !UPDATE && !SELFCHECK && !fs.existsSync(BASE);

const VIEWS = [
  ['home', 'index.html'], ['globe', 'views/map.html'], ['timeline', 'views/atlas.html'],
  ['tree', 'views/tree.html'], ['relay', 'views/relay.html'], ['deck', 'views/deck.html'],
  ['table', 'views/table.html'], ['dashboard', 'views/dashboard.html'],
];

// Viewports are pinned (including deviceScaleFactor) so a capture is reproducible across
// machines. Changing any number here invalidates every baseline.
const VIEWPORTS = [
  ['desktop', { width: 1440, height: 900, deviceScaleFactor: 1 }],
  ['mobile', { width: 390, height: 844, deviceScaleFactor: 1 }],
];

// Views whose render cannot be made pixel-stable. Empty is the goal; anything listed here
// still gets the console-error / banner / card-count assertions, just not a golden compare.
// Never add a view here to dodge a real regression — and never widen FAIL_RATIO instead.
const GOLDEN_SKIP = {};

// >0.1% of pixels differing is a failure.
//
// The per-pixel settings are deliberately at their strictest. pixelmatch's default 0.1
// threshold plus its antialiasing exclusion is tuned for noisy renderers; these captures are
// byte-identical run to run, so any tolerance is pure blind spot. Measured: at threshold 0.05
// a --bg palette shift of #f5f3ef -> #f2efe9 scored 0 pixels — exactly the "palette changed
// and CI stayed green" regression this test exists to catch. At 0 it scores 100%.
// Area tolerance is 0 for the same reason the per-pixel threshold is: 0.1% still
// waved through 1296 unflagged pixels at 1440x900, which is a whole label or a
// collapsed lane. The comment above argued for zero and then didn't take it.
const FAIL_RATIO = 0;
// ...and an absolute floor of 100 pixels, which is NOT the ratio tolerance removed above.
//
// Two causes were chased down before settling on a floor, and both are now fixed at source:
//   - Browser drift. Both workflows asked setup-chrome for "stable", so the runner moved
//     150.0.7871.128 -> .181 underneath the images and tree-desktop shifted 13px with it.
//     Chrome is now pinned in ci.yml and bless-baselines.yml; that difference is gone.
//   - Stale baselines. The linux set could only be made after the code landed, so master went
//     red on every visual change. `npm run bless:linux` now blesses before master sees it.
//
// What is left is antialiasing on curved and glyph edges under ubuntu: globe-desktop settles
// 66px (0.005%) apart between two page loads in the SAME job with the SAME pinned browser —
// the bless step and its verify step disagree by that much. It reproduces across the
// re-capture below, so it is not a one-shot flake, and no amount of freezing animation,
// fonts, sticky positioning or scroll offsets removes it.
//
// 100px on a 1,296,000px canvas is 0.0077%. It is sized against measurement, not taste: the
// smallest REAL regression tried here — adding letter-spacing to a single <h1> — measured
// 922px, roughly 9x the floor, and the others measured 405,623px (a --bg shift), 144,792px
// (a copy change) and 13,173px (one added button). The old 0.1% ratio would have waved
// through 1,296px, more than a whole label, which is why it is gone. Anything at or above
// this floor still fails at zero ratio, and every sub-floor difference is printed on each run
// so creep stays visible.
const MIN_PIXELS = 100;
const PIXEL_THRESHOLD = 0;
const INCLUDE_AA = true;

// Injected before first paint. Transitions/animations and the blinking caret are the only
// time-dependent things these views paint; killing them makes "settled" mean one thing.
const FREEZE_CSS = `*,*::before,*::after{transition:none!important;animation:none!important;` +
  `caret-color:transparent!important}html{scroll-behavior:auto!important}`;

const sleep = ms => new Promise(r => setTimeout(r, ms));

// Put the page in a canonical state: no autoplay running, nothing focused, no hover
// tooltip left visible, scrolled to the top.
//
// Two things here are load-bearing, both found by SELFCHECK rather than guessed at:
//
//  - document.fonts.ready. The kind pills use geometric glyphs (◇ ◯ △ ▦) that fall back to
//    a non-primary font; capturing before that resolves measures them at a different width.
//  - Neutralising position:sticky. views/table.html has `th{position:sticky;top:0}`. Whether
//    Chrome has promoted that header to its own compositing layer by capture time is a race,
//    and the two outcomes round the table's 0.5px top border to a different device pixel —
//    a 1px × 1126px seam, 0.087% of the frame, i.e. it slipped under the 0.1% gate by luck
//    rather than by design. We capture at scrollY 0, where sticky and static are positioned
//    identically, so pinning them to static costs no coverage and removes the race.
async function settle(page) {
  await page.evaluate(() => document.fonts && document.fonts.ready).catch(() => {});
  await page.evaluate(() => {
    const play = document.getElementById('play');
    if (play && play.classList.contains('on')) play.click();
    document.querySelectorAll('.tip').forEach(el => (el.style.display = 'none'));
    if (document.activeElement && document.activeElement.blur) document.activeElement.blur();
    window.scrollTo(0, 0);
    // window.scrollTo does NOT reset a scrollable DIV. The Timeline, Tree and Relay all pan
    // inside .scroll containers, and Tree/Timeline pin their lane labels off scroll.scrollLeft
    // — so a container left even a pixel off origin shifts every pinned label and the capture
    // stops being reproducible. Reset every scrollable element, not just the window.
    document.querySelectorAll('*').forEach(el => {
      if (el.scrollLeft || el.scrollTop) { el.scrollLeft = 0; el.scrollTop = 0; }
      if (getComputedStyle(el).position === 'sticky') el.style.position = 'static';
    });
    if (typeof pinLabels === 'function') { try { pinLabels(); } catch (e) {} }
  }).catch(() => {});
  await page.evaluate(() => new Promise(r => requestAnimationFrame(() => requestAnimationFrame(r))))
    .catch(() => {});
  await sleep(300);
}

// The golden images are structurally blind to this, by our own choice: settle() pins every
// position:sticky element to static before capture (see the note above), so deleting
// `th{position:sticky;top:0}` from views/table.html would diff exactly zero pixels and pass.
// Coverage traded away has to be bought back explicitly, so assert the behaviour directly:
// load the table for real (no settle, no freeze of position), scroll past the header, and
// require it to still be pinned to the top of the viewport.
// Returns null when it sticks, or a message describing how it does not.
async function stickyCheck(browser) {
  const page = await browser.newPage();
  await page.setViewport(VIEWPORTS[0][1]);
  const err = await page
    .goto(`${HOST}/views/table.html`, { waitUntil: 'networkidle0', timeout: 20000 })
    .then(() => null)
    .catch(e => 'NAV ' + e.message);
  if (err) { await page.close(); return err; }
  await sleep(800);
  const r = await page
    .evaluate(async () => {
      const th = document.querySelector('thead th');
      if (!th) return { error: 'no <th> was rendered' };
      const before = th.getBoundingClientRect().top;
      window.scrollTo(0, 600);
      await new Promise(res => requestAnimationFrame(() => requestAnimationFrame(res)));
      return {
        before,
        after: th.getBoundingClientRect().top,
        y: window.scrollY,
        pos: getComputedStyle(th).position,
      };
    })
    .catch(e => ({ error: e.message }));
  await page.close();
  if (r.error) return r.error;
  // Guard the guard: if the page never scrolled, "header at top" would be vacuously true.
  if (r.y < 600) return `the page did not scroll (scrollY=${r.y}), so nothing was tested`;
  if (r.before < 10) return `the header started at y=${r.before.toFixed(1)}, already at the top`;
  if (Math.abs(r.after) > 1) {
    return `scrolled to ${r.y}, header top is ${r.after.toFixed(1)}px, expected ~0 ` +
      `(computed position:${r.pos}) — the header scrolled away instead of sticking`;
  }
  return null;
}

async function capture(page, url, viewport, errs) {
  await page.setViewport(viewport);
  // Full reload per viewport rather than relying on resize handlers — several views size
  // themselves once at init, so a resized page is not the same page as a freshly loaded one.
  await page.goto(url, { waitUntil: 'networkidle0', timeout: 20000 })
    .catch(e => errs.push('NAV ' + e.message));
  await sleep(1000);
  await settle(page);
  return await page.screenshot();
}

// Returns { pixels, ratio, diff } or { error } if the images are not comparable.
function compare(aBuf, bBuf) {
  const a = PNG.sync.read(aBuf), b = PNG.sync.read(bBuf);
  if (a.width !== b.width || a.height !== b.height) {
    return { error: `size ${b.width}x${b.height} vs baseline ${a.width}x${a.height}` };
  }
  const diff = new PNG({ width: a.width, height: a.height });
  const pixels = pixelmatch(a.data, b.data, diff.data, a.width, a.height,
    { threshold: PIXEL_THRESHOLD, includeAA: INCLUDE_AA });
  return { pixels, ratio: pixels / (a.width * a.height), diff };
}

// Refuse to run against a server we did not start. This script has no try/finally, so any
// throw mid-run orphans its python child; the next run's spawn then fails to bind, the
// error is swallowed by stdio:'ignore', and the whole suite silently tests whatever that
// stale process is serving — a different commit, or a different directory entirely.
// Observed for real: a leftover http.server on 8765 served several "ALL VIEWS CLEAN" runs.
// Probe by REQUEST, not by bind: a stale python http.server holds the IPv6 wildcard
// (*:8765), and binding 127.0.0.1 alongside it succeeds on macOS — so a bind probe
// reports "free" while the orphan is very much alive and will answer every request.
// If anything responds before we start, that is the thing our captures would hit.
const squatter = await fetch(`${HOST}/`, { signal: AbortSignal.timeout(1500) })
  .then(() => true).catch(() => false);
if (squatter) {
  console.log(`FAIL  port ${PORT} is already in use — refusing to test against a server this run did not start.`);
  console.log(`FAIL  Find and kill it:  lsof -nP -iTCP:${PORT} -sTCP:LISTEN`);
  process.exit(1);
}
const srv = spawn('python3', ['-m', 'http.server', String(PORT), '--directory', ROOT], { stdio: 'ignore' });
process.on('exit', () => { try { srv.kill(); } catch {} });   // don't orphan it on a throw
for (const sig of ['SIGINT', 'SIGTERM']) process.on(sig, () => { try { srv.kill(); } catch {} ; process.exit(1); });
await sleep(800);
// Prove the server is actually ours and serving the repo before trusting a single capture.
const probeRes = await fetch(`${HOST}/index.html`).catch(() => null);
if (!probeRes || !probeRes.ok) {
  console.log(`FAIL  server on ${PORT} did not come up (GET /index.html -> ${probeRes ? probeRes.status : 'no response'}).`);
  srv.kill();
  process.exit(1);
}
const browser = await puppeteer.launch({ executablePath: CHROME, headless: 'new', args: ['--no-sandbox', '--force-color-profile=srgb', '--hide-scrollbars', '--font-render-hinting=none'] });

if (UPDATE) console.log(`UPDATE_BASELINE=1 — rewriting ${path.relative(ROOT, BASE)}/, no comparison performed.\n`);
if (SELFCHECK) console.log('SELFCHECK=1 — capturing each view twice, asserting a 0-pixel self-diff.\n');
// A missing baseline set is a HARD FAILURE, never a skip. Skipping printed
// "ALL VIEWS CLEAN" and exited 0 on every Linux CI run while comparing exactly
// zero pixels — which is the precise false-green this test exists to abolish.
// Red until someone blesses the platform is the honest state.
if (NO_PLATFORM_BASELINE) {
  console.log(`FAIL  no golden images for platform "${PLATFORM}" (${path.relative(ROOT, BASE)}/ does not exist).`);
  console.log('FAIL  Golden-image comparison cannot run, so this result proves nothing about rendering.');
  console.log(`FAIL  Bless a set ON THIS PLATFORM and commit it:  UPDATE_BASELINE=1 node test/smoke.mjs`);
  console.log('FAIL  (Baselines are per-platform: the system font stack rasterises differently.)\n');
  process.exit(1);
}
// The rasteriser is whichever Chrome is installed — puppeteer-core downloads nothing, so
// `process.platform` alone is a lie about what produced these pixels. A Chrome auto-update
// silently invalidates every golden image in a set, and at a 0-pixel tolerance it does not
// present as "Chrome changed", it presents as every view failing at once for no reason.
// Record the version that blessed a set and name it as the suspect when it moves.
const BROWSER = await browser.version(); // e.g. "Chrome/150.0.7871.128"
const VERSION_FILE = path.join(BASE, 'browser.txt');
const BLESSED_WITH = !UPDATE && fs.existsSync(VERSION_FILE)
  ? fs.readFileSync(VERSION_FILE, 'utf8').trim()
  : null;
const VERSION_DRIFT = BLESSED_WITH && BLESSED_WITH !== BROWSER;
if (!UPDATE && !SELFCHECK && !NO_PLATFORM_BASELINE) {
  if (VERSION_DRIFT) {
    console.log(`NOTE  browser has changed since these baselines were blessed:`);
    console.log(`NOTE    baseline: ${BLESSED_WITH}`);
    console.log(`NOTE    running:  ${BROWSER}`);
    console.log('NOTE  Any diff below is a Chrome upgrade until proven otherwise. Review the');
    console.log('NOTE  *-diff.png first: a rasteriser change shows as faint noise spread over');
    console.log('NOTE  all text, a real regression shows as a localised block. If it is the');
    console.log(`NOTE  upgrade, re-bless:  UPDATE_BASELINE=1 node test/smoke.mjs\n`);
  } else if (!BLESSED_WITH) {
    console.log(`NOTE  ${path.relative(ROOT, VERSION_FILE)} is missing — the baselines record no browser`);
    console.log(`NOTE  version, so an upgrade cannot be distinguished from a regression. Running`);
    console.log(`NOTE  ${BROWSER}; the next re-bless will record it.\n`);
  }
}

for (const [name, why] of Object.entries(GOLDEN_SKIP)) {
  console.log(`NOTE  ${name} is EXCLUDED from golden-image comparison: ${why}`);
}
if (Object.keys(GOLDEN_SKIP).length) console.log('');

let fail = 0, counts = new Set();
for (const [name, p] of VIEWS) {
  const page = await browser.newPage();
  await page.evaluateOnNewDocument(css => {
    const add = () => {
      const s = document.createElement('style');
      s.textContent = css;
      (document.head || document.documentElement).appendChild(s);
    };
    if (document.head) add(); else document.addEventListener('DOMContentLoaded', add);
  }, FREEZE_CSS);
  const errs = [];
  page.on('console', m => { if (m.type() === 'error') errs.push(m.text()); });
  page.on('pageerror', e => errs.push('PAGEERROR ' + e.message));

  const url = `${HOST}/${p}`;
  const notes = [];
  let c = 0;
  for (const [vp, viewport] of VIEWPORTS) {
    const shot = await capture(page, url, viewport, errs);
    if (vp === 'desktop') c = await page.evaluate(() => (window.CARDS || []).length);
    const tag = `${name}-${vp}`;
    fs.writeFileSync(path.join(SHOT, tag + '.png'), shot);

    if (SELFCHECK) {
      const again = await capture(page, url, viewport, errs);
      const r = compare(shot, again);
      if (r.error || r.pixels > 0) {
        if (r.diff) fs.writeFileSync(path.join(SHOT, tag + '-diff.png'), PNG.sync.write(r.diff));
        fs.writeFileSync(path.join(SHOT, tag + '-b.png'), again);
        notes.push(`${vp} UNSTABLE ${r.error || r.pixels + 'px'}`);
        fail++;
      } else notes.push(`${vp} stable`);
      continue;
    }
    if (UPDATE) { fs.writeFileSync(path.join(BASE, tag + '.png'), shot); continue; }
    if (NO_PLATFORM_BASELINE || GOLDEN_SKIP[name]) continue;

    const golden = path.join(BASE, tag + '.png');
    if (!fs.existsSync(golden)) {
      notes.push(`${vp} NO BASELINE (run UPDATE_BASELINE=1)`);
      fail++;
      continue;
    }
    let r = compare(fs.readFileSync(golden), shot);
    if (r.error) {
      notes.push(`${vp} ${r.error}`);
      fail++;
      continue;
    }
    // RE-CAPTURE ONCE on any difference, and judge on the second capture.
    //
    // This is deliberately NOT a pixel tolerance. A tolerance is a permanent blind spot: it
    // waves through every change under N pixels forever. A real regression is deterministic
    // and reproduces on every capture, so it still fails here. What this absorbs is genuine
    // one-shot rasteriser noise — ubuntu shows an intermittent 13px (0.001%) difference in
    // tree-desktop that survives freezing animation, fonts, sticky and scroll, and that the
    // bless job reproduces against a set it wrote seconds earlier. A flake is reported LOUDLY
    // even when it passes, so it stays visible instead of quietly becoming the norm.
    if (r.pixels > 0) {
      const shot2 = await capture(page, url, viewport, errs);
      const r2 = compare(fs.readFileSync(golden), shot2);
      if (!r2.error && r2.pixels === 0) {
        notes.push(`${vp} FLAKE ${r.pixels}px on capture 1, 0px on capture 2 — passing`);
        continue;
      }
      r = r2.error ? r : r2;
    }
    // Sub-floor difference that reproduced across two captures: cross-runner rasteriser
    // variance (see MIN_PIXELS). Passed, but always printed — if this number ever climbs,
    // it is a regression creeping up, not the noise floor moving.
    if (r.pixels > 0 && r.pixels < MIN_PIXELS) {
      notes.push(`${vp} ${r.pixels}px — under the ${MIN_PIXELS}px antialiasing floor, passing`);
      continue;
    }
    const pct = (r.ratio * 100).toFixed(4);
    if (r.ratio > FAIL_RATIO) {
      const dp = path.join(SHOT, tag + '-diff.png');
      fs.writeFileSync(dp, PNG.sync.write(r.diff));
      notes.push(`${vp} DIFF ${r.pixels}px (${pct}%) -> ${path.relative(ROOT, dp)}`);
      fail++;
    } else {
      // Captures are byte-exact run to run, so anything non-zero but under the gate is a
      // flake forming. Surface it rather than letting it sit silently at 0.09% until the
      // day it tips over — that near-miss is how this test would rot back into a no-op.
      notes.push(`${vp} ${r.pixels}px (${pct}%)` + (r.pixels ? ' WARN nonzero' : ''));
    }
  }

  counts.add(c);
  const banner = await page.$eval('#apperr', el => el.textContent).catch(() => null);
  const smokeBad = errs.length || banner || !c;
  if (smokeBad) fail++;
  const bad = smokeBad || notes.some(n => /UNSTABLE|DIFF|NO BASELINE|size /.test(n));
  console.log(`${bad ? 'FAIL' : 'ok  '} ${name.padEnd(10)} CARDS=${c}  ${notes.join('  |  ')}` + (banner ? `  BANNER:${banner}` : '') + (errs.length ? `  ERR:${errs.slice(0, 3).join(' | ')}` : ''));
  await page.close();
}
const sticky = await stickyCheck(browser);
if (sticky) {
  console.log(`FAIL sticky     views/table.html header does not stick: ${sticky}`);
  console.log('FAIL sticky     (th{position:sticky;top:0} is defeated by any ancestor that is');
  console.log('FAIL sticky      itself a scroll container — check `overflow` on table/.wrap.)');
  // Deliberately NOT counted toward the UPDATE gate. That gate exists because blessing an
  // image captured from a broken page bakes the breakage in permanently — but the captures
  // pin sticky to static regardless, so this defect cannot reach a golden image. Wedging
  // re-blessing on an unrelated behavioural failure only gets the assertion deleted.
  if (!UPDATE) fail++;
} else console.log('ok   sticky     views/table.html header stays pinned at scrollY 600');

await browser.close();
srv.kill();
if (counts.size > 1) { console.log('FAIL card counts differ across views:', [...counts]); fail++; }
// Blessing must not paper over a broken run: console errors and nav timeouts
// still increment `fail` during capture, and blessing a golden image taken from
// a view that errored bakes the breakage into the baseline permanently.
if (UPDATE) {
  if (fail) { console.log(`\n${fail} problem(s) DURING CAPTURE — baselines written but NOT trustworthy; fix and re-bless`); process.exit(1); }
  // Only stamp the version on a set that captured cleanly, and commit this file with the
  // images: a baseline whose rasteriser is unrecorded cannot be diagnosed later.
  fs.writeFileSync(VERSION_FILE, BROWSER + '\n');
  console.log(`\nbaselines written to ${path.relative(ROOT, BASE)}/ (blessed with ${BROWSER})`);
  console.log('review the diff before committing — browser.txt included');
  process.exit(0);
}
if (fail && VERSION_DRIFT) {
  console.log(`\nNOTE  reminder: this run used ${BROWSER}, the baselines were blessed with`);
  console.log(`NOTE  ${BLESSED_WITH}. A browser upgrade is the most likely cause of a`);
  console.log('NOTE  broad, low-amplitude image diff. It does not explain a sticky/console/');
  console.log('NOTE  card-count failure — those are real.');
}
console.log(fail ? `\n${fail} problem(s)` : '\nALL VIEWS CLEAN');
process.exit(fail ? 1 : 0);
