import Link from "next/link";
import { supabaseServer } from "@/src/lib/supabase/server";

export const revalidate = 0

export default async function PODetail({ params }:{ params:{ po:string }}){
  const sb = await supabaseServer()
  const { data: header } = await sb.from('mm_purchase_order').select('*').eq('mm_order', params.po).single()
  const { data: items } = await sb.from('mm_purchase_order_item').select('*').eq('mm_order', params.po).order('row_no')
  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-bold">Pedido {params.po}</h1>
        <Link className="underline" href={`/mm/purchases/${params.po}/print`} target="_blank">Imprimir</Link>
      </div>
      {!header ? <div>Pedido não encontrado.</div> : (
        <>
          <div className="mb-3 text-sm text-gray-700">
            <div><b>Fornecedor:</b> {header.vendor_id}</div>
            <div><b>Status:</b> {header.status}</div>
            <div><b>Data:</b> {String(header.po_date??'').slice(0,10)} &nbsp; <b>Entrega:</b> {String(header.expected_delivery??'').slice(0,10)}</div>
          </div>
          <table className="min-w-full">
            <thead className="bg-gray-50"><tr>
              <th className="px-2 py-1 text-left">#</th>
              <th className="px-2 py-1 text-left">SKU</th>
              <th className="px-2 py-1 text-left">Qtde</th>
              <th className="px-2 py-1 text-left">Custo</th>
              <th className="px-2 py-1 text-left">Total</th>
            </tr></thead>
            <tbody>
              {(items??[]).map((it:any)=>(
                <tr key={it.row_no} className="border-t">
                  <td className="px-2 py-1">{it.row_no}</td>
                  <td className="px-2 py-1">{it.mm_material}</td>
                  <td className="px-2 py-1">{it.mm_qtt}</td>
                  <td className="px-2 py-1">{it.unit_cost_cents}</td>
                  <td className="px-2 py-1">{it.line_total_cents}</td>
                </tr>
              ))}
              <tr className="border-t">
                <td className="px-2 py-1" colSpan={4}><b>Total</b></td>
                <td className="px-2 py-1"><b>{header.total_amount ?? 0}</b></td>
              </tr>
            </tbody>
          </table>
        </>
      )}
    </div>
  )
}
