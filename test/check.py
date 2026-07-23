#!/usr/bin/env python3
"""Browserless invariant checks for the Tooling Atlas build. Run from repo root:

    python3 test/check.py        (needs: pip install pyshp)

Catches the regression classes that previously shipped silently: a view forking
its own stale dataset, the data pipeline crashing, or a view not wired to the
canonical cards. Exit non-zero on any failure (used by .github/workflows/ci.yml).
"""
import os, re, sys, glob, subprocess

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
fail = []


def check(cond, msg):
    print(("ok   " if cond else "FAIL ") + msg)
    if not cond:
        fail.append(msg)


def run(script):
    r = subprocess.run([sys.executable, script], cwd=ROOT, capture_output=True, text=True)
    if r.returncode != 0:
        print(r.stdout + r.stderr)
    return r.returncode == 0


# 1) the derived files in the tree must be EXACTLY what source/ regenerates to.
#
# Without this the checks below are self-fulfilling: regenerate.py OVERWRITES
# data/cards.js|json|countries.js and the bundle, so asserting against those files after
# running it only proves the generator agrees with itself — the tree's data/ could be
# arbitrarily stale versus its own source/ and everything downstream would still pass.
#
# Snapshot the derived files FIRST, then regenerate+build, then compare bytes. This is a
# pure working-tree property — independent of git staging/HEAD, so it means the same thing
# in CI (clean checkout) and in a dirty local tree mid-edit. `git diff` was wrong here: it
# compares working-tree-vs-index, so staging a stale file silences it.
DERIVED = ["data/cards.js", "data/cards.json", "data/countries.js", "tooling-atlas.html"]
def snap(paths):
    out = {}
    for p in paths:
        fp = os.path.join(ROOT, p)
        out[p] = open(fp, "rb").read() if os.path.exists(fp) else None
    return out

before = snap(DERIVED)
check(run("regenerate.py"), "regenerate.py runs clean (from source/)")
check(run("build_standalone.py"), "build_standalone.py runs clean")
after = snap(DERIVED)
stale = [p for p in DERIVED if before[p] != after[p]]
if stale:
    print("  -> stale in the tree: " + ", ".join(stale))
    print("  -> re-run regenerate.py + build_standalone.py and commit the result")
check(not stale, "tree's derived files match a fresh build (no drift from source/)")

cards_js = open(os.path.join(ROOT, "data/cards.js"), encoding="utf-8").read()
n = len(re.findall(r'"id":', cards_js))
check(n > 100, "cards.js has a full dataset (%d cards)" % n)

# 2) no view may fork its own inline dataset — every view reads window.CARDS.
#
# Scanned over every view .html AND every views/*.js: listing only the .html files let the
# guard be sidestepped by lifting an inline <script> out into a .js file.
#
# Two patterns, because the old single one -- `(const|let|var) (DATA|CARDS) = [` -- keyed on
# both the name and the declaration syntax, and a fork controls both. `window.DATA=[`,
# `const cards=[` and `const DATA = JSON.parse("[...]")` all sailed straight through it.
#
#   SHAPE: an assignment whose right-hand side is an array of card-shaped objects, or a
#     JSON.parse of a string literal. Name- and declaration-agnostic on purpose: a forked
#     dataset is recognisable by its payload no matter what it is called.
#   NAME: an array literal assigned to a dataset name in any form (const/let/var, window.X,
#     or bare reassignment). Deliberately narrow on both ends so it cannot fire on ordinary
#     code: only these three names, and only NON-EMPTY literals -- which keeps accumulators
#     (`const rows = []`) and the legal alias every view uses
#     (`const DATA = window.CARDS || []`, views/atlas.html, views/browse.js) passing.
# SHAPE: an array of objects whose first key is `id` — the primary key every card
#   carries and that legends/series/config arrays essentially never do. Keying on `name`
#   or `year` (both common) made this fire on `const LEGEND=[{name:"x"}]`; requiring `id`
#   removes that whole false-positive class while still catching a lifted card literal.
FORK_SHAPE = re.compile(
    r"""=\s*(?:\[\s*\{\s*["']?id["']?\s*:"""                      # = [{ id: ... / = [{"id":
    r"""|JSON\s*\.\s*parse\s*\(\s*["'`]\s*\[\s*\{)"""             # = JSON.parse("[{...
)
# NAME: the canonical dataset names reassigned to a non-empty literal. Case-SENSITIVE:
#   with IGNORECASE (and the bare line-start alt) `  data = [1,2,3]` and `cards = [x]`
#   — ordinary lowercase locals — both fired. The real names are always capitalised.
FORK_NAME = re.compile(
    r"""(?:\b(?:const|let|var)\s+|\bwindow\s*\.\s*|^[ \t]*)"""    # decl | window. | bare
    r"""(?:DATA|CARDS|DATASET)\b\s*=\s*\[\s*[^\s\]]""",           # = [ <something>
    re.MULTILINE,
)


def forked(text):
    return FORK_SHAPE.search(text) or FORK_NAME.search(text)
