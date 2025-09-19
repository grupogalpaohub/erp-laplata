#!/usr/bin/env bash
set -euo pipefail

echo "==> 0) Conferências rápidas"
[ -d "frontend" ] || { echo "Faltou diretório 'frontend' na raiz."; exit 1; }

echo "==> 1) Limpeza do repo (arquivos obsoletos/duplicados)"
# Remover app duplicado na raiz (mantemos apenas frontend/app)
rm -rf app/ || true

# Remover backups .bak
find frontend/app -name "*.bak" -type f -delete || true

# Scripts obsoletos (Cloudflare / deploy fake)
rm -f bootstrap_seguro.sh deploy_cloudflare_complete.sh deploy_cloudflare.sh \
      deploy_debug.sh deploy_diagnostic.sh deploy_safe_mode.sh deploy.sh \
      fix_cloudflare_deploy.sh fix_vercel_config.sh fix_vercel_final.sh \
      implement_real_app.sh prepare_production.sh prepare_vercel.sh \
      setup-supabase.sh test_environment.sh || true

# SQL obsoleto
rm -f clear_fake_data.sql deploy_real_data.sql deploy_supabase.sql \
      load_initial_data.sql load_real_data.sql || true

# Dados de exemplo / diagnósticos
rm -f mm_material.txt mm_purchase_order_item.txt mm_purchase_order.txt \
      mm_receiving.txt mm_vendor.txt wh_inventory_balance.txt \
      wh_warehouse.txt edge_diagnostics.txt || true

# Docs antigas
rm -f CLOUDFLARE_PAGES_SETUP.md DEPLOY_INSTRUCTIONS.md SUPABASE_SETUP.md || true

# Configs/testes não usados
rm -f wrangler.toml frontend/supabase_test.mjs frontend/scripts/healthcheck.mjs \
      frontend/cache-clear.js || true

# Libs/componentes duplicados que confundem
rm -f frontend/lib/supabase.ts frontend/lib/supabase/public.ts \
      frontend/lib/data/materials.ts frontend/components/Nav.tsx || true

echo "==> 2) Estrutura: garantir pastas alvo"
mkdir -p frontend/src/lib/supabase
mkdir -p frontend/src/components
mkdir -p frontend/src/app/auth/callback
mkdir -p frontend/src/app/api/logout
mkdir -p frontend/src/app/mm/catalog
mkdir -p frontend/src/app/login

echo "==> 3) Supabase clients (SSR + Browser)"
cat > frontend/src/lib/supabase/server.ts <<'TS'
import { cookies, headers } from 'next/headers'
import { createServerClient } from '@supabase/ssr'

export function supabaseServer() {
  const cookieStore = cookies()
  const hdrs = headers()

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value
        },
        set(name: string, value: string, options: any) {
          cookieStore.set({ name, value, ...options })
        },
        remove(name: string, options: any) {
          cookieStore.set({ name, value: '', ...options })
        },
      },
      headers: {
        'x-forwarded-host': hdrs.get('x-forwarded-host') ?? '',
        'x-forwarded-proto': hdrs.get('x-forwarded-proto') ?? '',
      },
    }
  )
}
TS

cat > frontend/src/lib/supabase/client.ts <<'TS'
'use client'
import { createBrowserClient } from '@supabase/ssr'

export function supabaseBrowser() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
}
TS

echo "==> 4) OAuth callback (troca code -> sessão)"
cat > frontend/src/app/auth/callback/route.ts <<'TS'
import { NextResponse } from 'next/server'
import { supabaseServer } from '@/src/lib/supabase/server'

export async function GET(request: Request) {
  const url = new URL(request.url)
  const code = url.searchParams.get('code')
  const next = url.searchParams.get('next') || '/'

  if (!code) {
    return NextResponse.redirect(new URL(`/login?next=${encodeURIComponent(next)}`, request.url))
  }

  const supabase = supabaseServer()
  const { error } = await supabase.auth.exchangeCodeForSession(code)

  if (error) {
    console.error('OAuth exchange error:', error.message)
    return NextResponse.redirect(new URL(`/login?error=oauth_exchange&next=${encodeURIComponent(next)}`, request.url))
  }

  return NextResponse.redirect(new URL(next, request.url))
}
TS

