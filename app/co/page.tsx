'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { TrendingUp, DollarSign, BarChart3, Target, ArrowLeft } from 'lucide-react'
import { formatBRL } from '@/lib/money'

interface COKPIs {
  totalRevenue: number
  totalCosts: number
  grossMargin: number
  grossMarginPercent: number
  averageMargin: number
  topPerformingProduct: string
}

export default function CODashboard() {
  const [kpis, setKpis] = useState<COKPIs>({
    totalRevenue: 0,
    totalCosts: 0,
    grossMargin: 0,
    grossMarginPercent: 0,
    averageMargin: 0,
    topPerformingProduct: 'N/A'
  })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const loadKPIs = async () => {
      try {
        // Por enquanto, usar dados mockados
        // Futuramente, buscar da API
        setKpis({
          totalRevenue: 25000000, // R$ 250.000,00 em centavos
          totalCosts: 15000000, // R$ 150.000,00 em centavos
          grossMargin: 10000000, // R$ 100.000,00 em centavos
          grossMarginPercent: 40.0,
          averageMargin: 40.0,
          topPerformingProduct: 'B_001 - Brinco Prata'
        })
      } catch (err) {
        console.error('Erro ao carregar KPIs:', err)
        setError('Erro ao carregar dados de controle')
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
          <h1 className="text-4xl font-bold text-fiori-primary mb-4">Controle Gerencial</h1>
          <p className="text-xl text-fiori-secondary mb-2">Carregando...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-fiori-primary mb-4">Controle Gerencial</h1>
        <p className="text-xl text-fiori-secondary mb-2">Análise de custos e margens</p>
        <p className="text-lg text-fiori-muted">Monitore rentabilidade e performance</p>
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
              <p className="text-sm font-medium text-fiori-muted">Receita Total</p>
              <p className="text-2xl font-bold text-fiori-primary">
                {formatBRL(kpis.totalRevenue)}
              </p>
            </div>
            <TrendingUp className="w-8 h-8 text-green-600" />
          </div>
        </div>

        <div className="card-fiori">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-fiori-muted">Custos Totais</p>
              <p className="text-2xl font-bold text-fiori-primary">
                {formatBRL(kpis.totalCosts)}
              </p>
            </div>
            <DollarSign className="w-8 h-8 text-red-600" />
          </div>
        </div>

        <div className="card-fiori">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-fiori-muted">Margem Bruta</p>
              <p className={`text-2xl font-bold ${
                kpis.grossMargin >= 0 ? 'text-green-600' : 'text-red-600'
              }`}>
                {formatBRL(kpis.grossMargin)}
              </p>
            </div>
            <BarChart3 className="w-8 h-8 text-fiori-primary" />
          </div>
        </div>

        <div className="card-fiori">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-fiori-muted">Margem %</p>
              <p className={`text-2xl font-bold ${
                kpis.grossMarginPercent >= 0 ? 'text-green-600' : 'text-red-600'
              }`}>
                {kpis.grossMarginPercent.toFixed(1)}%
              </p>
            </div>
            <Target className="w-8 h-8 text-blue-600" />
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="card-fiori">
          <h2 className="text-xl font-semibold mb-4">Ações Rápidas</h2>
          <div className="grid grid-cols-2 gap-4">
            <Link href="/co/product-costs" className="btn-fiori-primary">
              Custos de Produto
            </Link>
            <Link href="/co/margin-analysis" className="btn-fiori-outline">
              Análise de Margens
            </Link>
            <Link href="/co/budget-vs-actual" className="btn-fiori-outline">
              Orçado vs Real
            </Link>
            <Link href="/co/cost-centers" className="btn-fiori-outline">
              Centros de Custo
            </Link>
          </div>
        </div>

        <div className="card-fiori">
          <h2 className="text-xl font-semibold mb-4">Relatórios</h2>
          <div className="space-y-3">
            <Link href="/co/reports/margin-by-product" className="btn-fiori-outline w-full justify-start">
              Margem por Produto
            </Link>
            <Link href="/co/reports/cost-analysis" className="btn-fiori-outline w-full justify-start">
              Análise de Custos
            </Link>
            <Link href="/co/reports/profitability" className="btn-fiori-outline w-full justify-start">
              Rentabilidade
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}


