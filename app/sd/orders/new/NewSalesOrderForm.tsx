'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Save, X, Plus, Trash2 } from 'lucide-react'

interface Customer {
  customer_id: string
  name: string
  contact_email: string
}

interface Material {
  mm_material: string
  mm_comercial: string
  mm_desc: string
  mm_price_cents: number
}

interface PaymentTerm {
  terms_code: string
  description: string
}

interface OrderItem {
  temp_id: string
  material_id: string
  material_name: string
  quantity: number
  unit_price_cents: number
  line_total_cents: number
}

interface NewSalesOrderFormProps {
  customers: Customer[]
  materials: Material[]
  paymentTerms: PaymentTerm[]
}

export default function NewSalesOrderForm({ customers, materials, paymentTerms }: NewSalesOrderFormProps) {
  const [selectedCustomer, setSelectedCustomer] = useState('')
  const [orderDate, setOrderDate] = useState(new Date().toISOString().split('T')[0])
  const [paymentTerm, setPaymentTerm] = useState('')
  const [totalNegotiatedCents, setTotalNegotiatedCents] = useState('')
  const [notes, setNotes] = useState('')
  const [items, setItems] = useState<OrderItem[]>([
    {
      temp_id: '1',
      material_id: '',
      material_name: '',
      quantity: 1,
      unit_price_cents: 0,
      line_total_cents: 0
    }
  ])

  const addItem = () => {
    const newItem: OrderItem = {
      temp_id: Date.now().toString(),
      material_id: '',
      material_name: '',
      quantity: 1,
      unit_price_cents: 0,
      line_total_cents: 0
    }
    setItems([...items, newItem])
  }

  const removeItem = (tempId: string) => {
    if (items.length > 1) {
      setItems(items.filter(item => item.temp_id !== tempId))
    }
  }

  const updateItem = (tempId: string, field: keyof OrderItem, value: any) => {
    setItems(items.map(item => {
      if (item.temp_id === tempId) {
        const updatedItem = { ...item, [field]: value }
        
        // Se mudou o material, buscar preço
        if (field === 'material_id') {
          const material = materials.find(m => m.mm_material === value)
          if (material) {
            updatedItem.material_name = material.mm_comercial || material.mm_desc
            updatedItem.unit_price_cents = material.mm_price_cents
            updatedItem.line_total_cents = updatedItem.quantity * material.mm_price_cents
          } else {
            updatedItem.material_name = ''
            updatedItem.unit_price_cents = 0
            updatedItem.line_total_cents = 0
          }
        }
        
        // Se mudou a quantidade, recalcular total
        if (field === 'quantity') {
          updatedItem.line_total_cents = Number(value) * updatedItem.unit_price_cents
        }
        
        return updatedItem
      }
      return item
    }))
  }

  const totalFinalCents = items.reduce((sum, item) => sum + item.line_total_cents, 0)

  const handleSubmit = async (formData: FormData) => {
    // TODO: Implementar Server Action para criar pedido
    console.log('Creating sales order...', {
      selectedCustomer,
      orderDate,
      paymentTerm,
      totalNegotiatedCents,
      notes,
      items,
      totalFinalCents
    })
  }

  return (
    <form action={handleSubmit} className="space-y-8">
      {/* Header do Pedido */}
      <div className="card-fiori">
        <div className="card-fiori-header">
          <h3 className="card-fiori-title">Dados do Pedido</h3>
        </div>
        <div className="card-fiori-content">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label htmlFor="customer_id" className="label-fiori">
                Cliente *
              </label>
              <select
                id="customer_id"
                name="customer_id"
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
            <div>
              <label htmlFor="payment_term" className="label-fiori">
                Forma de Pagamento *
              </label>
              <select
                id="payment_term"
                name="payment_term"
                required
                value={paymentTerm}
                onChange={(e) => setPaymentTerm(e.target.value)}
                className="select-fiori"
              >
                <option value="">Selecione uma forma</option>
                {paymentTerms.map((term) => (
                  <option key={term.terms_code} value={term.terms_code}>
                    {term.description}
                  </option>
                ))}
              </select>
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
                            {material.mm_comercial || material.mm_desc}
                          </option>
                        ))}
                      </select>
                      {item.material_name && (
                        <div className="text-xs text-fiori-muted mt-1">
                          {item.material_name}
                        </div>
                      )}
                    </td>
                    <td className="text-right">
                      <input
                        type="number"
                        min="0.01"
                        step="0.01"
                        value={item.quantity}
                        onChange={(e) => updateItem(item.temp_id, 'quantity', Number(e.target.value))}
                        className="input-fiori w-24 text-right"
                      />
                    </td>
                    <td className="text-right">
                      <div className="text-sm font-mono">
                        R$ {(item.unit_price_cents / 100).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                      </div>
                    </td>
                    <td className="text-right">
                      <div className="text-sm font-semibold">
                        R$ {(item.line_total_cents / 100).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                      </div>
                    </td>
                    <td>
                      <button
                        type="button"
                        onClick={() => removeItem(item.temp_id)}
                        disabled={items.length === 1}
                        className="btn-fiori-danger-outline text-xs disabled:opacity-50"
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
                value={totalNegotiatedCents}
                onChange={(e) => setTotalNegotiatedCents(e.target.value)}
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

      {/* Observações */}
      <div className="card-fiori">
        <div className="card-fiori-header">
          <h3 className="card-fiori-title">Observações</h3>
        </div>
        <div className="card-fiori-content">
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

      {/* Botões de Ação */}
      <div className="flex justify-end gap-4">
        <Link href="/sd/orders" className="btn-fiori-outline flex items-center gap-2">
          <X className="w-4 h-4" />
          Cancelar
        </Link>
        <button type="submit" className="btn-fiori-primary flex items-center gap-2">
          <Save className="w-4 h-4" />
          Salvar Pedido (Rascunho)
        </button>
      </div>
    </form>
  )
}
