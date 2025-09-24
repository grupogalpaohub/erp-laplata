'use client'

import { formatBRL } from '@/lib/money'

interface Vendor {
  vendor_id: string
  vendor_name: string
  email: string
  telefone: string
  cidade: string
  estado: string
  contact_person: string
  address: string
  city: string
  state: string
  zip_code: string
  country: string
  tax_id: string
  payment_terms: number
  rating: string
  status: string
  created_at: string
  total_movimentado?: number
}

interface ExportCSVButtonProps {
  vendors: Vendor[]
}

export default function ExportCSVButton({ vendors }: ExportCSVButtonProps) {
  const exportToCSV = () => {
    const headers = [
      'ID',
      'Nome',
      'Documento',
      'Contato',
      'Telefone',
      'Cidade/UF',
      'Payment Terms',
      'Status',
      'Total Movimentado'
    ]
    
    const csvContent = [
      headers.join(','),
      ...vendors.map(vendor => [
        vendor.vendor_id,
        `"${vendor.vendor_name.replace(/"/g, '""')}"`,
        vendor.tax_id || '',
        `"${(vendor.contact_person || vendor.email || '').replace(/"/g, '""')}"`,
        vendor.telefone || '',
        `"${(vendor.cidade && vendor.estado 
          ? `${vendor.cidade}/${vendor.estado}` 
          : vendor.city && vendor.state 
          ? `${vendor.city}/${vendor.state}` 
          : '').replace(/"/g, '""')}"`,
        vendor.payment_terms ? `${vendor.payment_terms} dias` : '',
        vendor.status === 'active' ? 'Ativo' : 'Inativo',
        formatBRL(vendor.total_movimentado || 0)
      ].join(','))
    ].join('\n')
    
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    const link = document.createElement('a')
    const url = URL.createObjectURL(blob)
    link.setAttribute('href', url)
    link.setAttribute('download', `fornecedores_${new Date().toISOString().split('T')[0]}.csv`)
    link.style.visibility = 'hidden'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  return (
    <button 
      onClick={exportToCSV}
      className="btn-fiori-outline flex items-center gap-2"
    >
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
      </svg>
      Exportar CSV
    </button>
  )
}
