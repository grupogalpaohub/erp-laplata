import { createClient } from '@supabase/supabase-js'
import { getTenantId } from '@/lib/auth'
import Link from 'next/link'
import { ArrowLeft, Save, X } from 'lucide-react'
import MaterialTypeSelect from '@/components/MaterialTypeSelect'
import MaterialClassSelect from '@/components/MaterialClassSelect'

export const dynamic = 'force-dynamic'
export const revalidate = 0

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
}

type Vendor = {
  vendor_id: string
  vendor_name: string
}

export default async function EditMaterialPage({ params }: { params: { material_id: string } }) {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )
  const tenantId = await getTenantId()

  // Buscar material específico
  const { data: material, error: materialError } = await supabase
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
    .eq('mm_material', params.material_id)
    .eq('tenant_id', tenantId)
    .single()

  // Buscar fornecedores
  const { data: vendors } = await supabase
    .from('mm_vendor')
    .select('vendor_id, vendor_name')
    .eq('tenant_id', tenantId)
    .eq('status', 'active')
    .order('vendor_name')

  if (materialError || !material) {
    return (
      <div className="space-y-8">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-fiori-primary mb-4">Material Não Encontrado</h1>
          <p className="text-xl text-fiori-secondary mb-8">O material solicitado não foi encontrado.</p>
          <Link href="/mm/catalog" className="btn-fiori-primary">
            Voltar ao Catálogo
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-fiori-primary mb-4">Editar Material</h1>
        <p className="text-xl text-fiori-secondary mb-2">Editar informações do material</p>
        <p className="text-lg text-fiori-muted">SKU: {material.mm_material}</p>
      </div>

      {/* Back Button */}
      <div className="flex justify-center">
        <Link href="/mm/catalog" className="btn-fiori-outline flex items-center gap-2">
          <ArrowLeft className="w-4 h-4" />
          Voltar ao Catálogo
        </Link>
      </div>

      {/* Form */}
      <form action="/api/mm/materials/update" method="POST" className="form-fiori max-w-4xl mx-auto">
        <input type="hidden" name="mm_material" value={material.mm_material} />
        
        <div className="card-fiori mb-8">
          <h2 className="text-xl font-semibold mb-4">Informações Básicas</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="label-fiori">SKU *</label>
              <input
                type="text"
                name="mm_material"
                value={material.mm_material}
                disabled
                className="input-fiori bg-gray-50"
              />
              <p className="text-sm text-fiori-muted mt-1">SKU não pode ser alterado</p>
            </div>
            <div>
              <label className="label-fiori">Nome Comercial</label>
              <input
                type="text"
                name="mm_comercial"
                defaultValue={material.mm_comercial || ''}
                className="input-fiori"
                placeholder="Nome comercial do produto"
              />
            </div>
            <div className="md:col-span-2">
              <label className="label-fiori">Descrição *</label>
              <textarea
                name="mm_desc"
                defaultValue={material.mm_desc}
                required
                rows={3}
                className="input-fiori"
                placeholder="Descrição detalhada do material"
              />
            </div>
            <div>
              <label className="label-fiori">Tipo de Material</label>
              <MaterialTypeSelect
                name="mm_mat_type"
                className="input-fiori"
                defaultValue={material.mm_mat_type || ''}
              />
            </div>
            <div>
              <label className="label-fiori">Classe do Material</label>
              <MaterialClassSelect
                name="mm_mat_class"
                className="input-fiori"
                defaultValue={material.mm_mat_class || ''}
              />
            </div>
          </div>
        </div>

        <div className="card-fiori mb-8">
          <h2 className="text-xl font-semibold mb-4">Preços e Fornecedor</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="label-fiori">Preço de Venda (R$)</label>
              <input
                type="number"
                name="mm_price_cents"
                step="0.01"
                min="0"
                defaultValue={material.mm_price_cents ? (material.mm_price_cents / 100).toFixed(2) : ''}
                className="input-fiori"
                placeholder="0.00"
              />
              <p className="text-sm text-fiori-muted mt-1">Valor em reais (ex: 25.50)</p>
            </div>
            <div>
              <label className="label-fiori">Preço de Compra (R$)</label>
              <input
                type="number"
                name="mm_purchase_price_cents"
                step="0.01"
                min="0"
                defaultValue={material.mm_purchase_price_cents ? (material.mm_purchase_price_cents / 10000).toFixed(2) : ''}
                className="input-fiori"
                placeholder="0.00"
              />
              <p className="text-sm text-fiori-muted mt-1">Valor em reais (ex: 15.00)</p>
            </div>
            <div>
              <label className="label-fiori">Fornecedor</label>
              <select
                name="mm_vendor_id"
                defaultValue={material.mm_vendor_id || ''}
                className="input-fiori"
              >
                <option value="">Selecione um fornecedor...</option>
                {vendors?.map((vendor) => (
                  <option key={vendor.vendor_id} value={vendor.vendor_id}>
                    {vendor.vendor_name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="label-fiori">Lead Time (dias)</label>
              <input
                type="number"
                name="lead_time_days"
                min="0"
                defaultValue={material.lead_time_days || ''}
                className="input-fiori"
                placeholder="Ex: 15"
              />
            </div>
            <div className="md:col-span-2">
              <label className="label-fiori">Link de Compra</label>
              <input
                type="url"
                name="mm_pur_link"
                defaultValue={material.mm_pur_link || ''}
                className="input-fiori"
                placeholder="https://exemplo.com/produto"
              />
            </div>
          </div>
        </div>

        <div className="card-fiori mb-8">
          <h2 className="text-xl font-semibold mb-4">Status</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="label-fiori">Status</label>
              <select
                name="status"
                defaultValue={material.status || 'active'}
                className="input-fiori"
              >
                <option value="active">Ativo</option>
                <option value="inactive">Inativo</option>
                <option value="discontinued">Descontinuado</option>
              </select>
            </div>
            <div>
              <label className="label-fiori">Nome Comercial Alternativo</label>
              <input
                type="text"
                name="commercial_name"
                defaultValue={material.commercial_name || ''}
                className="input-fiori"
                placeholder="Nome alternativo para exibição"
              />
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-center gap-4">
          <Link href="/mm/catalog" className="btn-fiori-outline flex items-center gap-2">
            <X className="w-4 h-4" />
            Cancelar
          </Link>
          <button type="submit" className="btn-fiori-primary flex items-center gap-2">
            <Save className="w-4 h-4" />
            Salvar Alterações
          </button>
        </div>
      </form>
    </div>
  )
}
