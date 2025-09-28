'use client'
import { useEffect, useState } from 'react'
import { fetchWithAuth } from '@/utils/fetchWithAuth'

export default function PurchaseOrderPage({ params }: { params: { id: string } }) {
  const [state, setState] = useState<{loading:boolean; error:string|null; data:any|null}>({loading:true,error:null,data:null})

  useEffect(() => {
    fetchWithAuth(`/api/mm/purchases/${encodeURIComponent(params.id)}`)
      .then(r => r.json())
      .then(j => {
        if (!j.ok) setState({loading:false,error:j.error || 'Erro ao carregar', data:null})
        else setState({loading:false,error:null,data:j.data})
      })
      .catch(() => setState({loading:false,error:'Falha de rede',data:null}))
  }, [params.id])

  if (state.loading) return <div className="p-6">Carregando...</div>
  if (state.error) return <div className="p-6 text-red-500">{state.error}</div>
  return <div className="p-6">PO: {state.data.po_id}</div>
}
