import { supabaseServerReadOnly } from '@/lib/supabase/server-readonly'
import { requireSession } from '@/lib/auth/requireSession'
import Link from 'next/link'
import { FileText, Plus, Eye, Calendar } from 'lucide-react'

export const dynamic = 'force-dynamic'
export const revalidate = 0

interface AccountingEntry {
  entry_id: string
  tenant_id: string
  entry_date: string
  description: string
  total_debit_cents: number
  total_credit_cents: number
  is_posted: boolean
  created_at: string
  created_by: string
  items?: {
    item_id: string
    account_code: string
    debit_cents: number
    credit_cents: number
    description: string
    account_name?: string
  }[]
}

export default async function EntriesPage() {
  const supabase = supabaseServerReadOnly()
  if (process.env.NODE_ENV === 'production') { if (process.env.NODE_ENV === 'production') { await requireSession() } }

  // Buscar lançamentos contábeis
  const { data: entriesData, error } = await supabase
    .from('fi_accounting_entry')
    .select(`
      *,
      items:fi_accounting_entry_item(
        item_id,
        account_code,
        debit_cents,
        credit_cents,
        description,
        account_name
      )
    `)
    
    .order('entry_date', { ascending: false })
    .limit(50)

  if (error) {
    console.error('Error fetching accounting entries:', error)
  }

  const entries: AccountingEntry[] = entriesData || []

  // Calcular estatísticas
  const totalEntries = entries.length
  const postedEntries = entries.filter(e => e.is_posted).length
  const draftEntries = entries.filter(e => !e.is_posted).length
  const totalDebit = entries.reduce((sum, e) => sum + e.total_debit_cents, 0)
  const totalCredit = entries.reduce((sum, e) => sum + e.total_credit_cents, 0)

  return (
    <div className="container-fiori">
      <div className="section-fiori">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-fiori-primary">Lançamentos Contábeis</h1>
            <p className="text-fiori-secondary mt-2">Histórico de movimentações contábeis</p>
          </div>
          <div className="flex gap-4">
            <Link href="/fi" className="btn-fiori-secondary">
              ← Voltar
            </Link>
            <Link href="/fi/entries/new" className="btn-fiori-primary">
              <Plus className="w-4 h-4 mr-2" />
              Novo Lançamento
            </Link>
          </div>
        </div>

        {/* Estatísticas */}
        <div className="grid-fiori-4 mb-8">
          <div className="tile-fiori">
            <div className="flex items-center justify-between">
              <div>
                <p className="tile-fiori-subtitle">Total de Lançamentos</p>
                <p className="tile-fiori-metric">{totalEntries}</p>
              </div>
              <FileText className="tile-fiori-icon" />
            </div>
          </div>

          <div className="tile-fiori">
            <div className="flex items-center justify-between">
              <div>
                <p className="tile-fiori-subtitle">Lançados</p>
                <p className="tile-fiori-metric text-fiori-success">{postedEntries}</p>
              </div>
              <FileText className="tile-fiori-icon text-fiori-success" />
            </div>
          </div>

          <div className="tile-fiori">
            <div className="flex items-center justify-between">
              <div>
                <p className="tile-fiori-subtitle">Rascunhos</p>
                <p className="tile-fiori-metric text-fiori-warning">{draftEntries}</p>
              </div>
              <FileText className="tile-fiori-icon text-fiori-warning" />
            </div>
          </div>

          <div className="tile-fiori">
            <div className="flex items-center justify-between">
              <div>
                <p className="tile-fiori-subtitle">Balanço</p>
                <p className={`tile-fiori-metric ${
                  totalDebit === totalCredit ? 'text-fiori-success' : 'text-fiori-danger'
                }`}>
                  {totalDebit === totalCredit ? 'Equilibrado' : 'Desequilibrado'}
                </p>
              </div>
              <FileText className="tile-fiori-icon" />
            </div>
          </div>
        </div>

        {/* Tabela de Lançamentos */}
        <div className="card-fiori">
          <div className="card-fiori-header">
            <h2 className="card-fiori-title">Lançamentos Recentes</h2>
            <p className="card-fiori-subtitle">
              Total Débito: R$ {(totalDebit / 100).toLocaleString('pt-BR', { minimumFractionDigits: 2 })} | 
              Total Crédito: R$ {(totalCredit / 100).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
            </p>
          </div>
          <div className="card-fiori-body">
            <div className="overflow-x-auto">
              <table className="table-fiori">
                <thead>
                  <tr>
                    <th>Data</th>
                    <th>Descrição</th>
                    <th className="text-right">Débito</th>
                    <th className="text-right">Crédito</th>
                    <th>Status</th>
                    <th>Criado por</th>
                    <th>Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {entries.map((entry) => (
                    <tr key={entry.entry_id}>
                      <td>
                        <div className="flex items-center gap-2">
                          <Calendar className="w-4 h-4 text-fiori-muted" />
                          <div>
                            <div className="text-sm font-medium">
                              {new Date(entry.entry_date).toLocaleDateString('pt-BR')}
                            </div>
                            <div className="text-xs text-fiori-muted">
                              {new Date(entry.created_at).toLocaleTimeString('pt-BR')}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td>
                        <div>
                          <div className="font-medium">
                            {entry.description}
                          </div>
                          <div className="text-xs text-fiori-muted font-mono">
                            {entry.entry_id}
                          </div>
                        </div>
                      </td>
                      <td className="text-right">
                        <span className="font-medium text-fiori-danger">
                          R$ {(entry.total_debit_cents / 100).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                        </span>
                      </td>
                      <td className="text-right">
                        <span className="font-medium text-fiori-success">
                          R$ {(entry.total_credit_cents / 100).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                        </span>
                      </td>
                      <td>
                        <span className={`badge-fiori ${
                          entry.is_posted ? 'badge-fiori-success' : 'badge-fiori-warning'
                        }`}>
                          {entry.is_posted ? 'Lançado' : 'Rascunho'}
                        </span>
                      </td>
                      <td>
                        <span className="text-sm text-fiori-muted">
                          {entry.created_by || 'Sistema'}
                        </span>
                      </td>
                      <td>
                        <div className="flex gap-2">
                          <Link
                            href={`/fi/entries/${entry.entry_id}`}
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

            {entries.length === 0 && (
              <div className="text-center py-12">
                <FileText className="w-12 h-12 text-fiori-muted mx-auto mb-4" />
                <h3 className="text-lg font-medium text-fiori-muted mb-2">
                  Nenhum lançamento encontrado
                </h3>
                <p className="text-fiori-muted mb-4">
                  Os lançamentos contábeis aparecerão aqui conforme forem criados.
                </p>
                <Link href="/fi/entries/new" className="btn-fiori-primary">
                  <Plus className="w-4 h-4 mr-2" />
                  Criar Primeiro Lançamento
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}


