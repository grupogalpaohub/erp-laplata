#!/usr/bin/env bash
set -euo pipefail
echo "→ Login DEV (use TEST_EMAIL/TEST_PASSWORD exportadas no seu shell)"
curl -s -o /dev/null -w "status: %{http_code}\n" -X POST http://localhost:3000/auth/dev-login
echo "→ Sessão:"
curl -s http://localhost:3000/debug/session; echo
