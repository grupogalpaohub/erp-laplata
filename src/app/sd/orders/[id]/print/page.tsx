import { createSupabaseServerClient } from '@/lib/supabaseServer'

export const revalidate = 0
export const dynamic = 'force-dynamic'

export default async function OrderPrint({ params }: { params: { id: string } }) {
  const sb = createSupabaseServerClient()
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
