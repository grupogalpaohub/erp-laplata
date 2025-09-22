'use client'

import { useState } from 'react'
import { Plus, Trash2, Calculator } from 'lucide-react'

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
    
    // Se mudou o material, atualizar preço unitário
    if (field === 'material') {
      const material = materials.find(m => m.mm_material === value)
      if (material && material.mm_purchase_price_cents) {
        newItems[index].unitPrice = material.mm_purchase_price_cents / 10000
        newItems[index].total = newItems[index].quantity * newItems[index].unitPrice
      }
    }
    
    // Se mudou quantidade ou preço, recalcular total
    if (field === 'quantity' || field === 'unitPrice') {
      newItems[index].total = newItems[index].quantity * newItems[index].unitPrice
    }
    
    setItems(newItems)
  }

  const getTotal = () => {
    return items.reduce((sum, item) => sum + item.total, 0)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')

    try {
      const validItems = items.filter(item => item.material && item.quantity > 0)
      if (validItems.length === 0) {
        throw new Error('Adicione pelo menos um item ao pedido')
      }

      const response = await fetch('/api/mm/purchases/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          vendor_id: selectedVendor,
          po_date: poDate,
          items: validItems
        })
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.error || 'Erro ao criar pedido')
      }

      // Redirecionar para lista de pedidos
      window.location.href = '/mm/purchases'
    } catch (err) {
      console.error('Erro ao criar pedido:', err)
      setError(err instanceof Error ? err.message : 'Erro ao criar pedido')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <>
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="form-fiori">
        {/* Header do Pedido */}
        <div className="card-fiori mb-8">
          <h2 className="text-xl font-semibold mb-4">Dados do Pedido</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="label-fiori">Fornecedor *</label>
              <select
                value={selectedVendor}
                onChange={(e) => setSelectedVendor(e.target.value)}
                required
                className="input-fiori"
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
                value={poDate}
                onChange={(e) => setPoDate(e.target.value)}
                required
                className="input-fiori"
              />
            </div>
          </div>
        </div>

        {/* Itens do Pedido */}
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
                        value={item.material}
                        onChange={(e) => updateItem(index, 'material', e.target.value)}
                        className="input-fiori"
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
                        value={item.quantity}
                        onChange={(e) => updateItem(index, 'quantity', Number(e.target.value))}
                        className="input-fiori"
                      />
                    </td>
                    <td>
                      <input
                        type="number"
                        min="0"
                        step="0.01"
                        value={item.unitPrice}
                        onChange={(e) => updateItem(index, 'unitPrice', Number(e.target.value))}
                        className="input-fiori"
                      />
                    </td>
                    <td className="text-right font-medium">
                      R$ {item.total.toFixed(2)}
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

          {/* Total */}
          <div className="mt-6 flex justify-end">
            <div className="bg-fiori-secondary p-4 rounded-lg">
              <div className="flex items-center gap-2 text-xl font-bold">
                <Calculator className="w-5 h-5" />
                Total: R$ {getTotal().toFixed(2)}
              </div>
            </div>
          </div>
        </div>

        {/* Botões */}
        <div className="flex justify-end gap-4">
          <a href="/mm/purchases" className="btn-fiori-outline">
            Cancelar
          </a>
          <button
            type="submit"
            disabled={isLoading || !selectedVendor || getTotal() === 0}
            className="btn-fiori-primary"
          >
            {isLoading ? 'Criando...' : 'Criar Pedido'}
          </button>
        </div>
      </form>
    </>
  )
}
