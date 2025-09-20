export const dynamic = 'force-dynamic'
export const revalidate = 0

import ModuleTile from '@/src/components/ui/ModuleTile'
import TileGrid from '@/src/components/ui/TileGrid'
import SectionHeader from '@/src/components/ui/SectionHeader'
import Link from 'next/link'

export default async function HomePage() {
  return (
    <main className="mx-auto max-w-7xl px-4 py-6 space-y-6">
      <SectionHeader title="ERP LaPlata" subtitle="Selecione um módulo para começar" />

      <TileGrid>
        <ModuleTile href="/mm" title="Materiais (MM)" description="Materiais, compras, fornecedores" accent="sky" />
        <ModuleTile href="/sd" title="Vendas (SD)" description="Pedidos, clientes, faturas" accent="green" />
        <ModuleTile href="/wh" title="Estoque (WH)" description="Inventário e movimentações" accent="orange" />
        <ModuleTile href="/co" title="Controle (CO)" description="Relatórios e custos" accent="purple" />
      </TileGrid>

      <div className="pt-2">
        <Link href="/analytics" className="text-sm underline text-fiori-muted">Ver analytics</Link>
      </div>
    </main>
  )
}