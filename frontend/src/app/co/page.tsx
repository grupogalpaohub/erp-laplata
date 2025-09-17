'use client'

import { ModuleTile } from '@/components/ModuleTile'
import { BarChart3, Target, Calendar, Settings } from 'lucide-react'

const coModules = [
  {
    title: "Dashboard",
    description: "Visão geral dos KPIs e indicadores",
    icon: BarChart3,
    href: "/co/dashboard",
    actions: [
      { label: "KPIs Gerais", href: "/co/dashboard/kpis" },
      { label: "Gráficos", href: "/co/dashboard/charts" },
      { label: "Personalizar", href: "/co/dashboard/customize" }
    ]
  },
  {
    title: "Centros de Custo",
    description: "Gestão de centros de custo e departamentos",
    icon: Target,
    href: "/co/cost-centers",
    actions: [
      { label: "Novo Centro", href: "/co/cost-centers/new" },
      { label: "Hierarquia", href: "/co/cost-centers/hierarchy" },
      { label: "Alocações", href: "/co/cost-centers/allocations" }
    ]
  },
  {
    title: "Períodos Fiscais",
    description: "Gestão de períodos e fechamentos",
    icon: Calendar,
    href: "/co/fiscal-periods",
    actions: [
      { label: "Novo Período", href: "/co/fiscal-periods/new" },
      { label: "Fechamentos", href: "/co/fiscal-periods/closings" },
      { label: "Histórico", href: "/co/fiscal-periods/history" }
    ]
  },
  {
    title: "Setup",
    description: "Configurações do módulo CO",
    icon: Settings,
    href: "/setup/co",
    actions: [
      { label: "Configurações", href: "/setup/co/settings" },
      { label: "KPIs", href: "/setup/co/kpis" },
      { label: "Tiles", href: "/setup/co/tiles" }
    ]
  }
]

export default function COPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">CO - Controladoria</h1>
        <p className="text-muted-foreground">
          Dashboards, relatórios e controle gerencial
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {coModules.map((module, index) => (
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