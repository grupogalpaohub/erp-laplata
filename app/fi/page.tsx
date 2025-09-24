'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { DollarSign, TrendingUp, TrendingDown, BarChart3, ArrowLeft } from 'lucide-react'
import { formatBRL } from '@/lib/money'

interface FIKPIs {
  totalAssets: number
  totalLiabilities: number
  netWorth: number
  monthlyRevenue: number
}

export default function FIDashboard() {
  const [kpis, setKpis] = useState<FIKPIs>({
    totalAssets: 0,
    totalLiabilities: 0,
    netWorth: 0,
    monthlyRevenue: 0
  })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const loadKPIs = async () => {
      try {
        // Por enquanto, usar dados mockados
        // Futuramente, buscar da API
        setKpis({
          totalAssets: 50000000, // R$ 500.000,00 em centavos
          totalLiabilities: 20000000, // R$ 200.000,00 em centavos
          netWorth: 30000000, // R$ 300.000,00 em centavos
          monthlyRevenue: 15000000 // R$ 150.000,00 em centavos
        })
      } catch (err) {
        console.error('Erro ao carregar KPIs:', err)
        setError('Erro ao carregar dados financeiros')
      } finally {
        setLoading(false)
      }
    }

    loadKPIs()
  }, [])

  if (loading) {
    return (
      <div className="space-y-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-fiori-primary mb-4">Gestão Financeira</h1>
          <p className="text-xl text-fiori-secondary mb-2">Carregando...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-fiori-primary mb-4">Gestão Financeira</h1>
        <p className="text-xl text-fiori-secondary mb-2">Controle financeiro e contabilidade</p>
        <p className="text-lg text-fiori-muted">Monitore ativos, passivos e fluxo de caixa</p>
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-800 font-medium">{error}</p>
        </div>
      )}

      {/* Back Button */}
      <div className="flex justify-center">
        <Link href="/" className="btn-fiori-outline flex items-center gap-2">
          <ArrowLeft className="w-4 h-4" />
          Voltar ao Início
        </Link>
      </div>

      {/* KPIs Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="card-fiori">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-fiori-muted">Patrimônio Líquido</p>
              <p className={`text-2xl font-bold ${
                kpis.netWorth >= 0 ? 'text-green-600' : 'text-red-600'
              }`}>
                {formatBRL(kpis.netWorth)}
              </p>
            </div>
            <DollarSign className="w-8 h-8 text-fiori-primary" />
          </div>
        </div>

        <div className="card-fiori">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-fiori-muted">Total de Ativos</p>
              <p className="text-2xl font-bold text-fiori-primary">
                {formatBRL(kpis.totalAssets)}
              </p>
            </div>
            <TrendingUp className="w-8 h-8 text-green-600" />
          </div>
        </div>

        <div className="card-fiori">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-fiori-muted">Total de Passivos</p>
              <p className="text-2xl font-bold text-fiori-primary">
                {formatBRL(kpis.totalLiabilities)}
              </p>
            </div>
            <TrendingDown className="w-8 h-8 text-red-600" />
          </div>
        </div>

        <div className="card-fiori">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-fiori-muted">Receita do Mês</p>
              <p className="text-2xl font-bold text-fiori-primary">
                {formatBRL(kpis.monthlyRevenue)}
              </p>
            </div>
            <BarChart3 className="w-8 h-8 text-blue-600" />
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="card-fiori">
          <h2 className="text-xl font-semibold mb-4">Ações Rápidas</h2>
          <div className="grid grid-cols-2 gap-4">
            <Link href="/fi/chart-of-accounts" className="btn-fiori-primary">
              Plano de Contas
            </Link>
            <Link href="/fi/entries" className="btn-fiori-outline">
              Lançamentos
            </Link>
            <Link href="/fi/accounts-payable" className="btn-fiori-outline">
              Contas a Pagar
            </Link>
            <Link href="/fi/accounts-receivable" className="btn-fiori-outline">
              Contas a Receber
            </Link>
          </div>
        </div>

        <div className="card-fiori">
          <h2 className="text-xl font-semibold mb-4">Relatórios</h2>
          <div className="space-y-3">
            <Link href="/fi/reports/balance-sheet" className="btn-fiori-outline w-full justify-start">
              Balanço Patrimonial
            </Link>
            <Link href="/fi/reports/income-statement" className="btn-fiori-outline w-full justify-start">
              DRE - Demonstração de Resultado
            </Link>
            <Link href="/fi/reports/cash-flow" className="btn-fiori-outline w-full justify-start">
              Fluxo de Caixa
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}


