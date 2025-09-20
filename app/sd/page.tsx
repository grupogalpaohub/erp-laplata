export const dynamic = 'force-dynamic'
export const revalidate = 0

import ModuleTile from '@/src/components/ui/ModuleTile'
import TileGrid from '@/src/components/ui/TileGrid'
import SectionHeader from '@/src/components/ui/SectionHeader'

export default function SDIndex() {
  return (
    <main className="mx-auto max-w-7xl px-4 py-6 space-y-6">
      <SectionHeader title="Vendas (SD)" subtitle="Pedidos, clientes e faturamento" />
      <TileGrid>
        <ModuleTile href="/sd/orders/new" title="Criar Pedido de Vendas" description="Novo S.O." accent="green" />
        <ModuleTile href="/sd/orders" title="Pedidos de Vendas" description="Listagem e filtros" accent="orange" />
        <ModuleTile href="/sd/customers" title="Clientes" description="Cadastro e consulta" accent="teal" />
        <ModuleTile href="/sd/invoices" title="Faturas" description="Consulta e impressão" accent="purple" />
      </TileGrid>
    </main>
  )
}