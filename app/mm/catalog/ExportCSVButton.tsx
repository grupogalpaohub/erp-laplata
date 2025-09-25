'use client'

import { formatBRL } from '@/lib/money'

interface Material {
  mm_material: string
  mm_comercial: string | null
  mm_desc: string
  mm_mat_type: string | null
  mm_mat_class: string | null
  mm_price_cents: number | null
  commercial_name: string | null
  lead_time_days: number | null
  mm_vendor_id: string | null
  status: string | null
  mm_vendor?: { vendor_name: string }[]
}

interface ExportCSVButtonProps {
  materiais: Material[]
}

export default function ExportCSVButton({ materiais }: ExportCSVButtonProps) {
  const exportToCSV = () => {
    const headers = [
      'SKU',
      'Nome Comercial', 
      'Descrição',
      'Tipo',
      'Classe',
      'Preço Venda (R$)',
      'Fornecedor',
      'Status',
      'Lead Time (dias)'
    ]
    
    const csvContent = [
      headers.join(','),
      ...materiais.map(material => [
        material.mm_material,
        `"${(material.mm_comercial || material.commercial_name || '').replace(/"/g, '""')}"`,
        `"${material.mm_desc.replace(/"/g, '""')}"`,
        material.mm_mat_type || '',
        material.mm_mat_class || '',
        material.mm_price_cents ? formatBRL(material.mm_price_cents ) : '',
        `"${(material.mm_vendor?.[0]?.vendor_name ?? material.mm_vendor_id ?? '').replace(/"/g, '""')}"`,
        material.status || 'active',
        material.lead_time_days || ''
      ].join(','))
    ].join('\n')
    
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    const link = document.createElement('a')
    const url = URL.createObjectURL(blob)
    link.setAttribute('href', url)
    link.setAttribute('download', `materiais_${new Date().toISOString().split('T')[0]}.csv`)
    link.style.visibility = 'hidden'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  return (
    <button 
      onClick={exportToCSV}
      className="btn-fiori-outline"
    >
      Exportar CSV
    </button>
  )
}


