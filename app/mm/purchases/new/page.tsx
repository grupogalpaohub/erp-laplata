'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import NewPOClient from './NewPOClient'

type Vendor = {
  vendor_id: string
  vendor_name: string
}

type Material = {
  mm_material: string
  mm_comercial: string | null
  mm_desc: string
  mm_purchase_price_cents: number | null
}

export default function NewPOPage() {
  const [vendors, setVendors] = useState<Vendor[]>([])
  const [materials, setMaterials] = useState<Material[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const loadData = async () => {
      try {
        const [vendorsRes, materialsRes] = await Promise.all([
          fetch('/api/mm/vendors'),
          fetch('/api/mm/materials')
        ])

        if (vendorsRes.ok) {
          const vendorsData = await vendorsRes.json()
          setVendors(vendorsData)
        }

        if (materialsRes.ok) {
          const materialsData = await materialsRes.json()
          setMaterials(materialsData)
        }
      } catch (err) {
        console.error('Erro ao carregar dados:', err)
        setError('Erro ao carregar dados iniciais')
      } finally {
        setLoading(false)
      }
    }

    loadData()
  }, [])

  if (loading) {
    return (
      <div className="space-y-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-fiori-primary mb-4">Criar Pedido de Compras</h1>
          <p className="text-xl text-fiori-secondary mb-2">Carregando...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-fiori-primary mb-4">Criar Pedido de Compras</h1>
        <p className="text-xl text-fiori-secondary mb-2">Gerar novo pedido de compras</p>
        <p className="text-lg text-fiori-muted">Selecione fornecedor e materiais para criar o pedido</p>
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-800 font-medium">{error}</p>
        </div>
      )}

      {/* Back Button */}
      <div className="flex justify-center">
        <Link href="/mm/purchases" className="btn-fiori-outline">Voltar</Link>
      </div>

      {/* Client Component */}
      <NewPOClient vendors={vendors} materials={materials} />
    </div>
  )
}
