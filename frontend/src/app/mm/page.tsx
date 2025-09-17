'use client'

import { ModuleTile } from '@/components/ModuleTile'
import { Package, ShoppingCart, Truck, BarChart3, Settings } from 'lucide-react'

const mmModules = [
  {
    title: "Materiais",
    description: "Gestão de materiais e produtos",
    icon: Package,
    href: "/mm/materials",
    actions: [
      { label: "Novo Material", href: "/mm/materials/new" },
      { label: "Categorias", href: "/mm/materials/categories" },
      { label: "Importar", href: "/mm/materials/import" }
    ]
  },
  {
    title: "Fornecedores",
    description: "Gestão de fornecedores e parceiros",
    icon: ShoppingCart,
    href: "/mm/vendors",
    actions: [
      { label: "Novo Fornecedor", href: "/mm/vendors/new" },
      { label: "Avaliações", href: "/mm/vendors/ratings" },
      { label: "Contratos", href: "/mm/vendors/contracts" }
    ]
  },
  {
    title: "Compras",
    description: "Gestão de pedidos de compra",
    icon: Truck,
    href: "/mm/purchase-orders",
    actions: [
      { label: "Nova Compra", href: "/mm/purchase-orders/new" },
      { label: "Recebimentos", href: "/mm/receiving" },
      { label: "Aprovações", href: "/mm/purchase-orders/approvals" }
    ]
  },
  {
    title: "Relatórios",
    description: "Relatórios e análises de materiais",
    icon: BarChart3,
    href: "/mm/reports",
    actions: [
      { label: "Consumo", href: "/mm/reports/consumption" },
      { label: "Fornecedores", href: "/mm/reports/vendors" },
      { label: "Compras", href: "/mm/reports/purchases" }
    ]
  },
  {
    title: "Setup",
    description: "Configurações do módulo MM",
    icon: Settings,
    href: "/setup/mm",
    actions: [
      { label: "Configurações", href: "/setup/mm/settings" },
      { label: "Categorias", href: "/setup/mm/categories" },
      { label: "Status", href: "/setup/mm/status" }
    ]
  }
]

export default function MMPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">MM - Materiais & Fornecedores</h1>
        <p className="text-muted-foreground">
          Gestão completa de materiais, fornecedores e compras
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {mmModules.map((module, index) => (
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