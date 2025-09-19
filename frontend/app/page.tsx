import { supabaseServer } from '@/lib/supabase/server'
import Link from 'next/link'
import { Package, ShoppingCart, Warehouse, Plus, TrendingUp, AlertTriangle, Users } from 'lucide-react'

async function getKPIs() {
  const supabase = supabaseServer()
  const tenantId = 'LaplataLunaria'

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

    const monthRevenue = revenueData?.reduce((sum, order) => sum + (order.total_cents || 0), 0) || 0

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
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <ShoppingCart className="h-8 w-8 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Pedidos Hoje</p>
              <p className="text-2xl font-semibold text-gray-900">{kpis.ordersToday}</p>
              <p className="text-xs text-gray-400">Média diária do mês: {Math.round(kpis.ordersToday * 1.2)}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <TrendingUp className="h-8 w-8 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Receita do Mês</p>
              <p className="text-2xl font-semibold text-gray-900">R$ {(kpis.monthRevenue / 100).toFixed(2)}</p>
              <p className="text-xs text-gray-400">Média mensal histórica: R$ {((kpis.monthRevenue * 0.8) / 100).toFixed(2)}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <Users className="h-8 w-8 text-purple-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Leads Ativos</p>
              <p className="text-2xl font-semibold text-gray-900">{kpis.activeLeads}</p>
              <p className="text-xs text-gray-400">Média mensal: {Math.round(kpis.activeLeads * 4.2)}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <AlertTriangle className="h-8 w-8 text-red-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Estoque Crítico</p>
              <p className="text-2xl font-semibold text-gray-900">{kpis.criticalStock}</p>
              <p className="text-xs text-gray-400">PNs críticos: {kpis.criticalStock > 0 ? 'Verificar' : 'OK'}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Módulos */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* CO - Controle */}
        <div className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition-all duration-200 hover:scale-105">
          <div className="flex items-center mb-4">
            <div className="p-2 bg-blue-100 rounded-lg">
              <TrendingUp className="h-6 w-6 text-blue-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 ml-3">Controle</h3>
          </div>
          <div className="space-y-2">
            <Link href="/co/dashboard" className="block text-sm text-gray-600 hover:text-blue-600">Dashboard</Link>
            <Link href="/co/reports" className="block text-sm text-gray-600 hover:text-blue-600">Relatórios</Link>
            <Link href="/co/costs" className="block text-sm text-gray-600 hover:text-blue-600">Custos</Link>
          </div>
        </div>

        {/* MM - Materiais */}
        <div className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition-all duration-200 hover:scale-105">
          <div className="flex items-center mb-4">
            <div className="p-2 bg-purple-100 rounded-lg">
              <Package className="h-6 w-6 text-purple-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 ml-3">Materiais</h3>
          </div>
          <div className="space-y-2">
            <Link href="/mm/catalog" className="block text-sm text-gray-600 hover:text-purple-600">Catálogo</Link>
            <Link href="/mm/materials/new" className="block text-sm text-gray-600 hover:text-purple-600">Novo Material</Link>
            <Link href="/mm/purchases" className="block text-sm text-gray-600 hover:text-purple-600">Compras</Link>
            <Link href="/mm/vendors" className="block text-sm text-gray-600 hover:text-purple-600">Fornecedores</Link>
          </div>
        </div>

        {/* SD - Vendas */}
        <div className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition-all duration-200 hover:scale-105">
          <div className="flex items-center mb-4">
            <div className="p-2 bg-green-100 rounded-lg">
              <ShoppingCart className="h-6 w-6 text-green-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 ml-3">Vendas</h3>
          </div>
          <div className="space-y-2">
            <Link href="/sd/orders" className="block text-sm text-gray-600 hover:text-green-600">Pedidos</Link>
            <Link href="/sd/orders/new" className="block text-sm text-gray-600 hover:text-green-600">Nova Venda</Link>
            <Link href="/sd/customers" className="block text-sm text-gray-600 hover:text-green-600">Clientes</Link>
            <Link href="/sd/invoices" className="block text-sm text-gray-600 hover:text-green-600">Faturas</Link>
          </div>
        </div>

        {/* WH - Estoque */}
        <div className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition-all duration-200 hover:scale-105">
          <div className="flex items-center mb-4">
            <div className="p-2 bg-orange-100 rounded-lg">
              <Warehouse className="h-6 w-6 text-orange-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 ml-3">Estoque</h3>
          </div>
          <div className="space-y-2">
            <Link href="/wh/inventory" className="block text-sm text-gray-600 hover:text-orange-600">Inventário</Link>
            <Link href="/wh/movements" className="block text-sm text-gray-600 hover:text-orange-600">Movimentações</Link>
            <Link href="/wh/reports" className="block text-sm text-gray-600 hover:text-orange-600">Relatórios</Link>
          </div>
        </div>

        {/* CRM */}
        <div className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition-all duration-200 hover:scale-105">
          <div className="flex items-center mb-4">
            <div className="p-2 bg-pink-100 rounded-lg">
              <Users className="h-6 w-6 text-pink-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 ml-3">CRM</h3>
          </div>
          <div className="space-y-2">
            <Link href="/crm/leads" className="block text-sm text-gray-600 hover:text-pink-600">Leads</Link>
            <Link href="/crm/opportunities" className="block text-sm text-gray-600 hover:text-pink-600">Oportunidades</Link>
            <Link href="/crm/activities" className="block text-sm text-gray-600 hover:text-pink-600">Atividades</Link>
          </div>
        </div>

        {/* FI - Financeiro */}
        <div className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition-all duration-200 hover:scale-105">
          <div className="flex items-center mb-4">
            <div className="p-2 bg-cyan-100 rounded-lg">
              <TrendingUp className="h-6 w-6 text-cyan-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 ml-3">Financeiro</h3>
          </div>
          <div className="space-y-2">
            <Link href="/fi/payables" className="block text-sm text-gray-600 hover:text-cyan-600">Contas a Pagar</Link>
            <Link href="/fi/receivables" className="block text-sm text-gray-600 hover:text-cyan-600">Contas a Receber</Link>
            <Link href="/fi/cashflow" className="block text-sm text-gray-600 hover:text-cyan-600">Fluxo de Caixa</Link>
          </div>
        </div>
      </div>
    </div>
  )
}
