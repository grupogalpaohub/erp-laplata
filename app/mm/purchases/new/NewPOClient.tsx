'use client'

import { useState } from 'react'
import { Plus, Trash2, Calculator } from 'lucide-react'
import { formatBRL, toCents } from '@/lib/money'
import { createPurchaseOrder } from '@/app/mm/_actions'

interface Material {
  mm_material: string
  mm_comercial: string | null
  mm_desc: string | null
  mm_purchase_price_cents: number | null
}

interface Vendor {
  vendor_id: string
  vendor_name: string
}

interface OrderItem {
  material: string
  quantity: number
  unitPrice: number
  total: number
}

interface NewPOClientProps {
  vendors: Vendor[]
  materials: Material[]
}

export default function NewPOClient({ vendors, materials }: NewPOClientProps) {
  const [items, setItems] = useState<OrderItem[]>([{ material: '', quantity: 0, unitPrice: 0, total: 0 }])
  const [selectedVendor, setSelectedVendor] = useState('')
  const [poDate, setPoDate] = useState(new Date().toISOString().slice(0, 10))
  const [expectedDelivery, setExpectedDelivery] = useState('')
  const [notes, setNotes] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')

  const addItem = () => {
    setItems([...items, { material: '', quantity: 0, unitPrice: 0, total: 0 }])
  }

  const removeItem = (index: number) => {
    if (items.length > 1) {
      setItems(items.filter((_, i) => i !== index))
    }
  }

  const updateItem = (index: number, field: keyof OrderItem, value: string | number) => {
    const newItems = [...items]
    newItems[index] = { ...newItems[index], [field]: value }
    
    // Se mudou o material, carregar preço padrão
    if (field === 'material') {
      const selectedMaterial = materials.find(m => m.mm_material === value)
      if (selectedMaterial?.mm_purchase_price_cents) {
        newItems[index].unitPrice = toReais(selectedMaterial.mm_purchase_price_cents)
      }
    }
    
    // Recalcular total do item
    if (field === 'quantity' || field === 'unitPrice') {
      newItems[index].total = newItems[index].quantity * newItems[index].unitPrice
    }
    
    setItems(newItems)
  }

  const calculateTotal = () => {
    return items.reduce((sum, item) => sum + item.total, 0)
  }

  const canSubmit = () => {
    return selectedVendor && 
           items.some(item => item.material && item.quantity > 0 && item.unitPrice > 0) &&
           !isLoading
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')

    try {
      // Filtrar apenas itens válidos
      const validItems = items.filter(item => 
        item.material && item.quantity > 0 && item.unitPrice > 0
      )

      if (validItems.length === 0) {
        setError('Adicione pelo menos um item válido')
        return
      }

      const orderData = {
        vendor_id: selectedVendor,
        po_date: poDate,
        expected_delivery: expectedDelivery || null,
        notes: notes || null,
        items: validItems.map(item => ({
          material_id: item.material,
          quantity: item.quantity,
          unit_price: item.unitPrice,
          total: item.total
        }))
      }

      const formData = new FormData()
      formData.append('vendor_id', selectedVendor)
      formData.append('po_date', poDate)
      formData.append('expected_delivery', expectedDelivery)
      formData.append('notes', notes)

      const result = await createPurchaseOrder(formData)

      if (result.success) {
        // Redirecionar para o pedido criado
        window.location.href = `/mm/purchases/${result.po_id}?success=Pedido criado com sucesso`
      } else {
        setError(result.error || 'Erro ao criar pedido')
      }
    } catch (err) {
      console.error('Erro ao criar pedido:', err)
      setError('Erro interno do servidor')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="form-fiori">
      <div className="card-fiori mb-8">
        <h2 className="text-xl font-semibold mb-4">Dados do Pedido</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="label-fiori">Fornecedor *</label>
            <select 
              required 
              className="input-fiori"
              value={selectedVendor}
              onChange={(e) => setSelectedVendor(e.target.value)}
            >
              <option value="">Selecione o fornecedor...</option>
              {vendors.map((vendor) => (
                <option key={vendor.vendor_id} value={vendor.vendor_id}>
                  {vendor.vendor_name}
                </option>
              ))}
            </select>
          </div>
          
          <div>
            <label className="label-fiori">Data do Pedido *</label>
            <input 
              type="date" 
              required 
              className="input-fiori" 
              value={poDate}
              onChange={(e) => setPoDate(e.target.value)}
            />
          </div>
          
          <div>
            <label className="label-fiori">Expectativa de Recebimento</label>
            <input 
              type="date" 
              className="input-fiori" 
              value={expectedDelivery}
              onChange={(e) => setExpectedDelivery(e.target.value)}
            />
          </div>
          
          <div className="md:col-span-2">
            <label className="label-fiori">Comentários</label>
            <textarea 
              rows={3} 
              className="input-fiori"
              placeholder="Observações sobre o pedido..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
            />
          </div>
        </div>
      </div>

      <div className="card-fiori mb-8">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Itens do Pedido</h2>
          <button 
            type="button"
            onClick={addItem}
            className="btn-fiori-primary flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Adicionar Linha
          </button>
        </div>
        
        <div className="overflow-x-auto">
          <table className="table-fiori">
            <thead>
              <tr>
                <th>Material</th>
                <th>Quantidade</th>
                <th>Preço Unitário (R$)</th>
                <th>Total (R$)</th>
                <th>Ações</th>
              </tr>
            </thead>
            <tbody>
              {items.map((item, index) => (
                <tr key={index}>
                  <td>
                    <select 
                      className="input-fiori"
                      value={item.material}
                      onChange={(e) => updateItem(index, 'material', e.target.value)}
                    >
                      <option value="">Selecione o material...</option>
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
                      min="0" 
                      step="1" 
                      className="input-fiori"
                      value={item.quantity}
                      onChange={(e) => updateItem(index, 'quantity', parseInt(e.target.value) || 0)}
                    />
                  </td>
                  <td>
                    <input 
                      type="number" 
                      min="0" 
                      step="0.01" 
                      className="input-fiori"
                      value={item.unitPrice}
                      onChange={(e) => updateItem(index, 'unitPrice', parseFloat(e.target.value) || 0)}
                    />
                  </td>
                  <td className="text-right font-medium">
                    {formatBRL(toCents(item.total))}
                  </td>
                  <td>
                    {items.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeItem(index)}
                        className="text-red-600 hover:text-red-800"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        <div className="mt-6 flex justify-end">
          <div className="bg-fiori-secondary p-4 rounded-lg">
            <div className="flex items-center gap-2 text-xl font-bold">
              <Calculator className="w-5 h-5" />
              Total: {formatBRL(toCents(calculateTotal()))}
            </div>
          </div>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
          <p className="text-red-800 font-medium">{error}</p>
        </div>
      )}

      <div className="flex justify-end gap-4">
        <a href="/mm/purchases" className="btn-fiori-outline">Cancelar</a>
        <button 
          type="submit" 
          disabled={!canSubmit()}
          className="btn-fiori-primary disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? 'Criando...' : 'Criar Pedido'}
        </button>
      </div>
    </form>
  )
}



