#!/usr/bin/env bash
set -euo pipefail
files=$(git diff --cached --name-only --diff-filter=ACMR | grep -E 'package\.json$' || true)
[ -z "$files" ] && exit 0
for f in $files; do
  build=$(jq -r '.scripts.build // empty' "$f" 2>/dev/null || true)
  dev=$(jq -r  '.scripts.dev   // empty' "$f" 2>/dev/null || true)
  [[ "$build" =~ next\ build ]] || { echo "❌ $f: scripts.build deve ser 'next build'."; exit 1; }
  [[ "$build" =~ export ]] && { echo "❌ $f: proibido 'next export'."; exit 1; }
  [[ "$dev"   =~ next\ dev   ]] || { echo "❌ $f: scripts.dev deve ser 'next dev'."; exit 1; }
done