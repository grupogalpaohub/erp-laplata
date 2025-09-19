#!/usr/bin/env bash
set -euo pipefail

echo "==> Criar diretórios dos módulos"
mkdir -p frontend/app/mm/{vendors,purchases,receiving}
mkdir -p frontend/app/wh/inventory
mkdir -p frontend/src/components

echo "==> Componente simples de tabela reutilizável (sem libs)"
cat > frontend/src/components/DataTable.tsx <<'TSX'
type Col<T> = { key: keyof T; header: string; width?: string }
export function DataTable<T extends Record<string, any>>({
  columns, rows, emptyText = 'Nenhum registro encontrado.'
}: { columns: Col<T>[]; rows: T[]; emptyText?: string }) {
  if (!rows || rows.length === 0) {
    return <p style={{ padding: 8, color: '#666' }}>{emptyText}</p>
  }
  return (
    <div style={{ overflowX: 'auto' }}>
      <table cellPadding={6} style={{ borderCollapse:'collapse', width:'100%', minWidth:720 }}>
        <thead>
          <tr>
            {columns.map((c,i)=>(
              <th key={i} style={{ textAlign:'left', borderBottom:'1px solid #eee', whiteSpace:'nowrap', width:c.width }}>{c.header}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((r,i)=>(
            <tr key={i} style={{ borderBottom:'1px solid #f2f2f2' }}>
              {columns.map((c,j)=>(
                <td key={j} style={{ whiteSpace:'nowrap' }}>
                  {r[c.key] as any}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
TSX

echo "==> MM • Fornecedores (mm_vendor)"
cat > frontend/app/mm/vendors/page.tsx <<'TSX'
import { supabaseServer } from '@/src/lib/supabase/server'
import { DataTable } from '@/src/components/DataTable'

type Row = {
  vendor_id: string
  vendor_name: string | null
  email: string | null
  telefone: string | null
  cidade: string | null
  estado: string | null
  vendor_rating: string | null
}

export const revalidate = 0

export default async function VendorsPage() {
  const sb = supabaseServer()
  const { data, error } = await sb
    .from('mm_vendor' as any)
    .select('vendor_id,vendor_name,email,telefone,cidade,estado,vendor_rating')
    .order('vendor_name', { ascending: true })
    .limit(500)

  if (error) {
    return <main style={{ padding: '1.25rem' }}>
      <h2>Fornecedores</h2>
      <pre style={{ color:'crimson' }}>{error.message}</pre>
    </main>
  }

  const cols = [
    { key: 'vendor_id', header: 'ID' },
    { key: 'vendor_name', header: 'Fornecedor' },
    { key: 'email', header: 'Email' },
    { key: 'telefone', header: 'Telefone' },
    { key: 'cidade', header: 'Cidade' },
    { key: 'estado', header: 'UF' },
    { key: 'vendor_rating', header: 'Rating' },
  ] as const

  return (
    <main style={{ padding: '1.25rem' }}>
      <h2>Fornecedores</h2>
      <DataTable<Row> columns={cols as any} rows={(data || []) as any} />
    </main>
  )
}
TSX

echo "==> MM • Pedidos de Compra (mm_purchase_order + itens)"
cat > frontend/app/mm/purchases/page.tsx <<'TSX'
import { supabaseServer } from '@/src/lib/supabase/server'
import { DataTable } from '@/src/components/DataTable'

type PO = {
  mm_order: string
  vendor_id: string | null
  status: string | null
  po_date: string | null
  expected_delivery: string | null
  notes: string | null
  total_cents?: number | null
  vendor_name?: string | null
}

export const revalidate = 0

export default async function PurchaseOrdersPage() {
  const sb = supabaseServer()

  // Pedidos
  const { data: orders, error: e1 } = await sb
    .from('mm_purchase_order' as any)
    .select('mm_order,vendor_id,status,po_date,expected_delivery,notes')
    .order('po_date', { ascending: false })
    .limit(300)

  if (e1) {
    return <main style={{ padding: '1.25rem' }}>
      <h2>Pedidos de Compra</h2>
      <pre style={{ color:'crimson' }}>{e1.message}</pre>
    </main>
  }

  const orderIds = (orders || []).map(o => o.mm_order)
  let totals: Record<string, number> = {}
  let vendors: Record<string, string> = {}

  if (orderIds.length) {
    // Itens → somar total por pedido
    const { data: items } = await sb
      .from('mm_purchase_order_item' as any)
      .select('mm_order,line_total_cents')
      .in('mm_order', orderIds)

    for (const it of items || []) {
      const k = (it as any).mm_order as string
      const v = Number((it as any).line_total_cents || 0)
      totals[k] = (totals[k] || 0) + v
    }

    // Vendors → nome
    const vendorIds = Array.from(new Set((orders || []).map(o => o.vendor_id).filter(Boolean))) as string[]
    if (vendorIds.length) {
      const { data: vds } = await sb
        .from('mm_vendor' as any)
        .select('vendor_id,vendor_name')
        .in('vendor_id', vendorIds)
      for (const v of vds || []) vendors[(v as any).vendor_id] = (v as any).vendor_name
    }
  }

  const rows: PO[] = (orders || []).map(o => ({
    ...o,
    total_cents: totals[o.mm_order] || 0,
    vendor_name: vendors[o.vendor_id || ''] || o.vendor_id
  }))

  const cols = [
    { key: 'mm_order', header: 'Pedido' },
    { key: 'po_date', header: 'Data' },
    { key: 'vendor_name', header: 'Fornecedor' },
    { key: 'status', header: 'Status' },
    { key: 'expected_delivery', header: 'Entrega Prev.' },
    { key: 'total_cents', header: 'Total (centavos)' },
    { key: 'notes', header: 'Obs' },
  ] as const

  return (
    <main style={{ padding: '1.25rem' }}>
      <h2>Pedidos de Compra</h2>
      <DataTable<PO> columns={cols as any} rows={rows as any} />
    </main>
  )
}
TSX

echo "==> MM • Recebimentos (mm_receiving)"
cat > frontend/app/mm/receiving/page.tsx <<'TSX'
import { supabaseServer } from '@/src/lib/supabase/server'
import { DataTable } from '@/src/components/DataTable'

type Row = {
  mm_order: string
  plant_id: string | null
  mm_material: string | null
  qty_received: number | null
  received_at: string | null
}

export const revalidate = 0

export default async function ReceivingPage() {
  const sb = supabaseServer()
  const { data, error } = await sb
    .from('mm_receiving' as any)
    .select('mm_order,plant_id,mm_material,qty_received,received_at')
    .order('received_at', { ascending: false })
    .limit(500)

  if (error) {
    return <main style={{ padding: '1.25rem' }}>
      <h2>Recebimentos</h2>
      <pre style={{ color:'crimson' }}>{error.message}</pre>
    </main>
  }

  const cols = [
    { key: 'received_at', header: 'Recebido em' },
    { key: 'mm_order', header: 'Pedido' },
    { key: 'plant_id', header: 'Depósito' },
    { key: 'mm_material', header: 'Material' },
    { key: 'qty_received', header: 'Qtde' },
  ] as const

  return (
    <main style={{ padding: '1.25rem' }}>
      <h2>Recebimentos</h2>
      <DataTable<Row> columns={cols as any} rows={(data || []) as any} />
    </main>
  )
}
TSX

echo "==> WH • Saldo de Estoque (wh_inventory_balance)"
cat > frontend/app/wh/inventory/page.tsx <<'TSX'
import { supabaseServer } from '@/src/lib/supabase/server'
import { DataTable } from '@/src/components/DataTable'

type Row = {
  plant_id: string | null
  mm_material: string | null
  on_hand_qty: number | null
  reserved_qty: number | null
  last_count_date: string | null
  status: string | null
}

export const revalidate = 0

export default async function InventoryBalancePage() {
  const sb = supabaseServer()
  const { data, error } = await sb
    .from('wh_inventory_balance' as any)
    .select('plant_id,mm_material,on_hand_qty,reserved_qty,last_count_date,status')
    .order('mm_material', { ascending: true })
    .limit(1000)

  if (error) {
    return <main style={{ padding: '1.25rem' }}>
      <h2>Inventário</h2>
      <pre style={{ color:'crimson' }}>{error.message}</pre>
    </main>
  }

  const cols = [
    { key: 'plant_id', header: 'Depósito' },
    { key: 'mm_material', header: 'Material' },
    { key: 'on_hand_qty', header: 'Em mãos' },
    { key: 'reserved_qty', header: 'Reservado' },
    { key: 'last_count_date', header: 'Último inventário' },
    { key: 'status', header: 'Status' },
  ] as const

  return (
    <main style={{ padding: '1.25rem' }}>
      <h2>Inventário</h2>
      <DataTable<Row> columns={cols as any} rows={(data || []) as any} />
    </main>
  )
}
TSX

echo "==> Atualizar Home com links diretos (sem placeholder)"
cat > frontend/app/page.tsx <<'TSX'
export default function Home() {
  return (
    <main style={{ padding: '1.25rem' }}>
      <h2>Controle</h2>
      <ul style={{ marginTop: 12 }}>
        <li><a href="/mm/catalog">Catálogo de Materiais</a></li>
        <li><a href="/mm/vendors">Fornecedores</a></li>
        <li><a href="/mm/purchases">Pedidos de Compra</a></li>
        <li><a href="/mm/receiving">Recebimentos</a></li>
        <li><a href="/wh/inventory">Inventário</a></li>
      </ul>
      <p style={{ marginTop: 16, color:'#666' }}>Módulos de Vendas, CRM e Financeiro entram na próxima etapa.</p>
    </main>
  )
}
TSX

echo "==> Build"
cd frontend
npm run build