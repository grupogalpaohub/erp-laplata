import Link from 'next/link'
import { ArrowLeft, Users, UserPlus, Phone, Mail, Calendar } from 'lucide-react'
import { createSupabaseServerClient } from '@/lib/supabaseServer'
import { getTenantId } from '@/lib/auth'
import TileCard from '@/components/ui/TileCard'
import KpiCard from '@/components/ui/KpiCard'
import ListSection from '@/components/ui/ListSection'

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
    const supabase = createSupabaseServerClient()
    const tenantId = await getTenantId()

    // Buscar dados para KPIs
    const [customersResult, opportunitiesResult, activitiesResult] = await Promise.allSettled([
      supabase
        .from('crm_customer')
        .select('customer_id, name, is_active')
        .eq('tenant_id', tenantId),
      supabase
        .from('crm_opportunity')
        .select('opportunity_id, status, value_cents')
        .eq('tenant_id', tenantId),
      supabase
        .from('crm_activity')
        .select('activity_id, type, created_at')
        .eq('tenant_id', tenantId)
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
    <div className="min-h-screen bg-gray-900">
      {/* Header */}
      <div className="bg-gray-800 border-b border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <Link 
                href="/" 
                className="inline-flex items-center text-gray-300 hover:text-white transition-colors mr-6"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Voltar
              </Link>
              <h1 className="text-xl font-semibold text-white">CRM - Gestão de Clientes</h1>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Title Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-white mb-4">CRM - Gestão de Clientes</h1>
          <p className="text-xl text-gray-300 mb-2">Clientes e oportunidades</p>
          <p className="text-lg text-gray-400">Gerencie relacionamento com clientes e pipeline de vendas</p>
        </div>

        {/* Tiles Principais */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          <TileCard
            title="Central de Clientes"
            subtitle="Lista de clientes ativos"
            icon={Users}
            href="/crm/customers"
            color="blue"
          />
          
          <TileCard
            title="Novo Cliente"
            subtitle="Cadastrar novo cliente"
            icon={UserPlus}
            href="/crm/customers/new"
            color="green"
          />
          
          <TileCard
            title="Oportunidades"
            subtitle="Pipeline de vendas"
            icon={Phone}
            href="/crm/opportunities"
            color="purple"
          />
        </div>

        {/* Visão Geral - KPIs */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          <KpiCard
            title="Total de Clientes"
            value={totalCustomers}
            subtitle="Clientes ativos"
            icon={Users}
            color="blue"
          />
          
          <KpiCard
            title="Oportunidades Ativas"
            value={activeOpportunities}
            subtitle="Em andamento"
            icon={Phone}
            color="green"
          />
          
          <KpiCard
            title="Atividades do Mês"
            value={totalActivities}
            subtitle="Interações realizadas"
            icon={Calendar}
            color="orange"
          />
          
          <KpiCard
            title="Taxa de Conversão"
            value={`${conversionRate}%`}
            subtitle="Oportunidades/Clientes"
            icon={Mail}
            color="green"
          />
        </div>

        {/* Seções de Listagem */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <ListSection
            title="Últimos Clientes"
            viewAllHref="/crm/customers"
            viewAllText="Ver Todos"
            icon={Users}
            emptyState={{
              icon: UserPlus,
              title: "Nenhum cliente cadastrado",
              description: "Comece cadastrando seu primeiro cliente",
              actionText: "Cadastrar Cliente",
              actionHref: "/crm/customers/new"
            }}
          >
            {customers.length > 0 ? (
              <div className="space-y-3">
                {customers.slice(0, 5).map((customer) => (
                  <div key={customer.customer_id} className="flex items-center justify-between p-3 bg-gray-700 rounded-lg">
                    <div>
                      <p className="text-white font-medium">{customer.name}</p>
                      <p className="text-gray-400 text-sm">
                        {customer.is_active ? 'Ativo' : 'Inativo'}
                      </p>
                    </div>
                    <Link 
                      href={`/crm/customers/${customer.customer_id}`}
                      className="text-blue-400 hover:text-blue-300 text-sm"
                    >
                      Ver
                    </Link>
                  </div>
                ))}
              </div>
            ) : null}
          </ListSection>

          <ListSection
            title="Oportunidades Recentes"
            viewAllHref="/crm/opportunities"
            viewAllText="Ver Todas"
            icon={Phone}
            emptyState={{
              icon: Phone,
              title: "Nenhuma oportunidade",
              description: "Crie oportunidades para acompanhar suas vendas",
              actionText: "Nova Oportunidade",
              actionHref: "/crm/opportunities/new"
            }}
          >
            {opportunities.length > 0 ? (
              <div className="space-y-3">
                {opportunities.slice(0, 5).map((opportunity) => (
                  <div key={opportunity.opportunity_id} className="flex items-center justify-between p-3 bg-gray-700 rounded-lg">
                    <div>
                      <p className="text-white font-medium">Oportunidade #{opportunity.opportunity_id}</p>
                      <p className="text-gray-400 text-sm capitalize">{opportunity.status}</p>
                    </div>
                    <Link 
                      href={`/crm/opportunities/${opportunity.opportunity_id}`}
                      className="text-blue-400 hover:text-blue-300 text-sm"
                    >
                      Ver
                    </Link>
                  </div>
                ))}
              </div>
            ) : null}
          </ListSection>
        </div>
      </div>
    </div>
  )
}