# shared.js is loaded by every view and is where a fork would do the most damage, yet it
# was excluded — scan it too. ta.js is the new first-loaded primitives file (same blast
# radius). index.html plus every views/* html+js plus shared.js plus ta.js.
SCANNED = ["index.html", "shared.js", "ta.js"] + sorted(
    os.path.relpath(p, ROOT) for p in glob.glob(os.path.join(ROOT, "views", "*.html"))
    + glob.glob(os.path.join(ROOT, "views", "*.js"))
)
check(len(SCANNED) >= 11, "fork guard scans every view file (%d scanned)" % len(SCANNED))
for v in SCANNED:
    t = open(os.path.join(ROOT, v), encoding="utf-8").read()
    check(not forked(t), "%s carries no forked inline dataset" % v)

# 3) the data-driven views actually reference the canonical cards. Deck/Table/Dashboard are
# now redirect stubs (no cards.js), consolidated into views/browse.html — assert that instead.
for v in ["views/map.html", "views/browse.html",
          "views/atlas.html", "views/tree.html", "views/relay.html"]:
    t = open(os.path.join(ROOT, v), encoding="utf-8").read()
    check("cards.js" in t, "%s loads data/cards.js" % v)

# 3a) every view loads ta.js FIRST — shared.js's rebuildById builds on window.TA.byId, so a
# view that pulls shared.js without ta.js ahead of it throws at load. Order matters, so assert
# the ta.js <script> tag precedes the shared.js one. Match the tag, not the bare filename:
# "shared.js" also appears in prose comments (map.html), which a substring search misreads.
TA_TAG = re.compile(r'<script src="[^"]*\bta\.js"')
SHARED_TAG = re.compile(r'<script src="[^"]*\bshared\.js"')
for v in ["index.html", "views/map.html", "views/browse.html",
          "views/atlas.html", "views/tree.html", "views/relay.html"]:
    t = open(os.path.join(ROOT, v), encoding="utf-8").read()
    mta, msh = TA_TAG.search(t), SHARED_TAG.search(t)
    check(bool(mta) and bool(msh) and mta.start() < msh.start(),
          "%s loads ta.js before shared.js" % v)

# 3b) the region invariant. Geography is derived exactly once, in regenerate.py, and emitted
# per card. Assert the emitted shape so a pipeline change that drops or empties it fails here
# rather than as a blank swimlane in the Timeline.
import json
cards_data = json.loads(open(os.path.join(ROOT, "data/cards.json"), encoding="utf-8").read())
check(all(isinstance(c.get("region"), str) and c["region"] for c in cards_data),
      "every card in cards.json carries a non-empty region")
check(all(isinstance(c.get("regionOrd"), int) and not isinstance(c.get("regionOrd"), bool)
          for c in cards_data),
      "every card in cards.json carries an integer regionOrd")
check(all(c.get("regionGroup") and c.get("regionSub") for c in cards_data),
      "every card in cards.json carries regionGroup and regionSub")

# 3c) no view re-derives geography. region/regionGroup/regionSub are DATA; a view that reads
# them never needs a country->lane table or a US-subdivision keyword match. These markers only
# appear in such a table (they used to, in the Timeline), so their presence in any view file is
# a re-fork of the geography database this split exists to prevent. Grep-guard, like the fork
# guard above.
GEO_MARKERS = re.compile(
    r"GEOGROUP|SUBLABEL|COUNTRY_LANE|Continental Europe|US Northeast|US Midwest"
    r"|Silicon Valley / California|US \(other\)")
for v in sorted(glob.glob(os.path.join(ROOT, "views", "*.html"))
                + glob.glob(os.path.join(ROOT, "views", "*.js"))):
    rel = os.path.relpath(v, ROOT)
    t = open(v, encoding="utf-8").read()
    check(not GEO_MARKERS.search(t), "%s does not re-derive geography (region is data)" % rel)

# 4) the single-file bundle reflects the same card count.
#
# The old form was `("%d tools" % n) in bundle or ('"id":' in bundle)` — the `or` meant any
# bundle containing card-shaped data at all passed, so a stale bundle built against a
# different dataset sailed through. Both halves are now asserted, and separately.
#
# build_standalone.py inlines each view as an escaped JS string, so the card keys appear as
# \"id\": in the file. Requiring the total to be exactly n per embedded copy pins the bundle
# to the current card count rather than merely to "some cards are present".
bundle = open(os.path.join(ROOT, "tooling-atlas.html"), encoding="utf-8").read()
emb = bundle.count("window.CARDS=[")
ids = bundle.count('\\"id\\":')
check(emb > 0, "tooling-atlas.html embeds the card dataset (%d copies)" % emb)
check(emb > 0 and ids == emb * n,
      "every embedded copy carries exactly %d cards (found %d ids across %d copies)" % (n, ids, emb))
check(("%d tools" % n) in bundle,
      'tooling-atlas.html metadata says "%d tools"' % n)

print()
if fail:
    print("%d check(s) FAILED" % len(fail))
    sys.exit(1)
print("all checks passed")
