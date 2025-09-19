import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'ERP LaPlata - Sistema de Gestão',
  description: 'Sistema ERP completo para gestão empresarial',
}

export default function ErpLaplataPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            ERP LaPlata
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            Sistema de Gestão Empresarial Completo
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-12">
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">
              Gestão de Materiais (MM)
            </h3>
            <p className="text-gray-600">
              Controle completo de materiais, fornecedores e compras
            </p>
          </div>
          
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">
              Gestão de Vendas (SD)
            </h3>
            <p className="text-gray-600">
              Processo completo de vendas e relacionamento com clientes
            </p>
          </div>
          
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">
              Gestão de Estoque (WH)
            </h3>
            <p className="text-gray-600">
              Controle de inventário e movimentações de estoque
            </p>
          </div>
          
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">
              Gestão Financeira (FI)
            </h3>
            <p className="text-gray-600">
              Contas a pagar, receber e fluxo de caixa
            </p>
          </div>
          
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">
              CRM
            </h3>
            <p className="text-gray-600">
              Gestão de relacionamento com clientes e leads
            </p>
          </div>
          
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">
              Controle Operacional (CO)
            </h3>
            <p className="text-gray-600">
              Dashboards e relatórios operacionais
            </p>
          </div>
        </div>
        
        <div className="mt-12 text-center">
          <div className="bg-blue-50 rounded-lg p-8">
            <h2 className="text-2xl font-bold text-blue-900 mb-4">
              Tecnologias Utilizadas
            </h2>
            <div className="flex flex-wrap justify-center gap-4 text-sm text-blue-700">
              <span className="bg-blue-100 px-3 py-1 rounded-full">Next.js 14</span>
              <span className="bg-blue-100 px-3 py-1 rounded-full">React</span>
              <span className="bg-blue-100 px-3 py-1 rounded-full">TypeScript</span>
              <span className="bg-blue-100 px-3 py-1 rounded-full">Tailwind CSS</span>
              <span className="bg-blue-100 px-3 py-1 rounded-full">Supabase</span>
              <span className="bg-blue-100 px-3 py-1 rounded-full">Vercel</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
