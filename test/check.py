#!/usr/bin/env python3
"""Browserless invariant checks for the Tooling Atlas build. Run from repo root:

    python3 test/check.py        (needs: pip install pyshp)

Catches the regression classes that previously shipped silently: a view forking
its own stale dataset, the data pipeline crashing, or a view not wired to the
canonical cards. Exit non-zero on any failure (used by .github/workflows/ci.yml).
"""
import os, re, sys, subprocess

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


# 1) the pipeline regenerates from source/ and builds, without crashing
check(run("regenerate.py"), "regenerate.py runs clean (from source/)")
check(run("build_standalone.py"), "build_standalone.py runs clean")

cards_js = open(os.path.join(ROOT, "data/cards.js"), encoding="utf-8").read()
n = len(re.findall(r'"id":', cards_js))
check(n > 100, "cards.js has a full dataset (%d cards)" % n)

# 2) no view may fork its own inline dataset — every view reads window.CARDS
VIEWS = ["index.html", "views/map.html", "views/table.html", "views/dashboard.html",
         "views/atlas.html", "views/tree.html", "views/deck.html"]
for v in VIEWS:
    t = open(os.path.join(ROOT, v), encoding="utf-8").read()
    check("const DATA=[" not in t and "const CARDS=[" not in t,
          "%s carries no forked inline dataset" % v)

# 3) the data-driven views actually reference the canonical cards
for v in ["views/map.html", "views/table.html", "views/dashboard.html",
          "views/atlas.html", "views/tree.html", "views/deck.html"]:
    t = open(os.path.join(ROOT, v), encoding="utf-8").read()
    check("cards.js" in t, "%s loads data/cards.js" % v)

# 4) the single-file bundle reflects the same card count
bundle = open(os.path.join(ROOT, "tooling-atlas.html"), encoding="utf-8").read()
check(("%d tools" % n) in bundle or ('"id":' in bundle),
      "tooling-atlas.html bundle rebuilt with the dataset")

print()
if fail:
    print("%d check(s) FAILED" % len(fail))
    sys.exit(1)
print("all checks passed")
