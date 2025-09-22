'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@supabase/supabase-js'
import { getTenantId } from '@/lib/auth'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import Link from 'next/link'
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

export default function NewPOPage() {
  const [vendors, setVendors] = useState<Vendor[]>([])
  const [materials, setMaterials] = useState<Material[]>([])
  const [items, setItems] = useState<OrderItem[]>([{ material: '', quantity: 0, unitPrice: 0, total: 0 }])
  const [selectedVendor, setSelectedVendor] = useState('')
  const [poDate, setPoDate] = useState(new Date().toISOString().slice(0, 10))
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    try {
      const supabase = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.SUPABASE_SERVICE_ROLE_KEY!
      )
      const tenantId = await getTenantId()

      const [vendorsResult, materialsResult] = await Promise.all([
        supabase
          .from('mm_vendor')
          .select('vendor_id, vendor_name')
          .eq('tenant_id', tenantId)
          .eq('status', 'active')
          .order('vendor_name'),
        supabase
          .from('mm_material')
          .select('mm_material, mm_comercial, mm_desc, mm_purchase_price_cents')
          .eq('tenant_id', tenantId)
          .order('mm_material')
      ])

      if (vendorsResult.error) throw vendorsResult.error
      if (materialsResult.error) throw materialsResult.error

      setVendors(vendorsResult.data || [])
      setMaterials(materialsResult.data || [])
    } catch (err) {
      console.error('Erro ao carregar dados:', err)
      setError('Erro ao carregar dados')
    }
  }

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
      const supabase = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.SUPABASE_SERVICE_ROLE_KEY!
      )
      const tenantId = await getTenantId()

      // Criar header do pedido
      const header = {
        tenant_id: tenantId,
        mm_order: `PO-${Date.now()}`,
        vendor_id: selectedVendor,
        po_date: poDate,
        status: 'draft' as const,
        total_amount: Math.round(getTotal() * 10000) // Converter para centavos
      }

      const { data: headerData, error: headerError } = await supabase
        .from('mm_purchase_order')
        .insert(header)
        .select('mm_order')
        .single()

      if (headerError) throw headerError

      // Criar itens do pedido
      const validItems = items.filter(item => item.material && item.quantity > 0)
      if (validItems.length === 0) {
        throw new Error('Adicione pelo menos um item ao pedido')
      }

      const orderItems = validItems.map(item => ({
        tenant_id: tenantId,
        mm_order: headerData.mm_order,
        plant_id: 'DEFAULT',
        mm_material: item.material,
        mm_qtt: item.quantity,
        unit_cost_cents: Math.round(item.unitPrice * 10000),
        line_total_cents: Math.round(item.total * 10000)
      }))

      const { error: itemsError } = await supabase
        .from('mm_purchase_order_item')
        .insert(orderItems)

      if (itemsError) throw itemsError

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
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-fiori-primary mb-4">Criar Pedido de Compras</h1>
        <p className="text-xl text-fiori-secondary mb-2">Gerar novo pedido de compras</p>
        <p className="text-lg text-fiori-muted">Selecione fornecedor e materiais para criar o pedido</p>
      </div>

      {/* Back Button */}
      <div className="flex justify-center">
        <Link href="/mm/purchases" className="btn-fiori-outline">Voltar</Link>
      </div>

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
          <Link href="/mm/purchases" className="btn-fiori-outline">
            Cancelar
          </Link>
          <button
            type="submit"
            disabled={isLoading || !selectedVendor || getTotal() === 0}
            className="btn-fiori-primary"
          >
            {isLoading ? 'Criando...' : 'Criar Pedido'}
          </button>
        </div>
      </form>
    </div>
  )
}