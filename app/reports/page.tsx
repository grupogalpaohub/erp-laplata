import Link from 'next/link'
import { FileText, BarChart3, TrendingUp, Package, DollarSign, Users } from 'lucide-react'

export default function ReportsPage() {
  const reportCategories = [
    {
      title: 'Relatórios de Estoque',
      icon: Package,
      color: 'text-fiori-info',
      reports: [
        { name: 'Posição de Estoque', href: '/reports/inventory/position', description: 'Estoque atual por material' },
        { name: 'Movimentações de Estoque', href: '/reports/inventory/movements', description: 'Histórico de entradas e saídas' },
        { name: 'Análise ABC', href: '/reports/inventory/abc', description: 'Classificação por valor de estoque' },
        { name: 'Estoque Baixo', href: '/reports/inventory/low-stock', description: 'Materiais com estoque insuficiente' }
      ]
    },
    {
      title: 'Relatórios Financeiros',
      icon: DollarSign,
      color: 'text-fiori-success',
      reports: [
        { name: 'Balanço Patrimonial', href: '/reports/financial/balance-sheet', description: 'Posição financeira da empresa' },
        { name: 'Demonstração de Resultado', href: '/reports/financial/income-statement', description: 'Receitas, custos e lucros' },
        { name: 'Fluxo de Caixa', href: '/reports/financial/cash-flow', description: 'Entradas e saídas de caixa' },
        { name: 'Contas a Pagar', href: '/reports/financial/accounts-payable', description: 'Obrigações com fornecedores' },
        { name: 'Contas a Receber', href: '/reports/financial/accounts-receivable', description: 'Valores a receber de clientes' }
      ]
    },
    {
      title: 'Relatórios de Vendas',
      icon: TrendingUp,
      color: 'text-fiori-warning',
      reports: [
        { name: 'Vendas por Período', href: '/reports/sales/by-period', description: 'Vendas agrupadas por período' },
        { name: 'Vendas por Cliente', href: '/reports/sales/by-customer', description: 'Performance por cliente' },
        { name: 'Vendas por Produto', href: '/reports/sales/by-product', description: 'Performance por produto' },
        { name: 'Margem de Contribuição', href: '/reports/sales/contribution-margin', description: 'Análise de margens por produto' }
      ]
    },
    {
      title: 'Relatórios de Compras',
      icon: Package,
      color: 'text-fiori-danger',
      reports: [
        { name: 'Compras por Período', href: '/reports/purchases/by-period', description: 'Compras agrupadas por período' },
        { name: 'Compras por Fornecedor', href: '/reports/purchases/by-vendor', description: 'Performance por fornecedor' },
        { name: 'Análise de Preços', href: '/reports/purchases/price-analysis', description: 'Evolução de preços de compra' }
      ]
    },
    {
      title: 'Relatórios de Controle',
      icon: BarChart3,
      color: 'text-fiori-primary',
      reports: [
        { name: 'Custos por Produto', href: '/reports/controlling/product-costs', description: 'Análise de custos de produção' },
        { name: 'Análise de Rentabilidade', href: '/reports/controlling/profitability', description: 'Rentabilidade por produto/cliente' },
        { name: 'Orçado vs Real', href: '/reports/controlling/budget-vs-actual', description: 'Comparação orçamentária' }
      ]
    },
    {
      title: 'Relatórios de CRM',
      icon: Users,
      color: 'text-fiori-secondary',
      reports: [
        { name: 'Clientes Ativos', href: '/reports/crm/active-customers', description: 'Lista de clientes ativos' },
        { name: 'Performance de Vendas', href: '/reports/crm/sales-performance', description: 'Performance da equipe de vendas' },
        { name: 'Análise de Clientes', href: '/reports/crm/customer-analysis', description: 'Segmentação e análise de clientes' }
      ]
    }
  ]

  return (
    <div className="container-fiori">
      <div className="section-fiori">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-fiori-primary">Relatórios</h1>
            <p className="text-fiori-secondary mt-2">Relatórios e análises do ERP LaPlata</p>
          </div>
          <div className="flex gap-4">
            <Link href="/" className="btn-fiori-secondary">
              ← Voltar
            </Link>
            <Link href="/reports/custom" className="btn-fiori-primary">
              Relatório Personalizado
            </Link>
          </div>
        </div>

        {/* Grid de Categorias de Relatórios */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {reportCategories.map((category, index) => {
            const IconComponent = category.icon
            return (
              <div key={index} className="card-fiori">
                <div className="card-fiori-header">
                  <div className="flex items-center gap-3">
                    <IconComponent className={`w-6 h-6 ${category.color}`} />
                    <h2 className="card-fiori-title">{category.title}</h2>
                  </div>
                </div>
                <div className="card-fiori-body">
                  <div className="space-y-3">
                    {category.reports.map((report, reportIndex) => (
                      <Link
                        key={reportIndex}
                        href={report.href}
                        className="block p-3 rounded-lg border border-fiori-border hover:bg-fiori-surface transition-colors"
                      >
                        <div className="font-medium text-fiori-primary mb-1">
                          {report.name}
                        </div>
                        <div className="text-sm text-fiori-muted">
                          {report.description}
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              </div>
            )
          })}
        </div>

        {/* Relatórios Rápidos */}
        <div className="mt-8">
          <div className="card-fiori">
            <div className="card-fiori-header">
              <h2 className="card-fiori-title">Relatórios Rápidos</h2>
              <p className="card-fiori-subtitle">Acesso rápido aos relatórios mais utilizados</p>
            </div>
            <div className="card-fiori-body">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <Link
                  href="/reports/inventory/position"
                  className="btn-fiori-outline w-full justify-start"
                >
                  <Package className="w-4 h-4 mr-2" />
                  Posição de Estoque
                </Link>
                <Link
                  href="/reports/financial/balance-sheet"
                  className="btn-fiori-outline w-full justify-start"
                >
                  <DollarSign className="w-4 h-4 mr-2" />
                  Balanço Patrimonial
                </Link>
                <Link
                  href="/reports/sales/by-period"
                  className="btn-fiori-outline w-full justify-start"
                >
                  <TrendingUp className="w-4 h-4 mr-2" />
                  Vendas por Período
                </Link>
                <Link
                  href="/reports/controlling/profitability"
                  className="btn-fiori-outline w-full justify-start"
                >
                  <BarChart3 className="w-4 h-4 mr-2" />
                  Análise de Rentabilidade
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
