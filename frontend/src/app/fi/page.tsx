'use client'

import { useAuth } from '@/contexts/AuthContext'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import { Sidebar } from '@/components/layout/Sidebar'
import { Header } from '@/components/layout/Header'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { DollarSign, CreditCard, TrendingUp, BarChart3 } from 'lucide-react'

export default function FIPage() {
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
      <Header title="Financial Management" subtitle="Gestão financeira" />
      
      <div className="lg:ml-72 p-6">
        <div className="mb-6">
          <nav className="flex" aria-label="Breadcrumb">
            <ol className="inline-flex items-center space-x-1 md:space-x-3">
              <li className="inline-flex items-center">
                <a href="/dashboard" className="text-gray-700 hover:text-blue-600">Dashboard</a>
              </li>
              <li>
                <div className="flex items-center">
                  <span className="text-gray-400 mx-2">/</span>
                  <span className="text-gray-500">Financial Management</span>
                </div>
              </li>
            </ol>
          </nav>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center">
                <DollarSign className="h-5 w-5 mr-2 text-blue-600" />
                Contas a Pagar
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 mb-4">Gerencie contas a pagar</p>
              <a href="/fi/payables" className="inline-flex items-center text-blue-600 hover:text-blue-800">
                Acessar Contas a Pagar →
              </a>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center">
                <CreditCard className="h-5 w-5 mr-2 text-green-600" />
                Contas a Receber
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 mb-4">Gerencie contas a receber</p>
              <a href="/fi/receivables" className="inline-flex items-center text-blue-600 hover:text-blue-800">
                Acessar Contas a Receber →
              </a>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center">
                <TrendingUp className="h-5 w-5 mr-2 text-purple-600" />
                Fluxo de Caixa
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 mb-4">Acompanhe fluxo de caixa</p>
              <a href="/fi/cashflow" className="inline-flex items-center text-blue-600 hover:text-blue-800">
                Acessar Fluxo de Caixa →
              </a>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

export const dynamic = 'force-dynamic'