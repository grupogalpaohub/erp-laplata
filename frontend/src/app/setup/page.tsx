'use client'

import { ModuleTile } from '@/components/ModuleTile'
import { Package, ShoppingCart, Warehouse, Users, DollarSign, BarChart3, Settings } from 'lucide-react'

const setupModules = [
  {
    title: "MM - Materiais",
    description: "Configurações de materiais e fornecedores",
    icon: Package,
    href: "/setup/mm",
    actions: [
      { label: "Configurações", href: "/setup/mm/settings" },
      { label: "Categorias", href: "/setup/mm/categories" },
      { label: "Status", href: "/setup/mm/status" }
    ]
  },
  {
    title: "SD - Vendas",
    description: "Configurações de vendas e clientes",
    icon: ShoppingCart,
    href: "/setup/sd",
    actions: [
      { label: "Configurações", href: "/setup/sd/settings" },
      { label: "Status", href: "/setup/sd/status" },
      { label: "Canais", href: "/setup/sd/channels" }
    ]
  },
  {
    title: "WH - Depósitos",
    description: "Configurações de depósitos e estoque",
    icon: Warehouse,
    href: "/setup/wh",
    actions: [
      { label: "Configurações", href: "/setup/wh/settings" },
      { label: "Políticas", href: "/setup/wh/policies" },
      { label: "Estratégias", href: "/setup/wh/strategies" }
    ]
  },
  {
    title: "CRM - Leads",
    description: "Configurações de CRM e leads",
    icon: Users,
    href: "/setup/crm",
    actions: [
      { label: "Configurações", href: "/setup/crm/settings" },
      { label: "Status", href: "/setup/crm/status" },
      { label: "Fontes", href: "/setup/crm/sources" }
    ]
  },
  {
    title: "FI - Financeiro",
    description: "Configurações financeiras",
    icon: DollarSign,
    href: "/setup/fi",
    actions: [
      { label: "Configurações", href: "/setup/fi/settings" },
      { label: "Métodos Pagamento", href: "/setup/fi/payment-methods" },
      { label: "Moedas", href: "/setup/fi/currencies" }
    ]
  },
  {
    title: "CO - Controladoria",
    description: "Configurações de controladoria",
    icon: BarChart3,
    href: "/setup/co",
    actions: [
      { label: "Configurações", href: "/setup/co/settings" },
      { label: "KPIs", href: "/setup/co/kpis" },
      { label: "Tiles", href: "/setup/co/tiles" }
    ]
  },
  {
    title: "Sistema",
    description: "Configurações gerais do sistema",
    icon: Settings,
    href: "/setup/system",
    actions: [
      { label: "Usuários", href: "/setup/system/users" },
      { label: "Empresa", href: "/setup/system/company" },
      { label: "Integrações", href: "/setup/system/integrations" }
    ]
  }
]

export default function SetupPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Setup & Configurações</h1>
        <p className="text-muted-foreground">
          Configurações e customizações de todos os módulos do sistema
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {setupModules.map((module, index) => (
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
  )
}