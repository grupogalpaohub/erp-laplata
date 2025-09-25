import Link from 'next/link'
import { getSupabaseServerClient } from '@/lib/supabase/server'
import { getTenantId } from '@/lib/auth'
import { ArrowLeft, Search, Download, Filter, Plus, Eye, Edit, CheckCircle } from 'lucide-react'

export const dynamic = 'force-dynamic'
export const revalidate = 0
export const fetchCache = 'force-no-store'

interface Payable {
  payable_id: string
  vendor_id: string
  amount_cents: number
  due_date: string
  status: string
  reference_doc: string
  description: string
  created_at: string
  mm_vendor: {
    vendor_name: string
  }[]
}

export default async function PayablePage() {
  let payables: Payable[] = []
  let totalCount = 0

  try {
    const supabase = getSupabaseServerClient()
    const tenantId = await getTenantId()

    // Buscar contas a pagar
    const { data, count, error } = await supabase
      .from('fi_accounts_payable')
      .select(`
        payable_id,
        vendor_id,
        amount_cents,
        due_date,
        status,
        reference_doc,
        description,
        created_at,
        mm_vendor!inner(vendor_name)
      `, { count: 'exact' })
      .eq('tenant_id', tenantId)
      .order('due_date', { ascending: true })
      .limit(50)

    if (error) {
      console.error('Error loading payables:', error)
    } else {
      payables = data || []
      totalCount = count || 0
    }

  } catch (error) {
    console.error('Error loading payables:', error)
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'PENDING': return <span className="badge-fiori badge-fiori-warning">Pendente</span>
      case 'PAID': return <span className="badge-fiori badge-fiori-success">Pago</span>
      case 'OVERDUE': return <span className="badge-fiori badge-fiori-danger">Vencido</span>
      case 'CANCELLED': return <span className="badge-fiori badge-fiori-neutral">Cancelado</span>
      default: return <span className="badge-fiori badge-fiori-neutral">{status}</span>
    }
  }

  const isOverdue = (dueDate: string) => {
    return new Date(dueDate) < new Date()
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
          <h1 className="text-4xl font-bold text-fiori-primary mb-4">Contas a Pagar</h1>
          <p className="text-xl text-fiori-secondary mb-2">Gestão de obrigações financeiras</p>
          <p className="text-lg text-fiori-muted">Controle de pagamentos e vencimentos</p>
        </div>
        <div className="w-20"></div>
      </div>

      {/* Filtros e Ações */}
      <div className="card-fiori">
        <div className="card-fiori-content">
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
            <div className="flex flex-col sm:flex-row gap-4 flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-fiori-muted w-4 h-4" />
                <input
                  type="text"
                  placeholder="Buscar por fornecedor ou documento..."
                  className="input-fiori pl-10 w-full sm:w-80"
                />
              </div>
              <select className="select-fiori">
                <option value="">Todos os status</option>
                <option value="PENDING">Pendente</option>
                <option value="PAID">Pago</option>
                <option value="OVERDUE">Vencido</option>
                <option value="CANCELLED">Cancelado</option>
              </select>
              <input
                type="date"
                className="input-fiori"
                placeholder="Data de vencimento"
              />
            </div>
            <div className="flex gap-2">
              <button className="btn-fiori-outline flex items-center gap-2">
                <Filter className="w-4 h-4" />
                Filtros
              </button>
              <button className="btn-fiori-outline flex items-center gap-2">
                <Download className="w-4 h-4" />
                Exportar
              </button>
              <Link href="/fi/payable/new" className="btn-fiori-primary flex items-center gap-2">
                <Plus className="w-4 h-4" />
                Nova Conta
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Resumo */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="card-fiori">
          <div className="card-fiori-content">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-fiori-muted">Total de Contas</p>
                <p className="text-2xl font-bold text-fiori-primary">{totalCount}</p>
              </div>
              <div className="w-8 h-8 bg-fiori-primary/10 rounded-full flex items-center justify-center">
                <span className="text-fiori-primary font-bold">P</span>
              </div>
            </div>
          </div>
        </div>
        <div className="card-fiori">
          <div className="card-fiori-content">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-fiori-muted">Pendentes</p>
                <p className="text-2xl font-bold text-fiori-warning">
                  {payables.filter(p => p.status === 'PENDING').length}
                </p>
              </div>
              <div className="w-8 h-8 bg-fiori-warning/10 rounded-full flex items-center justify-center">
                <span className="text-fiori-warning font-bold">!</span>
              </div>
            </div>
          </div>
        </div>
        <div className="card-fiori">
          <div className="card-fiori-content">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-fiori-muted">Vencidas</p>
                <p className="text-2xl font-bold text-fiori-danger">
                  {payables.filter(p => isOverdue(p.due_date) && p.status === 'PENDING').length}
                </p>
              </div>
              <div className="w-8 h-8 bg-fiori-danger/10 rounded-full flex items-center justify-center">
                <span className="text-fiori-danger font-bold">!</span>
              </div>
            </div>
          </div>
        </div>
        <div className="card-fiori">
          <div className="card-fiori-content">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-fiori-muted">Valor Total</p>
                <p className="text-2xl font-bold text-fiori-info">
                  R$ {(payables.reduce((sum, p) => sum + (p.amount_cents || 0), 0) / 100).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                </p>
              </div>
              <div className="w-8 h-8 bg-fiori-info/10 rounded-full flex items-center justify-center">
                <span className="text-fiori-info font-bold">$</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tabela */}
      <div className="card-fiori">
        <div className="card-fiori-content p-0">
          {payables.length === 0 ? (
            <div className="text-center py-12">
              <div className="w-12 h-12 bg-fiori-muted/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-fiori-muted font-bold text-xl">P</span>
              </div>
              <h3 className="text-lg font-semibold text-fiori-primary mb-2">Nenhuma conta a pagar encontrada</h3>
              <p className="text-fiori-muted mb-6">Comece criando uma nova conta a pagar</p>
              <Link href="/fi/payable/new" className="btn-fiori-primary">
                Nova Conta a Pagar
              </Link>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="table-fiori">
                <thead>
                  <tr>
                    <th>Fornecedor</th>
                    <th>Descrição</th>
                    <th>Valor</th>
                    <th>Vencimento</th>
                    <th>Status</th>
                    <th>Documento</th>
                    <th>Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {payables.map((payable) => (
                    <tr key={payable.payable_id}>
                      <td>
                        <div className="font-semibold text-fiori-primary">
                          {payable.mm_vendor[0]?.vendor_name || 'N/A'}
                        </div>
                      </td>
                      <td>
                        <div className="text-sm">
                          {payable.description}
                        </div>
                      </td>
                      <td className="text-right">
                        <div className="text-sm font-semibold">
                          R$ {((payable.amount_cents || 0) / 100).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                        </div>
                      </td>
                      <td>
                        <div className={`text-sm ${isOverdue(payable.due_date) && payable.status === 'PENDING' ? 'text-fiori-danger font-semibold' : ''}`}>
                          {payable.due_date ? new Date(payable.due_date).toLocaleDateString('pt-BR') : '-'}
                        </div>
                      </td>
                      <td>
                        {getStatusBadge(payable.status)}
                      </td>
                      <td>
                        <div className="text-sm">
                          {payable.reference_doc || '-'}
                        </div>
                      </td>
                      <td>
                        <div className="flex gap-2">
                          <Link
                            href={`/fi/payable/${payable.payable_id}`}
                            className="btn-fiori-outline text-xs flex items-center gap-1"
                          >
                            <Eye className="w-3 h-3" />
                            Ver
                          </Link>
                          {payable.status === 'PENDING' && (
                            <button className="btn-fiori-outline text-xs flex items-center gap-1">
                              <CheckCircle className="w-3 h-3" />
                              Pagar
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

