import Link from 'next/link'
import { ArrowLeft, TrendingUp, DollarSign, BarChart3, Target, Calculator, PieChart, TrendingDown } from 'lucide-react'
import { createSupabaseServerClient } from '@/lib/supabaseServer'
import { getTenantId } from '@/lib/auth'
import { formatBRL } from '@/lib/money'
import TileCard from '@/components/ui/TileCard'
import KpiCard from '@/components/ui/KpiCard'
import ListSection from '@/components/ui/ListSection'

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
    const supabase = createSupabaseServerClient()
    const tenantId = await getTenantId()

    // Buscar dados para KPIs
    const [productsResult, marginsResult, budgetsResult] = await Promise.allSettled([
      supabase
        .from('co_product_cost')
        .select('product_id, cost_cents, revenue_cents')
        .eq('tenant_id', tenantId),
      supabase
        .from('co_margin_analysis')
        .select('product_id, margin_percent, revenue_cents')
        .eq('tenant_id', tenantId),
      supabase
        .from('co_budget')
        .select('budget_id, planned_amount_cents, actual_amount_cents')
        .eq('tenant_id', tenantId)
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
    <div className="min-h-screen bg-gray-900">
      {/* Header */}
      <div className="bg-gray-800 border-b border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <Link 
                href="/" 
                className="inline-flex items-center text-gray-300 hover:text-white transition-colors mr-6"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Voltar
              </Link>
              <h1 className="text-xl font-semibold text-white">CO - Controle Gerencial</h1>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Title Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-white mb-4">CO - Controle Gerencial</h1>
          <p className="text-xl text-gray-300 mb-2">Relatórios e custos</p>
          <p className="text-lg text-gray-400">Análise de custos e performance de produtos</p>
        </div>

        {/* Tiles Principais */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          <TileCard
            title="Custos de Produtos"
            subtitle="Análise de custos"
            icon={Calculator}
            href="/co/product-costs"
            color="blue"
          />
          
          <TileCard
            title="Análise de Margens"
            subtitle="Performance"
            icon={PieChart}
            href="/co/margin-analysis"
            color="green"
          />
          
          <TileCard
            title="Orçamento"
            subtitle="Planejamento"
            icon={Target}
            href="/co/budget"
            color="purple"
          />
        </div>

        {/* Visão Geral - KPIs */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          <KpiCard
            title="Receita Total"
            value={formatBRL(totalRevenue)}
            subtitle="Receita bruta"
            icon={DollarSign}
            color="green"
          />
          
          <KpiCard
            title="Custos Totais"
            value={formatBRL(totalCosts)}
            subtitle="Custos operacionais"
            icon={TrendingDown}
            color="red"
          />
          
          <KpiCard
            title="Margem Bruta"
            value={formatBRL(grossMargin)}
            subtitle="Lucro bruto"
            icon={TrendingUp}
            color="green"
          />
          
          <KpiCard
            title="Margem %"
            value={`${grossMarginPercent}%`}
            subtitle="Percentual de margem"
            icon={BarChart3}
            color="blue"
          />
        </div>

        {/* Seções de Listagem */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <ListSection
            title="Produtos com Maior Margem"
            viewAllHref="/co/margin-analysis"
            viewAllText="Ver Todos"
            icon={TrendingUp}
            emptyState={{
              icon: PieChart,
              title: "Nenhuma análise de margem",
              description: "Configure a análise de margens para seus produtos",
              actionText: "Configurar Análise",
              actionHref: "/co/margin-analysis"
            }}
          >
            {margins.length > 0 ? (
              <div className="space-y-3">
                {margins
                  .sort((a, b) => b.margin_percent - a.margin_percent)
                  .slice(0, 5)
                  .map((margin) => (
                    <div key={margin.product_id} className="flex items-center justify-between p-3 bg-gray-700 rounded-lg">
                      <div>
                        <p className="text-white font-medium">{margin.product_id}</p>
                        <p className="text-gray-400 text-sm">{formatBRL(margin.revenue_cents)}</p>
                      </div>
                      <span className="text-green-400 text-sm font-medium">
                        {margin.margin_percent.toFixed(1)}%
                      </span>
                    </div>
                  ))}
              </div>
            ) : null}
          </ListSection>

          <ListSection
            title="Orçamentos Recentes"
            viewAllHref="/co/budget"
            viewAllText="Ver Todos"
            icon={Target}
            emptyState={{
              icon: Target,
              title: "Nenhum orçamento",
              description: "Crie orçamentos para planejamento financeiro",
              actionText: "Criar Orçamento",
              actionHref: "/co/budget/new"
            }}
          >
            {budgets.length > 0 ? (
              <div className="space-y-3">
                {budgets.slice(0, 5).map((budget) => (
                  <div key={budget.budget_id} className="flex items-center justify-between p-3 bg-gray-700 rounded-lg">
                    <div>
                      <p className="text-white font-medium">Orçamento #{budget.budget_id}</p>
                      <p className="text-gray-400 text-sm">
                        Planejado: {formatBRL(budget.planned_amount_cents)}
                      </p>
                    </div>
                    <span className="text-blue-400 text-sm">
                      {formatBRL(budget.actual_amount_cents)}
                    </span>
                  </div>
                ))}
              </div>
            ) : null}
          </ListSection>
        </div>
      </div>
    </div>
  )
}