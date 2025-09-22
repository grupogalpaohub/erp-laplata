'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Save, X, Plus, Trash2 } from 'lucide-react'

interface OrderItem {
  temp_id: string
  material_id: string
  quantity: number
  unit_price_cents: number
  line_total_cents: number
}

interface EditSalesOrderFormProps {
  order: any
  customers: any[]
  materials: any[]
  paymentTerms: any[]
}

export default function EditSalesOrderForm({ order, customers, materials, paymentTerms }: EditSalesOrderFormProps) {
  const router = useRouter()
  
  const [selectedCustomer, setSelectedCustomer] = useState(order.customer_id || '')
  const [orderDate, setOrderDate] = useState(order.order_date || '')
  const [totalNegotiatedReais, setTotalNegotiatedReais] = useState('')
  const [items, setItems] = useState<OrderItem[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [isLoadingItems, setIsLoadingItems] = useState(true)
  const [error, setError] = useState('')

  // Carregar itens do pedido
  useEffect(() => {
    if (order?.so_id) {
      loadOrderItems()
    }
  }, [order?.so_id])

  const loadOrderItems = async () => {
    try {
      setIsLoadingItems(true)
      const response = await fetch(`/api/sd/orders/${order.so_id}/items`)
      const result = await response.json()
      
      if (result.success) {
        const orderItems = result.items.map((item: any, index: number) => ({
          temp_id: `item_${index}`,
          material_id: item.sku,
          quantity: item.quantity,
          unit_price_cents: item.unit_price_cents,
          line_total_cents: item.line_total_cents
        }))
        setItems(orderItems)
      }
    } catch (error) {
      console.error('Error loading order items:', error)
    } finally {
      setIsLoadingItems(false)
    }
  }

  const addItem = () => {
    const newItem: OrderItem = {
      temp_id: `item_${Date.now()}`,
      material_id: '',
      quantity: 1,
      unit_price_cents: 0,
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
        
        if (field === 'quantity' || field === 'unit_price_cents') {
          updatedItem.line_total_cents = updatedItem.quantity * updatedItem.unit_price_cents
        }
        
        return updatedItem
      }
      return item
    }))
  }

  const isValid = () => {
    if (!selectedCustomer || !orderDate) {
      return false
    }
    if (items.length === 0) {
      return false
    }
    return items.every(item => item.material_id && item.quantity > 0)
  }

  // Cálculo de totais
  const totalItemsCents = items.reduce((sum, item) => sum + item.line_total_cents, 0)
  const totalFinalCents = totalItemsCents

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!isValid()) return

    setIsLoading(true)
    setError('')

    try {
      const totalNegotiatedCents = totalNegotiatedReais ? 
        Math.round(parseFloat(totalNegotiatedReais.replace(',', '.')) * 100) : 
        totalFinalCents

      const response = await fetch(`/api/sd/orders/${order.so_id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          selectedCustomer,
          orderDate,
          totalNegotiatedCents,
          items,
          totalFinalCents
        })
      })

      const result = await response.json()

      if (response.ok) {
        router.push(`/sd/orders?success=Pedido+atualizado+com+sucesso`)
      } else {
        setError(result.error || 'Erro ao atualizar pedido')
      }
    } catch (error) {
      console.error('Error updating order:', error)
      setError('Erro ao atualizar pedido')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      )}

      {/* Informações do Pedido */}
      <div className="card-fiori">
        <div className="card-fiori-header">
          <h3 className="card-fiori-title">Informações do Pedido</h3>
        </div>
        <div className="card-fiori-content">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="customer" className="label-fiori">
                Cliente *
              </label>
              <select
                id="customer"
                name="customer"
                required
                value={selectedCustomer}
                onChange={(e) => setSelectedCustomer(e.target.value)}
                className="select-fiori"
              >
                <option value="">Selecione um cliente</option>
                {customers.map((customer) => (
                  <option key={customer.customer_id} value={customer.customer_id}>
                    {customer.name} ({customer.contact_email})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="order_date" className="label-fiori">
                Data do Pedido *
              </label>
              <input
                type="date"
                id="order_date"
                name="order_date"
                required
                value={orderDate}
                onChange={(e) => setOrderDate(e.target.value)}
                className="input-fiori"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Itens do Pedido */}
      <div className="card-fiori">
        <div className="card-fiori-header">
          <h3 className="card-fiori-title">Itens do Pedido</h3>
          <button
            type="button"
            onClick={addItem}
            className="btn-fiori-outline flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Adicionar Item
          </button>
        </div>
        <div className="card-fiori-content p-0">
          {isLoadingItems ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-fiori-primary mx-auto"></div>
              <p className="text-fiori-muted mt-2">Carregando itens...</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="table-fiori">
                <thead>
                  <tr>
                    <th>Material</th>
                    <th className="text-right">Quantidade</th>
                    <th className="text-right">Preço (R$)</th>
                    <th className="text-right">Total (R$)</th>
                    <th className="w-12">Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {items.map((item) => (
                    <tr key={item.temp_id}>
                      <td>
                        <select
                          value={item.material_id}
                          onChange={(e) => updateItem(item.temp_id, 'material_id', e.target.value)}
                          className="select-fiori"
                        >
                          <option value="">Selecione um material</option>
                          {materials.map((material) => (
                            <option key={material.mm_material} value={material.mm_material}>
                              {material.mm_material} - {material.mm_comercial || material.mm_desc}
                            </option>
                          ))}
                        </select>
                      </td>
                      <td>
                        <input
                          type="number"
                          min="0.01"
                          step="0.01"
                          value={item.quantity}
                          onChange={(e) => updateItem(item.temp_id, 'quantity', parseFloat(e.target.value) || 0)}
                          className="input-fiori w-24 text-right"
                        />
                      </td>
                      <td>
                        <input
                          type="number"
                          min="0"
                          step="0.01"
                          value={(item.unit_price_cents / 100).toFixed(2)}
                          onChange={(e) => updateItem(item.temp_id, 'unit_price_cents', Math.round((parseFloat(e.target.value) || 0) * 100))}
                          className="input-fiori w-24 text-right"
                        />
                      </td>
                      <td>
                        <input
                          type="text"
                          value={(item.line_total_cents / 100).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                          readOnly
                          className="input-fiori bg-fiori-bg-secondary w-24 text-right"
                        />
                      </td>
                      <td>
                        <button
                          type="button"
                          onClick={() => removeItem(item.temp_id)}
                          className="btn-fiori-outline btn-sm text-red-600 hover:bg-red-50"
                        >
                          <Trash2 className="w-3 h-3" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Totais */}
      <div className="card-fiori">
        <div className="card-fiori-header">
          <h3 className="card-fiori-title">Totais</h3>
        </div>
        <div className="card-fiori-content">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="total_final_cents" className="label-fiori">
                Valor Final (R$)
              </label>
              <input
                type="text"
                id="total_final_cents"
                name="total_final_cents"
                value={(totalFinalCents / 100).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                readOnly
                className="input-fiori bg-fiori-bg-secondary"
              />
              <p className="text-xs text-fiori-muted mt-1">
                Calculado automaticamente pela soma dos itens
              </p>
            </div>
            <div>
              <label htmlFor="total_negotiated_cents" className="label-fiori">
                Valor Final Negociado (R$)
              </label>
              <input
                type="text"
                id="total_negotiated_cents"
                name="total_negotiated_cents"
                value={totalNegotiatedReais}
                onChange={(e) => setTotalNegotiatedReais(e.target.value)}
                placeholder="0,00"
                className="input-fiori"
              />
              <p className="text-xs text-fiori-muted mt-1">
                Valor efetivamente negociado (opcional)
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Botões */}
      <div className="flex gap-4">
        <button
          type="submit"
          disabled={isLoading || !isValid()}
          className="btn-fiori flex items-center gap-2"
        >
          <Save className="w-4 h-4" />
          {isLoading ? 'Salvando...' : 'Salvar Alterações'}
        </button>

        <button
          type="button"
          onClick={() => router.push('/sd/orders')}
          className="btn-fiori-outline flex items-center gap-2"
        >
          <X className="w-4 h-4" />
          Cancelar
        </button>
      </div>
    </form>
  )
}