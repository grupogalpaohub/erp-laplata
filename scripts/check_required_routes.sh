#!/usr/bin/env bash
set -euo pipefail
APP_DIR="${1:-.}"
miss=()
need(){ [ -f "$APP_DIR/app/$1/page.tsx" ] || miss+=("$1"); }
need "" ; need "login" ; need "setup" ; need "analytics"
need "co/dashboard" ; need "co/reports" ; need "co/costs"
need "mm/catalog"  ; need "mm/vendors" ; need "mm/purchases"
need "sd" ; need "sd/orders" ; need "sd/customers" ; need "sd/invoices"
need "wh/inventory" ; need "wh/movements" ; need "wh/reports"
need "crm/leads" ; need "crm/opportunities" ; need "crm/activities"
need "fi/payables" ; need "fi/receivables" ; need "fi/cashflow"
if [ ${#miss[@]} -gt 0 ]; then
  echo "❌ Rotas obrigatórias ausentes (crie-as, sem dummy):"
  for r in "${miss[@]}"; do echo " - app/$r/page.tsx"; done
  exit 1
fi