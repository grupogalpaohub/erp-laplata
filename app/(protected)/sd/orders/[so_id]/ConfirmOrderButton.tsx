'use client'

import { useState, useTransition } from 'react'
import { CheckCircle, Warehouse } from 'lucide-react'

interface ConfirmOrderButtonProps {
  soId: string
  currentStatus: string
  onConfirm: () => void
}

interface Warehouse {
  warehouse_id: string
  warehouse_name: string
  location: string
}

export default function ConfirmOrderButton({ soId, currentStatus, onConfirm }: ConfirmOrderButtonProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [selectedWarehouse, setSelectedWarehouse] = useState('')
  const [warehouses, setWarehouses] = useState<Warehouse[]>([])
  const [isPending, startTransition] = useTransition()

  const handleOpen = async () => {
    if (warehouses.length === 0) {
      // Buscar warehouses disponíveis
      try {
        const response = await fetch('/api/wh/warehouses')
        const data = await response.json()
        if (data.ok) {
          setWarehouses(data.data || [])
        }
      } catch (error) {
        console.error('Error loading warehouses:', error)
      }
    }
    setIsOpen(true)
  }

  const handleConfirm = async () => {
    if (!selectedWarehouse) return

    startTransition(async () => {
      try {
        const response = await fetch(`/api/sd/orders/${soId}/confirm`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            warehouse_id: selectedWarehouse
          })
        })

        const result = await response.json()
        
        if (result.ok) {
          onConfirm()
          setIsOpen(false)
          setSelectedWarehouse('')
        } else {
          alert(`Erro: ${result.error?.message || 'Falha ao confirmar pedido'}`)
        }
      } catch (error) {
        console.error('Error confirming order:', error)
        alert('Erro ao confirmar pedido')
      }
    })
  }

  if (currentStatus !== 'draft') {
    return null
  }

  return (
    <>
      <button
        onClick={handleOpen}
        disabled={isPending}
        className="btn-fiori-primary flex items-center gap-2"
      >
        <CheckCircle className="w-4 h-4" />
        {isPending ? 'Confirmando...' : 'Confirmar Pedido'}
      </button>

      {isOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-fiori-surface rounded-lg p-6 w-full max-w-md mx-4">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-fiori-primary/10 rounded-full flex items-center justify-center">
                <Warehouse className="w-5 h-5 text-fiori-primary" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-fiori-primary">Confirmar Pedido</h3>
                <p className="text-sm text-fiori-muted">Selecione o warehouse para reserva</p>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label className="label-fiori">Warehouse</label>
                <select
                  value={selectedWarehouse}
                  onChange={(e) => setSelectedWarehouse(e.target.value)}
                  className="select-fiori"
                  required
                >
                  <option value="">Selecione um warehouse</option>
                  {warehouses.map((warehouse) => (
                    <option key={warehouse.warehouse_id} value={warehouse.warehouse_id}>
                      {warehouse.warehouse_name} - {warehouse.location}
                    </option>
                  ))}
                </select>
              </div>

              <div className="bg-fiori-warning/10 border border-fiori-warning/20 rounded-lg p-3">
                <p className="text-sm text-fiori-warning">
                  <strong>Atenção:</strong> Ao confirmar, os itens serão reservados no warehouse selecionado.
                </p>
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setIsOpen(false)}
                className="btn-fiori-outline flex-1"
                disabled={isPending}
              >
                Cancelar
              </button>
              <button
                onClick={handleConfirm}
                disabled={!selectedWarehouse || isPending}
                className="btn-fiori-primary flex-1 flex items-center justify-center gap-2"
              >
                <CheckCircle className="w-4 h-4" />
                {isPending ? 'Confirmando...' : 'Confirmar'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
