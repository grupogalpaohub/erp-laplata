import Link from "next/link";
import { supabaseServer } from "@/src/lib/supabase/server";

export const revalidate = 0

export default async function Purchases(){
  const sb = await supabaseServer()
  const { data, error } = await sb
    .from('mm_purchase_order')
    .select('mm_order, vendor_id, status, po_date, total_amount')
    .order('po_date', { ascending:false })
    .limit(300)
  if (error) return <div><h1 className="text-2xl font-bold mb-4">Pedidos de Compra</h1><pre className="text-red-600">{error.message}</pre></div>
  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-bold">Pedidos de Compra</h1>
        <Link className="underline" href="/mm/purchases/new">Novo Pedido</Link>
      </div>
      {(!data || data.length===0) ? <div>Nenhum registro encontrado.</div> : (
        <table className="min-w-full">
          <thead className="bg-gray-50"><tr>
            <th className="px-2 py-1 text-left">Pedido</th>
            <th className="px-2 py-1 text-left">Fornecedor</th>
            <th className="px-2 py-1 text-left">Status</th>
            <th className="px-2 py-1 text-left">Data</th>
            <th className="px-2 py-1 text-left">Total</th>
            <th></th>
          </tr></thead>
          <tbody>
            {data.map((r:any)=>(
              <tr key={r.mm_order} className="border-t">
                <td className="px-2 py-1">{r.mm_order}</td>
                <td className="px-2 py-1">{r.vendor_id}</td>
                <td className="px-2 py-1">{r.status}</td>
                <td className="px-2 py-1">{String(r.po_date??'').slice(0,10)}</td>
                <td className="px-2 py-1">{r.total_amount??0}</td>
                <td className="px-2 py-1"><Link className="underline" href={`/mm/purchases/${encodeURIComponent(r.mm_order)}`}>Detalhe</Link></td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  )
}
