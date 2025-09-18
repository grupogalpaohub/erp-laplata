#!/usr/bin/env bash
set -euo pipefail
changed=$(git diff --cached --name-only --diff-filter=ACMR | grep -E '\.sql$' || true)
[ -z "$changed" ] && exit 0
for f in $changed; do
  case "$f" in
    db/migrations/*) ;; 
    *)
      grep -Eiq '\b(DROP|ALTER|TRUNCATE|CREATE\s+TYPE|CREATE\s+EXTENSION|CREATE\s+ENUM)\b' "$f" \
        && { echo "❌ $f: DDL crítico fora de /db/migrations."; exit 1; }
      ;;
  esac
done