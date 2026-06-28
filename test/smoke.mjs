// Visual smoke test: load every view in headless Chrome, assert no console errors
// and no in-app error banner, confirm the card count is consistent, and write
// desktop + mobile screenshots to test/shots/. Local dev tool (not run in CI).
//
//   npm i puppeteer-core      # one-time, into this folder
//   node test/smoke.mjs
//
// Uses your installed Chrome; override with CHROME=/path/to/chrome.
import puppeteer from 'puppeteer-core';
import http from 'http';
import { spawn } from 'child_process';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.dirname(HERE);
const SHOT = path.join(HERE, 'shots');
const PORT = 8765;
const CHROME = process.env.CHROME || (process.platform === 'darwin'
  ? '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'
  : '/usr/bin/google-chrome');
fs.mkdirSync(SHOT, { recursive: true });

const VIEWS = [
  ['home', 'index.html'], ['globe', 'views/map.html'], ['timeline', 'views/atlas.html'],
  ['tree', 'views/tree.html'], ['deck', 'views/deck.html'], ['table', 'views/table.html'],
  ['dashboard', 'views/dashboard.html'],
];

const srv = spawn('python3', ['-m', 'http.server', String(PORT), '--directory', ROOT], { stdio: 'ignore' });
await new Promise(r => setTimeout(r, 800));
const browser = await puppeteer.launch({ executablePath: CHROME, headless: 'new', args: ['--no-sandbox', '--force-color-profile=srgb'] });
let fail = 0, counts = new Set();
for (const [name, p] of VIEWS) {
  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 900 });
  const errs = [];
  page.on('console', m => { if (m.type() === 'error') errs.push(m.text()); });
  page.on('pageerror', e => errs.push('PAGEERROR ' + e.message));
  await page.goto(`http://localhost:${PORT}/${p}`, { waitUntil: 'networkidle0', timeout: 20000 }).catch(e => errs.push('NAV ' + e.message));
  await new Promise(r => setTimeout(r, 1000));
  const banner = await page.$eval('#apperr', el => el.textContent).catch(() => null);
  const c = await page.evaluate(() => (window.CARDS || []).length);
  counts.add(c);
  await page.screenshot({ path: `${SHOT}/${name}-desktop.png` });
  await page.setViewport({ width: 390, height: 844 });
  await new Promise(r => setTimeout(r, 500));
  await page.screenshot({ path: `${SHOT}/${name}-mobile.png` });
  const bad = errs.length || banner || !c;
  if (bad) fail++;
  console.log(`${bad ? 'FAIL' : 'ok  '} ${name.padEnd(10)} CARDS=${c}` + (banner ? `  BANNER:${banner}` : '') + (errs.length ? `  ERR:${errs.slice(0, 3).join(' | ')}` : ''));
  await page.close();
}
await browser.close();
srv.kill();
if (counts.size > 1) { console.log('FAIL card counts differ across views:', [...counts]); fail++; }
console.log(fail ? `\n${fail} problem(s)` : '\nALL VIEWS CLEAN');
process.exit(fail ? 1 : 0);
