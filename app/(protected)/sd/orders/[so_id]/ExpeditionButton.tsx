'use client'

import { useState } from 'react'
import { Truck, Loader2 } from 'lucide-react'

interface ExpeditionButtonProps {
  so_id: string
}

export default function ExpeditionButton({ so_id }: ExpeditionButtonProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [isShipped, setIsShipped] = useState(false)

  const handleExpedition = async () => {
    if (isLoading || isShipped) return

    setIsLoading(true)
    try {
      const response = await fetch('/api/sd/shipments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          so_id: so_id,
          warehouse_id: 'WH-001', // Usar warehouse_id correto
          notes: 'Expedição via sistema'
        })
      })

      if (!response.ok) {
        const result = await response.json()
        throw new Error(result.error || 'Erro na expedição')
      }

      const result = await response.json()
      if (result.ok) {
        setIsShipped(true)
        alert('Pedido expedido com sucesso!')
        // Recarregar a página para mostrar o novo status
        window.location.reload()
      }
    } catch (error) {
      console.error('Erro ao expedir:', error)
      alert('Erro ao expedir pedido: ' + (error instanceof Error ? error.message : 'Erro desconhecido'))
    } finally {
      setIsLoading(false)
    }
  }

  if (isShipped) {
    return (
      <div className="btn-fiori-success">
        <Truck className="w-4 h-4 mr-2" />
        Expedido
      </div>
    )
  }

  return (
    <button
      onClick={handleExpedition}
      disabled={isLoading}
      className="btn-fiori-primary disabled:opacity-50 disabled:cursor-not-allowed"
    >
      {isLoading ? (
        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
      ) : (
        <Truck className="w-4 h-4 mr-2" />
      )}
      {isLoading ? 'Expedindo...' : 'Expedir'}
    </button>
  )
}

