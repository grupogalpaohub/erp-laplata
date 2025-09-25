'use client'

import { useState, useEffect } from 'react'
import { formatBRL } from '@/lib/money'
import Link from 'next/link'
import { Save, X, CheckCircle, AlertCircle } from 'lucide-react'
// Removido import hardcoded - usar dados do customizing

interface Material {
  mm_material: string
  mm_comercial: string | null
  mm_desc: string
  mm_mat_type: string | null
  mm_mat_class: string | null
  mm_price_cents: number | null
  mm_purchase_price_cents: number | null
  mm_pur_link: string | null
  commercial_name: string | null
  lead_time_days: number | null
  mm_vendor_id: string | null
  status: string | null
}

interface MaterialChange {
  mm_material: string
  changes: Record<string, { old: any, new: any }>
}

interface ConfirmationModalProps {
  isOpen: boolean
  changes: MaterialChange[]
  onConfirm: () => void
  onCancel: () => void
  isProcessing: boolean
}

function ConfirmationModal({ isOpen, changes, onConfirm, onCancel, isProcessing }: ConfirmationModalProps) {
  if (!isOpen) return null

  const totalChanges = changes.reduce((sum, change) => sum + Object.keys(change.changes).length, 0)

  return (
    <div className="modal-fiori">
      <div className="modal-fiori-content">
        <div className="modal-fiori-header">
          <h2 className="modal-fiori-title">Confirmar Alterações</h2>
          <button onClick={onCancel} className="modal-fiori-close">
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="alert-fiori-info mb-4">
          <p className="text-sm">
            <strong>{changes.length}</strong> materiais serão alterados com <strong>{totalChanges}</strong> mudanças no total.
          </p>
        </div>

        <div className="space-y-4 max-h-96 overflow-y-auto">
          {changes.map((change, index) => (
            <div key={index} className="card-fiori">
              <h3 className="font-semibold text-sm mb-2">Material: {change.mm_material}</h3>
              <div className="space-y-2">
                {Object.entries(change.changes).map(([field, values]) => (
                  <div key={field} className="text-sm">
                    <span className="font-medium">{field}:</span>
                    <span className="ml-2 text-gray-600">
                      <span className="line-through text-red-600">{values.old || 'vazio'}</span>
                      {' → '}
                      <span className="text-green-600">{values.new || 'vazio'}</span>
                    </span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="flex justify-end space-x-3 mt-6">
          <button
            onClick={onCancel}
            disabled={isProcessing}
            className="btn-fiori-outline disabled:opacity-50"
          >
            Cancelar
          </button>
          <button
            onClick={onConfirm}
            disabled={isProcessing}
            className="btn-fiori-primary disabled:opacity-50 flex items-center gap-2"
          >
            {isProcessing ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                Salvando...
              </>
            ) : (
              <>
                <Save className="w-4 h-4" />
                Confirmar Alterações
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  )
}

export default function BulkEditPage() {
  const [materials, setMaterials] = useState<Material[]>([])
  const [originalMaterials, setOriginalMaterials] = useState<Material[]>([])
  const [changes, setChanges] = useState<MaterialChange[]>([])
  const [showModal, setShowModal] = useState(false)
  const [isProcessing, setIsProcessing] = useState(false)
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null)
  const [customizingData, setCustomizingData] = useState<{
    types: string[]
    classifications: string[]
    vendors: { vendor_id: string; vendor_name: string }[]
  }>({
    types: ['Brinco', 'Cordão', 'Choker', 'Gargantilha', 'Anel', 'Pulseira'],
    classifications: ['Elementar', 'Amuleto', 'Protetor', 'Decoração'],
    vendors: []
  })

  useEffect(() => {
    fetchMaterials()
    fetchCustomizingData()
  }, [])

  const fetchMaterials = async () => {
    try {
      const response = await fetch('/api/mm/materials')
      const data = await response.json()
      setMaterials(data)
      setOriginalMaterials(JSON.parse(JSON.stringify(data))) // Deep clone
    } catch (error) {
      console.error('Erro ao carregar materiais:', error)
    }
  }

  const fetchCustomizingData = async () => {
    try {
      const response = await fetch('/api/mm/materials/customizing')
      const data = await response.json()
      if (data.success) {
        setCustomizingData(data.data)
      }
    } catch (error) {
      console.error('Erro ao carregar dados de customizing:', error)
    }
  }

  const handleFieldChange = (mm_material: string, field: string, value: any) => {
    setMaterials(prev => prev.map(material => 
      material.mm_material === mm_material 
        ? { ...material, [field]: value }
        : material
    ))
  }

  const calculateChanges = () => {
    const changes: MaterialChange[] = []
    
    materials.forEach(material => {
      const original = originalMaterials.find(m => m.mm_material === material.mm_material)
      if (!original) return

      const materialChanges: Record<string, { old: any, new: any }> = {}
      
      Object.keys(material).forEach(key => {
        if (key !== 'mm_material' && (original as any)[key] !== (material as any)[key]) {
          materialChanges[key] = {
            old: (original as any)[key],
            new: (material as any)[key]
          }
        }
      })

      if (Object.keys(materialChanges).length > 0) {
        changes.push({
          mm_material: material.mm_material,
          changes: materialChanges
        })
      }
    })

    return changes
  }

  const handleSave = () => {
    const calculatedChanges = calculateChanges()
    if (calculatedChanges.length === 0) {
      setMessage({ type: 'error', text: 'Nenhuma alteração encontrada' })
      return
    }
    setChanges(calculatedChanges)
    setShowModal(true)
  }

  const confirmChanges = async () => {
    setIsProcessing(true)
    setMessage(null)

    try {
      const response = await fetch('/api/mm/materials/bulk-update', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ changes })
      })

      const result = await response.json()

      if (result.success) {
        setMessage({ type: 'success', text: `${result.updated} materiais atualizados com sucesso` })
        setOriginalMaterials(JSON.parse(JSON.stringify(materials))) // Update original
        setChanges([])
        setShowModal(false)
      } else {
        setMessage({ type: 'error', text: `Erro: ${result.error || 'Falha na atualização'}` })
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Erro ao salvar alterações' })
    } finally {
      setIsProcessing(false)
    }
  }

  const hasChanges = calculateChanges().length > 0

  return (
    <main className="mx-auto max-w-7xl px-4 py-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Edição em Lote de Materiais</h1>
          <p className="text-gray-500 mt-1">Edite múltiplos materiais e salve todas as alterações de uma vez</p>
        </div>
        <div className="flex gap-3">
          <Link href="/mm/materials/edit" className="btn-fiori-outline">
            Edição Individual
          </Link>
          <button
            onClick={handleSave}
            disabled={!hasChanges}
            className="btn-fiori-primary disabled:opacity-50 flex items-center gap-2"
          >
            <Save className="w-4 h-4" />
            Salvar Alterações ({calculateChanges().length})
          </button>
        </div>
      </div>

      {message && (
        <div className={`alert-fiori ${
          message.type === 'success' 
            ? 'alert-fiori-success' 
            : 'alert-fiori-danger'
        }`}>
          {message.text}
        </div>
      )}

      <div className="card-fiori">
        <div className="overflow-x-auto">
          <table className="table-fiori">
            <thead>
              <tr>
                <th>ID</th>
                <th>Nome Comercial</th>
                <th>Descrição</th>
                <th>Tipo</th>
                <th>Classe</th>
                <th>Preço Venda (R$)</th>
                <th>Preço Compra (R$)</th>
                <th>Link Catálogo</th>
                <th>Fornecedor</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {materials.map((material) => (
                <tr key={material.mm_material} className="hover:bg-gray-50">
                  <td className="px-4 py-3 text-sm font-mono">{material.mm_material}</td>
                  <td className="px-4 py-3">
                    <input
                      type="text"
                      value={material.mm_comercial || ''}
                      onChange={(e) => handleFieldChange(material.mm_material, 'mm_comercial', e.target.value)}
                      className="input-fiori text-sm"
                    />
                  </td>
                  <td className="px-4 py-3">
                    <input
                      type="text"
                      value={material.mm_desc || ''}
                      onChange={(e) => handleFieldChange(material.mm_material, 'mm_desc', e.target.value)}
                      className="input-fiori text-sm"
                    />
                  </td>
                  <td className="px-4 py-3">
                    <select
                      value={material.mm_mat_type || ''}
                      onChange={(e) => handleFieldChange(material.mm_material, 'mm_mat_type', e.target.value)}
                      className="input-fiori text-sm"
                    >
                      <option value="">Selecione...</option>
                      {customizingData.types.map((type) => (
                        <option key={type} value={type}>{type}</option>
                      ))}
                    </select>
                  </td>
                  <td className="px-4 py-3">
                    <select
                      value={material.mm_mat_class || ''}
                      onChange={(e) => handleFieldChange(material.mm_material, 'mm_mat_class', e.target.value)}
                      className="input-fiori text-sm"
                    >
                      <option value="">Selecione...</option>
                      {customizingData.classifications.map((classification) => (
                        <option key={classification} value={classification}>{classification}</option>
                      ))}
                    </select>
                  </td>
                  <td className="px-4 py-3">
                    <input
                      type="number"
                      value={material.mm_price_cents ? formatBRL(material.mm_price_cents ) : ''}
                      onChange={(e) => handleFieldChange(material.mm_material, 'mm_price_cents', 
                        e.target.value ? Math.round(parseFloat(e.target.value) * 100) : null
                      )}
                      className="input-fiori text-sm"
                      step="0.01"
                    />
                  </td>
                  <td className="px-4 py-3">
                    <input
                      type="number"
                      value={material.purchase_price_cents ? formatBRL(material.purchase_price_cents ) : ''}
                      onChange={(e) => handleFieldChange(material.mm_material, 'purchase_price_cents', 
                        e.target.value ? Math.round(parseFloat(e.target.value) * 100) : null
                      )}
                      className="input-fiori text-sm"
                      step="0.01"
                    />
                  </td>
                  <td className="px-4 py-3">
                    <input
                      type="url"
                      value={material.catalog_url || ''}
                      onChange={(e) => handleFieldChange(material.mm_material, 'catalog_url', e.target.value)}
                      className="input-fiori text-sm"
                      placeholder="https://fornecedor.com/produto"
                    />
                  </td>
                  <td className="px-4 py-3">
                    <select
                      value={material.mm_vendor_id || ''}
                      onChange={(e) => handleFieldChange(material.mm_material, 'mm_vendor_id', e.target.value)}
                      className="input-fiori text-sm"
                    >
                      <option value="">Selecione...</option>
                      {customizingData.vendors.map((vendor) => (
                        <option key={vendor.vendor_id} value={vendor.vendor_id}>{vendor.vendor_name}</option>
                      ))}
                    </select>
                  </td>
                  <td className="px-4 py-3">
                    <select
                      value={material.status || 'active'}
                      onChange={(e) => handleFieldChange(material.mm_material, 'status', e.target.value)}
                      className="input-fiori text-sm"
                    >
                      <option value="active">Ativo</option>
                      <option value="inactive">Inativo</option>
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <ConfirmationModal
        isOpen={showModal}
        changes={changes}
        onConfirm={confirmChanges}
        onCancel={() => setShowModal(false)}
        isProcessing={isProcessing}
      />
    </main>
  )
}

