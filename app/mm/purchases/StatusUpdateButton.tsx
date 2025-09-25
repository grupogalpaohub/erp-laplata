'use client'

import { useState } from 'react'
import { createSupabaseClient } from '@/lib/supabaseClient'
import { ChevronRight, Loader2 } from 'lucide-react'

interface StatusUpdateButtonProps {
  poId: string
  currentStatus: string
}

const statusFlow = {
  'draft': 'approved',
  'approved': 'received',
  'received': null, // Status final
  'in_progress': 'received',
  'cancelled': null // Status final
}

const statusLabels = {
  'draft': 'Rascunho',
  'approved': 'Aprovado',
  'received': 'Recebido',
  'in_progress': 'Em Andamento',
  'cancelled': 'Cancelado'
}

const nextStatusLabels = {
  'draft': 'Aprovar',
  'approved': 'Marcar como Recebido',
  'in_progress': 'Marcar como Recebido',
  'received': null,
  'cancelled': null
}

export default function StatusUpdateButton({ poId, currentStatus }: StatusUpdateButtonProps) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const nextStatus = statusFlow[currentStatus as keyof typeof statusFlow]
  const buttonLabel = nextStatusLabels[currentStatus as keyof typeof nextStatusLabels]

  if (!nextStatus || !buttonLabel) {
    return null // Não mostra botão para status finais
  }

  const handleStatusUpdate = async () => {
    if (!nextStatus) return

    setLoading(true)
    setError(null)

    try {
      const supabase = createSupabaseClient()
      
      // Usar tenant fixo para desenvolvimento
      const tenantId = process.env.NEXT_PUBLIC_TENANT_ID || 'default'

      const { error: updateError } = await supabase
        .from('mm_purchase_order')
        .update({ 
          status: nextStatus,
          updated_at: new Date().toISOString()
        })
        .eq('mm_order', poId)
        .eq('tenant_id', tenantId)

      if (updateError) {
        throw new Error(updateError.message)
      }

      // Recarregar a página para mostrar a mudança
      window.location.reload()
    } catch (err) {
      console.error('Error updating status:', err)
      setError(err instanceof Error ? err.message : 'Erro ao atualizar status')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex flex-col gap-1">
      <button
        onClick={handleStatusUpdate}
        disabled={loading}
        className="btn-fiori-primary btn-sm flex items-center gap-1"
      >
        {loading ? (
          <Loader2 className="w-3 h-3 animate-spin" />
        ) : (
          <ChevronRight className="w-3 h-3" />
        )}
        {buttonLabel}
      </button>
      {error && (
        <span className="text-xs text-red-600">{error}</span>
      )}
    </div>
  )
}

