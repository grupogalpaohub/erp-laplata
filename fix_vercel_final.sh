#!/usr/bin/env bash
set -euo pipefail

say(){ printf "\n\033[1;34m%s\033[0m\n" "$*"; }
fail(){ printf "\n\033[1;31mERRO:\033[0m %s\n" "$*"; exit 1; }

# ====== CONFIGS ======
APP_DIR="frontend"
BRANCH="erp-git"
PROJECT_NAME="erp-laplata"
VERCEL_TOKEN="${VERCEL_TOKEN:-nzRv8ZFqBVSocI5z5kDNfy7w}"
# =====================

command -v git >/dev/null || fail "git não encontrado"
git fetch origin
git checkout "$BRANCH"
git pull origin "$BRANCH"

[ -d "$APP_DIR/app" ] || fail "Não achei $APP_DIR/app. Root Directory errado?"

# 1) Remover SAFE MODE/OK placeholders
say "1) Limpando quaisquer textos de SAFE MODE/OK"
MATCHES=$(grep -RilE 'SAFE MODE|OK: \/' "$APP_DIR/app" || true)
if [ -n "$MATCHES" ]; then
  while IFS= read -r f; do : > "$f"; done <<< "$MATCHES"
fi

# 2) Supabase client
say "2) Garantindo lib/supabase.ts"
mkdir -p "$APP_DIR/lib"
cat > "$APP_DIR/lib/supabase.ts" <<'TS'
import { createClient } from '@supabase/supabase-js'
const url  = process.env.NEXT_PUBLIC_SUPABASE_URL!
const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
export function supabaseServer() {
  return createClient(url, anon, { auth: { persistSession: false } })
}
TS

# 3) layout/home
say "3) Layout/Home"
cat > "$APP_DIR/app/layout.tsx" <<'TSX'
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

cat > "$APP_DIR/app/page.tsx" <<'TSX'
export default function Page(){ return <div>ERP LaPlata — produção</div> }
TSX
echo 'export default function Loading(){return <div>Carregando…</div>}' > "$APP_DIR/app/loading.tsx"
cat > "$APP_DIR/app/error.tsx" <<'TSX'
'use client'
export default function Error({error}:{error:Error}){ 
  return <pre style={{whiteSpace:'pre-wrap',color:'#b00'}}>Erro: {error.message}</pre>
}
TSX

# 4) /login e /auth/callback
say "4) /login e /auth/callback"
mkdir -p "$APP_DIR/app/login" "$APP_DIR/app/auth/callback"
cat > "$APP_DIR/app/login/page.tsx" <<'TSX'
'use client'
import { createClient } from '@supabase/supabase-js'
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)
export default function Page() {
  const origin = typeof window !== 'undefined'
    ? window.location.origin
    : (process.env.NEXT_PUBLIC_SITE_URL || '')
  const signIn = async () => {
    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: `${origin}/auth/callback` }
    })
  }
  return (<div style={{display:'grid', gap:12}}>
    <h1>Login</h1><button onClick={signIn}>Entrar com Google</button>
  </div>)
}
TSX
cat > "$APP_DIR/app/auth/callback/page.tsx" <<'TSX'
'use client'
import { useEffect } from 'react'
import { createClient } from '@supabase/supabase-js'
import { useRouter } from 'next/navigation'
export default function Callback() {
  const router = useRouter()
  useEffect(() => {
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    )
    supabase.auth.getSession().finally(() => router.replace('/'))
  }, [router])
  return <div>Processando login…</div>
}
TSX

