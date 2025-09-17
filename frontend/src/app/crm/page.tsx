'use client'

import { ModuleTile } from '@/components/ModuleTile'
import { Users, Target, MessageSquare, BarChart3, Settings } from 'lucide-react'

const crmModules = [
  {
    title: "Leads",
    description: "Gestão de leads e prospects",
    icon: Users,
    href: "/crm/leads",
    actions: [
      { label: "Novo Lead", href: "/crm/leads/new" },
      { label: "Importar Leads", href: "/crm/leads/import" },
      { label: "Segmentação", href: "/crm/leads/segmentation" }
    ]
  },
  {
    title: "Oportunidades",
    description: "Gestão de oportunidades de venda",
    icon: Target,
    href: "/crm/opportunities",
    actions: [
      { label: "Nova Oportunidade", href: "/crm/opportunities/new" },
      { label: "Pipeline", href: "/crm/opportunities/pipeline" },
      { label: "Previsões", href: "/crm/opportunities/forecasts" }
    ]
  },
  {
    title: "Interações",
    description: "Histórico de contatos e comunicações",
    icon: MessageSquare,
    href: "/crm/interactions",
    actions: [
      { label: "Nova Interação", href: "/crm/interactions/new" },
      { label: "Agenda", href: "/crm/interactions/calendar" },
      { label: "Templates", href: "/crm/interactions/templates" }
    ]
  },
  {
    title: "Relatórios",
    description: "Relatórios e análises de CRM",
    icon: BarChart3,
    href: "/crm/reports",
    actions: [
      { label: "Conversão", href: "/crm/reports/conversion" },
      { label: "Atividade", href: "/crm/reports/activity" },
      { label: "Performance", href: "/crm/reports/performance" }
    ]
  },
  {
    title: "Setup",
    description: "Configurações do módulo CRM",
    icon: Settings,
    href: "/setup/crm",
    actions: [
      { label: "Configurações", href: "/setup/crm/settings" },
      { label: "Status", href: "/setup/crm/status" },
      { label: "Fontes", href: "/setup/crm/sources" }
    ]
  }
]

export default function CRMPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">CRM - Leads & Oportunidades</h1>
        <p className="text-muted-foreground">
          Gestão completa de leads, oportunidades e relacionamento com clientes
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {crmModules.map((module, index) => (
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