#!/usr/bin/env bash
set -euo pipefail
files=$(git diff --cached --name-only --diff-filter=ACMR | grep -E 'next\.config\.(js|mjs|ts)$' || true)
[ -z "$files" ] && exit 0
for f in $files; do
  grep -Eiq "output\s*:\s*['\"]export['\"]" "$f" && { echo "❌ $f: output:'export' é proibido."; exit 1; }
done