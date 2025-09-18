#!/usr/bin/env bash
set -euo pipefail

# ======== CONFIG ========
APP_DIR="frontend"
VERCEL_TOKEN="${VERCEL_TOKEN:-nzRv8ZFqBVSocI5z5kDNfy7w}"   # se já exportou, mantém; senão usa o que você me passou
PROJECT_NAME="erp-laplata"
PROD_BRANCH="erp-git"
# ========================

say(){ printf "\n\033[1;34m%s\033[0m\n" "$*"; }
fail(){ printf "\n\033[1;31mERRO:\033[0m %s\n" "$*"; exit 1; }

command -v git >/dev/null   || fail "git não encontrado"
command -v node >/dev/null  || fail "node não encontrado"
command -v npm  >/dev/null  || fail "npm não encontrado"

# 0) Garantir branch de trabalho
say "0) Garantindo branch ${PROD_BRANCH}"
git fetch origin
git checkout "${PROD_BRANCH}"
git pull origin "${PROD_BRANCH}"

# 1) Detectar pasta do app
[ -d "${APP_DIR}/app" ] || fail "Não achei ${APP_DIR}/app (root errado?)."

# 2) Supabase client (somente leitura no front)
say "2) Supabase client (anon, só leitura)"
mkdir -p "${APP_DIR}/lib"
cat > "${APP_DIR}/lib/supabase.ts" <<'TS'
import { createClient } from '@supabase/supabase-js'
const url = process.env.NEXT_PUBLIC_SUPABASE_URL!
const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
export function supabaseServer() {
  return createClient(url, anon, { auth: { persistSession: false } })
}
TS

# 3) Layout padrão (tira SAFE MODE) + home simples
say "3) Layout + Home (sem safe-mode)"
cat > "${APP_DIR}/app/layout.tsx" <<'TSX'
export default function RootLayout({children}:{children:React.ReactNode}) {
  return (
    <html lang="pt-BR">
      <body style={{fontFamily:'ui-sans-serif', margin:0}}>
        <nav style={{padding:12,borderBottom:'1px solid #eee',display:'flex',gap:12,flexWrap:'wrap'}}>
          <a href="/">home</a>
          <a href="/login">login</a>
          <a href="/setup">setup</a>
          <a href="/analytics">analytics</a>

          <a href="/co/dashboard">co/dashboard</a>
          <a href="/co/reports">co/reports</a>
          <a href="/co/costs">co/costs</a>

          <a href="/mm/catalog">mm/catalog</a>
          <a href="/mm/vendors">mm/vendors</a>
          <a href="/mm/purchases">mm/purchases</a>

          <a href="/sd">sd</a>
          <a href="/sd/orders">sd/orders</a>
          <a href="/sd/customers">sd/customers</a>
          <a href="/sd/invoices">sd/invoices</a>

          <a href="/wh/inventory">wh/inventory</a>
          <a href="/wh/movements">wh/movements</a>
          <a href="/wh/reports">wh/reports</a>

          <a href="/crm/leads">crm/leads</a>
          <a href="/crm/opportunities">crm/opportunities</a>
          <a href="/crm/activities">crm/activities</a>

          <a href="/fi/payables">fi/payables</a>
          <a href="/fi/receivables">fi/receivables</a>
          <a href="/fi/cashflow">fi/cashflow</a>
        </nav>
        <main style={{padding:24}}>{children}</main>
      </body>
    </html>
  )
}
TSX

cat > "${APP_DIR}/app/page.tsx" <<'TSX'
export default function Page(){ return <div>ERP LaPlata</div> }
TSX

# 4) Estados globais
say "4) Estados globais loading/error"
cat > "${APP_DIR}/app/loading.tsx" <<'TSX'
export default function Loading(){ return <div>Carregando…</div> }
TSX

cat > "${APP_DIR}/app/error.tsx" <<'TSX'
'use client'
export default function Error({error}:{error:Error}){ 
  return <pre style={{whiteSpace:'pre-wrap',color:'#b00'}}>Erro: {error.message}</pre>
}
TSX

# 5) /mm/catalog lendo EXATAMENTE o schema real (sem suposição)
say "5) Implementando /mm/catalog (schema real)"
mkdir -p "${APP_DIR}/app/mm/catalog"
cat > "${APP_DIR}/app/mm/catalog/loading.tsx" <<'TSX'
export default function Loading(){ return <div>Carregando catálogo…</div> }
TSX

cat > "${APP_DIR}/app/mm/catalog/page.tsx" <<'TSX'
import { supabaseServer } from '@/lib/supabase'

type Row = {
  tenant_id: string
  mm_material: string      // SKU (chave real que você usa)
  mm_comercial: string     // nome comercial
  mm_desc: string          // descrição
  mm_mat_type: unknown     // enum real
  mm_mat_class: unknown    // enum real
  mm_price_cents: number   // preço em centavos
  status: string | null
}

export const dynamic = 'force-dynamic'

