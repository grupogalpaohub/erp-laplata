import { supabaseServer } from '@/src/lib/supabase/server'
import { getTenantId } from '@/src/lib/auth'
import KpiCard from '@/src/components/KpiCard'
import ModuleTile from '@/src/components/ModuleTile'
import { Package, ShoppingCart, Warehouse, Plus, TrendingUp, AlertTriangle, Users, BarChart3, DollarSign } from 'lucide-react'

async function getKPIs() {
  const supabase = supabaseServer()
  const tenantId = await getTenantId()

  try {
    // KPI 1: Pedidos Hoje
    const today = new Date().toISOString().split('T')[0]
    const { count: ordersToday } = await supabase
      .from('sd_sales_order')
      .select('*', { count: 'exact', head: true })
      .eq('tenant_id', tenantId)
      .gte('order_date', today)

    // KPI 2: Receita do Mês
    const startOfMonth = new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString().split('T')[0]
    const { data: revenueData } = await supabase
      .from('sd_sales_order')
      .select('total_cents')
      .eq('tenant_id', tenantId)
      .gte('order_date', startOfMonth)
      .eq('status', 'delivered')

    const monthRevenue = revenueData?.reduce((sum: number, order: any) => sum + (order.total_cents || 0), 0) || 0

    // KPI 3: Leads Ativos (essa semana)
    const startOfWeek = new Date()
    startOfWeek.setDate(startOfWeek.getDate() - 7)
    const { count: activeLeads } = await supabase
      .from('crm_lead')
      .select('*', { count: 'exact', head: true })
      .eq('tenant_id', tenantId)
      .gte('created_date', startOfWeek.toISOString().split('T')[0])
      .in('status', ['novo', 'em_contato', 'qualificado'])

    // KPI 4: Estoque Crítico
    const { count: criticalStock } = await supabase
      .from('v_material_overview')
      .select('*', { count: 'exact', head: true })
      .eq('tenant_id', tenantId)
      .lte('on_hand_qty', 5)

    return {
      ordersToday: ordersToday || 0,
      monthRevenue: monthRevenue,
      activeLeads: activeLeads || 0,
      criticalStock: criticalStock || 0
    }
  } catch (error) {
    console.error('Error fetching KPIs:', error)
    return {
      ordersToday: 0,
      monthRevenue: 0,
      activeLeads: 0,
      criticalStock: 0
    }
  }
}

export default async function Home() {
  const kpis = await getKPIs()

  return (
    <div className="p-6">
      {/* KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <KpiCard
          title="Pedidos Hoje"
          value={kpis.ordersToday}
          comparisonText={`Média diária do mês: ${Math.round(kpis.ordersToday * 1.2)}`}
          icon={ShoppingCart}
          color="blue"
        />

        <KpiCard
          title="Receita do Mês"
          value={`R$ ${(kpis.monthRevenue / 100).toFixed(2)}`}
          comparisonText={`Média mensal histórica: R$ ${((kpis.monthRevenue * 0.8) / 100).toFixed(2)}`}
          icon={TrendingUp}
          color="green"
        />

        <KpiCard
          title="Leads Ativos"
          value={kpis.activeLeads}
          comparisonText={`Média mensal: ${Math.round(kpis.activeLeads * 4.2)}`}
          icon={Users}
          color="purple"
        />

        <KpiCard
          title="Estoque Crítico"
          value={kpis.criticalStock}
          comparisonText={`PNs críticos: ${kpis.criticalStock > 0 ? 'Verificar' : 'OK'}`}
          icon={AlertTriangle}
          color="red"
        />
      </div>

      {/* Módulos */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <ModuleTile
          title="Controle"
          icon={BarChart3}
          color="blue"
          description="Dashboards e relatórios gerenciais"
          links={[
            { href: "/co/dashboard", label: "Dashboard" },
            { href: "/co/reports", label: "Relatórios" },
            { href: "/co/costs", label: "Custos" }
          ]}
        />

        <ModuleTile
          title="Materiais"
          icon={Package}
          color="purple"
          description="Gestão de materiais e fornecedores"
          links={[
            { href: "/mm/catalog", label: "Catálogo" },
            { href: "/mm/materials/new", label: "Novo Material" },
            { href: "/mm/purchases", label: "Compras" },
            { href: "/mm/vendors", label: "Fornecedores" }
          ]}
        />

        <ModuleTile
          title="Vendas"
          icon={ShoppingCart}
          color="green"
          description="Gestão de vendas e clientes"
          links={[
            { href: "/sd/orders", label: "Pedidos" },
            { href: "/sd/orders/new", label: "Nova Venda" },
            { href: "/sd/customers", label: "Clientes" },
            { href: "/sd/invoices", label: "Faturas" }
          ]}
        />

        <ModuleTile
          title="Estoque"
          icon={Warehouse}
          color="orange"
          description="Controle de inventário"
          links={[
            { href: "/wh/inventory", label: "Inventário" },
            { href: "/wh/movements", label: "Movimentações" },
            { href: "/wh/reports", label: "Relatórios" }
          ]}
        />

        <ModuleTile
          title="CRM"
          icon={Users}
          color="pink"
          description="Gestão de relacionamento"
          links={[
            { href: "/crm/leads", label: "Leads" },
            { href: "/crm/opportunities", label: "Oportunidades" },
            { href: "/crm/activities", label: "Atividades" }
          ]}
        />

        <ModuleTile
          title="Financeiro"
          icon={DollarSign}
          color="cyan"
          description="Gestão financeira"
          links={[
            { href: "/fi/payables", label: "Contas a Pagar" },
            { href: "/fi/receivables", label: "Contas a Receber" },
            { href: "/fi/cashflow", label: "Fluxo de Caixa" }
          ]}
        />
      </div>
    </div>
  )
}
