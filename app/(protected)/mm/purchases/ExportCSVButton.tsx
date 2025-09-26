'use client'

import { formatBRL } from '@/lib/money'

interface PO {
  mm_order: string
  vendor_id: string
  po_date: string
  status: string
  total_amount: number
}

interface ExportCSVButtonProps {
  pedidos: PO[]
}

export default function ExportCSVButton({ pedidos }: ExportCSVButtonProps) {
  const exportToCSV = () => {
    const headers = [
      'Pedido',
      'Fornecedor',
      'Data',
      'Status',
      'Total (R$)'
    ]
    
    const csvContent = [
      headers.join(','),
      ...pedidos.map(po => [
        po.mm_order,
        po.vendor_id,
        new Date(po.po_date).toLocaleDateString('pt-BR'),
        po.status,
        formatBRL(po.total_amount )
      ].join(','))
    ].join('\n')
    
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    const link = document.createElement('a')
    const url = URL.createObjectURL(blob)
    link.setAttribute('href', url)
    link.setAttribute('download', `pedidos_compras_${new Date().toISOString().split('T')[0]}.csv`)
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


