import Link from 'next/link'
import { getSupabaseServerClient } from '@/lib/supabase/server'
import { requireSession } from '@/lib/auth/requireSession'
import { ArrowLeft, Download, Search, Filter, Calendar } from 'lucide-react'

export const dynamic = 'force-dynamic'
export const revalidate = 0
export const fetchCache = 'force-no-store'

interface AuditLog {
  audit_id: number
  table_name: string
  record_pk: string
  action: string
  diff_json: any
  actor_user: string | null
  created_at: string
}

export default async function AuditPage() {
  let auditLogs: AuditLog[] = []
  let totalCount = 0

  try {
    const supabase = getSupabaseServerClient()
    await requireSession()

    // Buscar logs de auditoria do CRM
    const { data, count, error } = await supabase
      .from('audit_log')
      .select('*', { count: 'exact' })
      
      .eq('table_name', 'crm_customer')
      .order('created_at', { ascending: false })
      .limit(50)

    if (error) {
      console.error('Error loading audit logs:', error)
    } else {
      auditLogs = data || []
      totalCount = count || 0
    }

  } catch (error) {
    console.error('Error loading audit logs:', error)
  }

  const getActionBadge = (action: string) => {
    switch (action) {
      case 'INSERT':
        return <span className="badge-fiori badge-fiori-success">Criação</span>
      case 'UPDATE':
        return <span className="badge-fiori badge-fiori-warning">Alteração</span>
      case 'DELETE':
        return <span className="badge-fiori badge-fiori-danger">Exclusão</span>
      default:
        return <span className="badge-fiori badge-fiori-neutral">{action}</span>
    }
  }

  const formatChanges = (diffJson: any) => {
    if (!diffJson) return '-'
    
    if (diffJson.created) {
      return 'Registro criado'
    }
    
    if (typeof diffJson === 'object') {
      const changes = Object.keys(diffJson).map(key => {
        const change = diffJson[key]
        return `${key}: "${change.before}" → "${change.after}"`
      }).join(', ')
      return changes || 'Sem alterações'
    }
    
    return 'Alterações registradas'
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/crm" className="btn-fiori-outline flex items-center gap-2">
            <ArrowLeft className="w-4 h-4" />
            Voltar para CRM
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-fiori-primary">Log de Alterações - CRM</h1>
            <p className="text-fiori-secondary mt-2">
              Auditoria de mudanças em clientes (Apenas Administradores)
            </p>
          </div>
        </div>
      </div>

      {/* Filtros */}
      <div className="card-fiori">
        <div className="card-fiori-header">
          <h3 className="card-fiori-title">Filtros</h3>
        </div>
        <div className="card-fiori-content">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="label-fiori">Pesquisar</label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-fiori-muted" />
                <input
                  type="text"
                  placeholder="ID do cliente ou usuário..."
                  className="input-fiori pl-10"
                />
              </div>
            </div>
            <div>
              <label className="label-fiori">Ação</label>
              <select className="select-fiori">
                <option value="">Todas</option>
                <option value="INSERT">Criação</option>
                <option value="UPDATE">Alteração</option>
                <option value="DELETE">Exclusão</option>
              </select>
            </div>
            <div>
              <label className="label-fiori">Data Inicial</label>
              <input
                type="date"
                className="input-fiori"
              />
            </div>
            <div>
              <label className="label-fiori">Data Final</label>
              <input
                type="date"
                className="input-fiori"
              />
            </div>
          </div>
          <div className="flex gap-3 mt-4">
            <button className="btn-fiori-primary">Aplicar Filtros</button>
            <button className="btn-fiori-outline">Limpar</button>
            <button className="btn-fiori-outline flex items-center gap-2">
              <Download className="w-4 h-4" />
              Exportar Excel
            </button>
          </div>
        </div>
      </div>

      {/* Estatísticas */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="card-fiori">
          <div className="card-fiori-content text-center">
            <div className="w-12 h-12 bg-fiori-info/10 rounded-full flex items-center justify-center mx-auto mb-3">
              <Calendar className="w-6 h-6 text-fiori-info" />
            </div>
            <h3 className="font-semibold text-fiori-primary">Total de Registros</h3>
            <p className="text-2xl font-bold text-fiori-primary mt-2">{totalCount}</p>
          </div>
        </div>

        <div className="card-fiori">
          <div className="card-fiori-content text-center">
            <div className="w-12 h-12 bg-fiori-success/10 rounded-full flex items-center justify-center mx-auto mb-3">
              <Calendar className="w-6 h-6 text-fiori-success" />
            </div>
            <h3 className="font-semibold text-fiori-primary">Criações</h3>
            <p className="text-2xl font-bold text-fiori-success mt-2">
              {auditLogs.filter(log => log.action === 'INSERT').length}
            </p>
          </div>
        </div>

        <div className="card-fiori">
          <div className="card-fiori-content text-center">
            <div className="w-12 h-12 bg-fiori-warning/10 rounded-full flex items-center justify-center mx-auto mb-3">
              <Calendar className="w-6 h-6 text-fiori-warning" />
            </div>
            <h3 className="font-semibold text-fiori-primary">Alterações</h3>
            <p className="text-2xl font-bold text-fiori-warning mt-2">
              {auditLogs.filter(log => log.action === 'UPDATE').length}
            </p>
          </div>
        </div>

        <div className="card-fiori">
          <div className="card-fiori-content text-center">
            <div className="w-12 h-12 bg-fiori-danger/10 rounded-full flex items-center justify-center mx-auto mb-3">
              <Calendar className="w-6 h-6 text-fiori-danger" />
            </div>
            <h3 className="font-semibold text-fiori-primary">Exclusões</h3>
            <p className="text-2xl font-bold text-fiori-danger mt-2">
              {auditLogs.filter(log => log.action === 'DELETE').length}
            </p>
          </div>
        </div>
      </div>

      {/* Tabela de Logs */}
      <div className="card-fiori">
        <div className="card-fiori-header">
          <h3 className="card-fiori-title">Registros de Auditoria</h3>
        </div>
        <div className="card-fiori-content p-0">
          {auditLogs.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="table-fiori">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Cliente</th>
                    <th>Ação</th>
                    <th>Alterações</th>
                    <th>Usuário</th>
                    <th>Data/Hora</th>
                    <th>Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {auditLogs.map((log) => (
                    <tr key={log.audit_id}>
                      <td>
                        <span className="font-mono text-sm text-fiori-primary">
                          #{log.audit_id}
                        </span>
                      </td>
                      <td>
                        <div>
                          <div className="font-semibold text-fiori-primary">
                            {log.record_pk}
                          </div>
                        </div>
                      </td>
                      <td>
                        {getActionBadge(log.action)}
                      </td>
                      <td>
                        <div className="text-sm max-w-xs truncate" title={formatChanges(log.diff_json)}>
                          {formatChanges(log.diff_json)}
                        </div>
                      </td>
                      <td>
                        <div className="text-sm">
                          {log.actor_user || 'Sistema'}
                        </div>
                      </td>
                      <td>
                        <div className="text-sm text-fiori-muted">
                          {new Date(log.created_at).toLocaleString('pt-BR')}
                        </div>
                      </td>
                      <td>
                        <div className="flex gap-2">
                          <Link
                            href={`/crm/customers/${log.record_pk}`}
                            className="btn-fiori-outline text-xs"
                          >
                            Ver Cliente
                          </Link>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-12">
              <svg className="w-16 h-16 text-fiori-muted mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <h3 className="text-lg font-semibold text-fiori-primary mb-2">Nenhum registro encontrado</h3>
              <p className="text-fiori-muted">As alterações em clientes aparecerão aqui</p>
            </div>
          )}
        </div>
      </div>

      {/* Paginação */}
      {auditLogs.length > 0 && (
        <div className="flex items-center justify-between">
          <div className="text-sm text-fiori-muted">
            Mostrando 1-{auditLogs.length} de {totalCount} registros
          </div>
          <div className="flex gap-2">
            <button className="btn-fiori-outline text-sm" disabled>
              Anterior
            </button>
            <button className="btn-fiori-primary text-sm">
              1
            </button>
            <button className="btn-fiori-outline text-sm" disabled>
              Próximo
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

