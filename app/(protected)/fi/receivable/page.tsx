import Link from 'next/link'
import { supabaseServerReadOnly } from '@/lib/supabase/server-readonly'
import { requireSession } from '@/lib/auth/requireSession'
import { ArrowLeft, Search, Download, Filter, Plus, Eye, Edit, CheckCircle } from 'lucide-react'

export const dynamic = 'force-dynamic'
export const revalidate = 0
export const fetchCache = 'force-no-store'

interface Receivable {
  receivable_id: string
  customer_id: string
  amount_cents: number
  due_date: string
  status: string
  reference_doc: string
  description: string
  created_at: string
  crm_customer: {
    name: string
  }[]
}

export default async function ReceivablePage() {
  let receivables: Receivable[] = []
  let totalCount = 0

  try {
    const supabase = supabaseServerReadOnly()
    if (process.env.NODE_ENV === 'production') { if (process.env.NODE_ENV === 'production') { await requireSession() } }

    // Buscar contas a receber
    const { data, count, error } = await supabase
      .from('fi_accounts_receivable')
      .select(`
        receivable_id,
        customer_id,
        amount_cents,
        due_date,
        status,
        reference_doc,
        description,
        created_at,
        crm_customer!inner(name)
      `, { count: 'exact' })
      
      .order('due_date', { ascending: true })
      .limit(50)

    if (error) {
      console.error('Error loading receivables:', error)
    } else {
      receivables = data || []
      totalCount = count || 0
    }

  } catch (error) {
    console.error('Error loading receivables:', error)
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'PENDING': return <span className="badge-fiori badge-fiori-warning">Pendente</span>
      case 'RECEIVED': return <span className="badge-fiori badge-fiori-success">Recebido</span>
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
          <h1 className="text-4xl font-bold text-fiori-primary mb-4">Contas a Receber</h1>
          <p className="text-xl text-fiori-secondary mb-2">Gestão de recebimentos</p>
          <p className="text-lg text-fiori-muted">Controle de recebimentos e vencimentos</p>
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
                  placeholder="Buscar por cliente ou documento..."
                  className="input-fiori pl-10 w-full sm:w-80"
                />
              </div>
              <select className="select-fiori">
                <option value="">Todos os status</option>
                <option value="PENDING">Pendente</option>
                <option value="RECEIVED">Recebido</option>
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
              <Link href="/fi/receivable/new" className="btn-fiori-primary flex items-center gap-2">
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
                <span className="text-fiori-primary font-bold">R</span>
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
                  {receivables.filter(r => r.status === 'PENDING').length}
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
                  {receivables.filter(r => isOverdue(r.due_date) && r.status === 'PENDING').length}
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
                  R$ {(receivables.reduce((sum, r) => sum + (r.amount_cents || 0), 0) / 100).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
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
          {receivables.length === 0 ? (
            <div className="text-center py-12">
              <div className="w-12 h-12 bg-fiori-muted/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-fiori-muted font-bold text-xl">R</span>
              </div>
              <h3 className="text-lg font-semibold text-fiori-primary mb-2">Nenhuma conta a receber encontrada</h3>
              <p className="text-fiori-muted mb-6">Comece criando uma nova conta a receber</p>
              <Link href="/fi/receivable/new" className="btn-fiori-primary">
                Nova Conta a Receber
              </Link>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="table-fiori">
                <thead>
                  <tr>
                    <th>Cliente</th>
                    <th>Descrição</th>
                    <th>Valor</th>
                    <th>Vencimento</th>
                    <th>Status</th>
                    <th>Documento</th>
                    <th>Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {receivables.map((receivable) => (
                    <tr key={receivable.receivable_id}>
                      <td>
                        <div className="font-semibold text-fiori-primary">
                          {receivable.crm_customer[0]?.name || 'N/A'}
                        </div>
                      </td>
                      <td>
                        <div className="text-sm">
                          {receivable.description}
                        </div>
                      </td>
                      <td className="text-right">
                        <div className="text-sm font-semibold">
                          R$ {((receivable.amount_cents || 0) / 100).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                        </div>
                      </td>
                      <td>
                        <div className={`text-sm ${isOverdue(receivable.due_date) && receivable.status === 'PENDING' ? 'text-fiori-danger font-semibold' : ''}`}>
                          {receivable.due_date ? new Date(receivable.due_date).toLocaleDateString('pt-BR') : '-'}
                        </div>
                      </td>
                      <td>
                        {getStatusBadge(receivable.status)}
                      </td>
                      <td>
                        <div className="text-sm">
                          {receivable.reference_doc || '-'}
                        </div>
                      </td>
                      <td>
                        <div className="flex gap-2">
                          <Link
                            href={`/fi/receivable/${receivable.receivable_id}`}
                            className="btn-fiori-outline text-xs flex items-center gap-1"
                          >
                            <Eye className="w-3 h-3" />
                            Ver
                          </Link>
                          {receivable.status === 'PENDING' && (
                            <button className="btn-fiori-outline text-xs flex items-center gap-1">
                              <CheckCircle className="w-3 h-3" />
                              Receber
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


