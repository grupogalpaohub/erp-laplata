import { createSupabaseServerClient } from '@/lib/supabaseServer'
import Link from 'next/link'
import { DataTable } from '@/src/components/DataTable'

export const revalidate = 0

export default async function OrderDetail({ params }: { params: { id: string } }) {
  const sb = createSupabaseServerClient()
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
