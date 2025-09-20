export const dynamic = 'force-dynamic'
export const revalidate = 0

import ModuleTile from '@/src/components/ui/ModuleTile'
import TileGrid from '@/src/components/ui/TileGrid'
import SectionHeader from '@/src/components/ui/SectionHeader'

export default function COIndex() {
  return (
    <main className="mx-auto max-w-7xl px-4 py-6 space-y-6">
      <SectionHeader title="Controle (CO)" subtitle="Custos e relatórios" />
      <TileGrid>
        <ModuleTile href="/co/dashboard" title="Dashboard" description="KPIs e insights" accent="purple" />
        <ModuleTile href="/co/costs" title="Custos" description="Apuração e simulações" accent="pink" />
        <ModuleTile href="/co/reports" title="Relatórios" description="Exportações e análises" accent="teal" />
      </TileGrid>
    </main>
  )
}
