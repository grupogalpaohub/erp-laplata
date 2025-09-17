'use client'

import { ModuleTile } from '@/components/ModuleTile'
import { DollarSign, FileText, CreditCard, BarChart3, Settings } from 'lucide-react'

const fiModules = [
  {
    title: "Contas",
    description: "Gestão de contas bancárias e caixa",
    icon: DollarSign,
    href: "/fi/accounts",
    actions: [
      { label: "Nova Conta", href: "/fi/accounts/new" },
      { label: "Reconciliação", href: "/fi/accounts/reconciliation" },
      { label: "Extratos", href: "/fi/accounts/statements" }
    ]
  },
  {
    title: "Faturas",
    description: "Gestão de faturas e cobrança",
    icon: FileText,
    href: "/fi/invoices",
    actions: [
      { label: "Nova Fatura", href: "/fi/invoices/new" },
      { label: "Emissão", href: "/fi/invoices/issue" },
      { label: "Cobrança", href: "/fi/invoices/collection" }
    ]
  },
  {
    title: "Pagamentos",
    description: "Gestão de pagamentos e recebimentos",
    icon: CreditCard,
    href: "/fi/payments",
    actions: [
      { label: "Novo Pagamento", href: "/fi/payments/new" },
      { label: "Recebimentos", href: "/fi/payments/receipts" },
      { label: "Conciliação", href: "/fi/payments/reconciliation" }
    ]
  },
  {
    title: "Relatórios",
    description: "Relatórios e análises financeiras",
    icon: BarChart3,
    href: "/fi/reports",
    actions: [
      { label: "Fluxo de Caixa", href: "/fi/reports/cashflow" },
      { label: "DRE", href: "/fi/reports/income-statement" },
      { label: "Balanço", href: "/fi/reports/balance-sheet" }
    ]
  },
  {
    title: "Setup",
    description: "Configurações do módulo FI",
    icon: Settings,
    href: "/setup/fi",
    actions: [
      { label: "Configurações", href: "/setup/fi/settings" },
      { label: "Métodos Pagamento", href: "/setup/fi/payment-methods" },
      { label: "Moedas", href: "/setup/fi/currencies" }
    ]
  }
]

export default function FIPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">FI - Financeiro</h1>
        <p className="text-muted-foreground">
          Gestão completa de finanças, contas e pagamentos
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {fiModules.map((module, index) => (
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