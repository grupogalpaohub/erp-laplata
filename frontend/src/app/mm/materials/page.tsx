'use client'

import { useState } from 'react'
import { DataTable } from '@/components/DataTable'
import { Button } from '@/components/ui/button'
import { Plus, Edit, Trash2, Eye } from 'lucide-react'
import { formatCurrency } from '@/lib/utils'

// Mock data - será substituído por dados reais do Supabase
const mockMaterials = [
  {
    id: 'BR-001',
    name: 'Brinco de Prata 925',
    category: 'Brinco',
    classification: 'Prata',
    price_cents: 4500,
    status: 'Ativo',
    vendor: 'SUP_00001',
    stock: 100
  },
  {
    id: 'BR-002',
    name: 'Colar de Prata 925',
    category: 'Colar',
    classification: 'Prata',
    price_cents: 3200,
    status: 'Ativo',
    vendor: 'SUP_00001',
    stock: 50
  },
  {
    id: 'BR-003',
    name: 'Anel de Prata 925',
    category: 'Anel',
    classification: 'Prata',
    price_cents: 2800,
    status: 'Ativo',
    vendor: 'SUP_00001',
    stock: 75
  }
]

const columns = [
  {
    key: 'id' as const,
    label: 'Código',
    sortable: true
  },
  {
    key: 'name' as const,
    label: 'Nome',
    sortable: true
  },
  {
    key: 'category' as const,
    label: 'Categoria',
    sortable: true
  },
  {
    key: 'classification' as const,
    label: 'Classificação',
    sortable: true
  },
  {
    key: 'price_cents' as const,
    label: 'Preço',
    render: (value: number) => formatCurrency(value),
    sortable: true
  },
  {
    key: 'stock' as const,
    label: 'Estoque',
    sortable: true
  },
  {
    key: 'status' as const,
    label: 'Status',
    sortable: true
  },
  {
    key: 'actions' as const,
    label: 'Ações',
    render: (value: any, row: any) => (
      <div className="flex space-x-2">
        <Button variant="ghost" size="sm">
          <Eye className="h-4 w-4" />
        </Button>
        <Button variant="ghost" size="sm">
          <Edit className="h-4 w-4" />
        </Button>
        <Button variant="ghost" size="sm">
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>
    )
  }
]

export default function MaterialsPage() {
  const [materials, setMaterials] = useState(mockMaterials)
  const [searchQuery, setSearchQuery] = useState('')

  const handleSearch = (query: string) => {
    setSearchQuery(query)
    // Implementar busca real aqui
  }

  const handlePageChange = (page: number) => {
    // Implementar paginação real aqui
    console.log('Page changed to:', page)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Materiais</h1>
          <p className="text-muted-foreground">
            Gestão de materiais e produtos do sistema
          </p>
        </div>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Novo Material
        </Button>
      </div>

      <DataTable
        data={materials}
        columns={columns}
        searchable
        searchPlaceholder="Pesquisar materiais..."
        onSearch={handleSearch}
        pagination={{
          page: 1,
          limit: 50,
          total: materials.length,
          onPageChange: handlePageChange
        }}
      />
    </div>
  )
}