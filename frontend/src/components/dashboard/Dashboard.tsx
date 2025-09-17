'use client'

import { KpiCard } from '@/components/ui/KpiCard'
import { ModuleTile } from '@/components/ui/ModuleTile'

export function Dashboard() {
  return (
    <div className="p-6">
      {/* KPIs */}
      <div className="mb-8">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Indicadores Principais</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <KpiCard
            title="Vendas do Mês"
            value="R$ 0,00"
            change="0%"
            trend="neutral"
          />
          <KpiCard
            title="Pedidos Pendentes"
            value="0"
            change="0%"
            trend="neutral"
          />
          <KpiCard
            title="Estoque Total"
            value="0 itens"
            change="0%"
            trend="neutral"
          />
          <KpiCard
            title="Clientes Ativos"
            value="0"
            change="0%"
            trend="neutral"
          />
        </div>
      </div>

      {/* Módulos */}
      <div className="mb-8">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Módulos do Sistema</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <ModuleTile
            title="MM/WH"
            description="Material Management & Warehouse"
            href="/mm-wh"
            icon="Package"
            color="blue"
          />
          <ModuleTile
            title="SD"
            description="Sales & Distribution"
            href="/sd"
            icon="ShoppingCart"
            color="green"
          />
          <ModuleTile
            title="CRM"
            description="Customer Relationship Management"
            href="/crm"
            icon="Users"
            color="purple"
          />
          <ModuleTile
            title="FI"
            description="Financial Management"
            href="/fi"
            icon="DollarSign"
            color="yellow"
          />
          <ModuleTile
            title="CO"
            description="Controlling"
            href="/co"
            icon="BarChart3"
            color="red"
          />
          <ModuleTile
            title="Setup"
            description="System Configuration"
            href="/setup"
            icon="Settings"
            color="gray"
          />
        </div>
      </div>

      {/* Tabela de Dados Recentes */}
      <div className="bg-white rounded-lg shadow">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">Dados Recentes</h3>
        </div>
        <div className="p-6">
          <div className="text-center text-gray-500 py-8">
            <p>Nenhum dado disponível</p>
            <p className="text-sm mt-2">Configure o sistema para visualizar dados</p>
          </div>
        </div>
      </div>
    </div>
  )
}