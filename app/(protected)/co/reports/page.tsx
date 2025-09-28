import Link from 'next/link'
import { supabaseServer } from '@/lib/supabase/server'
import { requireSession } from '@/lib/auth/requireSession'
import { ArrowLeft, Download, FileText, BarChart3, TrendingUp, Calendar } from 'lucide-react'

export const dynamic = 'force-dynamic'
export const revalidate = 0
export const fetchCache = 'force-no-store'

export default async function ReportsPage() {
  let totalRevenue = 0
  let totalCosts = 0
  let totalProfit = 0

  try {
    const supabase = supabaseServer()
    await requireSession()

    // Buscar dados para relatórios
    const [revenueResult, costsResult] = await Promise.allSettled([
      supabase
        .from('sd_sales_order')
        .select('total_final_cents')
        
        .eq('status', 'CONFIRMED'),
      supabase
        .from('co_cost_center')
        .select('total_costs_cents')
        
    ])

    if (revenueResult.status === 'fulfilled') {
      const revenue = revenueResult.value.data || []
      totalRevenue = revenue.reduce((sum, order) => sum + (order.total_final_cents || 0), 0)
    }

    if (costsResult.status === 'fulfilled') {
      const costs = costsResult.value.data || []
      totalCosts = costs.reduce((sum, cost) => sum + (cost.total_costs_cents || 0), 0)
    }

    totalProfit = totalRevenue - totalCosts

  } catch (error) {
    console.error('Error loading reports data:', error)
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
          <h1 className="text-4xl font-bold text-fiori-primary mb-4">Relatórios de Controle</h1>
          <p className="text-xl text-fiori-secondary mb-2">Análise financeira e de custos</p>
          <p className="text-lg text-fiori-muted">Relatórios detalhados para tomada de decisão</p>
        </div>
        <div className="w-20"></div>
      </div>

      {/* Resumo Executivo */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
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
              <BarChart3 className="w-8 h-8 text-fiori-danger" />
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
              <FileText className="w-8 h-8 text-fiori-primary" />
            </div>
          </div>
        </div>
      </div>

      {/* Relatórios Disponíveis */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="card-fiori">
          <div className="card-fiori-header">
            <h3 className="card-fiori-title">Relatório de Vendas</h3>
          </div>
          <div className="card-fiori-content">
            <p className="text-fiori-muted mb-4">Análise detalhada das vendas por período</p>
            <button className="btn-fiori-primary w-full flex items-center justify-center gap-2">
              <Download className="w-4 h-4" />
              Gerar Relatório
            </button>
          </div>
        </div>

        <div className="card-fiori">
          <div className="card-fiori-header">
            <h3 className="card-fiori-title">Relatório de Custos</h3>
          </div>
          <div className="card-fiori-content">
            <p className="text-fiori-muted mb-4">Análise de custos por centro de custo</p>
            <button className="btn-fiori-primary w-full flex items-center justify-center gap-2">
              <Download className="w-4 h-4" />
              Gerar Relatório
            </button>
          </div>
        </div>

        <div className="card-fiori">
          <div className="card-fiori-header">
            <h3 className="card-fiori-title">Relatório de Lucratividade</h3>
          </div>
          <div className="card-fiori-content">
            <p className="text-fiori-muted mb-4">Análise de margem e rentabilidade</p>
            <button className="btn-fiori-primary w-full flex items-center justify-center gap-2">
              <Download className="w-4 h-4" />
              Gerar Relatório
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

