export const dynamic = 'force-dynamic'
export const revalidate = 0
export const runtime = 'nodejs'
import { createClient } from '@supabase/supabase-js'
import { getTenantId } from '@/lib/auth'
import Link from 'next/link'
import ExportCSVButton from './ExportCSVButton'
import StatusUpdateButton from './StatusUpdateButton'

type PO = {
  mm_order: string
  vendor_id: string
  po_date: string
  status: string
  total_cents: number
  mm_vendor?: {
    vendor_name: string
  }
}

export default async function PurchaseOrdersPage({ searchParams }: { searchParams: any }) {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )
  const tenantId = await getTenantId()
  
  let q = supabase
    .from('mm_purchase_order')
    .select(`
      mm_order, 
      vendor_id, 
      po_date, 
      status, 
      total_cents,
      mm_vendor!left(vendor_name)
    `)
    .eq('tenant_id', tenantId)
    .order('po_date', { ascending: false })

  if (searchParams.status) q = q.eq('status', searchParams.status)
  if (searchParams.vendor) q = q.eq('vendor_id', searchParams.vendor)
  if (searchParams.from)   q = q.gte('po_date', searchParams.from)
  if (searchParams.to)     q = q.lte('po_date', searchParams.to)

  const { data, error } = await q
  if (error) return <div className="p-6 text-red-600">Erro: {error.message}</div>

  const rows = (data ?? []) as PO[]

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-fiori-primary mb-4">Pedidos de Compras</h1>
        <p className="text-xl text-fiori-secondary mb-2">Gerencie pedidos de compras e fornecedores</p>
        <p className="text-lg text-fiori-muted">Visualize e gerencie todos os pedidos de compras</p>
      </div>

      {/* Actions */}
      <div className="flex justify-center gap-4 mb-8">
        <Link href="/mm/purchases/new" className="btn-fiori-primary">Novo Pedido</Link>
        <ExportCSVButton pedidos={rows} />
      </div>

      <div className="form-fiori">
        <form className="grid grid-cols-2 md:grid-cols-5 gap-4">
          <input name="vendor" placeholder="Fornecedor" className="input-fiori" defaultValue={searchParams.vendor ?? ''}/>
          <select name="status" className="select-fiori" defaultValue={searchParams.status ?? ''}>
            <option value="">Status (todos)</option>
            <option value="draft">Rascunho</option>
            <option value="approved">Aprovado</option>
            <option value="in_progress">Em Andamento</option>
            <option value="received">Recebido</option>
            <option value="cancelled">Cancelado</option>
          </select>
          <input type="date" name="from" className="input-fiori" defaultValue={searchParams.from ?? ''}/>
          <input type="date" name="to" className="input-fiori" defaultValue={searchParams.to ?? ''}/>
          <button className="btn-fiori-secondary">Filtrar</button>
        </form>
      </div>

      <div className="card-fiori">
        <div className="overflow-x-auto">
          <table className="table-fiori">
            <thead>
              <tr>
                <th>Pedido</th>
                <th>Fornecedor</th>
                <th>Data</th>
                <th>Status</th>
                <th>Total</th>
                <th>Ações</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((r) => (
                <tr key={r.mm_order}>
                  <td>
                    <Link href={`/mm/purchases/${r.mm_order}`} className="text-blue-600 hover:text-blue-800 font-medium font-mono text-sm">{r.mm_order}</Link>
                  </td>
                  <td>{r.mm_vendor?.vendor_name || r.vendor_id}</td>
                  <td>{new Date(r.po_date).toLocaleDateString()}</td>
                  <td>
                    <span className={`badge-fiori ${
                      r.status === 'draft' ? 'badge-fiori-info' :
                      r.status === 'approved' ? 'badge-fiori-success' :
                      r.status === 'in_progress' ? 'badge-fiori-warning' :
                      r.status === 'received' ? 'badge-fiori-success' :
                      'badge-fiori-danger'
                    }`}>
                      {r.status}
                    </span>
                  </td>
                  <td className="text-right font-medium">R$ {(r.total_cents/100).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</td>
                  <td>
                    <div className="flex gap-2">
                      <Link href={`/mm/purchases/${r.mm_order}`} className="btn-fiori-outline btn-sm">
                        Ver
                      </Link>
                      <StatusUpdateButton poId={r.mm_order} currentStatus={r.status} />
                    </div>
                  </td>
                </tr>
              ))}
              {rows.length === 0 && (
                <tr><td className="p-8 text-center text-fiori-secondary" colSpan={6}>Nenhum pedido encontrado.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
