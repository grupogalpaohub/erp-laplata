import Link from 'next/link'
import { CheckCircle, XCircle } from 'lucide-react'
import { formatBRL } from '@/lib/money'
import { supabaseServerReadOnly } from '@/lib/supabase/server-readonly'
import ExportCSVButton from './ExportCSVButton'

type Material = {
  mm_material: string
  mm_comercial: string | null
  mm_desc: string
  mm_mat_type: string | null
  mm_mat_class: string | null
  mm_price_cents: number | null
  mm_purchase_price_cents: number | null
  mm_pur_link: string | null
  commercial_name: string | null
  lead_time_days: number | null
  mm_vendor_id: string | null
  status: string | null
  mm_vendor?: { vendor_name: string }
}

export const dynamic = 'force-dynamic'

async function fetchMaterials(): Promise<Material[]> {
  const supabase = supabaseServerReadOnly()
  
  // Obter tenant_id da sessão
  const { data: { session } } = await supabase.auth.getSession()
  const tenant_id = session?.user?.user_metadata?.tenant_id || 'LaplataLunaria'
  
  const { data, error } = await supabase
    .from('mm_material')
    .select(`
      mm_material,
      mm_comercial,
      mm_desc,
      mm_mat_type,
      mm_mat_class,
      mm_price_cents,
      mm_purchase_price_cents,
      mm_pur_link,
      commercial_name,
      lead_time_days,
      mm_vendor_id,
      status
    `)
    .eq('tenant_id', tenant_id)
    .order('mm_material', { ascending: true })
    .limit(100)

  if (error) {
    console.error('Erro ao buscar materiais:', error)
    throw new Error('Erro ao carregar materiais')
  }

  return data || []
}

export default async function CatalogoMateriais({ searchParams }: { searchParams: { success?: string; error?: string } }) {
  let materials: Material[] = []
  let error: string | null = null

  try {
    materials = await fetchMaterials()
  } catch (err) {
    console.error('Erro ao carregar materiais:', err)
    error = 'Erro interno do servidor'
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-fiori-primary mb-4">Catálogo de Materiais</h1>
        <p className="text-xl text-fiori-secondary mb-2">Gerencie materiais e fornecedores</p>
        <p className="text-lg text-fiori-muted">Visualize e gerencie todos os materiais cadastrados</p>
      </div>

      {/* Success Message */}
      {searchParams.success && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4 flex items-center gap-3">
          <CheckCircle className="w-5 h-5 text-green-600" />
          <p className="text-green-800 font-medium">{searchParams.success}</p>
        </div>
      )}

      {/* Error Message */}
      {(searchParams.error || error) && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-center gap-3">
          <XCircle className="w-5 h-5 text-red-600" />
          <p className="text-red-800 font-medium">{searchParams.error || error}</p>
        </div>
      )}

      {/* Actions */}
      <div className="flex justify-center gap-4 mb-8">
        <Link href="/mm/materials/new" className="btn-fiori-primary">Novo Material</Link>
        <ExportCSVButton materiais={materials} />
      </div>

      {materials.length === 0 ? (
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
                  <th>Preço Compra (R$)</th>
                  <th>Preço Venda (R$)</th>
                  <th>Fornecedor</th>
                  <th>Link de Compra</th>
                  <th>Status</th>
                  <th>Lead Time</th>
                  <th>Ações</th>
                </tr>
              </thead>
              <tbody>
                {(materials ?? []).map((material) => (
                  <tr key={material.mm_material}>
                    <td className="font-mono text-sm font-medium text-blue-600">{material.mm_material}</td>
                    <td>
                      {material.mm_comercial || material.commercial_name || "-"}
                    </td>
                    <td className="max-w-xs truncate">{material.mm_desc}</td>
                    <td>{material.mm_mat_type || "-"}</td>
                    <td>{material.mm_mat_class || "-"}</td>
                    <td className="text-right font-medium">
                      {material.mm_purchase_price_cents != null ? formatBRL(material.mm_purchase_price_cents) : "-"}
                    </td>
                    <td className="text-right font-medium">
                      {material.mm_price_cents != null ? formatBRL(material.mm_price_cents) : "-"}
                    </td>
                    <td>
                      {(material.mm_vendor?.vendor_name ?? material.mm_vendor_id ?? "-")}
                    </td>
                    <td>
                      {material.mm_pur_link ? (
                        <a 
                          href={material.mm_pur_link} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:text-blue-800 underline text-sm"
                        >
                          Ver Produto
                        </a>
                      ) : "-"}
                    </td>
                    <td>
                      <span className={`badge-fiori ${
                        material.status === 'active' ? 'badge-fiori-success' : 
                        material.status === 'inactive' ? 'badge-fiori-warning' : 
                        'badge-fiori-error'
                      }`}>
                        {material.status || "-"}
                      </span>
                    </td>
                    <td className="text-right">
                      {material.lead_time_days ? `${material.lead_time_days} dias` : "-"}
                    </td>
                    <td>
                      <div className="flex gap-2">
                        <Link 
                          href={`/mm/materials/${material.mm_material}/edit`}
                          className="btn-fiori-outline btn-sm"
                        >
                          Editar
                        </Link>
                      </div>
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
