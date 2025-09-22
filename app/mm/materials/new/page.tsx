export const dynamic = 'force-dynamic'
export const revalidate = 0
import { createSupabaseServerClient } from '@/lib/supabaseServer'
import { getTenantId } from '@/lib/auth'
import { getVendors } from '@/lib/data'
import { redirect } from 'next/navigation'
import Link from 'next/link'

// Buscar tipos e classificações do customizing
async function getCustomizingData() {
  const supabase = createSupabaseServerClient()
  const tenantId = await getTenantId()
  
  const { data: types } = await supabase
    .from('customizing')
    .select('value')
    .eq('tenant_id', tenantId)
    .eq('category', 'material_type')
    .order('value')
  
  const { data: classifications } = await supabase
    .from('customizing')
    .select('value')
    .eq('tenant_id', tenantId)
    .eq('category', 'material_classification')
    .order('value')
  
  return {
    types: types?.map(t => t.value) || ['Brinco', 'Cordão', 'Choker', 'Gargantilha', 'Anel', 'Pulseira'],
    classifications: classifications?.map(c => c.value) || ['Elementar', 'Amuleto', 'Protetor', 'Decoração']
  }
}

async function createMaterial(formData: FormData) {
  'use server'
  
  const supabase = createSupabaseServerClient()
  const tenantId = await getTenantId()

  const mm_mat_type = formData.get('mm_mat_type') as string
  
  // Validar se o tipo é obrigatório
  if (!mm_mat_type) {
    throw new Error('Tipo de material é obrigatório')
  }

  const lead_time_days = formData.get('lead_time_days') as string
  
  // Validar lead time obrigatório
  if (!lead_time_days || parseInt(lead_time_days) < 0) {
    throw new Error('Lead Time é obrigatório e deve ser maior ou igual a 0')
  }

  const materialData = {
    tenant_id: tenantId,
    // mm_material será gerado automaticamente pelo trigger
    mm_comercial: formData.get('mm_comercial') as string,
    mm_desc: formData.get('mm_desc') as string,
    mm_mat_type: mm_mat_type,
    mm_mat_class: formData.get('mm_mat_class') as string,
    mm_vendor_id: formData.get('mm_vendor_id') as string,
    mm_price_cents: Math.round(parseFloat(formData.get('mm_price_cents') as string) * 100),
    purchase_price_cents: Math.round(parseFloat(formData.get('purchase_price_cents') as string) * 100),
    catalog_url: formData.get('catalog_url') as string,
    lead_time_days: parseInt(lead_time_days),
    status: 'active'
  }

  try {
    const { data, error } = await supabase
      .from('mm_material')
      .insert([materialData])
      .select('mm_material')
      .single()

    if (error) {
      console.error('Error creating material:', error)
      throw new Error(error.message)
    }

    // Redirecionar com mensagem de sucesso mostrando o ID gerado
    redirect(`/mm/catalog?success=Material ${data.mm_material} criado com sucesso`)
  } catch (error) {
    console.error('Error creating material:', error)
    throw error
  }
}

export default async function NewMaterialPage() {
  const [vendors, customizingData] = await Promise.all([
    getVendors(),
    getCustomizingData()
  ]) as [{ vendor_id: string; vendor_name: string; }[], { types: string[]; classifications: string[] }]

  // Usar dados do customizing
  const materialTypes = customizingData.types
  const materialClassifications = customizingData.classifications

  // Estilo consistente para campos
  const fieldStyle = "input-fiori"
  const labelStyle = "label-fiori"

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-fiori-primary mb-4">Novo Material</h1>
        <p className="text-xl text-fiori-secondary mb-2">Criar novo material no sistema</p>
        <p className="text-lg text-fiori-muted">Preencha os dados para cadastrar um novo material</p>
      </div>

      {/* Back Button */}
      <div className="flex justify-center">
        <Link href="/mm/catalog" className="btn-fiori-outline">
          Voltar para Catálogo
        </Link>
      </div>
        
      <form action={createMaterial} className="space-y-6">
        <div className="form-fiori">
          <div className="grid grid-cols-1 gap-6">
            <div>
              <label htmlFor="mm_mat_type" className={labelStyle}>
                Tipo de Material *
              </label>
              <select
                name="mm_mat_type"
                id="mm_mat_type"
                required
                className={fieldStyle}
              >
                <option value="">Selecione o tipo...</option>
                {materialTypes.map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>
              <p className="mt-1 text-sm text-gray-500">
                O ID do material será gerado automaticamente baseado no tipo selecionado
              </p>
            </div>

            <div>
              <label htmlFor="mm_comercial" className={labelStyle}>
                Nome Comercial
              </label>
              <input
                type="text"
                name="mm_comercial"
                id="mm_comercial"
                className={fieldStyle}
                placeholder="Ex: Brinco de Prata"
              />
            </div>

            <div>
              <label htmlFor="mm_desc" className={labelStyle}>
                Descrição *
              </label>
              <textarea
                name="mm_desc"
                id="mm_desc"
                rows={3}
                required
                className={fieldStyle}
                placeholder="Descrição detalhada do material"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="mm_mat_class" className={labelStyle}>
                  Classificação *
                </label>
                <select
                  name="mm_mat_class"
                  id="mm_mat_class"
                  required
                  className={fieldStyle}
                >
                  <option value="">Selecione...</option>
                  {materialClassifications.map((classification) => (
                    <option key={classification} value={classification}>
                      {classification}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label htmlFor="mm_vendor_id" className={labelStyle}>
                Fornecedor *
              </label>
              <select
                name="mm_vendor_id"
                id="mm_vendor_id"
                required
                className={fieldStyle}
              >
                <option value="">Selecione o fornecedor...</option>
                {vendors.map((vendor) => (
                  <option key={vendor.vendor_id} value={vendor.vendor_id}>
                    {vendor.vendor_name}
                  </option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="mm_price_cents" className={labelStyle}>
                  Preço de Venda (R$) *
                </label>
                <input
                  type="number"
                  name="mm_price_cents"
                  id="mm_price_cents"
                  step="0.01"
                  min="0"
                  required
                  className={fieldStyle}
                  placeholder="0.00"
                />
              </div>
              
              <div>
                <label htmlFor="purchase_price_cents" className={labelStyle}>
                  Preço de Compra (R$) *
                </label>
                <input
                  type="number"
                  name="purchase_price_cents"
                  id="purchase_price_cents"
                  step="0.01"
                  min="0"
                  required
                  className={fieldStyle}
                  placeholder="0.00"
                />
              </div>
            </div>

            <div>
              <label htmlFor="lead_time_days" className={labelStyle}>
                Lead Time (dias) *
              </label>
              <input
                type="number"
                name="lead_time_days"
                id="lead_time_days"
                min="0"
                required
                className={fieldStyle}
                placeholder="7"
              />
            </div>

            <div>
              <label htmlFor="catalog_url" className={labelStyle}>
                Link do Catálogo Online *
              </label>
              <input
                type="url"
                name="catalog_url"
                id="catalog_url"
                required
                className={fieldStyle}
                placeholder="https://fornecedor.com/produto/123"
              />
              <p className="mt-1 text-sm text-gray-500">
                URL do fornecedor para este SKU
              </p>
            </div>
          </div>
        </div>

        <div className="flex justify-end space-x-3 pt-6 border-t border-gray-200">
          <Link
            href="/mm/catalog"
            className="btn-fiori-outline"
          >
            Cancelar
          </Link>
          <button
            type="submit"
            className="btn-fiori-primary"
          >
            Salvar Material
          </button>
        </div>
      </form>
    </div>
  )
}
