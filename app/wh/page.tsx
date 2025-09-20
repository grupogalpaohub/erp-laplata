export const dynamic = 'force-dynamic'
export const revalidate = 0

import ModuleTile from '@/src/components/ui/ModuleTile'
import TileGrid from '@/src/components/ui/TileGrid'
import SectionHeader from '@/src/components/ui/SectionHeader'

export default function WHIndex() {
  return (
    <main className="mx-auto max-w-7xl px-4 py-6 space-y-6">
      <SectionHeader title="Estoque (WH)" subtitle="Inventário e movimentações" />
      <TileGrid>
        <ModuleTile href="/wh/inventory" title="Inventário" description="Saldos por material" accent="sky" />
        <ModuleTile href="/wh/movements" title="Movimentações" description="Entradas e saídas" accent="blue" />
        <ModuleTile href="/co/reports" title="Relatórios" description="Cobertura e rupturas" accent="orange" />
      </TileGrid>
    </main>
  )
}