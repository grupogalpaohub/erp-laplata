import { supabaseServer } from '@/utils/supabase/server'
import { requireSession } from '@/lib/auth/requireSession'
import { formatBRL } from '@/lib/money'
import { notFound } from 'next/navigation'

async function getSalesOrder(soId: string) {
  await requireSession()
  const supabase = supabaseServer()

  try {
    // Buscar dados do pedido
    const { data: order, error: orderError } = await supabase
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
      
      .eq('so_id', soId)
      .single()

    if (orderError || !order) {
      return null
    }

    // Buscar itens do pedido
    const { data: items, error: itemsError } = await supabase
      .from('sd_sales_order_item')
      .select(`
        sku,
        mm_qtt,
        unit_price_cents,
        line_total_cents,
        row_no
      `)
      
      .eq('so_id', soId)
      .order('row_no')

    if (itemsError) {
      console.error('Error fetching order items:', itemsError)
      return { ...order, items: [] }
    }

    // Buscar dados do cliente
    const { data: customer } = await supabase
      .from('crm_customer')
      .select('name, email, telefone')
      
      .eq('customer_id', order.customer_id)
      .single()

    return {
      ...order,
      items: items || [],
      customer: customer || { name: order.customer_id, email: '', telefone: '' }
    } as typeof order & { 
      items: Array<{ sku: string; mm_qtt: number; unit_price_cents: number; line_total_cents: number; row_no: number }>
      customer: { name: string; email: string; telefone: string }
    }
  } catch (error) {
    console.error('Error fetching sales order:', error)
    return null
  }
}

export default async function PrintSalesOrderPage({ params }: { params: { so_id: string } }) {
  const order = await getSalesOrder(params.so_id)

  if (!order) {
    notFound()
  }

  return (
    <div className="min-h-screen bg-white p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="border-b-2 border-gray-300 pb-6 mb-6">
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">ERP LaPlata</h1>
              <p className="text-lg text-gray-600">Pedido de Venda</p>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-500">Número:</p>
              <p className="text-xl font-bold text-gray-900">{order.so_id}</p>
              <p className="text-sm text-gray-500 mt-2">
                Data: {new Date(order.order_date).toLocaleDateString('pt-BR')}
              </p>
            </div>
          </div>
        </div>

        {/* Customer Info */}
        <div className="mb-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-3">Dados do Cliente</h2>
          <div className="bg-gray-50 p-4 rounded-lg">
            <p className="font-medium text-gray-900">{(order as any).customer?.name || order.customer_id}</p>
            {(order as any).customer?.email && (
              <p className="text-sm text-gray-600">Email: {(order as any).customer.email}</p>
            )}
            {(order as any).customer?.telefone && (
              <p className="text-sm text-gray-600">Telefone: {(order as any).customer.telefone}</p>
            )}
          </div>
        </div>

        {/* Order Items */}
        <div className="mb-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-3">Itens do Pedido</h2>
          <div className="overflow-hidden border border-gray-200 rounded-lg">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Item
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Material
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Quantidade
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Preço Unit.
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Total
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {order.items.map((item: any, index: number) => (
                  <tr key={index}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {item.row_no}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {item.sku}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 text-right">
                      {item.mm_qtt}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 text-right">
                      {formatBRL(item.unit_price_cents)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 text-right">
                      {formatBRL(item.line_total_cents)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Order Summary */}
        <div className="flex justify-end">
          <div className="w-64">
            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="flex justify-between items-center">
                <span className="text-lg font-semibold text-gray-900">Total:</span>
                <span className="text-xl font-bold text-gray-900">
                  {formatBRL(order.total_cents)}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-12 pt-6 border-t border-gray-200">
          <div className="grid grid-cols-2 gap-8">
            <div>
              <h3 className="text-sm font-semibold text-gray-900 mb-2">Status do Pedido</h3>
              <p className="text-sm text-gray-600 capitalize">{order.status}</p>
            </div>
            {order.expected_ship && (
              <div>
                <h3 className="text-sm font-semibold text-gray-900 mb-2">Expedição Prevista</h3>
                <p className="text-sm text-gray-600">
                  {new Date(order.expected_ship).toLocaleDateString('pt-BR')}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Print Styles */}
      <style dangerouslySetInnerHTML={{
        __html: `
          @media print {
            body {
              margin: 0;
              padding: 0;
            }
            .no-print {
              display: none !important;
            }
          }
        `
      }} />
    </div>
  )
}