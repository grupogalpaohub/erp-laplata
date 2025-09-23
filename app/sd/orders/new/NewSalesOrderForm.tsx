'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Save, X, Plus, Trash2 } from 'lucide-react'

interface OrderItem {
  temp_id: string
  material_id: string
  quantity: number
  unit_price_cents: number
  line_total_cents: number
}

interface NewSalesOrderFormProps {
  customers: any[]
  materials: any[]
  selectedCustomerId?: string
}

export default function NewSalesOrderForm({ customers, materials, selectedCustomerId }: NewSalesOrderFormProps) {
  const router = useRouter()
  
  const [selectedCustomer, setSelectedCustomer] = useState(selectedCustomerId || '')
  const [orderDate, setOrderDate] = useState(new Date().toISOString().split('T')[0])
  const [totalNegotiatedReais, setTotalNegotiatedReais] = useState('')
  const [successMessage, setSuccessMessage] = useState('')
  const [items, setItems] = useState<OrderItem[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')

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
        
        // Se mudou o material, carregar preço do database
        if (field === 'material_id' && value) {
          const selectedMaterial = materials.find(m => m.mm_material === value)
          if (selectedMaterial) {
            updatedItem.unit_price_cents = selectedMaterial.mm_price_cents || 0
          }
        }
        
        // Recalcular total da linha se quantidade ou preço mudaram
        if (field === 'quantity' || field === 'unit_price_cents' || field === 'material_id') {
          updatedItem.line_total_cents = updatedItem.quantity * updatedItem.unit_price_cents
        }
        
        return updatedItem
      }
      return item
    }))
  }

  const isValid = () => {
    return selectedCustomer && items.length > 0 && items.every(item => item.material_id && item.quantity > 0)
  }

  const validateAndShowErrors = () => {
    if (!selectedCustomer) {
      alert('Selecione um cliente')
      return false
    }
    if (items.length === 0) {
      alert('Adicione pelo menos um item')
      return false
    }
    return items.every(item => item.material_id && item.quantity > 0)
  }

  // Cálculo de totais
  const totalItemsCents = items.reduce((sum, item) => sum + item.line_total_cents, 0)
  const totalFinalCents = totalItemsCents
  
  // Cálculo de KPIs
  const totalNegotiatedCents = totalNegotiatedReais ? 
    Math.round(parseFloat(totalNegotiatedReais.replace(',', '.')) * 100) : 
    totalFinalCents
  
  // Margem de contribuição (valor negociado - custo estimado)
  // Para simplificar, vamos usar 70% do valor como custo estimado
  const estimatedCostCents = Math.round(totalNegotiatedCents * 0.7)
  const contributionMarginCents = totalNegotiatedCents - estimatedCostCents
  const contributionMarginPercent = totalNegotiatedCents > 0 ? 
    (contributionMarginCents / totalNegotiatedCents) * 100 : 0
  
  // Lucro em reais
  const profitCents = contributionMarginCents

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!validateAndShowErrors()) return

    setIsLoading(true)
    setError('')

    // Usar o valor negociado calculado
    const totalNegotiatedCents = totalNegotiatedCents

    try {
      const response = await fetch('/api/sd/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          selectedCustomer,
          orderDate,
          totalNegotiatedCents,
          items,
          totalFinalCents: totalFinalCents // Sempre o valor calculado dos itens
        })
      })

      const result = await response.json()

      if (response.ok) {
        setSuccessMessage(`Pedido criado com sucesso! Número: ${result.order?.so_id || 'N/A'}`)
        setError('')
        // Limpar formulário
        setSelectedCustomer('')
        setOrderDate(new Date().toISOString().split('T')[0])
        setTotalNegotiatedReais('')
        setItems([])
        // Redirecionar após 2 segundos
        setTimeout(() => {
          router.push('/sd/orders')
        }, 2000)
      } else {
        setError(result.error || 'Erro ao criar pedido')
        setSuccessMessage('')
      }
    } catch (error) {
      console.error('Error creating order:', error)
      setError('Erro ao criar pedido')
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

      {successMessage && (
        <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded">
          {successMessage}
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
              <div className="flex gap-2">
                <select
                  id="customer"
                  name="customer"
                  required
                  value={selectedCustomer}
                  onChange={(e) => setSelectedCustomer(e.target.value)}
                  className="select-fiori flex-1"
                >
                  <option value="">Selecione um cliente</option>
                  {customers.map((customer) => (
                    <option key={customer.customer_id} value={customer.customer_id}>
                      {customer.name} ({customer.contact_email})
                    </option>
                  ))}
                </select>
                <Link
                  href="/crm/customers/new?returnTo=/sd/orders/new"
                  className="btn-fiori-outline"
                >
                  Novo Cliente
                </Link>
              </div>
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
        </div>
      </div>

      {/* Totais e KPIs */}
      <div className="card-fiori">
        <div className="card-fiori-header">
          <h3 className="card-fiori-title">Totais e Indicadores</h3>
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
                Valor Final Negociado (R$) *
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
                Valor efetivamente negociado - Único campo editável
              </p>
            </div>
          </div>
          
          {/* KPIs */}
          <div className="mt-6 pt-6 border-t border-fiori-border">
            <h4 className="text-lg font-semibold text-fiori-text mb-4">Indicadores de Rentabilidade</h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-blue-50 p-4 rounded-lg">
                <div className="text-sm text-blue-600 font-medium">Margem de Contribuição</div>
                <div className="text-2xl font-bold text-blue-800">
                  {(contributionMarginCents / 100).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                </div>
                <div className="text-sm text-blue-600">
                  {contributionMarginPercent.toFixed(1)}% do valor negociado
                </div>
              </div>
              
              <div className="bg-green-50 p-4 rounded-lg">
                <div className="text-sm text-green-600 font-medium">Lucro Estimado</div>
                <div className="text-2xl font-bold text-green-800">
                  {(profitCents / 100).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                </div>
                <div className="text-sm text-green-600">
                  R$ {(profitCents / 100).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                </div>
              </div>
              
              <div className="bg-purple-50 p-4 rounded-lg">
                <div className="text-sm text-purple-600 font-medium">Margem de Lucro</div>
                <div className="text-2xl font-bold text-purple-800">
                  {contributionMarginPercent.toFixed(1)}%
                </div>
                <div className="text-sm text-purple-600">
                  Sobre valor negociado
                </div>
              </div>
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
          {isLoading ? 'Criando...' : 'Criar Pedido'}
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