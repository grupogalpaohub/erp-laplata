'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import ReceivingButton from './ReceivingButton'

type LoadState =
  | { loading: true; error: null; data: null }
  | { loading: false; error: string; data: null }
  | { loading: false; error: null; data: any }

const toMsg = (e: any) => (typeof e === 'string' ? e : typeof e?.message === 'string' ? e.message : 'Erro')

export default function PurchaseOrderPage({ params }: { params: { mm_order: string } }) {
  const router = useRouter()
  const [s, setS] = useState<LoadState>({ loading: true, error: null, data: null })

  useEffect(() => {
    let alive = true
    ;(async () => {
      try {
        const res = await fetch(`/api/mm/purchase-orders/${params.mm_order}`)
        if (!alive) return
        if (!res.ok) {
          // trate 404/400 para mostrar o aviso padrão
          const errorData = await res.json()
          setS({ loading: false, error: toMsg(errorData?.error), data: null })
          return
        }
        const data = await res.json()
        console.log('Purchase order data received:', data)
        setS({ loading: false, error: null, data })
      } catch (e) {
        if (!alive) return
        setS({ loading: false, error: toMsg(e), data: null })
      }
    })()
    return () => { alive = false }
  }, [params.mm_order])

  if (s.loading) return <div className="p-6">Carregando…</div>
  if (s.error) {
    return (
      <div className="p-6">
        <div className="bg-amber-50 border border-amber-200 rounded p-4">
          <div className="font-medium text-amber-700">Erro ao carregar pedido</div>
          <div className="text-amber-800 mt-1">{s.error}</div>
          <button className="mt-3 px-3 py-1.5 rounded bg-blue-600 text-white" onClick={() => router.push('/mm/purchases')}>
            Voltar
          </button>
        </div>
      </div>
    )
  }

  const { header, items } = s.data?.ok ? s.data.data : {}
  console.log('Extracted header:', header)
  console.log('Extracted items:', items)
  
  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-fiori-primary mb-4">
          Pedido de Compra {header?.doc_no ?? header?.mm_order}
        </h1>
        <p className="text-xl text-fiori-secondary mb-2">Detalhes do pedido de compra</p>
        <p className="text-lg text-fiori-muted">Visualize todos os dados e itens do pedido</p>
      </div>

      {/* Actions */}
      <div className="flex justify-center gap-4 mb-8">
        <button 
          onClick={() => router.push('/mm/purchases')} 
          className="btn-fiori-secondary"
        >
          ← Voltar
        </button>
        <button 
          onClick={() => router.push('/mm/purchases/new')} 
          className="btn-fiori-primary"
        >
          + Novo Pedido
        </button>
        {header?.status === 'confirmed' && (
          <ReceivingButton 
            mmOrder={header.mm_order}
            items={items || []}
          />
        )}
      </div>

      {/* Informações do Pedido */}
      <div className="card-fiori">
        <div className="p-6">
          <h2 className="text-xl font-semibold mb-4 text-fiori-primary">Informações do Pedido</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div>
              <label className="text-sm font-medium text-fiori-text-secondary block mb-2">Status</label>
              <span className={`badge-fiori ${
                header?.status === 'draft' ? 'badge-fiori-info' :
                header?.status === 'approved' ? 'badge-fiori-success' :
                header?.status === 'in_progress' ? 'badge-fiori-warning' :
                header?.status === 'completed' ? 'badge-fiori-success' :
                header?.status === 'cancelled' ? 'badge-fiori-danger' :
                'badge-fiori-secondary'
              }`}>
                {header?.status?.toUpperCase() || 'UNKNOWN'}
              </span>
            </div>
            
            <div>
              <label className="text-sm font-medium text-fiori-text-secondary block mb-2">Data do Pedido</label>
              <p className="text-lg text-fiori-text-primary">
                {header?.order_date ? new Date(header.order_date).toLocaleDateString('pt-BR') : '-'}
              </p>
            </div>
            
            <div>
              <label className="text-sm font-medium text-fiori-text-secondary block mb-2">Fornecedor</label>
              <p className="text-lg text-fiori-text-primary">{header?.vendor_id || '-'}</p>
            </div>
            
            <div>
              <label className="text-sm font-medium text-fiori-text-secondary block mb-2">Total</label>
              <p className="text-lg font-semibold text-fiori-accent-blue">
                R$ {(((header?.total_final_cents ?? header?.total_cents) ?? 0) / 100).toFixed(2)}
              </p>
            </div>
          </div>
          
          {header?.notes && (
            <div className="mt-6">
              <label className="text-sm font-medium text-fiori-text-secondary block mb-2">Observações</label>
              <p className="text-fiori-text-primary bg-fiori-bg-tertiary p-3 rounded">{header.notes}</p>
            </div>
          )}
        </div>
      </div>

      {/* Itens do Pedido */}
      <div className="card-fiori">
        <div className="p-6">
          <h2 className="text-xl font-semibold mb-4 text-fiori-primary">Itens do Pedido</h2>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-fiori-bg-tertiary">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-fiori-text-primary uppercase tracking-wider">Item</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-fiori-text-primary uppercase tracking-wider">Material</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-fiori-text-primary uppercase tracking-wider">SKU</th>
                  <th className="px-6 py-3 text-center text-xs font-medium text-fiori-text-primary uppercase tracking-wider">Quantidade</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-fiori-text-primary uppercase tracking-wider">Preço Unit.</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-fiori-text-primary uppercase tracking-wider">Total</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-fiori-text-primary uppercase tracking-wider">Observações</th>
                </tr>
              </thead>
              <tbody className="bg-fiori-bg-elevated divide-y divide-fiori-border">
                {(items || []).map((item: any, index: number) => (
                  <tr key={item.po_item_id || index}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-fiori-text-primary">
                      {item.po_item_id || '-'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-fiori-text-primary">
                      {item.mm_material || '-'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-fiori-text-primary">
                      {item.sku || '-'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-fiori-text-primary text-center">
                      {item.mm_qtt || item.quantity || '-'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-fiori-text-primary text-right">
                      R$ {((item.unit_cost_cents || item.unit_price_cents || 0) / 100).toFixed(2)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-fiori-text-primary text-right">
                      R$ {((item.line_total_cents || 0) / 100).toFixed(2)}
                    </td>
                    <td className="px-6 py-4 text-sm text-fiori-text-primary">
                      {item.notes || '-'}
                    </td>
                  </tr>
                ))}
                {(!items || items.length === 0) && (
                  <tr>
                    <td colSpan={7} className="px-6 py-8 text-center text-fiori-text-muted">
                      Nenhum item encontrado
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}