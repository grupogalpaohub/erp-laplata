import { createSupabaseServerClient } from '@/lib/supabaseServer'
import { getTenantId } from '@/lib/auth'
import Link from 'next/link'
import { CreditCard, AlertTriangle, CheckCircle, Clock } from 'lucide-react'

export const dynamic = 'force-dynamic'
export const revalidate = 0

interface AccountsPayable {
  ap_id: string
  tenant_id: string
  vendor_id: string
  po_id: string
  amount_cents: number
  due_date: string
  status: 'PENDING' | 'PAID' | 'OVERDUE'
  created_at: string
  paid_at: string | null
  vendor_name?: string
  po_number?: string
}

export default async function AccountsPayablePage() {
  const supabase = createSupabaseServerClient()
  const tenantId = await getTenantId()

  // Buscar contas a pagar
  const { data: apData, error } = await supabase
    .from('fi_accounts_payable')
    .select(`
      *,
      vendor:mm_vendor(vendor_name),
      po:mm_purchase_order(po_id)
    `)
    .eq('tenant_id', tenantId)
    .order('due_date', { ascending: true })

  if (error) {
    console.error('Error fetching accounts payable:', error)
  }

  const accountsPayable: AccountsPayable[] = apData || []

  // Calcular estatísticas
  const totalAmount = accountsPayable.reduce((sum, ap) => sum + ap.amount_cents, 0)
  const pendingAmount = accountsPayable
    .filter(ap => ap.status === 'PENDING')
    .reduce((sum, ap) => sum + ap.amount_cents, 0)
  const overdueAmount = accountsPayable
    .filter(ap => ap.status === 'OVERDUE')
    .reduce((sum, ap) => sum + ap.amount_cents, 0)
  const paidAmount = accountsPayable
    .filter(ap => ap.status === 'PAID')
    .reduce((sum, ap) => sum + ap.amount_cents, 0)

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
            <h1 className="text-3xl font-bold text-fiori-primary">Contas a Pagar</h1>
            <p className="text-fiori-secondary mt-2">Gestão de obrigações com fornecedores</p>
          </div>
          <div className="flex gap-4">
            <Link href="/fi" className="btn-fiori-secondary">
              ← Voltar
            </Link>
            <Link href="/fi/accounts-payable/new" className="btn-fiori-primary">
              Nova Conta
            </Link>
          </div>
        </div>

        {/* Estatísticas */}
        <div className="grid-fiori-4 mb-8">
          <div className="tile-fiori">
            <div className="flex items-center justify-between">
              <div>
                <p className="tile-fiori-subtitle">Total a Pagar</p>
                <p className="tile-fiori-metric">
                  R$ {(totalAmount / 100).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                </p>
              </div>
              <CreditCard className="tile-fiori-icon" />
            </div>
          </div>

          <div className="tile-fiori">
            <div className="flex items-center justify-between">
              <div>
                <p className="tile-fiori-subtitle">Pendentes</p>
                <p className="tile-fiori-metric text-fiori-warning">
                  R$ {(pendingAmount / 100).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
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
                  R$ {(overdueAmount / 100).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                </p>
              </div>
              <AlertTriangle className="tile-fiori-icon text-fiori-danger" />
            </div>
          </div>

          <div className="tile-fiori">
            <div className="flex items-center justify-between">
              <div>
                <p className="tile-fiori-subtitle">Pagas</p>
                <p className="tile-fiori-metric text-fiori-success">
                  R$ {(paidAmount / 100).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                </p>
              </div>
              <CheckCircle className="tile-fiori-icon text-fiori-success" />
            </div>
          </div>
        </div>

        {/* Tabela de Contas a Pagar */}
        <div className="card-fiori">
          <div className="card-fiori-header">
            <h2 className="card-fiori-title">Contas a Pagar</h2>
            <p className="card-fiori-subtitle">
              {accountsPayable.length} contas cadastradas
            </p>
          </div>
          <div className="card-fiori-body">
            <div className="overflow-x-auto">
              <table className="table-fiori">
                <thead>
                  <tr>
                    <th>Fornecedor</th>
                    <th>Pedido de Compra</th>
                    <th className="text-right">Valor</th>
                    <th>Vencimento</th>
                    <th>Status</th>
                    <th>Data de Criação</th>
                    <th>Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {accountsPayable.map((ap) => (
                    <tr key={ap.ap_id}>
                      <td>
                        <div>
                          <div className="font-medium">
                            {ap.vendor_name || 'N/A'}
                          </div>
                          <div className="text-xs text-fiori-muted font-mono">
                            {ap.vendor_id}
                          </div>
                        </div>
                      </td>
                      <td>
                        <div>
                          <div className="font-medium">
                            {ap.po_number || ap.po_id}
                          </div>
                          <div className="text-xs text-fiori-muted font-mono">
                            {ap.po_id}
                          </div>
                        </div>
                      </td>
                      <td className="text-right">
                        <span className="font-medium text-fiori-danger">
                          R$ {(ap.amount_cents / 100).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                        </span>
                      </td>
                      <td>
                        <div className="text-sm">
                          {new Date(ap.due_date).toLocaleDateString('pt-BR')}
                        </div>
                      </td>
                      <td>
                        <div className="flex items-center gap-2">
                          {getStatusIcon(ap.status)}
                          <span className={`badge-fiori ${getStatusBadge(ap.status)}`}>
                            {getStatusLabel(ap.status)}
                          </span>
                        </div>
                      </td>
                      <td>
                        <div className="text-sm text-fiori-muted">
                          {new Date(ap.created_at).toLocaleDateString('pt-BR')}
                        </div>
                      </td>
                      <td>
                        <div className="flex gap-2">
                          <Link
                            href={`/fi/accounts-payable/${ap.ap_id}`}
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

            {accountsPayable.length === 0 && (
              <div className="text-center py-12">
                <CreditCard className="w-12 h-12 text-fiori-muted mx-auto mb-4" />
                <h3 className="text-lg font-medium text-fiori-muted mb-2">
                  Nenhuma conta a pagar encontrada
                </h3>
                <p className="text-fiori-muted mb-4">
                  As contas a pagar são criadas automaticamente quando pedidos de compra são recebidos.
                </p>
                <Link href="/mm/purchases" className="btn-fiori-primary">
                  Ver Pedidos de Compra
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
