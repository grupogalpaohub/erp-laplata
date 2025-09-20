import { supabaseServer } from '@/src/lib/supabase/server'
import { getTenantId } from '@/src/lib/auth'
import { getMaterialTypes, getMaterialClassifications, getVendors } from '@/src/lib/data'
import { redirect } from 'next/navigation'

async function createMaterial(formData: FormData) {
  'use server'
  
  const supabase = supabaseServer()
  const tenantId = await getTenantId()

  const materialData = {
    tenant_id: tenantId,
    mm_material: formData.get('mm_material') as string,
    mm_comercial: formData.get('mm_comercial') as string,
    mm_desc: formData.get('mm_desc') as string,
    mm_mat_type: formData.get('mm_mat_type') as string,
    mm_mat_class: formData.get('mm_mat_class') as string,
    mm_price_cents: parseInt(formData.get('mm_price_cents') as string) * 100, // Convert to cents
    barcode: formData.get('barcode') as string,
    weight_grams: formData.get('weight_grams') ? parseInt(formData.get('weight_grams') as string) : null,
    status: 'active'
  }

  try {
    const { error } = await supabase
      .from('mm_material')
      .insert([materialData])

    if (error) {
      console.error('Error creating material:', error)
      return
    }

    redirect('/mm/catalog')
  } catch (error) {
    console.error('Error creating material:', error)
  }
}

export default async function NewMaterialPage() {
  const [materialTypes, materialClassifications, vendors] = await Promise.all([
    getMaterialTypes(),
    getMaterialClassifications(),
    getVendors()
  ])

  return (
    <div className="p-6">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">Novo Material</h1>
        
        <form action={createMaterial} className="space-y-6">
          <div className="bg-white shadow rounded-lg p-6">
            <div className="grid grid-cols-1 gap-6">
              <div>
                <label htmlFor="mm_material" className="block text-sm font-medium text-gray-700">
                  Código do Material *
                </label>
                <input
                  type="text"
                  name="mm_material"
                  id="mm_material"
                  required
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  placeholder="Ex: MAT-001"
                />
              </div>

              <div>
                <label htmlFor="mm_comercial" className="block text-sm font-medium text-gray-700">
                  Nome Comercial
                </label>
                <input
                  type="text"
                  name="mm_comercial"
                  id="mm_comercial"
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  placeholder="Ex: Brinco de Prata"
                />
              </div>

              <div>
                <label htmlFor="mm_desc" className="block text-sm font-medium text-gray-700">
                  Descrição *
                </label>
                <textarea
                  name="mm_desc"
                  id="mm_desc"
                  rows={3}
                  required
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  placeholder="Descrição detalhada do material"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="mm_mat_type" className="block text-sm font-medium text-gray-700">
                    Tipo de Material *
                  </label>
                  <select
                    name="mm_mat_type"
                    id="mm_mat_type"
                    required
                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  >
                    <option value="">Selecione...</option>
                    {materialTypes.map((type) => (
                      <option key={type.category} value={type.category}>
                        {type.category}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label htmlFor="mm_mat_class" className="block text-sm font-medium text-gray-700">
                    Classificação *
                  </label>
                  <select
                    name="mm_mat_class"
                    id="mm_mat_class"
                    required
                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  >
                    <option value="">Selecione...</option>
                    {materialClassifications.map((classification) => (
                      <option key={classification.classification} value={classification.classification}>
                        {classification.classification}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="mm_price_cents" className="block text-sm font-medium text-gray-700">
                    Preço (R$)
                  </label>
                  <input
                    type="number"
                    name="mm_price_cents"
                    id="mm_price_cents"
                    step="0.01"
                    min="0"
                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    placeholder="0.00"
                  />
                </div>

                <div>
                  <label htmlFor="weight_grams" className="block text-sm font-medium text-gray-700">
                    Peso (gramas)
                  </label>
                  <input
                    type="number"
                    name="weight_grams"
                    id="weight_grams"
                    min="0"
                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    placeholder="0"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="barcode" className="block text-sm font-medium text-gray-700">
                  Código de Barras
                </label>
                <input
                  type="text"
                  name="barcode"
                  id="barcode"
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  placeholder="Ex: 7891234567890"
                />
              </div>
            </div>
          </div>

          <div className="flex justify-end space-x-3">
            <a
              href="/mm/catalog"
              className="bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Cancelar
            </a>
            <button
              type="submit"
              className="bg-blue-600 py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Salvar Material
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}