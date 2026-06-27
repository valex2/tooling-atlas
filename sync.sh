#!/usr/bin/env bash
# Sync the atlas from the Obsidian vault.
#   1. regenerate data/cards.js + data/countries.js from the vault
#   2. bundle the card + thread markdown into source/ (keeps the repo self-contained)
#   3. stage everything for commit
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

# 1) regenerate the data the views read
VAULT="$VAULT" python3 regenerate.py

# 2) bundle the markdown source (so the repo carries the cards, not just the derived JS)
rm -rf source && mkdir -p source
cp "$VAULT"/"Tooling Card - "*.md source/ 2>/dev/null || true
cp "$VAULT"/"Thread - "*.md     source/ 2>/dev/null || true
echo "bundled $(ls source | wc -l) source notes into source/"

# 3) stage
git add -A
echo
echo "Staged. Review:  git status"
echo "Publish:         git commit -m 'sync' && git push"
