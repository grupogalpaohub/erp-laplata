import Link from 'next/link'
import { supabaseServer } from '@/lib/supabase/server'
import { requireSession } from '@/lib/auth/requireSession'
import { formatBRL } from '@/lib/money'
import { ArrowLeft, TrendingUp, TrendingDown, DollarSign, BarChart3 } from 'lucide-react'

export const dynamic = 'force-dynamic'
export const revalidate = 0
export const fetchCache = 'force-no-store'

export default async function FIDashboardPage() {
  let totalRevenue = 0
  let totalPayables = 0
  let totalReceivables = 0
  let netCashFlow = 0
  let recentEntries: any[] = []

  try {
    const supabase = supabaseServer()
    await requireSession()

    // Buscar dados para KPIs
    const [revenueResult, payablesResult, receivablesResult, entriesResult] = await Promise.allSettled([
      supabase
        .from('sd_sales_order')
        .select('total_final_cents')
        
        .eq('status', 'CONFIRMED'),
      supabase
        .from('fi_accounts_payable')
        .select('amount_cents')
        
        .eq('status', 'PENDING'),
      supabase
        .from('fi_accounts_receivable')
        .select('amount_cents')
        
        .eq('status', 'PENDING'),
      supabase
        .from('fi_financial_entry')
        .select('entry_id, description, amount_cents, entry_type, entry_date')
        
        .order('entry_date', { ascending: false })
        .limit(5)
    ])

    if (revenueResult.status === 'fulfilled') {
      const revenue = revenueResult.value.data || []
      totalRevenue = revenue.reduce((sum: number, order: any) => sum + (order.total_final_cents || 0), 0)
    }

    if (payablesResult.status === 'fulfilled') {
      const payables = payablesResult.value.data || []
      totalPayables = payables.reduce((sum: number, payable: any) => sum + (payable.amount_cents || 0), 0)
    }

    if (receivablesResult.status === 'fulfilled') {
      const receivables = receivablesResult.value.data || []
      totalReceivables = receivables.reduce((sum: number, receivable: any) => sum + (receivable.amount_cents || 0), 0)
    }

    if (entriesResult.status === 'fulfilled') {
      recentEntries = entriesResult.value.data || []
    }

    netCashFlow = totalReceivables - totalPayables

  } catch (error) {
    console.error('Error loading FI dashboard data:', error)
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <Link href="/fi" className="btn-fiori-outline flex items-center gap-2">
          <ArrowLeft className="w-4 h-4" />
          Voltar
        </Link>
        <div className="text-center flex-1">
          <h1 className="text-4xl font-bold text-fiori-primary mb-4">Dashboard Financeiro</h1>
          <p className="text-xl text-fiori-secondary mb-2">Visão geral financeira</p>
          <p className="text-lg text-fiori-muted">Acompanhe a situação financeira da empresa</p>
        </div>
        <div className="w-20"></div>
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
                <p className="text-sm text-fiori-muted">Contas a Pagar</p>
                <p className="text-2xl font-bold text-fiori-danger">
                  R$ {(totalPayables / 100).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
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
                <p className="text-sm text-fiori-muted">Contas a Receber</p>
                <p className="text-2xl font-bold text-fiori-info">
                  R$ {(totalReceivables / 100).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                </p>
              </div>
              <DollarSign className="w-8 h-8 text-fiori-info" />
            </div>
          </div>
        </div>

        <div className="card-fiori">
          <div className="card-fiori-content">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-fiori-muted">Fluxo de Caixa Líquido</p>
                <p className={`text-2xl font-bold ${netCashFlow >= 0 ? 'text-fiori-success' : 'text-fiori-danger'}`}>
                  R$ {(netCashFlow / 100).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                </p>
              </div>
              <BarChart3 className="w-8 h-8 text-fiori-primary" />
            </div>
          </div>
        </div>
      </div>

      {/* Análise e Relatórios */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Lançamentos Recentes */}
        <div className="card-fiori">
          <div className="card-fiori-header">
            <h3 className="card-fiori-title">Lançamentos Recentes</h3>
          </div>
          <div className="card-fiori-content">
            {recentEntries.length === 0 ? (
              <div className="text-center py-8">
                <BarChart3 className="w-12 h-12 text-fiori-muted mx-auto mb-4" />
                <p className="text-fiori-muted">Nenhum lançamento encontrado</p>
              </div>
            ) : (
              <div className="space-y-4">
                {recentEntries.map((entry) => (
                  <div key={entry.entry_id} className="flex items-center justify-between p-3 bg-fiori-surface rounded-lg">
                    <div>
                      <p className="font-semibold text-fiori-primary">{entry.description}</p>
                      <p className="text-sm text-fiori-muted">
                        {entry.entry_date ? new Date(entry.entry_date).toLocaleDateString('pt-BR') : 'N/A'} • {entry.entry_type}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-fiori-primary">
                        R$ {((entry.amount_cents || 0) / 100).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
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
                <span className="text-fiori-muted">Saldo Disponível</span>
                <span className={`font-semibold ${netCashFlow >= 0 ? 'text-fiori-success' : 'text-fiori-danger'}`}>
                  R$ {(netCashFlow / 100).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-fiori-muted">Razão Receb./Pagar</span>
                <span className="font-semibold text-fiori-info">
                  {totalPayables > 0 ? formatBRL(Math.round((totalReceivables / totalPayables) * 100)) : 'N/A'}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-fiori-muted">Status Financeiro</span>
                <span className={`font-semibold ${netCashFlow >= 0 ? 'text-fiori-success' : 'text-fiori-danger'}`}>
                  {netCashFlow >= 0 ? 'Positivo' : 'Atenção'}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-fiori-muted">Margem de Segurança</span>
                <span className="font-semibold text-fiori-warning">
                  {totalReceivables > 0 ? (((totalReceivables - totalPayables) / totalReceivables) * 100).toFixed(1) : 0}%
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Ações Rápidas */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Link href="/fi/entries" className="card-fiori hover:shadow-lg transition-shadow">
          <div className="card-fiori-content">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-fiori-primary/10 rounded-full flex items-center justify-center">
                <BarChart3 className="w-6 h-6 text-fiori-primary" />
              </div>
              <div>
                <h3 className="font-semibold text-fiori-primary">Lançamentos</h3>
                <p className="text-sm text-fiori-muted">Gerencie lançamentos financeiros</p>
              </div>
            </div>
          </div>
        </Link>

        <Link href="/fi/payable" className="card-fiori hover:shadow-lg transition-shadow">
          <div className="card-fiori-content">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-fiori-danger/10 rounded-full flex items-center justify-center">
                <TrendingDown className="w-6 h-6 text-fiori-danger" />
              </div>
              <div>
                <h3 className="font-semibold text-fiori-primary">Contas a Pagar</h3>
                <p className="text-sm text-fiori-muted">Controle de obrigações</p>
              </div>
            </div>
          </div>
        </Link>

        <Link href="/fi/receivable" className="card-fiori hover:shadow-lg transition-shadow">
          <div className="card-fiori-content">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-fiori-success/10 rounded-full flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-fiori-success" />
              </div>
              <div>
                <h3 className="font-semibold text-fiori-primary">Contas a Receber</h3>
                <p className="text-sm text-fiori-muted">Controle de recebimentos</p>
              </div>
            </div>
          </div>
        </Link>
      </div>
    </div>
  )
}

