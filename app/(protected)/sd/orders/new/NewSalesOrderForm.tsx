'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Save, X, Plus, Trash2 } from 'lucide-react'
import { formatBRL, toCents } from '@/lib/money'
import { createSalesOrder } from '@/app/sd/_actions'

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
  const [paymentMethod, setPaymentMethod] = useState('')
  const [paymentTerm, setPaymentTerm] = useState('')
  const [notes, setNotes] = useState('')
  const [status, setStatus] = useState('draft')
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
    toCents(totalNegotiatedReais) : 
    totalFinalCents
  
  // Gap entre valor final e valor negociado
  const valueGapCents = totalFinalCents - totalNegotiatedCents
  const valueGapPercent = totalFinalCents > 0 ? (valueGapCents / totalFinalCents) * 100 : 0
  
  // Lucro calculado sobre valor final (primeiro)
  const estimatedCostFinalCents = Math.round(totalFinalCents * 0.7)
  const profitFinalCents = totalFinalCents - estimatedCostFinalCents
  const profitFinalPercent = totalFinalCents > 0 ? (profitFinalCents / totalFinalCents) * 100 : 0
  
  // Lucro calculado sobre valor negociado (segundo)
  const estimatedCostNegotiatedCents = Math.round(totalNegotiatedCents * 0.7)
  const profitNegotiatedCents = totalNegotiatedCents - estimatedCostNegotiatedCents
  const profitNegotiatedPercent = totalNegotiatedCents > 0 ? (profitNegotiatedCents / totalNegotiatedCents) * 100 : 0

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!validateAndShowErrors()) return

    setIsLoading(true)
    setError('')

    // Usar o valor negociado calculado
    const finalTotalNegotiatedCents = totalNegotiatedCents || totalFinalCents

    try {
      const formData = new FormData()
      formData.append('customer_id', selectedCustomer)
      formData.append('order_date', orderDate)
      formData.append('payment_method', paymentMethod)
      formData.append('payment_term', paymentTerm)
      formData.append('notes', notes)
      formData.append('status', status)
      formData.append('total_negotiated', (finalTotalNegotiatedCents / 100).toString())
      formData.append('total', (totalFinalCents / 100).toString())
      
      // Adicionar itens
      items.forEach(item => {
        formData.append('items[]', JSON.stringify({
          material_id: item.material_id,
          quantity: item.quantity,
          unit_price: (item.unit_price_cents / 100).toString()
        }))
      })

      const result = await createSalesOrder(formData)

      if (result.success) {
        setSuccessMessage(`Pedido criado com sucesso! Número: ${result.so_id || 'N/A'}`)
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

            <div>
              <label htmlFor="status" className="label-fiori">
                Status
              </label>
              <input
                type="text"
                id="status"
                name="status"
                value="Rascunho"
                readOnly
                className="input-fiori bg-fiori-bg-secondary"
              />
              <p className="text-xs text-fiori-muted mt-1">
                Status inicial - será alterado ao salvar
              </p>
            </div>

            <div>
              <label htmlFor="payment_method" className="label-fiori">
                Forma de Pagamento
              </label>
              <select
                id="payment_method"
                name="payment_method"
                value={paymentMethod}
                onChange={(e) => setPaymentMethod(e.target.value)}
                className="select-fiori"
              >
                <option value="">Selecione uma forma</option>
                <option value="PIX">PIX</option>
                <option value="CARTAO_CREDITO">Cartão de Crédito</option>
                <option value="CARTAO_DEBITO">Cartão de Débito</option>
                <option value="BOLETO">Boleto</option>
                <option value="DINHEIRO">Dinheiro</option>
                <option value="TRANSFERENCIA">Transferência</option>
              </select>
            </div>

            <div>
              <label htmlFor="payment_term" className="label-fiori">
                Condição de Pagamento
              </label>
              <select
                id="payment_term"
                name="payment_term"
                value={paymentTerm}
                onChange={(e) => setPaymentTerm(e.target.value)}
                className="select-fiori"
              >
                <option value="">Selecione uma condição</option>
                <option value="A_VISTA">À Vista</option>
                <option value="30_DIAS">30 dias</option>
                <option value="60_DIAS">60 dias</option>
                <option value="90_DIAS">90 dias</option>
                <option value="PARCELADO">Parcelado</option>
              </select>
            </div>

            <div className="md:col-span-2">
              <label htmlFor="notes" className="label-fiori">
                Observações
              </label>
              <textarea
                id="notes"
                name="notes"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={3}
                className="input-fiori"
                placeholder="Observações adicionais sobre o pedido..."
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
                        type="text"
                        value={formatBRL(item.unit_price_cents)}
                        readOnly
                        className="input-fiori bg-fiori-bg-secondary w-24 text-right"
                      />
                    </td>
                    <td>
                      <input
                        type="text"
                        value={formatBRL(item.line_total_cents)}
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
                value={formatBRL(totalFinalCents)}
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
                placeholder="Deixe vazio para usar valor final"
                className="input-fiori"
              />
              <p className="text-xs text-fiori-muted mt-1">
                Valor efetivamente negociado (opcional) - Se vazio, usa o valor final
              </p>
            </div>
          </div>
          
          {/* KPIs */}
          <div className="mt-6 pt-6 border-t border-fiori-border">
            <h4 className="text-lg font-semibold text-fiori-text mb-4">Indicadores de Rentabilidade</h4>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
              <div className="bg-yellow-50 p-4 rounded-lg">
                <div className="text-sm text-yellow-600 font-medium">Gap Final vs Negociado</div>
                <div className="text-2xl font-bold text-yellow-800">
                  {formatBRL(valueGapCents)}
                </div>
                <div className="text-xs text-yellow-600">
                  {valueGapCents > 0 ? `Desconto (${valueGapPercent.toFixed(1)}%)` : valueGapCents < 0 ? `Acréscimo (${Math.abs(valueGapPercent).toFixed(1)}%)` : 'Iguais (0%)'}
                </div>
              </div>
              
              <div className="bg-blue-50 p-4 rounded-lg">
                <div className="text-sm text-blue-600 font-medium">Lucro (Valor Final) R$</div>
                <div className="text-2xl font-bold text-blue-800">
                  {formatBRL(profitFinalCents)}
                </div>
                <div className="text-xs text-blue-600">
                  Sobre valor final
                </div>
              </div>
              
              <div className="bg-indigo-50 p-4 rounded-lg">
                <div className="text-sm text-indigo-600 font-medium">Lucro (Valor Final) %</div>
                <div className="text-2xl font-bold text-indigo-800">
                  {profitFinalPercent.toFixed(1)}%
                </div>
                <div className="text-xs text-indigo-600">
                  Sobre valor final
                </div>
              </div>
              
              <div className="bg-green-50 p-4 rounded-lg">
                <div className="text-sm text-green-600 font-medium">Lucro (Negociado) R$</div>
                <div className="text-2xl font-bold text-green-800">
                  {formatBRL(profitNegotiatedCents)}
                </div>
                <div className="text-xs text-green-600">
                  Sobre valor negociado
                </div>
              </div>
              
              <div className="bg-purple-50 p-4 rounded-lg">
                <div className="text-sm text-purple-600 font-medium">Lucro (Negociado) %</div>
                <div className="text-2xl font-bold text-purple-800">
                  {profitNegotiatedPercent.toFixed(1)}%
                </div>
                <div className="text-xs text-purple-600">
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



