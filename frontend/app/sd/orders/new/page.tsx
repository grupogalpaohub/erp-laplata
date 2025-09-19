import { supabaseServer } from '@/lib/supabase/server'
import { getTenantId } from '@/lib/auth'
import { getCustomers, getMaterials } from '@/lib/data'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import AddItemButton from './AddItemButton'

async function createSalesOrder(formData: FormData) {
  'use server'
  
  const supabase = supabaseServer()
  const tenantId = await getTenantId()

  try {
    // Gerar número do pedido
    const { data: docNumber, error: docError } = await supabase
      .rpc('next_doc_number', {
        p_tenant_id: tenantId,
        p_doc_type: 'SO'
      })

    if (docError) {
      console.error('Error generating document number:', docError)
      return
    }

    const soData = {
      tenant_id: tenantId,
      so_id: docNumber,
      customer_id: formData.get('customer_id') as string,
      status: 'draft',
      order_date: formData.get('order_date') as string,
      expected_ship: formData.get('expected_ship') as string || null,
      total_cents: 0
    }

    // Criar header do pedido
    const { error: soError } = await supabase
      .from('sd_sales_order')
      .insert([soData])

    if (soError) {
      console.error('Error creating sales order:', soError)
      return
    }

    // Criar itens do pedido
    const skus = formData.getAll('skus[]') as string[]
    const quantities = formData.getAll('quantities[]') as string[]
    const unitPrices = formData.getAll('unit_prices[]') as string[]

    let totalAmount = 0
    const items = []

    for (let i = 0; i < skus.length; i++) {
      if (skus[i] && quantities[i] && unitPrices[i]) {
        const quantity = parseFloat(quantities[i])
        const unitPrice = parseFloat(unitPrices[i]) * 100 // Convert to cents
        const lineTotal = quantity * unitPrice
        totalAmount += lineTotal

        items.push({
          tenant_id: tenantId,
          so_id: docNumber,
          sku: skus[i],
          quantity: quantity,
          unit_price_cents: unitPrice,
          line_total_cents: lineTotal,
          row_no: i + 1
        })
      }
    }

    if (items.length > 0) {
      const { error: itemsError } = await supabase
        .from('sd_sales_order_item')
        .insert(items)

      if (itemsError) {
        console.error('Error creating sales order items:', itemsError)
        return
      }

      // Atualizar total do pedido
      await supabase
        .from('sd_sales_order')
        .update({ total_cents: totalAmount })
        .eq('tenant_id', tenantId)
        .eq('so_id', docNumber)
    }

    redirect('/sd/orders')
  } catch (error) {
    console.error('Error creating sales order:', error)
  }
}

export default async function NewSalesOrderPage() {
  const [customers, materials] = await Promise.all([
    getCustomers(),
    getMaterials()
  ])

  return (
    <div className="p-6">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center mb-6">
          <Link
            href="/sd/orders"
            className="mr-4 p-2 text-gray-400 hover:text-gray-600"
          >
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <h1 className="text-2xl font-bold text-gray-900">Novo Pedido de Venda</h1>
        </div>
        
        <form action={createSalesOrder} className="space-y-6">
          <div className="bg-white shadow rounded-lg p-6">
            <h2 className="text-lg font-medium text-gray-900 mb-4">Dados do Pedido</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="customer_id" className="block text-sm font-medium text-gray-700">
                  Cliente *
                </label>
                <select
                  name="customer_id"
                  id="customer_id"
                  required
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                >
                  <option value="">Selecione um cliente...</option>
                  {customers.map((customer) => (
                    <option key={customer.customer_id} value={customer.customer_id}>
                      {customer.name} {customer.email ? `(${customer.email})` : ''}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label htmlFor="order_date" className="block text-sm font-medium text-gray-700">
                  Data do Pedido *
                </label>
                <input
                  type="date"
                  name="order_date"
                  id="order_date"
                  required
                  defaultValue={new Date().toISOString().split('T')[0]}
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                />
              </div>

              <div>
                <label htmlFor="expected_ship" className="block text-sm font-medium text-gray-700">
                  Data de Expedição Prevista
                </label>
                <input
                  type="date"
                  name="expected_ship"
                  id="expected_ship"
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                />
              </div>
            </div>
          </div>

          <div className="bg-white shadow rounded-lg p-6">
            <h2 className="text-lg font-medium text-gray-900 mb-4">Itens do Pedido</h2>
            <div id="items-container">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Material *</label>
                  <select
                    name="skus[]"
                    required
                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  >
                    <option value="">Selecione...</option>
                    {materials.map((material) => (
                      <option key={material.mm_material} value={material.mm_material}>
                        {material.mm_material} - {material.mm_comercial || material.mm_desc}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Quantidade *</label>
                  <input
                    type="number"
                    name="quantities[]"
                    required
                    step="0.01"
                    min="0"
                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    placeholder="0.00"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Preço Unit. (R$) *</label>
                  <input
                    type="number"
                    name="unit_prices[]"
                    required
                    step="0.01"
                    min="0"
                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    placeholder="0.00"
                  />
                </div>
                <div className="flex items-end">
                  <AddItemButton materials={materials} />
                </div>
              </div>
            </div>
          </div>

          <div className="flex justify-end space-x-3">
            <Link
              href="/sd/orders"
              className="bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Cancelar
            </Link>
            <button
              type="submit"
              className="bg-blue-600 py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Salvar Pedido
            </button>
          </div>
        </form>
      </div>

    </div>
  )
}