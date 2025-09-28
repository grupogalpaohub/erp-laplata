import { supabaseServer } from '@/utils/supabase/server'
import { requireSession } from '@/lib/auth/requireSession'
import Link from 'next/link'
import { DollarSign, AlertTriangle, CheckCircle, Clock, Eye } from 'lucide-react'

export const dynamic = 'force-dynamic'
export const revalidate = 0

interface AccountsReceivable {
  ar_id: string
  tenant_id: string
  customer_id: string
  so_id: string
  amount_cents: number
  due_date: string
  status: 'PENDING' | 'PAID' | 'OVERDUE'
  created_at: string
  paid_at: string | null
  customer_name?: string
  so_number?: string
}

export default async function AccountsReceivablePage() {
  const supabase = supabaseServer()
  await requireSession()

  // Buscar contas a receber
  const { data: arData, error } = await supabase
    .from('fi_accounts_receivable')
    .select(`
      *,
      customer:crm_customer(customer_name),
      so:sd_sales_order(so_id)
    `)
    
    .order('due_date', { ascending: true })

  if (error) {
    console.error('Error fetching accounts receivable:', error)
  }

  const accountsReceivable: AccountsReceivable[] = arData || []

  // Calcular estatísticas
  const totalAmount = accountsReceivable.reduce((sum, ar) => sum + ar.amount_cents, 0)
  const pendingAmount = accountsReceivable
    .filter(ar => ar.status === 'PENDING')
    .reduce((sum, ar) => sum + ar.amount_cents, 0)
  const overdueAmount = accountsReceivable
    .filter(ar => ar.status === 'OVERDUE')
    .reduce((sum, ar) => sum + ar.amount_cents, 0)
  const paidAmount = accountsReceivable
    .filter(ar => ar.status === 'PAID')
    .reduce((sum, ar) => sum + ar.amount_cents, 0)

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'PENDING':
        return <Clock className="w-4 h-4 text-fiori-warning" />
      case 'PAID':
        return <CheckCircle className="w-4 h-4 text-fiori-success" />
      case 'OVERDUE':
        return <AlertTriangle className="w-4 h-4 text-fiori-danger" />
      default:
        return <Clock className="w-4 h-4 text-fiori-muted" />
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'PENDING':
        return 'badge-fiori-warning'
      case 'PAID':
        return 'badge-fiori-success'
      case 'OVERDUE':
        return 'badge-fiori-danger'
      default:
        return 'badge-fiori-neutral'
    }
  }

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'PENDING':
        return 'Pendente'
      case 'PAID':
        return 'Pago'
      case 'OVERDUE':
        return 'Vencido'
      default:
        return status
    }
  }

  return (
    <div className="container-fiori">
      <div className="section-fiori">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-fiori-primary">Contas a Receber</h1>
            <p className="text-fiori-secondary mt-2">Gestão de recebimentos de clientes</p>
          </div>
          <div className="flex gap-4">
            <Link href="/fi" className="btn-fiori-secondary">
              ← Voltar
            </Link>
            <Link href="/fi/accounts-receivable/new" className="btn-fiori-primary">
              Nova Conta
            </Link>
          </div>
        </div>

        {/* Estatísticas */}
        <div className="grid-fiori-4 mb-8">
          <div className="tile-fiori">
            <div className="flex items-center justify-between">
              <div>
                <p className="tile-fiori-subtitle">Total a Receber</p>
                <p className="tile-fiori-metric">
                  {formatBRL(totalAmount)}
                </p>
              </div>
              <DollarSign className="tile-fiori-icon" />
            </div>
          </div>

          <div className="tile-fiori">
            <div className="flex items-center justify-between">
              <div>
                <p className="tile-fiori-subtitle">Pendentes</p>
                <p className="tile-fiori-metric text-fiori-warning">
                  {formatBRL(pendingAmount)}
                </p>
              </div>
              <Clock className="tile-fiori-icon text-fiori-warning" />
            </div>
          </div>

          <div className="tile-fiori">
            <div className="flex items-center justify-between">
              <div>
                <p className="tile-fiori-subtitle">Vencidas</p>
                <p className="tile-fiori-metric text-fiori-danger">
                  {formatBRL(overdueAmount)}
                </p>
              </div>
              <AlertTriangle className="tile-fiori-icon text-fiori-danger" />
            </div>
          </div>

          <div className="tile-fiori">
            <div className="flex items-center justify-between">
              <div>
                <p className="tile-fiori-subtitle">Recebidas</p>
                <p className="tile-fiori-metric text-fiori-success">
                  {formatBRL(paidAmount)}
                </p>
              </div>
              <CheckCircle className="tile-fiori-icon text-fiori-success" />
            </div>
          </div>
        </div>

        {/* Tabela de Contas a Receber */}
        <div className="card-fiori">
          <div className="card-fiori-header">
            <h2 className="card-fiori-title">Contas a Receber</h2>
            <p className="card-fiori-subtitle">
              {accountsReceivable.length} contas cadastradas
            </p>
          </div>
          <div className="card-fiori-body">
            <div className="overflow-x-auto">
              <table className="table-fiori">
                <thead>
                  <tr>
                    <th>Cliente</th>
                    <th>Pedido de Venda</th>
                    <th className="text-right">Valor</th>
                    <th>Vencimento</th>
                    <th>Status</th>
                    <th>Data de Criação</th>
                    <th>Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {accountsReceivable.map((ar) => (
                    <tr key={ar.ar_id}>
                      <td>
                        <div>
                          <div className="font-medium">
                            {ar.customer_name || 'N/A'}
                          </div>
                          <div className="text-xs text-fiori-muted font-mono">
                            {ar.customer_id}
                          </div>
                        </div>
                      </td>
                      <td>
                        <div>
                          <div className="font-medium">
                            {ar.so_number || ar.so_id}
                          </div>
                          <div className="text-xs text-fiori-muted font-mono">
                            {ar.so_id}
                          </div>
                        </div>
                      </td>
                      <td className="text-right">
                        <span className="font-medium text-fiori-success">
                          {formatBRL(ar.amount_cents)}
                        </span>
                      </td>
                      <td>
                        <div className="text-sm">
                          {new Date(ar.due_date).toLocaleDateString('pt-BR')}
                        </div>
                      </td>
                      <td>
                        <div className="flex items-center gap-2">
                          {getStatusIcon(ar.status)}
                          <span className={`badge-fiori ${getStatusBadge(ar.status)}`}>
                            {getStatusLabel(ar.status)}
                          </span>
                        </div>
                      </td>
                      <td>
                        <div className="text-sm text-fiori-muted">
                          {new Date(ar.created_at).toLocaleDateString('pt-BR')}
                        </div>
                      </td>
                      <td>
                        <div className="flex gap-2">
                          <Link
                            href={`/fi/accounts-receivable/${ar.ar_id}`}
                            className="btn-fiori-outline text-xs"
                          >
                            <Eye className="w-4 h-4" />
                          </Link>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {accountsReceivable.length === 0 && (
              <div className="text-center py-12">
                <DollarSign className="w-12 h-12 text-fiori-muted mx-auto mb-4" />
                <h3 className="text-lg font-medium text-fiori-muted mb-2">
                  Nenhuma conta a receber encontrada
                </h3>
                <p className="text-fiori-muted mb-4">
                  As contas a receber são criadas automaticamente quando pedidos de venda são expedidos.
                </p>
                <Link href="/sd" className="btn-fiori-primary">
                  Ver Pedidos de Venda
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

