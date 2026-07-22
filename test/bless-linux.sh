#!/usr/bin/env bash
# Refresh the linux golden baselines for the CURRENT working tree, without ever
# pushing a red commit to master.
#
# WHY THIS EXISTS
# Golden images are per-platform (the views use the system font stack, so macOS and
# ubuntu rasterise differently) and the linux set can only be produced on a linux
# runner. That used to mean every visual change went:
#
#     push code  ->  CI RED (linux baselines stale)  ->  dispatch bless by hand
#                ->  download artifact  ->  commit  ->  push again  ->  CI green
#
# Master was red in between, by construction, on every visual change. Seven of this
# repo's CI failures were exactly that and nothing else.
#
# Instead: snapshot the working tree to a throwaway remote branch, bless THERE, pull
# the images back, and leave them in the tree so they ride along in the same commit as
# the change that caused them. Master only ever sees the finished pair.
#
#   ./test/bless-linux.sh          # then: git add -A && git commit && git push
#
# The snapshot never moves HEAD, never checks out a branch, and never touches your
# working tree: it writes a commit OBJECT straight from the index and pushes that.
# Needs the gh CLI, authenticated. Cleans up its remote branch on exit.
set -euo pipefail
cd "$(dirname "$0")/.."

command -v gh >/dev/null || { echo "gh CLI not found"; exit 1; }

BR="bless-tmp-$$"
cleanup() { git push -q origin --delete "$BR" 2>/dev/null || true; }
trap cleanup EXIT

# Stage everything, then build a commit object from the index WITHOUT moving HEAD.
git add -A
TREE=$(git write-tree)
SHA=$(git commit-tree "$TREE" -p HEAD -m "temp: bless linux baselines")
echo "==> snapshot $SHA -> origin/$BR (working tree untouched)"
git push -q origin "$SHA:refs/heads/$BR"

echo "==> dispatching bless-baselines on $BR"
gh workflow run bless-baselines.yml --ref "$BR" >/dev/null
sleep 12

RID=""
for _ in $(seq 1 20); do
  RID=$(gh run list --workflow=bless-baselines.yml --branch "$BR" --limit 1 \
        --json databaseId --jq '.[0].databaseId // empty' 2>/dev/null || true)
  [ -n "$RID" ] && break
  sleep 6
done
[ -n "$RID" ] || { echo "could not find the dispatched run"; exit 1; }
echo "==> run $RID"

OK=""
for _ in $(seq 1 60); do
  S=$(gh run view "$RID" --json status,conclusion --jq '"\(.status) \(.conclusion)"' 2>/dev/null || echo "")
  case "$S" in
    completed*success*) OK=1; echo "==> bless succeeded"; break ;;
    completed*) echo "==> bless FAILED ($S)"; gh run view "$RID" --log-failed | tail -30; exit 1 ;;
  esac
  sleep 15
done
[ -n "$OK" ] || { echo "timed out waiting for the bless run"; exit 1; }

TMP=$(mktemp -d)
gh run download "$RID" -n baseline-linux -D "$TMP"
mkdir -p test/baseline/linux
cp "$TMP"/* test/baseline/linux/
rm -rf "$TMP"

echo
echo "==> linux baselines refreshed:"
git status --short test/baseline/linux/ || echo "   (unchanged)"
echo "    Commit them together with the change that caused them."