# 5) /mm/catalog (schema real)
say "5) /mm/catalog"
mkdir -p "$APP_DIR/app/mm/catalog"
echo 'export default function Loading(){return <div>Carregando catálogo…</div>}' > "$APP_DIR/app/mm/catalog/loading.tsx"
cat > "$APP_DIR/app/mm/catalog/page.tsx" <<'TSX'
import { supabaseServer } from '@/lib/supabase'
type Row = {
  tenant_id: string
  mm_material: string
  mm_comercial: string
  mm_desc: string
  mm_mat_type: unknown
  mm_mat_class: unknown
  mm_price_cents: number
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
            <Th>SKU</Th><Th>Comercial</Th><Th>Descrição</Th>
            <Th>Categoria</Th><Th>Classificação</Th>
            <Th style={{textAlign:'right'}}>Preço</Th><Th>Status</Th>
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
function Th(p:React.PropsWithChildren<{style?:React.CSSProperties}>){
  return <th style={{borderBottom:'1px solid #ddd', textAlign:'left', padding:'8px', fontWeight:600, ...(p.style||{})}}>{p.children}</th>
}
function Td(p:React.PropsWithChildren<{style?:React.CSSProperties}>){
  return <td style={{borderBottom:'1px solid #eee', padding:'8px', ...(p.style||{})}}>{p.children}</td>
}
TSX

# 6) Stubs neutros pro resto
say "6) Stubs neutros (sem SAFE MODE)"
stub(){ d="$1"; mkdir -p "$d"; echo "export default function Page(){return <div>Em breve…</div>}" > "$d/page.tsx"; }
stub "$APP_DIR/app/setup"; stub "$APP_DIR/app/analytics"
stub "$APP_DIR/app/co/dashboard"; stub "$APP_DIR/app/co/reports"; stub "$APP_DIR/app/co/costs"
stub "$APP_DIR/app/mm/vendors"; stub "$APP_DIR/app/mm/purchases"
stub "$APP_DIR/app/sd"; stub "$APP_DIR/app/sd/orders"; stub "$APP_DIR/app/sd/customers"; stub "$APP_DIR/app/sd/invoices"
stub "$APP_DIR/app/wh/inventory"; stub "$APP_DIR/app/wh/movements"; stub "$APP_DIR/app/wh/reports"
stub "$APP_DIR/app/crm/leads"; stub "$APP_DIR/app/crm/opportunities"; stub "$APP_DIR/app/crm/activities"
stub "$APP_DIR/app/fi/payables"; stub "$APP_DIR/app/fi/receivables"; stub "$APP_DIR/app/fi/cashflow"

# 7) Garantir package.json Next/React
say "7) Garantindo package.json Next/React"
if [ ! -f "$APP_DIR/package.json" ]; then
  cat > "$APP_DIR/package.json" <<'JSON'
{
  "name": "erp-laplata-frontend",
  "private": true,
  "scripts": { "dev": "next dev", "build": "next build", "start": "next start" },
  "dependencies": {
    "@supabase/supabase-js": "2.45.3",
    "next": "14.2.5",
    "react": "18.2.0",
    "react-dom": "18.2.0"
  }
}
JSON
fi

# 8) Commit & push
say "8) Commit & push"
git add "$APP_DIR"
git commit -m "prod: remove SAFE MODE; login/catalog reais; stubs neutros" || true
git push origin "$BRANCH"

# 9) Resetar PROJETO no Vercel via API (remove overrides e força Root Directory)
say "9) Resetando projeto no Vercel (sem overrides; rootDirectory=frontend; node 20.x)"
# pegar id do projeto
PROJECT_ID=$(curl -sS -H "Authorization: Bearer $VERCEL_TOKEN" "https://api.vercel.com/v9/projects?limit=100" \
  | node -e "const fs=require('fs');const j=JSON.parse(fs.readFileSync(0,'utf8'));const p=j.projects.find(x=>x.name==='${PROJECT_NAME}');if(!p){process.exit(2)};process.stdout.write(p.id)")
[ -n "$PROJECT_ID" ] || fail "Não achei o projeto ${PROJECT_NAME} via API"

# aplicar patch removendo overrides e fixando root/node
curl -sS -X PATCH "https://api.vercel.com/v9/projects/${PROJECT_ID}" \
  -H "Authorization: Bearer $VERCEL_TOKEN" \
  -H "Content-Type: application/json" \
  --data '{
    "framework": "nextjs",
    "rootDirectory": "frontend",
    "buildCommand": null,
    "devCommand": null,
    "installCommand": null,
    "outputDirectory": null,
    "nodeVersion": "20.x",
    "productionBranch": "erp-git"
  }' >/dev/null

# 10) Disparar redeploy (CLI se existir) ou push vazio
say "10) Disparando redeploy de produção"
if command -v vercel >/dev/null 2>&1; then
  vercel --prod --yes --token "$VERCEL_TOKEN" --name "$PROJECT_NAME" --cwd "$APP_DIR" || true
else
  git commit --allow-empty -m "chore: trigger redeploy vercel" || true
  git push origin "$BRANCH"
fi

say "✅ Pronto. Quando o build terminar, teste:"
echo " - https://erp-laplata.vercel.app/"
echo " - https://erp-laplata.vercel.app/login"
echo " - https://erp-laplata.vercel.app/mm/catalog"