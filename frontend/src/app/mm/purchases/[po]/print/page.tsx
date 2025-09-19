import { supabaseServer } from "@/src/lib/supabase/server";

export default async function PrintPO({ params }:{ params:{ po:string } }){
  const sb = await supabaseServer()
  const { data: h } = await sb.from('mm_purchase_order').select('*').eq('mm_order', params.po).single()
  const { data: it } = await sb.from('mm_purchase_order_item').select('*').eq('mm_order', params.po).order('row_no')
  return (
    <html lang="pt-br"><body>
      <div style={{ maxWidth:900, margin:'0 auto', fontFamily:'ui-sans-serif, system-ui' }}>
        <h1>Pedido de Compra {params.po}</h1>
        <p><b>Fornecedor:</b> {h?.vendor_id} &nbsp; <b>Status:</b> {h?.status} &nbsp; <b>Data:</b> {String(h?.po_date??'').slice(0,10)}</p>
        <table width="100%" cellPadding={6} style={{ borderCollapse:'collapse' }}>
          <thead><tr style={{ background:'#f3f4f6' }}>
            <th align="left">#</th><th align="left">SKU</th><th align="right">Qtde</th><th align="right">Custo</th><th align="right">Total</th>
          </tr></thead>
          <tbody>
            {(it??[]).map((r:any)=>(
              <tr key={r.row_no} style={{ borderTop:'1px solid #e5e7eb' }}>
                <td>{r.row_no}</td><td>{r.mm_material}</td><td align="right">{r.mm_qtt}</td><td align="right">{r.unit_cost_cents}</td><td align="right">{r.line_total_cents}</td>
              </tr>
            ))}
            <tr style={{ borderTop:'2px solid #111827' }}>
              <td colSpan={4} align="right"><b>Total</b></td>
              <td align="right"><b>{h?.total_amount ?? 0}</b></td>
            </tr>
          </tbody>
        </table>
        <p style={{ marginTop:24 }}>
          <button onClick={()=>window.print()} style={{ padding:'8px 12px', background:'#111827', color:'#fff', borderRadius:8 }}>Imprimir / Salvar PDF</button>
        </p>
      </div>
    </body></html>
  )
}
