import { supabaseServer } from '@/src/lib/supabase/server'
import Link from 'next/link'
import { DataTable } from '@/src/components/DataTable'

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
    const customerIds = Array.from(new Set(orders.map((o: any) => o.customer_id).filter(Boolean)))
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
