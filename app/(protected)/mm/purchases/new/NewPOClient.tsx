'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Save, X, Plus, Trash2 } from 'lucide-react'
import { formatBRL, toCents } from '@/lib/money'

interface OrderItem {
  temp_id: string
  mm_material: string
  mm_qtt: number
  unit_cost_cents: number
  line_total_cents: number
}

interface NewPOClientProps {
  vendors: any[]
  materials: any[]
  selectedVendorId?: string
}

export default function NewPOClient({ vendors, materials, selectedVendorId }: NewPOClientProps) {
  const router = useRouter()
  
  const [selectedVendor, setSelectedVendor] = useState(selectedVendorId || '')
  const [orderDate, setOrderDate] = useState(new Date().toISOString().split('T')[0])
  const [expectedDelivery, setExpectedDelivery] = useState('')
  const [notes, setNotes] = useState('')
  const [status, setStatus] = useState('draft')
  const [successMessage, setSuccessMessage] = useState('')
  const [items, setItems] = useState<OrderItem[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [mmOrder, setMmOrder] = useState<string | null>(null)
  const [totalCents, setTotalCents] = useState(0)

  const addItem = () => {
    const newItem: OrderItem = {
      temp_id: `item_${Date.now()}`,
      mm_material: '',
      mm_qtt: 1,
      unit_cost_cents: 0,
      line_total_cents: 0
    }
    setItems([...items, newItem])
  }

  const removeItem = (tempId: string) => {
    setItems(items.filter(item => item.temp_id !== tempId))
  }

  const updateItem = (tempId: string, field: keyof OrderItem, value: any) => {
    setItems(items.map(item => {
      if (item.temp_id === tempId) {
        const updatedItem = { ...item, [field]: value }
        
        // Se mudou o material, carregar preço do database
        if (field === 'mm_material' && value) {
          const selectedMaterial = materials.find(m => m.mm_material === value)
          if (selectedMaterial) {
            // Usar mm_purchase_price_cents como preço de compra
            updatedItem.unit_cost_cents = selectedMaterial.mm_purchase_price_cents || 0
            console.log('Selected material:', selectedMaterial);
            console.log('Updated unit_cost_cents:', updatedItem.unit_cost_cents);
          } else {
            console.log('Material not found:', value);
            console.log('Available materials:', materials.map(m => m.mm_material));
          }
        }
        
        // Recalcular total da linha se quantidade ou preço mudaram
        if (field === 'mm_qtt' || field === 'unit_cost_cents' || field === 'mm_material') {
          updatedItem.line_total_cents = updatedItem.mm_qtt * updatedItem.unit_cost_cents
        }
        
        return updatedItem
      }
      return item
    }))
  }

  const isValid = () => {
    return selectedVendor && items.length > 0 && items.every(item => item.mm_material && item.mm_qtt > 0)
  }

  const validateAndShowErrors = () => {
    if (!selectedVendor) {
      alert('Selecione um fornecedor')
      return false
    }
    if (items.length === 0) {
      alert('Adicione pelo menos um item')
      return false
    }
    
    // Verificar se todos os itens têm material e quantidade válidos
    const invalidItems = items.filter(item => !item.mm_material || item.mm_qtt <= 0)
    if (invalidItems.length > 0) {
      alert('Todos os itens devem ter material e quantidade válidos')
      return false
    }
    
    // Verificar se os materiais existem
    const invalidMaterials = items.filter(item => {
      const material = materials.find(m => m.mm_material === item.mm_material)
      return !material
    })
    if (invalidMaterials.length > 0) {
      alert('Alguns materiais selecionados não existem no banco de dados')
      return false
    }
    
    console.log('Validation passed:', {
      selectedVendor,
      itemsCount: items.length,
      materials: items.map(i => i.mm_material),
      availableMaterials: materials.map(m => m.mm_material)
    });
    
    return true
  }

  const createPurchaseOrder = async () => {
    if (!validateAndShowErrors()) return
    
    setIsLoading(true)
    setError('')
    setSuccessMessage('')

    try {
      // Gerar mm_order único
      const timestamp = Date.now()
      const newMmOrder = `PO-${timestamp}`
      

      // 1. Criar header do pedido
      const headerResponse = await fetch('/api/mm/purchase-orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          mm_order: newMmOrder,
          vendor_id: selectedVendor,
          order_date: orderDate,
          expected_delivery: expectedDelivery || undefined,
          status: status,
          notes: notes || ""
        })
      })

      if (!headerResponse.ok) {
        const text = await headerResponse.text();
        throw new Error(text);
      }
      const headerResult = await headerResponse.json()
      
      if (!headerResult.ok) {
        throw new Error(headerResult.error?.message || 'Erro ao criar pedido')
      }

      setMmOrder(newMmOrder)

      // 2. Criar itens um a um
      for (const item of items) {
        console.log('Creating item:', {
          mm_order: newMmOrder,
          mm_material: item.mm_material,
          plant_id: 'GOIANIA',
          mm_qtt: item.mm_qtt,
          unit_cost_cents: item.unit_cost_cents,
          notes: ""
        });
        
        const itemResponse = await fetch('/api/mm/purchase-order-items', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            mm_order: newMmOrder,
            mm_material: item.mm_material,
            mm_qtt: Number(item.mm_qtt),
            unit_cost_cents: item.unit_cost_cents,
            plant_id: 'GOIANIA',
            notes: ""
          })
        })

        console.log('Item response status:', itemResponse.status);
        
        if (!itemResponse.ok) {
          const text = await itemResponse.text(); // se for 404, vem HTML
          throw new Error(text);
        }
        const itemResult = await itemResponse.json()
        console.log('Item result:', itemResult);
        
        if (!itemResult.ok) {
          throw new Error(itemResult.error?.message || 'Erro ao criar item')
        }
      }

      // 3. Recarregar total do pedido
      await refreshOrderTotal(newMmOrder)

      setSuccessMessage('Pedido de compra criado com sucesso!')
      setTimeout(() => {
        router.push(`/mm/purchases/${newMmOrder}`)
      }, 1500)

    } catch (err) {
      console.error('Error creating purchase order:', err);
      setError(err instanceof Error ? err.message : 'Erro desconhecido')
    } finally {
      setIsLoading(false)
    }
  }

  const refreshOrderTotal = async (orderId: string) => {
    try {
      const response = await fetch(`/api/mm/purchase-orders/${orderId}`)
      const result = await response.json()
      if (result.header) {
        setTotalCents(result.header.total_cents || 0)
      }
    } catch (err) {
      console.error('Erro ao recarregar total:', err)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    await createPurchaseOrder()
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
        {/* Informações do Pedido */}
        <div className="bg-gray-800 rounded-lg shadow-sm border border-gray-700 p-6">
          <h2 className="text-xl font-semibold text-white mb-6">Informações do Pedido</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Fornecedor */}
            <div>
              <label htmlFor="vendor" className="block text-sm font-medium text-gray-300 mb-2">
                Fornecedor *
              </label>
              <div className="flex gap-2">
                <select
                  id="vendor"
                  value={selectedVendor}
                  onChange={(e) => setSelectedVendor(e.target.value)}
                  required
                  className="flex-1 px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Selecione um fornecedor</option>
                  {vendors.map(vendor => (
                    <option key={vendor.vendor_id} value={vendor.vendor_id}>
                      {vendor.vendor_name}
                    </option>
                  ))}
                </select>
                <Link
                  href="/mm/vendors/new"
                  className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition-colors"
                >
                  Novo Fornecedor
                </Link>
              </div>
            </div>

            {/* Data do Pedido */}
            <div>
              <label htmlFor="orderDate" className="block text-sm font-medium text-gray-300 mb-2">
                Data do Pedido *
              </label>
              <input
                type="date"
                id="orderDate"
                value={orderDate}
                onChange={(e) => setOrderDate(e.target.value)}
                required
                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Data de Entrega Esperada */}
            <div>
              <label htmlFor="expectedDelivery" className="block text-sm font-medium text-gray-300 mb-2">
                Data de Entrega Esperada
              </label>
              <input
                type="date"
                id="expectedDelivery"
                value={expectedDelivery}
                onChange={(e) => setExpectedDelivery(e.target.value)}
                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Status */}
            <div>
              <label htmlFor="status" className="block text-sm font-medium text-gray-300 mb-2">
                Status
              </label>
              <div className="px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white">
                Rascunho
              </div>
              <p className="mt-1 text-xs text-gray-400">Status inicial - será alterado ao salvar</p>
            </div>
          </div>

          {/* Observações */}
          <div className="mt-6">
            <label htmlFor="notes" className="block text-sm font-medium text-gray-300 mb-2">
              Observações
            </label>
            <textarea
              id="notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={3}
              className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Observações adicionais sobre o pedido..."
            />
          </div>
        </div>

        {/* Itens do Pedido */}
        <div className="bg-gray-800 rounded-lg shadow-sm border border-gray-700 p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-white">Itens do Pedido</h2>
            <button
              type="button"
              onClick={addItem}
              className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              Adicionar Item
            </button>
          </div>

          {items.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-700">
                <thead className="bg-gray-700">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                      MATERIAL
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                      QUANTIDADE
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                      PREÇO (R$)
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                      TOTAL (R$)
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                      AÇÕES
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-gray-800 divide-y divide-gray-700">
                  {items.map((item) => (
                    <tr key={item.temp_id}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <select
                          value={item.mm_material}
                          onChange={(e) => updateItem(item.temp_id, 'mm_material', e.target.value)}
                          className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                          <option value="">Selecione um material</option>
                          {materials.map(material => (
                            <option key={material.mm_material} value={material.mm_material}>
                              {material.mm_desc} ({material.mm_material})
                            </option>
                          ))}
                        </select>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <input
                          type="number"
                          min="1"
                          value={item.mm_qtt}
                          onChange={(e) => updateItem(item.temp_id, 'mm_qtt', Number(e.target.value))}
                          className="w-20 px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-white">
                        {formatBRL(item.unit_cost_cents)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-white">
                        {formatBRL(item.line_total_cents)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <button
                          type="button"
                          onClick={() => removeItem(item.temp_id)}
                          className="text-red-400 hover:text-red-300"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-8 text-gray-400">
              <p>Nenhum item adicionado ao pedido</p>
              <p className="text-sm">Clique em &quot;Adicionar Item&quot; para começar</p>
            </div>
          )}
        </div>

        {/* Totais e Indicadores */}
        <div className="bg-gray-800 rounded-lg shadow-sm border border-gray-700 p-6">
          <h2 className="text-xl font-semibold text-white mb-6">Totais e Indicadores</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-1 gap-6">
            {/* Valor Final */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Valor Final (R$)
              </label>
              <div className="px-4 py-3 border-2 border-blue-600 rounded-lg bg-blue-900 text-blue-100 text-2xl font-bold">
                {formatBRL(totalCents)}
              </div>
              <p className="mt-2 text-xs text-gray-400">
                Calculado automaticamente pela soma dos itens
              </p>
            </div>
          </div>
        </div>

        {/* Botões de Ação */}
        <div className="flex justify-end gap-4">
          <Link
            href="/mm/purchases"
            className="btn-fiori-outline flex items-center gap-2"
          >
            <X className="w-4 h-4" />
            Cancelar
          </Link>
          <button
            type="submit"
            disabled={!isValid() || isLoading}
            className="btn-fiori-primary flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Save className="w-4 h-4" />
            {isLoading ? 'Criando...' : 'Criar Pedido'}
          </button>
        </div>

        {/* Mensagens */}
        {error && (
          <div className="bg-red-900 border border-red-700 rounded-lg p-4">
            <div className="text-red-200">{error}</div>
          </div>
        )}

        {successMessage && (
          <div className="bg-green-900 border border-green-700 rounded-lg p-4">
            <div className="text-green-200">{successMessage}</div>
          </div>
        )}
    </form>
  )
}

