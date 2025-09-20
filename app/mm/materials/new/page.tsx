export const dynamic = 'force-dynamic'
export const revalidate = 0
import { supabaseServer } from '@/src/lib/supabase/server'
import { getTenantId } from '@/src/lib/auth'
import { getVendors } from '@/src/lib/data'
import { redirect } from 'next/navigation'
import Link from 'next/link'

async function createMaterial(formData: FormData) {
  'use server'
  
  const supabase = supabaseServer()
  const tenantId = await getTenantId()

  const mm_mat_type = formData.get('mm_mat_type') as string
  
  // Validar se o tipo é obrigatório
  if (!mm_mat_type) {
    throw new Error('Tipo de material é obrigatório')
  }

  const materialData = {
    tenant_id: tenantId,
    // mm_material será gerado automaticamente pelo trigger
    mm_comercial: formData.get('mm_comercial') as string,
    mm_desc: formData.get('mm_desc') as string,
    mm_mat_type: mm_mat_type,
    mm_mat_class: formData.get('mm_mat_class') as string,
    mm_vendor_id: formData.get('mm_vendor_id') as string,
    purchase_price_cents: Math.round(parseFloat(formData.get('purchase_price_cents') as string) * 100),
    sale_price_cents: Math.round(parseFloat(formData.get('sale_price_cents') as string) * 100),
    barcode: formData.get('barcode') as string,
    weight_grams: formData.get('weight_grams') ? parseInt(formData.get('weight_grams') as string) : null,
    lead_time_days: formData.get('lead_time_days') ? parseInt(formData.get('lead_time_days') as string) : null,
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
  const [vendors] = await Promise.all([
    getVendors()
  ])

  // Valores fixos para tipos e classificações
  const materialTypes = [
    { type: 'brinco', name: 'Brinco' },
    { type: 'gargantilha', name: 'Gargantilha' },
    { type: 'choker', name: 'Choker' },
    { type: 'pulseira', name: 'Pulseira' },
    { type: 'kit', name: 'Kit' }
  ]

  const materialClassifications = [
    { classification: 'acessorio', name: 'Acessório' },
    { classification: 'joia', name: 'Joia' },
    { classification: 'bijuteria', name: 'Bijuteria' },
    { classification: 'semi-joia', name: 'Semi-joia' }
  ]

  // Estilo consistente para campos
  const fieldStyle = "mt-1 block w-full bg-white border border-gray-300 rounded-lg px-3 py-2 text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
  const labelStyle = "block text-sm font-medium text-gray-700 mb-2"

  return (
    <div className="mx-auto max-w-4xl px-4 py-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Novo Material</h1>
          <p className="text-gray-500 mt-1">Criar novo material no sistema</p>
        </div>
        <Link href="/mm/catalog" className="px-3 py-2 rounded border">
          Voltar para Catálogo
        </Link>
      </div>
        
      <form action={createMaterial} className="space-y-6">
        <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-lg">
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
                  <option key={type.type} value={type.type}>
                    {type.name}
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
                    <option key={classification.classification} value={classification.classification}>
                      {classification.name}
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
                <label htmlFor="purchase_price_cents" className={labelStyle}>
                  Preço de Compras (R$) *
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

              <div>
                <label htmlFor="sale_price_cents" className={labelStyle}>
                  Preço de Vendas (R$) *
                </label>
                <input
                  type="number"
                  name="sale_price_cents"
                  id="sale_price_cents"
                  step="0.01"
                  min="0"
                  required
                  className={fieldStyle}
                  placeholder="0.00"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="weight_grams" className={labelStyle}>
                  Peso (gramas)
                </label>
                <input
                  type="number"
                  name="weight_grams"
                  id="weight_grams"
                  min="0"
                  className={fieldStyle}
                  placeholder="0"
                />
              </div>

              <div>
                <label htmlFor="lead_time_days" className={labelStyle}>
                  Lead Time (dias)
                </label>
                <input
                  type="number"
                  name="lead_time_days"
                  id="lead_time_days"
                  min="0"
                  className={fieldStyle}
                  placeholder="0"
                />
              </div>
            </div>

            <div>
              <label htmlFor="barcode" className={labelStyle}>
                Código de Barras
              </label>
              <input
                type="text"
                name="barcode"
                id="barcode"
                className={fieldStyle}
                placeholder="Ex: 7891234567890"
              />
            </div>
          </div>
        </div>

        <div className="flex justify-end space-x-3 pt-6 border-t border-gray-200">
          <Link
            href="/mm/catalog"
            className="px-6 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
          >
            Cancelar
          </Link>
          <button
            type="submit"
            className="px-6 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
          >
            Salvar Material
          </button>
        </div>
      </form>
    </div>
  )
}