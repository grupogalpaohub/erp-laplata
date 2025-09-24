'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Package, TrendingUp, AlertTriangle, BarChart3, ArrowLeft } from 'lucide-react'
import { formatBRL } from '@/lib/money'

interface WHKPIs {
  totalValue: number
  totalItems: number
  lowStockItems: number
  reservedItems: number
}

export default function WHDashboard() {
  const [kpis, setKpis] = useState<WHKPIs>({
    totalValue: 0,
    totalItems: 0,
    lowStockItems: 0,
    reservedItems: 0
  })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const loadKPIs = async () => {
      try {
        // Por enquanto, usar dados mockados
        // Futuramente, buscar da API
        setKpis({
          totalValue: 15000000, // R$ 150.000,00 em centavos
          totalItems: 45,
          lowStockItems: 8,
          reservedItems: 12
        })
      } catch (err) {
        console.error('Erro ao carregar KPIs:', err)
        setError('Erro ao carregar dados do estoque')
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
          <h1 className="text-4xl font-bold text-fiori-primary mb-4">Gestão de Estoque</h1>
          <p className="text-xl text-fiori-secondary mb-2">Carregando...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-fiori-primary mb-4">Gestão de Estoque</h1>
        <p className="text-xl text-fiori-secondary mb-2">Controle de inventário e movimentações</p>
        <p className="text-lg text-fiori-muted">Monitore estoque, transferências e MRP</p>
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
              <p className="text-sm font-medium text-fiori-muted">Valor Total do Estoque</p>
              <p className="text-2xl font-bold text-fiori-primary">
                {formatBRL(kpis.totalValue)}
              </p>
            </div>
            <Package className="w-8 h-8 text-fiori-primary" />
          </div>
        </div>

        <div className="card-fiori">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-fiori-muted">Total de Itens</p>
              <p className="text-2xl font-bold text-fiori-primary">{kpis.totalItems}</p>
            </div>
            <BarChart3 className="w-8 h-8 text-fiori-primary" />
          </div>
        </div>

        <div className="card-fiori">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-fiori-muted">Estoque Baixo</p>
              <p className="text-2xl font-bold text-yellow-600">{kpis.lowStockItems}</p>
            </div>
            <AlertTriangle className="w-8 h-8 text-yellow-600" />
          </div>
        </div>

        <div className="card-fiori">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-fiori-muted">Itens Reservados</p>
              <p className="text-2xl font-bold text-blue-600">{kpis.reservedItems}</p>
            </div>
            <TrendingUp className="w-8 h-8 text-blue-600" />
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="card-fiori">
          <h2 className="text-xl font-semibold mb-4">Ações Rápidas</h2>
          <div className="grid grid-cols-2 gap-4">
            <Link href="/wh/inventory" className="btn-fiori-primary">
              Ver Estoque
            </Link>
            <Link href="/wh/movements" className="btn-fiori-outline">
              Movimentações
            </Link>
            <Link href="/wh/transfers" className="btn-fiori-outline">
              Transferências
            </Link>
            <Link href="/wh/mrp" className="btn-fiori-outline">
              MRP
            </Link>
          </div>
        </div>

        <div className="card-fiori">
          <h2 className="text-xl font-semibold mb-4">MRP - Sugestões</h2>
          <p className="text-fiori-muted mb-4">
            Análise de necessidades de compra baseada em vendas dos últimos 90 dias.
          </p>
          <Link href="/wh/mrp" className="btn-fiori-primary">
            Ver Sugestões
          </Link>
        </div>
      </div>
    </div>
  )
}

