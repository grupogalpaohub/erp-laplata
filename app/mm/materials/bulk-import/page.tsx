'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Upload, Download, CheckCircle, XCircle, AlertCircle } from 'lucide-react'
import { MATERIAL_TYPES, MATERIAL_CLASSIFICATIONS, UNITS_OF_MEASURE } from '@/src/lib/material-config'

interface ValidationResult {
  row_index: number
  is_valid: boolean
  error_message: string | null
  generated_id: string | null
}

interface BulkImportState {
  step: 'upload' | 'validation' | 'import' | 'success'
  file: File | null
  materials: any[]
  validationResults: ValidationResult[]
  isValidating: boolean
  isImporting: boolean
  error: string | null
}

export default function BulkImportPage() {
  const [state, setState] = useState<BulkImportState>({
    step: 'upload',
    file: null,
    materials: [],
    validationResults: [],
    isValidating: false,
    isImporting: false,
    error: null
  })

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    if (!file.name.endsWith('.csv')) {
      setState(prev => ({ ...prev, error: 'Apenas arquivos CSV são aceitos' }))
      return
    }

    setState(prev => ({ ...prev, file, error: null }))
    parseCSV(file)
  }

  const parseCSV = (file: File) => {
    const reader = new FileReader()
    reader.onload = (e) => {
      const text = e.target?.result as string
      const lines = text.split('\n').filter(line => line.trim())
      
      if (lines.length < 2) {
        setState(prev => ({ ...prev, error: 'Arquivo deve ter pelo menos um cabeçalho e uma linha de dados' }))
        return
      }

      const headers = lines[0].split(',').map(h => h.trim())
      const materials = lines.slice(1).map((line, index) => {
        const values = line.split(',').map(v => v.trim())
        const material: any = {}
        headers.forEach((header, i) => {
          material[header] = values[i] || ''
        })
        return material
      })

      setState(prev => ({ 
        ...prev, 
        materials, 
        step: 'validation',
        error: null 
      }))
    }
    reader.readAsText(file)
  }

  const validateMaterials = async () => {
    setState(prev => ({ ...prev, isValidating: true, error: null }))

    try {
      const response = await fetch('/api/mm/materials/bulk-validate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ materials: state.materials })
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.error || 'Erro na validação')
      }

      setState(prev => ({ 
        ...prev, 
        validationResults: result.validationResults,
        isValidating: false,
        step: result.summary.canProceed ? 'import' : 'validation'
      }))
    } catch (error) {
      setState(prev => ({ 
        ...prev, 
        error: error instanceof Error ? error.message : 'Erro na validação',
        isValidating: false 
      }))
    }
  }

  const importMaterials = async () => {
    setState(prev => ({ ...prev, isImporting: true, error: null }))

    try {
      const response = await fetch('/api/mm/materials/bulk-import', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ materials: state.materials })
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.error || 'Erro na importação')
      }

      setState(prev => ({ 
        ...prev, 
        isImporting: false,
        step: 'success'
      }))
    } catch (error) {
      setState(prev => ({ 
        ...prev, 
        error: error instanceof Error ? error.message : 'Erro na importação',
        isImporting: false 
      }))
    }
  }

  const downloadTemplate = () => {
    const headers = [
      'mm_comercial', 
      'mm_desc', 
      'mm_mat_type', 
      'mm_mat_class', 
      'mm_vendor_id', 
      'purchase_price_cents', 
      'sale_price_cents', 
      'barcode', 
      'lead_time_days'
    ]
    const csvContent = [
      headers.join(','),
      'Exemplo Brinco,Descrição do brinco,Brinco,Amuletos,VENDOR001,2500,3500,123456789,7',
      '',
      '# Instruções:',
      '# - Campos obrigatórios: mm_desc, mm_mat_type, mm_mat_class, mm_vendor_id, purchase_price_cents, sale_price_cents, lead_time_days',
      `# - mm_mat_type: ${MATERIAL_TYPES.map(t => t.type).join(', ')}`,
      `# - mm_mat_class: ${MATERIAL_CLASSIFICATIONS.map(c => c.classification).join(', ')}`,
      '# - Preços em centavos (ex: 2500 = R$ 25,00)',
      '# - lead_time_days: número de dias para entrega'
    ].join('\n')
    
    const blob = new Blob([csvContent], { type: 'text/csv' })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'template_materiais.csv'
    a.click()
    window.URL.revokeObjectURL(url)
  }

  const validMaterials = state.validationResults.filter(r => r.is_valid)
  const invalidMaterials = state.validationResults.filter(r => !r.is_valid)

  return (
    <main className="mx-auto max-w-4xl px-4 py-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Importação em Massa de Materiais</h1>
          <p className="text-gray-500 mt-1">Importe múltiplos materiais via arquivo CSV</p>
        </div>
        <Link href="/mm/materials/edit" className="btn-fiori-outline">
          Voltar para Edição
        </Link>
      </div>

      {state.error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          {state.error}
        </div>
      )}

      {/* Step 1: Upload */}
      {state.step === 'upload' && (
        <div className="card-fiori">
          <h2 className="card-fiori-title mb-4">1. Preparar Arquivo</h2>
          
          <div className="space-y-4">
            <div>
              <button
                onClick={downloadTemplate}
                className="btn-fiori-primary flex items-center gap-2"
              >
                <Download className="w-4 h-4" />
                Baixar Template CSV
              </button>
              <p className="text-sm text-gray-300 mt-1">
                Use o template para garantir o formato correto
              </p>
            </div>

            <div>
              <label className="label-fiori">
                Upload do Arquivo CSV
              </label>
              <input
                type="file"
                accept=".csv"
                onChange={handleFileUpload}
                className="block w-full text-sm text-white file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-gray-800 file:text-white hover:file:bg-gray-700 file:border file:border-gray-600"
              />
            </div>
          </div>
        </div>
      )}

      {/* Step 2: Validation */}
      {state.step === 'validation' && (
        <div className="card-fiori">
          <h2 className="card-fiori-title mb-4">2. Validação dos Dados</h2>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <p className="text-sm text-gray-300">
                {state.materials.length} materiais encontrados no arquivo
              </p>
              <button
                onClick={validateMaterials}
                disabled={state.isValidating}
                className="btn-fiori-primary disabled:opacity-50"
              >
                {state.isValidating ? 'Validando...' : 'Validar Materiais'}
              </button>
            </div>

            {state.validationResults.length > 0 && (
              <div className="space-y-4">
                <div className="grid grid-cols-3 gap-4">
                  <div className="bg-gray-800 border border-gray-600 p-4 rounded">
                    <div className="text-2xl font-bold text-blue-400">{state.materials.length}</div>
                    <div className="text-sm text-gray-300">Total</div>
                  </div>
                  <div className="bg-gray-800 border border-gray-600 p-4 rounded">
                    <div className="text-2xl font-bold text-green-400">{validMaterials.length}</div>
                    <div className="text-sm text-gray-300">Válidos</div>
                  </div>
                  <div className="bg-gray-800 border border-gray-600 p-4 rounded">
                    <div className="text-2xl font-bold text-red-400">{invalidMaterials.length}</div>
                    <div className="text-sm text-gray-300">Inválidos</div>
                  </div>
                </div>

                {invalidMaterials.length > 0 && (
                  <div className="alert-fiori-danger">
                    <h3 className="font-semibold mb-3">❌ Erros Encontrados:</h3>
                    <div className="space-y-3 max-h-60 overflow-y-auto">
                      {invalidMaterials.map((result, index) => (
                        <div key={index} className="bg-gray-800 border border-red-700 rounded p-3">
                          <div className="font-medium text-red-300 mb-1">
                            Linha {result.row_index + 1}: {(result as any).material?.mm_comercial || (result as any).material?.mm_desc || 'Material sem nome'}
                          </div>
                          <div className="text-sm text-red-400">
                            {result.error_message}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {validMaterials.length > 0 && (
                  <div className="flex justify-end">
                    <button
                      onClick={importMaterials}
                      disabled={state.isImporting}
                      className="btn-fiori-success disabled:opacity-50"
                    >
                      {state.isImporting ? 'Importando...' : `Importar ${validMaterials.length} Materiais`}
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Step 3: Success */}
      {state.step === 'success' && (
        <div className="card-fiori">
          <div className="text-center">
            <CheckCircle className="w-16 h-16 text-green-400 mx-auto mb-4" />
            <h2 className="text-2xl font-semibold text-green-300 mb-2">Importação Concluída!</h2>
            <p className="text-gray-300 mb-6">
              {validMaterials.length} materiais foram importados com sucesso
            </p>
            <div className="space-x-4">
              <Link
                href="/mm/materials/bulk-edit"
                className="btn-fiori-primary"
              >
                Ver Materiais
              </Link>
              <button
                onClick={() => setState({
                  step: 'upload',
                  file: null,
                  materials: [],
                  validationResults: [],
                  isValidating: false,
                  isImporting: false,
                  error: null
                })}
                className="btn-fiori-outline"
              >
                Nova Importação
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  )
}
