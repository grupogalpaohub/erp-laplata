'use client'

import { useState } from 'react'
import Link from 'next/link'
import { ArrowRightLeft, Package, AlertCircle } from 'lucide-react'
import { createTransfer } from '@/app/wh/_actions'

export default function TransfersPage() {
  const [formData, setFormData] = useState({
    material_id: '',
    quantity: '',
    from_plant: 'PLANT_001',
    to_plant: 'PLANT_002',
    reference_type: 'MANUAL',
    reference_id: '',
    reason: 'TRANSFER'
  })
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setMessage(null)

    try {
      const formDataObj = new FormData()
      formDataObj.append('material_id', formData.material_id)
      formDataObj.append('quantity', formData.quantity)
      formDataObj.append('from_plant', formData.from_plant)
      formDataObj.append('to_plant', formData.to_plant)
      formDataObj.append('reference_type', formData.reference_type)
      formDataObj.append('reference_id', formData.reference_id)
      formDataObj.append('reason', formData.reason)

      const result = await createTransfer(formDataObj)

      if (result.success) {
        setMessage({ type: 'success', text: result.message || 'Transferência criada com sucesso' })
        setFormData({
          material_id: '',
          quantity: '',
          from_plant: 'PLANT_001',
          to_plant: 'PLANT_002',
          reference_type: 'MANUAL',
          reference_id: '',
          reason: 'TRANSFER'
        })
      } else {
        setMessage({ type: 'error', text: result.error })
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Erro ao processar transferência' })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="container-fiori">
      <div className="section-fiori">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-fiori-primary">Transferências de Estoque</h1>
            <p className="text-fiori-secondary mt-2">Transferir materiais entre plantas</p>
          </div>
          <div className="flex gap-4">
            <Link href="/wh" className="btn-fiori-secondary">
              ← Voltar
            </Link>
            <Link href="/wh/movements" className="btn-fiori-outline">
              Ver Movimentações
            </Link>
          </div>
        </div>

        <div className="grid-fiori-2">
          {/* Formulário de Transferência */}
          <div className="card-fiori">
            <div className="card-fiori-header">
              <h2 className="card-fiori-title">Nova Transferência</h2>
            </div>
            <div className="card-fiori-body">
              <form onSubmit={handleSubmit} className="space-y-6">
                {message && (
                  <div className={`p-4 rounded ${
                    message.type === 'success' 
                      ? 'bg-green-50 border border-green-200 text-green-700'
                      : 'bg-red-50 border border-red-200 text-red-700'
                  }`}>
                    <div className="flex items-center gap-2">
                      <AlertCircle className="w-4 h-4" />
                      {message.text}
                    </div>
                  </div>
                )}

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="material_id" className="label-fiori">
                      Material *
                    </label>
                    <input
                      type="text"
                      id="material_id"
                      value={formData.material_id}
                      onChange={(e) => setFormData({ ...formData, material_id: e.target.value })}
                      className="input-fiori"
                      placeholder="Ex: G_193"
                      required
                    />
                  </div>

                  <div>
                    <label htmlFor="quantity" className="label-fiori">
                      Quantidade *
                    </label>
                    <input
                      type="number"
                      id="quantity"
                      value={formData.quantity}
                      onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
                      className="input-fiori"
                      placeholder="Ex: 10"
                      min="1"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="from_plant" className="label-fiori">
                      Planta de Origem *
                    </label>
                    <select
                      id="from_plant"
                      value={formData.from_plant}
                      onChange={(e) => setFormData({ ...formData, from_plant: e.target.value })}
                      className="select-fiori"
                      required
                    >
                      <option value="PLANT_001">Planta Principal</option>
                      <option value="PLANT_002">Planta Secundária</option>
                    </select>
                  </div>

                  <div>
                    <label htmlFor="to_plant" className="label-fiori">
                      Planta de Destino *
                    </label>
                    <select
                      id="to_plant"
                      value={formData.to_plant}
                      onChange={(e) => setFormData({ ...formData, to_plant: e.target.value })}
                      className="select-fiori"
                      required
                    >
                      <option value="PLANT_001">Planta Principal</option>
                      <option value="PLANT_002">Planta Secundária</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="reference_type" className="label-fiori">
                      Tipo de Referência
                    </label>
                    <select
                      id="reference_type"
                      value={formData.reference_type}
                      onChange={(e) => setFormData({ ...formData, reference_type: e.target.value })}
                      className="select-fiori"
                    >
                      <option value="MANUAL">Manual</option>
                      <option value="TRANSFER_ORDER">Ordem de Transferência</option>
                    </select>
                  </div>

                  <div>
                    <label htmlFor="reference_id" className="label-fiori">
                      ID da Referência
                    </label>
                    <input
                      type="text"
                      id="reference_id"
                      value={formData.reference_id}
                      onChange={(e) => setFormData({ ...formData, reference_id: e.target.value })}
                      className="input-fiori"
                      placeholder="Ex: TRANSF-001"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="reason" className="label-fiori">
                    Motivo
                  </label>
                  <select
                    id="reason"
                    value={formData.reason}
                    onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
                    className="select-fiori"
                  >
                    <option value="TRANSFER">Transferência Normal</option>
                    <option value="REBALANCE">Reequilíbrio de Estoque</option>
                    <option value="EMERGENCY">Transferência de Emergência</option>
                  </select>
                </div>

                <div className="flex gap-4">
                  <button
                    type="submit"
                    disabled={loading}
                    className="btn-fiori-primary flex-1"
                  >
                    {loading ? 'Processando...' : 'Executar Transferência'}
                  </button>
                </div>
              </form>
            </div>
          </div>

          {/* Informações */}
          <div className="card-fiori">
            <div className="card-fiori-header">
              <h2 className="card-fiori-title">Informações</h2>
            </div>
            <div className="card-fiori-body">
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <Package className="w-5 h-5 text-fiori-info mt-0.5" />
                  <div>
                    <h3 className="font-medium text-fiori-primary">Transferência de Estoque</h3>
                    <p className="text-sm text-fiori-secondary">
                      Transfere materiais entre diferentes plantas do sistema.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <ArrowRightLeft className="w-5 h-5 text-fiori-warning mt-0.5" />
                  <div>
                    <h3 className="font-medium text-fiori-primary">Processo Atômico</h3>
                    <p className="text-sm text-fiori-secondary">
                      A operação é executada de forma atômica: ou completa ou falha completamente.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 text-fiori-danger mt-0.5" />
                  <div>
                    <h3 className="font-medium text-fiori-primary">Validações</h3>
                    <p className="text-sm text-fiori-secondary">
                      • Verifica estoque disponível na origem<br/>
                      • Valida plantas diferentes<br/>
                      • Registra movimentações no ledger
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

