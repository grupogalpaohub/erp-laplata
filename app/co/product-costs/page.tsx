import { getSupabaseServerClient } from '@/lib/supabase/server'
import { getTenantId } from '@/lib/auth'
import Link from 'next/link'
import { Calculator, TrendingUp, TrendingDown, AlertTriangle } from 'lucide-react'

export const dynamic = 'force-dynamic'
export const revalidate = 0

interface ProductCost {
  cost_id: string
  tenant_id: string
  mm_material: string
  standard_cost_cents: number
  current_cost_cents: number
  last_updated: string
  mm_material_data?: {
    mm_comercial: string
    mm_desc: string
    mm_price_cents: number
  }
}

export default async function ProductCostsPage() {
  const supabase = getSupabaseServerClient()
  const tenantId = await getTenantId()

  // Buscar custos de produtos
  const { data: costsData, error } = await supabase
    .from('co_product_cost')
    .select(`
      *,
      mm_material_data:mm_material(
        mm_comercial,
        mm_desc,
        mm_price_cents
      )
    `)
    .eq('tenant_id', tenantId)
    .order('mm_material')

  if (error) {
    console.error('Error fetching product costs:', error)
  }

  const costs: ProductCost[] = costsData || []

  // Calcular estatísticas
  const totalStandardCost = costs.reduce((sum, cost) => sum + cost.standard_cost_cents, 0)
  const totalCurrentCost = costs.reduce((sum, cost) => sum + cost.current_cost_cents, 0)
  const costVariance = totalCurrentCost - totalStandardCost
  const costVariancePercent = totalStandardCost > 0 ? (costVariance / totalStandardCost) * 100 : 0

  const getCostVarianceIcon = (standard: number, current: number) => {
    if (current > standard * 1.1) return <TrendingUp className="w-4 h-4 text-fiori-danger" />
    if (current < standard * 0.9) return <TrendingDown className="w-4 h-4 text-fiori-success" />
    return <AlertTriangle className="w-4 h-4 text-fiori-warning" />
  }

  const getCostVarianceColor = (standard: number, current: number) => {
    if (current > standard * 1.1) return 'text-fiori-danger'
    if (current < standard * 0.9) return 'text-fiori-success'
    return 'text-fiori-warning'
  }

  const getCostVarianceLabel = (standard: number, current: number) => {
    const variance = current - standard
    const variancePercent = standard > 0 ? (variance / standard) * 100 : 0
    
    if (variance > 0) return `+${variancePercent.toFixed(1)}%`
    if (variance < 0) return `${variancePercent.toFixed(1)}%`
    return '0%'
  }

  return (
    <div className="container-fiori">
      <div className="section-fiori">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-fiori-primary">Custos de Produto</h1>
            <p className="text-fiori-secondary mt-2">Análise de custos padrão vs atual</p>
          </div>
          <div className="flex gap-4">
            <Link href="/co" className="btn-fiori-secondary">
              ← Voltar
            </Link>
            <Link href="/co/product-costs/update" className="btn-fiori-primary">
              Atualizar Custos
            </Link>
          </div>
        </div>

        {/* Estatísticas */}
        <div className="grid-fiori-4 mb-8">
          <div className="tile-fiori">
            <div className="flex items-center justify-between">
              <div>
                <p className="tile-fiori-subtitle">Custo Padrão Total</p>
                <p className="tile-fiori-metric">
                  R$ {(totalStandardCost / 100).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                </p>
              </div>
              <Calculator className="tile-fiori-icon" />
            </div>
          </div>

          <div className="tile-fiori">
            <div className="flex items-center justify-between">
              <div>
                <p className="tile-fiori-subtitle">Custo Atual Total</p>
                <p className="tile-fiori-metric">
                  R$ {(totalCurrentCost / 100).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                </p>
              </div>
              <Calculator className="tile-fiori-icon" />
            </div>
          </div>

          <div className="tile-fiori">
            <div className="flex items-center justify-between">
              <div>
                <p className="tile-fiori-subtitle">Variação Total</p>
                <p className={`tile-fiori-metric ${
                  costVariance >= 0 ? 'text-fiori-danger' : 'text-fiori-success'
                }`}>
                  R$ {(costVariance / 100).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                </p>
              </div>
              {costVariance >= 0 ? 
                <TrendingUp className="tile-fiori-icon text-fiori-danger" /> :
                <TrendingDown className="tile-fiori-icon text-fiori-success" />
              }
            </div>
          </div>

          <div className="tile-fiori">
            <div className="flex items-center justify-between">
              <div>
                <p className="tile-fiori-subtitle">Variação %</p>
                <p className={`tile-fiori-metric ${
                  costVariancePercent >= 0 ? 'text-fiori-danger' : 'text-fiori-success'
                }`}>
                  {costVariancePercent.toFixed(1)}%
                </p>
              </div>
              <AlertTriangle className="tile-fiori-icon" />
            </div>
          </div>
        </div>

        {/* Tabela de Custos */}
        <div className="card-fiori">
          <div className="card-fiori-header">
            <h2 className="card-fiori-title">Custos por Produto</h2>
            <p className="card-fiori-subtitle">
              {costs.length} produtos com custos cadastrados
            </p>
          </div>
          <div className="card-fiori-body">
            <div className="overflow-x-auto">
              <table className="table-fiori">
                <thead>
                  <tr>
                    <th>Produto</th>
                    <th className="text-right">Custo Padrão</th>
                    <th className="text-right">Custo Atual</th>
                    <th className="text-right">Variação</th>
                    <th className="text-right">Variação %</th>
                    <th className="text-right">Preço de Venda</th>
                    <th className="text-right">Margem</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {costs.map((cost) => {
                    const variance = cost.current_cost_cents - cost.standard_cost_cents
                    const variancePercent = cost.standard_cost_cents > 0 ? 
                      (variance / cost.standard_cost_cents) * 100 : 0
                    const sellingPrice = cost.mm_material_data?.mm_price_cents || 0
                    const margin = sellingPrice - cost.current_cost_cents
                    const marginPercent = sellingPrice > 0 ? (margin / sellingPrice) * 100 : 0

                    return (
                      <tr key={cost.cost_id}>
                        <td>
                          <div>
                            <div className="font-mono text-sm text-fiori-primary">
                              {cost.mm_material}
                            </div>
                            <div className="text-xs text-fiori-muted">
                              {cost.mm_material_data?.mm_comercial || 'N/A'}
                            </div>
                          </div>
                        </td>
                        <td className="text-right">
                          <span className="font-medium">
                            R$ {(cost.standard_cost_cents / 100).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                          </span>
                        </td>
                        <td className="text-right">
                          <span className="font-medium">
                            R$ {(cost.current_cost_cents / 100).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                          </span>
                        </td>
                        <td className="text-right">
                          <span className={`font-medium ${
                            variance >= 0 ? 'text-fiori-danger' : 'text-fiori-success'
                          }`}>
                            {variance >= 0 ? '+' : ''}R$ {(variance / 100).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                          </span>
                        </td>
                        <td className="text-right">
                          <span className={`font-medium ${
                            variance >= 0 ? 'text-fiori-danger' : 'text-fiori-success'
                          }`}>
                            {variance >= 0 ? '+' : ''}{variancePercent.toFixed(1)}%
                          </span>
                        </td>
                        <td className="text-right">
                          <span className="font-medium">
                            R$ {(sellingPrice / 100).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                          </span>
                        </td>
                        <td className="text-right">
                          <span className={`font-medium ${
                            margin >= 0 ? 'text-fiori-success' : 'text-fiori-danger'
                          }`}>
                            R$ {(margin / 100).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                            <div className="text-xs">
                              ({marginPercent.toFixed(1)}%)
                            </div>
                          </span>
                        </td>
                        <td>
                          <div className="flex items-center gap-2">
                            {getCostVarianceIcon(cost.standard_cost_cents, cost.current_cost_cents)}
                            <span className={`text-sm ${
                              getCostVarianceColor(cost.standard_cost_cents, cost.current_cost_cents)
                            }`}>
                              {getCostVarianceLabel(cost.standard_cost_cents, cost.current_cost_cents)}
                            </span>
                          </div>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>

            {costs.length === 0 && (
              <div className="text-center py-12">
                <Calculator className="w-12 h-12 text-fiori-muted mx-auto mb-4" />
                <h3 className="text-lg font-medium text-fiori-muted mb-2">
                  Nenhum custo de produto encontrado
                </h3>
                <p className="text-fiori-muted mb-4">
                  Os custos de produto são calculados automaticamente baseados nas compras.
                </p>
                <Link href="/co/product-costs/update" className="btn-fiori-primary">
                  Calcular Custos
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

