import Link from 'next/link'
import { ArrowLeft, DollarSign, TrendingUp, TrendingDown, BarChart3, CreditCard, Receipt, Calculator } from 'lucide-react'
import { createSupabaseServerClient } from '@/lib/supabaseServer'
import { getTenantId } from '@/lib/auth'
import { formatBRL } from '@/lib/money'
import TileCard from '@/components/ui/TileCard'
import KpiCard from '@/components/ui/KpiCard'
import ListSection from '@/components/ui/ListSection'

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
    const supabase = createSupabaseServerClient()
    const tenantId = await getTenantId()

    // Buscar dados para KPIs
    const [accountsResult, entriesResult, payablesResult, receivablesResult] = await Promise.allSettled([
      supabase
        .from('fi_chart_of_accounts')
        .select('account_id, account_name, account_type')
        .eq('tenant_id', tenantId),
      supabase
        .from('fi_accounting_entry')
        .select('entry_id, description, created_at')
        .eq('tenant_id', tenantId)
        .gte('created_at', new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString()),
      supabase
        .from('fi_accounts_payable')
        .select('ap_id, amount_cents, due_date, status')
        .eq('tenant_id', tenantId),
      supabase
        .from('fi_accounts_receivable')
        .select('ar_id, amount_cents, due_date, status')
        .eq('tenant_id', tenantId)
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
              <h1 className="text-xl font-semibold text-white">FI - Gestão Financeira</h1>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Title Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-white mb-4">FI - Gestão Financeira</h1>
          <p className="text-xl text-gray-300 mb-2">Contas a pagar e receber</p>
          <p className="text-lg text-gray-400">Controle contábil e fluxo de caixa</p>
        </div>

        {/* Tiles Principais */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          <TileCard
            title="Plano de Contas"
            subtitle="Estrutura contábil"
            iconName="BarChart3"
            href="/fi/chart-of-accounts"
            color="blue"
          />
          
          <TileCard
            title="Lançamentos"
            subtitle="Entradas contábeis"
            iconName="Receipt"
            href="/fi/entries"
            color="green"
          />
          
          <TileCard
            title="Contas a Pagar"
            subtitle="Obrigações"
            iconName="CreditCard"
            href="/fi/accounts-payable"
            color="red"
          />
        </div>

        {/* Visão Geral - KPIs */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          <KpiCard
            title="Patrimônio Líquido"
            value={formatBRL(netWorth)}
            subtitle="Valor líquido"
            iconName="DollarSign"
            color="green"
          />
          
          <KpiCard
            title="Total de Ativos"
            value={totalAssets}
            subtitle="Recursos totais"
            iconName="TrendingUp"
            color="blue"
          />
          
          <KpiCard
            title="Total de Passivos"
            value={totalLiabilities}
            subtitle="Obrigações totais"
            iconName="TrendingDown"
            color="red"
          />
          
          <KpiCard
            title="Receita do Mês"
            value={formatBRL(monthlyRevenue)}
            subtitle="Receita do período"
            iconName="Calculator"
            color="green"
          />
        </div>

        {/* Seções de Listagem */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <ListSection
            title="Contas a Pagar"
            viewAllHref="/fi/accounts-payable"
            viewAllText="Ver Todas"
            iconName="CreditCard"
            emptyState={{
              iconName: "CreditCard",
              title: "Nenhuma conta a pagar",
              description: "Não há obrigações pendentes",
              actionText: "Ver Contas",
              actionHref: "/fi/accounts-payable"
            }}
          >
            {payables.length > 0 ? (
              <div className="space-y-3">
                {payables.slice(0, 5).map((payable) => (
                  <div key={payable.ap_id} className="flex items-center justify-between p-3 bg-gray-700 rounded-lg">
                    <div>
                      <p className="text-white font-medium">Conta #{payable.ap_id}</p>
                      <p className="text-gray-400 text-sm">{formatBRL(payable.amount_cents)}</p>
                    </div>
                    <span className={`text-sm font-medium ${
                      payable.status === 'paid' ? 'text-green-400' : 'text-red-400'
                    }`}>
                      {payable.status === 'paid' ? 'Pago' : 'Pendente'}
                    </span>
                  </div>
                ))}
              </div>
            ) : null}
          </ListSection>

          <ListSection
            title="Contas a Receber"
            viewAllHref="/fi/accounts-receivable"
            viewAllText="Ver Todas"
            iconName="Receipt"
            emptyState={{
              iconName: "Receipt",
              title: "Nenhuma conta a receber",
              description: "Não há recebimentos pendentes",
              actionText: "Ver Contas",
              actionHref: "/fi/accounts-receivable"
            }}
          >
            {receivables.length > 0 ? (
              <div className="space-y-3">
                {receivables.slice(0, 5).map((receivable) => (
                  <div key={receivable.ar_id} className="flex items-center justify-between p-3 bg-gray-700 rounded-lg">
                    <div>
                      <p className="text-white font-medium">Conta #{receivable.ar_id}</p>
                      <p className="text-gray-400 text-sm">{formatBRL(receivable.amount_cents)}</p>
                    </div>
                    <span className={`text-sm font-medium ${
                      receivable.status === 'paid' ? 'text-green-400' : 'text-blue-400'
                    }`}>
                      {receivable.status === 'paid' ? 'Recebido' : 'Pendente'}
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