'use client'

import { useState } from 'react'

interface ReceivingButtonProps {
  mmOrder: string
  items: any[]
}

export default function ReceivingButton({ mmOrder, items }: ReceivingButtonProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [selectedMaterial, setSelectedMaterial] = useState('')
  const [qtyReceived, setQtyReceived] = useState('')
  const [notes, setNotes] = useState('')
  const [loading, setLoading] = useState(false)

  const handleReceive = async () => {
    if (!selectedMaterial || !qtyReceived) {
      alert('Selecione um material e informe a quantidade')
      return
    }

    setLoading(true)
    try {
      const response = await fetch('/api/mm/receivings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          mm_order: mmOrder,
          plant_id: 'WH-001',
          mm_material: selectedMaterial,
          qty_received: Number(qtyReceived),
          notes: notes
        })
      })

      const result = await response.json()
      
      if (response.ok) {
        alert('Recebimento registrado com sucesso!')
        setIsOpen(false)
        setSelectedMaterial('')
        setQtyReceived('')
        setNotes('')
        // Recarregar a página para atualizar dados
        window.location.reload()
      } else {
        alert(`Erro: ${result.error || 'Falha no recebimento'}`)
      }
    } catch (error) {
      alert('Erro ao processar recebimento')
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <button 
        onClick={() => setIsOpen(true)}
        className="btn-fiori-success"
      >
        📦 Receber
      </button>

      {isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-96 max-w-md mx-4">
            <h3 className="text-lg font-semibold mb-4">Receber Material</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Material</label>
                <select 
                  value={selectedMaterial}
                  onChange={(e) => setSelectedMaterial(e.target.value)}
                  className="w-full p-2 border rounded"
                >
                  <option value="">Selecione um material</option>
                  {items.map((item, index) => (
                    <option key={index} value={item.mm_material}>
                      {item.mm_material} - Qtd: {item.mm_qtt}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Quantidade Recebida</label>
                <input 
                  type="number"
                  value={qtyReceived}
                  onChange={(e) => setQtyReceived(e.target.value)}
                  className="w-full p-2 border rounded"
                  placeholder="Digite a quantidade"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Observações</label>
                <textarea 
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full p-2 border rounded"
                  rows={3}
                  placeholder="Observações opcionais"
                />
              </div>
            </div>

            <div className="flex gap-2 mt-6">
              <button 
                onClick={() => setIsOpen(false)}
                className="btn-fiori-secondary flex-1"
                disabled={loading}
              >
                Cancelar
              </button>
              <button 
                onClick={handleReceive}
                className="btn-fiori-success flex-1"
                disabled={loading}
              >
                {loading ? 'Processando...' : 'Confirmar Recebimento'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}