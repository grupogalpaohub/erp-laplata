export const dynamic = 'force-dynamic'
export const revalidate = 0

import ModuleTile from '@/src/components/ui/ModuleTile'
import TileGrid from '@/src/components/ui/TileGrid'
import SectionHeader from '@/src/components/ui/SectionHeader'
import Link from 'next/link'

export default async function HomePage() {
  return (
    <main className="mx-auto max-w-7xl px-4 py-6 space-y-8">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gray-900 mb-2">ERP LaPlata</h1>
        <p className="text-xl text-gray-600">Sistema de Gestão Empresarial</p>
        <p className="text-gray-500 mt-2">Selecione um módulo para começar</p>
      </div>

             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
               <Link href="/mm" className="tile-fiori group">
                 <div className="tile-fiori-header">
                   <div className="tile-fiori-icon bg-blue-100 group-hover:bg-blue-200">
                     <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                     </svg>
                   </div>
                 </div>
                 <h3 className="tile-fiori-title">Materiais (MM)</h3>
                 <p className="tile-fiori-subtitle">Materiais, compras, fornecedores</p>
               </Link>

        <Link href="/sd" className="tile-fiori group">
          <div className="tile-fiori-header">
            <div className="tile-fiori-icon bg-green-100 group-hover:bg-green-200">
              <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
            </div>
          </div>
          <h3 className="tile-fiori-title">Vendas (SD)</h3>
          <p className="tile-fiori-subtitle">Pedidos, clientes, faturas</p>
        </Link>

        <Link href="/wh" className="tile-fiori group">
          <div className="tile-fiori-header">
            <div className="tile-fiori-icon bg-orange-100 group-hover:bg-orange-200">
              <svg className="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
              </svg>
            </div>
          </div>
          <h3 className="tile-fiori-title">Estoque (WH)</h3>
          <p className="tile-fiori-subtitle">Inventário e movimentações</p>
        </Link>

        <Link href="/co" className="tile-fiori group">
          <div className="tile-fiori-header">
            <div className="tile-fiori-icon bg-purple-100 group-hover:bg-purple-200">
              <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
          </div>
          <h3 className="tile-fiori-title">Controle (CO)</h3>
          <p className="tile-fiori-subtitle">Relatórios e custos</p>
        </Link>
      </div>

      <div className="text-center pt-4">
        <Link href="/analytics" className="btn-fiori-outline">
          Ver Analytics
        </Link>
      </div>
    </main>
  )
}