export const dynamic = 'force-dynamic'
export const revalidate = 0
import { createSupabaseServerClient } from '@/lib/supabaseServer'
import { getTenantId } from '@/lib/auth'
import Link from 'next/link'

// Função para exportar CSV
function exportToCSV(materiais: Material[]) {
  const headers = [
    'SKU',
    'Nome Comercial', 
    'Descrição',
    'Tipo',
    'Classe',
    'Preço Venda (R$)',
    'Preço Compra (R$)',
    'Fornecedor',
    'Status',
    'Lead Time (dias)',
    'Link Catálogo'
  ]
  
  const csvContent = [
    headers.join(','),
    ...materiais.map(material => [
      material.mm_material,
      `"${(material.mm_comercial || material.commercial_name || '').replace(/"/g, '""')}"`,
      `"${material.mm_desc.replace(/"/g, '""')}"`,
      material.mm_mat_type || '',
      material.mm_mat_class || '',
      material.mm_price_cents ? (material.mm_price_cents / 100).toFixed(2) : '',
      material.purchase_price_cents ? (material.purchase_price_cents / 100).toFixed(2) : '',
      `"${(material.mm_vendor?.[0]?.vendor_name ?? material.mm_vendor_id ?? '').replace(/"/g, '""')}"`,
      material.status || 'active',
      material.lead_time_days || '',
      material.catalog_url || ''
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

type Material = {
  mm_material: string
  mm_comercial: string | null
  mm_desc: string
  mm_mat_type: string | null
  mm_mat_class: string | null
  mm_price_cents: number | null
  purchase_price_cents: number | null
  catalog_url: string | null
  commercial_name: string | null
  lead_time_days: number | null
  mm_vendor_id: string | null
  status: string | null
  mm_vendor?: { vendor_name: string }[]
}

export default async function CatalogoMateriais() {
  const supabase = createSupabaseServerClient()
  const tenantId = await getTenantId()

          const { data, error } = await supabase
            .from('mm_material')
            .select(`
              mm_material, 
              mm_comercial, 
              mm_desc, 
              mm_mat_type, 
              mm_mat_class, 
              mm_price_cents, 
              purchase_price_cents,
              catalog_url,
              commercial_name, 
              lead_time_days, 
              mm_vendor_id, 
              status,
              mm_vendor!left(vendor_name)
            `)
            .eq('tenant_id', tenantId)
            .order('mm_material', { ascending: true })
  
  console.log('[catalog] query result:', { data, error })

  if (error) {
    return (
      <main className="mx-auto max-w-7xl px-4 py-6 space-y-6">
        <div>
          <h1 className="text-2xl font-semibold">Catálogo de Materiais</h1>
          <p className="text-gray-500 mt-1">Gerencie materiais e fornecedores</p>
        </div>
        <div className="alert-fiori-danger">
          Erro ao carregar materiais: {error.message}
        </div>
      </main>
    )
  }

  const materiais = (data ?? []) as Material[]

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-fiori-primary mb-4">Catálogo de Materiais</h1>
        <p className="text-xl text-fiori-secondary mb-2">Gerencie materiais e fornecedores</p>
        <p className="text-lg text-fiori-muted">Visualize e gerencie todos os materiais cadastrados</p>
      </div>

      {/* Actions */}
      <div className="flex justify-center gap-4 mb-8">
        <Link href="/mm/materials/new" className="btn-fiori-primary">Novo Material</Link>
        <button 
          onClick={() => exportToCSV(materiais)}
          className="btn-fiori-outline"
        >
          Exportar CSV
        </button>
      </div>

      {materiais.length === 0 ? (
        <div className="card-fiori text-center py-12">
          <div className="text-fiori-secondary text-lg">Nenhum material encontrado.</div>
          <Link href="/mm/materials/new" className="btn-fiori-primary mt-4 inline-block">Criar Primeiro Material</Link>
        </div>
      ) : (
        <div className="card-fiori">
          <div className="overflow-x-auto">
            <table className="table-fiori">
              <thead>
                <tr>
                  <th>SKU</th>
                  <th>Nome Comercial</th>
                  <th>Descrição</th>
                  <th>Tipo</th>
                  <th>Classe</th>
                  <th>Preço Venda (R$)</th>
                  <th>Preço Compra (R$)</th>
                  <th>Fornecedor</th>
                  <th>Status</th>
                  <th>Lead Time</th>
                  <th>Link Catálogo</th>
                </tr>
              </thead>
              <tbody>
                {materiais.map((material) => (
                  <tr key={material.mm_material}>
                    <td className="font-mono text-sm font-medium text-blue-600">{material.mm_material}</td>
                    <td>
                      {material.mm_comercial || material.commercial_name || "-"}
                    </td>
                    <td className="max-w-xs truncate">{material.mm_desc}</td>
                    <td>{material.mm_mat_type || "-"}</td>
                    <td>{material.mm_mat_class || "-"}</td>
                    <td className="text-right font-medium">
                      {material.mm_price_cents != null ? `R$ ${(material.mm_price_cents / 100).toFixed(2)}` : "-"}
                    </td>
                    <td className="text-right font-medium">
                      {material.purchase_price_cents != null ? `R$ ${(material.purchase_price_cents / 100).toFixed(2)}` : "-"}
                    </td>
                    <td>
                      {(material.mm_vendor?.[0]?.vendor_name ?? material.mm_vendor_id ?? "-")}
                    </td>
                    <td>
                      <span className={`badge-fiori ${
                        (material.status ?? 'active') === 'active'
                          ? 'badge-fiori-success'
                          : 'badge-fiori-danger'
                      }`}>
                        {material.status ?? 'active'}
                      </span>
                    </td>
                    <td className="text-right">
                      {material.lead_time_days != null ? `${material.lead_time_days} dias` : "-"}
                    </td>
                    <td>
                      {material.catalog_url ? (
                        <a 
                          href={material.catalog_url} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:text-blue-800 underline text-sm"
                        >
                          Ver
                        </a>
                      ) : "-"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  )
}
