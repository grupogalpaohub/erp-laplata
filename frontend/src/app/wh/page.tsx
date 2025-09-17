'use client'

import { ModuleTile } from '@/components/ModuleTile'
import { Warehouse, Package, ArrowRightLeft, BarChart3, Settings } from 'lucide-react'

const whModules = [
  {
    title: "Depósitos",
    description: "Gestão de depósitos e localizações",
    icon: Warehouse,
    href: "/wh/warehouses",
    actions: [
      { label: "Novo Depósito", href: "/wh/warehouses/new" },
      { label: "Localizações", href: "/wh/warehouses/locations" },
      { label: "Configurações", href: "/wh/warehouses/settings" }
    ]
  },
  {
    title: "Estoque",
    description: "Gestão de inventário e saldos",
    icon: Package,
    href: "/wh/inventory",
    actions: [
      { label: "Consulta Estoque", href: "/wh/inventory/query" },
      { label: "Ajustes", href: "/wh/inventory/adjustments" },
      { label: "Contagem", href: "/wh/inventory/counting" }
    ]
  },
  {
    title: "Movimentações",
    description: "Histórico de movimentações de estoque",
    icon: ArrowRightLeft,
    href: "/wh/movements",
    actions: [
      { label: "Entradas", href: "/wh/movements/inbound" },
      { label: "Saídas", href: "/wh/movements/outbound" },
      { label: "Transferências", href: "/wh/movements/transfers" }
    ]
  },
  {
    title: "Relatórios",
    description: "Relatórios e análises de estoque",
    icon: BarChart3,
    href: "/wh/reports",
    actions: [
      { label: "Posição Estoque", href: "/wh/reports/position" },
      { label: "Movimentações", href: "/wh/reports/movements" },
      { label: "Valorização", href: "/wh/reports/valuation" }
    ]
  },
  {
    title: "Setup",
    description: "Configurações do módulo WH",
    icon: Settings,
    href: "/setup/wh",
    actions: [
      { label: "Configurações", href: "/setup/wh/settings" },
      { label: "Políticas", href: "/setup/wh/policies" },
      { label: "Estratégias", href: "/setup/wh/strategies" }
    ]
  }
]

export default function WHPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">WH - Depósitos & Estoque</h1>
        <p className="text-muted-foreground">
          Gestão completa de depósitos, estoque e movimentações
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {whModules.map((module, index) => (
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