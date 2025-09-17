'use client'

import { ModuleTile } from '@/components/ModuleTile'
import { ShoppingCart, Users, Truck, CreditCard, BarChart3, Settings } from 'lucide-react'

const sdModules = [
  {
    title: "Vendas",
    description: "Gestão de pedidos de venda",
    icon: ShoppingCart,
    href: "/sd/sales-orders",
    actions: [
      { label: "Nova Venda", href: "/sd/sales-orders/new" },
      { label: "Aprovações", href: "/sd/sales-orders/approvals" },
      { label: "Histórico", href: "/sd/sales-orders/history" }
    ]
  },
  {
    title: "Clientes",
    description: "Gestão de clientes e contatos",
    icon: Users,
    href: "/sd/customers",
    actions: [
      { label: "Novo Cliente", href: "/sd/customers/new" },
      { label: "Segmentação", href: "/sd/customers/segmentation" },
      { label: "Histórico", href: "/sd/customers/history" }
    ]
  },
  {
    title: "Expedições",
    description: "Gestão de envios e entregas",
    icon: Truck,
    href: "/sd/shipments",
    actions: [
      { label: "Nova Expedição", href: "/sd/shipments/new" },
      { label: "Rastreamento", href: "/sd/shipments/tracking" },
      { label: "Transportadoras", href: "/sd/shipments/carriers" }
    ]
  },
  {
    title: "Pagamentos",
    description: "Gestão de pagamentos e faturas",
    icon: CreditCard,
    href: "/sd/payments",
    actions: [
      { label: "Novo Pagamento", href: "/sd/payments/new" },
      { label: "Faturas", href: "/sd/payments/invoices" },
      { label: "Cobrança", href: "/sd/payments/collection" }
    ]
  },
  {
    title: "Relatórios",
    description: "Relatórios e análises de vendas",
    icon: BarChart3,
    href: "/sd/reports",
    actions: [
      { label: "Vendas", href: "/sd/reports/sales" },
      { label: "Clientes", href: "/sd/reports/customers" },
      { label: "Produtividade", href: "/sd/reports/productivity" }
    ]
  },
  {
    title: "Setup",
    description: "Configurações do módulo SD",
    icon: Settings,
    href: "/setup/sd",
    actions: [
      { label: "Configurações", href: "/setup/sd/settings" },
      { label: "Status", href: "/setup/sd/status" },
      { label: "Canais", href: "/setup/sd/channels" }
    ]
  }
]

export default function SDPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">SD - Vendas</h1>
        <p className="text-muted-foreground">
          Gestão completa de vendas, clientes e entregas
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {sdModules.map((module, index) => (
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