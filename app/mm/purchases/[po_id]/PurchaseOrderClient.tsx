'use client'

import { useState, useEffect } from 'react'
import { createSupabaseClient } from '@/lib/supabaseClient'
import StatusUpdateButton from '../StatusUpdateButton'

interface PurchaseOrder {
  mm_order: string
  vendor_id: string
  po_date: string
  status: string
  total_cents: number
  expected_delivery?: string
  notes?: string
  created_at: string
}

interface PurchaseOrderItem {
  po_item_id: number
  mm_material: string
  mm_comercial: string | null
  mm_desc: string | null
  mm_qtt: number
  unit_cost_cents: number
  line_total_cents: number
  notes?: string
}

interface PurchaseOrderClientProps {
  order: PurchaseOrder
  items: PurchaseOrderItem[]
}

export default function PurchaseOrderClient({ order, items }: PurchaseOrderClientProps) {
  const [vendor, setVendor] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadVendor() {
      try {
        const supabase = createSupabaseClient()
        const { data, error } = await supabase
          .from('mm_vendor')
          .select('*')
          .eq('vendor_id', order.vendor_id)
          .eq('tenant_id', process.env.NEXT_PUBLIC_TENANT_ID || 'default')
          .single()

        if (error) {
          console.error('Error loading vendor:', error)
        } else {
          setVendor(data)
        }
      } catch (error) {
        console.error('Error loading vendor:', error)
      } finally {
        setLoading(false)
      }
    }

    loadVendor()
  }, [order.vendor_id])

  if (loading) {
    return (
      <div className="animate-pulse">
        <div className="h-4 bg-gray-200 rounded w-1/4 mb-2"></div>
        <div className="h-4 bg-gray-200 rounded w-1/2"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Informações do Pedido */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700">Número do Pedido</label>
            <p className="mt-1 text-sm text-gray-900">{order.mm_order}</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Fornecedor</label>
            <p className="mt-1 text-sm text-gray-900">{vendor?.vendor_name || 'Carregando...'}</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Data do Pedido</label>
            <p className="mt-1 text-sm text-gray-900">
              {new Date(order.po_date).toLocaleDateString('pt-BR')}
            </p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Status</label>
            <div className="mt-1 flex items-center space-x-2">
              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                order.status === 'draft' ? 'bg-yellow-100 text-yellow-800' :
                order.status === 'placed' ? 'bg-blue-100 text-blue-800' :
                order.status === 'received' ? 'bg-green-100 text-green-800' :
                'bg-gray-100 text-gray-800'
              }`}>
                {order.status === 'draft' ? 'Rascunho' :
                 order.status === 'placed' ? 'Enviado' :
                 order.status === 'received' ? 'Recebido' :
                 order.status}
              </span>
              <StatusUpdateButton 
                poId={order.mm_order} 
                currentStatus={order.status}
              />
            </div>
          </div>
        </div>

        {order.expected_delivery && (
          <div className="mt-4">
            <label className="block text-sm font-medium text-gray-700">Data Esperada de Entrega</label>
            <p className="mt-1 text-sm text-gray-900">
              {new Date(order.expected_delivery).toLocaleDateString('pt-BR')}
            </p>
          </div>
        )}

        {order.notes && (
          <div className="mt-4">
            <label className="block text-sm font-medium text-gray-700">Observações</label>
            <p className="mt-1 text-sm text-gray-900">{order.notes}</p>
          </div>
        )}
      </div>

      {/* Itens do Pedido */}
      <div className="bg-white rounded-lg shadow">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900">Itens do Pedido</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Material
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Descrição
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Quantidade
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Preço Unitário
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Total
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {items.map((item) => (
                <tr key={item.po_item_id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {item.mm_material}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {item.mm_comercial || item.mm_desc || '-'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {item.mm_qtt}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    R$ {(item.unit_cost_cents / 100).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    R$ {(item.line_total_cents / 100).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                  </td>
                </tr>
              ))}
            </tbody>
            <tfoot className="bg-gray-50">
              <tr>
                <td colSpan={4} className="px-6 py-4 text-right text-sm font-medium text-gray-900">
                  Total do Pedido:
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  R$ {(order.total_cents / 100).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                </td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>
    </div>
  )
}
