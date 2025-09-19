import { supabaseServer } from '@/lib/supabase/server'
import Link from 'next/link'
import { Plus, Eye } from 'lucide-react'

async function getPurchaseOrders() {
  const supabase = supabaseServer()
  const tenantId = 'LaplataLunaria'

  try {
    const { data, error } = await supabase
      .from('mm_purchase_order')
      .select(`
        mm_order,
        vendor_id,
        status,
        po_date,
        expected_delivery,
        total_amount,
        currency,
        created_at
      `)
      .eq('tenant_id', tenantId)
      .order('created_at', { ascending: false })
      .limit(50)

    if (error) {
      console.error('Error fetching purchase orders:', error)
      return []
    }

    return data || []
  } catch (error) {
    console.error('Error fetching purchase orders:', error)
    return []
  }
}

export default async function PurchasesPage() {
  const purchaseOrders = await getPurchaseOrders()

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Pedidos de Compra</h1>
        <Link
          href="/mm/purchases/new"
          className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          <Plus className="h-4 w-4 mr-2" />
          Novo Pedido
        </Link>
      </div>

      <div className="bg-white shadow overflow-hidden sm:rounded-md">
        <ul className="divide-y divide-gray-200">
          {purchaseOrders.length === 0 ? (
            <li className="px-6 py-4 text-center text-gray-500">
              Nenhum pedido de compra encontrado
            </li>
          ) : (
            purchaseOrders.map((order) => (
              <li key={order.mm_order} className="px-6 py-4">
                <div className="flex items-center justify-between">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-3">
                      <p className="text-sm font-medium text-gray-900 truncate">
                        {order.mm_order}
                      </p>
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        order.status === 'draft' ? 'bg-gray-100 text-gray-800' :
                        order.status === 'approved' ? 'bg-green-100 text-green-800' :
                        order.status === 'received' ? 'bg-blue-100 text-blue-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {order.status}
                      </span>
                    </div>
                    <div className="mt-1 flex items-center space-x-4 text-sm text-gray-500">
                      <span>Fornecedor: {order.vendor_id}</span>
                      <span>Data: {new Date(order.po_date).toLocaleDateString('pt-BR')}</span>
                      {order.expected_delivery && (
                        <span>Entrega: {new Date(order.expected_delivery).toLocaleDateString('pt-BR')}</span>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="text-sm font-medium text-gray-900">
                      R$ {(order.total_amount / 100).toFixed(2)}
                    </span>
                    <Link
                      href={`/mm/purchases/${order.mm_order}`}
                      className="text-blue-600 hover:text-blue-900"
                    >
                      <Eye className="h-4 w-4" />
                    </Link>
                  </div>
                </div>
              </li>
            ))
          )}
        </ul>
      </div>
    </div>
  )
}