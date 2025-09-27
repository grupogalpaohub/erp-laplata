import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import { requireSession } from '@/lib/auth/requireSession'
import { getServerSupabase } from '@/lib/supabase/server'
import { formatBRL } from '@/lib/money'

export const dynamic = 'force-dynamic'
export const revalidate = 0
export const fetchCache = 'force-no-store'

export default async function COPage() {
  let products: any[] = []
  let margins: any[] = []
  let budgets: any[] = []
  let totalRevenue = 0
  let totalCosts = 0
  let grossMargin = 0
  let grossMarginPercent = 0

  try {
    await requireSession() // Verificar se está autenticado
    const supabase = getServerSupabase()

    // Buscar dados para KPIs (RLS filtra automaticamente por tenant)
    const [productsResult, marginsResult, budgetsResult] = await Promise.allSettled([
      supabase
        .from('co_product_cost')
        .select('product_id, cost_cents, revenue_cents'),
      supabase
        .from('co_margin_analysis')
        .select('product_id, margin_percent, revenue_cents'),
      supabase
        .from('co_budget')
        .select('budget_id, planned_amount_cents, actual_amount_cents')
    ])

    products = productsResult.status === 'fulfilled' ? (productsResult.value.data || []) : []
    margins = marginsResult.status === 'fulfilled' ? (marginsResult.value.data || []) : []
    budgets = budgetsResult.status === 'fulfilled' ? (budgetsResult.value.data || []) : []

    // Calcular KPIs
    totalRevenue = products.reduce((sum, item) => sum + (item.revenue_cents || 0), 0)
    totalCosts = products.reduce((sum, item) => sum + (item.cost_cents || 0), 0)
    grossMargin = totalRevenue - totalCosts
    grossMarginPercent = totalRevenue > 0 ? Math.round((grossMargin / totalRevenue) * 100) : 0

  } catch (error) {
    console.error('Error loading CO data:', error)
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <Link href="/" className="btn-fiori-outline flex items-center gap-2">
          <ArrowLeft className="w-4 h-4" />
          Voltar
        </Link>
        <div className="text-center flex-1">
          <h1 className="text-4xl font-bold text-fiori-primary mb-4">CO - Controle Gerencial</h1>
          <p className="text-xl text-fiori-secondary mb-2">Relatórios e custos</p>
          <p className="text-lg text-fiori-muted">Análise de custos e performance de produtos</p>
        </div>
        <div className="w-20"></div> {/* Spacer para centralizar */}
      </div>

      {/* Tiles Principais */}
      <div className="grid-fiori-3">
        <Link href="/co/product-costs" className="group">
          <div className="tile-fiori">
            <div className="tile-fiori-icon">
              <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
              </svg>
            </div>
            <h3 className="tile-fiori-title">Custos de Produtos</h3>
            <p className="tile-fiori-subtitle">Análise de custos</p>
          </div>
        </Link>

        <Link href="/co/margin-analysis" className="group">
          <div className="tile-fiori">
            <div className="tile-fiori-icon">
              <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 3.055A9.001 9.001 0 1020.945 13H11V3.055z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.488 9H15V3.512A9.025 9.025 0 0120.488 9z" />
              </svg>
            </div>
            <h3 className="tile-fiori-title">Análise de Margens</h3>
            <p className="tile-fiori-subtitle">Performance</p>
          </div>
        </Link>

        <Link href="/co/budget" className="group">
          <div className="tile-fiori">
            <div className="tile-fiori-icon">
              <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
            <h3 className="tile-fiori-title">Orçamento</h3>
            <p className="tile-fiori-subtitle">Planejamento</p>
          </div>
        </Link>
      </div>

      {/* Visão Geral - KPIs */}
      <div className="grid-fiori-4">
        <div className="card-fiori">
          <div className="card-fiori-body">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-medium text-fiori-secondary">Receita Total</h3>
              <svg className="w-5 h-5 text-fiori-success" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
              </svg>
            </div>
            <div className="space-y-2">
              <p className="kpi-fiori kpi-fiori-success">{formatBRL(totalRevenue)}</p>
              <p className="text-sm text-fiori-muted">Receita bruta</p>
            </div>
          </div>
        </div>

        <div className="card-fiori">
          <div className="card-fiori-body">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-medium text-fiori-secondary">Custos Totais</h3>
              <svg className="w-5 h-5 text-fiori-danger" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 17h8m0 0V9m0 8l-8-8-4 4-6-6" />
              </svg>
            </div>
            <div className="space-y-2">
              <p className="kpi-fiori kpi-fiori-danger">{formatBRL(totalCosts)}</p>
              <p className="text-sm text-fiori-muted">Custos operacionais</p>
            </div>
          </div>
        </div>

        <div className="card-fiori">
          <div className="card-fiori-body">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-medium text-fiori-secondary">Margem Bruta</h3>
              <svg className="w-5 h-5 text-fiori-success" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
              </svg>
            </div>
            <div className="space-y-2">
              <p className="kpi-fiori kpi-fiori-success">{formatBRL(grossMargin)}</p>
              <p className="text-sm text-fiori-muted">Lucro bruto</p>
            </div>
          </div>
        </div>

        <div className="card-fiori">
          <div className="card-fiori-body">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-medium text-fiori-secondary">Margem %</h3>
              <svg className="w-5 h-5 text-fiori-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
            <div className="space-y-2">
              <p className="kpi-fiori kpi-fiori-primary">{grossMarginPercent}%</p>
              <p className="text-sm text-fiori-muted">Percentual de margem</p>
            </div>
          </div>
        </div>
      </div>

      {/* Seções de Listagem */}
      <div className="grid-fiori-2">
        <div className="card-fiori">
          <div className="card-fiori-header">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <svg className="w-5 h-5 text-fiori-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                </svg>
                <h2 className="card-fiori-title">Produtos com Maior Margem</h2>
              </div>
              <Link href="/co/margin-analysis" className="text-fiori-primary hover:text-fiori-accent-blue text-sm font-medium transition-colors">
                Ver Todos
              </Link>
            </div>
          </div>
          <div className="card-fiori-body">
            {margins.length > 0 ? (
              <div className="space-y-3">
                {margins
                  .sort((a, b) => b.margin_percent - a.margin_percent)
                  .slice(0, 5)
                  .map((margin) => (
                    <div key={margin.product_id} className="flex items-center justify-between p-3 bg-fiori-secondary rounded">
                      <div>
                        <p className="text-fiori-primary font-medium">{margin.product_id}</p>
                        <p className="text-fiori-secondary text-sm">{formatBRL(margin.revenue_cents)}</p>
                      </div>
                      <span className="text-fiori-success text-sm font-medium">
                        {margin.margin_percent.toFixed(1)}%
                      </span>
                    </div>
                  ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <svg className="w-12 h-12 text-fiori-muted mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 3.055A9.001 9.001 0 1020.945 13H11V3.055z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.488 9H15V3.512A9.025 9.025 0 0120.488 9z" />
                </svg>
                <h3 className="text-lg font-medium text-fiori-secondary mb-2">Nenhuma análise de margem</h3>
                <p className="text-fiori-muted mb-4">Configure a análise de margens para seus produtos</p>
                <Link 
                  href="/co/margin-analysis"
                  className="btn-fiori-primary"
                >
                  Configurar Análise
                </Link>
              </div>
            )}
          </div>
        </div>

        <div className="card-fiori">
          <div className="card-fiori-header">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <svg className="w-5 h-5 text-fiori-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
                <h2 className="card-fiori-title">Orçamentos Recentes</h2>
              </div>
              <Link href="/co/budget" className="text-fiori-primary hover:text-fiori-accent-blue text-sm font-medium transition-colors">
                Ver Todos
              </Link>
            </div>
          </div>
          <div className="card-fiori-body">
            {budgets.length > 0 ? (
              <div className="space-y-3">
                {budgets.slice(0, 5).map((budget) => (
                  <div key={budget.budget_id} className="flex items-center justify-between p-3 bg-fiori-secondary rounded">
                    <div>
                      <p className="text-fiori-primary font-medium">Orçamento #{budget.budget_id}</p>
                      <p className="text-fiori-secondary text-sm">
                        Planejado: {formatBRL(budget.planned_amount_cents)}
                      </p>
                    </div>
                    <span className="text-fiori-primary text-sm">
                      {formatBRL(budget.actual_amount_cents)}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <svg className="w-12 h-12 text-fiori-muted mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
                <h3 className="text-lg font-medium text-fiori-secondary mb-2">Nenhum orçamento</h3>
                <p className="text-fiori-muted mb-4">Crie orçamentos para planejamento financeiro</p>
                <Link 
                  href="/co/budget/new"
                  className="btn-fiori-primary"
                >
                  Criar Orçamento
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
