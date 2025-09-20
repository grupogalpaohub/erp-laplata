export const dynamic = 'force-dynamic'
export const revalidate = 0

import ModuleTile from '@/src/components/ui/ModuleTile'
import TileGrid from '@/src/components/ui/TileGrid'
import SectionHeader from '@/src/components/ui/SectionHeader'

export default async function MMIndex() {
  return (
    <main className="mx-auto max-w-7xl px-4 py-6 space-y-6">
      <SectionHeader title="Materiais (MM)" subtitle="Cadastros e compras" />
      <TileGrid>
        <ModuleTile
          href="/mm/materials/new"
          title="Cadastro de Materiais"
          description="Criar novo material"
          accent="teal"
        />
        <ModuleTile
          href="/mm/materials/edit"
          title="Edição de Materiais"
          description="Editar e atualizar materiais"
          accent="blue"
        />
        <ModuleTile
          href="/mm/catalog"
          title="Catálogo de Materiais"
          description="Consulta com filtros e status"
          accent="sky"
        />
        <ModuleTile
          href="/mm/purchases/new"
          title="Criar Pedido de Compras"
          description="Gerar novo P.O."
          accent="green"
        />
        <ModuleTile
          href="/mm/purchases"
          title="Pedidos de Compras"
          description="Listagem e filtros"
          accent="orange"
        />
      </TileGrid>
    </main>
  )
}