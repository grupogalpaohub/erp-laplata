export const dynamic = 'force-dynamic'
export const revalidate = 0
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
    <main className="mx-auto max-w-7xl px-4 py-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Pedidos de Venda</h1>
          <p className="text-gray-500 mt-1">Gerencie pedidos e clientes</p>
        </div>
        <Link
          href="/sd/orders/new"
          className="btn-fiori-primary flex items-center gap-2"
        >
          <Plus className="h-4 w-4" />
          Novo Pedido
        </Link>
      </div>

      {salesOrders.length === 0 ? (
        <div className="card-fiori text-center py-12">
          <div className="text-gray-500 text-lg">Nenhum pedido de venda encontrado</div>
          <Link href="/sd/orders/new" className="btn-fiori-primary mt-4 inline-block">Criar Primeiro Pedido</Link>
        </div>
      ) : (
        <div className="card-fiori">
          <div className="space-y-4">
            {salesOrders.map((order) => (
              <div key={order.so_id} className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors">
                <div className="flex items-center justify-between">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-3">
                      <p className="text-sm font-medium text-gray-900 truncate">
                        {order.so_id}
                      </p>
                      <span className={`badge-fiori ${
                        order.status === 'draft' ? 'badge-fiori-info' :
                        order.status === 'confirmed' ? 'badge-fiori-success' :
                        order.status === 'shipped' ? 'badge-fiori-warning' :
                        order.status === 'delivered' ? 'badge-fiori-success' :
                        'badge-fiori-danger'
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
                      className="text-blue-600 hover:text-blue-900 p-1 rounded hover:bg-blue-50"
                    >
                      <Eye className="h-4 w-4" />
                    </Link>
                    <Link
                      href={`/sd/orders/${order.so_id}/print`}
                      className="text-gray-600 hover:text-gray-900 p-1 rounded hover:bg-gray-50"
                      target="_blank"
                    >
                      <Printer className="h-4 w-4" />
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </main>
  )
}