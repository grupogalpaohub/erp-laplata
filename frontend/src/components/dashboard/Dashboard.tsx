'use client'

import { KpiCard } from '@/components/ui/KpiCard'
import { ModuleTile } from '@/components/ui/ModuleTile'
import { AuthDebug } from '@/components/debug/AuthDebug'
import { 
  ShoppingCart, 
  DollarSign, 
  Users, 
  AlertTriangle,
  BarChart3,
  Package,
  Warehouse,
  TrendingUp,
  Settings
} from 'lucide-react'

export function Dashboard() {
  return (
    <div className="lg:ml-72 p-6 bg-gray-50 min-h-screen">
      {/* Debug - Remove after fixing */}
      <div className="mb-6">
        <AuthDebug />
      </div>

      {/* Breadcrumbs */}
      <div className="mb-6">
        <nav className="flex" aria-label="Breadcrumb">
          <ol className="inline-flex items-center space-x-1 md:space-x-3">
            <li className="inline-flex items-center">
              <a href="/dashboard" className="text-gray-700 hover:text-blue-600">
                Dashboard
              </a>
            </li>
            <li>
              <div className="flex items-center">
                <span className="text-gray-400 mx-2">/</span>
                <span className="text-gray-500">Visão Geral</span>
              </div>
            </li>
          </ol>
        </nav>
      </div>

      {/* KPIs */}
      <div className="mb-8">
        <h3 className="text-xl font-semibold text-gray-900 mb-6">Indicadores Principais</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <KpiCard
            title="Pedidos Hoje"
            value="0 pedidos"
            comparisonText="Média diária do mês: 0"
            trend="neutral"
            highlightColor="blue"
            icon={ShoppingCart}
            badge="Hoje"
          />
          <KpiCard
            title="Receita do Mês"
            value="R$ 0,00"
            comparisonText="Média mensal histórica: R$ 0,00"
            trend="neutral"
            highlightColor="green"
            icon={DollarSign}
            badge="Janeiro 2025"
          />
          <KpiCard
            title="Leads Ativos"
            value="0 leads"
            comparisonText="Média mensal: 0"
            trend="neutral"
            highlightColor="purple"
            icon={Users}
            badge="Esta semana"
          />
          <KpiCard
            title="Estoque Crítico"
            value="0 itens"
            comparisonText="Part numbers críticos: Nenhum"
            trend="neutral"
            highlightColor="red"
            icon={AlertTriangle}
            badge="Alerta"
          />
        </div>
      </div>

      {/* Módulos */}
      <div className="mb-8">
        <h3 className="text-xl font-semibold text-gray-900 mb-6">Módulos do Sistema</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          <ModuleTile
            title="CO"
            description="Controlling"
            href="/co"
            icon={BarChart3}
            color="co"
            links={[
              { label: 'Dashboard', href: '/co/dashboard' },
              { label: 'Relatórios', href: '/co/reports' },
              { label: 'Análise de Custos', href: '/co/costs' }
            ]}
            badge="Ativo"
          />
          <ModuleTile
            title="MM"
            description="Material Management"
            href="/mm"
            icon={Package}
            color="mm"
            links={[
              { label: 'Catálogo', href: '/mm/catalog' },
              { label: 'Fornecedores', href: '/mm/vendors' },
              { label: 'Compras', href: '/mm/purchases' }
            ]}
            badge="Ativo"
          />
          <ModuleTile
            title="SD"
            description="Sales & Distribution"
            href="/sd"
            icon={ShoppingCart}
            color="sd"
            links={[
              { label: 'Pedidos', href: '/sd/orders' },
              { label: 'Clientes', href: '/sd/customers' },
              { label: 'Faturas', href: '/sd/invoices' }
            ]}
            badge="Ativo"
            badgeCount={5}
          />
          <ModuleTile
            title="WH"
            description="Warehouse"
            href="/wh"
            icon={Warehouse}
            color="wh"
            links={[
              { label: 'Estoque', href: '/wh/inventory' },
              { label: 'Movimentações', href: '/wh/movements' },
              { label: 'Relatórios', href: '/wh/reports' }
            ]}
            badge="Ativo"
          />
          <ModuleTile
            title="CRM"
            description="Customer Relationship"
            href="/crm"
            icon={Users}
            color="crm"
            links={[
              { label: 'Leads', href: '/crm/leads' },
              { label: 'Oportunidades', href: '/crm/opportunities' },
              { label: 'Atividades', href: '/crm/activities' }
            ]}
            badge="Ativo"
            badgeCount={12}
          />
          <ModuleTile
            title="FI"
            description="Financial Management"
            href="/fi"
            icon={DollarSign}
            color="fi"
            links={[
              { label: 'Contas a Pagar', href: '/fi/payables' },
              { label: 'Contas a Receber', href: '/fi/receivables' },
              { label: 'Fluxo de Caixa', href: '/fi/cashflow' }
            ]}
            badge="Ativo"
          />
          <ModuleTile
            title="Analytics"
            description="Business Intelligence"
            href="/analytics"
            icon={TrendingUp}
            color="analytics"
            links={[
              { label: 'Dashboards', href: '/analytics/dashboards' },
              { label: 'Relatórios', href: '/analytics/reports' },
              { label: 'KPIs', href: '/analytics/kpis' }
            ]}
            badge="Ativo"
          />
          <ModuleTile
            title="Setup"
            description="System Configuration"
            href="/setup"
            icon={Settings}
            color="co"
            links={[
              { label: 'Usuários', href: '/setup/users' },
              { label: 'Configurações', href: '/setup/config' },
              { label: 'Integrações', href: '/setup/integrations' }
            ]}
            badge="Config"
          />
        </div>
      </div>

      {/* Atividades Recentes */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100">
        <div className="px-6 py-4 border-b border-gray-100">
          <h3 className="text-lg font-semibold text-gray-900">Atividades Recentes</h3>
        </div>
        <div className="p-6">
          <div className="text-center text-gray-500 py-8">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <BarChart3 className="h-8 w-8 text-gray-400" />
            </div>
            <p className="text-lg font-medium text-gray-900 mb-2">Nenhuma atividade recente</p>
            <p className="text-sm text-gray-500">Configure o sistema para visualizar atividades</p>
          </div>
        </div>
      </div>
    </div>
  )
}