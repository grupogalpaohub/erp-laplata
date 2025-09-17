'use client'

import { Sidebar } from '@/components/layout/Sidebar'
import { Header } from '@/components/layout/Header'
import { Dashboard } from '@/components/dashboard/Dashboard'

export default function TestPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar />
      <Header title="Test Dashboard" subtitle="Teste sem autenticação" />
      <Dashboard />
    </div>
  )
}

export const dynamic = 'force-dynamic'