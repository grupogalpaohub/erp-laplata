'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Upload, Download, CheckCircle, XCircle, AlertCircle } from 'lucide-react'
import { formatBRL } from '@/lib/money'

interface Material {
  mm_material?: string // ID do material (opcional para criação)
  mm_comercial: string
  mm_desc: string
  mm_mat_type: string
  mm_mat_class: string
  mm_vendor_id: string
  mm_price_cents: number
  mm_purchase_price_cents: number
  mm_pur_link?: string
  lead_time_days: number
  status: string
}

interface ValidationResult {
  row_index: number
  is_valid: boolean
  error_message: string | null
  generated_id: string | null
}

interface BulkImportState {
  step: 'upload' | 'validation' | 'import' | 'success'
  file: File | null
  materials: Material[]
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
      const csv = e.target?.result as string
      const lines = csv.split('\n').filter(line => line.trim())
      
      if (lines.length < 2) {
        setState(prev => ({ ...prev, error: 'Arquivo CSV deve ter pelo menos um cabeçalho e uma linha de dados' }))
        return
      }

      const headers = lines[0].split(',').map(h => h.trim().toLowerCase())
      const requiredHeaders = [
        'mm_comercial', 'mm_desc', 'mm_mat_type', 'mm_mat_class', 
        'mm_vendor_id', 'mm_price_cents', 'mm_purchase_price_cents', 
        'lead_time_days', 'status'
      ]
      
      const missingHeaders = requiredHeaders.filter(h => !headers.includes(h))
      if (missingHeaders.length > 0) {
        setState(prev => ({ 
          ...prev, 
          error: `Cabeçalhos obrigatórios ausentes: ${missingHeaders.join(', ')}` 
        }))
        return
      }

      const materials: Material[] = []
      for (let i = 1; i < lines.length; i++) {
        const values = lines[i].split(',').map(v => v.trim())
        if (values.length !== headers.length) continue

        const material: Material = {
          mm_material: values[headers.indexOf('mm_material')] || undefined,
          mm_comercial: values[headers.indexOf('mm_comercial')] || '',
          mm_desc: values[headers.indexOf('mm_desc')] || '',
          mm_mat_type: values[headers.indexOf('mm_mat_type')] || '',
          mm_mat_class: values[headers.indexOf('mm_mat_class')] || '',
          mm_vendor_id: values[headers.indexOf('mm_vendor_id')] || '',
          mm_price_cents: parseInt(values[headers.indexOf('mm_price_cents')] || '0'),
          mm_purchase_price_cents: parseInt(values[headers.indexOf('mm_purchase_price_cents')] || '0'),
          mm_pur_link: values[headers.indexOf('mm_pur_link')] || undefined,
          lead_time_days: parseInt(values[headers.indexOf('lead_time_days')] || '0'),
          status: values[headers.indexOf('status')] || 'active'
        }
        materials.push(material)
      }

