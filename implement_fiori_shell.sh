#!/usr/bin/env bash
set -euo pipefail

echo "==> 0) Pastas base"
mkdir -p frontend/src/components
mkdir -p frontend/src/lib/queries
mkdir -p frontend/src/app/{sd,mm,wh}
mkdir -p frontend/src/app/sd/orders/[id]

echo "==> 1) DataTable genérico (SSR-friendly)"
cat > frontend/src/components/DataTable.tsx <<'TSX'
'use client'
import * as React from 'react'

type Props = {
  rows: Record<string, any>[]
  columns?: string[] // opcional: forçar ordem
  emptyLabel?: string
}
export default function DataTable({ rows, columns, emptyLabel }: Props) {
  if (!rows || rows.length === 0) return <p>{emptyLabel ?? 'Nenhum registro encontrado.'}</p>
  const cols = columns && columns.length ? columns : Array.from(new Set(rows.flatMap(r => Object.keys(r))))
  return (
    <div style={{ overflowX:'auto' }}>
      <table cellPadding={8} style={{ borderCollapse:'collapse', width:'100%', minWidth: 960 }}>
        <thead>
          <tr>
            {cols.map(c => <th key={c} style={{ textAlign:'left', borderBottom:'1px solid #eee', fontWeight:600 }}>{c}</th>)}
          </tr>
        </thead>
        <tbody>
          {rows.map((r, i) => (
            <tr key={i} style={{ borderBottom:'1px solid #f6f6f6' }}>
              {cols.map(c => <td key={c} style={{ verticalAlign:'top' }}>{formatCell(r[c])}</td>)}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

function formatCell(v: any) {
  if (v === null || v === undefined) return ''
  if (typeof v === 'number') return v
  if (typeof v === 'object') return JSON.stringify(v)
  return String(v)
}
TSX

echo "==> 2) FioriShell (sidebar fixa + header)"
cat > frontend/src/components/FioriShell.tsx <<'TSX'
import Link from 'next/link'
import { supabaseServer } from '@/src/lib/supabase/server'

export default async function FioriShell({ children }: { children: React.ReactNode }) {
  const sb = supabaseServer()
  const { data: { user } } = await sb.auth.getUser()

  return (
    <div style={{ display:'grid', gridTemplateColumns:'220px 1fr', minHeight:'100vh' }}>
      <aside style={{ borderRight:'1px solid #eee', padding:'1rem', position:'sticky', top:0, height:'100vh' }}>
        <h3 style={{ margin:0, fontWeight:700 }}>ERP LaPlata</h3>
        <nav style={{ display:'grid', gap:8, marginTop:12 }}>
          <strong>Controle</strong>
          <Link href="/">Home</Link>

          <strong style={{ marginTop:16 }}>Materiais (MM)</strong>
          <Link href="/mm/catalog">Catálogo</Link>
          <Link href="/mm/vendors">Fornecedores</Link>

          <strong style={{ marginTop:16 }}>Estoque (WH)</strong>
          <Link href="/wh/inventory">Inventário</Link>

          <strong style={{ marginTop:16 }}>Vendas (SD)</strong>
          <Link href="/sd">Visão de Vendas</Link>
          <Link href="/sd/orders">Pedidos</Link>

          <strong style={{ marginTop:16, opacity:.6 }}>Em breve</strong>
          <span style={{ opacity:.6 }}>CRM</span>
          <span style={{ opacity:.6 }}>Financeiro</span>
          <span style={{ opacity:.6 }}>Analytics</span>
        </nav>
      </aside>

      <div style={{ display:'flex', flexDirection:'column' }}>
        <header style={{ borderBottom:'1px solid #eee', padding:'0.75rem 1rem', display:'flex', alignItems:'center', gap:16 }}>
          <nav style={{ display:'flex', gap:16 }}>
            <Link href="/">Controle</Link>
            <Link href="/mm/catalog">Materiais</Link>
            <Link href="/wh/inventory">Estoque</Link>
            <Link href="/sd/orders">Vendas</Link>
          </nav>
          <span style={{ flex:1 }} />
          {user ? (
            <form action="/api/logout" method="post"><button type="submit">Sair</button></form>
          ) : (
            <Link href="/login">Login</Link>
          )}
        </header>
        <main style={{ padding:'1rem 1.25rem' }}>
          {children}
        </main>
      </div>
    </div>
  )
}
TSX

echo "==> 3) Layout root usa FioriShell (remove Header duplicado)"
cat > frontend/src/app/layout.tsx <<'TSX'
import type { Metadata } from 'next'
import FioriShell from '@/src/components/FioriShell'
import './globals.css'

export const metadata: Metadata = {
  title: 'ERP LaPlata',
  description: 'ERP LaPlata - Next.js + Supabase',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR">
      <body>
        {/* @ts-expect-error Async Server Component */}
        <FioriShell>{children}</FioriShell>
      </body>
    </html>
  )
}
TSX

echo "==> 4) Home com KPIs reais"
cat > frontend/src/app/page.tsx <<'TSX'
import { supabaseServer } from '@/src/lib/supabase/server'

export const revalidate = 0

async function kpiCount(sb: ReturnType<typeof supabaseServer>, table: string) {
  const { count } = await sb.from(table as any).select('*', { count: 'exact', head: true })
  return count ?? 0
}

export default async function Home() {
  const sb = supabaseServer()
  const [materials, stockItems, salesOrders] = await Promise.all([
    kpiCount(sb, 'v_material_overview'),
    kpiCount(sb, 'wh_inventory_balance'),
    kpiCount(sb, 'sd_sales_order'),
  ])

  return (
    <>
      <h2>Controle</h2>
      <div style={{ display:'grid', gridTemplateColumns:'repeat(4, minmax(180px, 1fr))', gap:12, margin:'12px 0 24px' }}>
        <KPI title="Materiais" value={materials} hint="v_material_overview" />
        <KPI title="Itens com estoque" value={stockItems} hint="wh_inventory_balance" />
        <KPI title="Pedidos de venda" value={salesOrders} hint="sd_sales_order" />
      </div>

      <div style={{ display:'grid', gridTemplateColumns:'repeat(3, minmax(220px, 1fr))', gap:12 }}>
        <Tile href="/mm/catalog" title="Catálogo de Materiais" subtitle="Lista e preços" />
        <Tile href="/wh/inventory" title="Inventário" subtitle="Saldos por SKU" />
        <Tile href="/sd/orders" title="Pedidos de Venda" subtitle="Lista e detalhe" />
      </div>
    </>
  )
}

function KPI({ title, value, hint }: { title:string, value:number|string, hint?:string }) {
  return (
    <div style={{ border:'1px solid #eee', borderRadius:12, padding:'14px' }}>
      <div style={{ fontSize:12, color:'#666' }}>{title}</div>
      <div style={{ fontSize:28, fontWeight:700, lineHeight:'32px' }}>{value}</div>
      {hint ? <div style={{ fontSize:12, color:'#999' }}>{hint}</div> : null}
    </div>
  )
}
function Tile({ href, title, subtitle }: { href:string, title:string, subtitle?:string }) {
  return (
    <a href={href} style={{ display:'block', border:'1px solid #eee', borderRadius:16, padding:'16px', textDecoration:'none' }}>
      <div style={{ fontWeight:600 }}>{title}</div>
      {subtitle && <div style={{ color:'#666', fontSize:12 }}>{subtitle}</div>}
    </a>
  )
}
TSX

echo "==> 5) MM > Vendors (colunas reais flexíveis)"
mkdir -p frontend/src/app/mm/vendors
cat > frontend/src/app/mm/vendors/page.tsx <<'TSX'
import { supabaseServer } from '@/src/lib/supabase/server'
import DataTable from '@/src/components/DataTable'

export const revalidate = 0

export default async function VendorsPage() {
  const sb = supabaseServer()
  const { data, error } = await sb.from('mm_vendor' as any).select('*').order('name', { ascending: true }).limit(500)
  if (error) return <main><h2>Fornecedores</h2><pre style={{ color:'crimson' }}>{error.message}</pre></main>
  return (
    <main>
      <h2>Fornecedores</h2>
      <DataTable rows={(data ?? []) as any[]} />
    </main>
  )
}
TSX

echo "==> 6) WH > Inventário (saldo por SKU/depósito)"
mkdir -p frontend/src/app/wh/inventory
cat > frontend/src/app/wh/inventory/page.tsx <<'TSX'
import { supabaseServer } from '@/src/lib/supabase/server'
import DataTable from '@/src/components/DataTable'

export const revalidate = 0

export default async function InventoryPage() {
  const sb = supabaseServer()
  const { data, error } = await sb
    .from('wh_inventory_balance' as any)
    .select('tenant_id, plant_id, mm_material, on_hand_qty, reserved_qty, last_count_date, status')
    .order('mm_material', { ascending: true })
    .limit(1000)
  if (error) return <main><h2>Inventário</h2><pre style={{ color:'crimson' }}>{error.message}</pre></main>
  return (
    <main>
      <h2>Inventário</h2>
      <DataTable rows={(data ?? []) as any[]} />
    </main>
  )
}
TSX

echo "==> 7) SD > Visão e Pedidos (lista + detalhe + impressão)"
mkdir -p frontend/src/app/sd
cat > frontend/src/app/sd/page.tsx <<'TSX'
export default function SDHome() {
  return (
    <main>
      <h2>Vendas</h2>
      <ul>
        <li><a href="/sd/orders">Pedidos de Venda</a></li>
      </ul>
    </main>
  )
}
TSX

mkdir -p frontend/src/app/sd/orders
cat > frontend/src/app/sd/orders/page.tsx <<'TSX'
import { supabaseServer } from '@/src/lib/supabase/server'
import Link from 'next/link'
import DataTable from '@/src/components/DataTable'

export const revalidate = 0

export default async function OrdersList() {
  const sb = supabaseServer()

  // Pedidos
  const { data: orders, error } = await sb
    .from('sd_sales_order' as any)
    .select('tenant_id, so_id, customer_id, status, total_cents, created_at')
    .order('created_at', { ascending: false })
    .limit(300)

  if (error) return <main><h2>Pedidos de Venda</h2><pre style={{ color:'crimson' }}>{error.message}</pre></main>

  // Mapa de clientes (id -> nome) se existir customer
  let customers: Record<string,string> = {}
  if (orders && orders.length) {
    const customerIds = Array.from(new Set(orders.map(o => o.customer_id).filter(Boolean)))
    if (customerIds.length) {
      const { data: cust } = await sb.from('crm_customer' as any).select('customer_id, name').in('customer_id', customerIds)
      customers = Object.fromEntries((cust ?? []).map((c:any) => [c.customer_id, c.name]))
    }
  }

  const rows = (orders ?? []).map((o:any) => ({
    so_id: o.so_id,
    customer: customers[o.customer_id] ?? o.customer_id ?? '',
    status: o.status,
    total_cents: o.total_cents,
    created_at: o.created_at,
    _link: `/sd/orders/${o.so_id}`
  }))

  return (
    <main>
      <h2>Pedidos de Venda</h2>
      {rows.length === 0 ? <p>Nenhum pedido encontrado.</p> :
        <>
          <div style={{ margin:'8px 0 12px' }}>
            <small>Clique na linha para abrir o detalhe.</small>
          </div>
          <div style={{ overflowX:'auto' }}>
            <table cellPadding={8} style={{ borderCollapse:'collapse', width:'100%', minWidth: 960 }}>
              <thead><tr><th>SO</th><th>Cliente</th><th>Status</th><th>Total (cents)</th><th>Criado em</th><th>Ações</th></tr></thead>
              <tbody>
                {rows.map((r:any) => (
                  <tr key={r.so_id} style={{ borderBottom:'1px solid #f2f2f2' }}>
                    <td>{r.so_id}</td>
                    <td>{r.customer}</td>
                    <td>{r.status}</td>
                    <td>{r.total_cents}</td>
                    <td>{r.created_at}</td>
                    <td><Link href={r._link}>Abrir</Link> | <a href={`${r._link}/print`} target="_blank">Imprimir</a></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      }
    </main>
  )
}
TSX

mkdir -p frontend/src/app/sd/orders/[id]
cat > frontend/src/app/sd/orders/[id]/page.tsx <<'TSX'
import { supabaseServer } from '@/src/lib/supabase/server'
import Link from 'next/link'
import DataTable from '@/src/components/DataTable'

export const revalidate = 0

export default async function OrderDetail({ params }: { params: { id: string } }) {
  const sb = supabaseServer()
  const so_id = params.id

  const { data: order, error } = await sb
    .from('sd_sales_order' as any)
    .select('tenant_id, so_id, customer_id, status, total_cents, created_at')
    .eq('so_id', so_id)
    .single()

  if (error) return <main><h2>Pedido {so_id}</h2><pre style={{ color:'crimson' }}>{error.message}</pre></main>
  if (!order) return <main><h2>Pedido {so_id}</h2><p>Não encontrado.</p></main>

  let customerName = order.customer_id
  const { data: cust } = await sb.from('crm_customer' as any).select('customer_id, name').eq('customer_id', order.customer_id).maybeSingle?.() ?? {}
  if (cust && (cust as any).name) customerName = (cust as any).name

  const { data: items, error: itemsErr } = await sb
    .from('sd_sales_order_item' as any)
    .select('so_id, mm_material, quantity, unit_price_cents, line_total_cents')
    .eq('so_id', so_id)
    .order('mm_material', { ascending: true })

  return (
    <main>
      <h2>Pedido {order.so_id}</h2>
      <p><strong>Cliente:</strong> {customerName}</p>
      <p><strong>Status:</strong> {order.status}</p>
      <p><strong>Total (cents):</strong> {order.total_cents}</p>
      <p><Link href="/sd/orders">Voltar</Link> | <a href={`/sd/orders/${order.so_id}/print`} target="_blank">Imprimir</a></p>
      <h3>Itens</h3>
      {itemsErr ? <pre style={{ color:'crimson' }}>{itemsErr.message}</pre> : <DataTable rows={(items ?? []) as any[]} />}
    </main>
  )
}
TSX

mkdir -p frontend/src/app/sd/orders/[id]/print
cat > frontend/src/app/sd/orders/[id]/print/page.tsx <<'TSX'
import { supabaseServer } from '@/src/lib/supabase/server'

export const revalidate = 0
export const dynamic = 'force-dynamic'

export default async function OrderPrint({ params }: { params: { id: string } }) {
  const sb = supabaseServer()
  const so_id = params.id
  const { data: order } = await sb.from('sd_sales_order' as any).select('*').eq('so_id', so_id).single()
  const { data: items } = await sb.from('sd_sales_order_item' as any).select('*').eq('so_id', so_id).order('mm_material', { ascending: true })

  return (
    <html lang="pt-BR">
      <body style={{ fontFamily:'ui-sans-serif, system-ui', padding: 24 }}>
        <h2>Pedido de Venda #{so_id}</h2>
        <p><strong>Status:</strong> {order?.status} &nbsp; | &nbsp; <strong>Total (cents):</strong> {order?.total_cents}</p>
        <table cellPadding={8} style={{ width:'100%', borderCollapse:'collapse', marginTop:12 }}>
          <thead><tr><th>SKU</th><th>Qtd</th><th>Preço (cents)</th><th>Total (cents)</th></tr></thead>
          <tbody>
            {(items ?? []).map((it:any, i:number) => (
              <tr key={i} style={{ borderBottom:'1px solid #eee' }}>
                <td>{it.mm_material}</td>
                <td>{it.quantity}</td>
                <td>{it.unit_price_cents}</td>
                <td>{it.line_total_cents}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <script>window.print()</script>
      </body>
    </html>
  )
}
TSX

echo "==> 8) (Opcional) MM > Catálogo já existente — garantimos apenas revalidate 0"
# Não sobrescrevemos se você já ajustou; se quiser, descomente abaixo para forçar.
# sed -i '' '1s/^/export const revalidate = 0\n/' frontend/src/app/mm/catalog/page.tsx || true

echo "==> 9) Remover Header antigo se existir (evita barra dupla)"
rm -f frontend/src/components/Header.tsx frontend/app/Header.tsx 2>/dev/null || true

echo "==> 10) Lembrete: middleware já deve liberar /, /login, /auth/callback e proteger módulos"
echo "Pronto. Builda e testa."