import Link from 'next/link'
import { redirect } from 'next/navigation'
import { ArrowLeft, Save, X } from 'lucide-react'
import MaterialTypeSelect from '@/components/MaterialTypeSelect'
import MaterialClassSelect from '@/components/MaterialClassSelect'
import { formatBRL } from '@/lib/money'
import { getVendors, updateMaterial } from '@/app/(protected)/mm/_actions'
import { getSupabaseServerClient } from '@/lib/supabase/server'
import { requireSession } from '@/lib/auth/requireSession'

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
  await requireSession()
  
  // Carregar dados iniciais via SSR
  const [material, vendors] = await Promise.all([
    getMaterial(params.material_id),
    getVendors()
  ])

  async function getMaterial(material_id: string): Promise<Material | null> {
    const supabase = getSupabaseServerClient()
    
    const { data, error } = await supabase
      .from("mm_material")
      .select("*")
      .eq("mm_material", material_id)
      .single()

    if (error) {
      console.error("Erro ao buscar material:", error)
      return null
    }

    return data
  }

  async function handleSubmit(formData: FormData) {
    'use server'
    
    try {
      await updateMaterial(params.material_id, formData)
      redirect(`/mm/catalog?success=Material ${params.material_id} atualizado com sucesso`)
    } catch (error) {
      console.error('Erro ao atualizar material:', error)
      redirect(`/mm/materials/${params.material_id}/edit?error=${encodeURIComponent(error instanceof Error ? error.message : 'Erro interno do servidor')}`)
    }
  }

  if (!material) {
    return (
      <div className="space-y-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-fiori-primary mb-4">Material Não Encontrado</h1>
          <p className="text-xl text-fiori-secondary mb-2">O material solicitado não foi encontrado</p>
          <Link href="/mm/catalog" className="btn-fiori-primary mt-4 inline-block">
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

      <form action={handleSubmit} className="form-fiori max-w-4xl mx-auto">
        <input type="hidden" name="mm_material" value={material.mm_material} />
        
        <div className="card-fiori mb-8">
          <h2 className="text-xl font-semibold mb-4">Informações Básicas</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="label-fiori">SKU *</label>
              <input 
                type="text" 
                disabled 
                className="input-fiori bg-gray-50" 
                value={material.mm_material}
              />
              <p className="text-sm text-fiori-muted mt-1">SKU não pode ser alterado</p>
            </div>
            
            <div>
              <label htmlFor="mm_comercial" className="label-fiori">Nome Comercial</label>
              <input
                type="text"
                name="mm_comercial"
                id="mm_comercial"
                className="input-fiori"
                placeholder="Nome comercial do produto"
                defaultValue={material.mm_comercial || ''}
              />
            </div>
            
            <div className="md:col-span-2">
              <label htmlFor="mm_desc" className="label-fiori">Descrição *</label>
              <textarea
                name="mm_desc"
                id="mm_desc"
                required
                rows={3}
                className="input-fiori"
                placeholder="Descrição detalhada do material"
                defaultValue={material.mm_desc}
              />
            </div>
            
            <div>
              <label htmlFor="mm_mat_type" className="label-fiori">Tipo de Material</label>
              <MaterialTypeSelect
                name="mm_mat_type"
                className="input-fiori"
                defaultValue={material.mm_mat_type || ''}
              />
            </div>
            
            <div>
              <label htmlFor="mm_mat_class" className="label-fiori">Classe do Material</label>
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
              <label htmlFor="mm_price" className="label-fiori">Preço de Venda (R$)</label>
              <input
                type="number"
                name="mm_price"
                id="mm_price"
                step="0.01"
                min="0"
                className="input-fiori"
                placeholder="0.00"
                defaultValue={material.mm_price_cents ? formatBRL(material.mm_price_cents) : ''}
              />
              <p className="text-sm text-fiori-muted mt-1">Valor em reais (ex: 25.50)</p>
            </div>
            
            <div>
              <label htmlFor="mm_purchase_price" className="label-fiori">Preço de Compra (R$)</label>
              <input
                type="number"
                name="mm_purchase_price"
                id="mm_purchase_price"
                step="0.01"
                min="0"
                className="input-fiori"
                placeholder="0.00"
                defaultValue={material.mm_purchase_price_cents ? formatBRL(material.mm_purchase_price_cents) : ''}
              />
              <p className="text-sm text-fiori-muted mt-1">Valor em reais (ex: 15.00)</p>
            </div>
            
            <div>
              <label htmlFor="mm_vendor_id" className="label-fiori">Fornecedor</label>
              <select name="mm_vendor_id" className="input-fiori">
                <option value="">Selecione um fornecedor...</option>
                {vendors.map((vendor) => (
                  <option 
                    key={vendor.vendor_id} 
                    value={vendor.vendor_id}
                    selected={vendor.vendor_id === material.mm_vendor_id}
                  >
                    {vendor.vendor_name}
                  </option>
                ))}
              </select>
            </div>
            
            <div>
              <label htmlFor="lead_time_days" className="label-fiori">Lead Time (dias)</label>
              <input
                type="number"
                name="lead_time_days"
                id="lead_time_days"
                min="0"
                className="input-fiori"
                placeholder="Ex: 15"
                defaultValue={material.lead_time_days || ''}
              />
            </div>
            
            <div className="md:col-span-2">
              <label htmlFor="mm_pur_link" className="label-fiori">Link de Compra</label>
              <input
                type="url"
                name="mm_pur_link"
                id="mm_pur_link"
                className="input-fiori"
                placeholder="https://exemplo.com/produto"
                defaultValue={material.mm_pur_link || ''}
              />
            </div>
          </div>
        </div>

        <div className="card-fiori mb-8">
          <h2 className="text-xl font-semibold mb-4">Status</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="status" className="label-fiori">Status</label>
              <select name="status" className="input-fiori">
                <option value="active" selected={material.status === 'active'}>Ativo</option>
                <option value="inactive" selected={material.status === 'inactive'}>Inativo</option>
                <option value="discontinued" selected={material.status === 'discontinued'}>Descontinuado</option>
              </select>
            </div>
            
            <div>
              <label htmlFor="commercial_name" className="label-fiori">Nome Comercial Alternativo</label>
              <input
                type="text"
                name="commercial_name"
                id="commercial_name"
                className="input-fiori"
                placeholder="Nome alternativo para exibição"
                defaultValue={material.commercial_name || ''}
              />
            </div>
          </div>
        </div>

        <div className="flex justify-center gap-4">
          <Link href="/mm/catalog" className="btn-fiori-outline flex items-center gap-2">
            <X className="w-4 h-4" />
            Cancelar
          </Link>
          <button 
            type="submit" 
            className="btn-fiori-primary flex items-center gap-2"
          >
            <Save className="w-4 h-4" />
            Salvar Alterações
          </button>
        </div>
      </form>
    </div>
  )
}