import Link from 'next/link'
import { supabaseServer } from '@/src/lib/supabaseServer'
import { getTenantId } from '@/src/lib/auth'

export const dynamic = 'force-dynamic'
export const revalidate = 0
export const fetchCache = 'force-no-store'

export default async function CRMPage() {
  let customers: any[] = []
  let totalCustomers = 0
  let activeCustomers = 0

  try {
    const supabase = supabaseServer()
    const tenantId = await getTenantId()

    // Buscar dados para KPIs
    const [customersResult, totalResult, activeResult] = await Promise.allSettled([
      supabase
        .from('crm_customer')
        .select('customer_id, name, contact_email, contact_phone, is_active, created_date')
        .eq('tenant_id', tenantId)
        .order('created_date', { ascending: false })
        .limit(5),
      supabase
        .from('crm_customer')
        .select('customer_id', { count: 'exact' })
        .eq('tenant_id', tenantId),
      supabase
        .from('crm_customer')
        .select('customer_id', { count: 'exact' })
        .eq('tenant_id', tenantId)
        .eq('is_active', true)
    ])

    customers = customersResult.status === 'fulfilled' ? (customersResult.value.data || []) : []
    totalCustomers = totalResult.status === 'fulfilled' ? (totalResult.value.count || 0) : 0
    activeCustomers = activeResult.status === 'fulfilled' ? (activeResult.value.count || 0) : 0

  } catch (error) {
    console.error('Error loading CRM data:', error)
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-fiori-primary mb-4">CRM - Gestão de Clientes</h1>
        <p className="text-xl text-fiori-secondary mb-2">Central de clientes e oportunidades</p>
        <p className="text-lg text-fiori-muted">Gerencie seus clientes e relacionamentos</p>
      </div>

      {/* Tiles Principais */}
      <div className="grid-fiori-3">
        <Link href="/crm/customers/new" className="group">
          <div className="tile-fiori">
            <div className="tile-fiori-icon">
              <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
            </div>
            <h3 className="tile-fiori-title">Novo Cliente</h3>
            <p className="tile-fiori-subtitle">Cadastrar novo cliente</p>
          </div>
        </Link>

        <Link href="/crm/customers" className="group">
          <div className="tile-fiori">
            <div className="tile-fiori-icon">
              <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
            <h3 className="tile-fiori-title">Central de Clientes</h3>
            <p className="tile-fiori-subtitle">Listar e gerenciar clientes</p>
          </div>
        </Link>

        <Link href="/crm/audit" className="group">
          <div className="tile-fiori">
            <div className="tile-fiori-icon">
              <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <h3 className="tile-fiori-title">Log de Alterações</h3>
            <p className="tile-fiori-subtitle">Auditoria de mudanças (Admin)</p>
          </div>
        </Link>
      </div>

      {/* KPIs Section */}
      <div className="mt-12">
        <h2 className="text-2xl font-semibold text-fiori-primary mb-6">Visão Geral</h2>
        <div className="grid-fiori-4">
          {/* KPI 1 - Total de Clientes */}
          <div className="tile-fiori">
            <div className="flex items-center justify-between mb-4">
              <h3 className="tile-fiori-title text-sm">Total de Clientes</h3>
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
            <div className="kpi-fiori kpi-fiori-success">{totalCustomers}</div>
            <p className="tile-fiori-metric-label">Clientes cadastrados</p>
          </div>

          {/* KPI 2 - Clientes Ativos */}
          <div className="tile-fiori">
            <div className="flex items-center justify-between mb-4">
              <h3 className="tile-fiori-title text-sm">Clientes Ativos</h3>
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div className="kpi-fiori kpi-fiori-success">{activeCustomers}</div>
            <p className="tile-fiori-metric-label">Clientes ativos</p>
          </div>

          {/* KPI 3 - Novos Clientes (últimos 30 dias) */}
          <div className="tile-fiori">
            <div className="flex items-center justify-between mb-4">
              <h3 className="tile-fiori-title text-sm">Novos Clientes</h3>
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
              </svg>
            </div>
            <div className="kpi-fiori kpi-fiori-neutral">0</div>
            <p className="tile-fiori-metric-label">Últimos 30 dias</p>
          </div>

          {/* KPI 4 - Taxa de Conversão */}
          <div className="tile-fiori">
            <div className="flex items-center justify-between mb-4">
              <h3 className="tile-fiori-title text-sm">Taxa de Conversão</h3>
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
            <div className="kpi-fiori kpi-fiori-warning">85.2%</div>
            <p className="tile-fiori-metric-label">Lead para cliente</p>
          </div>
        </div>
      </div>

      {/* Clientes Recentes */}
      <div className="mt-12">
        <h2 className="text-2xl font-semibold text-fiori-primary mb-6">Clientes Recentes</h2>
        <div className="card-fiori">
          <div className="card-fiori-header">
            <h3 className="card-fiori-title">Últimos Clientes Cadastrados</h3>
            <Link href="/crm/customers" className="btn-fiori-outline text-sm">
              Ver Todos
            </Link>
          </div>
          <div className="card-fiori-content">
            {customers.length > 0 ? (
              <div className="space-y-4">
                {customers.map((customer) => (
                  <div key={customer.customer_id} className="flex items-center justify-between p-4 border border-fiori-border rounded-lg">
                    <div className="flex items-center space-x-4">
                      <div className="w-10 h-10 bg-fiori-primary/10 rounded-full flex items-center justify-center">
                        <svg className="w-5 h-5 text-fiori-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                      </div>
                      <div>
                        <h4 className="font-semibold text-fiori-primary">{customer.name}</h4>
                        <p className="text-sm text-fiori-secondary">{customer.contact_email}</p>
                        <p className="text-xs text-fiori-muted">
                          {customer.contact_phone} • {customer.is_active ? 'Ativo' : 'Inativo'}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-fiori-muted">
                        {new Date(customer.created_date).toLocaleDateString('pt-BR')}
                      </p>
                      <Link 
                        href={`/crm/customers/${customer.customer_id}`}
                        className="btn-fiori-outline text-xs mt-2"
                      >
                        Ver Detalhes
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <svg className="w-16 h-16 text-fiori-muted mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
                <p className="text-fiori-muted">Nenhum cliente cadastrado ainda</p>
                <Link href="/crm/customers/new" className="btn-fiori-primary mt-4">
                  Cadastrar Primeiro Cliente
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}