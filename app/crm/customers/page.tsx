import Link from 'next/link'
import { createSupabaseServerClient } from '@/lib/supabaseServer'
import { getTenantId } from '@/lib/auth'
import { Search, Download, Plus, Eye, Edit } from 'lucide-react'

export const dynamic = 'force-dynamic'
export const revalidate = 0
export const fetchCache = 'force-no-store'

interface Customer {
  customer_id: string
  name: string
  contact_email: string
  contact_phone: string
  phone_country: string
  addr_city: string
  addr_state: string
  payment_terms: string
  is_active: boolean
  created_date: string
  updated_at: string
}

export default async function CustomersPage() {
  let customers: Customer[] = []
  let totalCount = 0

  try {
    const supabase = createSupabaseServerClient()
    const tenantId = await getTenantId()

    // Buscar clientes com paginação
    const { data, count, error } = await supabase
      .from('crm_customer')
      .select(`
        customer_id,
        name,
        contact_email,
        contact_phone,
        phone_country,
        addr_city,
        addr_state,
        is_active,
        created_date,
        updated_at
      `, { count: 'exact' })
      .eq('tenant_id', tenantId)
      .order('created_date', { ascending: false })
      .limit(25)

    if (error) {
      console.error('Error loading customers:', error)
    } else {
      customers = data || []
      totalCount = count || 0
    }

  } catch (error) {
    console.error('Error loading customers:', error)
  }

  const formatPhone = (phone: string, country: string) => {
    if (!phone) return '-'
    if (country === 'BR') {
      // Formato brasileiro: (11) 99999-9999
      const cleaned = phone.replace(/\D/g, '')
      if (cleaned.length === 11) {
        return `(${cleaned.slice(0, 2)}) ${cleaned.slice(2, 7)}-${cleaned.slice(7)}`
      }
      return phone
    }
    return phone
  }

  const getStatusBadge = (isActive: boolean) => {
    return isActive ? (
      <span className="badge-fiori badge-fiori-success">Ativo</span>
    ) : (
      <span className="badge-fiori badge-fiori-danger">Inativo</span>
    )
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-fiori-primary">Central de Clientes</h1>
          <p className="text-fiori-secondary mt-2">
            {totalCount} cliente{totalCount !== 1 ? 's' : ''} cadastrado{totalCount !== 1 ? 's' : ''}
          </p>
        </div>
        <div className="flex gap-3">
          <Link href="/crm" className="btn-fiori-outline">
            Voltar para CRM
          </Link>
          <Link href="/crm/customers/new" className="btn-fiori-primary flex items-center gap-2">
            <Plus className="w-4 h-4" />
            Novo Cliente
          </Link>
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
                  placeholder="Nome, email ou telefone..."
                  className="input-fiori pl-10"
                />
              </div>
            </div>
            <div>
              <label className="label-fiori">Status</label>
              <select className="select-fiori">
                <option value="">Todos</option>
                <option value="active">Ativo</option>
                <option value="inactive">Inativo</option>
              </select>
            </div>
            <div>
              <label className="label-fiori">Cidade/UF</label>
              <input
                type="text"
                placeholder="Cidade ou estado..."
                className="input-fiori"
              />
            </div>
          </div>
          <div className="flex gap-3 mt-4">
            <button className="btn-fiori-primary">Aplicar Filtros</button>
            <button className="btn-fiori-outline">Limpar</button>
            <button className="btn-fiori-outline flex items-center gap-2">
              <Download className="w-4 h-4" />
              Exportar CSV
            </button>
          </div>
        </div>
      </div>

      {/* Tabela de Clientes */}
      <div className="card-fiori">
        <div className="card-fiori-header">
          <h3 className="card-fiori-title">Lista de Clientes</h3>
        </div>
        <div className="card-fiori-content p-0">
          {customers.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="table-fiori">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Nome</th>
                    <th>Email</th>
                    <th>Telefone</th>
                    <th>Cidade/UF</th>
                    <th>Status</th>
                    <th>Cadastrado em</th>
                    <th>Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {customers.map((customer) => (
                    <tr key={customer.customer_id}>
                      <td>
                        <span className="font-mono text-sm text-fiori-primary">
                          {customer.customer_id}
                        </span>
                      </td>
                      <td>
                        <div>
                          <div className="font-semibold text-fiori-primary">{customer.name}</div>
                        </div>
                      </td>
                      <td>
                        <div className="text-sm">{customer.contact_email || '-'}</div>
                      </td>
                      <td>
                        <div className="text-sm">
                          {formatPhone(customer.contact_phone, customer.phone_country)}
                        </div>
                      </td>
                      <td>
                        <div className="text-sm">
                          {customer.addr_city && customer.addr_state 
                            ? `${customer.addr_city}/${customer.addr_state}`
                            : '-'
                          }
                        </div>
                      </td>
                      <td>
                        <div className="text-sm">
                        </div>
                      </td>
                      <td>
                        {getStatusBadge(customer.is_active)}
                      </td>
                      <td>
                        <div className="text-sm text-fiori-muted">
                          {new Date(customer.created_date).toLocaleDateString('pt-BR')}
                        </div>
                      </td>
                      <td>
                        <div className="flex gap-2">
                          <Link
                            href={`/crm/customers/${customer.customer_id}`}
                            className="btn-fiori-outline text-xs flex items-center gap-1"
                          >
                            <Eye className="w-3 h-3" />
                            Ver
                          </Link>
                          <Link
                            href={`/crm/customers/${customer.customer_id}/edit`}
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
          ) : (
            <div className="text-center py-12">
              <svg className="w-16 h-16 text-fiori-muted mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              <h3 className="text-lg font-semibold text-fiori-primary mb-2">Nenhum cliente encontrado</h3>
              <p className="text-fiori-muted mb-4">Comece cadastrando seu primeiro cliente</p>
              <Link href="/crm/customers/new" className="btn-fiori-primary">
                Cadastrar Cliente
              </Link>
            </div>
          )}
        </div>
      </div>

      {/* Paginação */}
      {customers.length > 0 && (
        <div className="flex items-center justify-between">
          <div className="text-sm text-fiori-muted">
            Mostrando 1-{customers.length} de {totalCount} clientes
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