echo "==> 5) Middleware (Edge-safe, sem loop)"
cat > frontend/src/middleware.ts <<'TS'
import { NextResponse, type NextRequest } from 'next/server'
import { createServerClient } from '@supabase/ssr'

const PUBLIC_PATHS = new Set([
  '/', '/login', '/auth/callback', '/favicon.ico'
])

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl
  const isPublic =
    PUBLIC_PATHS.has(pathname) ||
    pathname.startsWith('/_next/') ||
    pathname.startsWith('/public/') ||
    pathname.startsWith('/assets/')

  // Prepare a mutable response to allow cookie writes by Supabase
  const res = NextResponse.next()

  if (isPublic) return res

  // Edge-safe Supabase client (usa cookies de req/res)
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return req.cookies.get(name)?.value
        },
        set(name: string, value: string, options: any) {
          res.cookies.set({ name, value, ...options })
        },
        remove(name: string, options: any) {
          res.cookies.set({ name, value: '', ...options })
        },
      },
    }
  )

  const { data, error } = await supabase.auth.getUser()

  if (error) {
    console.error('middleware:getUser error:', error.message)
  }

  if (!data?.user) {
    const url = req.nextUrl.clone()
    url.pathname = '/login'
    url.searchParams.set('next', pathname || '/')
    return NextResponse.redirect(url)
  }

  return res
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|public|assets).*)'],
}
TS

echo "==> 6) Página de Login (SSR, sem loop, link Google)"
cat > frontend/src/app/login/page.tsx <<'TSX'
import Link from 'next/link'
import { redirect } from 'next/navigation'
import { supabaseServer } from '@/src/lib/supabase/server'

