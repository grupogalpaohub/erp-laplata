import Link from 'next/link'
import { supabaseServer } from '@/src/lib/supabaseServer'
import { getTenantId } from '@/src/lib/auth'
import { ArrowLeft, Search, Download, Filter, Plus, Eye, Edit, Trash2 } from 'lucide-react'

export const dynamic = 'force-dynamic'
export const revalidate = 0
export const fetchCache = 'force-no-store'

interface FinancialEntry {
  entry_id: string
  entry_date: string
  description: string
  debit_account: string
  credit_account: string
  amount_cents: number
  entry_type: string
  reference_doc: string
  is_reversed: boolean
  created_at: string
}

export default async function EntriesPage() {
  let entries: FinancialEntry[] = []
  let totalCount = 0

  try {
    const supabase = supabaseServer()
    const tenantId = await getTenantId()

    // Buscar lançamentos financeiros
    const { data, count, error } = await supabase
      .from('fi_financial_entry')
      .select(`
        entry_id,
        entry_date,
        description,
        debit_account,
        credit_account,
        amount_cents,
        entry_type,
        reference_doc,
        is_reversed,
        created_at
      `, { count: 'exact' })
      .eq('tenant_id', tenantId)
      .order('entry_date', { ascending: false })
      .limit(50)

    if (error) {
      console.error('Error loading financial entries:', error)
    } else {
      entries = data || []
      totalCount = count || 0
    }

  } catch (error) {
    console.error('Error loading financial entries:', error)
  }

  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'SALE': return 'Venda'
      case 'PURCHASE': return 'Compra'
      case 'PAYMENT': return 'Pagamento'
      case 'RECEIPT': return 'Recebimento'
      case 'TRANSFER': return 'Transferência'
      case 'ADJUSTMENT': return 'Ajuste'
      default: return type
    }
  }

  const getTypeBadge = (type: string) => {
    switch (type) {
      case 'SALE': return <span className="badge-fiori badge-fiori-success">Venda</span>
      case 'PURCHASE': return <span className="badge-fiori badge-fiori-danger">Compra</span>
      case 'PAYMENT': return <span className="badge-fiori badge-fiori-warning">Pagamento</span>
      case 'RECEIPT': return <span className="badge-fiori badge-fiori-info">Recebimento</span>
      case 'TRANSFER': return <span className="badge-fiori badge-fiori-neutral">Transferência</span>
      case 'ADJUSTMENT': return <span className="badge-fiori badge-fiori-neutral">Ajuste</span>
      default: return <span className="badge-fiori badge-fiori-neutral">{type}</span>
    }
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
          <h1 className="text-4xl font-bold text-fiori-primary mb-4">Lançamentos Financeiros</h1>
          <p className="text-xl text-fiori-secondary mb-2">Registro de movimentações financeiras</p>
          <p className="text-lg text-fiori-muted">Gerencie todos os lançamentos contábeis</p>
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
                  placeholder="Buscar por descrição ou documento..."
                  className="input-fiori pl-10 w-full sm:w-80"
                />
              </div>
              <select className="select-fiori">
                <option value="">Todos os tipos</option>
                <option value="SALE">Venda</option>
                <option value="PURCHASE">Compra</option>
                <option value="PAYMENT">Pagamento</option>
                <option value="RECEIPT">Recebimento</option>
                <option value="TRANSFER">Transferência</option>
                <option value="ADJUSTMENT">Ajuste</option>
              </select>
              <input
                type="date"
                className="input-fiori"
                placeholder="Data inicial"
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
              <Link href="/fi/entries/new" className="btn-fiori-primary flex items-center gap-2">
                <Plus className="w-4 h-4" />
                Novo Lançamento
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
                <p className="text-sm text-fiori-muted">Total de Lançamentos</p>
                <p className="text-2xl font-bold text-fiori-primary">{totalCount}</p>
              </div>
              <div className="w-8 h-8 bg-fiori-primary/10 rounded-full flex items-center justify-center">
                <span className="text-fiori-primary font-bold">L</span>
              </div>
            </div>
          </div>
        </div>
        <div className="card-fiori">
          <div className="card-fiori-content">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-fiori-muted">Vendas</p>
                <p className="text-2xl font-bold text-fiori-success">
                  {entries.filter(e => e.entry_type === 'SALE').length}
                </p>
              </div>
              <div className="w-8 h-8 bg-fiori-success/10 rounded-full flex items-center justify-center">
                <span className="text-fiori-success font-bold">V</span>
              </div>
            </div>
          </div>
        </div>
        <div className="card-fiori">
          <div className="card-fiori-content">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-fiori-muted">Compras</p>
                <p className="text-2xl font-bold text-fiori-danger">
                  {entries.filter(e => e.entry_type === 'PURCHASE').length}
                </p>
              </div>
              <div className="w-8 h-8 bg-fiori-danger/10 rounded-full flex items-center justify-center">
                <span className="text-fiori-danger font-bold">C</span>
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
                  R$ {(entries.reduce((sum, e) => sum + (e.amount_cents || 0), 0) / 100).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
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
          {entries.length === 0 ? (
            <div className="text-center py-12">
              <div className="w-12 h-12 bg-fiori-muted/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-fiori-muted font-bold text-xl">L</span>
              </div>
              <h3 className="text-lg font-semibold text-fiori-primary mb-2">Nenhum lançamento encontrado</h3>
              <p className="text-fiori-muted mb-6">Comece criando um novo lançamento financeiro</p>
              <Link href="/fi/entries/new" className="btn-fiori-primary">
                Novo Lançamento
              </Link>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="table-fiori">
                <thead>
                  <tr>
                    <th>Data</th>
                    <th>Descrição</th>
                    <th>Tipo</th>
                    <th>Débito</th>
                    <th>Crédito</th>
                    <th>Valor</th>
                    <th>Documento</th>
                    <th>Status</th>
                    <th>Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {entries.map((entry) => (
                    <tr key={entry.entry_id}>
                      <td>
                        <div className="text-sm">
                          {entry.entry_date ? new Date(entry.entry_date).toLocaleDateString('pt-BR') : '-'}
                        </div>
                      </td>
                      <td>
                        <div className="font-semibold text-fiori-primary">
                          {entry.description}
                        </div>
                      </td>
                      <td>
                        {getTypeBadge(entry.entry_type)}
                      </td>
                      <td>
                        <div className="text-sm font-mono">
                          {entry.debit_account}
                        </div>
                      </td>
                      <td>
                        <div className="text-sm font-mono">
                          {entry.credit_account}
                        </div>
                      </td>
                      <td className="text-right">
                        <div className="text-sm font-semibold">
                          R$ {((entry.amount_cents || 0) / 100).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                        </div>
                      </td>
                      <td>
                        <div className="text-sm">
                          {entry.reference_doc || '-'}
                        </div>
                      </td>
                      <td>
                        {entry.is_reversed ? 
                          <span className="badge-fiori badge-fiori-danger">Estornado</span> : 
                          <span className="badge-fiori badge-fiori-success">Ativo</span>
                        }
                      </td>
                      <td>
                        <div className="flex gap-2">
                          <Link
                            href={`/fi/entries/${entry.entry_id}`}
                            className="btn-fiori-outline text-xs flex items-center gap-1"
                          >
                            <Eye className="w-3 h-3" />
                            Ver
                          </Link>
                          <Link
                            href={`/fi/entries/${entry.entry_id}/edit`}
                            className="btn-fiori-outline text-xs flex items-center gap-1"
                          >
                            <Edit className="w-3 h-3" />
                            Editar
                          </Link>
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
