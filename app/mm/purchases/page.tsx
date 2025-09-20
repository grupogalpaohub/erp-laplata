export const dynamic = 'force-dynamic'
export const revalidate = 0
export const runtime = 'nodejs'
import { createClient } from '@/src/lib/supabase/server'
import Link from 'next/link'

type PO = {
  po_id: string
  mm_vendor_id: string
  order_date: string
  status: string
  total_cents: number
}

export default async function PurchaseOrdersPage({ searchParams }: { searchParams: any }) {
  const supabase = createClient()
  let q = supabase
    .from('mm_purchase_order')
    .select('po_id, mm_vendor_id, order_date, status, total_cents')
    .order('order_date', { ascending: false })

  if (searchParams.status) q = q.eq('status', searchParams.status)
  if (searchParams.vendor) q = q.eq('mm_vendor_id', searchParams.vendor)
  if (searchParams.from)   q = q.gte('order_date', searchParams.from)
  if (searchParams.to)     q = q.lte('order_date', searchParams.to)

  const { data, error } = await q
  if (error) return <div className="p-6 text-red-600">Erro: {error.message}</div>

  const rows = (data ?? []) as PO[]

  return (
    <main className="p-6 space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Pedidos de Compras</h1>
        <Link href="/mm/purchases/new" className="px-3 py-2 rounded bg-[#062238] text-white">Novo Pedido</Link>
      </div>

      <form className="grid grid-cols-2 md:grid-cols-5 gap-2">
        <input name="vendor" placeholder="Fornecedor" className="border p-2 rounded" defaultValue={searchParams.vendor ?? ''}/>
        <select name="status" className="border p-2 rounded" defaultValue={searchParams.status ?? ''}>
          <option value="">Status (todos)</option>
          <option value="rascunho">Rascunho</option>
          <option value="aprovado">Aprovado</option>
          <option value="em_andamento">Em Andamento</option>
          <option value="recebido">Recebido</option>
          <option value="cancelado">Cancelado</option>
        </select>
        <input type="date" name="from" className="border p-2 rounded" defaultValue={searchParams.from ?? ''}/>
        <input type="date" name="to" className="border p-2 rounded" defaultValue={searchParams.to ?? ''}/>
        <button className="border p-2 rounded">Filtrar</button>
      </form>

      <div className="overflow-x-auto">
        <table className="w-full border border-gray-300">
          <thead className="bg-gray-50">
            <tr>
              <th className="p-2 border">Pedido</th>
              <th className="p-2 border">Fornecedor</th>
              <th className="p-2 border">Data</th>
              <th className="p-2 border">Status</th>
              <th className="p-2 border">Total</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <tr key={r.po_id} className="hover:bg-gray-50">
                <td className="p-2 border">
                  <Link href={`/mm/purchases/${r.po_id}`} className="text-blue-600 underline">{r.po_id.slice(0,8)}</Link>
                </td>
                <td className="p-2 border">{r.mm_vendor_id}</td>
                <td className="p-2 border">{new Date(r.order_date).toLocaleDateString()}</td>
                <td className="p-2 border">{r.status}</td>
                <td className="p-2 border text-right">R$ {(r.total_cents/100).toFixed(2)}</td>
              </tr>
            ))}
            {rows.length === 0 && (
              <tr><td className="p-4 text-center text-gray-500" colSpan={5}>Nenhum pedido encontrado.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </main>
  )
}