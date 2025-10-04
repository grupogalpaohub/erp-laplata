import { supabaseServerReadOnly } from '@/lib/supabase/server-readonly'
import { requireSession } from '@/lib/auth/requireSession'
import Link from 'next/link'
import { TrendingUp, Package, AlertTriangle, ShoppingCart } from 'lucide-react'

export const dynamic = 'force-dynamic'
export const revalidate = 0

interface MRPSuggestion {
  tenant_id: string
  mm_material: string
  on_hand_qty: number
  reserved_qty: number
  available_qty: number
  qty_90d: number
  avg_daily: number
  lead_time_days: number
  safety_days: number
  target_coverage_qty: number
  suggested_purchase_qty: number
  mm_material_data?: {
    mm_comercial: string
    mm_desc: string
    mm_price_cents: number
  }
}

export default async function MRPPage() {
  const supabase = supabaseServerReadOnly()
  if (process.env.NODE_ENV === 'production') { if (process.env.NODE_ENV === 'production') { await requireSession() } }

  // Buscar sugestões MRP
  const { data: mrpData, error } = await supabase
    .from('wh_mrp_suggestion_v')
    .select(`
      *,
      mm_material_data:mm_material(
        mm_comercial,
        mm_desc,
        mm_price_cents
      )
    `)
    
    .order('suggested_purchase_qty', { ascending: false })

  if (error) {
    console.error('Error fetching MRP suggestions:', error)
  }

  const suggestions: MRPSuggestion[] = mrpData || []

  // Calcular estatísticas
  const totalSuggestions = suggestions.length
  const urgentSuggestions = suggestions.filter(s => s.suggested_purchase_qty > 0 && s.available_qty <= s.safety_days).length
  const totalValue = suggestions.reduce((total, s) => {
    const price = s.mm_material_data?.mm_price_cents || 0
    return total + (s.suggested_purchase_qty * price)
  }, 0)

  const getPriorityLevel = (suggestion: MRPSuggestion) => {
    if (suggestion.available_qty <= 0) return 'critical'
    if (suggestion.available_qty <= suggestion.safety_days) return 'high'
    if (suggestion.suggested_purchase_qty > 0) return 'medium'
    return 'low'
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'critical':
        return 'text-fiori-danger'
      case 'high':
        return 'text-fiori-warning'
      case 'medium':
        return 'text-fiori-info'
      default:
        return 'text-fiori-muted'
    }
  }

  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case 'critical':
        return 'badge-fiori-danger'
      case 'high':
        return 'badge-fiori-warning'
      case 'medium':
        return 'badge-fiori-info'
      default:
        return 'badge-fiori-neutral'
    }
  }

  return (
    <div className="container-fiori">
      <div className="section-fiori">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-fiori-primary">MRP - Sugestões de Compra</h1>
            <p className="text-fiori-secondary mt-2">
              Análise baseada em vendas dos últimos 90 dias
            </p>
          </div>
          <div className="flex gap-4">
            <Link href="/wh" className="btn-fiori-secondary">
              ← Voltar
            </Link>
            <Link href="/wh/inventory" className="btn-fiori-outline">
              Ver Estoque
            </Link>
          </div>
        </div>

        {/* Estatísticas */}
        <div className="grid-fiori-4 mb-8">
          <div className="tile-fiori">
            <div className="flex items-center justify-between">
              <div>
                <p className="tile-fiori-subtitle">Total de Sugestões</p>
                <p className="tile-fiori-metric">{totalSuggestions}</p>
              </div>
              <Package className="tile-fiori-icon" />
            </div>
          </div>

          <div className="tile-fiori">
            <div className="flex items-center justify-between">
              <div>
                <p className="tile-fiori-subtitle">Urgentes</p>
                <p className="tile-fiori-metric text-fiori-danger">{urgentSuggestions}</p>
              </div>
              <AlertTriangle className="tile-fiori-icon text-fiori-danger" />
            </div>
          </div>

          <div className="tile-fiori">
            <div className="flex items-center justify-between">
              <div>
                <p className="tile-fiori-subtitle">Valor Total</p>
                <p className="tile-fiori-metric">
                  R$ {(totalValue / 100).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                </p>
              </div>
              <TrendingUp className="tile-fiori-icon" />
            </div>
          </div>

          <div className="tile-fiori">
            <div className="flex items-center justify-between">
              <div>
                <p className="tile-fiori-subtitle">Ações</p>
                <p className="tile-fiori-metric">
                  <Link href="/mm/purchases/new" className="btn-fiori-primary text-xs">
                    <ShoppingCart className="w-4 h-4" />
                  </Link>
                </p>
              </div>
              <ShoppingCart className="tile-fiori-icon" />
            </div>
          </div>
        </div>

        {/* Tabela de Sugestões */}
        <div className="card-fiori">
          <div className="card-fiori-header">
            <h2 className="card-fiori-title">Sugestões de Compra</h2>
            <p className="card-fiori-subtitle">
              Lead time: 7 dias | Safety: 10 dias | Período: 90 dias
            </p>
          </div>
          <div className="card-fiori-body">
            <div className="overflow-x-auto">
              <table className="table-fiori">
                <thead>
                  <tr>
                    <th>Material</th>
                    <th className="text-right">Estoque Atual</th>
                    <th className="text-right">Consumo 90d</th>
                    <th className="text-right">Média Diária</th>
                    <th className="text-right">Cobertura Alvo</th>
                    <th className="text-right">Sugestão</th>
                    <th className="text-right">Valor Unit.</th>
                    <th className="text-right">Valor Total</th>
                    <th>Prioridade</th>
                    <th>Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {suggestions.map((suggestion) => {
                    const priority = getPriorityLevel(suggestion)
                    const unitPrice = suggestion.mm_material_data?.mm_price_cents || 0
                    const totalValue = suggestion.suggested_purchase_qty * unitPrice

                    return (
                      <tr key={suggestion.mm_material}>
                        <td>
                          <div>
                            <div className="font-mono text-sm text-fiori-primary">
                              {suggestion.mm_material}
                            </div>
                            <div className="text-xs text-fiori-muted">
                              {suggestion.mm_material_data?.mm_comercial || 'N/A'}
                            </div>
                          </div>
                        </td>
                        <td className="text-right">
                          <div>
                            <div className="font-medium">
                              {suggestion.on_hand_qty.toLocaleString()}
                            </div>
                            <div className="text-xs text-fiori-muted">
                              Disp: {suggestion.available_qty.toLocaleString()}
                            </div>
                          </div>
                        </td>
                        <td className="text-right">
                          {suggestion.qty_90d.toLocaleString()}
                        </td>
                        <td className="text-right">
                          {suggestion.avg_daily.toFixed(1)}
                        </td>
                        <td className="text-right">
                          {suggestion.target_coverage_qty.toLocaleString()}
                        </td>
                        <td className="text-right">
                          <span className={`font-medium ${
                            suggestion.suggested_purchase_qty > 0 ? 'text-fiori-primary' : 'text-fiori-muted'
                          }`}>
                            {suggestion.suggested_purchase_qty.toLocaleString()}
                          </span>
                        </td>
                        <td className="text-right">
                          R$ {(unitPrice / 100).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                        </td>
                        <td className="text-right font-medium">
                          {suggestion.suggested_purchase_qty > 0 ? (
                            <span className="text-fiori-primary">
                              R$ {(totalValue / 100).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                            </span>
                          ) : (
                            <span className="text-fiori-muted">-</span>
                          )}
                        </td>
                        <td>
                          <span className={`badge-fiori ${getPriorityBadge(priority)}`}>
                            {priority === 'critical' ? 'Crítico' :
                             priority === 'high' ? 'Alto' :
                             priority === 'medium' ? 'Médio' : 'Baixo'}
                          </span>
                        </td>
                        <td>
                          {suggestion.suggested_purchase_qty > 0 && (
                            <div className="flex gap-2">
                              <Link
                                href={`/mm/purchases/new?material=${suggestion.mm_material}&qty=${suggestion.suggested_purchase_qty}`}
                                className="btn-fiori-primary text-xs"
                              >
                                <ShoppingCart className="w-4 h-4" />
                              </Link>
                            </div>
                          )}
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>

            {suggestions.length === 0 && (
              <div className="text-center py-12">
                <Package className="w-12 h-12 text-fiori-muted mx-auto mb-4" />
                <h3 className="text-lg font-medium text-fiori-muted mb-2">
                  Nenhuma sugestão disponível
                </h3>
                <p className="text-fiori-muted">
                  As sugestões aparecerão baseadas nas vendas dos últimos 90 dias.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}


