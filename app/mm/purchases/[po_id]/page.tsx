export const dynamic = 'force-dynamic'
export const revalidate = 0
export const runtime = 'nodejs'

import { createClient } from '@/src/lib/supabase/server'
import Link from 'next/link'
import { ArrowLeft, Printer, Edit } from 'lucide-react'

interface PurchaseOrder {
  mm_order: string
  vendor_id: string
  po_date: string
  status: string
  total_amount: number
  expected_delivery?: string
  notes?: string
  created_at: string
}

interface PurchaseOrderItem {
  po_item_id: number
  mm_material: string
  mm_qtt: number
  unit_cost_cents: number
  line_total_cents: number
  notes?: string
}

async function getPurchaseOrder(po_id: string): Promise<PurchaseOrder | null> {
  const supabase = createClient()
  
  const { data, error } = await supabase
    .from('mm_purchase_order')
    .select('*')
    .eq('mm_order', po_id)
    .eq('tenant_id', 'LaplataLunaria')
    .single()

  if (error) {
    console.error('Error fetching purchase order:', error)
    return null
  }

  return data
}

async function getPurchaseOrderItems(po_id: string): Promise<PurchaseOrderItem[]> {
  const supabase = createClient()
  
  const { data, error } = await supabase
    .from('mm_purchase_order_item')
    .select('*')
    .eq('mm_order', po_id)
    .eq('tenant_id', 'LaplataLunaria')
    .order('po_item_id')

  if (error) {
    console.error('Error fetching purchase order items:', error)
    return []
  }

  return data || []
}

export default async function PurchaseOrderDetailPage({ params }: { params: { po_id: string } }) {
  const [purchaseOrder, items] = await Promise.all([
    getPurchaseOrder(params.po_id),
    getPurchaseOrderItems(params.po_id)
  ])

  if (!purchaseOrder) {
    return (
      <main className="mx-auto max-w-7xl px-4 py-6 space-y-6">
        <div className="card-fiori text-center py-12">
          <h1 className="text-2xl font-semibold text-gray-900 mb-4">Pedido não encontrado</h1>
          <p className="text-gray-500 mb-6">O pedido de compras solicitado não foi encontrado.</p>
          <Link href="/mm/purchases" className="btn-fiori-primary">
            Voltar para Pedidos
          </Link>
        </div>
      </main>
    )
  }

  return (
    <main className="mx-auto max-w-7xl px-4 py-6 space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Link href="/mm/purchases" className="btn-fiori-outline flex items-center gap-2">
            <ArrowLeft className="w-4 h-4" />
            Voltar
          </Link>
          <div>
            <h1 className="text-2xl font-semibold">Pedido de Compras {purchaseOrder.mm_order}</h1>
            <p className="text-gray-500 mt-1">Detalhes do pedido de compras</p>
          </div>
        </div>
        <div className="flex gap-3">
          <button className="btn-fiori-outline flex items-center gap-2">
            <Edit className="w-4 h-4" />
            Editar
          </button>
          <button className="btn-fiori-outline flex items-center gap-2">
            <Printer className="w-4 h-4" />
            Imprimir
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="card-fiori">
            <h2 className="text-lg font-semibold mb-4">Informações do Pedido</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-gray-500">Número do Pedido</label>
                <p className="text-lg font-semibold">{purchaseOrder.mm_order}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">Fornecedor</label>
                <p className="text-lg">{purchaseOrder.vendor_id}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">Data do Pedido</label>
                <p className="text-lg">{new Date(purchaseOrder.po_date).toLocaleDateString('pt-BR')}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">Status</label>
                <span className={`badge-fiori ${
                  purchaseOrder.status === 'draft' ? 'badge-fiori-info' :
                  purchaseOrder.status === 'approved' ? 'badge-fiori-success' :
                  purchaseOrder.status === 'in_progress' ? 'badge-fiori-warning' :
                  purchaseOrder.status === 'received' ? 'badge-fiori-success' :
                  'badge-fiori-danger'
                }`}>
                  {purchaseOrder.status}
                </span>
              </div>
              {purchaseOrder.expected_delivery && (
                <div>
                  <label className="text-sm font-medium text-gray-500">Entrega Esperada</label>
                  <p className="text-lg">{new Date(purchaseOrder.expected_delivery).toLocaleDateString('pt-BR')}</p>
                </div>
              )}
              <div>
                <label className="text-sm font-medium text-gray-500">Valor Total</label>
                <p className="text-2xl font-bold text-green-600">R$ {(purchaseOrder.total_amount / 100).toFixed(2)}</p>
              </div>
            </div>
            {purchaseOrder.notes && (
              <div className="mt-4">
                <label className="text-sm font-medium text-gray-500">Observações</label>
                <p className="text-lg mt-1">{purchaseOrder.notes}</p>
              </div>
            )}
          </div>

          <div className="card-fiori">
            <h2 className="text-lg font-semibold mb-4">Itens do Pedido</h2>
            {items.length === 0 ? (
              <p className="text-gray-500 text-center py-8">Nenhum item encontrado</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="table-fiori">
                  <thead>
                    <tr>
                      <th>Material</th>
                      <th>Quantidade</th>
                      <th>Preço Unitário</th>
                      <th>Total</th>
                    </tr>
                  </thead>
                  <tbody>
                    {items.map((item) => (
                      <tr key={item.po_item_id}>
                        <td className="font-mono text-sm">{item.mm_material}</td>
                        <td className="text-right">{item.mm_qtt}</td>
                        <td className="text-right">R$ {(item.unit_cost_cents / 100).toFixed(2)}</td>
                        <td className="text-right font-medium">R$ {(item.line_total_cents / 100).toFixed(2)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>

        <div className="space-y-6">
          <div className="card-fiori">
            <h3 className="text-lg font-semibold mb-4">Resumo</h3>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600">Total de Itens:</span>
                <span className="font-semibold">{items.length}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Quantidade Total:</span>
                <span className="font-semibold">{items.reduce((sum, item) => sum + item.mm_qtt, 0)}</span>
              </div>
              <div className="border-t pt-3">
                <div className="flex justify-between text-lg font-semibold">
                  <span>Valor Total:</span>
                  <span className="text-green-600">R$ {(purchaseOrder.total_amount / 100).toFixed(2)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}
