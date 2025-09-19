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
      <DataTable columns={cols as any} rows={rows as any} />
    </main>
  )
}
