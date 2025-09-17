'use client'

import { Header } from '@/components/layout/Header'
import { Sidebar } from '@/components/layout/Sidebar'

export default function ReportsPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar />
      <Header title="Warehouse Management" subtitle="Gestão de Estoque" />
      <main className="lg:ml-72 p-6">
        <h1 className="text-2xl font-bold text-gray-900">Relatórios de Estoque</h1>
        <p className="mt-2 text-gray-600">Análises e relatórios detalhados do estoque.</p>
        
        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <h3 className="text-lg font-semibold text-gray-900">Inventário</h3>
            <p className="mt-2 text-gray-600">Relatório completo de inventário</p>
          </div>
          
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <h3 className="text-lg font-semibold text-gray-900">Movimentações</h3>
            <p className="mt-2 text-gray-600">Histórico detalhado de movimentações</p>
          </div>
          
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <h3 className="text-lg font-semibold text-gray-900">Análises</h3>
            <p className="mt-2 text-gray-600">Análises de giro e performance</p>
          </div>
        </div>
      </main>
    </div>
  )
}

export const dynamic = 'force-dynamic'