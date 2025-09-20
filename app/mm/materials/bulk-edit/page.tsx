'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Save, X, CheckCircle, AlertCircle } from 'lucide-react'

interface Material {
  mm_material: string
  mm_comercial: string | null
  mm_desc: string
  mm_mat_type: string | null
  mm_mat_class: string | null
  mm_price_cents: number | null
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
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-4xl max-h-[80vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold">Confirmar Alterações</h2>
          <button onClick={onCancel} className="text-gray-500 hover:text-gray-700">
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="mb-4 p-4 bg-blue-50 rounded">
          <p className="text-sm text-blue-800">
            <strong>{changes.length}</strong> materiais serão alterados com <strong>{totalChanges}</strong> mudanças no total.
          </p>
        </div>

        <div className="space-y-4 max-h-96 overflow-y-auto">
          {changes.map((change, index) => (
            <div key={index} className="border rounded p-4">
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
            className="px-4 py-2 border rounded hover:bg-gray-50 disabled:opacity-50"
          >
            Cancelar
          </button>
          <button
            onClick={onConfirm}
            disabled={isProcessing}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50 flex items-center gap-2"
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

  useEffect(() => {
    fetchMaterials()
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
          <p className="text-fiori-muted mt-1">Edite múltiplos materiais e salve todas as alterações de uma vez</p>
        </div>
        <div className="flex gap-3">
          <Link href="/mm/materials/edit" className="px-3 py-2 rounded border">
            Edição Individual
          </Link>
          <button
            onClick={handleSave}
            disabled={!hasChanges}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50 flex items-center gap-2"
          >
            <Save className="w-4 h-4" />
            Salvar Alterações ({calculateChanges().length})
          </button>
        </div>
      </div>

      {message && (
        <div className={`px-4 py-3 rounded ${
          message.type === 'success' 
            ? 'bg-green-100 border border-green-400 text-green-700' 
            : 'bg-red-100 border border-red-400 text-red-700'
        }`}>
          {message.text}
        </div>
      )}

      <div className="bg-white rounded-lg border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">ID</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Nome Comercial</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Descrição</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Tipo</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Classe</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Preço (R$)</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Status</th>
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
                      className="w-full px-2 py-1 border rounded text-sm"
                    />
                  </td>
                  <td className="px-4 py-3">
                    <input
                      type="text"
                      value={material.mm_desc || ''}
                      onChange={(e) => handleFieldChange(material.mm_material, 'mm_desc', e.target.value)}
                      className="w-full px-2 py-1 border rounded text-sm"
                    />
                  </td>
                  <td className="px-4 py-3">
                    <input
                      type="text"
                      value={material.mm_mat_type || ''}
                      onChange={(e) => handleFieldChange(material.mm_material, 'mm_mat_type', e.target.value)}
                      className="w-full px-2 py-1 border rounded text-sm"
                    />
                  </td>
                  <td className="px-4 py-3">
                    <input
                      type="text"
                      value={material.mm_mat_class || ''}
                      onChange={(e) => handleFieldChange(material.mm_material, 'mm_mat_class', e.target.value)}
                      className="w-full px-2 py-1 border rounded text-sm"
                    />
                  </td>
                  <td className="px-4 py-3">
                    <input
                      type="number"
                      value={material.mm_price_cents ? (material.mm_price_cents / 100).toFixed(2) : ''}
                      onChange={(e) => handleFieldChange(material.mm_material, 'mm_price_cents', 
                        e.target.value ? Math.round(parseFloat(e.target.value) * 100) : null
                      )}
                      className="w-full px-2 py-1 border rounded text-sm"
                      step="0.01"
                    />
                  </td>
                  <td className="px-4 py-3">
                    <select
                      value={material.status || 'active'}
                      onChange={(e) => handleFieldChange(material.mm_material, 'status', e.target.value)}
                      className="w-full px-2 py-1 border rounded text-sm"
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
