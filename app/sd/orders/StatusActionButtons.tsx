'use client'

import { useState } from 'react'
import { CheckCircle, XCircle } from 'lucide-react'
import Link from 'next/link'

interface StatusActionButtonsProps {
  soId: string
  currentStatus: string
  onStatusChange?: (newStatus: string) => void
}

export default function StatusActionButtons({ soId, currentStatus, onStatusChange }: StatusActionButtonsProps) {
  const [loading, setLoading] = useState(false)

  const updateStatus = async (newStatus: string) => {
    try {
      setLoading(true)
      const response = await fetch(`/api/sd/orders/${soId}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: newStatus })
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.error || 'Erro ao atualizar status')
      }

      // Recarregar a página para mostrar o novo status
      window.location.reload()
    } catch (error) {
      console.error('Erro ao atualizar status:', error)
      alert(error instanceof Error ? error.message : 'Erro ao atualizar status')
    } finally {
      setLoading(false)
    }
  }

  const getStatusActions = () => {
    switch (currentStatus) {
      case 'draft':
        return (
          <div className="flex gap-2">
            <Link href={`/sd/orders/${soId}/edit`} className="btn-fiori-outline text-xs flex items-center gap-1">
              <Edit className="w-3 h-3" />
              Editar
            </Link>
            <button 
              onClick={() => updateStatus('placed')}
              disabled={loading}
              className="btn-fiori-primary text-xs flex items-center gap-1 disabled:opacity-50"
            >
              <CheckCircle className="w-3 h-3" />
              {loading ? 'Aprovando...' : 'Aprovar'}
            </button>
          </div>
        )
      case 'placed':
        return (
          <div className="flex gap-2">
            <button 
              onClick={() => updateStatus('approved')}
              disabled={loading}
              className="btn-fiori-primary text-xs flex items-center gap-1 disabled:opacity-50"
            >
              <CheckCircle className="w-3 h-3" />
              {loading ? 'Faturando...' : 'Faturar'}
            </button>
            <button 
              onClick={() => updateStatus('cancelled')}
              disabled={loading}
              className="btn-fiori-danger-outline text-xs flex items-center gap-1 disabled:opacity-50"
            >
              <XCircle className="w-3 h-3" />
              {loading ? 'Cancelando...' : 'Cancelar'}
            </button>
          </div>
        )
      case 'approved':
        return (
          <div className="flex gap-2">
            <button 
              onClick={() => updateStatus('invoiced')}
              disabled={loading}
              className="btn-fiori-primary text-xs flex items-center gap-1 disabled:opacity-50"
            >
              <CheckCircle className="w-3 h-3" />
              {loading ? 'Processando...' : 'Finalizar'}
            </button>
          </div>
        )
      default:
        return null
    }
  }

  return getStatusActions()
}
