import { supabaseServer } from '@/lib/supabase/server'
import { requireSession } from '@/lib/auth/requireSession'
import Link from 'next/link'
import { BarChart3, TrendingUp, Target, AlertCircle } from 'lucide-react'

export const dynamic = 'force-dynamic'
export const revalidate = 0

interface MarginAnalysis {
  material_id: string
  material_name: string
  total_sales_cents: number
  total_cost_cents: number
  gross_margin_cents: number
  gross_margin_percent: number
  units_sold: number
  average_price_cents: number
  average_cost_cents: number
}

export default async function MarginAnalysisPage() {
  const supabase = supabaseServer()
  await requireSession()

  // Buscar análise de margens
  const { data: marginData, error } = await supabase
    .from('co_margin_analysis')
    .select(`
      *,
      material:mm_material(
        mm_comercial,
        mm_desc
      )
    `)
    
    .order('gross_margin_cents', { ascending: false })

  if (error) {
    console.error('Error fetching margin analysis:', error)
  }

  const margins: MarginAnalysis[] = marginData || []

  // Calcular estatísticas
  const totalSales = margins.reduce((sum, m) => sum + m.total_sales_cents, 0)
  const totalCosts = margins.reduce((sum, m) => sum + m.total_cost_cents, 0)
  const totalMargin = totalSales - totalCosts
  const averageMarginPercent = totalSales > 0 ? (totalMargin / totalSales) * 100 : 0

  const getMarginColor = (percent: number) => {
    if (percent >= 30) return 'text-fiori-success'
    if (percent >= 15) return 'text-fiori-warning'
    return 'text-fiori-danger'
  }

  const getMarginBadge = (percent: number) => {
    if (percent >= 30) return 'badge-fiori-success'
    if (percent >= 15) return 'badge-fiori-warning'
    return 'badge-fiori-danger'
  }

  const getMarginLabel = (percent: number) => {
    if (percent >= 30) return 'Excelente'
    if (percent >= 15) return 'Boa'
    if (percent >= 0) return 'Baixa'
    return 'Negativa'
  }

  return (
    <div className="container-fiori">
      <div className="section-fiori">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-fiori-primary">Análise de Margens</h1>
            <p className="text-fiori-secondary mt-2">Análise de rentabilidade por produto</p>
          </div>
          <div className="flex gap-4">
            <Link href="/co" className="btn-fiori-secondary">
              ← Voltar
            </Link>
            <Link href="/co/margin-analysis/refresh" className="btn-fiori-primary">
              Atualizar Análise
            </Link>
          </div>
        </div>

        {/* Estatísticas */}
        <div className="grid-fiori-4 mb-8">
          <div className="tile-fiori">
            <div className="flex items-center justify-between">
              <div>
                <p className="tile-fiori-subtitle">Receita Total</p>
                <p className="tile-fiori-metric">
                  R$ {(totalSales / 100).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                </p>
              </div>
              <BarChart3 className="tile-fiori-icon text-fiori-success" />
            </div>
          </div>

          <div className="tile-fiori">
            <div className="flex items-center justify-between">
              <div>
                <p className="tile-fiori-subtitle">Custos Totais</p>
                <p className="tile-fiori-metric">
                  R$ {(totalCosts / 100).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                </p>
              </div>
              <BarChart3 className="tile-fiori-icon text-fiori-danger" />
            </div>
          </div>

          <div className="tile-fiori">
            <div className="flex items-center justify-between">
              <div>
                <p className="tile-fiori-subtitle">Margem Total</p>
                <p className={`tile-fiori-metric ${
                  totalMargin >= 0 ? 'text-fiori-success' : 'text-fiori-danger'
                }`}>
                  R$ {(totalMargin / 100).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                </p>
              </div>
              <TrendingUp className="tile-fiori-icon" />
            </div>
          </div>

          <div className="tile-fiori">
            <div className="flex items-center justify-between">
              <div>
                <p className="tile-fiori-subtitle">Margem Média</p>
                <p className={`tile-fiori-metric ${
                  averageMarginPercent >= 0 ? 'text-fiori-success' : 'text-fiori-danger'
                }`}>
                  {averageMarginPercent.toFixed(1)}%
                </p>
              </div>
              <Target className="tile-fiori-icon" />
            </div>
          </div>
        </div>

        {/* Tabela de Análise de Margens */}
        <div className="card-fiori">
          <div className="card-fiori-header">
            <h2 className="card-fiori-title">Análise por Produto</h2>
            <p className="card-fiori-subtitle">
              {margins.length} produtos analisados
            </p>
          </div>
          <div className="card-fiori-body">
            <div className="overflow-x-auto">
              <table className="table-fiori">
                <thead>
                  <tr>
                    <th>Produto</th>
                    <th className="text-right">Unidades Vendidas</th>
                    <th className="text-right">Preço Médio</th>
                    <th className="text-right">Custo Médio</th>
                    <th className="text-right">Receita Total</th>
                    <th className="text-right">Custo Total</th>
                    <th className="text-right">Margem (R$)</th>
                    <th className="text-right">Margem (%)</th>
                    <th>Classificação</th>
                  </tr>
                </thead>
                <tbody>
                  {margins.map((margin) => (
                    <tr key={margin.material_id}>
                      <td>
                        <div>
                          <div className="font-mono text-sm text-fiori-primary">
                            {margin.material_id}
                          </div>
                          <div className="text-xs text-fiori-muted">
                            {margin.material_name || 'N/A'}
                          </div>
                        </div>
                      </td>
                      <td className="text-right">
                        <span className="font-medium">
                          {margin.units_sold.toLocaleString()}
                        </span>
                      </td>
                      <td className="text-right">
                        <span className="font-medium">
                          R$ {(margin.average_price_cents / 100).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                        </span>
                      </td>
                      <td className="text-right">
                        <span className="font-medium">
                          R$ {(margin.average_cost_cents / 100).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                        </span>
                      </td>
                      <td className="text-right">
                        <span className="font-medium text-fiori-success">
                          R$ {(margin.total_sales_cents / 100).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                        </span>
                      </td>
                      <td className="text-right">
                        <span className="font-medium text-fiori-danger">
                          R$ {(margin.total_cost_cents / 100).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                        </span>
                      </td>
                      <td className="text-right">
                        <span className={`font-medium ${
                          margin.gross_margin_cents >= 0 ? 'text-fiori-success' : 'text-fiori-danger'
                        }`}>
                          R$ {(margin.gross_margin_cents / 100).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                        </span>
                      </td>
                      <td className="text-right">
                        <span className={`font-medium ${
                          getMarginColor(margin.gross_margin_percent)
                        }`}>
                          {margin.gross_margin_percent.toFixed(1)}%
                        </span>
                      </td>
                      <td>
                        <div className="flex items-center gap-2">
                          <AlertCircle className={`w-4 h-4 ${
                            getMarginColor(margin.gross_margin_percent)
                          }`} />
                          <span className={`badge-fiori ${
                            getMarginBadge(margin.gross_margin_percent)
                          }`}>
                            {getMarginLabel(margin.gross_margin_percent)}
                          </span>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {margins.length === 0 && (
              <div className="text-center py-12">
                <BarChart3 className="w-12 h-12 text-fiori-muted mx-auto mb-4" />
                <h3 className="text-lg font-medium text-fiori-muted mb-2">
                  Nenhuma análise de margem encontrada
                </h3>
                <p className="text-fiori-muted mb-4">
                  A análise de margens é calculada baseada nas vendas e custos dos produtos.
                </p>
                <Link href="/co/margin-analysis/refresh" className="btn-fiori-primary">
                  Calcular Análise
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

