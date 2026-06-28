#!/usr/bin/env bash
# Sync the atlas from the Obsidian vault.
#   1. bundle the card + thread markdown from the vault into source/  (the SOURCE OF TRUTH)
#   2. regenerate data/cards.js + data/cards.json + data/countries.js FROM source/
#   3. build the single-file offline bundle (tooling-atlas.html)
#   4. stage everything for commit
#
# source/ is what the repo ships and what regeneration reads, so the atlas is
# reproducible from the repo alone — the vault is only needed for step 1.
#
# Usage:  ./sync.sh            (uses the default vault path below)
#         VAULT=/path ./sync.sh
set -euo pipefail
cd "$(dirname "$0")"
VAULT="${VAULT:-/Users/Vassilis/Documents/Obsidian Vault}"

if [ ! -d "$VAULT" ]; then echo "Vault not found: $VAULT" >&2; exit 1; fi
echo "Vault: $VAULT"

# 0) deps
python3 -c "import shapefile" 2>/dev/null || pip install pyshp --quiet

# 1) bundle the markdown source — the repo carries the cards, not just derived JS.
#    The off-card *Curator's note:* (private author commentary) is stripped here;
#    Front/Back card faces and frontmatter are kept.
rm -rf source && mkdir -p source
python3 - "$VAULT" <<'PY'
import sys, os, re, glob, shutil
vault, out = sys.argv[1], "source"
for p in glob.glob(os.path.join(vault, "Thread - *.md")):
    shutil.copy(p, out)
n = 0
for p in glob.glob(os.path.join(vault, "Tooling Card - *.md")):
    t = open(p, encoding="utf-8").read()
    t2 = re.sub(r'\n\*Curator.*\Z', '\n', t, flags=re.S)   # drop curator note -> EOF
    if t2 != t: n += 1
    open(os.path.join(out, os.path.basename(p)), "w", encoding="utf-8").write(t2)
print("stripped curator notes from %d card files" % n)
PY
echo "bundled $(ls source | wc -l) source notes into source/ (curator notes excluded)"

# 2) regenerate the data the views read — FROM source/, not the vault
python3 regenerate.py

# 3) build the single-file offline bundle (tooling-atlas.html)
python3 build_standalone.py

# 4) stage
git add -A
echo
echo "Staged. Review:  git status"
echo "Publish:         git commit -m 'sync' && git push"
