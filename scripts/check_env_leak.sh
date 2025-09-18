#!/usr/bin/env bash
set -euo pipefail
bad=$(git diff --cached --name-only --diff-filter=ACMR | grep -E '^(\.env($|\.|/)|.*\/\.env($|\.|/))' || true)
[ -z "$bad" ] || { echo "❌ Não commitar .env:"; echo "$bad"; exit 1; }