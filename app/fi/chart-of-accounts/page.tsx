import { getSupabaseServerClient } from '@/lib/supabase/server'
import { getTenantId } from '@/lib/auth'
import Link from 'next/link'
import { BookOpen, Plus, Edit, Eye } from 'lucide-react'

export const dynamic = 'force-dynamic'
export const revalidate = 0

interface ChartOfAccounts {
  account_code: string
  account_name: string
  account_type: 'ASSET' | 'LIABILITY' | 'EQUITY' | 'REVENUE' | 'EXPENSE'
  parent_code: string | null
  is_active: boolean
  balance_cents: number
  tenant_id: string
}

export default async function ChartOfAccountsPage() {
  const supabase = getSupabaseServerClient()
  const tenantId = await getTenantId()

  // Buscar plano de contas
  const { data: accountsData, error } = await supabase
    .from('fi_chart_of_accounts')
    .select('*')
    .eq('tenant_id', tenantId)
    .order('account_code')

  if (error) {
    console.error('Error fetching chart of accounts:', error)
  }

  const accounts: ChartOfAccounts[] = accountsData || []

  // Agrupar por tipo
  const accountsByType = accounts.reduce((acc, account) => {
    if (!acc[account.account_type]) {
      acc[account.account_type] = []
    }
    acc[account.account_type].push(account)
    return acc
  }, {} as Record<string, ChartOfAccounts[]>)

  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'ASSET': return 'Ativos'
      case 'LIABILITY': return 'Passivos'
      case 'EQUITY': return 'Patrimônio Líquido'
      case 'REVENUE': return 'Receitas'
      case 'EXPENSE': return 'Despesas'
      default: return type
    }
  }

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'ASSET': return 'text-fiori-success'
      case 'LIABILITY': return 'text-fiori-danger'
      case 'EQUITY': return 'text-fiori-info'
      case 'REVENUE': return 'text-fiori-warning'
      case 'EXPENSE': return 'text-fiori-muted'
      default: return 'text-fiori-muted'
    }
  }

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'ASSET': return '💰'
      case 'LIABILITY': return '📋'
      case 'EQUITY': return '🏛️'
      case 'REVENUE': return '📈'
      case 'EXPENSE': return '📉'
      default: return '📄'
    }
  }

  return (
    <div className="container-fiori">
      <div className="section-fiori">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-fiori-primary">Plano de Contas</h1>
            <p className="text-fiori-secondary mt-2">Estrutura contábil da empresa</p>
          </div>
          <div className="flex gap-4">
            <Link href="/fi" className="btn-fiori-secondary">
              ← Voltar
            </Link>
            <Link href="/fi/chart-of-accounts/new" className="btn-fiori-primary">
              <Plus className="w-4 h-4 mr-2" />
              Nova Conta
            </Link>
          </div>
        </div>

        {/* Resumo por Tipo */}
        <div className="grid-fiori-5 mb-8">
          {Object.entries(accountsByType).map(([type, typeAccounts]) => {
            const totalBalance = typeAccounts.reduce((sum, acc) => sum + (acc.balance_cents || 0), 0)
            return (
              <div key={type} className="tile-fiori">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="tile-fiori-subtitle">{getTypeLabel(type)}</p>
                    <p className="tile-fiori-metric">
                      R$ {(totalBalance / 100).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                    </p>
                    <p className="text-xs text-fiori-muted mt-1">
                      {typeAccounts.length} contas
                    </p>
                  </div>
                  <span className="text-2xl">{getTypeIcon(type)}</span>
                </div>
              </div>
            )
          })}
        </div>

        {/* Lista de Contas por Tipo */}
        {Object.entries(accountsByType).map(([type, typeAccounts]) => (
          <div key={type} className="card-fiori mb-6">
            <div className="card-fiori-header">
              <h2 className="card-fiori-title">
                {getTypeIcon(type)} {getTypeLabel(type)}
              </h2>
              <p className="card-fiori-subtitle">
                {typeAccounts.length} contas
              </p>
            </div>
            <div className="card-fiori-body">
              <div className="overflow-x-auto">
                <table className="table-fiori">
                  <thead>
                    <tr>
                      <th>Código</th>
                      <th>Nome da Conta</th>
                      <th>Conta Pai</th>
                      <th className="text-right">Saldo</th>
                      <th>Status</th>
                      <th>Ações</th>
                    </tr>
                  </thead>
                  <tbody>
                    {typeAccounts.map((account) => (
                      <tr key={account.account_code}>
                        <td>
                          <span className="font-mono text-sm text-fiori-primary">
                            {account.account_code}
                          </span>
                        </td>
                        <td>
                          <div className="font-medium">
                            {account.account_name}
                          </div>
                        </td>
                        <td>
                          <span className="text-sm text-fiori-muted">
                            {account.parent_code || '-'}
                          </span>
                        </td>
                        <td className="text-right">
                          <span className={`font-medium ${
                            account.balance_cents >= 0 ? 'text-fiori-success' : 'text-fiori-danger'
                          }`}>
                            R$ {(account.balance_cents / 100).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                          </span>
                        </td>
                        <td>
                          <span className={`badge-fiori ${
                            account.is_active ? 'badge-fiori-success' : 'badge-fiori-neutral'
                          }`}>
                            {account.is_active ? 'Ativa' : 'Inativa'}
                          </span>
                        </td>
                        <td>
                          <div className="flex gap-2">
                            <Link
                              href={`/fi/chart-of-accounts/${account.account_code}`}
                              className="btn-fiori-outline text-xs"
                            >
                              <Eye className="w-4 h-4" />
                            </Link>
                            <Link
                              href={`/fi/chart-of-accounts/${account.account_code}/edit`}
                              className="btn-fiori-outline text-xs"
                            >
                              <Edit className="w-4 h-4" />
                            </Link>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        ))}

        {accounts.length === 0 && (
          <div className="text-center py-12">
            <BookOpen className="w-12 h-12 text-fiori-muted mx-auto mb-4" />
            <h3 className="text-lg font-medium text-fiori-muted mb-2">
              Nenhuma conta cadastrada
            </h3>
            <p className="text-fiori-muted mb-4">
              Comece criando o plano de contas da sua empresa.
            </p>
            <Link href="/fi/chart-of-accounts/new" className="btn-fiori-primary">
              <Plus className="w-4 h-4 mr-2" />
              Criar Primeira Conta
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}

