import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import { requireSession } from '@/lib/auth/requireSession'
import { supabaseServer } from '@/utils/supabase/server'
import { formatBRL } from '@/lib/money'

export const dynamic = 'force-dynamic'
export const revalidate = 0
export const fetchCache = 'force-no-store'

export default async function FIPage() {
  let accounts: any[] = []
  let entries: any[] = []
  let payables: any[] = []
  let receivables: any[] = []
  let totalAssets = 0
  let totalLiabilities = 0
  let netWorth = 0
  let monthlyRevenue = 0

  try {
    await requireSession() // Verificar se está autenticado
    const supabase = supabaseServer()

    // Buscar dados para KPIs (RLS filtra automaticamente por tenant)
    const [accountsResult, entriesResult, payablesResult, receivablesResult] = await Promise.allSettled([
      supabase
        .from('fi_chart_of_accounts')
        .select('account_id, account_name, account_type'),
      supabase
        .from('fi_accounting_entry')
        .select('entry_id, description, created_at')
        .gte('created_at', new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString()),
      supabase
        .from('fi_accounts_payable')
        .select('ap_id, amount_cents, due_date, status'),
      supabase
        .from('fi_accounts_receivable')
        .select('ar_id, amount_cents, due_date, status')
    ])

    accounts = accountsResult.status === 'fulfilled' ? (accountsResult.value.data || []) : []
    entries = entriesResult.status === 'fulfilled' ? (entriesResult.value.data || []) : []
    payables = payablesResult.status === 'fulfilled' ? (payablesResult.value.data || []) : []
    receivables = receivablesResult.status === 'fulfilled' ? (receivablesResult.value.data || []) : []

    // Calcular KPIs
    totalAssets = accounts.filter(a => a.account_type === 'asset').length
    totalLiabilities = accounts.filter(a => a.account_type === 'liability').length
    netWorth = totalAssets - totalLiabilities
    monthlyRevenue = receivables.reduce((sum, item) => sum + (item.amount_cents || 0), 0)

  } catch (error) {
    console.error('Error loading FI data:', error)
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
          <h1 className="text-4xl font-bold text-fiori-primary mb-4">FI - Gestão Financeira</h1>
          <p className="text-xl text-fiori-secondary mb-2">Contas a pagar e receber</p>
          <p className="text-lg text-fiori-muted">Controle contábil e fluxo de caixa</p>
        </div>
        <div className="w-20"></div> {/* Spacer para centralizar */}
      </div>

      {/* Tiles Principais */}
      <div className="grid-fiori-3">
        <Link href="/fi/chart-of-accounts" className="group">
          <div className="tile-fiori">
            <div className="tile-fiori-icon">
              <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
            <h3 className="tile-fiori-title">Plano de Contas</h3>
            <p className="tile-fiori-subtitle">Estrutura contábil</p>
          </div>
        </Link>

        <Link href="/fi/entries" className="group">
          <div className="tile-fiori">
            <div className="tile-fiori-icon">
              <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <h3 className="tile-fiori-title">Lançamentos</h3>
            <p className="tile-fiori-subtitle">Entradas contábeis</p>
          </div>
        </Link>

        <Link href="/fi/accounts-payable" className="group">
          <div className="tile-fiori">
            <div className="tile-fiori-icon">
              <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
              </svg>
            </div>
            <h3 className="tile-fiori-title">Contas a Pagar</h3>
            <p className="tile-fiori-subtitle">Obrigações</p>
          </div>
        </Link>
      </div>

      {/* Visão Geral - KPIs */}
      <div className="grid-fiori-4">
        <div className="card-fiori">
          <div className="card-fiori-body">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-medium text-fiori-secondary">Patrimônio Líquido</h3>
              <svg className="w-5 h-5 text-fiori-success" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
              </svg>
            </div>
            <div className="space-y-2">
              <p className="kpi-fiori kpi-fiori-success">{formatBRL(netWorth)}</p>
              <p className="text-sm text-fiori-muted">Valor líquido</p>
            </div>
          </div>
        </div>

        <div className="card-fiori">
          <div className="card-fiori-body">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-medium text-fiori-secondary">Total de Ativos</h3>
              <svg className="w-5 h-5 text-fiori-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
              </svg>
            </div>
            <div className="space-y-2">
              <p className="kpi-fiori kpi-fiori-primary">{totalAssets}</p>
              <p className="text-sm text-fiori-muted">Recursos totais</p>
            </div>
          </div>
        </div>

        <div className="card-fiori">
          <div className="card-fiori-body">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-medium text-fiori-secondary">Total de Passivos</h3>
              <svg className="w-5 h-5 text-fiori-danger" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 17h8m0 0V9m0 8l-8-8-4 4-6-6" />
              </svg>
            </div>
            <div className="space-y-2">
              <p className="kpi-fiori kpi-fiori-danger">{totalLiabilities}</p>
              <p className="text-sm text-fiori-muted">Obrigações totais</p>
            </div>
          </div>
        </div>

        <div className="card-fiori">
          <div className="card-fiori-body">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-medium text-fiori-secondary">Receita do Mês</h3>
              <svg className="w-5 h-5 text-fiori-success" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
              </svg>
            </div>
            <div className="space-y-2">
              <p className="kpi-fiori kpi-fiori-success">{formatBRL(monthlyRevenue)}</p>
              <p className="text-sm text-fiori-muted">Receita do período</p>
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
                <svg className="w-5 h-5 text-fiori-danger" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                </svg>
                <h2 className="card-fiori-title">Contas a Pagar</h2>
              </div>
              <Link href="/fi/accounts-payable" className="text-fiori-primary hover:text-fiori-accent-blue text-sm font-medium transition-colors">
                Ver Todas
              </Link>
            </div>
          </div>
          <div className="card-fiori-body">
            {payables.length > 0 ? (
              <div className="space-y-3">
                {payables.slice(0, 5).map((payable) => (
                  <div key={payable.ap_id} className="flex items-center justify-between p-3 bg-fiori-secondary rounded">
                    <div>
                      <p className="text-fiori-primary font-medium">Conta #{payable.ap_id}</p>
                      <p className="text-fiori-secondary text-sm">{formatBRL(payable.amount_cents)}</p>
                    </div>
                    <span className={`text-sm font-medium ${
                      payable.status === 'paid' ? 'text-fiori-success' : 'text-fiori-danger'
                    }`}>
                      {payable.status === 'paid' ? 'Pago' : 'Pendente'}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <svg className="w-12 h-12 text-fiori-muted mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                </svg>
                <h3 className="text-lg font-medium text-fiori-secondary mb-2">Nenhuma conta a pagar</h3>
                <p className="text-fiori-muted mb-4">Não há obrigações pendentes</p>
                <Link 
                  href="/fi/accounts-payable"
                  className="btn-fiori-primary"
                >
                  Ver Contas
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
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                <h2 className="card-fiori-title">Contas a Receber</h2>
              </div>
              <Link href="/fi/accounts-receivable" className="text-fiori-primary hover:text-fiori-accent-blue text-sm font-medium transition-colors">
                Ver Todas
              </Link>
            </div>
          </div>
          <div className="card-fiori-body">
            {receivables.length > 0 ? (
              <div className="space-y-3">
                {receivables.slice(0, 5).map((receivable) => (
                  <div key={receivable.ar_id} className="flex items-center justify-between p-3 bg-fiori-secondary rounded">
                    <div>
                      <p className="text-fiori-primary font-medium">Conta #{receivable.ar_id}</p>
                      <p className="text-fiori-secondary text-sm">{formatBRL(receivable.amount_cents)}</p>
                    </div>
                    <span className={`text-sm font-medium ${
                      receivable.status === 'paid' ? 'text-fiori-success' : 'text-fiori-primary'
                    }`}>
                      {receivable.status === 'paid' ? 'Recebido' : 'Pendente'}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <svg className="w-12 h-12 text-fiori-muted mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                <h3 className="text-lg font-medium text-fiori-secondary mb-2">Nenhuma conta a receber</h3>
                <p className="text-fiori-muted mb-4">Não há recebimentos pendentes</p>
                <Link 
                  href="/fi/accounts-receivable"
                  className="btn-fiori-primary"
                >
                  Ver Contas
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
