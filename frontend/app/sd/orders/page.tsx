import { supabaseServer } from '@/src/lib/supabase/server'
import Link from 'next/link'
import { Plus, Eye, Printer } from 'lucide-react'

async function getSalesOrders() {
  const supabase = supabaseServer()
  const tenantId = 'LaplataLunaria'

  try {
    const { data, error } = await supabase
      .from('sd_sales_order')
      .select(`
        so_id,
        customer_id,
        status,
        order_date,
        expected_ship,
        total_cents,
        created_at
      `)
      .eq('tenant_id', tenantId)
      .order('created_at', { ascending: false })
      .limit(50)

    if (error) {
      console.error('Error fetching sales orders:', error)
      return []
    }

    return data || []
  } catch (error) {
    console.error('Error fetching sales orders:', error)
    return []
  }
}

export default async function OrdersPage() {
  const salesOrders = await getSalesOrders()

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Pedidos de Venda</h1>
        <Link
          href="/sd/orders/new"
          className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          <Plus className="h-4 w-4 mr-2" />
          Novo Pedido
        </Link>
      </div>

      <div className="bg-white shadow overflow-hidden sm:rounded-md">
        <ul className="divide-y divide-gray-200">
          {salesOrders.length === 0 ? (
            <li className="px-6 py-4 text-center text-gray-500">
              Nenhum pedido de venda encontrado
            </li>
          ) : (
            salesOrders.map((order) => (
              <li key={order.so_id} className="px-6 py-4">
                <div className="flex items-center justify-between">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-3">
                      <p className="text-sm font-medium text-gray-900 truncate">
                        {order.so_id}
                      </p>
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        order.status === 'draft' ? 'bg-gray-100 text-gray-800' :
                        order.status === 'confirmed' ? 'bg-green-100 text-green-800' :
                        order.status === 'shipped' ? 'bg-blue-100 text-blue-800' :
                        order.status === 'delivered' ? 'bg-purple-100 text-purple-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {order.status}
                      </span>
                    </div>
                    <div className="mt-1 flex items-center space-x-4 text-sm text-gray-500">
                      <span>Cliente: {order.customer_id}</span>
                      <span>Data: {new Date(order.order_date).toLocaleDateString('pt-BR')}</span>
                      {order.expected_ship && (
                        <span>Expedição: {new Date(order.expected_ship).toLocaleDateString('pt-BR')}</span>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="text-sm font-medium text-gray-900">
                      R$ {(order.total_cents / 100).toFixed(2)}
                    </span>
                    <Link
                      href={`/sd/orders/${order.so_id}`}
                      className="text-blue-600 hover:text-blue-900"
                    >
                      <Eye className="h-4 w-4" />
                    </Link>
                    <Link
                      href={`/sd/orders/${order.so_id}/print`}
                      className="text-gray-600 hover:text-gray-900"
                      target="_blank"
                    >
                      <Printer className="h-4 w-4" />
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