export default async function Page(){
  const sb = supabaseServer()
  const { data, error } = await sb
    .from<Row>('mm_material')
    .select('tenant_id, mm_material, mm_comercial, mm_desc, mm_mat_type, mm_mat_class, mm_price_cents, status')
    .order('mm_material', { ascending: true })
    .limit(300)

  if (error) throw new Error(`mm_material: ${error.message}`)
  if (!data || data.length === 0) return <div>Nenhum material encontrado.</div>

  return (
    <div style={{display:'grid', gap:16}}>
      <h1>Catálogo de Materiais</h1>
      <table style={{borderCollapse:'collapse', width:'100%'}}>
        <thead>
          <tr>
            <Th>SKU</Th>
            <Th>Comercial</Th>
            <Th>Descrição</Th>
            <Th>Categoria</Th>
            <Th>Classificação</Th>
            <Th style={{textAlign:'right'}}>Preço</Th>
            <Th>Status</Th>
          </tr>
        </thead>
        <tbody>
          {data.map(r=>(
            <tr key={r.mm_material}>
              <Td>{r.mm_material}</Td>
              <Td>{r.mm_comercial}</Td>
              <Td>{r.mm_desc}</Td>
              <Td>{String(r.mm_mat_type)}</Td>
              <Td>{String(r.mm_mat_class)}</Td>
              <Td style={{textAlign:'right'}}>R$ {(r.mm_price_cents/100).toFixed(2)}</Td>
              <Td>{r.status ?? ''}</Td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

function Th(props:React.PropsWithChildren<{style?:React.CSSProperties}>){
  return <th style={{borderBottom:'1px solid #ddd', textAlign:'left', padding:'8px', fontWeight:600, ...(props.style||{})}}>{props.children}</th>
}
function Td(props:React.PropsWithChildren<{style?:React.CSSProperties}>){
  return <td style={{borderBottom:'1px solid #eee', padding:'8px', ...(props.style||{})}}>{props.children}</td>
}
TSX

# 6) Stubs das demais rotas (evitar 404 enquanto conectamos dados)
say "6) Placeholders nas demais rotas (sem 404)"
make_stub(){ d="$1"; mkdir -p "$d"; cat > "$d/page.tsx" <<'TSX'
export default function Page(){ return <div>Em breve…</div> }
TSX
}
make_stub "${APP_DIR}/app/login"
make_stub "${APP_DIR}/app/setup"
make_stub "${APP_DIR}/app/analytics"
make_stub "${APP_DIR}/app/co/dashboard"
make_stub "${APP_DIR}/app/co/reports"
make_stub "${APP_DIR}/app/co/costs"
make_stub "${APP_DIR}/app/mm/vendors"
make_stub "${APP_DIR}/app/mm/purchases"
make_stub "${APP_DIR}/app/sd"
make_stub "${APP_DIR}/app/sd/orders"
make_stub "${APP_DIR}/app/sd/customers"
make_stub "${APP_DIR}/app/sd/invoices"
make_stub "${APP_DIR}/app/wh/inventory"
make_stub "${APP_DIR}/app/wh/movements"
make_stub "${APP_DIR}/app/wh/reports"
make_stub "${APP_DIR}/app/crm/leads"
make_stub "${APP_DIR}/app/crm/opportunities"
make_stub "${APP_DIR}/app/crm/activities"
make_stub "${APP_DIR}/app/fi/payables"
make_stub "${APP_DIR}/app/fi/receivables"
make_stub "${APP_DIR}/app/fi/cashflow"

# 7) Commit & push (Vercel vai buildar a branch erp-git)
say "7) Commit & push"
git add "${APP_DIR}/lib/supabase.ts" \
        "${APP_DIR}/app/layout.tsx" \
        "${APP_DIR}/app/page.tsx" \
        "${APP_DIR}/app/loading.tsx" \
        "${APP_DIR}/app/error.tsx" \
        "${APP_DIR}/app/mm/catalog" \
        "${APP_DIR}/app/login" "${APP_DIR}/app/setup" "${APP_DIR}/app/analytics" \
        "${APP_DIR}/app/co/dashboard" "${APP_DIR}/app/co/reports" "${APP_DIR}/app/co/costs" \
        "${APP_DIR}/app/mm/vendors" "${APP_DIR}/app/mm/purchases" \
        "${APP_DIR}/app/sd" "${APP_DIR}/app/sd/orders" "${APP_DIR}/app/sd/customers" "${APP_DIR}/app/sd/invoices" \
        "${APP_DIR}/app/wh/inventory" "${APP_DIR}/app/wh/movements" "${APP_DIR}/app/wh/reports" \
        "${APP_DIR}/app/crm/leads" "${APP_DIR}/app/crm/opportunities" "${APP_DIR}/app/crm/activities" \
        "${APP_DIR}/app/fi/payables" "${APP_DIR}/app/fi/receivables" "${APP_DIR}/app/fi/cashflow"
git commit -m "feat: sair do SAFE MODE; /mm/catalog ligado ao schema real mm_material" || true
git push origin "${PROD_BRANCH}"

# 8) Disparar deploy no Vercel (se quiser forçar agora)
if ! command -v vercel >/dev/null 2>&1; then npm i -g vercel >/dev/null 2>&1 || true; fi
if command -v vercel >/dev/null 2>&1; then
  say "8) Disparando deploy (Vercel CLI)…"
  vercel --token "$VERCEL_TOKEN" --prod --yes --name "$PROJECT_NAME" --cwd "$APP_DIR" || true
else
  say "8) Vercel CLI não encontrada; o deploy será acionado pelo push."
fi

say "✅ Pronto. Assim que o Vercel terminar o build da branch ${PROD_BRANCH}, teste:"
echo "   https://${PROJECT_NAME}.vercel.app/mm/catalog"