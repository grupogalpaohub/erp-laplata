'use client'

import { KpiCard } from '@/components/KpiCard'
import { ModuleTile } from '@/components/ModuleTile'
import { 
  Package, 
  ShoppingCart, 
  Warehouse, 
  Users, 
  DollarSign, 
  BarChart3,
  Settings,
  Plus,
  FileText,
  TrendingUp
} from 'lucide-react'

// Mock data - será substituído por dados reais do Supabase
const kpiData = [
  {
    title: "Pedidos Hoje",
    value: "12",
    comparisonText: "Média diária do mês: 15",
    trend: "down" as const
  },
  {
    title: "Receita do Mês",
    value: "R$ 45.230",
    comparisonText: "Média mensal histórica: R$ 52.100",
    trend: "down" as const
  },
  {
    title: "Leads Ativos (semana)",
    value: "8",
    comparisonText: "Média mensal: 12",
    trend: "down" as const
  },
  {
    title: "Estoque Crítico (itens)",
    value: "3",
    comparisonText: "PNs críticos · Tendência de consumo",
    trend: "neutral" as const
  }
]

const modules = [
  {
    title: "MM - Materiais",
    description: "Gestão de materiais e fornecedores",
    icon: Package,
    href: "/mm",
    actions: [
      { label: "Novo Material", href: "/mm/materials/new" },
      { label: "Nova Compra", href: "/mm/purchase-orders/new" },
      { label: "Setup", href: "/setup/mm" }
    ]
  },
  {
    title: "SD - Vendas",
    description: "Gestão de vendas e clientes",
    icon: ShoppingCart,
    href: "/sd",
    actions: [
      { label: "Nova Venda", href: "/sd/sales-orders/new" },
      { label: "Clientes", href: "/sd/customers" },
      { label: "Setup", href: "/setup/sd" }
    ]
  },
  {
    title: "WH - Depósitos",
    description: "Gestão de estoque e depósitos",
    icon: Warehouse,
    href: "/wh",
    actions: [
      { label: "Estoque", href: "/wh/inventory" },
      { label: "Movimentações", href: "/wh/movements" },
      { label: "Setup", href: "/setup/wh" }
    ]
  },
  {
    title: "CRM - Leads",
    description: "Gestão de leads e oportunidades",
    icon: Users,
    href: "/crm",
    actions: [
      { label: "Novo Lead", href: "/crm/leads/new" },
      { label: "Oportunidades", href: "/crm/opportunities" },
      { label: "Setup", href: "/setup/crm" }
    ]
  },
  {
    title: "FI - Financeiro",
    description: "Gestão financeira e contas",
    icon: DollarSign,
    href: "/fi",
    actions: [
      { label: "Faturas", href: "/fi/invoices" },
      { label: "Pagamentos", href: "/fi/payments" },
      { label: "Setup", href: "/setup/fi" }
    ]
  },
  {
    title: "CO - Controladoria",
    description: "Dashboards e relatórios",
    icon: BarChart3,
    href: "/co",
    actions: [
      { label: "Dashboard", href: "/co/dashboard" },
      { label: "Relatórios", href: "/co/reports" },
      { label: "Setup", href: "/setup/co" }
    ]
  }
]

export default function LaunchpadPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Launchpad</h1>
        <p className="text-muted-foreground">
          Visão geral do sistema e acesso rápido aos módulos
        </p>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {kpiData.map((kpi, index) => (
          <KpiCard
            key={index}
            title={kpi.title}
            value={kpi.value}
            comparisonText={kpi.comparisonText}
            trend={kpi.trend}
          />
        ))}
      </div>

      {/* Módulos */}
      <div>
        <h2 className="text-2xl font-semibold tracking-tight mb-4">Módulos do Sistema</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {modules.map((module, index) => (
            <ModuleTile
              key={index}
              title={module.title}
              description={module.description}
              icon={module.icon}
              href={module.href}
              actions={module.actions}
            />
          ))}
        </div>
      </div>

      {/* Ações Rápidas */}
      <div>
        <h2 className="text-2xl font-semibold tracking-tight mb-4">Ações Rápidas</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <ModuleTile
            title="Criar Documento"
            description="Acesso rápido para criar novos documentos"
            icon={Plus}
            href="/create"
            actions={[
              { label: "Nova Compra", href: "/mm/purchase-orders/new" },
              { label: "Nova Venda", href: "/sd/sales-orders/new" },
              { label: "Novo Lead", href: "/crm/leads/new" }
            ]}
          />
          <ModuleTile
            title="Central de Relatórios"
            description="Relatórios e análises do sistema"
            icon={FileText}
            href="/reports"
            actions={[
              { label: "Vendas", href: "/reports/sales" },
              { label: "Estoque", href: "/reports/inventory" },
              { label: "Financeiro", href: "/reports/financial" }
            ]}
          />
          <ModuleTile
            title="Configurações"
            description="Configurações gerais do sistema"
            icon: Settings,
            href="/setup"
            actions={[
              { label: "Usuários", href: "/setup/users" },
              { label: "Empresa", href: "/setup/company" },
              { label: "Integrações", href: "/setup/integrations" }
            ]}
          />
        </div>
      </div>
    </div>
  )
}