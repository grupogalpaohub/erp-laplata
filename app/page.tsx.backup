import FioriTile from '@/components/FioriTile'

export default async function HomePage() {
  return (
    <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      <FioriTile title="Pedidos Hoje" value={0} kpiState="warn" footer="Atualizado agora" href="/sd/orders" />
      <FioriTile title="Receita do Mês" value="R$ 0,00" kpiState="good" href="/fi" />
      <FioriTile title="Leads Ativos" value={0} href="/crm" />
      <FioriTile title="Estoque Crítico" value={0} kpiState="bad" href="/wh/inventory" />
      <FioriTile title="Fornecedores" value={0} href="/mm/vendors" />
      <FioriTile title="Catálogo" value="MM" href="/mm/catalog" />
    </div>
  )
}