export default async function LoginPage({ searchParams }: { searchParams: { next?: string } }) {
  const next = searchParams?.next || '/'
  const supabase = supabaseServer()
  const { data: { user } } = await supabase.auth.getUser()

  if (user) redirect(next)

  const siteURL = process.env.NEXT_PUBLIC_SITE_URL || ''
  const googleUrl = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/auth/v1/authorize?provider=google&redirect_to=${encodeURIComponent(`${siteURL}/auth/callback?next=${encodeURIComponent(next)}`)}`

  return (
    <main style={{ padding: '2rem' }}>
      <h1>Entrar</h1>
      <p>Tenant: LaplataLunaria</p>
      <a href={googleUrl}>Continuar com Google</a>
      <p style={{ marginTop: 12 }}>
        <Link href="/">Voltar</Link>
      </p>
    </main>
  )
}
TSX

echo "==> 7) Header único (SSR) + remoção de duplicação"
cat > frontend/src/components/Header.tsx <<'TSX'
import Link from 'next/link'
import { supabaseServer } from '@/src/lib/supabase/server'

export default async function Header() {
  const sb = supabaseServer()
  const { data: { user } } = await sb.auth.getUser()

  return (
    <nav style={{ display:'flex', gap:16, padding:'0.75rem 1rem', borderBottom:'1px solid #eee' }}>
      <Link href="/">Controle</Link>
      <Link href="/mm/catalog">Materiais</Link>
      <Link href="/sd">Vendas</Link>
      <Link href="/wh">Estoque</Link>
      <Link href="/crm">CRM</Link>
      <Link href="/fi">Financeiro</Link>
      <Link href="/analytics">Analytics</Link>
      <span style={{ flex:1 }} />
      {user ? (
        <form action="/api/logout" method="post">
          <button type="submit">Sair</button>
        </form>
      ) : (
        <Link href="/login">Login</Link>
      )}
    </nav>
  )
}
TSX

echo "==> 8) Layout raiz: usa só o Header (evita 2 barras)"
cat > frontend/app/layout.tsx <<'TSX'
import type { Metadata } from 'next'
import Header from '@/src/components/Header'
import './globals.css'

export const metadata: Metadata = {
  title: 'ERP LaPlata',
  description: 'ERP LaPlata - Next.js + Supabase',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR">
      <body>
        {/* Header único */}
        {/* @ts-expect-error Async Server Component */}
        <Header />
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          {children}
        </div>
      </body>
    </html>
  )
}
TSX

echo "==> 9) Home enxuta (sem nav duplicada, sem placeholders confusos)"
cat > frontend/app/page.tsx <<'TSX'
export default function Home() {
  return (
    <main style={{ padding: '1.25rem' }}>
      <h2>Controle</h2>
      <p>Bem-vindo ao ERP LaPlata.</p>
      <ul style={{ marginTop: 12 }}>
        <li><a href="/mm/catalog">Catálogo de Materiais</a></li>
        <li><a href="/sd">Vendas</a> — (em leitura)</li>
        <li><a href="/wh">Estoque</a> — (em leitura)</li>
        <li><a href="/crm">CRM</a> — (em leitura)</li>
        <li><a href="/fi">Financeiro</a> — (em leitura)</li>
        <li><a href="/analytics">Analytics</a> — (em leitura)</li>
      </ul>
    </main>
  )
}
TSX

echo "==> 10) Logout API"
cat > frontend/src/app/api/logout/route.ts <<'TS'
import { NextResponse } from 'next/server'
import { supabaseServer } from '@/src/lib/supabase/server'

export async function POST() {
  const sb = supabaseServer()
  await sb.auth.signOut()
  const base = process.env.NEXT_PUBLIC_SITE_URL || '/'
  return NextResponse.redirect(new URL('/', base))
}
TS

echo "==> 11) Catálogo SSR (view public.v_material_overview)"
cat > frontend/src/app/mm/catalog/page.tsx <<'TSX'
import { supabaseServer } from '@/src/lib/supabase/server'

type Row = {
  tenant_id: string
  sku?: string | null
  mm_comercial?: string | null
  mm_mat_type?: string | null
  mm_mat_class?: string | null
  sales_price_cents?: number | null
  avg_unit_cost_cents?: number | null
}

export const revalidate = 0

export default async function CatalogPage() {
  const sb = supabaseServer()
  const { data: { user } } = await sb.auth.getUser()
  if (!user) {
    return (
      <main style={{ padding: '2rem' }}>
        <h2>Catálogo de Materiais</h2>
        <p>Faça login para ver os materiais.</p>
      </main>
    )
  }

  const { data, error } = await sb
    .from('v_material_overview' as any)
    .select('tenant_id, sku, mm_comercial, mm_mat_type, mm_mat_class, sales_price_cents, avg_unit_cost_cents')
    .order('sku', { ascending: true })
    .limit(300)

  if (error) {
    return (
      <main style={{ padding: '2rem' }}>
        <h2>Catálogo de Materiais</h2>
        <pre style={{ color: 'crimson' }}>Erro ao carregar catálogo: {error.message}</pre>
      </main>
    )
  }

  if (!data || data.length === 0) {
    return (
      <main style={{ padding: '2rem' }}>
        <h2>Catálogo de Materiais</h2>
        <p>Nenhum material encontrado.</p>
      </main>
    )
  }

  return (
    <main style={{ padding: '2rem' }}>
      <h2>Catálogo de Materiais</h2>
      <table cellPadding={6} style={{ borderCollapse: 'collapse', marginTop: 12 }}>
        <thead>
          <tr>
            <th>SKU</th>
            <th>Comercial</th>
            <th>Tipo</th>
            <th>Classe</th>
            <th>Preço (centavos)</th>
            <th>Custo Médio (centavos)</th>
          </tr>
        </thead>
        <tbody>
          {data.map((r: Row, i: number) => (
            <tr key={i}>
              <td>{r.sku}</td>
              <td>{r.mm_comercial}</td>
              <td>{r.mm_mat_type}</td>
              <td>{r.mm_mat_class}</td>
              <td>{r.sales_price_cents ?? ''}</td>
              <td>{r.avg_unit_cost_cents ?? ''}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </main>
  )
}
TSX

echo "==> 12) Garantir dependências mínimas"
# @supabase/ssr já deve existir; se não existir, descomente abaixo:
# npm --prefix frontend i @supabase/ssr

echo "==> 13) Padronizar variáveis de ambiente (local)"
# Ajuste local opcional (não sobrescreve Vercel automaticamente):
grep -q "^NEXT_PUBLIC_SITE_URL=" frontend/.env.local 2>/dev/null || echo "NEXT_PUBLIC_SITE_URL=" >> frontend/.env.local
sed -i 's/^NEXT_PUBLIC_APP_URL=.*$//g' frontend/.env.local 2>/dev/null || true

echo "==> 14) Build local de verificação"
cd frontend
npm run build
echo "==> Build OK. Rode 'npm start' para teste local, depois faça o deploy no Vercel."