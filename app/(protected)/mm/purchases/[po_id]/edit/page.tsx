'use client'

import { useState, useEffect } from 'react'
import { formatBRL } from '@/lib/money'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Plus, Trash2, Save, X } from 'lucide-react'
import { getVendors, getMaterials } from '@/app/(protected)/mm/_actions'

interface Material {
  mm_material: string
  mm_comercial: string | null
  mm_desc: string | null
  mm_price_cents: number
  mm_purchase_price_cents: number
}

interface PurchaseOrderItem {
  po_item_id?: number
  mm_material: string
  mm_qtt: number
  unit_cost_cents: number
  line_total_cents: number
  notes?: string
}

interface PurchaseOrder {
  mm_order: string
  vendor_id: string
  po_date: string
  status: string
  total_cents: number
  expected_delivery?: string
  notes?: string
}

export default function EditPurchaseOrderPage({ params }: { params: { po_id: string } }) {
  const router = useRouter()
  const [purchaseOrder, setPurchaseOrder] = useState<PurchaseOrder | null>(null)
  const [items, setItems] = useState<PurchaseOrderItem[]>([])
  const [materials, setMaterials] = useState<Material[]>([])
  const [vendors, setVendors] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    try {
      // Carregar pedido
      const poResponse = await fetch(`/api/mm/purchases/${params.po_id}`)
      if (!poResponse.ok) throw new Error('Erro ao carregar pedido')
      const poData = await poResponse.json()
      if (!poData.ok) throw new Error(poData.error || 'Erro ao carregar pedido')
      setPurchaseOrder(poData.po)

      // Carregar itens
      const itemsResponse = await fetch(`/api/mm/purchases/${params.po_id}/items`)
      if (itemsResponse.ok) {
        const itemsData = await itemsResponse.json()
        if (itemsData.ok) {
          setItems(itemsData.items)
        }
      }

      // Carregar materiais e fornecedores via Server Actions
      const [materialsData, vendorsData] = await Promise.all([
        getMaterials(),
        getVendors()
      ])
      setMaterials(materialsData)
      setVendors(vendorsData)

    } catch (error) {
      console.error('Erro ao carregar dados:', error)
      setError('Erro ao carregar dados do pedido')
    } finally {
      setLoading(false)
    }
  }

  const addItem = () => {
    setItems([...items, {
      mm_material: '',
      mm_qtt: 1,
      unit_cost_cents: 0,
      line_total_cents: 0,
      notes: ''
    }])
  }

  const removeItem = (index: number) => {
    setItems(items.filter((_, i) => i !== index))
  }

  const updateItem = (index: number, field: keyof PurchaseOrderItem, value: any) => {
    const newItems = [...items]
    newItems[index] = { ...newItems[index], [field]: value }
    
    // Recalcular total se quantidade ou preço mudou
    if (field === 'mm_qtt' || field === 'unit_cost_cents') {
      const item = newItems[index]
      newItems[index].line_total_cents = item.mm_qtt * item.unit_cost_cents
    }
    
    setItems(newItems)
  }

  const getMaterialPrice = (materialId: string) => {
    const material = materials.find(m => m.mm_material === materialId)
    return material ? material.mm_purchase_price_cents : 0
  }

  const handleMaterialChange = (index: number, materialId: string) => {
    const price = getMaterialPrice(materialId)
    updateItem(index, 'mm_material', materialId)
    updateItem(index, 'unit_cost_cents', price)
  }

  const calculateTotal = () => {
    return items.reduce((sum, item) => sum + item.line_total_cents, 0)
  }

  const handleSave = async () => {
    if (!purchaseOrder) return

    setSaving(true)
    setError(null)

    try {
      // Atualizar header do pedido
      const headerResponse = await fetch(`/api/mm/purchases/${params.po_id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          vendor_id: purchaseOrder.vendor_id,
          po_date: purchaseOrder.po_date,
          expected_delivery: purchaseOrder.expected_delivery,
          notes: purchaseOrder.notes,
          total_cents: calculateTotal()
        })
      })

      if (!headerResponse.ok) {
        throw new Error('Erro ao atualizar pedido')
      }

      // Atualizar itens (implementar lógica de upsert se necessário)
      // Por enquanto, vamos apenas logar que os itens foram "atualizados"
      console.log('Items to update:', items)

      router.push(`/mm/purchases/${params.po_id}`)
    } catch (error) {
      console.error('Erro ao salvar:', error)
      setError('Erro ao salvar alterações')
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <main className="mx-auto max-w-7xl px-4 py-6">
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-fiori-primary mx-auto mb-4"></div>
          <p>Carregando...</p>
        </div>
      </main>
    )
  }

  if (!purchaseOrder) {
    return (
      <main className="mx-auto max-w-7xl px-4 py-6">
        <div className="text-center py-12">
          <h1 className="text-2xl font-semibold text-gray-900 mb-4">Pedido não encontrado</h1>
          <Link href="/mm/purchases" className="btn-fiori-primary">
            Voltar para Pedidos
          </Link>
        </div>
      </main>
    )
  }

  return (
    <main className="mx-auto max-w-7xl px-4 py-6 space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Link href={`/mm/purchases/${params.po_id}`} className="btn-fiori-outline flex items-center gap-2">
            <ArrowLeft className="w-4 h-4" />
            Voltar
          </Link>
          <div>
            <h1 className="text-2xl font-semibold">Editar Pedido {purchaseOrder.mm_order}</h1>
            <p className="text-gray-500 mt-1">Modifique os dados do pedido de compras</p>
          </div>
        </div>
        <div className="flex gap-3">
          <button
            onClick={handleSave}
            disabled={saving || purchaseOrder.status !== 'draft'}
            className="btn-fiori-primary flex items-center gap-2"
          >
            <Save className="w-4 h-4" />
            {saving ? 'Salvando...' : 'Salvar'}
          </button>
        </div>
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      )}

      {purchaseOrder.status !== 'draft' && (
        <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded">
          <strong>Atenção:</strong> Este pedido não pode ser editado pois não está mais em status "draft".
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          {/* Informações do Pedido */}
          <div className="card-fiori">
            <h2 className="text-lg font-semibold mb-4">Informações do Pedido</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-gray-500">Fornecedor</label>
                <select
                  value={purchaseOrder.vendor_id}
                  onChange={(e) => setPurchaseOrder({...purchaseOrder, vendor_id: e.target.value})}
                  disabled={purchaseOrder.status !== 'draft'}
                  className="input-fiori w-full"
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
                <label className="text-sm font-medium text-gray-500">Data do Pedido</label>
                <input
                  type="date"
                  value={purchaseOrder.po_date}
                  onChange={(e) => setPurchaseOrder({...purchaseOrder, po_date: e.target.value})}
                  disabled={purchaseOrder.status !== 'draft'}
                  className="input-fiori w-full"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">Entrega Esperada</label>
                <input
                  type="date"
                  value={purchaseOrder.expected_delivery || ''}
                  onChange={(e) => setPurchaseOrder({...purchaseOrder, expected_delivery: e.target.value})}
                  disabled={purchaseOrder.status !== 'draft'}
                  className="input-fiori w-full"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">Observações</label>
                <textarea
                  value={purchaseOrder.notes || ''}
                  onChange={(e) => setPurchaseOrder({...purchaseOrder, notes: e.target.value})}
                  className="input-fiori w-full"
                  rows={3}
                />
              </div>
            </div>
          </div>

          {/* Itens do Pedido */}
          <div className="card-fiori">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold">Itens do Pedido</h2>
              {purchaseOrder.status === 'draft' && (
                <button
                  onClick={addItem}
                  className="btn-fiori-secondary flex items-center gap-2"
                >
                  <Plus className="w-4 h-4" />
                  Adicionar Item
                </button>
              )}
            </div>

            {items.length === 0 ? (
              <p className="text-gray-500 text-center py-8">Nenhum item adicionado</p>
            ) : (
              <div className="space-y-4">
                {items.map((item, index) => (
                  <div key={index} className="border border-gray-200 rounded-lg p-4">
                    <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
                      <div className="md:col-span-2">
                        <label className="text-sm font-medium text-gray-500">Material</label>
                        <select
                          value={item.mm_material}
                          onChange={(e) => handleMaterialChange(index, e.target.value)}
                          disabled={purchaseOrder.status !== 'draft'}
                          className="input-fiori w-full"
                        >
                          <option value="">Selecione o material...</option>
                          {materials.map((material) => (
                            <option key={material.mm_material} value={material.mm_material}>
                              {material.mm_material} - {material.mm_comercial || material.mm_desc}
                            </option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-500">Quantidade</label>
                        <input
                          type="number"
                          min="1"
                          value={item.mm_qtt}
                          onChange={(e) => updateItem(index, 'mm_qtt', parseInt(e.target.value) || 1)}
                          disabled={purchaseOrder.status !== 'draft'}
                          className="input-fiori w-full"
                        />
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-500">Preço Unitário (R$)</label>
                        <input
                          type="number"
                          step="0.01"
                          min="0"
                          value={(item.unit_cost_cents / 100).toFixed(2)}
                          onChange={(e) => updateItem(index, 'unit_cost_cents', Math.round(parseFloat(e.target.value) * 100))}
                          disabled={purchaseOrder.status !== 'draft'}
                          className="input-fiori w-full"
                        />
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-500">Total (R$)</label>
                        <input
                          type="text"
                          value={formatBRL(item.line_total_cents)}
                          disabled
                          className="input-fiori w-full bg-gray-50"
                        />
                      </div>
                      <div className="flex items-end">
                        {purchaseOrder.status === 'draft' && (
                          <button
                            onClick={() => removeItem(index)}
                            className="btn-fiori-danger flex items-center gap-2"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Resumo */}
        <div className="space-y-6">
          <div className="card-fiori">
            <h3 className="text-lg font-semibold mb-4">Resumo</h3>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600">Total de Itens:</span>
                <span className="font-semibold">{items.length}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Quantidade Total:</span>
                <span className="font-semibold">{items.reduce((sum, item) => sum + item.mm_qtt, 0)}</span>
              </div>
              <div className="border-t pt-3">
                <div className="flex justify-between text-lg font-semibold">
                  <span>Valor Total:</span>
                  <span className="text-green-600">{formatBRL(calculateTotal())}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}
