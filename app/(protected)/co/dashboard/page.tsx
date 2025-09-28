import Link from 'next/link'
import { supabaseServer } from '@/utils/supabase/server'
import { requireSession } from '@/lib/auth/requireSession'
import { ArrowLeft, TrendingUp, TrendingDown, DollarSign, BarChart3 } from 'lucide-react'

export const dynamic = 'force-dynamic'
export const revalidate = 0
export const fetchCache = 'force-no-store'

export default async function CODashboardPage() {
  let totalRevenue = 0
  let totalCosts = 0
  let totalProfit = 0
  let profitMargin = 0
  let recentCosts: any[] = []

  try {
    const supabase = supabaseServer()
    await requireSession()

    // Buscar dados para KPIs
    const [revenueResult, costsResult, recentCostsResult] = await Promise.allSettled([
      supabase
        .from('sd_sales_order')
        .select('total_final_cents')
        
        .eq('status', 'CONFIRMED'),
      supabase
        .from('co_cost_center')
        .select('total_costs_cents')
        ,
      supabase
        .from('co_cost_center')
        .select('cost_center_id, cost_center_name, total_costs_cents, last_updated')
        
        .order('last_updated', { ascending: false })
        .limit(5)
    ])

    if (revenueResult.status === 'fulfilled') {
      const revenue = revenueResult.value.data || []
      totalRevenue = revenue.reduce((sum, order) => sum + (order.total_final_cents || 0), 0)
    }

    if (costsResult.status === 'fulfilled') {
      const costs = costsResult.value.data || []
      totalCosts = costs.reduce((sum, cost) => sum + (cost.total_costs_cents || 0), 0)
    }

    if (recentCostsResult.status === 'fulfilled') {
      recentCosts = recentCostsResult.value.data || []
    }

    totalProfit = totalRevenue - totalCosts
    profitMargin = totalRevenue > 0 ? (totalProfit / totalRevenue) * 100 : 0

  } catch (error) {
    console.error('Error loading CO dashboard data:', error)
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <Link href="/co" className="btn-fiori-outline flex items-center gap-2">
          <ArrowLeft className="w-4 h-4" />
          Voltar
        </Link>
        <div className="text-center flex-1">
          <h1 className="text-4xl font-bold text-fiori-primary mb-4">Dashboard de Controle</h1>
          <p className="text-xl text-fiori-secondary mb-2">Visão geral financeira e de custos</p>
          <p className="text-lg text-fiori-muted">Acompanhe a performance financeira da empresa</p>
        </div>
        <div className="w-20"></div> {/* Spacer para centralizar */}
      </div>

      {/* KPIs Principais */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="card-fiori">
          <div className="card-fiori-content">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-fiori-muted">Receita Total</p>
                <p className="text-2xl font-bold text-fiori-success">
                  R$ {(totalRevenue / 100).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                </p>
              </div>
              <TrendingUp className="w-8 h-8 text-fiori-success" />
            </div>
          </div>
        </div>

        <div className="card-fiori">
          <div className="card-fiori-content">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-fiori-muted">Custos Totais</p>
                <p className="text-2xl font-bold text-fiori-danger">
                  R$ {(totalCosts / 100).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                </p>
              </div>
              <TrendingDown className="w-8 h-8 text-fiori-danger" />
            </div>
          </div>
        </div>

        <div className="card-fiori">
          <div className="card-fiori-content">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-fiori-muted">Lucro Líquido</p>
                <p className={`text-2xl font-bold ${totalProfit >= 0 ? 'text-fiori-success' : 'text-fiori-danger'}`}>
                  R$ {(totalProfit / 100).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                </p>
              </div>
              <DollarSign className="w-8 h-8 text-fiori-primary" />
            </div>
          </div>
        </div>

        <div className="card-fiori">
          <div className="card-fiori-content">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-fiori-muted">Margem de Lucro</p>
                <p className={`text-2xl font-bold ${profitMargin >= 0 ? 'text-fiori-success' : 'text-fiori-danger'}`}>
                  {profitMargin.toFixed(1)}%
                </p>
              </div>
              <BarChart3 className="w-8 h-8 text-fiori-warning" />
            </div>
          </div>
        </div>
      </div>

      {/* Gráficos e Análises */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Centros de Custo Recentes */}
        <div className="card-fiori">
          <div className="card-fiori-header">
            <h3 className="card-fiori-title">Centros de Custo Recentes</h3>
          </div>
          <div className="card-fiori-content">
            {recentCosts.length === 0 ? (
              <div className="text-center py-8">
                <BarChart3 className="w-12 h-12 text-fiori-muted mx-auto mb-4" />
                <p className="text-fiori-muted">Nenhum centro de custo encontrado</p>
              </div>
            ) : (
              <div className="space-y-4">
                {recentCosts.map((cost) => (
                  <div key={cost.cost_center_id} className="flex items-center justify-between p-3 bg-fiori-surface rounded-lg">
                    <div>
                      <p className="font-semibold text-fiori-primary">{cost.cost_center_name}</p>
                      <p className="text-sm text-fiori-muted">
                        Atualizado em {cost.last_updated ? new Date(cost.last_updated).toLocaleDateString('pt-BR') : 'N/A'}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-fiori-danger">
                        R$ {((cost.total_costs_cents || 0) / 100).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Análise de Performance */}
        <div className="card-fiori">
          <div className="card-fiori-header">
            <h3 className="card-fiori-title">Análise de Performance</h3>
          </div>
          <div className="card-fiori-content">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-fiori-muted">Eficiência Operacional</span>
                <span className="font-semibold text-fiori-success">
                  {totalRevenue > 0 ? ((totalRevenue - totalCosts) / totalRevenue * 100).toFixed(1) : 0}%
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-fiori-muted">ROI</span>
                <span className="font-semibold text-fiori-info">
                  {totalCosts > 0 ? (totalProfit / totalCosts * 100).toFixed(1) : 0}%
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-fiori-muted">Status Financeiro</span>
                <span className={`font-semibold ${totalProfit >= 0 ? 'text-fiori-success' : 'text-fiori-danger'}`}>
                  {totalProfit >= 0 ? 'Positivo' : 'Negativo'}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

