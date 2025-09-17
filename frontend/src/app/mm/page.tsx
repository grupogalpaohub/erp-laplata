'use client'

import { useAuth } from '@/contexts/AuthContext'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import { Sidebar } from '@/components/layout/Sidebar'
import { Header } from '@/components/layout/Header'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { Package, Users, ShoppingCart, BarChart3 } from 'lucide-react'

export default function MMPage() {
  const { user, loading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login')
    }
  }, [user, loading, router])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  if (!user) {
    return null
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar />
      <Header title="Material Management" subtitle="Gestão de materiais e fornecedores" />
      
      <div className="lg:ml-72 p-6">
        {/* Breadcrumbs */}
        <div className="mb-6">
          <nav className="flex" aria-label="Breadcrumb">
            <ol className="inline-flex items-center space-x-1 md:space-x-3">
              <li className="inline-flex items-center">
                <a href="/dashboard" className="text-gray-700 hover:text-blue-600">
                  Dashboard
                </a>
              </li>
              <li>
                <div className="flex items-center">
                  <span className="text-gray-400 mx-2">/</span>
                  <span className="text-gray-500">Material Management</span>
                </div>
              </li>
            </ol>
          </nav>
        </div>

        {/* Module Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Package className="h-5 w-5 mr-2 text-blue-600" />
                Catálogo de Materiais
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 mb-4">Gerencie o catálogo de materiais e produtos</p>
              <a 
                href="/mm/catalog" 
                className="inline-flex items-center text-blue-600 hover:text-blue-800"
              >
                Acessar Catálogo →
              </a>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Users className="h-5 w-5 mr-2 text-green-600" />
                Fornecedores
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 mb-4">Gerencie fornecedores e suas informações</p>
              <a 
                href="/mm/vendors" 
                className="inline-flex items-center text-blue-600 hover:text-blue-800"
              >
                Acessar Fornecedores →
              </a>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center">
                <ShoppingCart className="h-5 w-5 mr-2 text-purple-600" />
                Compras
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 mb-4">Gerencie pedidos de compra e recebimentos</p>
              <a 
                href="/mm/purchases" 
                className="inline-flex items-center text-blue-600 hover:text-blue-800"
              >
                Acessar Compras →
              </a>
            </CardContent>
          </Card>
        </div>

        {/* Recent Activity */}
        <div className="mt-8">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <BarChart3 className="h-5 w-5 mr-2" />
                Atividades Recentes - MM
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center text-gray-500 py-8">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Package className="h-8 w-8 text-gray-400" />
                </div>
                <p className="text-lg font-medium text-gray-900 mb-2">Nenhuma atividade recente</p>
                <p className="text-sm text-gray-500">Os dados aparecerão aqui conforme você usar o sistema</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

export const dynamic = 'force-dynamic'