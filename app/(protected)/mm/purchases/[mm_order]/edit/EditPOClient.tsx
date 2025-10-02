'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Save, X, Plus, Trash2, ArrowLeft } from 'lucide-react'
import { formatBRL, toCents } from '@/lib/money'

interface OrderItem {
  po_item_id?: number
  mm_material: string
  mm_qtt: number
  unit_cost_cents: number
  line_total_cents: number
  mm_material_data?: {
    mm_comercial: string | null
    mm_desc: string
  }
}

interface EditPOClientProps {
  orderData: {
    tenant_id: string
    mm_order: string
    vendor_id: string
    order_date: string
    expected_delivery: string | null
    status: string
    total_cents: number | null
    notes: string | null
  }
  itemsData: any[]
  vendors: any[]
  materials: any[]
}

export default function EditPOClient({ orderData, itemsData, vendors, materials }: EditPOClientProps) {
  const router = useRouter()
  
  const [selectedVendor, setSelectedVendor] = useState(orderData.vendor_id || '')
  const [orderDate, setOrderDate] = useState(orderData.order_date || new Date().toISOString().split('T')[0])
  const [expectedDelivery, setExpectedDelivery] = useState(orderData.expected_delivery || '')
  const [notes, setNotes] = useState(orderData.notes || '')
  const [status, setStatus] = useState(orderData.status || 'draft')
  const [successMessage, setSuccessMessage] = useState('')
  const [items, setItems] = useState<OrderItem[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [totalCents, setTotalCents] = useState(orderData.total_cents || 0)

  // Inicializar itens com dados existentes
  useEffect(() => {
    if (itemsData && itemsData.length > 0) {
      const formattedItems = itemsData.map(item => ({
        po_item_id: item.po_item_id,
        mm_material: item.mm_material,
        mm_qtt: Number(item.mm_qtt),
        unit_cost_cents: item.unit_cost_cents,
        line_total_cents: item.line_total_cents,
        mm_material_data: item.mm_material_data
      }))
      setItems(formattedItems)
    }
  }, [itemsData])

  const addItem = () => {
    const newItem: OrderItem = {
      mm_material: '',
      mm_qtt: 1,
      unit_cost_cents: 0,
      line_total_cents: 0
    }
    setItems([...items, newItem])
  }

  const removeItem = (index: number) => {
    setItems(items.filter((_, i) => i !== index))
  }

  const updateItem = (index: number, field: keyof OrderItem, value: any) => {
    const updatedItems = [...items]
    updatedItems[index] = { ...updatedItems[index], [field]: value }
    
    // Recalcular line_total_cents se quantidade ou preço mudaram
    if (field === 'mm_qtt' || field === 'unit_cost_cents') {
      const item = updatedItems[index]
      item.line_total_cents = Math.round(item.mm_qtt * item.unit_cost_cents)
    }
    
    setItems(updatedItems)
  }

  // Recalcular total quando itens mudam
  useEffect(() => {
    const total = items.reduce((sum, item) => sum + item.line_total_cents, 0)
    setTotalCents(total)
  }, [items])

  const validateAndShowErrors = () => {
    if (!selectedVendor) {
      setError('Selecione um fornecedor')
      return false
    }
    if (!orderDate) {
      setError('Data do pedido é obrigatória')
      return false
    }
    if (items.length === 0) {
      setError('Adicione pelo menos um item')
      return false
    }
    for (let i = 0; i < items.length; i++) {
      const item = items[i]
      if (!item.mm_material) {
        setError(`Material é obrigatório no item ${i + 1}`)
        return false
      }
      if (item.mm_qtt <= 0) {
        setError(`Quantidade deve ser maior que zero no item ${i + 1}`)
        return false
      }
      if (item.unit_cost_cents <= 0) {
        setError(`Preço unitário deve ser maior que zero no item ${i + 1}`)
        return false
      }
    }
    return true
  }

  const updatePurchaseOrder = async () => {
    if (!validateAndShowErrors()) return
    
    setIsLoading(true)
    setError('')
    setSuccessMessage('')

    try {
      // 1. Atualizar header do pedido
      const headerResponse = await fetch(`/api/mm/purchase-orders/${orderData.mm_order}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          vendor_id: selectedVendor,
          order_date: orderDate,
          expected_delivery: expectedDelivery || null,
          status: status,
          notes: notes || null,
          total_cents: totalCents
        })
      })

      if (!headerResponse.ok) {
        const text = await headerResponse.text()
        throw new Error(text)
      }

      const headerResult = await headerResponse.json()
      if (!headerResult.ok) {
        throw new Error(headerResult.error?.message || 'Erro ao atualizar pedido')
      }

      // 2. Atualizar itens (remover todos e recriar)
      // Primeiro, remover itens existentes
      const deleteResponse = await fetch(`/api/mm/purchase-order-items?mm_order=${orderData.mm_order}`, {
        method: 'DELETE'
      })

      if (!deleteResponse.ok) {
        console.warn('Erro ao remover itens existentes:', await deleteResponse.text())
      }

      // Criar novos itens
      for (const item of items) {
        const itemResponse = await fetch('/api/mm/purchase-order-items', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            mm_order: orderData.mm_order,
            mm_material: item.mm_material,
            plant_id: 'GOIANIA', // Conforme guardrails - usar valor fixo local
            mm_qtt: Number(item.mm_qtt),
            unit_cost_cents: item.unit_cost_cents,
            notes: null
          })
        })

        if (!itemResponse.ok) {
          const text = await itemResponse.text()
          throw new Error(`Erro ao criar item: ${text}`)
        }
      }

      setSuccessMessage('Pedido atualizado com sucesso!')
      setTimeout(() => {
        router.push(`/mm/purchases/${orderData.mm_order}`)
      }, 1500)

    } catch (err) {
      console.error('Error updating purchase order:', err)
      setError(err instanceof Error ? err.message : 'Erro desconhecido')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-800">
      <div className="space-y-8 p-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href={`/mm/purchases/${orderData.mm_order}`} className="btn-fiori-outline flex items-center gap-2">
              <ArrowLeft className="w-4 h-4" />
              Voltar
            </Link>
            <div>
              <h1 className="text-3xl font-bold text-white">Editar Pedido de Compra</h1>
              <p className="text-gray-300 mt-2">Editar pedido {orderData.mm_order}</p>
            </div>
          </div>
        </div>

        {/* Messages */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded p-4">
            <div className="font-medium text-red-700">Erro</div>
            <div className="text-red-800 mt-1">{error}</div>
          </div>
        )}

        {successMessage && (
          <div className="bg-green-50 border border-green-200 rounded p-4">
            <div className="font-medium text-green-700">Sucesso</div>
            <div className="text-green-800 mt-1">{successMessage}</div>
          </div>
        )}

        {/* Form */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h2 className="text-xl font-semibold mb-6 text-gray-900">Informações do Pedido</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Fornecedor */}
            <div>
              <label htmlFor="vendor" className="block text-sm font-medium text-gray-700 mb-2">
                Fornecedor *
              </label>
              <select
                id="vendor"
                value={selectedVendor}
                onChange={(e) => setSelectedVendor(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              >
                <option value="">Selecione um fornecedor</option>
                {vendors.map((vendor) => (
                  <option key={vendor.vendor_id} value={vendor.vendor_id}>
                    {vendor.vendor_name} ({vendor.vendor_id})
                  </option>
                ))}
              </select>
            </div>

            {/* Data do Pedido */}
            <div>
              <label htmlFor="orderDate" className="block text-sm font-medium text-gray-700 mb-2">
                Data do Pedido *
              </label>
              <input
                type="date"
                id="orderDate"
                value={orderDate}
                onChange={(e) => setOrderDate(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            {/* Data de Entrega Esperada */}
            <div>
              <label htmlFor="expectedDelivery" className="block text-sm font-medium text-gray-700 mb-2">
                Data de Entrega Esperada
              </label>
              <input
                type="date"
                id="expectedDelivery"
                value={expectedDelivery}
                onChange={(e) => setExpectedDelivery(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Status */}
            <div>
              <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-2">
                Status
              </label>
              <select
                id="status"
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="draft">Rascunho</option>
                <option value="confirmed">Confirmado</option>
                <option value="in_progress">Em Andamento</option>
                <option value="cancelled">Cancelado</option>
              </select>
            </div>
          </div>

          {/* Observações */}
          <div className="mt-6">
            <label htmlFor="notes" className="block text-sm font-medium text-gray-700 mb-2">
              Observações
            </label>
            <textarea
              id="notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Observações adicionais sobre o pedido..."
            />
          </div>
        </div>

        {/* Itens do Pedido */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-900">Itens do Pedido</h2>
            <button
              onClick={addItem}
              className="btn-fiori-primary flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              Adicionar Item
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Material</th>
                  <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Quantidade</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Preço Unit.</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Total</th>
                  <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Ações</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {items.map((item, index) => (
                  <tr key={index}>
                    <td className="px-6 py-4">
                      <select
                        value={item.mm_material}
                        onChange={(e) => updateItem(index, 'mm_material', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="">Selecione um material</option>
                        {materials.map((material) => (
                          <option key={material.mm_material} value={material.mm_material}>
                            {material.mm_material} - {material.mm_comercial || material.mm_desc}
                          </option>
                        ))}
                      </select>
                    </td>
                    <td className="px-6 py-4">
                      <input
                        type="number"
                        min="0.01"
                        step="0.01"
                        value={item.mm_qtt}
                        onChange={(e) => updateItem(index, 'mm_qtt', parseFloat(e.target.value) || 0)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-center"
                      />
                    </td>
                    <td className="px-6 py-4">
                      <input
                        type="number"
                        min="0"
                        step="0.01"
                        value={(item.unit_cost_cents / 100).toFixed(2)}
                        onChange={(e) => updateItem(index, 'unit_cost_cents', Math.round((parseFloat(e.target.value) || 0) * 100))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-right"
                      />
                    </td>
                    <td className="px-6 py-4 text-right font-medium">
                      {formatBRL(item.line_total_cents)}
                    </td>
                    <td className="px-6 py-4 text-center">
                      <button
                        onClick={() => removeItem(index)}
                        className="text-red-600 hover:text-red-800"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Total */}
          <div className="mt-6 flex justify-end">
            <div className="text-right">
              <div className="text-sm text-gray-500">Total do Pedido</div>
              <div className="text-2xl font-bold text-gray-900">{formatBRL(totalCents)}</div>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex justify-center gap-4">
          <button
            onClick={() => router.push(`/mm/purchases/${orderData.mm_order}`)}
            className="btn-fiori-secondary"
            disabled={isLoading}
          >
            <X className="w-4 h-4 mr-2" />
            Cancelar
          </button>
          <button
            onClick={updatePurchaseOrder}
            className="btn-fiori-primary"
            disabled={isLoading}
          >
            <Save className="w-4 h-4 mr-2" />
            {isLoading ? 'Salvando...' : 'Salvar Alterações'}
          </button>
        </div>
      </div>
    </div>
  )
}