      setState(prev => ({ 
        ...prev, 
        materials, 
        step: 'validation' 
      }))
      validateMaterials(materials)
    }
    reader.readAsText(file)
  }

  const validateMaterials = async (materials: Material[]) => {
    setState(prev => ({ ...prev, isValidating: true }))
    
    try {
      const response = await fetch('/api/mm/materials/bulk-validate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ materials })
      })
      
      const result = await response.json()
      
      if (!response.ok) {
        throw new Error(result.error || 'Erro na validação')
      }

      setState(prev => ({ 
        ...prev, 
        validationResults: result.results,
        isValidating: false 
      }))
    } catch (error) {
      console.error('Erro na validação:', error)
      setState(prev => ({ 
        ...prev, 
        error: error instanceof Error ? error.message : 'Erro na validação',
        isValidating: false 
      }))
    }
  }

  const importMaterials = async () => {
    setState(prev => ({ ...prev, isImporting: true }))
    
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
        step: 'success',
        isImporting: false 
      }))
    } catch (error) {
      console.error('Erro na importação:', error)
      setState(prev => ({ 
        ...prev, 
        error: error instanceof Error ? error.message : 'Erro na importação',
        isImporting: false 
      }))
    }
  }

  const downloadTemplate = () => {
    const headers = [
      'mm_material', // ID do material (opcional para criação)
      'mm_comercial',
      'mm_desc', 
      'mm_mat_type',
      'mm_mat_class',
      'mm_vendor_id',
      'mm_price_cents',
      'mm_purchase_price_cents',
      'mm_pur_link',
      'lead_time_days',
      'status'
    ]
    
    const sampleData = [
      [
        '', // Deixe vazio para criação automática
        'Brinco de Prata',
        'Brinco de prata 925 com detalhes em ouro',
        'Brinco',
        'Elementar',
        'SUP_00001',
        '150.00',
        '120.00',
        'https://exemplo.com/produto',
        '7',
        'active'
      ]
    ]
    
    const csvContent = [headers, ...sampleData]
      .map(row => row.map(field => `"${field}"`).join(','))
      .join('\n')
    
    const blob = new Blob([csvContent], { type: 'text/csv' })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'template_materiais.csv'
    a.click()
    window.URL.revokeObjectURL(url)
  }

  const validCount = state.validationResults.filter(r => r.is_valid).length
  const invalidCount = state.validationResults.filter(r => !r.is_valid).length

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-fiori-primary mb-4">Importação em Massa de Materiais</h1>
        <p className="text-xl text-fiori-secondary mb-2">Importar ou atualizar materiais via CSV</p>
        <p className="text-lg text-fiori-muted">
          Para criar novos materiais, deixe o campo mm_material vazio. 
          Para atualizar, inclua o ID do material (B_001, G_001, etc.)
        </p>
      </div>

      {/* Back Button */}
      <div className="flex justify-center">
        <Link href="/mm/catalog" className="btn-fiori-outline">Voltar para Catálogo</Link>
      </div>

      {state.error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          {state.error}
        </div>
      )}

      {/* Step 1: Upload */}
      {state.step === 'upload' && (
        <div className="card-fiori">
          <h2 className="text-xl font-semibold mb-4">1. Upload do Arquivo CSV</h2>
          
          <div className="mb-6">
            <button
              onClick={downloadTemplate}
              className="btn-fiori-secondary flex items-center gap-2 mb-4"
            >
              <Download className="w-4 h-4" />
              Baixar Template CSV
            </button>
            <p className="text-sm text-fiori-muted">
              Use o template para garantir o formato correto. 
              Deixe mm_material vazio para criar novos materiais.
            </p>
          </div>

          <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
            <Upload className="w-12 h-12 mx-auto text-gray-400 mb-4" />
            <input
              type="file"
              accept=".csv"
              onChange={handleFileUpload}
              className="hidden"
              id="file-upload"
            />
            <label
              htmlFor="file-upload"
              className="btn-fiori-primary cursor-pointer"
            >
              Selecionar Arquivo CSV
            </label>
            <p className="text-sm text-fiori-muted mt-2">
              Apenas arquivos CSV são aceitos
            </p>
          </div>
        </div>
      )}

      {/* Step 2: Validation */}
      {state.step === 'validation' && (
        <div className="card-fiori">
          <h2 className="text-xl font-semibold mb-4">2. Validação dos Dados</h2>
          
          {state.isValidating ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-fiori-primary mx-auto mb-4"></div>
              <p>Validando dados...</p>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div className="bg-green-100 p-4 rounded-lg text-center">
                  <CheckCircle className="w-8 h-8 text-green-600 mx-auto mb-2" />
                  <p className="text-2xl font-bold text-green-600">{validCount}</p>
                  <p className="text-sm text-green-700">Válidos</p>
                </div>
                <div className="bg-red-100 p-4 rounded-lg text-center">
                  <XCircle className="w-8 h-8 text-red-600 mx-auto mb-2" />
                  <p className="text-2xl font-bold text-red-600">{invalidCount}</p>
                  <p className="text-sm text-red-700">Inválidos</p>
                </div>
                <div className="bg-blue-100 p-4 rounded-lg text-center">
                  <AlertCircle className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                  <p className="text-2xl font-bold text-blue-600">{state.materials.length}</p>
                  <p className="text-sm text-blue-700">Total</p>
                </div>
              </div>

              {invalidCount > 0 && (
                <div className="mb-6">
                  <h3 className="text-lg font-semibold mb-2">Erros Encontrados:</h3>
                  <div className="bg-red-50 border border-red-200 rounded-lg p-4 max-h-60 overflow-y-auto">
                    {state.validationResults
                      .filter(r => !r.is_valid)
                      .map((result, index) => (
                        <div key={index} className="text-sm text-red-700 mb-1">
                          Linha {result.row_index + 1}: {result.error_message}
                        </div>
                      ))}
                  </div>
                </div>
              )}

              <div className="flex justify-between">
                <button
                  onClick={() => setState(prev => ({ ...prev, step: 'upload' }))}
                  className="btn-fiori-outline"
                >
                  Voltar
                </button>
                <button
                  onClick={importMaterials}
                  disabled={validCount === 0 || state.isImporting}
                  className="btn-fiori-primary"
                >
                  {state.isImporting ? 'Importando...' : `Importar ${validCount} Materiais`}
                </button>
              </div>
            </>
          )}
        </div>
      )}

      {/* Step 3: Success */}
      {state.step === 'success' && (
        <div className="card-fiori text-center">
          <CheckCircle className="w-16 h-16 text-green-600 mx-auto mb-4" />
          <h2 className="text-2xl font-semibold text-green-600 mb-2">Importação Concluída!</h2>
          <p className="text-fiori-muted mb-6">
            {validCount} materiais foram importados com sucesso.
          </p>
          <div className="flex justify-center gap-4">
            <Link href="/mm/catalog" className="btn-fiori-primary">
              Ver Catálogo
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
      )}
    </div>
  )
}


