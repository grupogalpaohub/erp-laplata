export const runtime = 'nodejs'

import { supabaseServer } from '@/src/lib/supabase/server'
import { getTenantId } from '@/src/lib/auth'
import { getVendors, getMaterials } from '@/src/lib/data'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import AddItemButton from './AddItemButton'

async function createPurchaseOrder(formData: FormData) {
  'use server'
  
  const supabase = supabaseServer()
  const tenantId = await getTenantId()

  try {
    // Gerar número do pedido
    const { data: docNumber, error: docError } = await supabase
      .rpc('next_doc_number', {
        p_tenant: tenantId,
        p_doc_type: 'PO'
      })

    if (docError) {
      console.error('Error generating document number:', docError)
      return
    }

    const poData = {
      tenant_id: tenantId,
      mm_order: docNumber,
      vendor_id: formData.get('vendor_id') as string,
      status: 'draft',
      po_date: formData.get('po_date') as string,
      expected_delivery: formData.get('expected_delivery') as string || null,
      notes: formData.get('notes') as string || null,
      total_amount: 0,
      currency: 'BRL'
    }

    // Criar header do pedido
    const { error: poError } = await supabase
      .from('mm_purchase_order')
      .insert([poData])

    if (poError) {
      console.error('Error creating purchase order:', poError)
      return
    }

    // Criar itens do pedido
    const materials = formData.getAll('materials[]') as string[]
    const quantities = formData.getAll('quantities[]') as string[]
    const unitCosts = formData.getAll('unit_costs[]') as string[]

    let totalAmount = 0
    const items = []

    for (let i = 0; i < materials.length; i++) {
      if (materials[i] && quantities[i] && unitCosts[i]) {
        const quantity = parseFloat(quantities[i])
        const unitCost = parseFloat(unitCosts[i]) * 100 // Convert to cents
        const lineTotal = quantity * unitCost
        totalAmount += lineTotal

        // Buscar depósito padrão do tenant
        const { data: wh } = await supabase
          .from('wh_warehouse')
          .select('plant_id')
          .eq('tenant_id', tenantId)
          .eq('is_default', true)
          .single()
        const plantId = wh?.plant_id || 'DEFAULT'

        items.push({
          tenant_id: tenantId,
          po_item_id: i + 1,
          mm_order: docNumber,
          plant_id: plantId,
          mm_material: materials[i],
          mm_qtt: quantity,
          unit_cost_cents: unitCost,
          line_total_cents: lineTotal,
          currency: 'BRL'
        })
      }
    }

    if (items.length > 0) {
      const { error: itemsError } = await supabase
        .from('mm_purchase_order_item')
        .insert(items)

      if (itemsError) {
        console.error('Error creating purchase order items:', itemsError)
        return
      }

      // Atualizar total do pedido
      await supabase
        .from('mm_purchase_order')
        .update({ total_amount: totalAmount })
        .eq('tenant_id', tenantId)
        .eq('mm_order', docNumber)
    }

    redirect('/mm/purchases')
  } catch (error) {
    console.error('Error creating purchase order:', error)
  }
}

export default async function NewPurchaseOrderPage() {
  const [vendors, materials] = await Promise.all([
    getVendors(),
    getMaterials()
  ])

  return (
    <div className="p-6">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center mb-6">
          <Link
            href="/mm/purchases"
            className="mr-4 p-2 text-gray-400 hover:text-gray-600"
          >
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <h1 className="text-2xl font-bold text-gray-900">Novo Pedido de Compra</h1>
        </div>
        
        <form action={createPurchaseOrder} className="space-y-6">
          <div className="bg-white shadow rounded-lg p-6">
            <h2 className="text-lg font-medium text-gray-900 mb-4">Dados do Pedido</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="vendor_id" className="block text-sm font-medium text-gray-700">
                  Fornecedor *
                </label>
                <select
                  name="vendor_id"
                  id="vendor_id"
                  required
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                >
                  <option value="">Selecione um fornecedor...</option>
                  {vendors.map((vendor) => (
                    <option key={vendor.vendor_id} value={vendor.vendor_id}>
                      {vendor.vendor_name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label htmlFor="po_date" className="block text-sm font-medium text-gray-700">
                  Data do Pedido *
                </label>
                <input
                  type="date"
                  name="po_date"
                  id="po_date"
                  required
                  defaultValue={new Date().toISOString().split('T')[0]}
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                />
              </div>

              <div>
                <label htmlFor="expected_delivery" className="block text-sm font-medium text-gray-700">
                  Data de Entrega Prevista
                </label>
                <input
                  type="date"
                  name="expected_delivery"
                  id="expected_delivery"
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                />
              </div>

              <div>
                <label htmlFor="notes" className="block text-sm font-medium text-gray-700">
                  Observações
                </label>
                <textarea
                  name="notes"
                  id="notes"
                  rows={3}
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  placeholder="Observações adicionais..."
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
                    name="materials[]"
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
                    name="unit_costs[]"
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
              href="/mm/purchases"
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