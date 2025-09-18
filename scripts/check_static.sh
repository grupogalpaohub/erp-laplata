#!/usr/bin/env bash
set -euo pipefail
bad=$(git diff --cached --name-only --diff-filter=ACMR | grep -Ei '(^|/)(public/.*\.(html|htm)$|\.vercel/output/static/.*\.html$|^out/)' || true)
[ -z "$bad" ] || { echo "❌ HTML/estático proibido:"; echo "$bad"; exit 1; }
bad2=$(git diff --cached --name-only --diff-filter=ACMR | grep -E '^(\.vercel/|out/)' || true)
[ -z "$bad2" ] || { echo "❌ Artefatos de build no commit:"; echo "$bad2"; exit 1; }
bad3=$(git diff --cached --name-only --diff-filter=ACMR | grep -E '(^|/)_(worker|_worker)\.js$' || true)
[ -z "$bad3" ] || { echo "❌ _worker.js manual é proibido:"; echo "$bad3"; exit 1; }