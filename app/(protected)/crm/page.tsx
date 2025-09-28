import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import { requireSession } from '@/lib/auth/requireSession'
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

export const dynamic = 'force-dynamic'
export const revalidate = 0
export const fetchCache = 'force-no-store'

export default async function CRMPage() {
  let customers: any[] = []
  let opportunities: any[] = []
  let activities: any[] = []
  let totalCustomers = 0
  let activeOpportunities = 0
  let totalActivities = 0
  let conversionRate = 0

  try {
    await requireSession() // Verificar se está autenticado
    const cookieStore = cookies()
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          get(name: string) {
            return cookieStore.get(name)?.value
          },
        },
      }
    )

    // Buscar dados para KPIs (RLS filtra automaticamente por tenant)
    const [customersResult, opportunitiesResult, activitiesResult] = await Promise.allSettled([
      supabase
        .from('crm_customer')
        .select('customer_id, name, is_active'),
      supabase
        .from('crm_opportunity')
        .select('opportunity_id, status, value_cents'),
      supabase
        .from('crm_activity')
        .select('activity_id, type, created_at')
        .gte('created_at', new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString())
    ])

    customers = customersResult.status === 'fulfilled' ? (customersResult.value.data || []) : []
    opportunities = opportunitiesResult.status === 'fulfilled' ? (opportunitiesResult.value.data || []) : []
    activities = activitiesResult.status === 'fulfilled' ? (activitiesResult.value.data || []) : []

    // Calcular KPIs
    totalCustomers = customers.filter(c => c.is_active).length
    activeOpportunities = opportunities.filter(o => o.status === 'active').length
    totalActivities = activities.length
    conversionRate = totalCustomers > 0 ? Math.round((activeOpportunities / totalCustomers) * 100) : 0

  } catch (error) {
    console.error('Error loading CRM data:', error)
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <Link href="/" className="btn-fiori-outline flex items-center gap-2">
          <ArrowLeft className="w-4 h-4" />
          Voltar
        </Link>
        <div className="text-center flex-1">
          <h1 className="text-4xl font-bold text-fiori-primary mb-4">CRM - Gestão de Clientes</h1>
          <p className="text-xl text-fiori-secondary mb-2">Clientes e oportunidades</p>
          <p className="text-lg text-fiori-muted">Gerencie relacionamento com clientes e pipeline de vendas</p>
        </div>
        <div className="w-20"></div> {/* Spacer para centralizar */}
      </div>

      {/* Tiles Principais */}
      <div className="grid-fiori-3">
        <Link href="/crm/customers" className="group">
          <div className="tile-fiori">
            <div className="tile-fiori-icon">
              <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
              </svg>
            </div>
            <h3 className="tile-fiori-title">Central de Clientes</h3>
            <p className="tile-fiori-subtitle">Lista de clientes ativos</p>
          </div>
        </Link>

        <Link href="/crm/customers/new" className="group">
          <div className="tile-fiori">
            <div className="tile-fiori-icon">
              <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
              </svg>
            </div>
            <h3 className="tile-fiori-title">Novo Cliente</h3>
            <p className="tile-fiori-subtitle">Cadastrar novo cliente</p>
          </div>
        </Link>

        <Link href="/crm/opportunities" className="group">
          <div className="tile-fiori">
            <div className="tile-fiori-icon">
              <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
              </svg>
            </div>
            <h3 className="tile-fiori-title">Oportunidades</h3>
            <p className="tile-fiori-subtitle">Pipeline de vendas</p>
          </div>
        </Link>
      </div>

      {/* Visão Geral - KPIs */}
      <div className="grid-fiori-4">
        <div className="card-fiori">
          <div className="card-fiori-body">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-medium text-fiori-secondary">Total de Clientes</h3>
              <svg className="w-5 h-5 text-fiori-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
              </svg>
            </div>
            <div className="space-y-2">
              <p className="kpi-fiori kpi-fiori-primary">{totalCustomers}</p>
              <p className="text-sm text-fiori-muted">Clientes ativos</p>
            </div>
          </div>
        </div>

        <div className="card-fiori">
          <div className="card-fiori-body">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-medium text-fiori-secondary">Oportunidades Ativas</h3>
              <svg className="w-5 h-5 text-fiori-success" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
              </svg>
            </div>
            <div className="space-y-2">
              <p className="kpi-fiori kpi-fiori-success">{activeOpportunities}</p>
              <p className="text-sm text-fiori-muted">Em andamento</p>
            </div>
          </div>
        </div>

        <div className="card-fiori">
          <div className="card-fiori-body">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-medium text-fiori-secondary">Atividades do Mês</h3>
              <svg className="w-5 h-5 text-fiori-warning" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <div className="space-y-2">
              <p className="kpi-fiori kpi-fiori-warning">{totalActivities}</p>
              <p className="text-sm text-fiori-muted">Interações realizadas</p>
            </div>
          </div>
        </div>

        <div className="card-fiori">
          <div className="card-fiori-body">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-medium text-fiori-secondary">Taxa de Conversão</h3>
              <svg className="w-5 h-5 text-fiori-success" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </div>
            <div className="space-y-2">
              <p className="kpi-fiori kpi-fiori-success">{conversionRate}%</p>
              <p className="text-sm text-fiori-muted">Oportunidades/Clientes</p>
            </div>
          </div>
        </div>
      </div>

      {/* Seções de Listagem */}
      <div className="grid-fiori-2">
        <div className="card-fiori">
          <div className="card-fiori-header">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <svg className="w-5 h-5 text-fiori-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
                </svg>
                <h2 className="card-fiori-title">Últimos Clientes</h2>
              </div>
              <Link href="/crm/customers" className="text-fiori-primary hover:text-fiori-accent-blue text-sm font-medium transition-colors">
                Ver Todos
              </Link>
            </div>
          </div>
          <div className="card-fiori-body">
            {customers.length > 0 ? (
              <div className="space-y-3">
                {customers.slice(0, 5).map((customer) => (
                  <div key={customer.customer_id} className="flex items-center justify-between p-3 bg-fiori-secondary rounded">
                    <div>
                      <p className="text-fiori-primary font-medium">{customer.name}</p>
                      <p className="text-fiori-secondary text-sm">
                        {customer.is_active ? 'Ativo' : 'Inativo'}
                      </p>
                    </div>
                    <Link 
                      href={`/crm/customers/${customer.customer_id}`}
                      className="text-fiori-primary hover:text-fiori-accent-blue text-sm"
                    >
                      Ver
                    </Link>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <svg className="w-12 h-12 text-fiori-muted mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                </svg>
                <h3 className="text-lg font-medium text-fiori-secondary mb-2">Nenhum cliente cadastrado</h3>
                <p className="text-fiori-muted mb-4">Comece cadastrando seu primeiro cliente</p>
                <Link 
                  href="/crm/customers/new"
                  className="btn-fiori-primary"
                >
                  Cadastrar Cliente
                </Link>
              </div>
            )}
          </div>
        </div>

        <div className="card-fiori">
          <div className="card-fiori-header">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <svg className="w-5 h-5 text-fiori-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
                <h2 className="card-fiori-title">Oportunidades Recentes</h2>
              </div>
              <Link href="/crm/opportunities" className="text-fiori-primary hover:text-fiori-accent-blue text-sm font-medium transition-colors">
                Ver Todas
              </Link>
            </div>
          </div>
          <div className="card-fiori-body">
            {opportunities.length > 0 ? (
              <div className="space-y-3">
                {opportunities.slice(0, 5).map((opportunity) => (
                  <div key={opportunity.opportunity_id} className="flex items-center justify-between p-3 bg-fiori-secondary rounded">
                    <div>
                      <p className="text-fiori-primary font-medium">Oportunidade #{opportunity.opportunity_id}</p>
                      <p className="text-fiori-secondary text-sm capitalize">{opportunity.status}</p>
                    </div>
                    <Link 
                      href={`/crm/opportunities/${opportunity.opportunity_id}`}
                      className="text-fiori-primary hover:text-fiori-accent-blue text-sm"
                    >
                      Ver
                    </Link>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <svg className="w-12 h-12 text-fiori-muted mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
                <h3 className="text-lg font-medium text-fiori-secondary mb-2">Nenhuma oportunidade</h3>
                <p className="text-fiori-muted mb-4">Crie oportunidades para acompanhar suas vendas</p>
                <Link 
                  href="/crm/opportunities/new"
                  className="btn-fiori-primary"
                >
                  Nova Oportunidade
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
